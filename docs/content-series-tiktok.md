# Content series — Làm video quảng bá sản phẩm kiếm tiền với TikTok

> Series chia sẻ **cách làm** từ kinh nghiệm thật (~4K followers, kênh review, Shopee affiliate).  
> Giọng văn: `docs/voice-profile-quankiu.md`.  
> Affiliate disclosure trong mỗi bài. CTA tự nhiên, không bán hàng kiểu hô hào.

## Mục tiêu series

Kéo traffic TikTok → blog → `/go/<slug>` (cookie Shopee). Content-first: anh em làm được thì tự làm, không cần “khóa học”.

## Outline (8 bài)

| # | Slug | Tiêu đề (working) | Trạng thái | Gear gắn (slug) |
|---|------|-------------------|------------|-----------------|
| 1 | `tiktok-chon-san-pham-review` | ĐỪNG review lung tung — chọn sản phẩm thế nào cho đỡ phí công | **Viết + seed** | `mic-boya-m1`, `den-ring-light-10`, `tripod-phone-flexible` |
| 2 | `tiktok-hook-3-giay` | 3 giây đầu quyết định video sống hay chết | **Viết + seed** | `mic-wireless-mini`, `den-led-panel`, `phone-clamp-cold-shoe` |
| 3 | `tiktok-kich-ban-quay-ngan` | Kịch bản 15–60 giây: nói gì, cắt gì, chốt gì | **Viết + seed** | `gimbal-phone-budget`, `lav-mic-foam`, `powerbank-pd-20k`, `backdrop-green-portable` |
| 4 | `tiktok-quay-dung-co-ban` | Quay–dựng cơ bản: đủ sáng, đủ nghe, đủ sạch | Outline | `den-ring-light-10`, `mic-boya-m1`, `tripod-phone-flexible` |
| 5 | `tiktok-affiliate-cookie` | Gắn link affiliate + cookie: đừng để traffic “bay” | Outline | (deal hub / product đang bán) |
| 6 | `tiktok-bio-mo-ta` | Bio + description: chỗ người ta quyết định bấm hay bỏ | Outline | — |
| 7 | `tiktok-do-luong-lap-lai` | Đo cái gì, lặp cái gì — đừng đoán mò | Outline | — |
| 8 | `tiktok-loi-thuong-gap` | Mấy lỗi mình đã đụng (và vẫn hay đụng lại) | Outline | `mic-wireless-mini`, `gimbal-phone-budget` |

## Ghi chú sản xuất

- Mỗi bài: hook tình huống thật → thân bài có quan điểm → disclosure affiliate → CTA mềm → câu hỏi mở 👇
- Products trên bài = gear quay video (catalog `products`), không nhồi deal lung tung.
- Seed DB: `npm run seed:tiktok-series` (sau khi chạy migration products).
- Bài 4–8: viết tiếp khi series 1–3 ổn traffic.

## Seed products liên quan

Migration `supabase/migrations/20260826_products.sql` seed 10 gear (`affiliate_url` trống — điền trong `/admin/products`).
