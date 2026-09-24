# Architecture

## Stack

Next.js App Router
React
TypeScript
Tailwind CSS
shadcn/ui
Supabase Auth
Supabase Postgres
Supabase Storage
Supabase Realtime where appropriate
Vercel
GitHub

## Application layout

Prefer a clean modular structure:

src/
  app/
  components/
  features/
    auth/
    student/
    instructor/
    admin/
    superadmin/
    courses/
    learning/
    payments/
    certificates/
    notifications/
  lib/
    supabase/
    auth/
    permissions/
    validation/
    logging/
  server/
    actions/
    services/
  types/

supabase/
  migrations/
  seed/
  functions/

tests/
  unit/
  integration/
  e2e/

## Supabase clients

Create separate browser and server clients.

Never expose the service-role key to the browser.

Privileged server operations must use server-only code and appropriate
authorization checks.

## Authorization

Use:

1. authenticated session
2. application role/permission check
3. resource ownership check
4. RLS as database enforcement

The client UI is never the security boundary.

## Supabase Auth

Use Supabase Auth for:

- email/password
- email verification
- password recovery
- session refresh
- logout

Keep public profile/application metadata in application tables.

## Deployment

GitHub is the canonical source repository.

Vercel is connected to GitHub.

Expected flow:

developer/OpenCode changes
-> tests
-> commit
-> push to GitHub
-> GitHub integration
-> Vercel build/deploy
-> deployment verification

Production secrets are configured in Vercel, not committed to GitHub.

## Environment variables

At minimum document:

NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY (server-only)
NEXT_PUBLIC_SITE_URL

Additional provider secrets must be server-only.

## Observability

Provide structured server logging and error handling.
Prepare for an external error-monitoring provider without hardcoding a vendor.

## Performance

Prefer server components for data-heavy read views where appropriate.
Use client components only when interaction requires them.
Avoid N+1 queries.
Paginate large datasets.
Use indexes.
