/**
 * Import rewritten Blogspot (label: tiktok) posts + ensure related products exist.
 *
 * Usage:
 *   npm run import:blogspot
 *
 * Idempotent: upsert posts/products on slug conflict.
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

type ProductSeed = {
  slug: string;
  name: string;
  category: string;
  price_hint: string;
};

type SeedPost = {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  products: { slug: string }[];
  contentFile: string;
  published: boolean;
  cover_image: string | null;
};

/** New catalog rows (affiliate_url left null for owner to paste later). */
const newProducts: ProductSeed[] = [
  {
    slug: 'sach-7-ngay-affiliate',
    name: 'Sách 7 Ngày Affiliate',
    category: 'sach',
    price_hint: '~99–199k',
  },
  {
    slug: 'ausync-lab-tts',
    name: 'Ausync Lab Text-to-Speech',
    category: 'cong-cu-ai',
    price_hint: 'theo gói credits',
  },
  {
    slug: 'sach-content-bac-ty',
    name: 'Sách Content Bạc Tỷ',
    category: 'sach',
    price_hint: '~99–199k',
  },
  {
    slug: 'diamondhook-bo-the',
    name: 'Bộ thẻ DiamondHook — viết câu hook mở đầu',
    category: 'sach',
    price_hint: 'theo shop',
  },
];

const posts: SeedPost[] = [
  {
    slug: '7-ngay-affiliate',
    title: '7 ngày Affiliate: lộ trình thực chiến TikTok trước khi nghĩ tới “chốt đơn”',
    description:
      'Mình từng làm affiliate kiểu bán trước — view có, đơn lủng. Lộ trình 7 ngày: chọn ngách, hook, checklist, lỗi hay gặp, và khi nào mới mua gear.',
    category: 'tiktok-money',
    tags: ['tiktok', 'affiliate', 'huong-dan', '7-ngay', 'kich-ban'],
    products: [
      { slug: 'sach-7-ngay-affiliate' },
      { slug: 'mic-boya-m1' },
      { slug: 'den-ring-light-10' },
    ],
    contentFile: '7-ngay-affiliate.md',
    published: true,
    cover_image: null,
  },
  {
    slug: 'text-to-speech-ai-thu-am',
    title: 'Chuyển văn bản thành thu âm bằng AI — khi nào dùng, khi nào đừng',
    description:
      'Mệt giọng, phòng ồn, cần voice-over nhanh? Mình dùng TTS tiếng Việt (Ausync Lab) thế nào: viết script, train giọng, và lúc nào vẫn nên ngồi mic thật.',
    category: 'tiktok-money',
    tags: ['tiktok', 'ai', 'tts', 'thu-am', 'capcut'],
    products: [{ slug: 'ausync-lab-tts' }, { slug: 'mic-boya-m1' }],
    contentFile: 'text-to-speech-ai-thu-am.md',
    published: true,
    cover_image: null,
  },
  {
    slug: '20-mon-do-lam-video-tiktok',
    title: '20+ món đồ làm video TikTok kiếm tiền — mua theo nỗi đau, không theo FOMO',
    description:
      'Từ chồng sách kê máy đến mic + đèn + tripod: list 20+ món kèm trải nghiệm thật. Biết món nào bắt buộc, món nào để sau — chỉ gắn vài link tầng một.',
    category: 'tiktok-money',
    tags: ['tiktok', 'gear', 'thiet-bi', 'review', 'setup'],
    products: [
      { slug: 'den-ring-light-10' },
      { slug: 'tripod-phone-flexible' },
      { slug: 'mic-boya-m1' },
    ],
    contentFile: '20-mon-do-lam-video-tiktok.md',
    published: true,
    cover_image: null,
  },
  {
    slug: 'huong-dan-viet-mo-ta-video-seo',
    title: 'Viết mô tả video chuẩn SEO TikTok Việt Nam — ngắn, đúng chữ người ta search',
    description:
      'Mình từng nghĩ caption chỉ để nhét hashtag. Sai. Khung 200–300 ký tự, từ khóa Việt, hashtag vừa đủ, mẫu theo ngành — bỏ link vẫn đọc được.',
    category: 'tiktok-money',
    tags: ['tiktok', 'seo-tiktok', 'ky-nang', 'mo-ta', 'hashtag'],
    products: [{ slug: 'sach-content-bac-ty' }],
    contentFile: 'huong-dan-viet-mo-ta-video-seo.md',
    published: true,
    cover_image: null,
  },
  {
    slug: 'tong-hop-cau-hook-tiktok',
    title: 'Tổng hợp câu hook giữ chân người xem — kho biến tấu từ KOC/KOL Việt',
    description:
      '13 nhóm hook hỏi–FOMO–POV–mẹo kèm cách điền nỗi đau thật. Copy nguyên sẽ bị vuốt; đọc to, chọn 1, gắn trải nghiệm của bạn.',
    category: 'tiktok-money',
    tags: ['tiktok', 'hook', 'ky-nang', 'koc', 'kich-ban'],
    products: [{ slug: 'diamondhook-bo-the' }],
    contentFile: 'tong-hop-cau-hook-tiktok.md',
    published: true,
    cover_image: null,
  },
  {
    slug: 'khoa-hoc-tao-hook-diamondhook',
    title: 'Tạo phần mở đầu hấp dẫn (hook) — quy trình 3 bước + định dạng móc kiểu DiamondHook',
    description:
      'Bí ô trống “câu mở”? Ý tưởng → tư duy móc → kịch bản. Năm định dạng bắt buộc, prompt khi bí, và khi nào mới đáng dùng bộ thẻ.',
    category: 'tiktok-money',
    tags: ['tiktok', 'hook', 'ky-nang', 'diamondhook', 'khoa-hoc'],
    products: [{ slug: 'diamondhook-bo-the' }],
    contentFile: 'khoa-hoc-tao-hook-diamondhook.md',
    published: true,
    cover_image: null,
  },
];

