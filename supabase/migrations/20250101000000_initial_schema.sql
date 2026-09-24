-- Phase 0 + core schema — Lumem LMS
-- Tables: profiles, roles, permissions, role_permissions, user_roles, categories, courses,
-- sections, lessons, lesson_resources, video_assets, enrollments, lesson_progress,
-- quizzes, quiz_questions, quiz_options, quiz_attempts, reviews, wishlists, orders,
-- order_items, payments, refunds, coupons, instructor_earnings, payouts, certificates,
-- notifications, audit_logs
-- plus helpers: updated_at trigger, slug, and bootstrap functions

-- Extensions
create extension if not exists "pgcrypto";
create extension if not exists "pg_stat_statements";

-- Helpers --------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end; $$;

create or replace function public.is_superadmin(uid uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.user_roles ur
    join public.roles r on r.id = ur.role_id
    where ur.user_id = uid and r.name = 'superadmin'
  );
$$;

create or replace function public.has_role(uid uuid, role_name text)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.user_roles ur
    join public.roles r on r.id = ur.role_id
    where ur.user_id = uid and r.name = role_name
  );
$$;

create or replace function public.has_permission(uid uuid, perm text)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.user_roles ur
    join public.role_permissions rp on rp.role_id = ur.role_id
    join public.permissions p on p.id = rp.permission_id
    where ur.user_id = uid and p.name = perm
  ) or public.is_superadmin(uid);
$$;

-- Roles / Permissions ---------------------------------------------------------
create table public.roles (
  id uuid primary key default gen_random_uuid(),
  name text unique not null check (name ~ '^[a-z_]+$'),
  display_name text not null,
  created_at timestamptz not null default now()
);

create table public.permissions (
  id uuid primary key default gen_random_uuid(),
  name text unique not null,
  description text,
  created_at timestamptz not null default now()
);

create table public.role_permissions (
  role_id uuid not null references public.roles(id) on delete cascade,
  permission_id uuid not null references public.permissions(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (role_id, permission_id)
);

insert into public.roles (name, display_name) values
  ('student','Student'),('instructor','Instructor'),('admin','Admin'),('superadmin','Super Admin')
on conflict (name) do nothing;

insert into public.permissions (name, description) values
  ('users.read','View users'),
  ('users.write','Manage users'),
  ('courses.read','View courses'),
  ('courses.moderate','Moderate courses'),
  ('payments.read','View payments'),
  ('refunds.manage','Manage refunds'),
  ('payouts.manage','Manage payouts'),
  ('admins.create','Create admins'),
  ('admins.manage','Manage admins'),
  ('settings.manage','Manage platform settings'),
  ('audit.read','View audit logs'),
  ('categories.manage','Manage categories')
on conflict (name) do nothing;

-- Give superadmin all permissions
insert into public.role_permissions (role_id, permission_id)
select r.id, p.id from public.roles r cross join public.permissions p where r.name='superadmin'
on conflict do nothing;

-- Admin default permissions (without admins.create)
insert into public.role_permissions (role_id, permission_id)
select r.id, p.id from public.roles r cross join public.permissions p
where r.name='admin' and p.name in ('users.read','courses.read','courses.moderate','payments.read','audit.read')
on conflict do nothing;

-- Profiles --------------------------------------------------------------------
create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique not null references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  bio text,
  headline text,
  website text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger profiles_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create index idx_profiles_user_id on public.profiles(user_id);

create table public.user_roles (
  user_id uuid not null references auth.users(id) on delete cascade,
  role_id uuid not null references public.roles(id) on delete cascade,
  granted_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  primary key (user_id, role_id)
);
create index idx_user_roles_user on public.user_roles(user_id);
create index idx_user_roles_role on public.user_roles(role_id);

-- Categories ------------------------------------------------------------------
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  parent_id uuid references public.categories(id) on delete set null,
  position int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger categories_updated_at before update on public.categories for each row execute function public.set_updated_at();
create index idx_categories_slug on public.categories(slug);
create index idx_categories_parent on public.categories(parent_id);

-- Courses ---------------------------------------------------------------------
create table public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  subtitle text,
  description text,
  category_id uuid references public.categories(id) on delete set null,
  instructor_id uuid not null references auth.users(id) on delete cascade,
  level text not null default 'beginner' check (level in ('beginner','intermediate','advanced','all')),
  language text not null default 'en',
  price_cents int not null default 0 check (price_cents >= 0),
  currency text not null default 'USD',
  thumbnail_url text,
  preview_video_url text,
  status text not null default 'draft' check (status in ('draft','pending_review','approved','rejected','published','archived')),
  is_featured boolean not null default false,
  avg_rating numeric(3,2) not null default 0 check (avg_rating >=0 and avg_rating <=5),
  total_reviews int not null default 0,
  total_enrollments int not null default 0,
  duration_minutes int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);
