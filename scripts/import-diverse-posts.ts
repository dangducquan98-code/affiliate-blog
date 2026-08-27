/**
 * Upsert 5 diverse (non-review) posts — journey, mistakes, mindset, BTS, FAQ.
 *
 * Usage:
 *   npm run import:diverse
 *
 * Idempotent: upsert posts on slug conflict.
 * Does NOT create products — only references existing catalog slugs.
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
  cover_image: string | null;
};

const posts: SeedPost[] = [
  {
    slug: 'hanh-trinh-4k-follow',
    title: 'Từ video đầu tiên 200 view đến 4K follow: hành trình không có gì “bùng nổ”',
    description:
      'Không viral thần thánh — chỉ chuỗi việc nhỏ đều đặn. Mình kể thật từ ~200 view đến ~4K follow: lúc muốn bỏ, số liệu thật, và ảo tưởng đã bỏ được.',
    category: 'hanh-trinh',
    tags: ['hanh-trinh', 'tiktok', 'affiliate', '4k-follow'],
    products: [],
    contentFile: 'hanh-trinh-4k-follow.md',
    published: true,
    cover_image: null,
  },
  {
    slug: '5-sai-lam-review',
    title: '5 sai lầm làm review khiến view có mà đơn không — mình mắc đủ',
    description:
      'Mở bằng giá, review đẹp đều, chọn theo hoa hồng, đổ lỗi thiết bị, đuổi view quên niềm tin. Mỗi sai: tình huống thật, hậu quả, cách sửa — giọng tự vấn.',
    category: 'sai-lam',
    tags: ['sai-lam', 'review', 'bai-hoc', 'affiliate', 'tiktok'],
    products: [{ slug: 'mic-boya-m1' }, { slug: 'den-ring-light-10' }],
    contentFile: '5-sai-lam-review.md',
    published: true,
    cover_image: null,
  },
  {
    slug: 'gia-tri-truoc-ban-hang-sau',
    title: 'Giá trị trước, bán hàng sau: câu nói mình ghét lúc đầu nhưng giờ áp dụng mỗi ngày',
    description:
      'Vì sao content-first không đối nghịch affiliate cookie: tin → click → cookie → đơn (đôi khi muộn). Chuyện chuyển tư duy từ bán trước sang giá trị trước.',
    category: 'mindset',
    tags: ['mindset', 'content-first', 'affiliate', 'cookie'],
    products: [{ slug: 'sach-7-ngay-affiliate' }],
    contentFile: 'gia-tri-truoc-ban-hang-sau.md',
    published: true,
    cover_image: null,
  },
  {
    slug: 'hau-truong-1-video-30-giay',
    title: 'Một video 30 giây của mình được làm ra như thế nào (hậu trường 3 tiếng)',
    description:
      'Timeline thật: chọn chuyện 30p → viết 45p → quay ~20 take (1h) → CapCut 45p → caption/đăng → theo dõi sớm. Vì sao không xong trong 10 phút — và gear nào thật sự đụng tới.',
    category: 'hau-truong',
    tags: ['hau-truong', 'quy-trinh', 'capcut', 'tiktok', 'setup'],
    products: [
      { slug: 'mic-boya-m1' },
      { slug: 'den-ring-light-10' },
      { slug: 'tripod-phone-flexible' },
    ],
    contentFile: 'hau-truong-1-video-30-giay.md',
    published: true,
    cover_image: null,
  },
  {
    slug: 'faq-bat-dau-affiliate',
    title: 'FAQ: tài khoản mới làm affiliate nên bắt đầu thế nào — 5 câu mình nhận được nhiều nhất',
    description:
      'Bao giờ có thu nhập, cần bao nhiêu follow, có cần xin hàng không, quay gì đầu tiên, cookie chạy sao — trả lời thẳng, thực dụng, không list deal.',
    category: 'faq',
    tags: ['faq', 'affiliate', 'bat-dau', 'tiktok', 'cookie'],
    products: [],
    contentFile: 'faq-bat-dau-affiliate.md',
    published: true,
    cover_image: null,
  },
];

function countStats(text: string): { words: number; chars: number; goLinks: number } {
  const words = text.split(/\s+/).filter(Boolean).length;
  const goLinks = (text.match(/\]\(\/go\/[^)]+\)/g) || []).length;
  return { words, chars: text.length, goLinks };
}

async function main() {
  const client = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  for (const post of posts) {
    const contentPath = join(__dirname, 'content', post.contentFile);
    const content = readFileSync(contentPath, 'utf8').trim();
    const { words, chars, goLinks } = countStats(content);

    if (words < 1000 || words > 1600) {
      console.warn(`WARN ${post.slug}: words=${words} (target 1000–1600)`);
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
      `Upserted: ${post.slug} | words=${words} chars=${chars} | /go links=${goLinks} | products=${
        post.products.map((p) => p.slug).join(',') || '(none)'
      }`,
    );
  }

  const slugs = posts.map((p) => p.slug);
  const { data, error: verifyError } = await client
    .from('posts')
    .select('slug, published, title, category')
    .in('slug', slugs)
    .order('slug');

  if (verifyError) {
    console.error('Verify query failed:', verifyError.message);
    process.exitCode = 1;
  } else {
    console.log('Verify:');
    const found = new Set((data ?? []).map((r) => r.slug));
    for (const slug of slugs) {
      const row = (data ?? []).find((r) => r.slug === slug);
      if (!row) {
        console.error(`  MISSING: ${slug}`);
        process.exitCode = 1;
      } else {
        console.log(
          `  ${row.slug} | published=${row.published} | category=${row.category} | ${row.title}`,
        );
        if (!row.published) process.exitCode = 1;
      }
    }
    if (found.size !== slugs.length) {
      console.error(`Expected ${slugs.length} rows, found ${found.size}`);
      process.exitCode = 1;
    }
  }

  console.log('Done. Re-run is safe (idempotent by slug). No products created.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
