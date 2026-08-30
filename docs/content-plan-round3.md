# Kế hoạch nội dung Round 3 — 14 bài lấp nốt mảng thiếu + mở rộng 3 pillar ưu tiên

> Ngày: 2026-08-30. Branch: `feature/blog-upgrade` (HEAD `206f314`, ngang `main`).
> Nối tiếp `docs/content-plan-round2.md` (17 bài) và `docs/content-plan-6-pillars.md` (10 bài round 1).
> Nguồn giọng: `docs/voice-dna-notes.md`, `docs/voice-samples-quankiu.md`, `docs/voice-profile-quankiu.md`.

## Hiện trạng DB (query Supabase `dglkxyldsuljiatlrydg`, service role — 2026-08-30)

44 bài `published=true`, 21/21 sản phẩm đã có `affiliate_url` (không bài nào phải chờ link, không cần thêm product trống).

| Pillar | Đang có | Round 3 thêm | Sau round 3 |
|--------|---------|--------------|-------------|
| `mmo` | 18 | +4 | 22 |
| `tu-duy` | 6 | +3 | 9 |
| `cong-nghe` | 5 | +4 | 9 |
| `tai-chinh` | 5 | +3 | 8 |
| `review-sach` | 5 | +0 | 5 |
| `trai-nghiem` | 5 | +0 | 5 |
| **Tổng** | **44** | **+14** | **58** |

Round 3 không đụng `review-sach` và `trai-nghiem` — hai mảng này đã đủ mốc ≥5 và ưu tiên của chủ dự án đang nằm ở `mmo`, `tu-duy`, `tai-chinh` + ba bài `cong-nghe` còn nợ từ plan cũ.

## Lý do chọn 14 bài này

1. **Trả nợ plan cũ** — CN-03 wind muff, CN-04 pin dự phòng, CN-05 gimbal đã nằm trong `content-plan-6-pillars.md` mà round 2 chưa viết. Series "Về khắc kỷ" mới có phần 1, sample gốc kết bằng "Còn tiếp..." nên để treo là hụt.
2. **Mảng ưu tiên Cao trong `content-themes.md`** — theme 2 (debug affiliate) còn thiếu bài dashboard và bài test A/B; theme 5 (nền tảng & cập nhật) chưa có bài nào.
3. **Phủ sản phẩm chưa dùng** — `mic-wireless-mini` là món duy nhất có link mà chưa xuất hiện ở bài nào; thêm CN-06 để catalog không có món chết.
4. **Không trùng 44 bài cũ** — đã đối chiếu từng slug và mô tả. Chỗ dễ đụng nhất đã xử lý: MMO-06 chỉ nói *đọc số* (bài cũ `view-co-click-khong-7-cho-soi` nói *sửa chỗ nào*), MMO-07 chỉ nói *cách test* (bài cũ `comment-ghim-3-mau-khong-spam` nói *viết gì*), TC-06 nói *quyết định mua lẻ* (bài cũ `tra-gop-gear-creator-co-nen` nói *cách trả*), TD-08 nói *kỷ luật khi hết động lực* (bài cũ `thoi-quen-sang-15-phut-truoc-khi-quay` nói *một thói quen cụ thể*).

## Nguyên tắc viết (giữ nguyên round 1–2)

- 900–1500 từ. Mở bằng tình huống thật, không định nghĩa sách vở.
- Xưng "mình", gọi "bạn"/"chúng mình". Nhịp câu lộn xộn có chủ ý, câu ngắn dứt khoát xen vào.
- Content-first: bỏ hết link thì bài vẫn đứng được.
- Affiliate tối đa 2–3 chỗ `/go/<slug>`, ưu tiên **1 link/bài**, đặt sau mạch giá trị và nằm trong câu kể.
- Internal link 2–4 tới bài liên quan (`/blog/<slug>`).
- **Kết mỗi bài riêng biệt** — không lặp công thức của 44 bài trước, cũng không lặp lẫn nhau.
- Không disclosure affiliate, không note nội bộ, không "Bạn nghĩ sao?".

## Phase 1 — Công nghệ còn nợ (3 bài) + Khắc kỷ phần 2–3 (2 bài)

