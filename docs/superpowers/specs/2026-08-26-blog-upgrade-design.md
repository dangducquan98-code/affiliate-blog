# Blog Upgrade Design Spec

**Date:** 2026-08-26  
**Branch:** `feature/blog-upgrade`  
**Status:** Approved by project owner  
**Brand:** Quân Kiu Daily

## Goal

Upgrade the affiliate blog from static MDX content collections to a Supabase-backed CMS: SSR posts, image storage with transformations, and a password-protected admin for CRUD — without changing `/go/<slug>` affiliate redirects.

## Decisions (approved)

| Area | Decision |
|------|----------|
| Brand | Rename all “Kiu Chốt Deal” → **Quân Kiu Daily** |
| Theme | Orange primary palette (accessible, mobile-first) |
| Backend | Supabase Postgres + Storage; env placeholders until real keys |
| Auth | `ADMIN_PASSWORD` + httpOnly signed cookie session (not Supabase Auth) — single admin |
| Admin editor | **A** — plain Markdown textarea (no side-by-side preview in MVP) |
| Blog render | SSR from `posts` table (anon SELECT published only) |
| Markdown | Server-render with `marked` → HTML |
| Images | Upload to public bucket `blog-images`; `BlogImage.astro` uses `?width=&quality=` |
| Affiliate | Keep `/go/<slug>` + `AFFILIATE_*` env unchanged |
| Writes | Astro API routes use **service role** after session check |
| Migration | SQL file + MDX→DB script only; do **not** run against live project yet |

## Schema — `posts`

| Column | Type | Notes |
|--------|------|-------|
| id | uuid PK | `gen_random_uuid()` |
| slug | text UNIQUE NOT NULL | URL `/blog/<slug>` |
| title | text NOT NULL | |
| description | text NOT NULL | meta + cards |
| content | text NOT NULL | Markdown |
| tags | text[] | default `{}` |
| category | text NOT NULL | |
| cover_image | text NULL | Storage path or public URL |
| products | jsonb | `[{name, priceHint, goSlug}]` default `[]` |
| published | boolean | default false |
| created_at | timestamptz | default now() |
| updated_at | timestamptz | default now() |

**RLS:** anon / authenticated may `SELECT` where `published = true` only. All writes via service role (bypasses RLS).

**Storage:** bucket `blog-images`, public read. Admin uploads via service role API.

## Public data flow

1. Homepage / blog list / blog detail call Supabase anon client.
2. If env is placeholder / unreachable → show clear empty/fallback UI; never crash build or request.
3. Cover images via `BlogImage` (transformations query params).
4. SEO: title, description, canonical, OG, Twitter, Article JSON-LD on detail.
5. Dynamic `/sitemap.xml` lists static routes + published posts.
6. `/go/<slug>` unchanged.

## Admin data flow

1. `POST /api/admin/login` with password → set signed httpOnly cookie.
2. Admin pages check cookie; unauthenticated → login form.
3. CRUD + publish toggle + image upload via `/api/admin/*` using service role **after** session validation.
4. Products attached as JSON `{name, priceHint, goSlug}` linking to existing `/go` slugs.
5. Editor: single Markdown `<textarea>` (MVP).

## Env (placeholders)

```
SITE_URL=
AFFILIATE_*
SUPABASE_URL=https://placeholder.supabase.co
SUPABASE_ANON_KEY=placeholder
SUPABASE_SERVICE_ROLE_KEY=placeholder
ADMIN_PASSWORD=changeme
ADMIN_SESSION_SECRET=changeme-session-secret
```

## Out of scope

- Side-by-side Markdown preview
- Multi-user / Supabase Auth
- Changing `/go` or `affiliates.yaml` mechanism
- Editing `AGENTS.md`
- Running SQL migration or pushing to remote

## Success criteria

- `npm run build` passes without real Supabase keys
- `/`, `/blog`, `/about`, `/deals`, `/admin` respond 200 in dev
- Brand + orange theme visible
- Admin login + CRUD code paths present
- SQL migration + migrate script + README documented
