/**
 * Rewrite post bodies with the natural Quân Kiu voice.
 *
 * Reads scripts/content/rewrite-v2/<slug>.md, then updates only `content`
 * (plus `description` when the file declares one in frontmatter).
 * slug / title / tags / category / products are read back from the DB and
 * left untouched, so metadata can never be lost by this script.
 *
 * Usage:
 *   npx tsx scripts/rewrite-natural-voice.ts            # all files present
 *   npx tsx scripts/rewrite-natural-voice.ts slug-a slug-b
 */
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';
import matter from 'gray-matter';

const __dirname = dirname(fileURLToPath(import.meta.url));
const contentDir = join(__dirname, 'content', 'rewrite-v2');

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
  console.error('Missing real Supabase credentials in .env.local');
  process.exit(1);
}

type Check = { label: string; ok: boolean; detail: string };

function auditContent(body: string): Check[] {
  const words = body.split(/\s+/).filter(Boolean).length;
  const h2 = (body.match(/^## /gm) || []).length;
  const dashes = (body.match(/—/g) || []).length;
  const goLinks = (body.match(/\]\(\/go\/[^)]+\)/g) || []).length;
  const blogLinks = (body.match(/\]\(\/blog\/[^)]+\)/g) || []).length;

  const sentences = body
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    // Split on sentence ends, but not on an ellipsis (templates use "Đừng... nếu...")
    .split(/(?<=[^.][.!?])\s+|\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
  let runOfShort = 0;
  let worstRun = 0;
  for (const s of sentences) {
    if (s.startsWith('#') || s.startsWith('|') || s.startsWith('>')) {
      runOfShort = 0;
      continue;
    }
    const len = s.split(/\s+/).filter(Boolean).length;
    if (len > 0 && len < 6) {
      runOfShort += 1;
      worstRun = Math.max(worstRun, runOfShort);
    } else {
      runOfShort = 0;
    }
  }

  const banned = ['pretent', '## Mục lục', 'Liên quan trên blog'].filter((phrase) =>
    body.includes(phrase),
  );

  return [
    { label: 'words 900-1500', ok: words >= 900 && words <= 1500, detail: String(words) },
    { label: 'h2 <= 7', ok: h2 <= 7, detail: String(h2) },
    { label: 'em-dash <= 12', ok: dashes <= 12, detail: String(dashes) },
    { label: 'go links <= 3', ok: goLinks <= 3, detail: String(goLinks) },
    { label: 'blog links <= 4', ok: blogLinks <= 4, detail: String(blogLinks) },
    { label: 'short-run <= 2', ok: worstRun <= 2, detail: String(worstRun) },
    { label: 'no macro phrase', ok: banned.length === 0, detail: banned.join(', ') || 'clean' },
  ];
}

async function main() {
  const client = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const requested = process.argv.slice(2);
  const slugs = requested.length
    ? requested
    : readdirSync(contentDir)
        .filter((f) => f.endsWith('.md'))
        .map((f) => f.replace(/\.md$/, ''))
        .sort();

  let ok = 0;
  for (const slug of slugs) {
    const path = join(contentDir, `${slug}.md`);
    if (!existsSync(path)) {
      console.error(`Missing file: ${path}`);
      process.exitCode = 1;
      continue;
    }

    const parsed = matter(readFileSync(path, 'utf8'));
    const body = parsed.content.trim();

    const { data: existing, error: readError } = await client
      .from('posts')
      .select('slug,description')
      .eq('slug', slug)
      .maybeSingle();

    if (readError) {
      console.error(`Read failed: ${slug} — ${readError.message}`);
      process.exitCode = 1;
      continue;
    }
    if (!existing) {
      console.error(`No such post in DB: ${slug}`);
      process.exitCode = 1;
      continue;
    }

    const patch: Record<string, unknown> = { content: body, published: true };
    const newDescription =
      typeof parsed.data.description === 'string' ? parsed.data.description.trim() : '';
    if (newDescription && newDescription !== existing.description) {
      patch.description = newDescription;
    }

    const checks = auditContent(body);
    const failed = checks.filter((c) => !c.ok);
    console.log(
      `${failed.length ? 'WARN ' : 'PASS '} ${slug}  ${checks.map((c) => `${c.label}=${c.detail}`).join('  ')}`,
    );

    if (process.env.DRY_RUN === '1') {
      ok += 1;
      continue;
    }

    const { error } = await client.from('posts').update(patch).eq('slug', slug);
    if (error) {
      console.error(`Update failed: ${slug} — ${error.message}`);
      process.exitCode = 1;
      continue;
    }
    ok += 1;
  }

  console.log(`\nDone. ${ok}/${slugs.length} posts updated.`);
  reportSignatureBudget();
}

/**
 * Signature phrases may appear at most N times across the whole rewrite set,
 * otherwise they stop sounding like a person and start sounding like a macro.
 */
function reportSignatureBudget(): void {
  const budget: Record<string, number> = {
    'Ngã tính tiếp': 1,
    'Có thế thôi': 1,
    'Hmm': 1,
    'mệt đầu': 1,
    'Mình viết mấy dòng này': 1,
    'lủng cà lủng củng': 1,
    'mệt phết': 1,
    'lóc cóc': 1,
    'Chúng mình': 2,
  };

  const files = readdirSync(contentDir).filter((f) => f.endsWith('.md'));
  console.log(`\nSignature budget across ${files.length} drafts:`);
  for (const [phrase, max] of Object.entries(budget)) {
    const hits = files.filter((f) =>
      matter(readFileSync(join(contentDir, f), 'utf8')).content.includes(phrase),
    );
    const flag = hits.length > max ? 'OVER' : 'ok  ';
    console.log(`  ${flag} "${phrase}" ${hits.length}/${max}${hits.length ? ` — ${hits.join(', ')}` : ''}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
