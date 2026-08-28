# UX/UI Polish Design Spec

**Date:** 2026-08-28  
**Branch:** `feature/ux-ui-polish`  
**Status:** Implemented  
**Brand:** Quân Kiu Daily

## Goal

Nâng cấp UX/UI toàn diện cho site public (mobile-first, TikTok traffic) và admin (workflow viết bài + affiliate), giữ identity cam hiện tại, không đổi chiến lược affiliate soft-sell.

## Decisions

| Area | Decision |
|------|----------|
| Visual | Evolution + refresh vừa: bo góc 10px, card shadow, token đầy đủ |
| Public nav | Hamburger drawer mobile; desktop giữ horizontal nav |
| Layout lists | Grid card responsive (blog, deals, categories, related) |
| Reading | Breadcrumb, thời gian đọc, CTA thống nhất "Xem trên Shopee" |
| Homepage | Pillar card nổi bật → `lam-tiktok-affiliate-tu-0` |
| Admin | `AdminLayout` sidebar + mobile menu; publish guard banner client-side |
| A11y | Skip link, `:focus-visible`, touch min 44px |
| CSS bug | Khai báo `--surface` và design tokens thiếu |

## Out of scope

- Rebrand hoàn toàn / illustration system
- Dark mode
- Thay đổi logic affiliate, publish API, Supabase schema

## Verify

- `npm run build`
- `npm run test:unit`
- Manual: mobile nav, admin sidebar, publish guard banner, pillar CTA
