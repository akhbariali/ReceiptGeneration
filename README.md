# Business OS — Full-stack foundation (v0.1)

Self-hostable, PostgreSQL-backed Next.js multi-business system. Read `docs/MASTER_SPEC.md` for the full target and `docs/IMPLEMENTATION.md` for the exact gaps. **Not a completed accounting system and not ready for public production deployment.**

## Requirements
Node.js 22+, npm, Docker with Compose.

## Local development
```bash
# Fill .env using .env.example before starting.
# Change the password and session secret before any public deployment.
# DATABASE_URL host must be localhost for local npm commands.
docker compose up -d db
npm install
npx prisma generate
npm run db:init
npm run db:seed
npm run dev
```
Visit http://localhost:3000 and log in with `ADMIN_EMAIL` / `ADMIN_PASSWORD`.

**Full Docker local setup:** run `docker compose up --build -d`. The web container automatically bootstraps the database and seeds the login account. The `DATABASE_URL` in `.env` uses `localhost` for host commands; Compose injects the `db` hostname in the web container. Docker startup runs `prisma db push` for local bootstrap only, **not a safe production migration process**. Web binds only to `127.0.0.1:3000` for safer local use. Put behind a properly configured HTTPS proxy for remote deployment, after security review.

## Local login credentials

Use `ADMIN_EMAIL` and `ADMIN_PASSWORD` from your local `.env` file to sign in at http://localhost:3000. Set real passwords and a random session secret of at least 32 characters; `.env.example` contains placeholders only.

Compose sets `SESSION_COOKIE_SECURE=false` for local HTTP. Set it to `true` when serving through HTTPS. Without an explicit setting, the application uses secure cookies in production mode.

The seed creates the admin user only if absent and does not overwrite an existing password. Changing `POSTGRES_PASSWORD` does not update an existing database volume. Keep `.env` private.

## Tests and debugging with Codex
```bash
npm test
npm run typecheck
npm run build
```
To inspect DB: `npx prisma studio`. Initial local database bootstrap uses `prisma db push` because the first checked-in SQL migration is not included. Before production, generate and review an initial migration using `npx prisma migrate dev --name init` against a fresh development database, commit `prisma/migrations/`, and use `prisma migrate deploy` in production. **Never use `db push` against production.**

## Database backups
```bash
docker compose exec -T db pg_dump -U businessos -d businessos -Fc > businessos.backup
# Restore to a new EMPTY database after verifying the backup and connection:
# cat businessos.backup | docker compose exec -T db pg_restore -U businessos -d your_empty_db --no-owner
```
Change usernames/database names if customized. Test backups before relying on them.

## Security notes
No demo business financial records are seeded. Only admin login and currency codes/workspace are seeded. Change all example values. Do not publish `.env`. JWT sessions are valid until expiration, including after user password changes; explicit revocation is not implemented. Login rate limiting and CSRF origin checks are required before external exposure. Only the developer/owner should access this environment.

## Known limitations
`docs/IMPLEMENTATION.md` contains a tested-vs-unimplemented status map. UI inputs for foreign keys currently accept IDs; use listed records or Prisma Studio to find them. CSV import supports basic unquoted CSV only. Trial balance display uses JS numbers and is **not an authoritative financial report**. AI agents are configurations only, not executors. Report counts may truncate at API's 200-row limit.
