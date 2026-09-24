# Non-Coder Zero-Cost Setup — Lumen LMS

You do NOT need to be a coder. This app is designed to run **free** on Supabase + Vercel hobby tiers. You also do NOT need to run `npm install` locally — Vercel builds it for you.

## What you need (all free)
1. A GitHub account (free) — you already have repo `https://github.com/asmrrestoration2025-blip/lms`
2. A Supabase account (free) — sign in with GitHub at supabase.com
3. A Vercel account (free) — sign in with GitHub at vercel.com

## EASIEST PATH — No Git, No Terminal (Recommended for non-coders)

### Step 1 — Upload code to GitHub via browser (2 minutes)
1. Open `https://github.com/asmrrestoration2025-blip/lms` in your browser. Log in.
2. If the repo is empty, click `Add file` → `Upload files`.
3. On your computer open `C:\Users\Traveller\Desktop\LMS` in File Explorer. Select ALL files/folders inside (Ctrl+A) — EXCEPT `node_modules` and `.next` if they exist — and drag them into the GitHub upload area.
4. Scroll down, click `Commit changes`. Done. No PAT needed.

If you see `uploading is disabled for empty repo`, click `Create new file`, type any name like `README.md`, commit, then use Upload.

### Step 2 — Create free Supabase project (3 minutes)
1. Go to https://supabase.com → `Start your project` → Sign in with GitHub.
2. Click `New Project`, pick a name `lumen-lms`, set a strong DB password (save it), choose region closest to you, click `Create` (free tier is auto-selected, no card).
3. Wait ~2 min for provision. Then go to `Project Settings` (gear icon) → `API`.
4. Copy: `Project URL`, `anon public` key, `service_role` key (click reveal). Keep them private — you will paste them into Vercel, never into GitHub code.
5. Go to `SQL Editor` → `New Query` → paste contents of `supabase/migrations/20250101000000_initial_schema.sql` → Run. Repeat for `20250102000000_rls.sql` and `20250103000000_storage_and_bootstrap.sql`. (Or use `supabase link` later — but SQL Editor is simplest.)

### Step 3 — Create first Superadmin (1 minute)
1. In Supabase, go to `Authentication` → `Users` → `Add user` → `Create new user` with your email/password, check `Auto confirm`.
2. Go to `SQL Editor` → run: `select public.bootstrap_superadmin('YOUR_EMAIL_HERE');` replacing with the email you just created. If it says `bootstrapped`, you are superadmin.

### Step 4 — Deploy to Vercel free (2 minutes)
1. Go to https://vercel.com → Sign in with GitHub → `Add New` → `Project` → Import `asmrrestoration2025-blip/lms` → `Import`.
2. Framework: Next.js (auto). In `Environment Variables` add:
   - `NEXT_PUBLIC_SUPABASE_URL` = your Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = anon key
   - `SUPABASE_SERVICE_ROLE_KEY` = service_role key (never prefix with NEXT_PUBLIC)
   - `NEXT_PUBLIC_SITE_URL` = leave blank for now, Vercel will fill; after deploy set it to `https://your-project.vercel.app`
3. Click `Deploy`. Wait 2-3 min. Vercel runs `npm install` + `build` on its servers — you don't need to do it locally. If build fails, check logs; 99% of failures are missing env vars.
4. Once live, add the site URL as `NEXT_PUBLIC_SITE_URL` in Vercel → Settings → Environment Variables → Redeploy.

### Step 5 — Verify
Open your Vercel URL → homepage should show `Learn without limits`. Try `/register` → create a student account → login → dashboard.

## Alternative — GitHub Desktop (still zero-cost, GUI, no command line)
If browser upload feels slow, install https://desktop.github.com → sign in with GitHub → `Clone` your `lms` repo → copy files from `C:\Users\Traveller\Desktop\LMS` into the cloned folder → `Commit` → `Push origin`. No PAT typing.

## For the "npm install / git" actions you asked about
- **Local `npm install`**: Only needed if YOU want to test on your PC (`http://localhost:3000`). Vercel already does it for free. If you want it: install Node.js from nodejs.org LTS, then double-click `install.bat` I'm placing in your folder (it runs `npm.cmd install`).
- **Git PAT**: Only needed if you use command-line git. Browser upload and GitHub Desktop avoid PAT entirely. If you insist on command line, I can generate a PAT guide — but you don't need it for zero-cost.

## Costs
- Supabase free: 500MB DB, 1GB storage, 50k MAU — fine for Phase 0-7.
- Vercel hobby free: 100GB bandwidth, automatic builds.
- GitHub free: unlimited public repos.
Total = $0.

See also `docs/SUPABASE_SETUP.md` and `docs/GITHUB_VERCEL_SETUP.md` for technical notes.
