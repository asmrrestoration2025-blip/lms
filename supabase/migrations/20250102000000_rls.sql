-- RLS — enable on all app tables, define policies
-- Students: own data only. Instructors: own courses only. Admins/superadmins via has_permission / is_superadmin helpers.
-- Audit logs: append-only. Financial tables: stricter.

alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.roles enable row level security;
alter table public.permissions enable row level security;
alter table public.role_permissions enable row level security;
alter table public.categories enable row level security;
alter table public.courses enable row level security;
alter table public.sections enable row level security;
alter table public.lessons enable row level security;
alter table public.lesson_resources enable row level security;
alter table public.video_assets enable row level security;
alter table public.enrollments enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.quizzes enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.quiz_options enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.reviews enable row level security;
alter table public.wishlists enable row level security;
alter table public.coupons enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payments enable row level security;
alter table public.refunds enable row level security;
alter table public.instructor_earnings enable row level security;
alter table public.payouts enable row level security;
alter table public.certificates enable row level security;
alter table public.notifications enable row level security;
alter table public.audit_logs enable row level security;

-- Profiles
create policy "profiles_select_own_or_admin" on public.profiles for select using (
  user_id = auth.uid() or public.has_permission(auth.uid(), 'users.read') or public.is_superadmin(auth.uid())
);
create policy "profiles_insert_own" on public.profiles for insert with check (user_id = auth.uid());
create policy "profiles_update_own_or_admin" on public.profiles for update using (
  user_id = auth.uid() or public.has_permission(auth.uid(), 'users.write') or public.is_superadmin(auth.uid())
);
create policy "profiles_no_delete" on public.profiles for delete using (public.is_superadmin(auth.uid()));

-- user_roles — users can read own roles; only superadmin can modify
create policy "user_roles_select_own_or_admin" on public.user_roles for select using (
  user_id = auth.uid() or public.has_permission(auth.uid(), 'users.read') or public.is_superadmin(auth.uid())
);
create policy "user_roles_insert_superadmin_only" on public.user_roles for insert with check (public.is_superadmin(auth.uid()));
create policy "user_roles_update_superadmin_only" on public.user_roles for update using (public.is_superadmin(auth.uid()));
create policy "user_roles_delete_superadmin_only" on public.user_roles for delete using (public.is_superadmin(auth.uid()));

-- roles/permissions — readable by authenticated, writable by superadmin
create policy "roles_select_all_auth" on public.roles for select using (auth.role() = 'authenticated');
create policy "roles_modify_superadmin" on public.roles for all using (public.is_superadmin(auth.uid())) with check (public.is_superadmin(auth.uid()));
create policy "perms_select_all_auth" on public.permissions for select using (auth.role() = 'authenticated');
create policy "perms_modify_superadmin" on public.permissions for all using (public.is_superadmin(auth.uid())) with check (public.is_superadmin(auth.uid()));
create policy "role_perms_select_all_auth" on public.role_permissions for select using (auth.role()='authenticated');
create policy "role_perms_modify_superadmin" on public.role_permissions for all using (public.is_superadmin(auth.uid())) with check (public.is_superadmin(auth.uid()));

-- Categories — public read, manage via permission
create policy "categories_select_all" on public.categories for select using (true);
create policy "categories_modify_perm" on public.categories for all using (
  public.has_permission(auth.uid(),'categories.manage') or public.is_superadmin(auth.uid())
) with check (public.has_permission(auth.uid(),'categories.manage') or public.is_superadmin(auth.uid()));

-- Courses — public can read published; owners/admins can read all; owners can modify own; moderation via permission
create policy "courses_select_published_or_owned" on public.courses for select using (
  status = 'published' or instructor_id = auth.uid() or public.has_permission(auth.uid(),'courses.moderate') or public.is_superadmin(auth.uid())
);
create policy "courses_insert_instructor" on public.courses for insert with check (
  instructor_id = auth.uid() and (public.has_role(auth.uid(),'instructor') or public.has_role(auth.uid(),'admin') or public.is_superadmin(auth.uid()))
);
create policy "courses_update_own_or_moderate" on public.courses for update using (
  instructor_id = auth.uid() or public.has_permission(auth.uid(),'courses.moderate') or public.is_superadmin(auth.uid())
);
create policy "courses_delete_own_or_superadmin" on public.courses for delete using (
  instructor_id = auth.uid() or public.is_superadmin(auth.uid())
);