function countStats(text: string): { words: number; chars: number } {
  return { words: text.split(/\s+/).filter(Boolean).length, chars: text.length };
}

async function main() {
  const client = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  for (const product of newProducts) {
    const { error } = await client.from('products').upsert(
      {
        slug: product.slug,
        name: product.name,
        category: product.category,
        price_hint: product.price_hint,
        affiliate_url: null,
        image: null,
      },
      { onConflict: 'slug' },
    );
    if (error) {
      console.error(`Product failed: ${product.slug}`, error.message);
      process.exitCode = 1;
      continue;
    }
    console.log(`Upserted product: ${product.slug}`);
  }

  for (const post of posts) {
    const contentPath = join(__dirname, 'content', post.contentFile);
    const content = readFileSync(contentPath, 'utf8').trim();
    const { words, chars } = countStats(content);

    if (words < 800) {
      console.warn(`WARN ${post.slug}: words=${words} (target ≥800)`);
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
      cover_image: post.cover_image,
    };

    const { error } = await client.from('posts').upsert(row, { onConflict: 'slug' });
    if (error) {
      console.error(`Failed: ${post.slug}`, error.message);
      process.exitCode = 1;
      continue;
    }
    console.log(
      `Upserted: ${post.slug} | words=${words} chars=${chars} | products=${post.products.map((p) => p.slug).join(',')}`,
    );
  }

  // Verify published rows
  const slugs = posts.map((p) => p.slug);
  const { data, error: verifyError } = await client
    .from('posts')
    .select('slug, published, title')
    .in('slug', slugs);

  if (verifyError) {
    console.error('Verify query failed:', verifyError.message);
    process.exitCode = 1;
  } else {
    console.log('Verify:');
    for (const row of data ?? []) {
      console.log(`  ${row.slug} | published=${row.published} | ${row.title}`);
    }
  }

  console.log('Done. Re-run is safe (idempotent by slug).');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
