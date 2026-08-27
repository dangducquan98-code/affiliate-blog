# Audit toàn diện — Quân Kiu Daily (2026-08-27)

> Phạm vi: codebase `feature/blog-upgrade` / `main` đã deploy, DB Supabase `dglkxyldsuljiatlrydg`, production `https://quankiu-daily.vercel.app`.  
> Phương pháp: đọc code + query service role + curl production + web research (nguồn trích dẫn ở cuối từng mục / mục Nguồn).  
> **Không sửa code/DB trong audit này.**

---

## Tóm tắt điều hành

Blog đã có nền tảng kỹ thuật vững (Astro 7 + Supabase + Vercel + admin CRUD + categories + sitemap/robots + Article JSON-LD + Vercel Analytics). Nội dung 14 bài published khá sâu (~1000–1600 từ), content-first tốt.

**Nút thắt số 1 (monetization đã gãy):** hầu hết CTA `/go/<slug>` trên bài TikTok/gear đang **HTTP 500** vì 14/14 products trong DB **không có `affiliate_url`**, và env chỉ còn link placeholder của catalog MVP cũ (củ sạc, hub…). Deal hub vẫn đẩy catalog cũ — lệch với nội dung hiện tại.

**Nút thắt số 2 (growth):** chưa đo click affiliate; chưa UTM TikTok/FB; homepage messaging vẫn “review gadget sạc/hub” trong khi 8/14 bài là “Làm TikTok”; không có internal link giữa bài; 0 cover image.

---

## Hiện trạng đã xác minh

| Thành phần | Bằng chứng |
|---|---|
| Posts | DB: **14** bài, **14 published**, 0 draft |
| Products | DB: **14** sản phẩm; **0/14** có `affiliate_url`; **0/14** có image |
| Categories | Code: 5 (`lam-tiktok` 8, `affiliate` 4, `review-gear` 1, `ai-cong-cu` 1, `deal` **0**) |
| Production | `/` `/blog` `/categories` `/category/lam-tiktok` 200; `/admin` → 302 login; sitemap 24 URL; robots OK |
| `/go` live | `mic-boya-m1`, `den-ring-light-10`, `diamondhook-bo-the` → **500**; `cu-sac-20w` → 302 `s.shopee.vn/placeholder-…` |
| Analytics | `<vercel-analytics>` + Speed Insights script có trong HTML production |
| Cover / OG | 14/14 posts `cover_image = null`; OG = `/og-default.svg` |
| Internal `/blog/...` trong body | **0** link chéo giữa bài (query content) |

---

## 1. Technical & Performance

### Điểm mạnh
- Stack đúng hướng Vercel: Astro 7 + `@astrojs/vercel`, `output: 'server'`, `/go` SSR 302 (`src/pages/go/[slug].ts`).
- Sitemap động từ DB + categories (`src/pages/sitemap.xml.ts`), `Cache-Control: public, max-age=300`.
- Robots cho phép crawl + trỏ sitemap (`src/pages/robots.txt.ts`).
- Image component đã có hook transform (`BlogImage.astro` + `withImageTransform`).
- Unit tests nhỏ cho products/categories; admin auth tách cookie.

