# Implementation status and acceptance plan

## Implemented in this increment
- Local PostgreSQL Docker Compose deployment; Prisma schema, local schema bootstrap, seeded owner and currencies.
- Signed-cookie login, server-side authorization by workspace membership.
- Dashboard record counts and sidebar workspace selector.
- English/Persian direction switching; partial Persian navigation translations.
- List/create/update APIs for businesses, accounts, counterparties, opportunities, projects, tasks, products, warehouses, orders, shipments, agents. UI list/create.
- Balanced single-currency journal posting; immutable posted entries through exposed API; basic trial balance view.
- Inventory receipts/withdrawals with nonnegative stock checking; exact landed-cost allocation helper.
- Manual communication and relationship schema base; not yet full UI.
- Duplicate-detecting CSV staging and human accept/reject statuses; no financial auto-post.
- Human approval request/review ledger (status only).
- Scoped search over contacts, projects, tasks, products.
- Domain unit tests for accounting/precision/allocation/inventory balance.

## Partially implemented
- Full bilingual strings and dates/numbers; workspace scoping is implemented but custom role policies not.
- Dashboard, financial reporting, inventory, agents, CRM, commerce and imports are foundations, not feature-complete.
- CSV parsing accepts simple comma-separated lines, not quoted multi-line CSV.
- Opportunity pipeline fields exist but no transition rules or Kanban board.
- Accounting is single-currency per entry; exchange rates stored but no FX posting/consolidation.
- Orders/shipments are tracked as separate records but not linked to invoices or detailed order lines.

## Not yet implemented
- Full double-entry reversal/replacement and reconciliations, multi-currency consolidation, cash flow, P&L and balance sheet.
- AR/AP aging, ownership eliminations, invoices/payments/partner capital and project profitability.
- Shipment-level landed-cost posting and valuations, quotes, line items, inventory costing.
- File uploads, PDF/Excel extraction, imports into validated live entities, duplicate comparison UI.
- Relationship graph, Gantt, Kanban, reminders and recurring tasks.
- AI model execution, tool permissions, email/calendar sync, alerting.
- Full CRUD UI (editing and deleting), accessibility audit, E2E and integration test suites.
- Production hardening and backup automation.

## Priority Codex tasks (in order)
1. Add login rate limits, origin/CSRF checks, robust session invalidation, and tests.
2. Make audits and business mutations atomic. Add serializable inventory retry handling.
3. Add controlled accounting reversals, exchange rate validation and proper financial reporting by currency.
4. Add entity editing UI, secure business selector fields, and business-specific permissions.
5. Add integration/E2E tests against disposable PostgreSQL and browser flows.
6. Expand Persian localization and mobile UX.
7. Add CSV RFC4180 parser and separate review/commit workflow.
8. Implement remaining workflows and model relations from MASTER_SPEC.md.

## Acceptance bar
Do not deploy publicly until authorization, financial correctness, migrations and backup restoration are validated with end-to-end tests. This repository is an operational *foundation*, not the completed master specification.
