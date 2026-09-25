# Production Hardening — Checklist

- [ ] Supabase migrations applied (3 files in `supabase/migrations/`)
- [ ] RLS enabled on all tables (`20250102000000_rls.sql`)
- [ ] `NEXT_PUBLIC_SUPABASE_URL` + `ANON_KEY` + `SERVICE_ROLE` set in Vercel (never public service_role)
- [ ] `NEXT_PUBLIC_SITE_URL` = `https://<vercel>.vercel.app`
- [ ] `supabase gen types` run → `src/types/database.ts`
- [ ] `select public.bootstrap_superadmin('you@email.com')` — only if no superadmin
- [ ] Auth redirect URLs in Supabase Dashboard → Auth → URL Config → add `https://<vercel>.vercel.app/auth/callback`
- [ ] Storage buckets private (`course-assets`, `certificates`)
- [ ] Rate limiting env: add Upstash Redis URL when available (fallback in-memory `src/lib/security/rate-limit.ts`)
- [ ] Vercel → Settings → Environment Variables → Production + Preview
- [ ] Verify: `/login`, `/register`, `/dashboard` redirect, RLS, `checkout` price trusted, webhook idempotent

Zero cost: all on Supabase free + Vercel Hobby.
