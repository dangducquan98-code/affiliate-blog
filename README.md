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
| `AFFILIATE_<SLUG>` | Fallback destination Shopee cho `/go/<slug>` (khi DB chưa có URL) |
| `SUPABASE_URL` | Project URL |
| `SUPABASE_ANON_KEY` | Public read (published posts + products) |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin write + upload (server only) |
| `ADMIN_PASSWORD` | Mật khẩu đăng nhập `/admin` |
| `ADMIN_SESSION_SECRET` | Ký cookie session (đặt chuỗi dài, riêng biệt) |

**Không commit** `.env.local`.

## Supabase SQL migration

Chạy **theo thứ tự** trong SQL Editor (hoặc CLI):

1. `supabase/migrations/20260826_blog_upgrade.sql` — bảng `posts`, RLS, bucket `blog-images`
2. `supabase/migrations/20260826_products.sql` — bảng `products`, RLS SELECT, seed 10 gear quay video

**Lưu ý:** Nếu chưa chạy (2), admin `/admin/products` và join catalog sẽ báo bảng thiếu — **không crash** `/go` (vẫn fallback env).

File products tạo:

- bảng `products` (`slug` unique, `affiliate_url` nullable, `price_hint`, `image`…)
- index `slug`, `category`
- RLS: anon/authenticated `SELECT` all; write qua service role
- seed gear (`affiliate_url` trống — điền trong admin)

## Migrate 5 bài MDX cũ → DB

Sau khi SQL posts + env thật:

```bash
npm run migrate:posts
```

Script đọc `src/content/blog/*.mdx`, lưu `products` dạng `[{ "slug": "..." }]`, upsert theo `slug`, `published: true`.

## Seed series TikTok (3 bài đầu)

Sau khi **cả hai** migration + env thật:

```bash
npm run seed:tiktok-series
```

Outline đầy đủ: `docs/content-series-tiktok.md`. Giọng văn: `docs/voice-profile-quankiu.md`.

## Admin

1. Mở `/admin` → login bằng `ADMIN_PASSWORD`
2. **Quản lý sản phẩm** (`/admin/products`): CRUD catalog, dán `affiliate_url` Shopee
3. Viết / sửa bài (Markdown textarea), **chọn sản phẩm từ catalog** (checkbox theo slug)
4. Upload ảnh cover → bucket `blog-images`
5. Toggle Publish / Unpublish

API admin dùng **service role** sau khi cookie session hợp lệ.

`posts.products` lưu `[{ "slug": "mic-boya-m1" }]`. Item legacy `{name, priceHint, goSlug}` vẫn render được.

## Affiliate links (`/go`)

Thứ tự resolve:

1. `products.affiliate_url` trong DB (nếu có và không rỗng)
2. Fallback `AFFILIATE_<SLUG>` trong env
3. 404 nếu không có metadata (DB hoặc `affiliates.yaml`); 500 nếu có metadata nhưng thiếu URL

`src/data/affiliates.yaml` giữ cho deal hub / metadata cũ. Product mới chỉ cần trong DB.

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

1. Điền env thật trên Vercel (`SITE_URL`, `SUPABASE_*`, `ADMIN_*`, `AFFILIATE_*` fallback)
2. Chạy SQL migrations (posts → products) + `migrate:posts` / `seed:tiktok-series` nếu cần
3. Merge `feature/blog-upgrade` → `main` sau khi duyệt
4. Vercel auto-deploy từ `main`

## Stack

- Astro 7 (`output: 'server'`) + `@astrojs/vercel`
- Supabase Postgres + Storage
- Markdown (`marked`) SSR
- Admin session cookie (HMAC) + `ADMIN_PASSWORD`
- Products catalog + `/go` DB→env fallback
