# Blog Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebrand to Quân Kiu Daily (orange theme), move blog posts to Supabase SSR, add image storage + admin CMS, keep `/go/<slug>`.

**Architecture:** Astro `output: 'server'` reads published posts via anon client; admin APIs use service role after HMAC cookie session; Storage bucket `blog-images` with Image Transformations on render; MDX files remain as migrate source only.

**Tech Stack:** Astro 7, TypeScript, `@supabase/supabase-js`, `marked`, Supabase Postgres + Storage, Vercel adapter.

**Spec:** `docs/superpowers/specs/2026-08-26-blog-upgrade-design.md`

## Global Constraints

- UI Vietnamese; code/commits English
- Do not edit `AGENTS.md`; do not change `/go/<slug>` behavior
- Do not commit `.env.local` or `node_modules`; do not push
- Do not run SQL migration against a live project
- Graceful fallback when Supabase keys are placeholders — build must PASS
- Admin editor: plain Markdown textarea (no preview)

## File map

| Path | Responsibility |
|------|----------------|
| `src/styles/global.css` | Orange theme tokens |
| `src/lib/site.ts` | Brand + site URL helpers |
| `src/lib/supabase.ts` | Anon + service clients, config check |
| `src/lib/posts.ts` | Fetch published posts / by slug |
| `src/lib/markdown.ts` | Markdown → safe HTML |
| `src/lib/admin-auth.ts` | Session cookie sign/verify |
| `src/components/BlogImage.astro` | Supabase transform URLs |
| `src/components/{Header,Footer,PostCard}.astro` | Brand + cover support |
| `src/layouts/BaseLayout.astro` | Brand in title/OG |
| `src/pages/{index,about,blog/*}.astro` | SSR from DB |
| `src/pages/sitemap.xml.ts` | Dynamic sitemap |
| `src/pages/admin/**` | Admin UI |
| `src/pages/api/admin/**` | Login + CRUD + upload |
| `supabase/migrations/20260826_blog_upgrade.sql` | Schema + RLS + bucket |
| `scripts/migrate-mdx-to-supabase.ts` | One-shot MDX import |
| `.env.example` | Env placeholders |

---

### Task 1: Design docs commit

**Files:**
- Create: `docs/superpowers/specs/2026-08-26-blog-upgrade-design.md`
- Create: `docs/superpowers/plans/2026-08-26-blog-upgrade.md`

- [ ] **Step 1:** Ensure both docs exist (this plan + approved design spec).
- [ ] **Step 2: Commit**

```bash
git add docs/superpowers/specs/2026-08-26-blog-upgrade-design.md docs/superpowers/plans/2026-08-26-blog-upgrade.md
git commit -m "docs: add blog upgrade design spec and implementation plan"
```

---

### Task 2: Phase A — Brand + orange theme

**Files:**
- Modify: `src/lib/site.ts`, `src/styles/global.css`, `src/layouts/BaseLayout.astro`, `src/components/Header.astro`, `src/components/Footer.astro`, `src/pages/index.astro`, `src/pages/about.astro`, `README.md` (brand line only OK in Phase E; Phase A at least UI strings)

**Produces:** `BRAND_NAME = 'Quân Kiu Daily'`

- [ ] **Step 1:** Add `BRAND_NAME` / `getBrandName()` in `src/lib/site.ts`.
- [ ] **Step 2:** Replace all UI “Kiu Chốt Deal” with Quân Kiu Daily; Header brand `Quân Kiu <span>Daily</span>`.
- [ ] **Step 3:** Orange CSS variables — accent `#F97316`, deep `#C2410C`, warm bg, WCAG-friendly ink.
- [ ] **Step 4:** Visual smoke — `npm run build` still passes.
- [ ] **Step 5: Commit** `git commit -m "feat: rebrand to Quan Kiu Daily with orange theme"`

---

### Task 3: Phase B — Supabase SQL + client + env

**Files:**
- Create: `supabase/migrations/20260826_blog_upgrade.sql`
- Create: `src/lib/supabase.ts`
- Modify: `.env.example`, `src/env.d.ts`
- Modify: `.env.local` locally only (placeholders; never commit)

**Produces:** `createAnonClient()`, `createServiceClient()`, `isSupabaseConfigured()`

