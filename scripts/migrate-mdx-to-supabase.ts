/**
 * One-shot migration: import MDX posts from src/content/blog into Supabase `posts`.
 *
 * Prerequisites:
 * 1. Create Supabase project
 * 2. Run supabase/migrations/20260826_blog_upgrade.sql
 * 3. Put real keys in .env.local (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
 *
 * Usage:
 *   npx tsx scripts/migrate-mdx-to-supabase.ts
 *
 * Idempotent by slug (upsert on slug conflict).
 */

import { readFileSync, readdirSync } from 'node:fs';
import { join, basename } from 'node:path';
import { createClient } from '@supabase/supabase-js';
import matter from 'gray-matter';
import { parse as parseYaml } from 'yaml';

function loadEnvFile(path: string): void {
  try {
    const raw = readFileSync(path, 'utf8');
    for (const line of raw.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq <= 0) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!(key in process.env)) process.env[key] = value;
    }
  } catch {
    // optional
  }
}

loadEnvFile('.env.local');
loadEnvFile('.env');

const url = (process.env.SUPABASE_URL || '').trim();
const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();

if (!url || url.includes('placeholder') || !serviceKey || serviceKey.includes('placeholder')) {
  console.error(
    'Missing real Supabase credentials. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local',
  );
  process.exit(1);
}

type Affiliate = { slug: string; name: string };
type Deal = { goSlug: string; priceHint?: string; name?: string };

const affiliates = parseYaml(readFileSync('src/data/affiliates.yaml', 'utf8')) as Affiliate[];
const deals = parseYaml(readFileSync('src/data/deals.yaml', 'utf8')) as Deal[];

const affiliateBySlug = new Map(affiliates.map((a) => [a.slug, a]));
const dealBySlug = new Map(deals.map((d) => [d.goSlug, d]));

function toProducts(productSlugs: unknown): Array<{ name: string; priceHint: string; goSlug: string }> {
  if (!Array.isArray(productSlugs)) return [];
  return productSlugs
    .map((slug) => String(slug))
    .filter(Boolean)
    .map((goSlug) => {
      const aff = affiliateBySlug.get(goSlug);
      const deal = dealBySlug.get(goSlug);
      return {
        goSlug,
        name: aff?.name || deal?.name || goSlug,
        priceHint: deal?.priceHint || '',
      };
    });
}

function stripMdxChrome(body: string): string {
  // Remove HTML disclosure blocks from old MDX; keep markdown content.
  return body
    .replace(/<p class="disclosure">[\s\S]*?<\/p>\s*/i, '')
    .replace(/^\s+/, '');
}

const blogDir = join(process.cwd(), 'src/content/blog');
const files = readdirSync(blogDir).filter((f) => f.endsWith('.mdx') || f.endsWith('.md'));

if (files.length === 0) {
  console.error('No MDX/MD files found in src/content/blog');
  process.exit(1);
}

const client = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

let ok = 0;
let fail = 0;

for (const file of files) {
  const full = join(blogDir, file);
  const raw = readFileSync(full, 'utf8');
  const { data, content } = matter(raw);
  const slug = basename(file).replace(/\.(mdx|md)$/i, '');

  const title = String(data.title || '').trim();
  const description = String(data.description || '').trim();
  const category = String(data.category || 'review').trim();
  const tags = Array.isArray(data.tags) ? data.tags.map(String) : [];
  const createdAt = data.date ? new Date(data.date).toISOString() : new Date().toISOString();
  const updatedAt = data.updated
    ? new Date(data.updated).toISOString()
    : createdAt;

  if (!title || !description) {
    console.warn(`Skip ${file}: missing title/description`);
    fail += 1;
    continue;
  }

  const row = {
    slug,
    title,
    description,
    content: stripMdxChrome(content),
    tags,
    category,
    cover_image: null as string | null,
    products: toProducts(data.products),
    published: true,
    created_at: createdAt,
    updated_at: updatedAt,
  };

  const { error } = await client.from('posts').upsert(row, { onConflict: 'slug' });
  if (error) {
    console.error(`FAIL ${slug}: ${error.message}`);
    fail += 1;
  } else {
    console.log(`OK   ${slug}`);
    ok += 1;
  }
}

console.log(`\nDone. success=${ok} failed=${fail}`);
if (fail > 0) process.exit(1);
