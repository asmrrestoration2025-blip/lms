# Production Hardening Prompt

Before production deployment:

- run typecheck
- run lint
- run unit tests
- run integration tests
- run E2E tests
- review RLS
- review secrets
- review authentication
- review authorization
- review admin/superadmin controls
- review payments
- review file storage
- review rate limiting
- review error handling
- review performance
- review accessibility

Then prepare GitHub and Vercel deployment configuration.

Do not claim deployment success until the deployed site has been smoke-tested.
