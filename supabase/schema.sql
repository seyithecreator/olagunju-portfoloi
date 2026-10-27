-- Olagunju Oluwaseyi portfolio schema
-- Run in Supabase SQL Editor. Then create a user in Auth and insert that user's UUID into admin_users.
create extension if not exists pgcrypto;
create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  category text not null check (category in ('technology','cybersecurity','production')),
  summary text not null default '',
  body text,
  cover_image text,
  repo_url text,
  live_url text,
  tags text[] not null default '{}',
  featured boolean not null default false,
  status text not null default 'draft' check (status in ('draft','published')),
  sort_order integer not null default 0,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table if not exists public.experiences (
  id uuid primary key default gen_random_uuid(), title text not null,
  organization text not null default '', category text not null check (category in ('technology','cybersecurity','production','general')),
  description text not null default '', start_date date, end_date date, current boolean not null default false,
  created_at timestamptz not null default now()
);
create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(), name text not null,
  category text not null check (category in ('technology','cybersecurity','production','general')),
  level text not null default '', sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
create table if not exists public.site_settings (
  id integer primary key default 1 check (id = 1), display_name text not null default 'Olagunju Oluwaseyi',
  headline text not null default 'Technology. Security. Production.', bio text not null default '',
  email text not null default '', github_url text not null default '', linkedin_url text not null default '',
  updated_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;
alter table public.projects enable row level security;
alter table public.experiences enable row level security;
alter table public.skills enable row level security;
alter table public.site_settings enable row level security;

-- SECURITY DEFINER avoids recursive RLS checks when policies ask whether a user is an admin.
create or replace function public.is_portfolio_admin() returns boolean
language sql stable security definer set search_path = ''
as $$ select exists (select 1 from public.admin_users where user_id = auth.uid()); $$;
revoke all on function public.is_portfolio_admin() from public;
grant execute on function public.is_portfolio_admin() to anon, authenticated;

create policy "admins can read admin roster" on public.admin_users for select to authenticated using (public.is_portfolio_admin());
create policy "public can read published projects" on public.projects for select to anon, authenticated using (status = 'published' or public.is_portfolio_admin());
create policy "admins can insert projects" on public.projects for insert to authenticated with check (public.is_portfolio_admin());
create policy "admins can update projects" on public.projects for update to authenticated using (public.is_portfolio_admin()) with check (public.is_portfolio_admin());
create policy "admins can delete projects" on public.projects for delete to authenticated using (public.is_portfolio_admin());
create policy "admins manage experiences" on public.experiences for all to authenticated using (public.is_portfolio_admin()) with check (public.is_portfolio_admin());
create policy "admins manage skills" on public.skills for all to authenticated using (public.is_portfolio_admin()) with check (public.is_portfolio_admin());
create policy "public can read site settings" on public.site_settings for select to anon, authenticated using (true);
create policy "admins manage site settings" on public.site_settings for all to authenticated using (public.is_portfolio_admin()) with check (public.is_portfolio_admin());

-- Public bucket for assets intentionally shown on the public website.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('portfolio-media', 'portfolio-media', true, 52428800, array['image/jpeg','image/png','image/webp','image/gif','video/mp4','application/pdf'])
on conflict (id) do nothing;
create policy "public can view portfolio media" on storage.objects for select to anon, authenticated using (bucket_id = 'portfolio-media');
create policy "admins can upload portfolio media" on storage.objects for insert to authenticated with check (bucket_id = 'portfolio-media' and public.is_portfolio_admin());
create policy "admins can update portfolio media" on storage.objects for update to authenticated using (bucket_id = 'portfolio-media' and public.is_portfolio_admin()) with check (bucket_id = 'portfolio-media' and public.is_portfolio_admin());
create policy "admins can delete portfolio media" on storage.objects for delete to authenticated using (bucket_id = 'portfolio-media' and public.is_portfolio_admin());

insert into public.site_settings (id) values (1) on conflict (id) do nothing;