-- Sections/lessons — visibility follows course
create policy "sections_select_via_course" on public.sections for select using (
  exists (select 1 from public.courses c where c.id = course_id and (c.status='published' or c.instructor_id=auth.uid() or public.has_permission(auth.uid(),'courses.moderate') or public.is_superadmin(auth.uid())))
);
create policy "sections_modify_owner" on public.sections for all using (
  exists (select 1 from public.courses c where c.id = course_id and (c.instructor_id=auth.uid() or public.is_superadmin(auth.uid())))
) with check (
  exists (select 1 from public.courses c where c.id = course_id and (c.instructor_id=auth.uid() or public.is_superadmin(auth.uid())))
);

create policy "lessons_select_via_course" on public.lessons for select using (
  exists (select 1 from public.sections s join public.courses c on c.id=s.course_id where s.id=section_id and (c.status='published' or c.instructor_id=auth.uid() or public.has_permission(auth.uid(),'courses.moderate') or public.is_superadmin(auth.uid())))
);
create policy "lessons_modify_owner" on public.lessons for all using (
  exists (select 1 from public.sections s join public.courses c on c.id=s.course_id where s.id=section_id and (c.instructor_id=auth.uid() or public.is_superadmin(auth.uid())))
) with check (
  exists (select 1 from public.sections s join public.courses c on c.id=s.course_id where s.id=section_id and (c.instructor_id=auth.uid() or public.is_superadmin(auth.uid())))
);

-- Enrollments — own only, admin read via permission
create policy "enrollments_select_own_or_admin" on public.enrollments for select using (
  user_id = auth.uid() or public.has_permission(auth.uid(),'users.read') or public.is_superadmin(auth.uid())
);
create policy "enrollments_insert_own" on public.enrollments for insert with check (user_id = auth.uid());
create policy "enrollments_update_own_or_admin" on public.enrollments for update using (
  user_id = auth.uid() or public.is_superadmin(auth.uid())
);

-- Lesson progress — via enrollment ownership
create policy "progress_select_own" on public.lesson_progress for select using (
  exists (select 1 from public.enrollments e where e.id=enrollment_id and e.user_id=auth.uid()) or public.is_superadmin(auth.uid())
);
create policy "progress_modify_own" on public.lesson_progress for all using (
  exists (select 1 from public.enrollments e where e.id=enrollment_id and e.user_id=auth.uid()) or public.is_superadmin(auth.uid())
) with check (
  exists (select 1 from public.enrollments e where e.id=enrollment_id and e.user_id=auth.uid()) or public.is_superadmin(auth.uid())
);

-- Wishlists / Reviews — own only for write, public read for reviews
create policy "wishlists_select_own" on public.wishlists for select using (user_id=auth.uid() or public.is_superadmin(auth.uid()));
create policy "wishlists_modify_own" on public.wishlists for all using (user_id=auth.uid()) with check (user_id=auth.uid());

create policy "reviews_select_all" on public.reviews for select using (true);
create policy "reviews_insert_own" on public.reviews for insert with check (user_id=auth.uid());
create policy "reviews_update_own_or_moderate" on public.reviews for update using (
  user_id=auth.uid() or public.has_permission(auth.uid(),'courses.moderate') or public.is_superadmin(auth.uid())
);
create policy "reviews_delete_own_or_moderate" on public.reviews for delete using (
  user_id=auth.uid() or public.has_permission(auth.uid(),'courses.moderate') or public.is_superadmin(auth.uid())
);

-- Orders — own only
create policy "orders_select_own_or_payments_read" on public.orders for select using (
  user_id=auth.uid() or public.has_permission(auth.uid(),'payments.read') or public.is_superadmin(auth.uid())
);
create policy "orders_insert_own" on public.orders for insert with check (user_id=auth.uid());
create policy "orders_update_own_or_superadmin" on public.orders for update using (
  user_id=auth.uid() or public.is_superadmin(auth.uid())
);

create policy "order_items_select_own_or_admin" on public.order_items for select using (
  exists (select 1 from public.orders o where o.id=order_id and (o.user_id=auth.uid() or public.has_permission(auth.uid(),'payments.read') or public.is_superadmin(auth.uid())))
);
create policy "order_items_insert_via_order_owner" on public.order_items for insert with check (
  exists (select 1 from public.orders o where o.id=order_id and o.user_id=auth.uid())
);

