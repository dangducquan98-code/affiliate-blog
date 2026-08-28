/**
 * List product slugs (for /go/<slug> link sanity check).
 *
 * Usage: npx tsx scripts/dump-products.ts
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

async function main() {
  const client = createClient(
    (process.env.SUPABASE_URL || '').trim(),
    (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim(),
    { auth: { persistSession: false, autoRefreshToken: false } },
  );

  const { data, error } = await client
    .from('products')
    .select('slug,name,affiliate_url')
    .order('slug');
  if (error) {
    console.error(error.message);
    process.exit(1);
  }
  for (const p of data ?? []) {
    console.log(`${p.slug} | hasUrl=${Boolean(p.affiliate_url)} | ${p.name}`);
  }
  console.log(`Total: ${data?.length ?? 0}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
