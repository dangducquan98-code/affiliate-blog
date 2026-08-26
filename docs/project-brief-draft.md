# Project Brief Draft — Affiliate Blog Quân Kiu

> **Trạng thái:** DRAFT dựa trên giả định hợp lý (Phase 1 Discovery) — chưa phải design chốt.  
> **Nguồn:** AGENTS.md + kho TikTok (hook/kịch bản) + Ads & Affiliate (cookie Shopee, landing/conversion).  
> **Ngày:** 2026-08-26  
> **Phụ thuộc:** Trả lời `docs/interview-questionnaire.md` để nâng draft → brief chốt.

---

## 1. Tóm tắt điều hành

Blog consumer **mới** (tách quanlamba.com) để kéo traffic TikTok/Facebook → gắn **Shopee Affiliate cookie**. Content-first (review, so sánh, deal), mobile-first, SEO + tốc độ, affiliate qua `/go/<slug>`, deploy GitHub `main` → Vercel.

**Giả định đang dùng:** Niche gadget giá rẻ · stack Astro · MVP = homepage + 5 bài + deals + redirect + SEO cơ bản.

---

## 2. Niche đề xuất

### Lựa chọn 1 (khuyến nghị): Gadget & phụ kiện công nghệ “đáng tiền”

**Phạm vi:** Củ sạc / cáp, hub USB-C, tai nghe, gậy selfie, phụ kiện laptop–điện thoại, đồ tech dưới ~500–800k.

| Tiêu chí | Đánh giá |
|----------|----------|
| Khớp TikTok hiện tại | Cao — hub UGREEN, Basefast, GOOJODOQ, tai nghe… đã có kịch bản |
| Affiliate Shopee | Cao — danh mục nóng, mua impulse, cookie dễ “ăn” đơn sau |
| SEO dễ thắng | Trung–cao — long-tail VN ít báo lớn cover sâu (“hub MacBook dưới 600k”, “sạc 20W có cháy máy không”) |
| Tone Quân Kiu | Khớp — thân mật “anh em”, số liệu giá, FOMO sale |

**Positioning 1 câu:** *“Review gadget Shopee thật tay — nói rõ đáng mua / không đáng, kèm deal đang chạy.”*

### Lựa chọn 2 (mở rộng tháng 2+): Đồ tiện ích nhà cửa & lifestyle

Đèn decor, vệ sinh, bếp nhỏ, “đồ nhà thông minh giá hạt dẻ” — đã có trong kho TikTok cũ. Dùng làm **pillar phụ** trên cùng site (`/category/nha-cua`), không tách blog thứ hai.

### Không khuyến nghị Phase 1

- Niche “đa ngành deal Shopee” quá rộng → SEO và brand loãng.  
- Fashion-only → lệch phần lớn video tech gần đây.  
- Trùng BA/ERP với quanlamba.com.

---

## 3. Tech stack đề xuất

### So sánh ngắn cho use case này

| Tiêu chí | Next.js | Astro | Hugo |
|----------|---------|-------|------|
| SEO / HTML tĩnh | Tốt (SSG/SSR) | Rất tốt (static-first) | Rất tốt |
| Tốc độ mobile | Tốt nếu tối ưu | Xuất sắc (ít JS mặc định) | Xuất sắc |
| Vercel | Native nhất | Hỗ trợ tốt | Được (ít “native” hơn) |
| MDX / content DX | Tốt | Rất tốt | Trung bình (template Go) |
| `/go/<slug>` redirect | Middleware dễ | Redirect/config hoặc endpoint nhỏ | Host redirects / shortcode |
| Học thêm vs quanlamba | React/TS | Front-end hiện đại, vừa phải | Quen Hugo nhưng khác ecosystem Vercel |
| Overkill risk | Cao nếu chỉ blog | Thấp | Thấp về runtime, cao về DX affiliate |

### Chọn: **Astro + Markdown/MDX + TypeScript nhẹ**

**Lý do:** Blog content-first, mobile-first, cần LCP nhanh khi user từ TikTok; island architecture đủ cho filter deals đơn giản sau này; Vercel deploy chuẩn; affiliate manager Phase 1 = file YAML + redirect, không cần React full-app.

**Fallback:** Nếu Quân muốn một codebase React thống nhất cho experiment sau → **Next.js App Router**. Không chọn Hugo Phase 1 trừ khi ưu tiên tái sử dụng kỹ năng quanlamba hơn DX affiliate.

**Analytics:** Vercel Analytics + UTM social + đếm click `/go/<slug>` (log/analytics event đơn giản).

**Secrets:** Affiliate destination URLs trong `.env.local` hoặc file local gitignored — **không commit** raw Shopee affiliate URL.

---

## 4. Cấu trúc site sơ bộ

### Pages / routes

