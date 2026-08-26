# MVP Scaffold Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold a static Astro affiliate blog (homepage, MDX blog, deals hub, `/go` redirects, SEO) that builds locally and never commits raw affiliate URLs.

**Architecture:** Astro static site with MDX content collections, YAML for affiliates/deals metadata, destination URLs injected at build from `.env.local` via `AFFILIATE_<SLUG_UPPER>`, SSR-free `/go/[slug]` redirect route (Astro endpoint or SSR-lite with static adapter fallback using API route). Deploy target: Vercel static.

**Tech Stack:** Astro 5 + TypeScript strict + MDX + `@astrojs/sitemap` + `@vercel/analytics` + YAML data files

**Spec:** `docs/project-brief-draft.md` (Phase 1 Discovery approved: niche gadget, Astro, MVP scope)

## Global Constraints

- Brand placeholder: **Kiu Chốt Deal** (change later)
- `SITE_URL` from env only — never hardcode production domain
- Affiliate destination URLs only in `.env.local` (gitignored); YAML holds slug + metadata only
- Content language: Vietnamese; code/commits: English
- Branch: `feature/mvp-scaffold` only — no merge to `main`, no push, no remote
- Do not commit `.env.local` or `node_modules`
- Mobile-first CSS; avoid purple/cream/serif-newspaper AI-default looks
- Build must pass: `npm run build`
- Smoke: `/go/<slug>` returns 302 to placeholder destination

---

## File Structure

| Path | Responsibility |
|------|----------------|
| `package.json` | Scripts + deps |
| `astro.config.mjs` | site from SITE_URL, MDX, sitemap |
| `tsconfig.json` | Strict TS |
| `.env.example` | Documented env keys (safe to commit) |
| `.env.local` | Real local values (gitignored) |
| `src/env.d.ts` | Import meta env types |
| `src/styles/global.css` | Brand tokens + mobile-first base |
| `src/layouts/BaseLayout.astro` | HTML shell, SEO meta, Analytics |
| `src/components/Header.astro` | Nav |
| `src/components/Footer.astro` | Footer + disclosure |
| `src/components/PostCard.astro` | Blog list item |
| `src/components/DealItem.astro` | Deal list row |
| `src/content.config.ts` | Blog collection schema |
| `src/content/blog/*.mdx` | 5 posts |
| `src/data/affiliates.yaml` | Slug + metadata (no URLs) |
| `src/data/deals.yaml` | Deal hub entries |
| `src/lib/affiliates.ts` | Load YAML + resolve env URL |
| `src/lib/deals.ts` | Load deals YAML |
| `src/lib/site.ts` | SITE_URL helper |
| `src/pages/index.astro` | Home |
| `src/pages/about.astro` | About |
| `src/pages/blog/index.astro` | Blog list |
| `src/pages/blog/[slug].astro` | Post |
| `src/pages/deals.astro` | Deal hub |
| `src/pages/go/[slug].ts` | 302 redirect endpoint |
| `src/pages/robots.txt.ts` | robots.txt |
| `public/og-default.svg` | Placeholder OG |
| `README.md` | Run / content / affiliate / deploy |

---

### Task 1: Astro scaffold + config

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/env.d.ts`, `.env.example`
- Modify: `.gitignore` (ensure `.env.local`, `dist/`, `.astro/` ignored)

**Interfaces:**
- Produces: Astro project that `npm install` + `npm run build` works empty

- [ ] **Step 1: Scaffold Astro non-interactive into current repo**

```bash
npm create astro@latest . -- --template minimal --typescript strict --no-install --no-git --yes
```

If CLI flags differ, use equivalent non-interactive options. Do not re-init git.

- [ ] **Step 2: Install dependencies**

```bash
npm install
npm install @astrojs/mdx @astrojs/sitemap @vercel/analytics yaml
```

- [ ] **Step 3: Configure `astro.config.mjs`**

```js
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

const site = process.env.SITE_URL || 'http://localhost:4321';