create trigger courses_updated_at before update on public.courses for each row execute function public.set_updated_at();
create index idx_courses_slug on public.courses(slug);
create index idx_courses_status on public.courses(status);
create index idx_courses_category on public.courses(category_id);
create index idx_courses_instructor on public.courses(instructor_id);
create index idx_courses_featured on public.courses(is_featured) where is_featured;

create table public.sections (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  position int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger sections_updated_at before update on public.sections for each row execute function public.set_updated_at();
create index idx_sections_course on public.sections(course_id);

create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references public.sections(id) on delete cascade,
  title text not null,
  description text,
  position int not null default 0,
  kind text not null default 'video' check (kind in ('video','article','quiz','resource')),
  is_preview boolean not null default false,
  duration_seconds int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger lessons_updated_at before update on public.lessons for each row execute function public.set_updated_at();
create index idx_lessons_section on public.lessons(section_id);

create table public.lesson_resources (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  title text not null,
  file_url text not null,
  file_type text,
  file_size_bytes int,
  created_at timestamptz not null default now()
);
create index idx_lesson_resources_lesson on public.lesson_resources(lesson_id);

create table public.video_assets (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid references public.lessons(id) on delete cascade,
  provider text not null default 'supabase_storage',
  provider_asset_id text,
  storage_path text,
  status text not null default 'ready' check (status in ('uploading','processing','ready','failed')),
  duration_seconds int,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger video_assets_updated_at before update on public.video_assets for each row execute function public.set_updated_at();
create index idx_video_assets_lesson on public.video_assets(lesson_id);

-- Enrollments / Progress ------------------------------------------------------
create table public.enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  status text not null default 'active' check (status in ('active','completed','cancelled')),
  enrolled_at timestamptz not null default now(),
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, course_id)
);
create trigger enrollments_updated_at before update on public.enrollments for each row execute function public.set_updated_at();
create index idx_enrollments_user on public.enrollments(user_id);
create index idx_enrollments_course on public.enrollments(course_id);

create table public.lesson_progress (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references public.enrollments(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade,
  is_completed boolean not null default false,
  last_position_seconds int not null default 0,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (enrollment_id, lesson_id)
);
create trigger lesson_progress_updated_at before update on public.lesson_progress for each row execute function public.set_updated_at();
create index idx_lesson_progress_enrollment on public.lesson_progress(enrollment_id);
create index idx_lesson_progress_lesson on public.lesson_progress(lesson_id);

-- Quizzes ---------------------------------------------------------------------
create table public.quizzes (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid references public.lessons(id) on delete cascade,
  course_id uuid references public.courses(id) on delete cascade,
  title text not null,
  description text,
  passing_score int not null default 70 check (passing_score >=0 and passing_score <=100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger quizzes_updated_at before update on public.quizzes for each row execute function public.set_updated_at();

create table public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  prompt text not null,
  kind text not null default 'single_choice' check (kind in ('single_choice','multi_choice','true_false')),
  position int not null default 0,
  points int not null default 1,
  created_at timestamptz not null default now()
);
create index idx_quiz_questions_quiz on public.quiz_questions(quiz_id);

create table public.quiz_options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.quiz_questions(id) on delete cascade,
  label text not null,
  is_correct boolean not null default false,
  position int not null default 0,
  created_at timestamptz not null default now()
);
create index idx_quiz_options_question on public.quiz_options(question_id);

create table public.quiz_attempts (
  id uuid primary key default gen_random_uuid(),
  quiz_id uuid not null references public.quizzes(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  score int,
  passed boolean,
  answers jsonb not null default '{}'::jsonb,
  started_at timestamptz not null default now(),
  submitted_at timestamptz,
  created_at timestamptz not null default now()
);
create index idx_quiz_attempts_quiz_user on public.quiz_attempts(quiz_id, user_id);

-- Reviews / Wishlists ---------------------------------------------------------
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  rating smallint not null check (rating >=1 and rating <=5),
  title text,
  body text,
  is_visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, course_id)
);
create trigger reviews_updated_at before update on public.reviews for each row execute function public.set_updated_at();
create index idx_reviews_course on public.reviews(course_id);
create index idx_reviews_user on public.reviews(user_id);

