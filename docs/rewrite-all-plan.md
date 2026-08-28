# Kế hoạch viết lại toàn bộ 27 bài — giọng tự nhiên thật sự

Ngày: 28/08/2026 · Branch: `feature/blog-upgrade` (base `42b1b11`)
Nguồn giọng: `docs/voice-samples-quankiu.md`, `docs/voice-dna-notes.md`, `docs/voice-profile-quankiu.md`

---

## 1. Chẩn đoán — vì sao đọc khó hiểu và thiếu tự nhiên

Đã dump toàn bộ 27 bài từ DB và đọc. Vấn đề KHÔNG nằm ở từng bài mà nằm ở **cách viết chung**. Chủ dự án đọc hết cả blog nên phát hiện ngay — đọc một bài thì tạm ổn, đọc năm bài thì lộ ra là máy sản xuất theo khuôn.

### 1.1. Khẩu ngữ bị dán thành nhãn (lỗi nặng nhất)

Các câu chữ ký lấy từ sample thật bị copy vào gần như mọi bài:

| Cụm | Số bài đang dùng |
|---|---|
| "Ngã tính tiếp." (kết bài) | 18/27 |
| "Hmm… thế là vẫn mệt đầu" (mở bài) | 16/27 |
| "Có thế thôi." | 13/27 |
| "Mình viết mấy dòng này không có ý…" | 9/27 |
| "lủng cà lủng củng" / "mệt phết" | 6/27 |
| "Chủ nhật, một ngày lang thang" | 2/27 |

Trong sample thật, mỗi câu đó xuất hiện **đúng một lần, trong đúng một hoàn cảnh**. Khi bị lặp 18 lần nó không còn là giọng người nữa, nó thành macro. Đây là nguyên nhân số một của cảm giác "không phải giọng tôi".

### 1.2. Nhịp giật cục, câu cụt thiếu chủ ngữ

Rất nhiều đoạn là chuỗi câu 3-5 từ không có chủ ngữ lẫn vị ngữ đầy đủ, nối bằng dấu gạch ngang:

> "Không cần setup đắt. Cần setup đỡ hại hook."
> "Số không cần nghiên cứu. Số cần của mình."
> "Nghe nặng. Ý tích cực: đừng kiêu khi đỉnh cao."

Người đọc phải tự điền chủ ngữ mới hiểu — đúng đó là lý do "đọc phải đọc lại hai lần". Sample thật của Quân Kiu là **văn xuôi chảy**: câu dài có mệnh đề phụ, nối bằng "mà", "thì", "nên", "chứ", "với lại", rồi mới chốt bằng một câu ngắn. Câu ngắn trong sample là điểm nhấn, không phải mặc định.

### 1.3. Dấu gạch ngang em-dash thay cho liên từ

Trung bình 25-40 dấu `—` mỗi bài. Nó biến câu thành ghi chú rời. Sample thật dùng dấu phẩy và liên từ.

### 1.4. Nhét tiếng Anh và thuật ngữ sai chỗ

"scope realistic", "calibrate kỳ vọng", "attribution lệch campaign trong đầu mình", "Không pretent triết gia", "flop click", "cookie lủng", "click lẹ". Chêm tiếng Anh trong sample là "nó work", "case lẻ" — từ đơn, nghe được khi nói. Còn "attribution lệch campaign" thì không ai nói ra miệng.

### 1.5. Lỗi thật sự trong bản đang publish

- `thoi-quen-sang…`: "**forty phút** sau chưa quay gì" — lẫn tiếng Anh giữa câu.
- `chuc-mung…`: "không bảo **lưỡng**" (sai chính tả, đúng là "lười").
- `ve-khac-ky…` và `tam-the…`: "Không **pretent** triết gia".
- `chuc-mung…`: heading "## Kết — không hỏi marketing" → **chỉ dẫn nội bộ lọt vào content**.
- `chuc-mung…`: "Cấu trúc lặp đó mình từng đăng Facebook. Copy sang blog vì…" và `tam-the…`: "Mình copy ý từ Facebook sang blog vì…" → **note quy trình nội bộ**, người đọc không cần biết.
- `huong-dan-honeygain…`: mở bài bằng blockquote "**Lưu ý:** Bài phụ — không thuộc chuỗi làm TikTok affiliate trên blog" → **note định vị nội bộ**.
- `tong-hop-cau-hook…`: "Nguồn tổng hợp từ KOC/KOL… phần 'thật' khi áp dụng là trách nhiệm của mình" → disclaimer kiểu pháp lý, không phải giọng blog.

