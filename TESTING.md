# Testing

## Required checks

- typecheck
- lint
- unit tests
- integration tests
- E2E tests

## Authentication tests

- registration
- duplicate email
- login
- invalid credentials
- logout
- password recovery
- session refresh
- protected route
- role redirect

## Authorization tests

- student cannot access admin
- instructor cannot access admin
- admin cannot create admin by default
- normal user cannot promote self
- only superadmin can create admins
- instructor can edit own course
- instructor cannot edit another instructor's course

## RLS tests

Verify representative policies against Supabase.

## E2E critical flow

Register
-> verify
-> login
-> dashboard
-> browse course
-> enroll/purchase
-> learn
-> progress
-> completion
-> certificate

## Superadmin E2E

Bootstrap superadmin
-> login
-> superadmin dashboard
-> create admin
-> admin logs in
-> admin dashboard
-> disable admin
-> verify access is revoked
