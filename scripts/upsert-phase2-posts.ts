/**
 * Phase 2: upsert 10 priority posts (MMO-01..05, TD-01..05).
 *
 * Usage: npx tsx scripts/upsert-phase2-posts.ts
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
    slug: 'view-co-click-khong-7-cho-soi',
    title: 'View có, click không — 7 chỗ mình tự soi trước khi đổ lỗi sản phẩm',
    description:
      'View TikTok ổn mà Shopee affiliate không click? Checklist 7 chỗ: bio, ghim, timing CTA, audience, UTM — ghi tay trước khi đổi SP.',
    tags: ['mmo', 'affiliate', 'tiktok', 'debug', 'shopee'],
    products: [{ slug: 'so-tay-bujo-a5' }],
    contentFile: 'view-co-click-khong-7-cho-soi.md',
    published: true,
    cover_image: null,
  },
  {
    slug: 'cookie-shopee-affiliate-tiktok-4k',
    title: 'Cookie Shopee affiliate hoạt động thế nào (góc TikTok ~4K)',
    description:
      'Cookie affiliate Shopee giải thích không cam kết thu nhập: view vs click vs đơn muộn, cửa sổ thời gian, funnel kênh nhỏ.',
    tags: ['mmo', 'affiliate', 'shopee', 'cookie', 'tiktok'],
    products: [{ slug: 'sach-7-ngay-affiliate' }],
    contentFile: 'cookie-shopee-affiliate-tiktok-4k.md',
    published: true,
    cover_image: null,
  },
  {
    slug: 'thang-dau-co-don-affiliate-so-that',
    title: 'Tháng đầu có đơn affiliate: số mình dám viết (làm tròn)',
    description:
      'View, click, đơn và chi phí kênh tháng đầu TikTok affiliate — số làm tròn trung thực, không flex dashboard.',
    tags: ['mmo', 'affiliate', 'tiktok', 'so-lieu', 'thang-dau'],
    products: [{ slug: 'mic-boya-m1' }],
    contentFile: 'thang-dau-co-don-affiliate-so-that.md',
    published: true,
    cover_image: null,
  },
  {
    slug: 'comment-ghim-3-mau-khong-spam',
    title: 'Comment ghim: 3 mẫu mình dùng (không spam link)',
    description:
      'Khi nào pin comment, khi nào đổi — 3 mẫu ghim mời đọc blog, không hô mua, khớp clip TikTok ~4K.',
    tags: ['mmo', 'tiktok', 'comment', 'ghim', 'affiliate'],
    products: [{ slug: 'sach-content-bac-ty' }],
    contentFile: 'comment-ghim-3-mau-khong-spam.md',
    published: true,
    cover_image: null,
  },
  {
    slug: 'funnel-tiktok-blog-caption',
    title: 'Funnel TikTok → blog: caption kéo người đọc sâu',
    description:
      'Hook clip + một lý do sang bài + một từ khóa SEO. Góc máy ổn thì caption mới có đất — funnel affiliate thực chiến.',
    tags: ['mmo', 'tiktok', 'blog', 'funnel', 'caption'],
    products: [{ slug: 'phone-clamp-cold-shoe' }],
    contentFile: 'funnel-tiktok-blog-caption.md',
    published: true,
    cover_image: null,
  },
  {
    slug: 'chuc-mung-neu-ban-khong-giau',
    title: 'Chúc mừng nếu bạn không giàu (bản blog)',
    description:
      'Chuyển từ Facebook: tiền vs hiện tại, side income và Memento Mori — không cổ súy lười, vẫn có mục tiêu tài chính.',
    tags: ['tu-duy', 'mindset', 'tai-chinh', 'stoic'],
    products: [{ slug: 'sach-tam-ly-hoc-ve-tien' }],
    contentFile: 'chuc-mung-neu-ban-khong-giau.md',
    published: true,
    cover_image: null,
  },
  {
    slug: 've-khac-ky-phan-1-tham-lam-mong-cau',
    title: 'Về khắc kỷ — phần 1: tham lam và mong cầu',
    description:
      'Lương 12k→15k, mong cầu người lớn vs trẻ em — kiểm soát tham lam, không triệt tiêu. Series Stoic đời thường.',
    tags: ['tu-duy', 'stoic', 'khac-ky', 'series'],
    products: [{ slug: 'sach-suy-tuong' }],
    contentFile: 've-khac-ky-phan-1-tham-lam-mong-cau.md',
    published: true,
    cover_image: null,
  },
  {
    slug: 'tam-the-con-tot-hoi-khac',
    title: 'Tâm thế còn tốt — hỏi khác thay vì "đủ giỏi chưa"',
    description:
      'Stoic + creator: thay câu hỏi năng lực bằng tâm thế. Ngã tính tiếp — không hustle porn, không toxic positivity.',
    tags: ['tu-duy', 'stoic', 'creator', 'mindset'],
    products: [{ slug: 'sach-khac-ky-moi-ngay' }],
    contentFile: 'tam-the-con-tot-hoi-khac.md',
    published: true,
    cover_image: null,
  },
  {
    slug: 'nga-tinh-tiep-sau-10-clip-flop',
    title: 'Ngã tính tiếp — sau 10 clip không ai xem',
    description:
      'Không toxic positivity: hành vi cụ thể ngày hôm sau bật máy sau chuỗi clip flop — ego, Stoic, không drama thuật toán.',
    tags: ['tu-duy', 'creator', 'stoic', 'flop'],
    products: [{ slug: 'sach-suy-tuong' }],
    contentFile: 'nga-tinh-tiep-sau-10-clip-flop.md',
    published: true,
    cover_image: null,
  },
  {
    slug: 'thoi-quen-sang-15-phut-truoc-khi-quay',
    title: 'Thói quen sáng: 15 phút trước khi quay clip',
    description:
      'Ghi 3 ý hook trước khi bấm record — 15 phút, sổ A5, không mở analytics. Thói quen nhỏ cho creator ban đêm.',
    tags: ['tu-duy', 'creator', 'hook', 'thoi-quen'],
    products: [{ slug: 'so-tay-bujo-a5' }],
    contentFile: 'thoi-quen-sang-15-phut-truoc-khi-quay.md',
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
    console.log(`  ${post.slug}: words=${words} goLinks=${goLinks} category=${category}`);

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