| Route | Mục đích |
|-------|----------|
| `/` | Hero brand + bài mới + CTA Deal hub + social proof ngắn |
| `/blog` hoặc `/reviews` | Danh sách bài |
| `/blog/[slug]` | Bài viết (Review / So sánh / Hướng dẫn) |
| `/deals` | Deal hub — list sản phẩm đang đẩy |
| `/deals/[category]` (sau) | Lọc category |
| `/go/[slug]` | Redirect 302 → URL affiliate (clean URL) |
| `/about` | Quân Kiu là ai + disclaimer affiliate |
| `/privacy` (MVP nhẹ) | Cookie/analytics disclosure |
| `/sitemap.xml`, `/robots.txt` | SEO bắt buộc |

### Content types

1. **Review** — 1 sản phẩm, Pros/Cons, “nên mua nếu…”, CTA `/go/…`  
2. **So sánh** — 2–3 sp cùng nhu cầu  
3. **Listicle / Deal roundup** — “5 món đáng mua tuần này”  
4. **Hướng dẫn** — “cách chọn củ sạc cho iPhone” (evergreen SEO)

### Frontmatter tối thiểu (mỗi bài)

`title`, `description`, `date`, `updated`, `tags`, `category`, `ogImage`, `products[]` (slug `/go/`), `canonical` (auto từ SITE_URL).

### Affiliate link strategy

```
Content CTA  →  /go/ugreen-hub-uno  →  302  →  Shopee affiliate URL (env/map)
```

- Map slug → destination: `src/data/affiliates.yaml` (hoặc JSON) **chỉ chứa slug + metadata**; secret URL inject lúc build từ env, hoặc file `affiliates.local.yaml` gitignored.  
- Disclosure đầu mỗi bài.  
- Không nhồi >3–4 CTA/bài; link tự nhiên trong đoạn “mình dùng thật”.  
- UTM: `?utm_source=tiktok&utm_medium=bio` trên link vào blog; sub-tracking phía Shopee nếu platform cho phép.

### Deal hub

- Data: `src/data/deals.yaml` — `name`, `blurb`, `priceHint`, `goSlug`, `tags`, `featured`.  
- UI: list đơn giản, mobile-first, **không card-heavy dashboard**; 1 CTA/sp “Xem trên Shopee”.

### SEO bắt buộc

Title, meta description, OG/Twitter, canonical, sitemap, JSON-LD `Article` / `Review` / `Product` khi hợp lý.

---

## 5. Content strategy 30 ngày đầu

**Nhịp:** Tuần 1–2: 3–4 bài/tuần · Tuần 3–4: 2 bài/tuần + 1 deal roundup.  
**Flywheel:** Video TikTok → bài blog cùng SP → bio/comment trỏ bài hoặc `/deals`.

### Ý bài cụ thể (niche gadget) + hook style TikTok

| # | Tiêu đề bài (SEO) | Góc / format | Hook mở (style Quân Kiu) |
|---|-------------------|--------------|---------------------------|
| 1 | Củ sạc 20W cho iPhone: mua loại nào dưới 200k không sợ cháy máy? | So sánh / hướng dẫn | “90% người dùng iPhone đang sạc sai cách khiến pin chai nhanh gấp đôi…” |
| 2 | Review hub USB-C UGREEN Uno 6-in-1: đáng 500k với MacBook Air M1 không? | Review sâu | “MacBook chỉ vài cổng mà cần cắm cả đống thiết bị — mình test hub 6 trong 1 này một tuần…” |
| 3 | Tai nghe Bluetooth dưới 300k: 3 tiêu chí mình không bao giờ bỏ qua | Listicle + affiliate | “Đừng mua tai nghe rẻ chỉ vì sale — thiếu 3 tiêu chí này là phí tiền anh em ơi.” |
| 4 | Gậy selfie mini Bluetooth: đồ “vô dụng” hay cứu cánh đi chơi? | Review trải nghiệm | “Mình từng chê gậy selfie… đến khi đi một mình mà vẫn có ảnh đẹp.” |
| 5 | Cáp sạc iPhone đứt hoài? Cách chọn dây silicon bền dưới 100k | Hướng dẫn | “Dây cứng gãy sau 2 tháng — mình đổi sang loại này và đây là kết quả.” |
| 6 | Hub HDMI 4K cho laptop: cần 60Hz thật không hay chỉ marketing? | So sánh kỹ thuật nhẹ | “Quảng cáo ghi 4K nhưng hình giật — đây là cách tự check trong 2 phút.” |
| 7 | 5 phụ kiện desk setup dưới 500k đáng tiền cho dân WFH | Deal roundup | “Setup nhìn ‘pro’ không cần đổ triệu — 5 món mình đang để trên bàn.” |
| 8 | Basefast vs củ sạc no-name: chênh 50k có đáng? | So sánh | “Rẻ hơn 50k nhưng thiếu chứng chỉ — mình vẫn chọn cái đắt hơn, lý do…” |
| 9 | Deal tuần này: 5 món gadget Shopee mình đang để giỏ | Deal hub sync | “Giỏ hàng tuần này của mình — anh em khỏi lướt mỏi tay.” |
| 10 | Từ TikTok vào Shopee: cách xem review thật trước khi bấm mua | Trust / evergreen | “Trước khi bấm mua theo video, mình check 4 chỗ này để khỏi hố.” |

