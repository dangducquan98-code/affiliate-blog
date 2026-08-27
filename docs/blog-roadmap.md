# Roadmap ưu tiên — Quân Kiu Daily

> Dựa trên `docs/blog-audit-2026-08.md` (2026-08-27).  
> Đối tượng: blog 1 người, traffic chính từ TikTok/FB, monetize Shopee affiliate (cookie).  
> Tối đa 15 item. Mỗi item: impact · effort (S/M/L) · lý do.  
> **Chưa implement trong doc này.**

---

## Nguyên tắc chọn việc

1. Sửa thứ đang **gãy tiền** trước (CTA `/go` 500, placeholder link).
2. Chỉ đo được thì mới tối ưu — click `/go` + UTM trước khi viết thêm hàng loạt.
3. Content bám audience TikTok thật; SEO cluster sau khi funnel sống.
4. Không phình admin/email/OG-auto cho đến khi có traffic đều.

---

## P0 — Làm ngay (tuần này)

### 1. Dán affiliate URL thật cho slug đang dùng trong bài
- **Mô tả:** Trong admin Products, điền `affiliate_url` Shopee thật cho tối thiểu: `mic-boya-m1`, `den-ring-light-10`, `den-led-panel`, `tripod-phone-flexible`, `lav-mic-foam`, `diamondhook-bo-the`, `sach-7-ngay-affiliate`, `sach-content-bac-ty`, `ausync-lab-tts`. Verify curl `/go/<slug>` → 302 domain Shopee thật (không placeholder, không 500).
- **Impact:** Monetization (blocker → mở khóa)
- **Effort:** S
- **Lý do:** Production đang 500 trên CTA bài hot; không làm thì mọi traffic TikTok vào blog **không ra hoa hồng**.

### 2. Thay placeholder env / đồng bộ catalog MVP hoặc gỡ deals lệch
- **Mô tả:** (a) Thay `AFFILIATE_*` placeholder bằng URL thật **hoặc** gỡ/ẩn deals YAML củ sạc–hub khỏi homepage/`/deals` nếu không còn đẩy; (b) Cập nhật `deals.yaml` (hoặc admin) sang gear TikTok đang review.
- **Impact:** Trust + Monetization
- **Effort:** S
- **Lý do:** `/go/cu-sac-20w` live vẫn `s.shopee.vn/placeholder-…`; homepage “Deal nổi bật” lệch nội dung TikTok → message match kém.

