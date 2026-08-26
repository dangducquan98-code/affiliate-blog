# Kiu Chốt Deal

Blog review gadget & phụ kiện công nghệ đáng tiền (Shopee Affiliate) — Astro + TypeScript, static-first, deploy Vercel.

Brand name hiện tại là **placeholder** (đổi sau khi chốt tên/domain).

## Prerequisites

- Node.js `>= 22.12`
- npm

## Setup

```bash
npm install
cp .env.example .env.local
```

Chỉnh `.env.local`:

- `SITE_URL` — URL canonical (local: `http://localhost:4321`)
- `AFFILIATE_<SLUG>` — destination Shopee (placeholder OK; **không commit** file này)

Ví dụ slug `ugreen-hub-uno` → env key `AFFILIATE_UGREEN_HUB_UNO`.

## Dev

```bash
npm run dev
```

Mở http://localhost:4321

## Build

```bash
npm run build
npm run preview
```

`npm run build` phải pass trước khi merge/`main`.

## Thêm bài viết

1. Tạo file MDX trong `src/content/blog/<slug>.mdx`
2. Frontmatter bắt buộc: `title`, `description`, `date`, `tags`, `category`, `products` (mảng slug `/go/…`), `ogImage` (optional)
3. Thêm disclosure affiliate đầu bài
4. CTA dùng đường dẫn sạch: `[text](/go/<slug>)` — không dán raw affiliate URL vào content

Schema: `src/content.config.ts`

## Thêm affiliate link

1. Thêm metadata vào `src/data/affiliates.yaml` (`slug`, `name`, `category`) — **không** ghi URL
2. Thêm `AFFILIATE_<SLUG_UPPER_WITH_UNDERSCORES>=https://…` vào `.env.local`
3. (Tuỳ chọn) thêm deal vào `src/data/deals.yaml` với `goSlug` trùng slug
4. Trong bài / deals, link tới `/go/<slug>`

Route `/go/[slug]` trả **302** tới URL trong env. Thiếu env → 500; slug không có trong YAML → 404.

## Deal hub

Sửa `src/data/deals.yaml`. Mỗi deal: `name`, `blurb`, `priceHint`, `goSlug`, `tags`, `featured`.

## SEO

- Sitemap: `@astrojs/sitemap` (cần `SITE_URL` đúng)
- `robots.txt` → trỏ sitemap
- Layout: title, description, canonical, Open Graph, Twitter card

## Analytics

`@vercel/analytics` đã gắn trong `BaseLayout`. Trên Vercel, Web Analytics bật trong project dashboard — **không cần** `VERCEL_ANALYTICS_ID` cho setup cơ bản. Local/dev thường không gửi metric production.

## Deploy (sau này)

1. Đẩy repo lên GitHub
2. Import project vào Vercel
3. Khai báo env: `SITE_URL` + toàn bộ `AFFILIATE_*`
4. Deploy từ branch `main` (sau khi chủ dự án duyệt merge)

Hiện tại Phase 2A chỉ làm **local + branch `feature/mvp-scaffold`** — chưa push, chưa tạo remote.

## Stack

- Astro 7 + TypeScript strict
- MDX content collections
- `@astrojs/vercel` (`output: 'server'`, trang content `prerender = true`, `/go` SSR)
- YAML data + env destinations
