# Superadmin Prompt

Implement the administrative hierarchy.

Roles:
student
instructor
admin
superadmin

Only superadmin can create admins by default.

Superadmin features:
- list admins
- create admin
- edit admin
- disable/reactivate admin
- assign permissions
- view admin activity
- view audit logs

Admin creation must:
- validate input
- create/authenticate the user through Supabase Auth securely
- create/update application profile
- assign admin role
- write an audit log
- never expose service-role credentials
- never allow self-promotion

Test:
- normal user cannot create admin
- instructor cannot create admin
- admin cannot create admin by default
- superadmin can create admin
- disabled admin cannot access admin dashboard
