# Kế hoạch nội dung Round 2 — 17 bài lấp 4 mảng trống

> Ngày: 2026-08-29. Branch: `feature/blog-upgrade` (HEAD `c2e522e` hero/about + ngang `main`).
> Nối tiếp `docs/content-plan-6-pillars.md` (round 1 đã viết 10 bài: MMO-01..05, TD-01..05).
> Nguồn giọng: `docs/voice-dna-notes.md`, `docs/voice-samples-quankiu.md`, `docs/voice-profile-quankiu.md`.

## Hiện trạng DB (query Supabase `dglkxyldsuljiatlrydg`, service role — 2026-08-29)

27 bài `published=true`, phân bố rất lệch:

| Pillar | Đang có | Mục tiêu | Cần viết |
|--------|---------|----------|----------|
| `mmo` | 18 | ≥5 | 0 — đã dư |
| `tu-duy` | 6 | ≥5 | 0 — đã đủ |
| `cong-nghe` | 3 | ≥5 | **2** |
| `tai-chinh` | 0 | ≥5 | **5** |
| `review-sach` | 0 | ≥5 | **5** |
| `trai-nghiem` | 0 | ≥5 | **5** |
| **Tổng** | **27** | | **17** |

Sau round 2: 44 bài, mọi pillar ≥5.

## Catalog sản phẩm

21 sản phẩm trong DB, **21/21 đã có `affiliate_url`** — không bài nào phải chờ link, không cần thêm product trống. Nhóm dùng cho round 2:

- Sách tài chính: `sach-cha-giau-cha-ngheo`, `sach-tam-ly-hoc-ve-tien`
- Sách khác: `sach-suy-tuong`, `sach-khac-ky-moi-ngay`, `sach-khoi-nghiep-tinh-gon`, `sach-5-ngon-ngu-yeu-thuong`, `sach-7-ngay-affiliate`, `sach-content-bac-ty`
- Sổ: `so-tay-bujo-a5`, `so-thu-chi-a5`
- Gear: `den-ring-light-10`, `tripod-phone-flexible`, `powerbank-pd-20k`, `gimbal-phone-budget`, `lav-mic-foam`

## Nguyên tắc viết (mọi bài)

- 900–1500 từ. Mở bằng tình huống thật, không định nghĩa sách vở.
- Xưng "mình", gọi "bạn". Văn xuôi chảy, nhịp câu lộn xộn có chủ ý.
- Content-first: bỏ hết link thì bài vẫn đứng được.
- Affiliate ≤2 chỗ `/go/<slug>`, đặt sau mạch giá trị, trong câu kể.
- Internal link 2–4 tới bài liên quan (`/blog/<slug>`).
- **Kết mỗi bài phải khác nhau** — không dùng lại công thức "nếu bạn cần lộ trình thì đọc X".
- Không disclosure affiliate, không note nội bộ, không "Bạn nghĩ sao?".

## Phase 1 — Tài chính cá nhân (5 bài)

Góc người lương văn phòng + kênh phụ. **Không** tư vấn đầu tư, không nói lãi suất cụ thể.

| ID | Slug | Tiêu đề | Outline 1 dòng | Sản phẩm |
|----|------|---------|----------------|----------|
| TC-01 | `chi-phi-kenh-tiktok-mot-thang` | Chi phí thật của một tháng làm kênh TikTok — mình ngồi cộng lại và hơi giật mình | Cộng đủ gear, điện, mạng, tool, thời gian quy ra tiền; bù trừ với hoa hồng; pin dự phòng là dòng chi dễ quên | `powerbank-pd-20k` |
| TC-02 | `quy-khan-cap-khi-vua-co-con` | Quỹ khẩn cấp khi vừa có con — mình đặt mục tiêu thế nào cho đỡ hoảng | Mốc theo số tháng chi tiêu chứ không theo số tiền; tách quỹ khẩn cấp khỏi tiền "học làm giàu"; đêm con sốt | `sach-cha-giau-cha-ngheo` |
| TC-03 | `thu-nhap-phu-khi-nao-dang` | Thu nhập phụ: khi nào đáng làm, khi nào nó ăn mất việc chính | 3 câu hỏi tự soi; dấu hiệu side income đang lỗ ngầm; chi phí học tính vào đâu | `sach-7-ngay-affiliate` |
| TC-04 | `ngan-sach-3-tang-lam-them-online` | Ngân sách 3 tầng cho người làm thêm online — mình chia tiền trên giấy | Cố định / biến đổi / đầu tư bản thân; thu nhập phụ vào tầng nào; sổ giấy cho người ghét app | `so-thu-chi-a5` |
| TC-05 | `tra-gop-gear-creator-co-nen` | Trả góp gear creator — mình đã suýt bấm và lý do mình dừng lại | Trả góp là cược vào phiên bản tương lai của mình; test 2 tuần bằng đồ đang có; gimbal là case điển hình | `gimbal-phone-budget` |