export default defineConfig({
  site,
  integrations: [mdx(), sitemap()],
  output: 'static',
});
```

Note: `/go/[slug]` as `.ts` endpoint needs `output: 'server'` OR use prerendered redirects via `getStaticPaths` returning `redirect`. Prefer **static** with `Astro.redirect` in a prerendered page that reads env at build time — OR hybrid: static site + server endpoint for `/go`.

**Chosen approach for Vercel static:** Use `src/pages/go/[slug].ts` with Astro middleware/API route requires adapter. Simpler MVP: **`src/pages/go/[slug].astro`** with `export const prerender = true`, `getStaticPaths` from affiliates.yaml, and in frontmatter:

```astro
---
return Astro.redirect(destination, 302);
---
```

Astro static redirect generates meta/HTTP redirect in adapters; on static hosting, `astro build` with redirects in `_redirects` / vercel.json. For pure static without adapter, implement:

```ts
// src/pages/go/[slug].ts
import type { APIRoute } from 'astro';
export const prerender = false; // needs server
```

**MVP decision:** Add `@astrojs/vercel` with `output: 'static'` and generate `vercel.json` redirects at build from affiliates, OR use on-demand SSR only for `/go`.

**Simplest reliable approach:** `output: 'static'` + build script writes `public/_redirects` / `vercel.json` redirects from env. Even simpler for local smoke: page `[slug].astro` that does:

```html
<meta http-equiv="refresh" content="0;url=DEST">
```

plus JS `location.replace` — not ideal for SEO of redirects but affiliate clicks work.

**Better:** `@astrojs/vercel` adapter `output: 'server'` with `prerender` default true, only `/go/[slug]` has `prerender = false`.

```js
import vercel from '@astrojs/vercel';
export default defineConfig({
  site,
  output: 'server',
  adapter: vercel(),
  integrations: [mdx(), sitemap()],
});
```

```ts
// go/[slug].ts
export const prerender = false;
export const GET: APIRoute = ({ params }) => {
  const url = resolveAffiliateUrl(params.slug!);
  if (!url) return new Response('Not found', { status: 404 });
  return Response.redirect(url, 302);
};
```

Install: `npm install @astrojs/vercel`

- [ ] **Step 4: Add `.env.example` and local `.env.local`**

`.env.example` (commit):
```
SITE_URL=http://localhost:4321
AFFILIATE_CU_SAC_20W=https://s.shopee.vn/placeholder-cu-sac-20w
AFFILIATE_UGREEN_HUB_UNO=https://s.shopee.vn/placeholder-ugreen-hub-uno
AFFILIATE_TAI_NGHE_BT_300K=https://s.shopee.vn/placeholder-tai-nghe-bt
AFFILIATE_GAY_SELFIE_MINI=https://s.shopee.vn/placeholder-gay-selfie
AFFILIATE_CAP_SILICON_IPHONE=https://s.shopee.vn/placeholder-cap-silicon
```

Copy to `.env.local` for local use.

- [ ] **Step 5: Verify scaffold builds**

```bash
npm run build
```

Expected: exit 0 (may be empty site)

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "chore: scaffold Astro TypeScript project"
```

---

### Task 2: Data layer — affiliates + deals

**Files:**
- Create: `src/data/affiliates.yaml`, `src/data/deals.yaml`, `src/lib/affiliates.ts`, `src/lib/deals.ts`, `src/lib/site.ts`

**Interfaces:**
- Produces: `getAffiliates()`, `resolveAffiliateUrl(slug)`, `getDeals()`, `getSiteUrl()`

- [ ] **Step 1: Write `affiliates.yaml`** (metadata only)

```yaml
- slug: cu-sac-20w
  name: Củ sạc 20W iPhone
  category: sac-cap
- slug: ugreen-hub-uno
  name: Hub USB-C UGREEN Uno 6-in-1
  category: hub
- slug: tai-nghe-bt-300k
  name: Tai nghe Bluetooth dưới 300k
  category: audio
- slug: gay-selfie-mini
  name: Gậy selfie mini Bluetooth
  category: phu-kien
- slug: cap-silicon-iphone
  name: Cáp sạc silicon iPhone
  category: sac-cap
```

Env key mapping: slug `cu-sac-20w` → `AFFILIATE_CU_SAC_20W` (replace `-` with `_`, uppercase, prefix `AFFILIATE_`).

- [ ] **Step 2: Write `deals.yaml`** (5–8 deals)

Each: `name`, `blurb`, `priceHint`, `goSlug`, `tags`, `featured`.

- [ ] **Step 3: Implement lib helpers**

```ts
// src/lib/affiliates.ts
export function slugToEnvKey(slug: string): string {
  return `AFFILIATE_${slug.replace(/-/g, '_').toUpperCase()}`;
}
export function resolveAffiliateUrl(slug: string): string | null {
  const key = slugToEnvKey(slug);
  const url = import.meta.env[key] ?? process.env[key];
  return typeof url === 'string' && url.length > 0 ? url : null;
}
```

Load YAML with `fs` + `yaml` parse in Node context (build + server).

- [ ] **Step 4: Commit**

```bash
git commit -m "feat: add affiliate and deals YAML data layer"
```

---

### Task 3: Layout + global CSS