- [ ] **Step 1:** Write SQL: `posts` table, indexes, RLS SELECT published, storage bucket `blog-images` public.
- [ ] **Step 2:** `npm install @supabase/supabase-js`
- [ ] **Step 3:** Implement clients; treat `placeholder` URL/keys as not configured.
- [ ] **Step 4:** Update `.env.example` with Supabase + admin vars.
- [ ] **Step 5: Commit** `git commit -m "feat: add Supabase migration, client, and env placeholders"`

---

### Task 4: Phase C — Blog SSR + BlogImage + SEO

**Files:**
- Create: `src/lib/posts.ts`, `src/lib/markdown.ts`, `src/components/BlogImage.astro`
- Modify: `src/pages/index.astro`, `src/pages/blog/index.astro`, `src/pages/blog/[slug].astro`, `src/components/PostCard.astro`
- Create: `src/pages/sitemap.xml.ts`
- Modify: `src/pages/robots.txt.ts`, `astro.config.mjs` (drop static sitemap integration if replaced)
- Keep: `src/content/blog/*.mdx` as migrate source; stop using content collections in pages

**Produces:** `listPublishedPosts()`, `getPublishedPostBySlug()`, `renderMarkdown()`

- [ ] **Step 1:** Implement posts fetch + markdown render + BlogImage.
- [ ] **Step 2:** Switch homepage/blog to SSR (`prerender = false` or omit true); fallback UI when unconfigured/empty.
- [ ] **Step 3:** Detail page: SEO + JSON-LD Article; products CTA links to `/go/<goSlug>`.
- [ ] **Step 4:** Dynamic sitemap; point robots at `/sitemap.xml`.
- [ ] **Step 5:** `npm install marked` (+ types if needed); `npm run build` PASS.
- [ ] **Step 6: Commit** `git commit -m "feat: render blog posts from Supabase with BlogImage and SEO"`

---

### Task 5: Phase D — Admin UI + API

**Files:**
- Create: `src/lib/admin-auth.ts`
- Create: `src/pages/admin/index.astro`, `src/pages/admin/login.astro`, `src/pages/admin/posts/new.astro`, `src/pages/admin/posts/[id].astro`
- Create: `src/pages/api/admin/login.ts`, `logout.ts`, `posts.ts`, `posts/[id].ts`, `upload.ts`
- Optional minimal admin CSS in `global.css` under `.admin-*`

**Interfaces:**
- Cookie: `admin_session` httpOnly, SameSite=Lax, Secure in production, HMAC-SHA256 over `exp`
- Products JSON: `{ name: string; priceHint: string; goSlug: string }[]`
- Editor: single Markdown textarea

- [ ] **Step 1:** Session helpers `createSessionToken`, `verifySessionToken`, `requireAdmin`.
- [ ] **Step 2:** Login/logout API + login page.
- [ ] **Step 3:** List/create/edit pages + posts API (CRUD, publish toggle).
- [ ] **Step 4:** Upload API → `blog-images`; return public URL/path.
- [ ] **Step 5:** Build PASS; `/admin` returns 200 (login or dashboard).
- [ ] **Step 6: Commit** `git commit -m "feat: add password-protected admin CRUD and image upload"`

---

### Task 6: Phase E — Migrate script + README

**Files:**
- Create: `scripts/migrate-mdx-to-supabase.ts`
- Modify: `README.md`, `package.json` (script `migrate:posts`)

- [ ] **Step 1:** Script parses frontmatter + body of 5 MDX files; upserts into `posts` (products as `{name, priceHint, goSlug}` from affiliate YAML names when possible).
- [ ] **Step 2:** README: brand, env list, SQL how-to, admin how-to, migrate how-to.
- [ ] **Step 3:** `npm run build` PASS.
- [ ] **Step 4: Commit** `git commit -m "feat: add MDX migrate script and update README for Supabase admin"`

---

### Task 7: Verification

- [ ] `npm run build` — exit 0
- [ ] `npm run dev` — curl `/`, `/blog`, `/about`, `/deals`, `/admin` → 200
- [ ] Report structure, env vars, migration steps, admin usage

## Spec coverage checklist

- Brand rename + orange → Task 2
- SQL + RLS + bucket + clients + env → Task 3
- SSR blog + BlogImage + SEO + sitemap → Task 4
- Admin password cookie + CRUD + upload + textarea → Task 5
- Migrate script + README → Task 6
- Graceful placeholder + verify → Tasks 3–7
- `/go` untouched, no AGENTS.md, no push → Global Constraints
