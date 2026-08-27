# Blog optimization plan — giá trị người đọc + affiliate khéo léo

Ngày: 2026-08-27  
Branch: `feature/blog-upgrade` (base `74ced2b`)  
Phạm vi: 15 bài published trên Supabase + catalog products.  
Không thêm disclosure. Không đụng AGENTS.md / admin-auth / blog SSR.

---

## BƯỚC 1 — Review tóm tắt (từng slug)

| Slug | Giá trị | Affiliate | SEO | Vấn đề chính |
|------|---------|-----------|-----|--------------|
| `lam-tiktok-affiliate-tu-0` | Pillar mạnh, lộ trình 30 ngày tốt | 0 link (OK) nhưng nhắc Boya không lối thoát; còn nhắc `/links` (đã bỏ) | Title/desc OK | Sửa `/links`; thêm checklist cuối; soft 1 link mic khi nói “thiếu tiếng” |
| `khoa-hoc-tao-hook-diamondhook` | Quy trình + bài tập tốt | 2× `/go/diamondhook-bo-the` — tự nhiên; **product thiếu trong catalog** | OK | Thêm product; block “Nên mua thẻ nếu”; FAQ; giữ ≤2 link |
| `tong-hop-cau-hook-tiktok` | Kho câu actionable | 1 link DiamondHook hơi “có thể xem” | Title hơi dài nhưng đúng intent | Checklist 10 phút; soft lead-in thẻ; “Nên dùng thẻ nếu” |
| `huong-dan-viet-mo-ta-video-seo` | Checklist + mẫu ngành tốt | 1 sách — ổn | OK | Soft lead sách; “Nên đọc thêm nếu”; FAQ 2 câu |
| `faq-bat-dau-affiliate` | FAQ đúng nhu cầu mới | 0 link (đúng — đừng nhồi deal) | OK | “mua ngay” chỉ trong ngữ cảnh chống hard-sell — giữ; thêm checklist hành động cuối |
| `hau-truong-1-video-30-giay` | Timeline thật rất mạnh | 3 link đúng chỗ quay | OK | Soft “mình đang dùng”; block Nên mua/Không; giữ 3 |
| `gia-tri-truoc-ban-hang-sau` | Mindset + ví dụ cụ thể | 1 sách OK | OK | Soft lead sách; FAQ mindset 2–3 |
| `5-sai-lam-review` | 5 sai + cách sửa rõ | 2 gear đúng chỗ “sửa kỹ thuật” | OK | Thiếu checklist tổng cuối; soft lead; Nên mua nếu |
| `hanh-trinh-4k-follow` | Story thật, số liệu khiêm tốn | 0 link — giữ (story-first) | OK | Checklist việc nhỏ cuối; không ép affiliate |
| `20-mon-do-lam-video-tiktok` | Menu theo nỗi đau tốt | Đủ 3 tầng một | OK | Soft lead; Nên mua tầng một nếu; FAQ; sách nhắc không gắn (đã đủ 3) |
| `text-to-speech-ai-thu-am` | Khi nào dùng/đừng rõ | Ausync + Boya đúng chỗ | OK | Soft lead; checklist TTS; FAQ; siết block Nên/Không |
| `7-ngay-affiliate` | Lộ trình + checklist ngày 4 | 3 link (mic/đèn/sách) — sát ngưỡng | OK | Soft lead; Nên mua sách nếu; FAQ ngắn |
| `tiktok-kich-ban-quay-ngan` | Khung + mẫu script mạnh | Tripod + muff tự nhiên | OK | Soft lead; Nên mua nếu; (chữ “MUA NGAY” là chống hô — giữ) |
| `tiktok-hook-3-giay` | 5 kiểu + bài tập + checklist | Mic + LED đúng “giây đầu sạch” | OK | Soft lead; Nên mua nếu |
| `tiktok-chon-san-pham-review` | Bộ lọc 5 câu rất actionable | Mic + ring đúng “đau thật” | Title ĐỪNG hấp dẫn — giữ | Soft lead; Nên mua gear nếu |

**Phát hiện catalog:** `diamondhook-bo-the` được gắn `/go/...` trên 2 bài nhưng **không có row trong `products`** → `/go` có thể lỗi. Phải INSERT product (`affiliate_url` trống nếu chưa có URL — chủ dự án điền sau; nếu seed cũ có URL thì giữ).

**Không bài nào >3 `/go`.** Không thêm disclosure.

---

## BƯỚC 2 — Mẫu cải tiến chung

