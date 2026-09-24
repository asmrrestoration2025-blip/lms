# Master OpenCode Prompt

Read all root specification files before coding.

You are building the LMS defined by:

AGENTS.md
PRODUCT.md
ARCHITECTURE.md
DATABASE.md
SECURITY.md
TESTING.md
DESIGN_SYSTEM.md
DEPLOYMENT.md
ROADMAP.md

Do not replace the required infrastructure choices.

Supabase is mandatory for database/auth/storage.
GitHub is the canonical repository.
Vercel is the deployment target.

## First

Inspect the repository.

Determine:
- current stack
- current files
- existing application
- existing Git state
- existing Supabase configuration
- existing Vercel configuration

Do not destroy existing work.

## Then

Create a phase-by-phase implementation plan.

Prioritize:
1. foundation
2. Supabase
3. authentication
4. role model
5. dashboards
6. course marketplace
7. learning
8. payments
9. administration
10. production hardening

Do not implement the entire platform in one task.

For every phase:
- inspect
- plan
- implement
- test
- typecheck
- lint
- security review
- document
- commit logically

Do not claim success without verification.
