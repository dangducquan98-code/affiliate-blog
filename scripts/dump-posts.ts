/**
 * Dump all posts from Supabase to /tmp/posts-dump for offline reading.
 *
 * Usage: npx tsx scripts/dump-posts.ts
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
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
  console.error('Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const outDir = '/tmp/posts-dump';

async function main() {
  const client = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { data, error } = await client
    .from('posts')
    .select('slug,title,description,tags,category,products,published,content,cover_image')
    .order('slug');

  if (error) {
    console.error(error.message);
    process.exit(1);
  }

  mkdirSync(outDir, { recursive: true });
  const index: string[] = [];

  for (const post of data ?? []) {
    const words = String(post.content ?? '')
      .split(/\s+/)
      .filter(Boolean).length;
    const goLinks = (String(post.content ?? '').match(/\]\(\/go\/[^)]+\)/g) || []).length;
    index.push(
      [
        post.slug,
        `published=${post.published}`,
        `category=${post.category}`,
        `words=${words}`,
        `goLinks=${goLinks}`,
        `products=${JSON.stringify(post.products)}`,
        `tags=${JSON.stringify(post.tags)}`,
        `title=${post.title}`,
        `desc=${post.description}`,
      ].join(' | '),
    );
    writeFileSync(
      join(outDir, `${post.slug}.md`),
      `# ${post.title}\n\n> ${post.description}\n\n---\n\n${post.content}\n`,
      'utf8',
    );
  }

  writeFileSync(join(outDir, '_index.txt'), index.join('\n') + '\n', 'utf8');
  console.log(`Dumped ${data?.length ?? 0} posts to ${outDir}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