### 3. Click tracking tối thiểu trên `/go`
- **Mô tả:** Log mỗi hit `/go/:slug` (timestamp, slug, referrer, UTM query nếu có) — bảng Supabase đơn giản hoặc Vercel Analytics custom event `go_click`. Dashboard admin: top slug 7 ngày.
- **Impact:** Monetization + Growth (học được bài/video nào ra click)
- **Effort:** S–M
- **Lý do:** Hiện không đếm click; không tối ưu được funnel ([CopyCut — UTM + iterate](https://www.copycut.app/guides/tiktok-for-conversion-optimization)).

### 4. Chuẩn UTM + trang “link in bio”
- **Mô tả:** Quy ước `?utm_source=tiktok&utm_medium=bio|comment&utm_campaign=<slug-bai>`; tạo `/links` (hoặc pin section) liệt kê 3–5 bài đang đẩy — **không** trỏ bio về homepage chung ([AI Tools Magic 2026](https://aitoolsmagic.com/blog/how-to-promote-your-blog-on-tiktok)).
- **Impact:** Traffic + đo lường
- **Effort:** S
- **Lý do:** Solo creator cần 1 đường click rõ từ TikTok → đúng bài.

### 5. Chỉnh message match homepage / blog index
- **Mô tả:** Hero + meta description phản ánh corpus thật: làm TikTok + affiliate + gear creator đáng tiền (không chỉ “củ sạc, hub”). CTA chính → `/blog` hoặc series pillar; deals secondary.
- **Impact:** UX + conversion đọc
- **Effort:** S
- **Lý do:** Message match là yếu tố #1 landing TikTok ([TikAdTools 2026](https://tikadtools.com/blog/tiktok-ads-landing-page/)).

---

## P1 — 1–2 tuần tới

### 6. Internal linking giữa 14 bài + block “Đọc tiếp”
- **Mô tả:** Mỗi bài ≥2 link tới bài cùng cluster; cuối bài block related thủ công hoặc theo category. Ưu tiên series TikTok 3 bài ↔ hook/SEO mô tả.
- **Impact:** Traffic (SEO) + UX session depth
- **Effort:** M (nội dung)
- **Lý do:** Audit thấy **0** internal `/blog` link — cluster chưa truyền authority ([VMST topic cluster](https://vmst.com.vn/topic-cluster-pillar-content-2026/)).

### 7. Viết 1 pillar “Làm TikTok affiliate từ 0”
- **Mô tả:** Bài trụ mục lục + link ra 8 cluster `lam-tiktok` / một phần `affiliate`. Không nhồi link Shopee; soft CTA gear cuối.
- **Impact:** Traffic SEO dài hạn
- **Effort:** M
- **Lý do:** Pillar + cluster tăng topical authority hơn viết bài rải ([Techzika content pillar](https://techzika.com/marketing/content-pillar/)).

### 8. 2–3 bài so sánh / review đơn gear (ra đơn)
- **Mô tả:** Theo `docs/content-ideas.md`: mic dây vs không dây; ring light vs LED panel; hoặc review Boya M1 / tripod linh hoạt. 1–2 `/go` tự nhiên/bài.
- **Impact:** Monetization
- **Effort:** M
- **Lý do:** Corpus đang nghiêng how-to; thiếu long-tail “chọn cái nào / có đáng mua” — intent gần mua hơn.

### 9. Cover image + OG PNG cho bài đang đẩy
- **Mô tả:** Upload cover cho top 5–8 bài (bio/TikTok); OG dùng ảnh cover (không SVG default). Sửa `withImageTransform` sang `/storage/v1/render/image/public/...` trước khi scale ảnh ([Supabase docs](https://supabase.com/docs/guides/storage/serving/image-transformations)).
- **Impact:** Traffic (share) + Performance
- **Effort:** M
- **Lý do:** 0/14 cover; OG mặc định yếu khi share FB/Zalo.

### 10. CDN cache HTML public (/, blog, category, post)
- **Mô tả:** `Cache-Control` / Astro `cache.set` hoặc `Vercel-CDN-Cache-Control` 60–300s + SWR; purge khi publish. Giữ `/go` và `/admin` no-store.
- **Impact:** UX perf (LCP/TTFB mobile)
- **Effort:** M
- **Lý do:** Hiện `max-age=0` + TTFB ~1–1.7s; TikTok traffic nhạy tốc độ ([Vercel Astro caching](https://vercel.com/docs/frameworks/frontend/astro)).

### 11. Cảnh báo admin khi publish mà `/go` thiếu URL
- **Mô tả:** Khi save/publish: parse slug `/go` + products gắn bài; nếu thiếu `affiliate_url` → chặn hoặc toast đỏ.
- **Impact:** UX vận hành (tránh tái diễn P0)
- **Effort:** S
- **Lý do:** Dashboard đã đếm missing link nhưng không gắn vào luồng publish.

### 12. Disclosure nhẹ gần CTA sản phẩm (không gượng ép)
- **Mô tả:** Giữ footer như hiện tại; thêm 1 câu ngắn ngay trên block “Sản phẩm đề xuất” (“Một số link là affiliate Shopee — giá bạn trả không đổi”). Không bắt buộc banner đầu bài.
- **Impact:** Trust / rủi ro compliance
- **Effort:** S
- **Lý do:** FTC coi footer-only là yếu ([FTC Q&A](https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking)); VN siết trách nhiệm affiliate từ 7/2026 — minh bạch vừa đủ, không phá UX.

---

## P2 — Sau (khi P0–P1 ổn + có traffic)

### 13. Lead magnet nhẹ + email (checklist hook / 7-ngày)
- **Mô tả:** 1 trang capture + PDF/Notion checklist; CTA từ `/links` và 1–2 bài pillar. Chỉ khi đã có click bio đều.
- **Impact:** Growth dài hạn (owned audience)
- **Effort:** L
- **Lý do:** Funnel clip→email mạnh nhưng premature trước khi có traffic ([ViralNote 2026](https://www.viralnote.app/blog/tiktok-to-newsletter-clip-to-subscriber-funnel-2026)).

### 14. Lịch đăng `publish_at` + nhịp 1–2 bài/tuần
- **Mô tả:** Field schedule trong admin; calendar nội dung bám cluster còn thiếu (`deal`, so sánh gear).
- **Impact:** Traffic đều + vận hành
- **Effort:** M
- **Lý do:** 14 bài dồn 2 ngày — chưa có nhịp; schedule giúp solo không burnout.

### 15. OG auto-gen / JSON-LD Product|FAQ / Search Console quy trình
- **Mô tả:** Template OG theo title; FAQ schema cho bài FAQ; đăng ký GSC + submit sitemap lần đầu (sitemap đã có).
- **Impact:** SEO + share
- **Effort:** M–L
- **Lý do:** Tiện ích sau khi nội dung + link đã ổn; không phải nút thắt hiện tại.

---

## TOP 5 việc nên làm nhất

| # | Việc | Lý do ngắn |
|---|---|---|
| 1 | **Dán affiliate URL thật** (item 1) | CTA đang 500 — không có tiền nếu không sửa |
| 2 | **Click tracking `/go`** (item 3) | Biết bài/video nào ra click trước khi viết thêm |
| 3 | **UTM + trang link-in-bio** (item 4) | Biến view TikTok thành session đo được |
| 4 | **Message match homepage** (item 5) | Đúng kỳ vọng người từ video “làm TikTok” |
| 5 | **Internal links + 1 pillar** (items 6–7) | Biến 14 bài rời thành cụm SEO / đọc sâu |

*(Item 2 — deals/placeholder — làm cùng #1 trong cùng buổi admin.)*

---

## Việc cố ý chưa đưa vào top

- Email list, lịch đăng phức tạp, OG auto-gen, Product schema đầy đủ, GA4 song song, rebuild deals thành CMS lớn — giá trị thấp hơn so với effort khi funnel `/go` còn gãy và chưa đo click.

---

## Định nghĩa “xong tuần P0”

- [ ] ≥ 6 slug đang dùng trong bài: `/go/...` → 302 Shopee thật  
- [ ] Không còn placeholder trên deals đang public (hoặc đã ẩn)  
- [ ] Có ít nhất 1 cách xem số click `/go` theo slug  
- [ ] Bio TikTok trỏ tới `/links` (hoặc URL bài) kèm UTM  
- [ ] Homepage copy khớp nội dung TikTok/affiliate  

Sau P0 → mới ưu tiên pillar + so sánh gear + cache/ảnh.
