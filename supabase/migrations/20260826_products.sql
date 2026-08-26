-- Products catalog for affiliate links (admin-managed Shopee URLs)
-- Run AFTER 20260826_blog_upgrade.sql
-- Do NOT run until Hermes/owner is ready. Code falls back to AFFILIATE_* env if table missing.

create extension if not exists "pgcrypto";

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  category text not null,
  price_hint text not null default '',
  affiliate_url text,
  image text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_slug_idx on public.products (slug);
create index if not exists products_category_idx on public.products (category);

create or replace function public.set_products_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
  before update on public.products
  for each row
  execute function public.set_products_updated_at();

-- RLS: public can read all products (names/prices for blog CTAs).
-- Writes go through service role (bypasses RLS).
alter table public.products enable row level security;

drop policy if exists "Public can read products" on public.products;
create policy "Public can read products"
  on public.products
  for select
  to anon, authenticated
  using (true);

-- Seed gear for TikTok / video content (affiliate_url empty — fill in admin)
insert into public.products (slug, name, category, price_hint, affiliate_url, image)
values
  ('mic-boya-m1', 'Mic cài áo Boya BY-M1', 'mic', '~150–250k', null, null),
  ('mic-wireless-mini', 'Mic không dây mini 2.4G', 'mic', '~250–450k', null, null),
  ('den-ring-light-10', 'Đèn vòng (ring light) 10 inch', 'den', '~120–250k', null, null),
  ('den-led-panel', 'Đèn LED panel softbox nhỏ', 'den', '~200–400k', null, null),
  ('tripod-phone-flexible', 'Tripod điện thoại linh hoạt', 'gimbal-tripod', '~80–180k', null, null),
  ('gimbal-phone-budget', 'Gimbal điện thoại giá mềm', 'gimbal-tripod', '~400–800k', null, null),
  ('phone-clamp-cold-shoe', 'Kẹp điện thoại + cold shoe', 'phu-kien-quay', '~50–120k', null, null),
  ('lav-mic-foam', 'Bọc xốp / wind muff mic lav', 'phu-kien-quay', '~30–80k', null, null),
  ('backdrop-green-portable', 'Phông xanh portable', 'phu-kien-quay', '~150–300k', null, null),
  ('powerbank-pd-20k', 'Pin dự phòng PD 20000mAh', 'phu-kien-quay', '~300–550k', null, null)
on conflict (slug) do update
set
  name = excluded.name,
  category = excluded.category,
  price_hint = excluded.price_hint;
