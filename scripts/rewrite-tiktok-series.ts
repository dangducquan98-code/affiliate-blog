/**
 * Rewrite 3 TikTok series posts (full-length) — upsert by slug.
 *
 * Usage:
 *   npm run rewrite:tiktok-series
 *
 * Idempotent: upsert on posts.slug conflict.
 * Reads markdown from scripts/content/<slug>.md
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

if (!url || url.includes('placeholder') || !serviceKey || serviceKey.includes('placeholder')) {
  console.error(
    'Missing real Supabase credentials. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local',
  );
  process.exit(1);
}

type SeedPost = {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  products: { slug: string }[];
  contentFile: string;
  published: boolean;
};

const posts: SeedPost[] = [
  {
    slug: 'tiktok-chon-san-pham-review',
    title: 'ĐỪNG review lung tung — chọn sản phẩm thế nào cho đỡ phí công',
    description:
      'Mình từng chọn sản phẩm TikTok theo trend và hoa hồng — view có, cookie lủng. Bộ lọc 5 câu + gear tối thiểu để đỡ phí công quay.',
    category: 'huong-dan',
    tags: ['tiktok', 'affiliate', 'review', 'series', 'chon-san-pham'],
    products: [{ slug: 'mic-boya-m1' }, { slug: 'den-ring-light-10' }],
    contentFile: 'tiktok-chon-san-pham-review.md',
    published: true,
  },
  {
    slug: 'tiktok-hook-3-giay',
    title: '3 giây đầu quyết định video sống hay chết',
    description:
      'Hook TikTok không phải câu thần chú. 5 kiểu mở đầu mình đang dùng trên kênh ~4K — và vì sao tiếng/mặt sạch quyết định tay có dừng không.',
    category: 'huong-dan',
    tags: ['tiktok', 'hook', 'script', 'series', '3-giay'],
    products: [{ slug: 'mic-boya-m1' }, { slug: 'den-led-panel' }],
    contentFile: 'tiktok-hook-3-giay.md',
    published: true,
  },
  {
    slug: 'tiktok-kich-ban-quay-ngan',
    title: 'Kịch bản 15–60 giây: nói gì, cắt gì, chốt gì',
    description:
      'Mình từng quay freestyle rồi dựng 40 phút cứu take. Giờ viết như tin nhắn: khung 15–60s, cắt gì, chốt gì, gear nào giúp quay một mạch.',
    category: 'huong-dan',
    tags: ['tiktok', 'script', 'quay-phim', 'series', 'kich-ban'],
    products: [{ slug: 'tripod-phone-flexible' }, { slug: 'lav-mic-foam' }],
    contentFile: 'tiktok-kich-ban-quay-ngan.md',
    published: true,
  },
];

function countStats(text: string): { words: number; chars: number } {
  return { words: text.split(/\s+/).filter(Boolean).length, chars: text.length };
}

async function main() {
  const client = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  for (const post of posts) {
    const contentPath = join(__dirname, 'content', post.contentFile);
    const content = readFileSync(contentPath, 'utf8').trim();
    const { words, chars } = countStats(content);

    if (words < 1000 || words > 1800) {
      console.warn(`WARN ${post.slug}: words=${words} (target 1000–1800)`);
    }
    if (chars < 6000 || chars > 10000) {
      console.warn(`WARN ${post.slug}: chars=${chars} (target ~6000–10000)`);
    }

    const row = {
      slug: post.slug,
      title: post.title,
      description: post.description,
      content,
      tags: post.tags,
      category: post.category,
      products: post.products,
      published: post.published,
    };

    const { error } = await client.from('posts').upsert(row, { onConflict: 'slug' });
    if (error) {
      console.error(`Failed: ${post.slug}`, error.message);
      process.exitCode = 1;
      continue;
    }
    console.log(
      `Upserted: ${post.slug} | words=${words} chars=${chars} | products=${post.products.length}`,
    );
  }

  console.log('Done. Re-run is safe (idempotent by slug).');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
