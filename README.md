# Lumen LMS

Production-grade global Learning Management System — Next.js 15 + React 19 + Supabase + Vercel.

Original branding (Lumen). Not a clone of any proprietary platform.

## Stack

- Next.js 15 (App Router) + TypeScript (strict) + Tailwind CSS + shadcn/ui
- Supabase: Postgres, Auth, Storage, Realtime
- Validation: Zod
- Tests: Vitest + Testing Library + Playwright
- Deploy: GitHub → Vercel

## Quick start

```bash
cp .env.example .env.local   # fill Supabase values from Dashboard > Project Settings > API
npm ci
npm run dev                  # http://localhost:3000
```

## Supabase

- Apply migrations: `supabase db push` or `supabase migration up` (requires `supabase link`)
- Generate types: `npm run supabase:types` (needs SUPABASE_PROJECT_ID)
- Local stack: `supabase start` (optional)

### Superadmin bootstrap

1. Create the first user via normal registration (or `supabase auth` / Dashboard).
2. Run in SQL Editor (service role):
   ```sql
   select public.bootstrap_superadmin('founder@example.com');
   ```
   This succeeds only if no superadmin exists yet. After that, use the Superadmin dashboard to create admins.
3. The function also writes an audit log entry.

Never expose `SUPABASE_SERVICE_ROLE_KEY` to the browser.

## Scripts

- `npm run typecheck` — `tsc --noEmit`
- `npm run lint` / `lint:fix`
- `npm run test` / `test:watch` / `test:coverage` / `test:e2e`
- `npm run build` / `start`

## Project structure

```
src/app/            # App Router
src/components/ui/  # shadcn/ui
src/lib/supabase/   # browser/server/middleware clients
src/lib/permissions/ # roles, permissions, guards
src/lib/validation/  # zod schemas incl. env
src/types/           # Database types (generated)
supabase/migrations/ # SQL migrations (source of truth)
tests/unit/ e2e/
```

## Roadmap

See `ROADMAP.md`. Current phase: **Phase 0 — Foundation** (complete). Next: Phase 1 Auth + dashboards.

## Security

- RLS enabled on all app tables (see `supabase/migrations/*_rls.sql`)
- Service-role only on server, never in `NEXT_PUBLIC_*`
- Role checks server-side in `src/lib/permissions/guards.ts`
- Audit logs append-only

## Deployment

Push to `main` → GitHub → Vercel auto-deploy. Configure env vars in Vercel (never commit secrets). See `docs/GITHUB_VERCEL_SETUP.md`.
