# Admin UX v2 — Design Spec

**Date:** 2026-08-28  
**Status:** Implemented on `feature/admin-ux-v2`

## Goals

1. Admin shell riêng biệt (palette trung tính, cam chỉ CTA)
2. Navigation rõ: `/admin/posts` tách khỏi dashboard
3. Dashboard task-first: việc cần làm trước stats
4. Post editor 4 sections + publish guard có link sửa SP
5. Products: category select, mobile cards, affiliate validation
6. CSS admin tách `src/styles/admin.css`

## Key routes

| Route | Purpose |
|---|---|
| `/admin` | Dashboard + todo widgets |
| `/admin/posts` | Danh sách bài (filter `?status=draft`) |
| `/admin/posts/new` | Editor tạo mới |
| `/admin/posts/[id]` | Editor sửa |
| `/admin/products` | Catalog (`?affiliate=empty`) |

## Verification

- `npm run build`
- `npm run test:unit`
- Manual: mobile 390px — sidebar đóng khi chọn link, product cards, post sections
