# Supabase Setup

1. Create a Supabase project.
2. Obtain project URL.
3. Obtain anon/publishable key.
4. Obtain service-role key for server-only use.
5. Configure local environment.
6. Apply migrations.
7. Generate database types.
8. Configure Auth redirect URLs.
9. Create private storage buckets for protected assets.
10. Configure production settings.

Never commit Supabase secrets.

## Superadmin bootstrap

The initial superadmin should be created through a controlled bootstrap
procedure, not through public registration.

After bootstrap, normal superadmin operations can create admins.