| ID | Slug | Pillar | Tiêu đề | Outline 1 dòng | Sản phẩm |
|----|------|--------|---------|----------------|----------|
| CN-03 | `wind-muff-lav-co-can-khong` | `cong-nghe` | Wind muff cho mic lav — món 25 nghìn và ba tháng mình mới hiểu khi nào nó cứu | Không phải chống gió mà chống hơi thở và tiếng vải; indoor máy lạnh khi nào cần, khi nào thừa | `lav-mic-foam` |
| CN-04 | `pin-du-phong-20k-quay-ngoai-troi` | `cong-nghe` | Pin dự phòng 20.000mAh sau mấy buổi quay ngoài trời — thứ mình cần không phải dung lượng | Sạc trong lúc quay làm máy nóng; PD vs củ rẻ; nặng là chi phí thật | `powerbank-pd-20k` |
| CN-05 | `gimbal-gia-mem-kenh-review-tinh` | `cong-nghe` | Gimbal giá mềm — mình mượn dùng hai tuần rồi trả lại | Mượn thay vì mua; ba việc gimbal làm tốt; kênh review tĩnh thì skip | `gimbal-phone-budget` |
| TD-06 | `ve-khac-ky-phan-2-ngoai-tam-kiem-soat` | `tu-duy` | Về khắc kỷ — phần 2: những thứ ngoài tầm kiểm soát | Nối phần 1; ranh giới trong/ngoài tầm là mờ chứ không rõ; bài tập chia ba cột; view là ngoài tầm, upload là trong tầm | `sach-khac-ky-moi-ngay` |
| TD-07 | `ve-khac-ky-phan-3-memento-mori` | `tu-duy` | Về khắc kỷ — phần 3: Memento Mori và cái đồng hồ cát trên tay mình | Hình xăm đồng hồ cát; Memento Mori không tiêu cực; áp vào quyết định nhỏ hằng ngày; đóng series | `sach-suy-tuong` |

## Phase 2 — MMO, mảng ưu tiên Cao (4 bài)

| ID | Slug | Pillar | Tiêu đề | Outline 1 dòng | Sản phẩm |
|----|------|--------|---------|----------------|----------|
| MMO-06 | `doc-dashboard-shopee-affiliate` | `mmo` | Đọc dashboard Shopee Affiliate — tuần đầu nên nhìn số nào, bỏ qua số nào | Bốn số đáng nhìn, ba số làm mình hoảng vô ích; nhìn theo tuần chứ không theo giờ; độ trễ đơn | 0 link |
| MMO-07 | `test-ab-cho-dat-link-affiliate` | `mmo` | Test A/B chỗ đặt link: bio, comment ghim hay mô tả — mình làm hai tuần | Một biến một lần; mẫu quá nhỏ thì đọc xu hướng chứ không đọc con số; bảng ghi tay 5 cột | `so-tay-bujo-a5` |
| MMO-08 | `tiktok-shop-vs-affiliate-cookie` | `mmo` | TikTok Shop hay affiliate cookie — kênh nhỏ như mình dồn vào đâu | Khác nhau ở chỗ ai giữ khách; cookie hợp người viết dài, shop hợp người livestream; mình chọn gì và vì sao | 0 link |
| MMO-09 | `chinh-sach-affiliate-2026-theo-doi` | `mmo` | Chính sách affiliate 2026 — mình theo dõi ở đâu cho đỡ hoang mang | Đọc nguồn chính thức trước tin đồn; ba chỗ mình mở mỗi tháng; quy tắc không đổi cách làm vì một cái post drama. Không tư vấn pháp lý | 0 link |

## Phase 3 — Tài chính (3 bài) + Tư duy (1) + Công nghệ (1)

| ID | Slug | Pillar | Tiêu đề | Outline 1 dòng | Sản phẩm |
|----|------|--------|---------|----------------|----------|
| TC-06 | `nhu-cau-hay-mong-muon-truoc-khi-mua` | `tai-chinh` | Nhu cầu hay mong muốn — ba câu mình hỏi trước khi bấm đặt hàng | Ranh giới nhu cầu/mong muốn không nằm ở món đồ mà ở hoàn cảnh; quy tắc ngủ một đêm; ghi lại món đã bỏ qua | `so-thu-chi-a5` |
| TC-07 | `truoc-khi-nghi-toi-dau-tu` | `tai-chinh` | Trước khi nghĩ tới đầu tư — bốn việc mình làm xong đã | Không tư vấn kênh đầu tư, không nói lãi suất; nợ lãi cao, quỹ khẩn cấp, biết số chi tiêu, học trước khi bỏ tiền | `sach-cha-giau-cha-ngheo` |
| TC-08 | `thu-nhap-khong-deu-chia-the-nao` | `tai-chinh` | Thu nhập tháng có tháng không — mình chia tiền thế nào cho đỡ hụt | Lấy mức thấp nhất 3 tháng làm chuẩn; tháng cao là tháng bù chứ không phải tháng thưởng; tự trả lương đều cho mình | `sach-tam-ly-hoc-ve-tien` |
| TD-08 | `ky-luat-khi-het-dong-luc` | `tu-duy` | Kỷ luật khi hết động lực — mình hạ tiêu chuẩn xuống mức không thể trượt | Động lực là thời tiết; định nghĩa "ngày tối thiểu"; không phá chuỗi hai ngày; kỷ luật không phải nghiến răng | 0 link |
| CN-06 | `mic-khong-day-mini-vs-mic-day` | `cong-nghe` | Mic không dây mini vs mic có dây — sau ba tháng đổi qua đổi lại | Dây vướng vs pin và nhiễu; quay bàn thì dây thắng, quay đi lại thì không dây thắng; độ trễ và quên sạc | `mic-wireless-mini` |

## Map sản phẩm → bài (round 3)

