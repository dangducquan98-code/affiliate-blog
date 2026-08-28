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

## UX/UI (2026-08-28, branch `feature/ux-ui-polish`)
- Design tokens đầy đủ (`--surface`, focus ring, card shadow, radius 10px)
- Public: mobile nav drawer, card grid, breadcrumb, reading time, pillar CTA homepage
- Admin: `AdminLayout` sidebar + publish guard banner (client) khi SP thiếu affiliate
- Spec: `docs/superpowers/specs/2026-08-28-ux-ui-polish-design.md`