### Điểm yếu / lỗ hổng
1. **Không có CDN cache cho HTML public** — production headers: `cache-control: public, max-age=0, must-revalidate`, `x-vercel-cache: MISS`. TTFB đo được: `/` ~1.04s, `/blog` ~1.73s, bài viết ~0.9–1.1s (cold/warm hỗn hợp). Với traffic TikTok mobile, bounce tăng mạnh khi load > ~3s ([TikAdTools / Think with Google](https://tikadtools.com/blog/tiktok-ads-landing-page/)).
2. **Gần như mọi trang content đều `prerender = false`** — mỗi request hit serverless + Supabase; chưa dùng Astro route caching / `Vercel-CDN-Cache-Control` ([Astro caching](https://docs.astro.build/en/guides/caching/), [Vercel Astro](https://vercel.com/docs/frameworks/frontend/astro)).
3. **Supabase Image Transform dùng sai dạng URL** — `withImageTransform` chỉ gắn `?width=&quality=` lên path `/storage/v1/object/public/...`. Docs chính thức yêu cầu path `/storage/v1/render/image/public/...` ([Supabase Image Transformations](https://supabase.com/docs/guides/storage/serving/image-transformations)). Hiện chưa lộ bug vì **chưa có cover/image nào trên production**.
4. **Fonts Google sync trong `<head>`** — Be Vietnam Pro + DM Sans từ fonts.googleapis.com (không `font-display` chiến lược ngoài query sẵn có) → rủi ro LCP trên mobile VN.
5. Homepage “Deal nổi bật” **không có nút `/go`** (chỉ list YAML), trong khi `/deals` mới có CTA — funnel lệch.

### Cơ hội
- Cache ngắn (60–300s + SWR) cho `/`, `/blog`, `/blog/[slug]`, `/category/*`; invalidate khi publish.
- Sửa `withImageTransform` → `render/image` trước khi upload cover hàng loạt.
- Self-host 1–2 font weights hoặc dùng `font-display: swap` + subset.

---

## 2. SEO

### Điểm mạnh
- Mỗi trang có `title`, `meta description`, `canonical`, OG/Twitter đầy đủ, `og:locale=vi_VN` (`BaseLayout.astro`).
- Bài viết: `og:type=article` + **JSON-LD `Article`** (headline, dates, author Quân Kiu, publisher, image).
- Sitemap gồm static + 5 category + 14 posts; robots đúng.
- Category pages có title/description riêng từ `CATEGORIES` — tốt cho topical landing.
- Title/description bài viết tiếng Việt, dài vừa, mang long-tail tự nhiên (“hook TikTok”, “mô tả video SEO”, “mic/đèn/tripod”).

### Điểm yếu / lỗ hổng
1. **OG image yếu:** toàn site + mọi bài dùng `og-default.svg` — share TikTok/FB kém hấp dẫn; SVG OG không tối ưu mọi crawler.
2. **Không có JSON-LD `Product` / `Review` / `ItemList`** — dù có block “Sản phẩm đề xuất” và deal hub. Thiếu tín hiệu rich result mua sắm.
3. **Không có `BreadcrumbList`**, không có “related posts”.
4. **Internal linking = 0** giữa 14 bài — cluster chưa “dính”; pillar strategy yêu cầu link 2 chiều ([VMST topic cluster 2026](https://vmst.com.vn/topic-cluster-pillar-content-2026/), [Techzika content pillar](https://techzika.com/marketing/content-pillar/)).
5. **Keyword / positioning lệch brand:** homepage + `/blog` description vẫn nhấn “củ sạc, hub, tai nghe” trong khi corpus thực tế là TikTok + affiliate mindset + gear creator. Rủi ro intent mismatch khi traffic từ social/search.
6. Category `deal` trong sitemap nhưng **0 bài** — trang trống làm loãng topical authority.
7. Chưa thấy bằng chứng Search Console / index monitoring trong repo hoặc admin.

### Cơ hội (keyword coverage — quan sát 14 bài)
| Cluster (đề xuất pillar) | Đã có | Thiếu rõ |
|---|---|---|
| Làm TikTok (hook → kịch bản → SEO mô tả → hậu trường) | 8 bài mạnh | Pillar “tổng quan làm TikTok affiliate từ 0”; CapCut how-to; caption/comment CTA |
| Affiliate mindset | 4 bài | Cookie Shopee giải thích sâu; case study đơn thật (số liệu) |
| Review gear | 1 listicle | So sánh A vs B (mic dây/không dây, ring vs panel); review đơn mic/đèn/tripod |
| AI & công cụ | 1 TTS | CapCut AI, workflow script |
| Deal / mua sắm | 0 | Bài deal theo nỗi đau (không catalogue) |

Long-tail VN đang phủ khá tốt ở “cách làm”, chưa phủ “so sánh / nên mua cái nào” — đúng chỗ ra đơn affiliate ([Yotpo long-tail 2026](https://www.yotpo.com/blog/long-tail-keywords-guide/), [docs/content-ideas.md](./content-ideas.md)).

---

## 3. Content

### Điểm mạnh
- Độ dài thực dụng: ~1011–1593 từ/bài; giọng “mình/bạn”, tình huống thật — khớp `docs/content-quality-notes.md` và voice profile.
- Series TikTok 3 bài + Blogspot rewrite + diverse posts tạo nền topical “Làm TikTok / Affiliate”.
- Tỷ lệ `/go` trong body thường 1–3 slug — đúng kỷ luật “không nhồi”.
- Có checklist content-first rõ ràng trong docs nội bộ.

### Điểm yếu / lỗ hổng
1. **Không cover image** → trải nghiệm đọc + share kém; LCP phụ thuộc text/font.
2. **Không internal link** → người đọc TikTok vào 1 bài rồi thoát; mất session depth.
3. **Thiếu pillar page** bao quát (3k+ từ hoặc hub có mục lục link cluster) — hiện chỉ có cluster rời ([Tran Cong Thang Content SEO](https://trancongthang.vn/article/content-seo-strategy-2025)).
4. **Tần suất:** cả 14 bài dồn 26–27/08/2026 — chưa có nhịp publish ổn định; chưa có lịch / `publish_at`.
5. **2 bài 0 link affiliate trong body** (`faq-bat-dau-affiliate`, `hanh-trinh-4k-follow`) — OK content-first, nhưng nên soft-link sang series/gear liên quan.
6. Brand promise homepage (“review gadget sạc/hub”) **không khớp** corpus → message match kém với video TikTok hiện tại ([CopyCut TikTok funnel](https://www.copycut.app/guides/tiktok-for-conversion-optimization)).

### Cơ hội
- Viết 1 pillar “Làm video TikTok affiliate từ 0” + gắn 8 cluster hiện có.
- 2–3 bài so sánh gear (đã list trong `content-ideas.md`) — cao impact monetization.
- Mỗi bài mới: 2–3 internal links bắt buộc trong checklist biên tập.

---

## 4. Affiliate funnel

### Điểm mạnh
- Pattern `/go/<slug>` sạch; resolve DB → env → YAML (`go-resolve.ts`) — đúng kiến trúc.
- Admin products có field `affiliate_url`; dashboard đếm “Chưa dán link affiliate”.
- Post editor gắn products từ catalog + preview; CTA “Xem deal” cuối bài.
- Footer (+ `/about`) vẫn có câu hoa hồng — soft disclosure sitewide.

### Điểm yếu / lỗ hổng (nghiêm trọng)
1. **Funnel gãy trên production:** slug đang dùng trong bài (`mic-boya-m1`, `den-ring-light-10`, …) → **HTTP 500** (“Missing destination…”) vì DB không có URL và env không có `AFFILIATE_MIC_…`. Người đọc bấm CTA = lỗi. Đây là blocker monetization.
2. **Env chỉ có 5 AFFILIATE_* MVP** (củ sạc, hub, tai nghe, gậy, cáp) — và giá trị live là **placeholder** `s.shopee.vn/placeholder-…` (curl `/go/cu-sac-20w`).
3. **Deal hub / homepage deals** vẫn YAML catalog MVP — không khớp 14 products TikTok gear trong DB.
4. **Không có click tracking** trên `/go` — không đếm slug, referrer, UTM. Không biết video/bài nào ra click. (Xác nhận code: `go/[slug].ts` chỉ redirect.)
5. **Không lưu UTM** qua redirect (có thể append/preserve query).
6. Products thiếu image → CTA kém tin cậy khi sau này có UI rich.

### Disclosure (đã bỏ trong posts — rủi ro + gợi ý không gượng ép)
- Chủ dự án đã bỏ disclosure block trong bài (`content-quality-notes.md`, commit strip-disclosure). Footer + `/about` vẫn còn.
- **FTC (nếu audience quốc tế / platform áp dụng chuẩn Mỹ):** material connection (hoa hồng affiliate) cần disclose **clear & conspicuous**, gần endorsement — footer-only thường **không đủ** ([FTC Endorsement Guides Q&A](https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking), [FTC Disclosures 101](https://www.bulkorder.ftc.gov/system/files/publications/1001a-influencer-guide-508_0.pdf), 16 CFR 255.5).
- **Việt Nam:** Luật Thương mại điện tử 2025 (122/2025/QH15), hiệu lực **01/07/2026**, định nghĩa tiếp thị liên kết và trách nhiệm người tiếp thị (Điều 26) — xác thực danh tính, từ chối/gỡ link vi phạm, cung cấp thông tin khi cơ quan yêu cầu ([LuatVietnam tóm tắt](https://luatvietnam.vn/linh-vuc-khac/nguoi-lam-tiep-thi-lien-ket-trong-thuong-mai-dien-tu-phai-chiu-trach-nhiem-gi-tu-01-7-2026-883-111257-article.html), [Thư viện Pháp luật](https://thuvienphapluat.vn/van-ban/Thuong-mai/Luat-Thuong-mai-dien-tu-2025-so-122-2025-QH15-662035.aspx)). Không bắt buộc “disclaimer kiểu FTC” từng bài theo đúng wording Mỹ, nhưng xu hướng **minh bạch + trách nhiệm** đang siết.
- **Gợi ý không gượng ép:** giữ 1 câu ngắn trong footer (đã có) + 1 dòng nhẹ gần CTA sản phẩm (“Link Shopee — mình có thể nhận hoa hồng”) chỉ khi block sản phẩm hiện; không cần banner to đầu bài nếu chủ dự án không muốn. Ưu tiên **trung thực trải nghiệm** (đã có trong checklist) hơn là copy pháp lý dài.

### Cơ hội
- P0: dán affiliate URL thật cho ≥ top 6 slug đang dùng trong bài; thay placeholder env.
- Đồng bộ deals.yaml (hoặc migrate deals → products DB).
- Log click `/go` (table `go_clicks` hoặc Vercel Analytics custom event) + giữ UTM.

---

## 5. Admin & vận hành

### Điểm mạnh
- Admin đủ dùng 1 người: login, list/search/filter posts, CRUD posts/products, upload ảnh storage, publish/unpublish, stats (published/draft/missing affiliate).
- Category dropdown thống nhất với public routes.
- Markdown editor có preview / split.

### Điểm yếu / lỗ hổng
- Không: lịch đăng (`publish_at`), analytics trong admin, click report `/go`, OG image auto-gen, backup/export 1-click, SEO score checklist khi save, related posts picker.
- Không cảnh báo khi product gắn vào bài mà thiếu `affiliate_url` (dù dashboard có đếm tổng).
- Sitemap “auto” đã có (SSR) — không cần generator riêng; thiếu là **cache purge / GSC ping** sau publish.
- Deals vẫn sửa bằng YAML/file — không qua admin.

### Cơ hội (chọn lọc cho solo creator)
- Warning đỏ khi publish bài có `/go` slug thiếu URL.
- Export JSON posts định kỳ (script đã có hướng import — thiếu backup ngược).
- OG: template SVG/PNG cố định + title overlay (sau khi có cover thủ công cũng được).

---

## 6. Analytics & Growth

### Điểm mạnh
- **Vercel Web Analytics đã gắn** trên mọi trang layout; payload production còn config Speed Insights.
- URL sạch `/blog/...`, `/go/...` dễ gắn UTM thủ công.

### Điểm yếu / lỗ hổng
1. Không có quy ước UTM TikTok/FB (`utm_source=tiktok&utm_medium=bio&utm_campaign=...`) trong docs vận hành hay link bio.
2. Không đo click `/go` → không tối ưu video/bài theo doanh thu proxy.
3. Không email list / lead magnet — funnel TikTok→blog dừng ở pageview ([Bloggers Guide](https://thebloggersguidetomarketing.com/turn-tiktok-traffic-into-blog-readers/), [ViralNote 2026](https://www.viralnote.app/blog/tiktok-to-newsletter-clip-to-subscriber-funnel-2026)).
4. Không trang “resources / link in bio” gọn — homepage hiện generic; nghiên cứu khuyên **không** dump về home ([AI Tools Magic TikTok→blog 2026](https://aitoolsmagic.com/blog/how-to-promote-your-blog-on-tiktok)).
5. Social embed / “xem video gốc” chưa có trong bài.
6. Chưa có GA4 (có thể không cần nếu Vercel Analytics đủ + click table riêng).

### Cơ hội
- 1 trang `/links` hoặc pin 3 bài series trên bio.
- UTM chuẩn + theo dõi Vercel referrer.
- Lead magnet nhẹ sau (checklist hook PDF) — P2, sau khi traffic ổn.

---

## Ma trận ưu tiên nhanh (audit → roadmap)

| Vấn đề | Impact | Effort | Priority |
|---|---|---|---|
| `/go` 500 + thiếu affiliate URL thật | Monetization chết | S | P0 |
| Placeholder Shopee env + deals lệch catalog | Trust + tiền | S | P0 |
| Không track click `/go` | Không học được gì | S–M | P0 |
| Message match homepage vs content TikTok | Traffic→read | S | P0 |
| Internal links + 1 pillar | SEO + depth | M | P1 |
| Cover/OG images | Share + LCP | M | P1 |
| CDN cache HTML | Perf mobile | M | P1 |
| Sửa image transform URL | Perf khi có ảnh | S | P1 |
| Bài so sánh gear / deal category | Monetization | M | P1 |
| UTM + trang links bio | Growth | S | P0–P1 |
| Email list | Growth dài hạn | L | P2 |
| OG auto-gen / lịch đăng | Vận hành | M–L | P2 |

---

## Nguồn tham khảo chính

1. https://supabase.com/docs/guides/storage/serving/image-transformations  
2. https://docs.astro.build/en/guides/caching/  
3. https://vercel.com/docs/frameworks/frontend/astro  
4. https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking  
5. https://www.bulkorder.ftc.gov/system/files/publications/1001a-influencer-guide-508_0.pdf  
6. https://luatvietnam.vn/linh-vuc-khac/nguoi-lam-tiep-thi-lien-ket-trong-thuong-mai-dien-tu-phai-chiu-trach-nhiem-gi-tu-01-7-2026-883-111257-article.html  
7. https://thuvienphapluat.vn/van-ban/Thuong-mai/Luat-Thuong-mai-dien-tu-2025-so-122-2025-QH15-662035.aspx  
8. https://vmst.com.vn/topic-cluster-pillar-content-2026/  
9. https://techzika.com/marketing/content-pillar/  
10. https://www.yotpo.com/blog/long-tail-keywords-guide/  
11. https://trancongthang.vn/article/content-seo-strategy-2025  
12. https://aitoolsmagic.com/blog/how-to-promote-your-blog-on-tiktok  
13. https://thebloggersguidetomarketing.com/turn-tiktok-traffic-into-blog-readers/  
14. https://www.copycut.app/guides/tiktok-for-conversion-optimization  
15. https://tikadtools.com/blog/tiktok-ads-landing-page/  
16. https://www.viralnote.app/blog/tiktok-to-newsletter-clip-to-subscriber-funnel-2026  

---

*Audit thực hiện 2026-08-27. Số liệu production/DB có thể đổi sau khi chủ dự án dán link affiliate.*