| Sản phẩm | Bài round 3 | Tổng số bài trên toàn blog sau round 3 |
|----------|-------------|----------------------------------------|
| `lav-mic-foam` | CN-03 | 2 |
| `powerbank-pd-20k` | CN-04 | 2 |
| `gimbal-phone-budget` | CN-05 | 2 |
| `mic-wireless-mini` | CN-06 | 1 (trước đó 0) |
| `sach-khac-ky-moi-ngay` | TD-06 | 3 |
| `sach-suy-tuong` | TD-07 | 4 |
| `so-tay-bujo-a5` | MMO-07 | 3 |
| `so-thu-chi-a5` | TC-06 | 3 |
| `sach-cha-giau-cha-ngheo` | TC-07 | 2 |
| `sach-tam-ly-hoc-ve-tien` | TC-08 | 3 |
| — (0 link) | MMO-06, MMO-08, MMO-09, TD-08 | |

Sau round 3, cả 21 sản phẩm trong catalog đều đã xuất hiện ít nhất một bài. Bốn bài 0 link đều thuộc nhóm trust/policy — đúng hướng `content-themes.md` (theme 3 và theme 5 khuyến nghị 0 link).

## Mạng internal link

- Trụ MMO cũ: `/blog/lam-tiktok-affiliate-tu-0`, `/blog/view-co-click-khong-7-cho-soi`, `/blog/cookie-shopee-affiliate-tiktok-4k`, `/blog/thang-dau-co-don-affiliate-so-that`, `/blog/funnel-tiktok-blog-caption`
- Trụ tư duy cũ: `/blog/ve-khac-ky-phan-1-tham-lam-mong-cau`, `/blog/tam-the-con-tot-hoi-khac`, `/blog/nga-tinh-tiep-sau-10-clip-flop`, `/blog/chuc-mung-neu-ban-khong-giau`
- Trụ tài chính cũ: `/blog/ngan-sach-3-tang-lam-them-online`, `/blog/chi-phi-kenh-tiktok-mot-thang`, `/blog/quy-khan-cap-khi-vua-co-con`, `/blog/tra-gop-gear-creator-co-nen`
- Chuỗi khắc kỷ: phần 1 → TD-06 → TD-07 (link hai chiều trong bài mới, phần 1 giữ nguyên nội dung cũ)
- Chéo round 3: CN-03 ↔ CN-06, CN-04 ↔ CN-05, TC-06 ↔ TC-08, MMO-06 ↔ MMO-07 ↔ MMO-08

## Bài chưa làm (để vòng sau)

- `tai-chinh`: bài về thuế / kê khai thu nhập affiliate — vẫn chờ chủ dự án xác nhận số liệu thật, không viết mò.
- `review-sach`: chưa có review riêng cho `sach-khac-ky-moi-ngay` và `sach-5-ngon-ngu-yeu-thuong`.
- `trai-nghiem`: chưa mở rộng thêm, pillar đang đủ mốc.
- `cong-nghe`: `den-led-panel`, `backdrop-green-portable`, `phone-clamp-cold-shoe` mới nhắc rải rác, chưa có bài review riêng.

## Kết quả thực hiện (2026-08-30)

Đã viết và upsert đủ **14/14 bài**, `published=true`, category đúng pillar.

| Pillar | Trước | Sau |
|--------|-------|-----|
| `mmo` | 18 | **22** |
| `tu-duy` | 6 | **9** |
| `cong-nghe` | 5 | **9** |
| `tai-chinh` | 5 | **8** |
| `review-sach` | 5 | 5 |
| `trai-nghiem` | 5 | 5 |
| **Tổng published** | **44** | **58** |

Đo trên 14 bài mới: 1132–1468 từ phần thân, **0–1** link `/go` mỗi bài, 3–4 link `/blog` mỗi bài, 14 câu kết khác nhau. Bốn bài trust/policy (MMO-06, MMO-08, MMO-09, TD-08) giữ 0 link như plan.

Verify đã chạy: `npm run build` PASS · `npm run test:unit` 27/27 PASS · 5 bài phase 3 + 6 trang category trả 200 · `/go/{so-thu-chi-a5, sach-cha-giau-cha-ngheo, sach-tam-ly-hoc-ve-tien, mic-wireless-mini}` trả 302 · sitemap 69 URL · 0 internal link chết · scan 58 bài: 0 note nội bộ, 0 disclosure.

Commit: `content(round3-1)` plan + 3 gear + Stoic 2–3 · `content(round3-2)` 4 bài MMO · `content(round3-3)` 3 tài chính + 1 tư duy + 1 công nghệ. Chưa push.

## Liên quan

- Plan round 1: `docs/content-plan-6-pillars.md`
- Plan round 2: `docs/content-plan-round2.md`
- Định hướng mảng: `docs/content-themes.md`, `docs/content-pillars.md`
- Voice: `docs/voice-dna-notes.md`, `docs/voice-samples-quankiu.md`
- Quality: `docs/content-quality-notes.md`