### 1.6. Cấu trúc giống tài liệu kỹ thuật, không giống bài kể

Bài 1035 từ mà 14 heading H2 → mỗi mục 70 từ. Có bài còn "## Mục lục", "## Liên quan trên blog", "## Nên mua nếu / Không nên nếu". Đó là layout doc, không phải bài viết của người kể chuyện.

### 1.7. Nhồi internal link

4 bài có 17-19 link nội bộ trong ~1000 từ. Đoạn cuối nhiều bài chỉ là danh sách link. Đọc lên nghe như SEO farm.

### 1.8. Lặp motif đến mức nhàm

"người ta vuốt", "nghe lại bằng loa điện thoại", "For You lạnh", "cookie", "tắt tiếng vẫn hiểu" xuất hiện xuyên suốt gần như mọi bài, kể cả bài tư duy không liên quan.

---

## 2. Danh sách 27 bài + nhận xét

Thứ tự theo phase. `W` = số từ hiện tại, `H2` = số heading, `IL` = link nội bộ.

### Phase 1 — 9 bài hot nhất (pillar, series TikTok lõi, MMO số liệu)

| # | Slug | W / H2 / IL | Chỗ khó hiểu & thiếu tự nhiên |
|---|---|---|---|
| 1 | `lam-tiktok-affiliate-tu-0` | 1429 / 9 / 17 | Pillar mà mở bằng "lủng cà lủng củng" dán vào; có "## Mục lục" anchor kiểu wiki; 17 link nội bộ khiến bài thành trang chuyển tiếp chứ không phải bài đọc được; kết "Ngã tính tiếp." |
| 2 | `tiktok-hook-3-giay` | 1461 / 12 / 3 | Nặng nhất về câu cụt: "Không cần setup đắt. Cần setup đỡ hại hook." 12 H2 cho một chủ đề duy nhất → vụn; "loa điện thoại" lặp 4 lần; mở "Hmm…", kết "Ngã tính tiếp." |
| 3 | `tiktok-kich-ban-quay-ngan` | 1387 / 7 / 4 | Mở bài kể chuyện khá được, nhưng thân bài rơi vào liệt kê khô "claim / bằng chứng / chốt"; "mệt phết" dùng 2 lần trong một bài; kết chồng 3 câu khẩu hiệu. |
| 4 | `tiktok-chon-san-pham-review` | 1414 / 12 / 4 | "Có thế thôi đã đủ để dừng lại" ở đoạn 2 — dùng sai chỗ, đọc không hiểu ý; bộ lọc 5 câu trình bày như form; 12 H2. |
| 5 | `view-co-click-khong-7-cho-soi` | 1193 / 10 / 11 | Checklist 7 mục nhưng mỗi mục lại chèn thêm 2 link → mất mạch; "Không xếp alphabet. Không nhét form lead." vô nghĩa với người đọc; có mục "## Liên quan trên blog". |
| 6 | `chuc-mung-neu-ban-khong-giau` | 1000 / 11 / 10 | Bài tệ nhất. Cắt cụt cấu trúc lặp vốn là linh hồn bản gốc; có note nội bộ ("Copy sang blog vì…"), heading "Kết — không hỏi marketing", sai chính tả "bảo lưỡng", "scope realistic"; 10 link nội bộ nhét vào một bài suy ngẫm. |
| 7 | `cookie-shopee-affiliate-tiktok-4k` | 1359 / 12 / 10 | Giọng nửa policy nửa kể; "flop click", "cookie lủng"; hai câu "Ngã tính tiếp" trong cùng vùng kết. |
| 8 | `thang-dau-co-don-affiliate-so-that` | 1085 / 11 / 13 | Bài về số nhưng số bị chôn trong câu cụt; "đối chiếu expectation"; 13 link nội bộ. |
| 9 | `gia-tri-truoc-ban-hang-sau` | 1144 / 8 / 2 | Mở bài ổn nhất trong cả blog, nhưng kết nhồi 4 câu slogan liên tiếp ("Phá mắt xích đầu thì hoa hồng trên giấy chỉ để tự an ủi. Ngã tính tiếp."). |