Áp dụng nhất quán (giọng Quân Kiu: tự vấn, số cụ thể, không hô deal):

1. **Checklist hành động** — cuối bài (trước `## Kết` nếu chưa có block tick cuối).
2. **Nên mua nếu / Không nên nếu** — với bài có gear/tool/sách; 2–4 gạch đầu dòng, content-first.
3. **FAQ nhanh 2–3 câu** — chỗ còn thắc mắc thật (mindset, tool, thẻ, TTS, sách).
4. **Từ dẫn link** — đổi kiểu catalogue sang:
   - “Mình đang dùng con này khi…”
   - “Nếu bạn đang đau đúng chỗ này, link mình để sạch:”
   - “Cái này mình gắn vì rẻ mà đủ dùng — không phải vì phải mua mới làm được.”
   - Tránh: “bấm mua ngay”, “deal sốc”, “deal xịn”.
5. **≤3 `/go` / bài** — bỏ link thừa nếu vượt; ưu tiên đúng nỗi đau.
6. **SEO** — chỉ đổi title/description khi rõ ràng tốt hơn (xem cột dưới). Hầu hết **giữ nguyên**.
7. **Sửa kỹ thuật copy:** bỏ tham chiếu `/links` trên pillar (route đã gỡ).

### SEO — quyết định

| Slug | Đổi? | Lý do |
|------|------|-------|
| Tất cả 15 | **Giữ title** | Đã khớp intent + giọng kênh |
| `tong-hop-cau-hook-tiktok` | Description **giữ** | Đủ actionable |
| Còn lại | Description **giữ** | Không đổi vì “thẩm mỹ” — chỉ sửa nếu phát sinh trong triển khai |

---

## BƯỚC 3 — Danh sách sửa cụ thể

1. **Catalog:** upsert `diamondhook-bo-the` (name/category/price_hint; `affiliate_url` null hoặc giữ nếu đã có).
2. **`lam-tiktok-affiliate-tu-0`:** thay `/links` → bio / bài đang đẩy / UTM; soft 1× `/go/mic-boya-m1` ở mục Gear; checklist cuối; `products: [{mic-boya-m1}]`.
3. **`khoa-hoc-tao-hook-diamondhook`:** Nên mua thẻ nếu; FAQ; soft 2 lead-in; giữ 2 link.
4. **`tong-hop-cau-hook-tiktok`:** checklist biến tấu; soft DiamondHook; Nên dùng thẻ nếu.
5. **`huong-dan-viet-mo-ta-video-seo`:** soft sách; Nên đọc thêm nếu; FAQ caption.
6. **`faq-bat-dau-affiliate`:** checklist 5 bước cuối; **không** thêm `/go`.
7. **`hau-truong-1-video-30-giay`:** soft 3 lead-in; Nên mua nếu (3 món).
8. **`gia-tri-truoc-ban-hang-sau`:** soft sách; FAQ mindset.
9. **`5-sai-lam-review`:** soft gear; checklist 5 sửa; Nên mua nếu.
10. **`hanh-trinh-4k-follow`:** checklist việc nhỏ; **0** `/go`.
11. **`20-mon-do-lam-video-tiktok`:** soft 3 lead; Nên mua tầng một nếu; FAQ.
12. **`text-to-speech-ai-thu-am`:** soft Ausync/Boya; checklist; FAQ; siết Nên/Không.
13. **`7-ngay-affiliate`:** soft 3 lead; Nên mua sách nếu; FAQ ngày nào làm gì.
14. **`tiktok-kich-ban-quay-ngan`:** soft tripod/muff; Nên mua nếu.
15. **`tiktok-hook-3-giay`:** soft mic/LED; Nên mua nếu.
16. **`tiktok-chon-san-pham-review`:** soft mic/ring; Nên mua gear nếu.

Đồng bộ: cập nhật `scripts/content/<slug>.md` + upsert DB theo slug (giữ slug/title/description trừ khi plan nói đổi — **không đổi**).

---

## Verify

- `npm run build` PASS  
- Đọc lại ≥3 bài đã sửa trong DB (goCount ≤3, có block giá trị mới, không disclosure, không `/links`)  
- Commit tiếng Anh trên `feature/blog-upgrade` — **không push**

---

## Định nghĩa xong

- Plan file này đã ghi.  
- 15 bài + product thiếu đã cập nhật theo mẫu trên.  
- Build pass + spot-check 3 bài.  
- Commit local, không push.
