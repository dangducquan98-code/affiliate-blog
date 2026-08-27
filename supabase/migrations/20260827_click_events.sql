-- Click events for /go affiliate redirects (server-side logging only)
-- Do NOT run until Hermes/owner is ready. App treats missing table as soft-fail.

create extension if not exists "pgcrypto";

create table if not exists public.click_events (
  id uuid primary key default gen_random_uuid(),
  slug text not null,
  referrer text null,
  utm_source text null,
  utm_medium text null,
  utm_campaign text null,
  created_at timestamptz not null default now()
);

create index if not exists click_events_slug_created_at_idx
  on public.click_events (slug, created_at desc);

-- RLS on; no anon/authenticated policies — only service role (bypasses RLS) may write/read.
alter table public.click_events enable row level security;