### Phase 2 — 9 bài MMO / kỹ năng

| # | Slug | W / H2 / IL | Chỗ khó hiểu & thiếu tự nhiên |
|---|---|---|---|
| 10 | `comment-ghim-3-mau-khong-spam` | 1211 / 13 / 11 | 13 H2 cho bài 3 mẫu; mở bài không có tình huống, vào thẳng định nghĩa; kết là 2 dòng link + "Ngã tính tiếp." |
| 11 | `funnel-tiktok-blog-caption` | 1091 / 13 / 17 | Mở bằng ẩn dụ "Clip là cửa. Blog là phòng." nghe rất AI; 17 link; bold giữa câu kiểu SEO. |
| 12 | `5-sai-lam-review` | 1043 / 6 / 3 | Cấu trúc còn đọc được, nhưng mở "Hmm… thế là vẫn mệt đầu" + kết "Có thế thôi." dán; mỗi sai lầm trình bày đều nhau như biểu mẫu. |
| 13 | `faq-bat-dau-affiliate` | 1164 / 7 / 3 | Trả lời đúng nhưng khô như FAQ helpdesk; "Còn tiếp — tuần sau mình có thể đào sâu…" là hứa hẹn giả. |
| 14 | `7-ngay-affiliate` | 1340 / 10 / 3 | 7 ngày thành 7 khối giống nhau; "Ý tưởng gốc mình từng tổng hợp từ sách và ví dụ cộng đồng" = disclaimer nội bộ; "pro overnight". |
| 15 | `hanh-trinh-4k-follow` | 1282 / 7 / 2 | Bài đáng ra cảm xúc nhất lại bị chèn "Hmm… thế là vẫn mệt đầu" ngay sau câu hay ("Hai trăm."); kết lại "Ngã tính tiếp." |
| 16 | `khoa-hoc-tao-hook-diamondhook` | 1464 / 9 / 3 | Giọng giáo trình ("quy trình 3 bước", "năm định dạng bắt buộc"); trùng nội dung nặng với bài 2 và 17. |
| 17 | `tong-hop-cau-hook-tiktok` | 1390 / 12 / 2 | 13 nhóm hook liệt kê khô, đọc như file Excel; có disclaimer nguồn kiểu pháp lý ở cuối. |
| 18 | `huong-dan-viet-mo-ta-video-seo` | 1217 / 11 / 3 | "Khung 200–300 ký tự" trình bày như spec; mẫu theo ngành liệt kê không có người trong đó. |

### Phase 3 — 9 bài tư duy / công nghệ / hậu trường

| # | Slug | W / H2 / IL | Chỗ khó hiểu & thiếu tự nhiên |
|---|---|---|---|
| 19 | `nga-tinh-tiep-sau-10-clip-flop` | 996 / 12 / 17 | "Ngã tính tiếp" xuất hiện 3 lần trong bài tên đã là "ngã tính tiếp"; 17 link trong bài 996 từ. |
| 20 | `tam-the-con-tot-hoi-khac` | 1025 / 13 / 12 | Có note nội bộ "Mình copy ý từ Facebook sang blog vì…"; heading "Stoic đời thường — không pretent"; kết chồng 3 câu chữ ký sample. |
| 21 | `ve-khac-ky-phan-1-tham-lam-mong-cau` | 1012 / 11 / 10 | Gán câu cho Marcus Aurelius mà bản gốc không hề gán; "Không pretent triết gia"; bài triết mà 10 link affiliate/funnel. |
| 22 | `thoi-quen-sang-15-phut-truoc-khi-quay` | 1035 / 14 / 19 | 14 H2 + 19 link cho bài 1035 từ — tệ nhất về mật độ; lỗi "forty phút". |
| 23 | `hau-truong-1-video-30-giay` | 1200 / 8 / 3 | Timeline tốt, nhưng viết dạng bảng giờ khô; mở "Người ngoài thấy clip 30 giây. Mình thấy cái đồng hồ" hơi kịch. |
| 24 | `review-mic-boya-by-m1` | 1262 / 9 / 0 | Bài review duy nhất không có link nội bộ, nhưng đầy câu cụt; kết chồng "Có thế thôi. Ngã tính tiếp." liền nhau. |
| 25 | `20-mon-do-lam-video-tiktok` | 1298 / 9 / 2 | 20+ món liệt kê thành catalogue, không có trải nghiệm trong từng món; "Mình viết mấy dòng này không có ý…" dán. |
| 26 | `text-to-speech-ai-thu-am` | 1177 / 6 / 2 | Mở bài khá thật (Gấu khóc), nhưng thân bài thành hướng dẫn tool; kết vay câu "Chủ nhật, một ngày lang thang" từ sample — không liên quan. |
| 27 | `huong-dan-honeygain-treo-may` | 744 / 9 / 1 | Ngắn nhất (744 từ, dưới chuẩn); mở bằng blockquote note nội bộ; giọng gần như hướng dẫn cài đặt thuần. |

