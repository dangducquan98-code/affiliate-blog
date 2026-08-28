/**
 * Strip internal editor notes from post content (Supabase + source files).
 *
 * Removes blockquote/paragraph notes for project owner — never public-facing.
 *
 * Usage:
 *   npx tsx scripts/strip-internal-notes.ts          # scan + update DB
 *   npx tsx scripts/strip-internal-notes.ts --verify # verify only
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

/** Patterns that indicate internal editor notes (not reader-facing prose). */
export const INTERNAL_NOTE_PATTERNS = [
  'Ghi chú sản phẩm',
  'Kế hoạch gốc',
  'chưa có link Shopee',
  'chưa có link',
  'MỚI — cần link',
  'Thay thế tạm',
  'thay thế tạm',
  'điền sau',
  'bạn điền',
  'chờ link',
  'sẽ cập nhật bài',
  'TODO:',
  '(update',
  'link mới',
] as const;

export function hasInternalNote(content: string): boolean {
  return INTERNAL_NOTE_PATTERNS.some((pat) => content.includes(pat));
}

export function stripInternalNotes(content: string): string {
  let out = content;

  // Blockquote product notes: > **Ghi chú sản phẩm:** ...
  out = out.replace(/^>\s*\*\*Ghi chú sản phẩm:\*\*[^\n]*\n+/gm, '');

  // Parenthetical temp-replacement notes after affiliate links
  out = out.replace(
    /\.\s*\(Thay thế tạm cho[^)]*sẽ cập nhật bài\.\)/gi,
    '.',
  );
  out = out.replace(
    /\s*\(Thay thế tạm cho[^)]*sẽ cập nhật[^)]*\)/gi,
    '',
  );

  // Standalone lines with internal note markers
  out = out.replace(
    /^[^\n]*(?:Ghi chú sản phẩm|Kế hoạch gốc|chưa có link Shopee|MỚI — cần link|điền sau|bạn điền|chờ link)[^\n]*\n+/gm,
    '',
  );

  // TODO lines (editor only — line starts with TODO:)
  out = out.replace(/^[^\n]*\bTODO:\b[^\n]*\n+/gm, '');

  out = out.replace(/\n{3,}/g, '\n\n');
  out = out.replace(/^\s+/, '');
  return out;
}

const verifyOnly = process.argv.includes('--verify');

async function main(): Promise<void> {
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

  const { data: posts, error } = await client.from('posts').select('id, slug, content');

  if (error) {
    console.error(error);
    process.exit(1);
  }

  if (verifyOnly) {
    const dirty = (posts ?? []).filter((p) => hasInternalNote(p.content ?? ''));
    if (dirty.length) {
      console.error('VERIFY FAIL — internal notes remain:');
      for (const p of dirty) {
        const hits = INTERNAL_NOTE_PATTERNS.filter((pat) => (p.content ?? '').includes(pat));
        console.error(`  ${p.slug}: ${hits.join(', ')}`);
      }
      process.exit(1);
    }
    console.log(`VERIFY OK — 0/${posts?.length ?? 0} posts with internal notes.`);
    return;
  }

  let updated = 0;
  let skipped = 0;

  for (const post of posts ?? []) {
    const before = post.content ?? '';
    const after = stripInternalNotes(before);
    if (after === before) {
      skipped += 1;
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

  const { data: verify, error: vErr } = await client.from('posts').select('slug, content');
  if (vErr) {
    console.error(vErr);
    process.exit(1);
  }

  const remaining = (verify ?? []).filter((p) => hasInternalNote(p.content ?? ''));
  console.log(`\nUpdated: ${updated}, skipped: ${skipped}, total: ${(verify ?? []).length}`);
  if (remaining.length) {
    console.error(
      'VERIFY FAIL — still have internal notes:',
      remaining.map((p) => p.slug),
    );
    process.exit(1);
  }
  console.log('VERIFY OK — no internal notes left in DB.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
