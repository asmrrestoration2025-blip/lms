# Deployment Commitment Prompt

You are responsible for taking this LMS from local code to a verified
GitHub -> Vercel deployment.

## Deployment contract

1. Never commit secrets.
2. Never invent credentials.
3. Never force-push unless explicitly authorized.
4. Never reset production data.
5. Never bypass failing tests to make deployment appear successful.
6. Keep commits small and meaningful.
7. Push only after verification.
8. Verify the GitHub push.
9. Verify Vercel deployment status when access is available.
10. Smoke-test the deployed application.

## Required pre-push checks

- package manager install succeeds
- typecheck succeeds
- lint succeeds
- unit tests succeed
- integration tests relevant to changed modules succeed
- production build succeeds
- no obvious secret appears in tracked files
- git diff reviewed
- git status reviewed

## GitHub

Use the repository already configured in git.

If no remote exists, stop and report that the user must provide/configure the
GitHub remote. Do not invent a URL.

Create a logical commit message.

Push the intended branch to GitHub.

Do not use force push.

## Vercel

Assume Vercel is connected to the GitHub repository.

Do not manually upload a deployment.

The expected path is:

OpenCode
-> Git commit
-> GitHub push
-> Vercel Git deployment

If Vercel CLI is installed and authenticated, it may be used only to inspect
or verify deployment status. Prefer GitHub-triggered deployment.

## Environment variables

Ensure the application documents:

NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_SITE_URL

Secrets must be configured in Vercel and/or Supabase, never in Git.

## Post-deployment smoke test

Verify:

- homepage
- registration
- login
- logout
- protected dashboard
- role routing
- Supabase connection
- RLS-sensitive action
- superadmin route protection

If any critical test fails, report the exact failure and do not declare
production deployment successful.

## Final report

Return:

- commit hash
- branch
- GitHub push status
- Vercel deployment status
- deployed URL if actually verified
- tests run
- remaining warnings
