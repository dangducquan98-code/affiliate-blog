# Đề xuất hiển thị pillars trên blog — Quân Kiu Daily

> **Chỉ đề xuất** — chờ chủ dự án chốt trước khi sửa code/DB.  
> Ngày: 2026-08-28 · Branch: `feature/blog-upgrade`  
> Tham chiếu pillars: `docs/content-pillars.md`

---

## Câu hỏi

**Có nên dùng 6 content pillars làm category chính thay cho 5 category kỹ thuật hiện tại** (`lam-tiktok`, `affiliate`, `review-gear`, `ai-cong-cu`, `deal`) không?

---

## Đề xuất: **Có — pillars làm category chính; `/deals` giữ riêng**

### Lý do

| Tiêu chí | 5 category cũ | 6 pillars mới |
|----------|---------------|---------------|
| Phản ánh blog cá nhân | ❌ Nghe như site hướng dẫn TikTok | ✅ MMO + tư duy + tài chính + đời sống |
| Reader lần đầu | “Blog toàn TikTok?” | “Blog của Quân Kiu — nhiều mảng, TikTok là một phần” |
| Voice DNA | Lệch (thiếu Stoic, nhật ký, tài chính) | Khớp Facebook/podcast samples |
| Affiliate | Gắn với `review-gear` / `deal` | Gắn theo ngữ cảnh từng pillar (MMO, Công nghệ, Review sách) |
| SEO | Tốt cho long-tail TikTok | Thêm cluster tư duy, sách, tài chính VN |

**Giữ `/deals`** như trang utility (catalog sản phẩm + blurb), **không** là pillar thứ 7 — tránh blog trông như shop.

---

## Mapping category cũ → pillar mới

| Category cũ (slug) | Label cũ | → Pillar mới (slug đề xuất) | Label đề xuất |
|--------------------|----------|----------------------------|---------------|
| `lam-tiktok` | Làm TikTok | `mmo` | MMO — Kiếm tiền online |
| `affiliate` | Affiliate & Kiếm tiền | `mmo` | *(gộp vào MMO)* |
| `review-gear` | Review Gear | `cong-nghe` | Công nghệ & Công cụ |
| `ai-cong-cu` | AI & Công cụ | `cong-nghe` | *(gộp vào Công nghệ)* |
| `deal` | Deal / mua sắm | *(không map)* | Giữ route `/deals` — không gán pillar |

**Pillar mới không có category cũ tương ứng** (cần content + taxonomy mới):

| Slug đề xuất | Label | Nguồn bài ban đầu |
|--------------|-------|-------------------|
| `tu-duy` | Phát triển tư duy | `gia-tri-truoc-ban-hang-sau` + bài mới |
| `tai-chinh` | Tài chính cá nhân | Bài mới |
| `review-sach` | Review sách | Mention sách trong bài cũ → bài review riêng |
| `trai-nghiem` | Trải nghiệm & Đời sống | Bài mới / chuyển từ voice sample |

### Map 17 bài → slug pillar (khi migrate DB)

| Pillar slug | Số bài | Slugs |
|-------------|--------|-------|
| `mmo` | 13 | `lam-tiktok-affiliate-tu-0`, `khoa-hoc-tao-hook-diamondhook`, `tong-hop-cau-hook-tiktok`, `huong-dan-viet-mo-ta-video-seo`, `faq-bat-dau-affiliate`, `hau-truong-1-video-30-giay`, `5-sai-lam-review`, `hanh-trinh-4k-follow`, `7-ngay-affiliate`, `tiktok-kich-ban-quay-ngan`, `tiktok-hook-3-giay`, `tiktok-chon-san-pham-review`, `huong-dan-honeygain-treo-may` |
| `tu-duy` | 1 | `gia-tri-truoc-ban-hang-sau` |
| `cong-nghe` | 3 | `20-mon-do-lam-video-tiktok`, `text-to-speech-ai-thu-am`, `review-mic-boya-by-m1` |
| `tai-chinh` | 0 | — |
| `review-sach` | 0 | — |
| `trai-nghiem` | 0 | — |

---

## Slug pillar đề xuất (6 mục)

```ts
// Đề xuất thay thế CATEGORIES trong src/lib/categories.ts
[
  { slug: 'mmo', label: 'MMO — Kiếm tiền online', ... },
  { slug: 'tu-duy', label: 'Phát triển tư duy', ... },
  { slug: 'tai-chinh', label: 'Tài chính cá nhân', ... },
  { slug: 'review-sach', label: 'Review sách', ... },
  { slug: 'cong-nghe', label: 'Công nghệ & Công cụ', ... },
  { slug: 'trai-nghiem', label: 'Trải nghiệm & Đời sống', ... },
]
```

**URL:** Giữ pattern hiện tại `/category/[slug]` → `/category/mmo`, `/category/tu-duy`, …

**Redirect 301 (khi migrate):** `/category/lam-tiktok` → `/category/mmo`, `/category/affiliate` → `/category/mmo`, `/category/review-gear` → `/category/cong-nghe`, `/category/ai-cong-cu` → `/category/cong-nghe`.

---

## Thay đổi UI / code cần thiết (khi được duyệt)

### 1. `src/lib/categories.ts`