-- Payments — own via order
create policy "payments_select_own_or_read" on public.payments for select using (
  exists (select 1 from public.orders o where o.id=order_id and (o.user_id=auth.uid() or public.has_permission(auth.uid(),'payments.read') or public.is_superadmin(auth.uid())))
);
-- Payments are inserted by service-role (webhooks); no direct anon insert
create policy "payments_no_direct_insert" on public.payments for insert with check (public.is_superadmin(auth.uid()));

-- Refunds — request own, manage via permission
create policy "refunds_select_own_or_manage" on public.refunds for select using (
  requested_by=auth.uid() or public.has_permission(auth.uid(),'refunds.manage') or public.is_superadmin(auth.uid())
);
create policy "refunds_insert_own" on public.refunds for insert with check (requested_by=auth.uid());
create policy "refunds_update_manage" on public.refunds for update using (
  public.has_permission(auth.uid(),'refunds.manage') or public.is_superadmin(auth.uid())
);

-- Earnings / Payouts
create policy "earnings_select_own_or_manage" on public.instructor_earnings for select using (
  instructor_id=auth.uid() or public.has_permission(auth.uid(),'payouts.manage') or public.is_superadmin(auth.uid())
);
create policy "payouts_select_own_or_manage" on public.payouts for select using (
  instructor_id=auth.uid() or public.has_permission(auth.uid(),'payouts.manage') or public.is_superadmin(auth.uid())
);
create policy "payouts_insert_manage" on public.payouts for insert with check (
  public.has_permission(auth.uid(),'payouts.manage') or public.is_superadmin(auth.uid())
);

-- Certificates — own or admin
create policy "certs_select_own_or_admin" on public.certificates for select using (
  user_id=auth.uid() or public.has_permission(auth.uid(),'users.read') or public.is_superadmin(auth.uid())
);

-- Notifications — own only
create policy "notifications_select_own" on public.notifications for select using (user_id=auth.uid());
create policy "notifications_modify_own" on public.notifications for all using (user_id=auth.uid()) with check (user_id=auth.uid());

-- Audit logs — read via permission, insert via service-role or superadmin, no update/delete for normal users
create policy "audit_select_perm" on public.audit_logs for select using (
  public.has_permission(auth.uid(),'audit.read') or public.is_superadmin(auth.uid())
);
create policy "audit_insert_superadmin" on public.audit_logs for insert with check (
  public.is_superadmin(auth.uid())
);

-- Quizzes — visibility via course, attempts own only
create policy "quizzes_select_via_course" on public.quizzes for select using (
  exists (select 1 from public.courses c where c.id=course_id and (c.status='published' or c.instructor_id=auth.uid() or public.is_superadmin(auth.uid())))
);
create policy "quizzes_modify_owner" on public.quizzes for all using (
  exists (select 1 from public.courses c where c.id=course_id and c.instructor_id=auth.uid()) or public.is_superadmin(auth.uid())
) with check (
  exists (select 1 from public.courses c where c.id=course_id and c.instructor_id=auth.uid()) or public.is_superadmin(auth.uid())
);
create policy "quiz_attempts_own" on public.quiz_attempts for all using (user_id=auth.uid() or public.is_superadmin(auth.uid())) with check (user_id=auth.uid());

-- Lesson resources / video assets — via course ownership
create policy "lesson_resources_select_via_course" on public.lesson_resources for select using (
  exists (select 1 from public.lessons l join public.sections s on s.id=l.section_id join public.courses c on c.id=s.course_id where l.id=lesson_id and (c.status='published' or c.instructor_id=auth.uid() or public.is_superadmin(auth.uid())))
);
create policy "lesson_resources_modify_owner" on public.lesson_resources for all using (
  exists (select 1 from public.lessons l join public.sections s on s.id=l.section_id join public.courses c on c.id=s.course_id where l.id=lesson_id and c.instructor_id=auth.uid()) or public.is_superadmin(auth.uid())
) with check (
  exists (select 1 from public.lessons l join public.sections s on s.id=l.section_id join public.courses c on c.id=s.course_id where l.id=lesson_id and c.instructor_id=auth.uid()) or public.is_superadmin(auth.uid())
);
