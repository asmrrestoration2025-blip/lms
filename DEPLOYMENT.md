# Deployment

## Required architecture

GitHub is the source repository.

Vercel is connected to GitHub.

Supabase hosts the database, Auth and Storage.

## Environments

Maintain at least:

- local/development
- preview
- production

## Git workflow

main = production
feature/* = feature branches
fix/* = fixes

OpenCode should:

1. inspect changes
2. run checks
3. commit logical changes
4. push to GitHub when explicitly authorized
5. verify GitHub status
6. allow Vercel's Git integration to deploy

Do not commit secrets.

## Vercel

Configure environment variables in Vercel:

NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_SITE_URL

Add provider-specific secrets only when their integration is implemented.

## Supabase

Apply migrations in a controlled deployment process.

Never blindly reset production.

Back up production data before destructive migrations.

## Verification

After deployment verify:

- site loads
- auth pages work
- login/logout
- dashboard routing
- Supabase connectivity
- RLS
- protected routes
- critical API/server actions

A deployment is successful only after functional smoke tests pass.