- Thay `CATEGORIES` 5 mục bằng 6 pillars (slug + label + description 2 câu).
- Cập nhật `DEFAULT_CATEGORY_SLUG` → `mmo` (thay `lam-tiktok`).
- Giữ API `getCategoryBySlug`, `categorySelectOptions` — admin dùng chung source.

### 2. `src/lib/post-category-map.ts`

- Đổi `POST_CATEGORY_BY_SLUG` map slug bài → pillar slug.
- Thêm `LEGACY_CATEGORY_MAP` mở rộng: category cũ → pillar (query/filter backward compatible trong giai đoạn chuyển).

### 3. Routes & pages

| File | Thay đổi |
|------|----------|
| `src/pages/category/[slug].astro` | Filter theo pillar slug; hero description theo pillar |
| `src/pages/categories/index.astro` | Grid 6 pillar cards (icon/emoji optional); mô tả ngắn từ `categories.ts` |
| `src/pages/sitemap.xml.ts` | URLs category mới |
| `src/middleware.ts` | Redirect 301 category cũ → pillar (nếu có) |

### 4. `src/components/Header.astro`

- Nav **“Chủ đề”** → `/categories` (không đổi label).
- *Tùy chọn phase 2:* dropdown 6 pillars trên desktop (tránh nav quá dài).

### 5. Homepage `src/pages/index.astro`

- Hero value prop: mở rộng ngoài TikTok — ví dụ *“MMO, tư duy, tài chính, sách hay — từ kênh TikTok ~4K và đời thường văn phòng.”*
- Pillar card “Bắt đầu từ đây”: giữ link `lam-tiktok-affiliate-tu-0` nhưng gắn badge **MMO**.
- *Tùy chọn:* 6 pillar cards thay vì 1 pillar TikTok duy nhất.

### 6. Admin

| File | Thay đổi |
|------|----------|
| `src/scripts/admin-post-editor.ts` | Select category = 6 pillars |
| `src/pages/admin/posts/*.astro` | Label filter theo pillar |
| Publish guard | Giữ rule affiliate theo `content-quality-notes` |

### 7. DB Supabase (`posts.category`)

- Migration script: `UPDATE posts SET category = '<pillar>' WHERE slug IN (...)`.
- Chạy sau khi chủ dự án duyệt mapping bảng trên.
- **Không** đổi slug bài — chỉ đổi field `category`.

### 8. Clusters & related posts

| File | Thay đổi |
|------|----------|
| `src/lib/content-clusters.ts` | Giữ cluster theo **slug bài** (không phụ thuộc category); có thể thêm cluster `tu-duy`, `review-sach` sau |
| `RelatedPosts.astro` | Ưu tiên cluster trước, pillar sau |

### 9. Tests

- `src/lib/categories.test.ts` — 6 pillars, redirect aliases.
- Cập nhật snapshot nếu có.

---

## Phương án thay thế (nếu chưa muốn đổi DB ngay)

**Hybrid tạm thời:**

1. Giữ 5 category DB như cũ.
2. Thêm layer `pillar` (field mới hoặc map client-side) chỉ cho UI `/categories`.
3. Nhược: 2 hệ taxonomy song song — dễ lệch admin vs public.

→ **Không khuyến nghị** trừ khi cần ship UI trước content pillar mới.

---

## Wireframe điều hướng đề xuất

```
Header: Trang chủ | Blog | Chủ đề | Deals | Về Kiu
                              ↓
                    /categories (6 cards)
                    ┌─────────┬─────────┬─────────┐
                    │  MMO    │ Tư duy  │ Tài chính│
                    ├─────────┼─────────┼─────────┤
                    │Review   │ Công nghệ│Trải nghiệm│
                    │ sách    │ & Công cụ│ & Đời sống│
                    └─────────┴─────────┴─────────┘
                              ↓
                    /category/mmo (list bài)
```

**Deals:** vẫn `/deals` — link “Đọc bài liên quan” về pillar Công nghệ hoặc MMO.

---

## Checklist quyết định cho chủ dự án

- [ ] Chốt 6 pillar (có bỏ/đổi tên **Trải nghiệm** hoặc **Công nghệ** không?)
- [ ] Chốt slug tiếng Việt không dấu (`mmo`, `tu-duy`, …)
- [ ] Có migrate DB `posts.category` một lần vs hybrid
- [ ] Có redirect 301 category cũ không
- [ ] Homepage: 1 hub MMO vs grid 6 pillars
- [ ] `/deals` giữ nguyên (đề xuất: **có**)

---

## Tóm tắt đề xuất hiển thị

| Hạng mục | Đề xuất |
|----------|---------|
| Category chính | **6 pillars** thay 5 category kỹ thuật |
| `/deals` | Giữ — không là pillar |
| Route | Giữ `/category/[slug]`, slug mới |
| DB | Đổi `posts.category` theo bảng map (17 bài) |
| Header | Giữ link “Chủ đề”; optional dropdown sau |
| Homepage | Cập nhật copy + badge pillar; optional 6 cards |
| Redirect | 301 từ 4 slug category cũ sang pillar |

**Effort ước lượng:** M (1–2 ngày dev + script migrate + test) nếu không làm dropdown phức tạp.
