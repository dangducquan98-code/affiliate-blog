# Quân Kiu Daily

Blog review gadget & phụ kiện công nghệ đáng tiền (Shopee Affiliate) — Astro 7 + TypeScript + Supabase, deploy Vercel.

## Prerequisites

- Node.js `>= 22.12`
- npm
- (Khi sẵn sàng) Supabase project

## Setup

```bash
npm install
cp .env.example .env.local
```

Chỉnh `.env.local` (xem mục Env bên dưới). Với placeholder, site vẫn **build và chạy**; blog list/detail hiện thông báo fallback cho đến khi có keys thật.

## Dev

```bash
npm run dev
```

Mở http://localhost:4321 — Admin: http://localhost:4321/admin (mật khẩu = `ADMIN_PASSWORD`).

## Build

```bash
npm run build
npm run preview
```

`npm run build` phải pass trước khi merge `main`.

## Env cần điền

| Biến | Mục đích |
|------|----------|
| `SITE_URL` | Canonical / OG / sitemap |
| `AFFILIATE_<SLUG>` | Destination Shopee cho `/go/<slug>` |
| `SUPABASE_URL` | Project URL |
| `SUPABASE_ANON_KEY` | Public read (published posts) |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin write + upload (server only) |
| `ADMIN_PASSWORD` | Mật khẩu đăng nhập `/admin` |
| `ADMIN_SESSION_SECRET` | Ký cookie session (đặt chuỗi dài, riêng biệt) |

**Không commit** `.env.local`.

## Supabase SQL migration

1. Tạo project trên Supabase
2. Mở SQL Editor (hoặc CLI `supabase db push`)
3. Chạy toàn bộ file:

`supabase/migrations/20260826_blog_upgrade.sql`

File tạo:

- bảng `posts` + index + trigger `updated_at`
- RLS: anon/authenticated chỉ `SELECT` khi `published = true`
- bucket Storage `blog-images` (public read)

## Migrate 5 bài MDX cũ → DB

Sau khi SQL + env thật:

```bash
npm run migrate:posts
```

Script đọc `src/content/blog/*.mdx`, map `products` → `{name, priceHint, goSlug}` từ YAML, upsert theo `slug`, `published: true`.

## Admin

1. Mở `/admin` → redirect login nếu chưa có session
2. Đăng nhập bằng `ADMIN_PASSWORD`
3. Viết / sửa bài (Markdown textarea), gắn products `{name, priceHint, goSlug}`
4. Upload ảnh cover → bucket `blog-images`
5. Toggle Publish / Unpublish

API admin dùng **service role** và chỉ chạy sau khi cookie session hợp lệ.

## Affiliate links (`/go`)

Giữ nguyên:

1. Metadata: `src/data/affiliates.yaml`
2. Destination: `AFFILIATE_*` trong `.env.local`
3. Content / products dùng `/go/<slug>` — không dán raw affiliate URL

## Deal hub

Sửa `src/data/deals.yaml` (chưa chuyển sang DB ở phase này).

## SEO

- Layout: title, description, canonical, Open Graph, Twitter
- Article JSON-LD trên trang bài
- Dynamic `/sitemap.xml` (static routes + published posts)
- `robots.txt` → `/sitemap.xml`

## Ảnh

Component `BlogImage.astro` append `?width=&quality=` (Supabase Image Transformations) lên URL public Storage.

## Deploy (sau khi chủ dự án duyệt)

1. Điền env thật trên Vercel (`SITE_URL`, `SUPABASE_*`, `ADMIN_*`, `AFFILIATE_*`)
2. Chạy SQL migration + `npm run migrate:posts` (local hoặc CI one-shot)
3. Merge `feature/blog-upgrade` → `main` sau khi duyệt
4. Vercel auto-deploy từ `main`

## Stack

- Astro 7 (`output: 'server'`) + `@astrojs/vercel`
- Supabase Postgres + Storage
- Markdown (`marked`) SSR
- Admin session cookie (HMAC) + `ADMIN_PASSWORD`
