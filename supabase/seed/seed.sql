-- Seed for local dev only — categories + sample course (idempotent)

insert into public.categories (name, slug, description) values
  ('Development','development','Code, apps, and infrastructure'),
  ('Design','design','UI/UX and creative practice'),
  ('Business','business','Leadership, strategy, and operations'),
  ('Data & AI','data-ai','Data science and machine learning')
on conflict (slug) do nothing;