**Tone bài viết:** Giữ giọng nói chuyện (“anh em”, số giá cụ thể, “giá có thể đổi khi hết sale”); dài hơn TikTok nhưng đoạn ngắn, bullet Pros/Cons, CTA rõ.

---

## 6. Roadmap triển khai (writing-plans style)

> Task kích thước ~2–5 phút hành động; chưa phải plan code đầy đủ — chỉ roadmap Phase.  
> **Không code** cho đến khi questionnaire + brief được duyệt.

### Phase 0 — Discovery & chốt hướng *(hiện tại)*

- [ ] Đọc AGENTS.md + skills brainstorming / writing-plans  
- [ ] Hoàn thành `docs/interview-questionnaire.md` (Quân trả lời)  
- [ ] Duyệt / chỉnh `docs/project-brief-draft.md` → đổi tên thành brief chốt  
- [ ] Viết design spec: `docs/superpowers/specs/YYYY-MM-DD-affiliate-blog-design.md`  
- [ ] Viết implementation plan: `docs/superpowers/plans/YYYY-MM-DD-mvp-scaffold.md`  
- [ ] Tạo worktree/branch feature (không commit thẳng `main`)

**Done khi:** Quân approve spec + plan.

### Phase 1 — MVP scaffold (Astro + Vercel)

- [ ] `npm create astro@latest` (template minimal + TS) trong worktree  
- [ ] Thêm layout mobile-first + biến CSS brand (tránh purple/cream AI-default)  
- [ ] Cấu hình `SITE_URL`, sitemap, robots  
- [ ] Trang `/`, `/about`, `/blog`, `/blog/[slug]` đọc MDX  
- [ ] Schema frontmatter + 1 bài mẫu (RED: test build có article)  
- [ ] `src/data/affiliates` map + route `/go/[slug]` 302  
- [ ] Trang `/deals` đọc YAML  
- [ ] Vercel Analytics + UTM docs trong README  
- [ ] Deploy preview Vercel; verify curl `/go/test` → đúng Location  
- [ ] PR → Quân duyệt → merge `main`

**Done khi:** 5 bài thật + deals + redirect + SEO tags live trên production.

### Phase 2 — Content flywheel 30 ngày

- [ ] Pipeline: kịch bản TikTok → outline blog → MDX  
- [ ] Template Pros/Cons + disclosure  
- [ ] Tuần 1–2: publish theo bảng mục 5  
- [ ] Bio TikTok/Facebook → `/` hoặc `/deals` kèm UTM  
- [ ] Đo: top landing, click `/go`, nguồn traffic

**Done khi:** ≥8 bài + 1 deal roundup/tuần; có số liệu tuần 2.

### Phase 3 — Tối ưu conversion & SEO

- [ ] JSON-LD Review/Product nơi phù hợp  
- [ ] OG image mặc định + per-post  
- [ ] Internal linking deals ↔ reviews  
- [ ] Category pages nếu traffic đủ  
- [ ] Xem xét Next.js chỉ nếu cần app feature thật

**Done khi:** Core Web Vitals ổn trên mobile; ≥1 bài organic có impression Search Console.

### Phase 4+ (ngoài MVP — YAGNI đến khi có data)

- Paid popunder/native vào pre-landing blog (kiến thức Ads workspace)  
- Newsletter / lead magnet  
- CMS nếu catalog > ~50 sp  
- Lazada song song  

---

## 7. Định nghĩa thành công (90 ngày)

| Chỉ số | Mục tiêu định hướng |
|--------|---------------------|
| Traffic | Có traffic lặp lại từ TikTok/Facebook (đo UTM) |
| Cookie funnel | Click `/go` ổn định tuần; Shopee báo cáo có đơn attributed |
| Content | 15–25 URL indexable chất lượng |
| Tech | LCP mobile tốt; deploy tự động từ `main` |
| Brand | Người đọc không nhầm với quanlamba.com |

---

## 8. Rủi ro & giả định mở

| Rủi ro | Giảm thiểu |
|--------|------------|
| Niche chưa khớp audience thật | Questionnaire Câu 1–2; pivot pillar phụ nhà cửa sau 30 ngày data |
| Policy Shopee / disclosure | Disclosure rõ; không incentive ảo; không raw spam link |
| Commit nhầm affiliate URL | `.gitignore` `.env*`; review PR bắt buộc |
| Overbuild CMS/auth | Giữ YAML Phase 1–2 |
| Brand/domain chậm chốt | Dùng `SITE_URL` tạm; nội dung không hardcode domain |

---

## 9. Quyết định cần Quân duyệt ngay

1. **Niche:** Chọn Lựa chọn 1 (gadget) hay đổi?  
2. **Stack:** Astro (đề xuất) vs Next.js?  
3. **MVP scope:** Đúng Phase 1 mục 6?  
4. **Tên brand / domain** (có thể trả lời sau niche).  

→ Điền bảng trả lời trong `docs/interview-questionnaire.md`, rồi báo agent để khóa design spec.

---

*File này là draft brainstorming artifact — chưa phải lệnh triển khai code.*
