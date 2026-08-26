-- Blog upgrade: posts table + RLS + public image bucket
-- Run in Supabase SQL Editor (or `supabase db push`) AFTER creating the project.
-- Do not run until real SUPABASE_* keys are available.

-- Extensions
create extension if not exists "pgcrypto";

-- Posts
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null,
  content text not null,
  tags text[] not null default '{}'::text[],
  category text not null,
  cover_image text,
  products jsonb not null default '[]'::jsonb,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists posts_published_created_at_idx
  on public.posts (published, created_at desc);

create index if not exists posts_slug_idx
  on public.posts (slug);

-- Keep updated_at fresh
create or replace function public.set_posts_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at
  before update on public.posts
  for each row
  execute function public.set_posts_updated_at();

-- RLS: anon/authenticated can only read published posts.
-- All writes go through the service role (bypasses RLS).
alter table public.posts enable row level security;

drop policy if exists "Public can read published posts" on public.posts;
create policy "Public can read published posts"
  on public.posts
  for select
  to anon, authenticated
  using (published = true);

-- Storage bucket for blog images (public read)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'blog-images',
  'blog-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Public read for blog-images objects
drop policy if exists "Public read blog-images" on storage.objects;
create policy "Public read blog-images"
  on storage.objects
  for select
  to public
  using (bucket_id = 'blog-images');

-- Note: uploads are performed with the service role from Astro admin APIs,
-- which bypasses storage RLS. No insert policy for anon is intentional.
