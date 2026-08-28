/**
 * Upsert posts from reader-review optimization batch (items 2, 3, 5).
 *
 * Usage: npx tsx scripts/upsert-reader-review-batch.ts
 *
 * Idempotent: upsert on posts.slug conflict.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';
import matter from 'gray-matter';
import { getPostCategoryBySlug } from '../src/lib/post-category-map.ts';

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
  tags: string[];
  products: { slug: string }[];
  contentFile: string;
  published: boolean;
  cover_image: string | null;
  created_at?: string;
};

const posts: SeedPost[] = [
  {
    slug: 'review-mic-boya-by-m1',
    title: 'Review mic Boya BY-M1 sau 3 tháng — ưng gì, không ưng gì',
    description:
      'Mình mua vì máy lạnh nuốt tiếng clip review. Sau ba tháng dùng indoor: tiếng sạch hơn mic máy, dây hơi vướng, outdoor cần bọc gió. Đọc trước khi chốt.',
    tags: ['review', 'mic', 'gear', 'boya', 'tiktok'],
    products: [{ slug: 'mic-boya-m1' }, { slug: 'lav-mic-foam' }],
    contentFile: 'review-mic-boya-by-m1.md',
    published: true,
    cover_image: null,
  },
  {
    slug: 'huong-dan-honeygain-treo-may',
    title: 'Kiếm tiền thụ động phụ với Honeygain (treo máy) — không thuộc chuỗi TikTok',
    description:
      'Bài phụ: treo máy chia băng thông dư, kỳ vọng tiền cà phê — không thay lộ trình TikTok affiliate. Từng bước cài Mac, rút tiền, JumpTask.',
    tags: ['honeygain', 'passive-income', 'huong-dan', 'phu'],
    products: [],
    contentFile: 'huong-dan-honeygain-treo-may.md',
    published: true,
    cover_image:
      'https://photo2.tinhte.vn/data/attachment-files/2024/11/8520203_honeygain.jpg',
    created_at: '2026-08-15T10:00:00.000Z',
  },
  {
    slug: 'tiktok-hook-3-giay',
    title: '3 giây đầu quyết định video sống hay chết',
    description:
      'Hook TikTok không phải câu thần chú. 5 kiểu mở đầu mình đang dùng trên kênh ~4K — và vì sao tiếng/mặt sạch quyết định tay có dừng không.',
    tags: ['tiktok', 'hook', 'script', 'series', '3-giay'],
    products: [],
    contentFile: 'tiktok-hook-3-giay.md',
    published: true,
    cover_image: null,
  },
  {
    slug: 'tiktok-chon-san-pham-review',
    title: 'ĐỪNG review lung tung — chọn sản phẩm thế nào cho đỡ phí công',
    description:
      'Mình từng chọn sản phẩm TikTok theo trend và hoa hồng — view có, cookie lủng. Bộ lọc 5 câu + gear tối thiểu để đỡ phí công quay.',
    tags: ['tiktok', 'affiliate', 'review', 'series', 'chon-san-pham'],
    products: [],
    contentFile: 'tiktok-chon-san-pham-review.md',
    published: true,
    cover_image: null,
  },
  {
    slug: 'tiktok-kich-ban-quay-ngan',
    title: 'Kịch bản 15–60 giây: nói gì, cắt gì, chốt gì',
    description:
      'Mình từng quay freestyle rồi dựng 40 phút cứu take. Giờ viết như tin nhắn: khung 15–60s, cắt gì, chốt gì, gear nào giúp quay một mạch.',
    tags: ['tiktok', 'script', 'quay-phim', 'series', 'kich-ban'],
    products: [],
    contentFile: 'tiktok-kich-ban-quay-ngan.md',
    published: true,
    cover_image: null,
  },
  {
    slug: '7-ngay-affiliate',
    title: '7 ngày Affiliate: lộ trình thực chiến TikTok trước khi nghĩ tới “chốt đơn”',
    description:
      'Mình từng làm affiliate kiểu bán trước — view có, đơn lủng. Lộ trình 7 ngày: chọn ngách, hook, checklist, lỗi hay gặp, và khi nào mới mua gear.',
    tags: ['tiktok', 'affiliate', 'huong-dan', '7-ngay', 'kich-ban'],
    products: [{ slug: 'sach-7-ngay-affiliate' }],
    contentFile: '7-ngay-affiliate.md',
    published: true,
    cover_image: null,
  },
  {
    slug: 'text-to-speech-ai-thu-am',
    title: 'Chuyển văn bản thành thu âm bằng AI — khi nào dùng, khi nào đừng',
    description:
      'Mệt giọng, phòng ồn, cần voice-over nhanh? Mình dùng TTS tiếng Việt (Ausync Lab) thế nào: viết script, train giọng, và lúc nào vẫn nên ngồi mic thật.',
    tags: ['tiktok', 'ai', 'tts', 'thu-am', 'capcut'],
    products: [{ slug: 'ausync-lab-tts' }],
    contentFile: 'text-to-speech-ai-thu-am.md',
    published: true,
    cover_image: null,
  },
  {
    slug: '5-sai-lam-review',
    title: '5 sai lầm làm review khiến view có mà đơn không — mình mắc đủ',
    description:
      'Mở bằng giá, review đẹp đều, chọn theo hoa hồng, đổ lỗi thiết bị, đuổi view quên niềm tin. Mỗi sai: tình huống thật, hậu quả, cách sửa — giọng tự vấn.',
    tags: ['sai-lam', 'review', 'bai-hoc', 'affiliate', 'tiktok'],
    products: [],
    contentFile: '5-sai-lam-review.md',
    published: true,
    cover_image: null,
  },
];

function countStats(text: string): { words: number; goLinks: number } {
  const words = text.split(/\s+/).filter(Boolean).length;
  const goLinks = (text.match(/\]\(\/go\/[^)]+\)/g) || []).length;
  return { words, goLinks };
}

async function main() {
  const client = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  let ok = 0;
  for (const post of posts) {
    const contentPath = join(__dirname, 'content', post.contentFile);
    const raw = readFileSync(contentPath, 'utf8');
    const parsed = matter(raw);
    const content = parsed.content.trim();

    const category =
      (typeof parsed.data.category === 'string' && parsed.data.category.trim()) ||
      getPostCategoryBySlug(post.slug);
    if (!category) {
      console.error(`Missing category for ${post.slug}`);
      process.exitCode = 1;
      continue;
    }

    const { words, goLinks } = countStats(content);
    console.log(`  ${post.slug}: words=${words} goLinks=${goLinks}`);

    const row: Record<string, unknown> = {
      slug: post.slug,
      title: post.title,
      description: post.description,
      content,
      tags: post.tags,
      category,
      products: post.products,
      published: post.published,
      cover_image: post.cover_image,
    };
    if (post.created_at) row.created_at = post.created_at;

    const { error } = await client.from('posts').upsert(row, { onConflict: 'slug' });
    if (error) {
      console.error(`Failed: ${post.slug}`, error.message);
      process.exitCode = 1;
      continue;
    }
    ok++;
    console.log(`Upserted: ${post.slug}`);
  }

  console.log(`Done. ${ok}/${posts.length} posts upserted.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
