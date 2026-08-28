/**
 * Patch posts.category in Supabase to match POST_CATEGORY_BY_SLUG.
 *
 * Usage: npx tsx scripts/fix-post-categories.ts
 */

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';
import { isValidCategorySlug } from '../src/lib/categories.ts';
import { POST_CATEGORY_BY_SLUG, resolveCategorySlug } from '../src/lib/post-category-map.ts';

const __dirname = dirname(fileURLToPath(import.meta.url));

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

loadEnvFile(join(__dirname, '..', '.env.local'));
loadEnvFile(join(__dirname, '..', '.env'));

const url = (process.env.SUPABASE_URL || '').trim();
const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();

if (!url || url.includes('placeholder') || !serviceKey || serviceKey.includes('placeholder')) {
  console.error(
    'Missing real Supabase credentials. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local',
  );
  process.exit(1);
}

async function main() {
  const client = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await client
    .from('posts')
    .select('id, slug, category, published')
    .eq('published', true);
  if (error) {
    console.error('Load failed:', error.message);
    process.exit(1);
  }

  let updated = 0;
  const counts: Record<string, number> = {};

  for (const row of data ?? []) {
    const slug = String(row.slug);
    const current = String(row.category ?? '');
    const target =
      resolveCategorySlug(slug, current) ??
      POST_CATEGORY_BY_SLUG[slug];

    if (!target || !isValidCategorySlug(target)) {
      console.warn(`SKIP ${slug}: no valid target (current=${current})`);
      continue;
    }

    counts[target] = (counts[target] ?? 0) + 1;

    if (current === target) {
      console.log(`OK ${slug} (${target})`);
      continue;
    }

    const { error: upErr } = await client.from('posts').update({ category: target }).eq('id', row.id);
    if (upErr) {
      console.error(`FAIL ${slug}:`, upErr.message);
      process.exitCode = 1;
      continue;
    }
    updated += 1;
    console.log(`PATCH ${slug}: ${current} → ${target}`);
  }

  console.log(`\nUpdated ${updated} posts. Counts:`, counts);

  const { data: after } = await client.from('posts').select('category').eq('published', true);
  const legacy = new Set(
    (after ?? [])
      .map((r) => String(r.category))
      .filter((c) => !isValidCategorySlug(c)),
  );
  if (legacy.size > 0) {
    console.error('Legacy categories remain:', [...legacy]);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
