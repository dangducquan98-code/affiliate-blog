/**
 * August 2026 refresh: three new posts prompted by the fact-check research.
 * Sources for each topic are in docs/research-updates-2026-08.md.
 *
 * Usage: npx tsx scripts/upsert-refresh-2026-08-posts.ts
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';
import matter from 'gray-matter';

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
  console.error('Missing real Supabase credentials in .env.local');
  process.exit(1);
}

type SeedPost = {
  slug: string;
  category: string;
  title: string;
  description: string;
  tags: string[];
  products: { slug: string }[];
};

const posts: SeedPost[] = [
  {
    slug: 'xac-thuc-danh-tinh-affiliate-2026',
    category: 'mmo',
    title: 'Muốn lấy link affiliate giờ phải xác thực danh tính — chuyện này có thật',
    description:
      'Có bạn tưởng tài khoản mình bị khóa, thật ra là luật đổi và các sàn đang làm theo. Đây là cái đã đổi, cái mình đã chuẩn bị, và phần trong luật mà không ai nhắc.',
    tags: ['mmo', 'affiliate', 'chinh-sach', 'xac-thuc', 'tiktok-shop'],
    products: [],
  },
  {
    slug: 'luat-quang-cao-2026-nguoi-review',
    category: 'mmo',
    title: 'Chưa dùng thì không được giới thiệu — luật mới nói đúng cái mình vẫn làm',
    description:
      'Từ đầu năm nay có một câu trong luật nói gần y như cái mình đã viết trên blog từ lâu. Bài này là chỗ nó không bắt mình đổi gì, ba chỗ nó bắt mình đổi thật, và một chỗ mình không dám đoán.',
    tags: ['mmo', 'affiliate', 'chinh-sach', 'review', 'quang-cao'],
    products: [],
  },
  {
    slug: 'tien-hoa-hong-ve-vi-khac-dashboard',
    category: 'tai-chinh',
    title: 'Tiền hoa hồng về ví khác số trên dashboard — chỗ chênh nằm ở đâu',
    description:
      'Tháng đầu mình ghi số trên dashboard vào sổ rồi tiêu theo số đó, và tiền về thì ít hơn. Hai thứ ăn vào khoảng chênh, và lý do mình không ghi con số cụ thể nào trong bài.',
    tags: ['tai-chinh', 'affiliate', 'thu-nhap-phu', 'thue', 'ghi-so'],
    products: [{ slug: 'so-thu-chi-a5' }],
  },
];

function countStats(text: string): { words: number; goLinks: number; blogLinks: number } {
  const words = text.split(/\s+/).filter(Boolean).length;
  const goLinks = (text.match(/\]\(\/go\/[^)]+\)/g) || []).length;
  const blogLinks = (text.match(/\]\(\/blog\/[^)]+\)/g) || []).length;
  return { words, goLinks, blogLinks };
}

async function main() {
  const client = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  for (const post of posts) {
    const contentPath = join(__dirname, 'content', 'refresh-2026-08', `${post.slug}.md`);
    const parsed = matter(readFileSync(contentPath, 'utf8'));
    const content = parsed.content.trim();

    const category =
      (typeof parsed.data.category === 'string' && parsed.data.category.trim()) || post.category;
    if (category !== post.category) {
      console.error(`Category mismatch for ${post.slug}: ${category} vs ${post.category}`);
      process.exit(1);
    }

    const { words, goLinks, blogLinks } = countStats(content);
    console.log(
      `  ${post.slug}: words=${words} goLinks=${goLinks} blogLinks=${blogLinks} category=${category}`,
    );

    const { error } = await client.from('posts').upsert(
      {
        slug: post.slug,
        title: post.title,
        description: post.description,
        content,
        tags: post.tags,
        category,
        products: post.products,
        published: true,
        cover_image: null,
      },
      { onConflict: 'slug' },
    );

    if (error) {
      console.error(`${post.slug}: upsert failed — ${error.message}`);
      process.exit(1);
    }
  }

  console.log(`\nUpserted ${posts.length} posts.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
