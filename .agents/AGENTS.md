# Affiliate Blog — Project Memory (.agents)

## Vai trò
- Chủ dự án: Quân (Đặng Đức Quân) — BA / creator TikTok affiliate
- Brand: Quân Kiu Daily

## Quyết định vận hành (2026-08-27)
- Item 1 (dán affiliate URL): chủ dự án tự làm trong admin — không giao agent
- Item 12 (disclosure gần CTA): **bỏ** theo quyết định chủ dự án
- Click `/go` → bảng `click_events` (service role only); migration `supabase/migrations/20260827_click_events.sql` do Hermes chạy
- Bio TikTok → `/links` + UTM theo `docs/utm-convention.md`
- Homepage message: TikTok affiliate + gear creator (không còn củ sạc/hub làm trọng tâm)
- Publish chặn nếu product gắn bài thiếu `affiliate_url`
- Pillar: `lam-tiktok-affiliate-tu-0` (category `affiliate`)

## Verify nhanh
- `npm run build` · `npm run test:unit`
- `npm run content:internal-links` (pillar + internal links upsert)
- `npm run content:round2 -- <1|2|3|all>` (upsert bài round 2 từ `scripts/content/round2/`)
- Đếm bài/pillar: `npm run dump:posts` rồi soi `/tmp/posts-dump/_index.txt`

## Nội dung — Round 3 (2026-08-30, `feature/blog-upgrade`)
- **58 bài published**: mmo 22, tu-duy 9, cong-nghe 9, tai-chinh 8, review-sach 5, trai-nghiem 5
- Round 3 viết 14 bài: trả nợ gear CN-03/04/05 + CN-06, đóng series khắc kỷ (phần 2–3), 4 bài MMO (dashboard, test A/B, TikTok Shop vs cookie, chính sách), 3 bài tài chính, 1 bài kỷ luật
- Plan + kết quả: `docs/content-plan-round3.md`. Content: `scripts/content/round3/*.md`. Upsert: `npx tsx scripts/upsert-round3-posts.ts <1|2|3|all>`
- **21/21 sản phẩm giờ đã có ít nhất 1 bài** — catalog không còn món chết (`mic-wireless-mini` được CN-06 phủ)
- Slug round 3 KHÔNG thêm vào `POST_CATEGORY_BY_SLUG` — `resolveCategorySlug` fallback về `category` trong DB, đã verify trang category liệt kê đủ
- Chưa làm (vòng sau): bài thuế/kê khai thu nhập affiliate (chờ chủ dự án xác nhận số thật), review riêng `sach-khac-ky-moi-ngay` + `sach-5-ngon-ngu-yeu-thuong`, review riêng `den-led-panel`/`backdrop-green-portable`/`phone-clamp-cold-shoe`

## Nội dung — Round 2 (2026-08-29, `feature/blog-upgrade`)
- **44 bài published**, mọi pillar ≥5: mmo 18, tu-duy 6, tai-chinh 5, review-sach 5, cong-nghe 5, trai-nghiem 5
- Round 2 viết 17 bài lấp 4 mảng: `tai-chinh` (0→5), `review-sach` (0→5), `trai-nghiem` (0→5), `cong-nghe` (3→5)
- Plan: `docs/content-plan-round2.md`. Content: `scripts/content/round2/*.md` (frontmatter chỉ có `category`)
- Chuẩn mỗi bài: 900–1500 từ, **1** link `/go`, 2–4 link `/blog`, kết riêng không lặp công thức, không disclosure, không note nội bộ
- Slug mới phải thêm vào `src/lib/post-category-map.ts` (POST_CATEGORY_BY_SLUG)
- Catalog: 21 sản phẩm, **21/21 đã có `affiliate_url`** — không còn bài nào chờ link
- Chưa làm (vòng sau): CN-03 wind muff, CN-04 review pin, CN-05 review gimbal, "Về khắc kỷ" phần 2–3, bài thuế/kê khai thu nhập affiliate (cần chủ dự án xác nhận số thật)

## UX/UI (2026-08-28)
- Public polish đã merge `main` (mobile nav drawer fix, card grid, breadcrumb…)
- **Admin UX v2** (`feature/admin-ux-v2`): `src/styles/admin.css` tách riêng, `/admin/posts`, dashboard task-first, editor 4 sections, products mobile cards + category select + affiliate URL validation
- Spec admin v2: `docs/superpowers/specs/2026-08-28-admin-ux-v2-design.md`
