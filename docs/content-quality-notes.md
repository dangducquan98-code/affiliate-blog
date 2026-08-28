# Content quality notes — Content-first (bắt buộc)

> Áp dụng cho **mọi** bài trên Quân Kiu Daily (blog + series).  
> Chủ dự án + agent đều tuân theo. Cập nhật: 2026-08-27.  
> Giọng văn: `docs/voice-profile-quankiu.md`. Series TikTok: `docs/content-series-tiktok.md`.

---

## Nguyên tắc cốt lõi

**Người đọc KHÔNG muốn xem một trang chỉ toàn gắn link.**

Phải viết nội dung **có giá trị** trước; gắn link affiliate **thật khéo** sau — như phần thưởng phụ ở cuối mạch nội dung, không phải lý do tồn tại của bài.

### Định nghĩa “content có giá trị”

Người đọc học được điều gì đó thực dụng. **Ngay cả khi bỏ hết link affiliate**, bài vẫn đáng đọc, đáng share.

Test nhanh: tưởng tượng xoá mọi `/go/...` và CTA — bài còn đứng được không? Nếu không → viết lại phần giá trị trước khi gắn link.

---

## Checklist trước khi publish (mọi bài)

- [ ] **Bỏ hết link → bài còn giá trị?** Ví dụ thật, con số, sai lầm, bài học — không generic.
- [ ] **Link nằm tự nhiên** trong mạch “đồ mình đang dùng / nếu cần thì đây” — không “mua ngay” lặp lại mọi đoạn.
- [ ] **Số link/bài:** tối đa **2–3 chỗ** gắn `/go/...` + **1 CTA mềm** cuối bài. Không nhồi.
- [ ] **Tỷ lệ ước lượng:** ≥85% nội dung giá trị, ≤15% CTA/link.
- [ ] **Mở bài bằng tình huống** (không định nghĩa / “Hôm nay mình sẽ…”).
- [ ] **Kết bằng câu hỏi mở thực chất** (để comment / suy nghĩ — không hô mua).
- [ ] **Voice:** xưng “mình”, gọi “bạn” / “anh em”; khẩu ngữ vừa phải; không AI-sáo.
- [ ] **Không dùng disclosure block** (theo chủ dự án). Nội dung vẫn phải trung thực, không lừa dối — nói thật trải nghiệm; không giấu điểm yếu để chốt đơn.
- [ ] SEO cơ bản: title, description, canonical/OG theo template site — nhưng SEO không thay thế giá trị đọc.

---

## Cách gắn link (khéo)

| Được | Không được |
|------|------------|
| Sau khi đã cho đủ quan điểm / bài học | Mở bài bằng “mua ngay” / list deal |
| “Mình đang dùng vì…” + 1 link | Mỗi đoạn một `/go/...` |
| Nhắc gear không link nếu chưa cần mua | 4–6 sản phẩm trong một section “gear” |
| CTA cuối: hỏi / mời đọc thêm / bio | CTA hô hào lặp lại giữa bài |

Link đi qua `/go/<slug>` (URL sạch). Không nhồi raw affiliate URL vào body.

---

## Độ dài gợi ý (bài hướng dẫn / series)

- Mục tiêu thực dụng: đủ sâu để tự đứng không link — thường ~1000–1800 từ với bài “cách làm”.
- Dài mà loãng + nhiều CTA vẫn fail test “bỏ link”.
- Ngắn mà đặc (ví dụ thật + checklist) vẫn ổn hơn dài generic.

---

## Quy trình agent / biên tập

1. Viết hoặc sửa **phần giá trị** trước (tình huống → quan điểm → ví dụ → checklist).
2. Chỉ khi mạch đã đứng: chọn **tối đa 2–3** product slug khớp nỗi đau trong bài.
3. Đặt link ở section “đang dùng / nếu cần” **sau** phần giá trị chính.
4. Chạy checklist trên; upsert theo slug nếu sửa bài cũ — không tạo bài trùng.
5. Không đánh đổi content-first để “nhồi” catalog products.

---

## CẤM note nội bộ trong content

Mọi ghi chú dành cho chủ dự án — sản phẩm thiếu link, kế hoạch gốc, thay thế tạm, TODO, "điền sau", "chờ link", "sẽ cập nhật" — **TUYỆT ĐỐI KHÔNG** viết vào:

- `content` bài trong Supabase (`posts`)
- `scripts/content/*.md` (nguồn upsert)
- Body bài public (MDX/markdown render)

**Để note ở đâu:** file plan/docs riêng — ví dụ `docs/content-plan-*`, `docs/products-*`, issue nội bộ. Agent viết bài xong phải tự scan pattern trước khi upsert/publish.

Pattern cấm (không xuất hiện trong bài public):

| Pattern | Ví dụ sai |
|---------|-----------|
| `Ghi chú sản phẩm` | `> **Ghi chú sản phẩm:** Kế hoạch gốc gắn sách X...` |
| `Kế hoạch gốc` | `Kế hoạch gốc gắn Ego is the Enemy — chưa có link` |
| `chưa có link Shopee` | Trong blockquote hoặc ngoại lề bài |
| `Thay thế tạm` | `(Thay thế tạm cho X khi có link sẽ cập nhật bài.)` |
| `TODO`, `điền sau`, `chờ link` | Dòng ghi chú biên tập |

Test trước publish: grep toàn bộ slug + `scripts/content/<slug>.md` với các pattern trên → **0 match**.

---

## Liên quan

- Voice: `docs/voice-profile-quankiu.md`
- Series TikTok outline: `docs/content-series-tiktok.md`
- Affiliate metadata: `src/data/affiliates.yaml` + products trong admin (URL trong env/DB, không commit secret)