---

## 3. Tiêu chí "đạt" cho mỗi bài

Một bài chỉ được coi là xong khi qua hết 5 cửa:

1. **Đọc thành tiếng tự nhiên.** Đọc to cả bài, không chỗ nào phải ngắt hơi giữa câu hoặc tự điền chủ ngữ. Câu văn xuôi chảy là mặc định; câu ngắn dứt khoát chỉ dùng làm điểm nhấn, tối đa 2-3 lần mỗi bài.
2. **Mạch ý rõ, không phải đọc lại hai lần.** Mỗi đoạn có một ý, nối với đoạn trước bằng liên từ hoặc bằng chính câu chuyện. Tối đa 5-7 H2 mỗi bài, không "Mục lục", không "Liên quan trên blog", không "Nên mua nếu / Không nên nếu".
3. **Giọng "mình / bạn / anh em" đúng sample.** Xưng "mình", gọi "bạn" hoặc "anh em". Có tự vấn thật, có humor nhẹ, có chi tiết cụ thể (giờ, con số, tên đồ, chuyện nhà). Không "tôi", không "quý độc giả", không giọng chuyên gia.
4. **Content-first, tối đa 2-3 link `/go` và tối đa 3-4 link nội bộ**, đặt trong câu kể chứ không thành danh sách.
5. **Không note nội bộ, không disclosure, không disclaimer nguồn.** Không nhắc "copy từ Facebook", "bài phụ không thuộc chuỗi", "không cam kết thu nhập" kiểu điều khoản.

### Ngân sách câu chữ ký (bắt buộc tuân thủ)

Để không tái phạm lỗi macro, mỗi cụm dưới đây được dùng **tối đa 1 lần trên toàn bộ 27 bài**, và phải đúng hoàn cảnh:

- "Ngã tính tiếp." → chỉ bài 19 (`nga-tinh-tiep-sau-10-clip-flop`)
- "Có thế thôi!" → chỉ bài 20 (`tam-the-con-tot-hoi-khac`)
- "Hmm…" → tối đa 1 bài
- "Chúng mình" → tối đa 2 bài (bài tư duy)
- "lủng cà lủng củng", "mệt phết", "lóc cóc" → mỗi từ tối đa 1 bài
- "Mình viết mấy dòng này…" → tối đa 1 bài
- 26 bài còn lại phải có **kết riêng, viết mới hoàn toàn**.

### Chỉ tiêu định lượng mỗi bài

- 900-1500 từ
- ≤ 7 heading H2
- ≤ 12 dấu `—` (thay bằng dấu phẩy và liên từ)
- ≤ 3 link `/go`, ≤ 4 link `/blog/`
- 0 chuỗi 3 câu liên tiếp dưới 6 từ

---

## 4. Ghi chú kỹ thuật

- Viết ra `scripts/content/rewrite-v2/<slug>.md`, upsert bằng `scripts/rewrite-natural-voice.ts`.
- Script chỉ ghi `content` (và `description` nếu file có frontmatter `description`). `slug`, `title`, `tags`, `category`, `products`, `published` đọc lại từ DB rồi giữ nguyên → không có nguy cơ mất dữ liệu.
- `published = true` cho cả 27.
- **Cần chủ dự án xử lý riêng:** product `diamondhook-bo-the` được gắn vào 2 bài và có link `/go/diamondhook-bo-the` trong content, nhưng slug này **không tồn tại trong bảng `products`** → `/go` trả 404. Bản viết lại sẽ không dùng link đó nữa (vẫn giữ product gắn vào bài như yêu cầu).

---

## 5. Trạng thái thực hiện

- [x] Phase 1 — 9 bài
- [x] Phase 2 — 9 bài
- [x] Phase 3 — 9 bài