**Files:**
- Create: `src/styles/global.css`, `src/layouts/BaseLayout.astro`, `src/components/Header.astro`, `src/components/Footer.astro`

**Visual direction:** Dark teal ink on warm off-white paper grain feel is forbidden (cream+serif). Use: cool slate background `#E8EEF2`, deep ink `#0B1F2A`, accent electric lime-green `#B8F200` sparingly for CTA only, font: "Be Vietnam Pro" (Google) + "DM Sans" for UI — expressive but clean, tech-deal vibe, mobile-first.

- [ ] **Step 1: CSS variables + base typography**
- [ ] **Step 2: BaseLayout with title, description, canonical, OG, Twitter, slot**
- [ ] **Step 3: Header nav: Trang chủ | Blog | Deals | Về Kiu**
- [ ] **Step 4: Footer with affiliate disclosure short line**
- [ ] **Step 5: Commit** `style: add mobile-first brand layout`

---

### Task 4: Content collection + 5 MDX posts

**Files:**
- Create: `src/content.config.ts`, 5 × `src/content/blog/*.mdx`, `public/og-default.svg`

**Schema:**
```ts
title: z.string()
description: z.string()
date: z.coerce.date()
updated: z.coerce.date().optional()
tags: z.array(z.string())
category: z.string()
ogImage: z.string().optional()
products: z.array(z.string()) // go slugs
```

Posts (from brief #1–5):
1. `cu-sac-20w-iphone.mdx`
2. `review-hub-ugreen-uno.mdx`
3. `tai-nghe-bluetooth-duoi-300k.mdx`
4. `gay-selfie-mini-bluetooth.mdx`
5. `cap-sac-silicon-iphone.mdx`

Each: Vietnamese body, affiliate disclosure first, 1–3 natural `/go/<slug>` CTAs, Pros/Cons where review.

- [ ] **Step 1: content.config.ts**
- [ ] **Step 2: Write 5 MDX posts**
- [ ] **Step 3: Commit** `content: add five gadget review posts`

---

### Task 5: Pages — home, about, blog, deals, go

**Files:**
- Create: pages listed in File Structure + `PostCard.astro`, `DealItem.astro`

- [ ] **Step 1: `/go/[slug].ts`** — 302 or 404 (prerender false)
- [ ] **Step 2: `/blog/index.astro` + `/blog/[slug].astro`**
- [ ] **Step 3: `/deals.astro`**
- [ ] **Step 4: `/about.astro`**
- [ ] **Step 5: `/index.astro`** — hero brand + latest posts + CTA deals
- [ ] **Step 6: `robots.txt.ts`**
- [ ] **Step 7: Wire `@vercel/analytics` in BaseLayout (`<Analytics />`)
- [ ] **Step 8: Build verify**

```bash
export $(grep -v '^#' .env.local | xargs)
npm run build
```

- [ ] **Step 9: Smoke `/go` with preview**

```bash
npm run preview &
sleep 2
curl -sI http://localhost:4321/go/ugreen-hub-uno | head -20
# Expect: 302 Location: https://s.shopee.vn/placeholder-ugreen-hub-uno
```

Note: static preview may not run server endpoints — if so, use `astro preview` with vercel adapter or `astro dev` for smoke.

- [ ] **Step 10: Commit** `feat: add pages, SEO, and affiliate redirects`

---

### Task 6: README + final verification

**Files:**
- Create/Modify: `README.md`

Sections: Overview, Prerequisites, Setup (`.env.local`), Dev, Build, Add post, Add affiliate link, Deploy (GitHub→Vercel later), Analytics note (auto on Vercel; no `VERCEL_ANALYTICS_ID` needed for `@vercel/analytics` in most setups).

- [ ] **Step 1: Write README**
- [ ] **Step 2: Fresh `npm run build` — must exit 0**
- [ ] **Step 3: Smoke redirect via `astro dev` or preview**
- [ ] **Step 4: Final commit** `docs: add README for local MVP workflow`
- [ ] **Step 5: Report tree + verification evidence to owner**

---

## Self-Review

1. **Spec coverage:** Homepage, blog list/post MDX, deals YAML, `/go` redirect, about, SEO sitemap/robots/OG/canonical, Analytics, 5 posts, env-based URLs — all mapped to tasks.
2. **Placeholders:** None left as TBD in steps; affiliate URLs are intentional Shopee placeholders.
3. **Consistency:** Env key = `AFFILIATE_` + slug uppercased with `_`; goSlug in deals matches affiliates.slug.

## Execution

Owner requested **inline execution** on `feature/mvp-scaffold` in the current directory (no push, no merge main). Proceed with executing-plans after this file is saved.
