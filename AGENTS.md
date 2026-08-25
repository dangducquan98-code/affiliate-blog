# Affiliate Blog — Project Guide (AGENTS.md)

## Dự án

Blog cá nhân của **Quân Kiu** để kéo traffic từ TikTok/Facebook về, kiếm tiền qua **Shopee Affiliate** (cookie-based: chỉ cần user dính cookie, mọi đơn hàng sau đó đều có hoa hồng — nên mục tiêu là càng nhiều traffic càng tốt).

## Mục tiêu cốt lõi

1. **Kéo traffic** từ TikTok (~4K followers, kênh review sản phẩm), Facebook và các nguồn social về blog.
2. **Nội dung giá trị** (review, so sánh, hướng dẫn, deal hời) — không bán hàng trực diện, content-first.
3. **Affiliate links** nhúng tự nhiên trong bài viết + có khu vực/trang riêng cho affiliate (deal hub, danh sách sản phẩm).
4. **SEO tốt + load nhanh + mobile-first** — traffic chủ yếu từ social, mobile là chính.
5. **Deploy pipeline**: GitHub `main` → Vercel auto-deploy (mỗi lần push main là tự build).

## Quy trình bắt buộc — Superpowers

Các skill trong `.cursor/skills/` là bắt buộc, không phải gợi ý:

1. **brainstorming** — trước MỌI code: Socratic design, làm rõ requirements, lưu design doc.
2. **writing-plans** — sau khi design duyệt: chia plan thành task 2-5 phút, ghi file path + code + verification.
3. **using-git-worktrees** — làm việc trên worktree/branch riêng, không commit thẳng lên main.
4. **test-driven-development** — RED-GREEN-REFACTOR, không viết code trước test khi có thể test được.
5. **verification-before-completion** — verify bằng chứng thật (build, curl, test) TRƯỚC KHI báo xong.
6. **requesting-code-review** — review giữa các phase, critical issues phải fix trước khi tiếp tục.
7. **finishing-a-development-branch** — verify tests, merge/PR sạch sẽ, dọn worktree.

## Rules

- **Ngôn ngữ**: content tiếng Việt (thuật ngữ chuyên ngành giữ tiếng Anh). Code/commit message tiếng Anh.
- **KHÔNG commit credentials**: Shopee affiliate links, API keys, secrets → `.env.local`, không bao giờ commit. `.env*` trong `.gitignore`.
- **Affiliate links**: phải đi qua redirect/clean URL (ví dụ `/go/<slug>`) để dễ quản lý + không lộ raw affiliate URL. KHÔNG nhồi nhét link — link tự nhiên trong content.
- **Mọi thay đổi code** phải được chủ dự án (Quân Kiu) duyệt trước khi merge vào main.
- **Deploy**: push main → Vercel auto-build. Luôn build local thành công trước khi push.
- **SEO bắt buộc** mỗi bài: title, meta description, OG tags, canonical, sitemap, structured data (Review/Product/Article) nếu hợp lý.

## Context tham khảo

- Kho kiến thức affiliate: `/Users/quandang/Documents/QUAN DANG AI PROJECT/Ads and Affiliate` (chiến lược popunder, native ads, landing page conversion).
- Kho content TikTok: `/Users/quandang/Documents/QUAN DANG AI PROJECT/Tiktok` (hook, kịch bản thu âm, mô tả SEO — style content của Quân Kiu).
- Blog BA/ERP hiện tại (tham khảo kỹ thuật): quanlamba.com — Hugo + Blowfish.

## Kỹ thuật gợi ý (Cursor được đề xuất, chủ dự án duyệt cuối)

- Static-first hoặc hybrid rendering (Vercel-friendly): Next.js / Astro / Hugo đều được — chọn cái tối ưu cho SEO + affiliate + tốc độ.
- Analytics: Vercel Analytics hoặc GA4/Plausible — đo traffic từ đâu về.
- Affiliate link manager: đơn giản, không cần DB phức tạp lúc đầu.
