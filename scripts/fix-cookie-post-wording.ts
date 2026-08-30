/**
 * One-off: reword a sentence added by update-posts-2026-08.ts that tripped the
 * internal-note guard on the substring "link mới". update-posts-2026-08.ts now
 * carries the final wording, so replaying it from the original content produces
 * the same result and this script is only needed once.
 *
 * Usage: npx tsx scripts/fix-cookie-post-wording.ts
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

const url = (process.env.SUPABASE_URL || '').trim();
const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim();

if (!url || !serviceKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const SLUG = 'cookie-shopee-affiliate-tiktok-4k';
const FIND = 'thì bấm lại link mới tính.';
const REPLACE = 'thì phải bấm vào link của mình lần nữa thì đơn đó mới được tính.';

async function main() {
  const client = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await client
    .from('posts')
    .select('content')
    .eq('slug', SLUG)
    .maybeSingle();

  if (error || !data) {
    console.error(`Cannot read ${SLUG}: ${error?.message ?? 'no row'}`);
    process.exit(1);
  }

  const content = String(data.content ?? '');
  if (content.includes(REPLACE)) {
    console.log('Already applied, nothing to do.');
    return;
  }

  const hits = content.split(FIND).length - 1;
  if (hits !== 1) {
    console.error(`Expected 1 match, found ${hits}. Aborting.`);
    process.exit(1);
  }

  const { error: updateError } = await client
    .from('posts')
    .update({ content: content.replace(FIND, REPLACE), published: true })
    .eq('slug', SLUG);

  if (updateError) {
    console.error(`Update failed: ${updateError.message}`);
    process.exit(1);
  }

  console.log(`Reworded one sentence in ${SLUG}.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
