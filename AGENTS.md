# LMS Platform — OpenCode Instructions

You are building a production-grade global Learning Management System (LMS)
with original branding and architecture, comparable in functional depth to
major global learning marketplaces.

## Non-negotiable infrastructure choices

- Database/backend platform: Supabase
- PostgreSQL: Supabase Postgres
- Authentication: Supabase Auth
- Storage: Supabase Storage
- Realtime: Supabase Realtime where useful
- Deployment source control: GitHub
- Production web deployment: Vercel
- Flow: OpenCode -> GitHub -> Vercel
- Frontend: Next.js + React + TypeScript
- Styling/UI: Tailwind CSS + shadcn/ui
- Validation: Zod
- ORM/query layer: Prefer Supabase generated types + Supabase client. Do not
  introduce Prisma unless explicitly required.
- Testing: Vitest + Testing Library + Playwright

## Deployment rule

OpenCode must prepare and commit production-ready code to GitHub. Vercel
must deploy from the connected GitHub repository. Do not deploy production
by manually uploading a build from the local machine unless explicitly
requested.

Never invent credentials, repository names, organization names, project IDs,
Supabase URLs, or tokens. Use environment variables and ask for missing
credentials only when an actual external action requires them.

## Roles

The system must support:

- student
- instructor
- admin
- superadmin

Every authenticated user gets the dashboard appropriate to their role.

### Superadmin

There must be exactly one top-level authorization capability: superadmin.

A superadmin can:

- create admins
- disable/reactivate admins
- assign admin permissions
- manage users
- manage instructors
- manage courses
- moderate content
- view platform analytics
- manage categories
- manage payments/refunds/payouts
- view audit logs
- manage platform settings

Admins cannot create other admins unless the superadmin explicitly grants a
specific permission that the product specification allows. Default behavior:
only superadmins create admins.

Never trust a role supplied by the client. Role and permission checks must be
server-side.

## Authentication

Build complete:

- login
- logout
- registration
- email verification
- forgot password
- reset password
- protected routes
- session refresh
- role-aware redirects
- dashboard routing

Use Supabase Auth securely. Do not store passwords in application tables.

## Dashboard requirement

Every authenticated user must have a dashboard.

Minimum dashboards:

- Student Dashboard
- Instructor Dashboard
- Admin Dashboard
- Superadmin Dashboard

Do not create one generic dashboard with hidden buttons. Build role-specific
information architecture while sharing reusable components.

## Security

Use Supabase Row Level Security (RLS) as a major authorization layer.

Create explicit RLS policies for all sensitive tables.

Do not expose the Supabase service-role key to browser/client code.

Use server-only code for privileged operations.

Never allow a browser client to promote itself to admin/superadmin.

Every sensitive mutation must have server-side authorization.

Maintain immutable audit logs for privileged actions.

## Database

Use Supabase migrations in:

supabase/migrations/

Use generated database types.

Create:

- profiles
- roles/permissions model
- courses
- sections
- lessons
- enrollments
- progress
- reviews
- wishlists
- orders
- order_items
- payments
- refunds
- coupons
- instructor_earnings
- payouts
- certificates
- notifications
- audit_logs

Use foreign keys, constraints, indexes, timestamps, and appropriate unique
constraints.

Financial records must be auditable and must not be casually deleted.

## Code quality

Use strict TypeScript.

Avoid `any`.

Validate external input.

Keep business logic out of UI components.

Create reusable components.

Every major feature requires tests.

## Definition of done

A task is not complete until:

1. Implementation works.
2. Authorization is enforced.
3. RLS is correct where applicable.
4. Loading/error/empty states exist.
5. Tests are added.
6. Typecheck passes.
7. Lint passes.
8. Relevant tests pass.
9. Security implications are reviewed.
10. Documentation is updated.
11. Git diff is reviewed.

Never claim deployment is successful unless it was actually verified.
