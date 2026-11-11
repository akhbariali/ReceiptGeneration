# Architecture decision record (ADR-001)

## Context and decision
A single-owner, self-hosted, multi-business application needs reliable relational storage, transparent financial rules, and a codebase suited to iterative Codex development. Use a modular Next.js TypeScript monolith with PostgreSQL and Prisma. API endpoints share server-side cookie/JWT authentication and workspace-member verification. Data is persisted in PostgreSQL, not browser state. Explicit append-only financial posting and stock movement endpoints provide safer domain boundaries than generic CRUD.

## Boundaries
- `app/api/resources`: scoped master-data CRUD (read/create/update, no delete).
- `app/api/journal`: double-entry posting. No post-edit/delete endpoint.
- `app/api/inventory`: signed movement with nonnegative balance enforcement.
- `app/api/imports`: CSV preview staging, hashing, manual review; approved imports never auto-post.
- `app/api/approvals`: review status only, not action execution.
- `lib/finance`: exact fixed-point money math and landed-cost allocation.
- `lib/auth`: session management, authorization, audit helper.
- `components`: desktop/mobile shell, English/Persian switching (partial localization).

## Data model / migration plan
`prisma/schema.prisma` defines users, memberships, workspaces, businesses, currencies, rates, accounts, journals/lines, CRM, projects/tasks, products/warehouses/movements, trade orders, shipments, imports, documents, agents, approvals, audit logs. An initial SQL migration has not been generated in this offline environment. For local bootstrap use `prisma db push`; generate and commit reviewed initial SQL migration using Prisma migrate before production. Future schema changes require checked-in reviewed migrations.

## Security and integrity checklist
- [x] Password hash with bcrypt, secure HTTP-only SameSite cookie, signed token, credential validation.
- [x] Workspace membership required server side for API routes.
- [x] Zod schemas and foreign-key/tenant checks for generic references.
- [x] Double-entry equality enforced before posting; no mutation API for posted journals.
- [x] Nonnegative inventory policy using SERIALIZABLE transaction; concurrency retries not yet implemented.
- [x] Import SHA-256 idempotency; staged rows require review.
- [x] Basic audit records for modifying API actions.
- [ ] Production login rate limiting, CSRF origin enforcement, two-factor authentication, session revocation.
- [ ] DB-level row security; complete threat-model and penetration test.
- [ ] Financial posting transaction combined atomically with audit record; reversal workflow.
- [ ] Per-business RBAC and role-specific authorizations.
- [ ] Safe, scanned binary document storage.

## Module/dependency map
UI → authenticated API → schema validation + tenant validation → Prisma DB → PostgreSQL. Finance API additionally → fixed-point math. Approval module records decisions but intentionally never invokes tools. No external AI or paid API is required.
