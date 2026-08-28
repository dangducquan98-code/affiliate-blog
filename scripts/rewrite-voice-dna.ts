/**
 * Upsert all 15 blog posts rewritten in authentic Quân Kiu voice DNA.
 *
 * Usage:
 *   npm run rewrite:voice-dna
 *
 * Idempotent: upsert on posts.slug conflict.
 * Reads markdown from scripts/content/<slug>.md
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
};

const posts: SeedPost[] = [
  {
    slug: 'lam-tiktok-affiliate-tu-0',
    title: 'Làm TikTok affiliate từ 0: bản đồ mình ước có lúc mới bắt đầu',
    description:
      'Pillar nối hook, kịch bản, mô tả SEO, hậu trường, 7 ngày affiliate, FAQ, sai lầm và mindset giá trị trước — lộ trình thực dụng, không công thức thần thánh.',
    tags: ['pillar', 'tiktok', 'affiliate', 'lo-trinh', 'tu-0'],
    products: [],
    contentFile: 'lam-tiktok-affiliate-tu-0.md',
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
    products: [
      { slug: 'sach-7-ngay-affiliate' },
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
    tags: ['tiktok', 'ai', 'tts', 'thu-am', 'capcut'],
    products: [{ slug: 'ausync-lab-tts' }],
    contentFile: 'text-to-speech-ai-thu-am.md',
    published: true,
    cover_image: null,
  },
  {
    slug: '20-mon-do-lam-video-tiktok',
    title: '20+ món đồ làm video TikTok kiếm tiền — mua theo nỗi đau, không theo FOMO',
    description:
      'Từ chồng sách kê máy đến mic + đèn + tripod: list 20+ món kèm trải nghiệm thật. Biết món nào bắt buộc, món nào để sau — chỉ gắn vài link tầng một.',
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
    tags: ['tiktok', 'hook', 'ky-nang', 'diamondhook', 'khoa-hoc'],
    products: [{ slug: 'diamondhook-bo-the' }],
    contentFile: 'khoa-hoc-tao-hook-diamondhook.md',
    published: true,
    cover_image: null,
  },
  {
    slug: 'hanh-trinh-4k-follow',
    title: 'Từ video đầu tiên 200 view đến 4K follow: hành trình không có gì “bùng nổ”',
    description:
      'Không viral thần thánh — chỉ chuỗi việc nhỏ đều đặn. Mình kể thật từ ~200 view đến ~4K follow: lúc muốn bỏ, số liệu thật, và ảo tưởng đã bỏ được.',
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
    tags: ['sai-lam', 'review', 'bai-hoc', 'affiliate', 'tiktok'],
    products: [],
    contentFile: '5-sai-lam-review.md',
    published: true,
    cover_image: null,
  },
  {
    slug: 'gia-tri-truoc-ban-hang-sau',
    title: 'Giá trị trước, bán hàng sau: câu nói mình ghét lúc đầu nhưng giờ áp dụng mỗi ngày',
    description:
      'Vì sao content-first không đối nghịch affiliate cookie: tin → click → cookie → đơn (đôi khi muộn). Chuyện chuyển tư duy từ bán trước sang giá trị trước.',
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

    const { words, chars, goLinks } = countStats(content);

    if (words < 900 || words > 1700) {
      console.warn(`WARN ${post.slug}: words=${words} (target 900–1500)`);
    }
    if (goLinks > 3) {
      console.warn(`WARN ${post.slug}: goLinks=${goLinks} (target ≤3)`);
    }

    const row = {
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

    const { error } = await client.from('posts').upsert(row, { onConflict: 'slug' });
    if (error) {
      console.error(`Failed: ${post.slug}`, error.message);
      process.exitCode = 1;
      continue;
    }
    ok++;
    console.log(
      `Upserted: ${post.slug} | words=${words} goLinks=${goLinks} | products=${post.products.length}`,
    );
  }

  console.log(`Done. ${ok}/${posts.length} posts upserted.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
