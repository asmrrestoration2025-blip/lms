-- Storage buckets (private) + superadmin bootstrap helper

-- Buckets are created via storage API in production; this SQL ensures idempotency for local dev
insert into storage.buckets (id, name, public) values ('course-assets','course-assets', false) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('avatars','avatars', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('certificates','certificates', false) on conflict (id) do nothing;

-- Storage policies — authenticated users can read course-assets if enrolled or instructor/admin
create policy "course-assets_select_enrolled_or_owner" on storage.objects for select to authenticated using (
  bucket_id='course-assets' and (
    public.is_superadmin(auth.uid()) or public.has_permission(auth.uid(),'courses.moderate')
    or exists (select 1 from public.courses c where c.thumbnail_url like '%'||name||'%' and c.instructor_id=auth.uid())
    or exists (select 1 from public.enrollments e join public.courses c on c.id=e.course_id where e.user_id=auth.uid())
  )
);
create policy "course-assets_insert_instructor" on storage.objects for insert to authenticated with check (
  bucket_id='course-assets' and (public.has_role(auth.uid(),'instructor') or public.is_superadmin(auth.uid()))
);

-- Bootstrap: promote the first user to superadmin if no superadmin exists (safe for local/dev)
-- Production bootstrap should use service-role script that calls this function with explicit check.
create or replace function public.bootstrap_superadmin(target_email text)
returns text language plpgsql security definer set search_path = public as $$
declare
  target_uid uuid;
  superadmin_role_id uuid;
  existing_count int;
begin
  select count(*) into existing_count from public.user_roles ur join public.roles r on r.id=ur.role_id where r.name='superadmin';
  if existing_count > 0 then
    return 'superadmin already exists — bootstrap blocked';
  end if;

  select id into target_uid from auth.users where email = target_email limit 1;
  if target_uid is null then
    return 'user not found for email ' || target_email;
  end if;

  select id into superadmin_role_id from public.roles where name='superadmin' limit 1;
  insert into public.user_roles (user_id, role_id) values (target_uid, superadmin_role_id) on conflict do nothing;

  insert into public.audit_logs (actor_id, action, entity_type, entity_id, metadata)
  values (target_uid, 'bootstrap_superadmin', 'user', target_uid::text, jsonb_build_object('email', target_email));

  return 'superadmin bootstrapped for ' || target_email;
end;
$$;
