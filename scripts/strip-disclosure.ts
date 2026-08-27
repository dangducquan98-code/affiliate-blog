/**
 * Strip affiliate disclosure blocks from published posts (Supabase).
 *
 * Removes only:
 * - <p class="disclosure">...</p>
 * - **Disclosure:** ... lines
 * - ## Disclosure ... sections (until next ##)
 *
 * Does NOT touch slug/title/products or body mentions of hoa hồng in normal prose.
 *
 * Usage:
 *   npx tsx scripts/strip-disclosure.ts
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';

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

export function stripDisclosure(content: string): string {
  let out = content;
  out = out.replace(/<p\s+class=["']disclosure["']>[\s\S]*?<\/p>\s*/gi, '');
  out = out.replace(/^##\s*Disclosure[^\n]*\n+(?:(?!^##\s).*\n?)*/gim, '');
  out = out.replace(/^\*\*Disclosure:\*\*[^\n]*\n+(?:\n)?/gim, '');
  out = out.replace(/^\s+/, '');
  out = out.replace(/\n{3,}/g, '\n\n');
  return out;
}

/** True if opening region still has a disclosure block/label. */
export function hasOpeningDisclosure(content: string): boolean {
  const head = content.slice(0, 1200);
  return (
    /<p\s+class=["']disclosure["']/i.test(head) ||
    /\*\*Disclosure:\*\*/i.test(head) ||
    /^##\s*Disclosure\b/im.test(head)
  );
}

const isMain =
  process.argv[1] &&
  fileURLToPath(import.meta.url) === process.argv[1];

if (isMain) {
  const url = (process.env.SUPABASE_URL || '').trim();
  const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();

  if (!url || url.includes('placeholder') || !serviceKey || serviceKey.includes('placeholder')) {
    console.error(
      'Missing real Supabase credentials. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local',
    );
    process.exit(1);
  }

  const client = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data: posts, error } = await client
    .from('posts')
    .select('id, slug, content, published')
    .eq('published', true);

  if (error) {
    console.error(error);
    process.exit(1);
  }

  let updated = 0;
  let skipped = 0;

  for (const post of posts ?? []) {
    const before = post.content ?? '';
    const after = stripDisclosure(before);
    if (after === before) {
      skipped += 1;
      console.log(`skip  ${post.slug} (no disclosure block)`);
      continue;
    }
    const { error: upErr } = await client
      .from('posts')
      .update({ content: after })
      .eq('id', post.id);
    if (upErr) {
      console.error(`FAIL  ${post.slug}`, upErr);
      process.exit(1);
    }
    updated += 1;
    console.log(`ok    ${post.slug}`);
  }

  const { data: verify, error: vErr } = await client
    .from('posts')
    .select('slug, content')
    .eq('published', true);

  if (vErr) {
    console.error(vErr);
    process.exit(1);
  }

  const remaining = (verify ?? []).filter((p) => hasOpeningDisclosure(p.content ?? ''));
  console.log(`\nUpdated: ${updated}, skipped: ${skipped}, published: ${(verify ?? []).length}`);
  if (remaining.length) {
    console.error(
      'VERIFY FAIL — still have opening disclosure:',
      remaining.map((p) => p.slug),
    );
    process.exit(1);
  }
  console.log('VERIFY OK — no opening disclosure blocks left.');
}
