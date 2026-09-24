# Authentication + Dashboards Prompt

Implement authentication using Supabase Auth.

Required:
- register
- login
- logout
- forgot password
- reset password
- email verification
- session refresh
- protected routes

Create role-aware routing for:
- student
- instructor
- admin
- superadmin

Every authenticated user must have a dashboard.

Create:
- /dashboard/student
- /dashboard/instructor
- /dashboard/admin
- /dashboard/superadmin

Create reusable dashboard shell/navigation components.

Implement server-side authorization.

Implement RLS.

Never trust client role values.

Test unauthorized and cross-role access.