## Phase 2 — Review sách (5 bài)

Format: mình đọc trong hoàn cảnh nào → phần thấm nhất → phần bỏ qua được → ai nên/không nên đọc → mình đổi hành vi gì. 1 link đúng cuốn đang review.

| ID | Slug | Tiêu đề | Outline 1 dòng | Sản phẩm |
|----|------|---------|----------------|----------|
| RS-01 | `review-sach-7-ngay-affiliate` | 7 Ngày Affiliate — đọc xong mình làm khác chỗ nào | Review trung thực, không thần dược; khác bài lộ trình `/blog/7-ngay-affiliate`; ai đang 0 view thì đọc phần nào | `sach-7-ngay-affiliate` |
| RS-02 | `review-sach-content-bac-ty` | Content Bạc Tỷ — phần nào đáng, phần nào mình bỏ qua | Phần khung nội dung dùng được; phần quy mô đội ngũ không áp cho kênh một người | `sach-content-bac-ty` |
| RS-03 | `review-sach-suy-tuong-stoic-nguoi-moi` | Sách Stoic cho người mới — mình bắt đầu từ Suy tưởng | Nhắc 3 cuốn, chỉ link 1 cuốn khuyên đọc trước; cách đọc sách rời rạc không cần thứ tự | `sach-suy-tuong` |
| RS-04 | `review-sach-tam-ly-hoc-ve-tien` | Tâm lý học về tiền — đọc lúc đang mê affiliate thì thấm chỗ nào | Không dạy làm giàu; chương về cái giá của thành công và về đủ; áp cho người lương + side income | `sach-tam-ly-hoc-ve-tien` |
| RS-05 | `review-sach-khoi-nghiep-tinh-gon` | Khởi nghiệp tinh gọn — mình lấy được gì cho một kênh một người | MVP = clip test; build-measure-learn kiểu clip flop; đừng đóng vai startup | `sach-khoi-nghiep-tinh-gon` |

## Phase 3 — Trải nghiệm (5 bài) + Công nghệ (2 bài)

Trải nghiệm: affiliate **rất mỏng** (0–1 link, CTA cực mềm), gần nhật ký có chủ đích.

| ID | Slug | Tiêu đề | Outline 1 dòng | Sản phẩm |
|----|------|---------|----------------|----------|
| TN-01 | `nhung-ngay-phai-chiu-dung` | Những ngày phải chịu đựng (bản blog) | Nhật ký 8/3 ở công ty cũ: 11 đơn không kịp gửi, chính sách phép mới; vết nứt dù đã cố hết sức | `sach-suy-tuong` |
| TN-02 | `khong-thuong-tet-dong-cam` | Không thưởng Tết — hôm đó mình không muốn nói gì tích cực | Buổi họp thông báo; đồng cảm thay vì tích cực giả; tối về nhìn lại quỹ khi bonus = 0 | `so-thu-chi-a5` |
| TN-03 | `kiem-them-va-gia-dinh-lech-nhip` | Khi kiếm thêm và gia đình lệch nhịp | Tự vấn kiểu "bố không biết"; không phải bài dạy giao tiếp; đọc về ngôn ngữ yêu thương như góc soi mình | `sach-5-ngon-ngu-yeu-thuong` |
| TN-04 | `tuan-view-tut-lam-gi` | Tuần view tụt — mình làm gì ngoài việc "cố thêm" | Hành vi cụ thể 4 ngày, không drama thuật toán; giới hạn giờ xem số | `sach-khac-ky-moi-ngay` |
| TN-05 | `lam-tiktok-mot-minh-11h-toi` | Làm TikTok một mình lúc 11 giờ đêm | Scene thật: bàn 1m², con ngủ, thu tiếng thầm; đèn là nhân vật phụ, không CTA mua | `den-ring-light-10` |
| CN-01 | `den-ring-light-10-inch-2-thang` | Đèn ring 10 inch sau 2 tháng quay ban đêm | Vs ánh sáng cửa sổ; khi nào ring thắng, khi nào chưa cần mua; bóng đổ trên mặt sản phẩm | `den-ring-light-10` |
| CN-02 | `tripod-linh-hoat-vs-ke-sach` | Tripod linh hoạt vs kê sách — sau 20 clip unbox | Ổn định, đổi góc nhanh, đau tay; ai vẫn kê sách được | `tripod-phone-flexible` |

