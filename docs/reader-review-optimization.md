# Đề xuất tối ưu — góc nhìn người đọc

> Review đa persona trên 16 bài published (production `quankiu-daily.vercel.app`, DB Supabase).  
> Ngày review: 2026-08-28 · Branch: `feature/blog-upgrade` (content voice DNA c9b8295).

---

## Bảng đề xuất (ưu tiên trải nghiệm đọc)

| STT | Vấn đề (góc nhìn reader) | Persona bị ảnh hưởng | Mức độ | Đề xuất sửa cụ thể | Effort |
|-----|--------------------------|----------------------|--------|-------------------|--------|
| 1 | Trang `/category/lam-tiktok` và `/categories` hiển thị **"Chưa có bài"** dù có ~12 bài TikTok — vì DB dùng category legacy (`tiktok-money`, `huong-dan`, `faq`…) trong khi filter theo slug chuẩn (`lam-tiktok`). Reader bấm "Chọn theo chủ đề" → thấy blog trống → bounce. | Văn phòng, Affiliate mới | **Cao** | Normalize category khi query + đếm bài (dùng `CATEGORY_ALIASES` đã có trong `content-clusters.ts`). Hiển thị label thân thiện thay slug raw trên PostCard. | M |
| 2 | **Không có bài review gear đơn** (mic/đèn/tripod) — category "Review Gear" trống. Người từ TikTok sang để "đọc trước khi mua" chỉ gặp listicle + nhắc gear trong bài how-to → thiếu bằng chứng mua hàng. | Xem TikTok phân vân gear | **Cao** | Viết 2–3 bài review hands-on (mic Boya, ring 10", tripod) + gán `category: review-gear`. Link từ `20-mon-do-lam-video-tiktok` và `/deals`. | L |
| 3 | **Cùng 3 sản phẩm** (mic Boya, đèn ring, tripod) lặp ở 8+ bài + homepage + `/deals` — reader sau bài thứ 3 cảm giác "blog là landing page Shopee", giảm tin ở bài mindset/FAQ. | Gen Z, Affiliate mới, Gear | **Cao** | Giữ gear CTA ở bài hậu trường/gear; bài FAQ, hành trình, sai lầm **0 link sản phẩm**. Bài khác tối đa 1 link inline + block "Sản phẩm đề xuất" cuối. | M |
| 4 | Homepage hero production ("11h tối, cắt clip…") **cảm xúc tốt** nhưng **không nói rõ blog giúp gì** trong 10 giây — khác với pillar card bên dưới. Reader từ Google/TikTok lạ chưa biết đọc tiếp đâu. | Gen Z, Văn phòng | **Cao** | Hero 1–2 câu value prop: "Hook, lộ trình affiliate, gear đáng tiền — đọc trước, mua sau." Giữ scene mở đầu + CTA pillar ngay trên fold mobile. | S |
| 5 | Bài **Honeygain** lệch niche (treo máy passive income) — xuất hiện đầu `/blog` và homepage, reader TikTok/affiliate thấy "blog này không phải của mình". Raw affiliate URL trong body (`r.honeygain.me`) khác convention `/go/`. | Gen Z, Văn phòng, Affiliate | **Trung bình** | Tách sang category riêng hoặc unpublish khỏi featured; chuyển link qua `/go` nếu giữ. Không để làm bài đầu list khi audience chính là TikTok creator. | S |
| 6 | Bài dài (~1.000–1.400 từ) **không có TOC** (trừ pillar) — trên mobile, reader văn phòng đọc giữa chừng bài hook/list (tổng hợp 13 nhóm, DiamondHook) vì "dài quá, mai đọc tiếp". | Văn phòng, Gen Z | **Trung bình** | Thêm TOC tự động hoặc "TL;DR 3 bullet" đầu bài >800 từ. Chia `tong-hop-cau-hook-tiktok` thành 2 phần có link "Phần 2". | M |
| 7 | Internal links **mỏng** — hầu hết bài chỉ 2–3 link `/blog/...`; pillar có 17 link nhưng reader không phải ai cũng vào pillar trước. Journey "hook → kịch bản → SEO" dễ đứt. | Gen Z, Văn phòng | **Trung bình** | Cuối mỗi bài series TikTok: box "Bước tiếp theo" cố định 2 link (bài trước/sau trong cluster). Related posts ưu tiên cluster thay vì cùng category legacy. | M |
| 8 | Bài **DiamondHook** + **Content Bạc Tỷ** / **7 Ngày Affiliate** (sách/khóa) xen giữa nội dung miễn phí — reader affiliate mới đã từng bị "khóa học ảo" nghi ngờ động cơ. | Gen Z, Affiliate mới | **Trung bình** | Đặt CTA sách/khóa ở cuối, sau bài tập thực hành. Thêm 1 câu disclosure: "Mình dùng sách này, không bắt buộc mua." FAQ và sai lầm giữ 0 link sách. | S |
| 9 | Trang `/deals` là **catalogue sản phẩm** không có context review — gear persona muốn "vì sao Kiu chọn món này" trước khi bấm Shopee. | Xem TikTok phân vân gear | **Trung bình** | Mỗi deal thêm 1 dòng "Đọc bài liên quan →" (khi đã có review). Hoặc blurb dạng "Dùng khi máy lạnh nuốt tiếng — chi tiết trong bài X". | S |
| 10 | **Thiếu social proof / about** trên journey tin tưởng — reader mới không thấy ai là Quân Kiu, số liệu thật (4K follow, không viral) ngoài vài bài hành trình. | Affiliate mới | **Trung bình** | Trang `/about` nổi bật hơn (link từ footer bài có affiliate). 2–3 bullet: niche, kênh TikTok, cam kết review thật. Không cần income flex. | S |
| 11 | Blog list hiển thị category **slug thô** (`tiktok-money`, `hau-truong`) — trông như site chưa polish, giảm trust với reader lần đầu. | Tất cả | **Thấp** | `PostCard` map slug → label (`Làm TikTok`, `Hậu trường`…) qua `CATEGORY_ALIASES` + `getCategoryLabel`. | S |
| 12 | **Không có bài "đo / debug affiliate"** (cookie, UTM, vì sao không đơn) — reader đã thử affiliate đọc xong mindset vẫn không biết bước kỹ thuật tiếp theo. | Affiliate mới | **Trung bình** | 1 bài checklist debug: bio link, UTM, Shopee dashboard, thời gian cookie — nối từ FAQ câu 5. Không cần số nhạy cảm. | M |

---

## Ghi chú review

- **Điểm mạnh giữ nguyên:** Giọng Quân Kiu (voice DNA) chân thật, pillar `lam-tiktok-affiliate-tu-0` là hub tốt, FAQ/5 sai lầm/giá trị trước xây trust mạnh, affiliate CTA mềm hơn bản cũ.
- **Phạm vi:** Chỉ đề xuất — chưa sửa code/content trong task này.