create table public.wishlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, course_id)
);
create index idx_wishlists_user on public.wishlists(user_id);
create index idx_wishlists_course on public.wishlists(course_id);

-- Commerce --------------------------------------------------------------------
create table public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  description text,
  discount_type text not null check (discount_type in ('percent','fixed')),
  discount_value int not null check (discount_value >=0),
  max_redemptions int,
  redeemed_count int not null default 0,
  is_active boolean not null default true,
  valid_from timestamptz,
  valid_until timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger coupons_updated_at before update on public.coupons for each row execute function public.set_updated_at();

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending','paid','failed','refunded','cancelled')),
  subtotal_cents int not null default 0,
  discount_cents int not null default 0,
  tax_cents int not null default 0,
  total_cents int not null default 0,
  currency text not null default 'USD',
  coupon_id uuid references public.coupons(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger orders_updated_at before update on public.orders for each row execute function public.set_updated_at();
create index idx_orders_user on public.orders(user_id);
create index idx_orders_status on public.orders(status);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete restrict,
  unit_price_cents int not null,
  quantity int not null default 1,
  created_at timestamptz not null default now()
);
create index idx_order_items_order on public.order_items(order_id);
create index idx_order_items_course on public.order_items(course_id);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  provider text not null default 'stripe',
  provider_payment_id text,
  status text not null default 'pending' check (status in ('pending','succeeded','failed','cancelled')),
  amount_cents int not null,
  currency text not null default 'USD',
  raw_payload jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger payments_updated_at before update on public.payments for each row execute function public.set_updated_at();
create index idx_payments_order on public.payments(order_id);

create table public.refunds (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  payment_id uuid references public.payments(id) on delete set null,
  amount_cents int not null check (amount_cents >0),
  reason text,
  status text not null default 'pending' check (status in ('pending','approved','rejected','succeeded','failed')),
  requested_by uuid references auth.users(id),
  processed_by uuid references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger refunds_updated_at before update on public.refunds for each row execute function public.set_updated_at();
create index idx_refunds_order on public.refunds(order_id);

create table public.instructor_earnings (
  id uuid primary key default gen_random_uuid(),
  instructor_id uuid not null references auth.users(id) on delete cascade,
  order_item_id uuid not null references public.order_items(id) on delete cascade,
  gross_cents int not null,
  platform_fee_cents int not null,
  net_cents int not null,
  status text not null default 'pending' check (status in ('pending','available','paid','cancelled')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger instructor_earnings_updated_at before update on public.instructor_earnings for each row execute function public.set_updated_at();
create index idx_earnings_instructor on public.instructor_earnings(instructor_id);

create table public.payouts (
  id uuid primary key default gen_random_uuid(),
  instructor_id uuid not null references auth.users(id) on delete cascade,
  amount_cents int not null check (amount_cents >0),
  currency text not null default 'USD',
  status text not null default 'pending' check (status in ('pending','processing','succeeded','failed','cancelled')),
  provider text,
  provider_payout_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger payouts_updated_at before update on public.payouts for each row execute function public.set_updated_at();
create index idx_payouts_instructor on public.payouts(instructor_id);

-- Certificates / Notifications / Audit ---------------------------------------
create table public.certificates (
  id uuid primary key default gen_random_uuid(),
  certificate_number text unique not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  enrollment_id uuid references public.enrollments(id) on delete set null,
  issued_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (user_id, course_id)
);
create index idx_certificates_user on public.certificates(user_id);
create index idx_certificates_course on public.certificates(course_id);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  body text,
  kind text not null default 'general' check (kind in ('general','enrollment','payment','course','system','admin')),
  is_read boolean not null default false,
  data jsonb,
  created_at timestamptz not null default now()
);
create index idx_notifications_user on public.notifications(user_id);
create index idx_notifications_read on public.notifications(user_id, is_read);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id text,
  metadata jsonb,
  created_at timestamptz not null default now()
);
create index idx_audit_actor on public.audit_logs(actor_id);
create index idx_audit_entity on public.audit_logs(entity_type, entity_id);
create index idx_audit_created on public.audit_logs(created_at desc);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  student_role_id uuid;
begin
  insert into public.profiles (user_id, full_name, avatar_url)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', null), null)
  on conflict (user_id) do nothing;

  select id into student_role_id from public.roles where name='student' limit 1;
  if student_role_id is not null then
    insert into public.user_roles (user_id, role_id)
    values (new.id, student_role_id)
    on conflict do nothing;
  end if;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();