## Map sản phẩm → số bài (round 2)

| Sản phẩm | Bài | Ghi chú lịch |
|----------|-----|--------------|
| `sach-7-ngay-affiliate` | TC-03, RS-01 | RS-01 là review chính, publish sau TC-03 |
| `so-thu-chi-a5` | TC-04, TN-02 | TC-04 hướng dẫn, TN-02 CTA mềm |
| `sach-suy-tuong` | RS-03, TN-01 | TN-01 gần như không bán |
| `den-ring-light-10` | TN-05, CN-01 | CN-01 là review chính |
| `powerbank-pd-20k` | TC-01 | |
| `sach-cha-giau-cha-ngheo` | TC-02 | |
| `gimbal-phone-budget` | TC-05 | Góc "đừng trả góp", không phải review |
| `sach-content-bac-ty` | RS-02 | |
| `sach-tam-ly-hoc-ve-tien` | RS-04 | Đã dùng ở TD-01 round 1 — cách ≥2 tuần |
| `sach-khoi-nghiep-tinh-gon` | RS-05 | |
| `sach-5-ngon-ngu-yeu-thuong` | TN-03 | |
| `tripod-phone-flexible` | CN-02 | |

Không dùng trong round 2: `mic-wireless-mini`, `den-led-panel`, `backdrop-green-portable`, `ausync-lab-tts`, `lav-mic-foam`, `mic-boya-m1`, `phone-clamp-cold-shoe`, `so-tay-bujo-a5` — đã có bài cũ hoặc giữ cho vòng sau.

## Mạng internal link

Bài round 2 link về trụ cũ và link chéo trong round 2:

- Trụ MMO: `/blog/lam-tiktok-affiliate-tu-0`, `/blog/thang-dau-co-don-affiliate-so-that`, `/blog/view-co-click-khong-7-cho-soi`, `/blog/7-ngay-affiliate`
- Trụ tư duy: `/blog/tam-the-con-tot-hoi-khac`, `/blog/chuc-mung-neu-ban-khong-giau`, `/blog/nga-tinh-tiep-sau-10-clip-flop`
- Chéo round 2: TC-01 ↔ TC-04 ↔ TC-05, RS-01 ↔ `/blog/7-ngay-affiliate`, TN-04 ↔ `/blog/nga-tinh-tiep-sau-10-clip-flop`, CN-01 ↔ TN-05

## Kết quả thực hiện (2026-08-29)

Đã viết và upsert đủ **17/17 bài**, `published=true`, category đúng pillar.

| Pillar | Trước | Sau |
|--------|-------|-----|
| `mmo` | 18 | 18 |
| `tu-duy` | 6 | 6 |
| `tai-chinh` | 0 | **5** |
| `review-sach` | 0 | **5** |
| `cong-nghe` | 3 | **5** |
| `trai-nghiem` | 0 | **5** |
| **Tổng published** | **27** | **44** |

Đo trên 17 bài mới: 1071–1305 từ phần thân, **1** link `/go` mỗi bài, 2–4 link `/blog` mỗi bài, 17 câu kết khác nhau hoàn toàn.

Verify đã chạy: `npm run build` PASS · `npm run test:unit` 27/27 PASS · 4 bài mới + 6 trang category trả 200 · `/go/{so-thu-chi-a5, sach-cha-giau-cha-ngheo, sach-khoi-nghiep-tinh-gon}` trả 302 · sitemap 55 URL · 0 internal link chết · scan 44 bài không có note nội bộ và không có disclosure.

Commit: `content(round2-1)` plan + tai-chinh · `content(round2-2)` review-sach · `content(round2-3)` trai-nghiem + cong-nghe. Chưa push.

## Còn lại sau round 2 (vòng sau)

- `cong-nghe`: CN-03 wind muff, CN-04 pin dự phòng review, CN-05 gimbal review (plan cũ) — chưa viết, không chặn mục tiêu ≥5.
- `tu-duy`: mở rộng series "Về khắc kỷ" phần 2, 3.
- `tai-chinh`: bài về thuế/kê khai thu nhập affiliate — cần chủ dự án xác nhận số liệu thật trước khi viết.

## Liên quan

- Plan round 1: `docs/content-plan-6-pillars.md`
- Định hướng mảng: `docs/content-themes.md`, `docs/content-pillars.md`
- Voice: `docs/voice-dna-notes.md`, `docs/voice-samples-quankiu.md`
- Quality: `docs/content-quality-notes.md`
