# Supabase Database Specification

Use Supabase Postgres.

All schema changes must be SQL migrations in supabase/migrations/.

## Core tables

profiles
roles
permissions
role_permissions
user_roles

categories
courses
sections
lessons
lesson_resources
video_assets

enrollments
lesson_progress

quizzes
quiz_questions
quiz_options
quiz_attempts

reviews
wishlists

orders
order_items
payments
refunds
coupons

instructor_earnings
payouts

certificates
notifications
audit_logs

## Important constraints

- profiles.user_id references auth.users(id)
- public IDs should be UUIDs
- unique course slugs
- unique certificate numbers
- unique wishlist(user_id, course_id)
- unique review(user_id, course_id)
- unique lesson_progress(enrollment_id, lesson_id)
- appropriate unique constraints for roles and permissions
- timestamps with timezone

## Roles

Do not rely on a client-supplied role.

The authorization model must make it impossible for a normal user to promote
themselves.

Superadmin creation should be an explicit bootstrap operation or migration
controlled by deployment configuration, followed by normal superadmin
administration.

## RLS

Enable RLS on all application tables containing user or business data.

Policies must cover:

- select
- insert
- update
- delete

where applicable.

Examples:

Students can read/update only their permitted profile fields.

Students can read only their own enrollment/progress records.

Instructors can modify only courses they own.

Admins can access records allowed by their permissions.

Superadmins can access all administrative records.

Financial data requires stricter policies.

Audit logs should be append-only from application users.

## Indexing

Index common filters and foreign keys, including:

- course slug
- course status
- course category
- course instructor
- enrollment user
- enrollment course
- progress enrollment
- review course
- orders user
- payments order
- notifications user
- audit actor/entity
