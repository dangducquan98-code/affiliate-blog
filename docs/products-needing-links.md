# Sản phẩm cần link Shopee Affiliate

> Dùng file này để **tạo link** — không tạo lại 13 món đã có URL.  
> Query: 2026-08-28, Supabase project `dglkxyldsuljiatlrydg`, bảng `public.products` (service role).  
> Giai đoạn 1: chỉ danh sách. Giai đoạn 2: dán URL vào Admin → Products (slug gợi ý bên dưới). **Không commit URL.**

---

## Đã có link — không tạo lại (13)

Tất cả 13 row đều **đã có** `affiliate_url` (Shopee `s.shopee.vn` trừ Ausync Lab — domain tool).

| Slug | Tên hiển thị | Category |
|------|----------------|----------|
| `ausync-lab-tts` | Ausync Lab Text-to-Speech | cong-cu-ai |
| `backdrop-green-portable` | Phông xanh portable | phu-kien-quay |
| `den-led-panel` | Đèn LED panel softbox nhỏ | den |
| `den-ring-light-10` | Đèn vòng (ring light) 10 inch | den |
| `gimbal-phone-budget` | Gimbal điện thoại giá mềm | gimbal-tripod |
| `lav-mic-foam` | Bọc xốp / wind muff mic lav | phu-kien-quay |
| `mic-boya-m1` | Mic cài áo Boya BY-M1 | mic |
| `mic-wireless-mini` | Mic không dây mini 2.4G | mic |
| `phone-clamp-cold-shoe` | Kẹp điện thoại + cold shoe | phu-kien-quay |
| `powerbank-pd-20k` | Pin dự phòng PD 20000mAh | phu-kien-quay |
| `sach-7-ngay-affiliate` | Sách 7 Ngày Affiliate | sach |
| `sach-content-bac-ty` | Sách Content Bạc Tỷ | sach |
| `tripod-phone-flexible` | Tripod điện thoại linh hoạt | gimbal-tripod |

**Không** có row thiếu URL. Honeygain **không** còn trong catalog (bài cũ dùng `/go/honeygain` kiểu khác — không xin link Shopee).

---

## Cần tạo link (9 món mới)

Chưa có row trong catalog. Tạo link Shopee Affiliate → gửi lại tên + URL (hoặc tự dán Admin). Slug gợi ý để agent giai đoạn 2 upsert cho khớp `/go/...`.

**Ưu tiên tạo trước (phục vụ 10 bài viết đầu):** 1, 2, 3, 4, 5.

| # | Tên hiển thị (tiếng Việt) | Gợi ý tìm trên Shopee | Category | Slug gợi ý | Dùng cho bài (ID) |
|---|---------------------------|----------------------|----------|------------|-------------------|
| 1 | **Sổ tay bullet journal A5** (ô chấm / dotted, ~80–120 trang) | `sổ tay bujo A5 dotted`, `sổ bullet journal A5 ô chấm` | khac | `so-tay-bujo-a5` | **MMO-01**, **TD-05** |
| 2 | **Sách Tâm lý học về tiền** (Morgan Housel, bản tiếng Việt) | `sách tâm lý học về tiền morgan housel`, `the psychology of money tiếng việt` | sach | `sach-tam-ly-hoc-ve-tien` | **TD-01**, **RS-04** |
| 3 | **Sách Suy tưởng** (Marcus Aurelius / Meditations, bản tiếng Việt) | `sách suy tưởng marcus aurelius`, `sách meditations khắc kỷ` | sach | `sach-suy-tuong-marcus` | **TD-02**, **RS-03**, **TN-01** |
| 4 | **Sách Chủ nghĩa Khắc kỷ mỗi ngày** (Ryan Holiday — Daily Stoic, bản tiếng Việt) | `sách chủ nghĩa khắc kỷ mỗi ngày`, `daily stoic ryan holiday tiếng việt` | sach | `sach-khac-ky-moi-ngay` | **TD-03**, **TN-04** |
| 5 | **Sách Cái tôi là kẻ thù** (Ryan Holiday — Ego is the Enemy, bản tiếng Việt) | `sách cái tôi là kẻ thù`, `ego is the enemy tiếng việt` | sach | `sach-cai-toi-la-ke-thu` | **TD-04** |
| 6 | **Sách Cha giàu cha nghèo** (Robert Kiyosaki, bản tiếng Việt) | `sách cha giàu cha nghèo kiyosaki` | sach | `sach-cha-giau-cha-ngheo` | **TC-02** |
| 7 | **Sổ thu chi cá nhân A5** (cột thu/chi/số dư, không cần app) | `sổ thu chi cá nhân A5`, `sổ quản lý chi tiêu A5` | khac | `so-thu-chi-a5` | **TC-04**, **TN-02** |
| 8 | **Sách Khởi nghiệp tinh gọn** (Eric Ries — Lean Startup, bản tiếng Việt) | `sách khởi nghiệp tinh gọn eric ries` | sach | `sach-khoi-nghiep-tinh-gon` | **RS-05** |
| 9 | **Sách 5 ngôn ngữ yêu thương** (Gary Chapman, bản tiếng Việt) | `sách 5 ngôn ngữ yêu thương gary chapman` | sach | `sach-5-ngon-ngu-yeu-thuong` | **TN-03** |

Chọn **1 listing** rõ nhà xuất bản / bìa mình chấp nhận (tránh shop in sách lậu nếu có thể). Giá mềm (~80–200k sách, ~40–120k sổ) khớp giọng “đáng tiền”.

---

## Không xin link (ghi để khỏi nhầm)

| Món | Lý do |
|-----|--------|
| 13 slug bảng trên | Đã có `affiliate_url` |
| DiamondHook — bộ thẻ (`diamondhook-bo-the`) | **Không** có row catalog; bài cũ vẫn `/go/diamondhook-bo-the`. **Không** nằm trong 30 bài mới. Nếu còn bán Shopee và muốn sửa bài cũ: tạo link + insert row (ngoài scope kế hoạch 30 bài). |
| Honeygain | Không phải Shopee; không tạo lại |
| Mic wireless, LED panel, phông xanh, Ausync | Có link; không gán bài mới trong plan này |

---

## Checklist chủ dự án

- [ ] Tạo **5 link ưu tiên** (sổ bujo + 4 sách Stoic/tiền/ego) → nhắn lại agent
- [ ] Tạo **4 link còn lại** (Cha giàu, sổ thu chi, Khởi nghiệp tinh gọn, 5 ngôn ngữ) khi viết mảng tài chính / review / trải nghiệm
- [ ] Không gửi raw URL vào git; dán Admin hoặc chat riêng
- [ ] Ghi rõ **tên listing** nếu khác tên bảng (để khớp slug)
