# Security

## Authentication

Supabase Auth is the authentication authority.

Never store plaintext passwords.

Never put the Supabase service-role key in:

- browser code
- NEXT_PUBLIC_* variables
- GitHub
- client bundles

## Authorization

Every privileged action requires server-side authorization.

Use a centralized permission service/helper.

Minimum permission examples:

users.read
users.write
courses.read
courses.moderate
payments.read
refunds.manage
payouts.manage
admins.create
admins.manage
settings.manage
audit.read

Only superadmin has admins.create by default.

## Superadmin

The system must prevent:

- self-promotion
- admin-to-superadmin escalation
- client-side role spoofing
- unauthorized admin creation

Creating an admin must happen through a protected server action/API route.

## RLS

RLS is mandatory for sensitive tables.

Do not treat application middleware as a replacement for RLS.

## Input validation

Validate body/query/path/form inputs with Zod or equivalent.

## File uploads

Validate type and size.
Do not execute uploads.
Use private buckets for protected resources.

## Payments

Never trust client prices or payment status.
Verify payment provider events server-side.
Make webhooks idempotent.

## Rate limiting

Apply to authentication, password recovery, sensitive admin endpoints,
reviews, messaging, coupon redemption and payment flows.

## Audit

Audit:

- admin creation
- admin disable/reactivation
- permission changes
- role changes
- course approval/rejection
- refunds
- payouts
- platform setting changes
- security-sensitive account changes

Never log passwords or secrets.
