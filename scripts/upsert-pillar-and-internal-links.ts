/**
 * Upsert pillar + inject ≥2 natural internal /blog links into existing posts.
 *
 * Usage:
 *   npm run content:internal-links
 *
 * Idempotent: skips injection if a post already has ≥2 `/blog/` links.
 * Reads pillar markdown from scripts/content/lam-tiktok-affiliate-tu-0.md
 * Also patches local scripts/content/<slug>.md when present.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';
import { resolveCategorySlug } from '../src/lib/post-category-map.ts';

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

const client = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

/** Natural bridge paragraphs — ≥2 /blog links each (or pair of bridges). */
const BRIDGES: Record<string, string[]> = {
  'tiktok-hook-3-giay': [
    'Hook xong rồi mà thân video loãng thì người xem vẫn vuốt — mình gom nhịp claim → bằng chứng → chốt trong [kịch bản quay ngắn](/blog/tiktok-kich-ban-quay-ngan). Cần “kho câu” luyện thêm thì lật [tổng hợp câu hook](/blog/tong-hop-cau-hook-tiktok).',
  ],
  'tiktok-kich-ban-quay-ngan': [
    'Kịch bản chỉ work nếu 3 giây đầu đủ dừng người — khung mình hay dùng nằm ở [hook TikTok 3 giây](/blog/tiktok-hook-3-giay). Sau khi cắt xong, đừng quên [viết mô tả SEO](/blog/huong-dan-viet-mo-ta-video-seo) cho caption.',
  ],
  'huong-dan-viet-mo-ta-video-seo': [
    'Mô tả đẹp không cứu được hook yếu — nếu video bị vuốt sớm, quay lại [hook 3 giây](/blog/tiktok-hook-3-giay). Muốn thấy timeline thật từ chọn chuyện đến đăng, đọc [hậu trường 1 video 30 giây](/blog/hau-truong-1-video-30-giay).',
  ],
  'tong-hop-cau-hook-tiktok': [
    'Kho câu chỉ là nguyên liệu — cách mình xếp hook vào mạch video nằm ở [hook 3 giây](/blog/tiktok-hook-3-giay) và [kịch bản quay ngắn](/blog/tiktok-kich-ban-quay-ngan).',
  ],
  'hau-truong-1-video-30-giay': [
    'Hậu trường này sẽ đỡ “mất thời gian vô ích” nếu bạn đã có khung [hook](/blog/tiktok-hook-3-giay) và [kịch bản](/blog/tiktok-kich-ban-quay-ngan) trước khi bấm quay. Danh sách đồ mình từng đụng: [20 món đồ làm video](/blog/20-mon-do-lam-video-tiktok).',
  ],
  '20-mon-do-lam-video-tiktok': [
    'Đồ không thay thế nội dung — nếu bạn còn kẹt “quay cái gì”, đọc [chọn sản phẩm review](/blog/tiktok-chon-san-pham-review) rồi mới mua thêm. Muốn thấy mình dùng gear trong quy trình thật: [hậu trường 30 giây](/blog/hau-truong-1-video-30-giay).',
  ],
  'tiktok-chon-san-pham-review': [
    'Chọn sản phẩm xong mà mở video bằng giá thì dễ mất niềm tin — mình từng mắc đủ trong [5 sai lầm review](/blog/5-sai-lam-review). Tư duy dài hơi hơn nằm ở [giá trị trước, bán hàng sau](/blog/gia-tri-truoc-ban-hang-sau).',
  ],
  '7-ngay-affiliate': [
    'Lộ trình 7 ngày dễ lệch nếu bạn chưa rõ câu hỏi cơ bản — đọc [FAQ bắt đầu affiliate](/blog/faq-bat-dau-affiliate) trước khi ép KPI đơn. Và nhớ [giá trị trước](/blog/gia-tri-truoc-ban-hang-sau) kẻo lại hard-sell sớm.',
  ],
  'faq-bat-dau-affiliate': [
    'FAQ xong rồi thì cần khung việc thật: thử [7 ngày affiliate](/blog/7-ngay-affiliate). Nếu view có mà đơn không, soi [5 sai lầm review](/blog/5-sai-lam-review).',
  ],
  '5-sai-lam-review': [
    'Sửa sai lầm sẽ bền hơn nếu bạn giữ [giá trị trước, bán hàng sau](/blog/gia-tri-truoc-ban-hang-sau). Còn lộ trình làm việc từng ngày: [7 ngày affiliate](/blog/7-ngay-affiliate).',
  ],
  'gia-tri-truoc-ban-hang-sau': [
    'Mindset này chỉ “nghe hay” nếu bạn vẫn đăng đều — xem [hành trình 4K follow](/blog/hanh-trinh-4k-follow) và khung [7 ngày affiliate](/blog/7-ngay-affiliate) để biến tư duy thành việc nhỏ.',
  ],
  'hanh-trinh-4k-follow': [
    'Hành trình không thay checklist kỹ thuật — nếu bạn đang kẹt hook/kịch bản, nhảy sang [hook 3 giây](/blog/tiktok-hook-3-giay) và [FAQ affiliate](/blog/faq-bat-dau-affiliate).',
  ],
  'khoa-hoc-tao-hook-diamondhook': [
    'Khoá hook chỉ là một góc — mình vẫn luyện khung tự viết trong [hook TikTok 3 giây](/blog/tiktok-hook-3-giay) và [tổng hợp câu hook](/blog/tong-hop-cau-hook-tiktok) trước khi chi thêm.',
  ],
  'text-to-speech-ai-thu-am': [
    'TTS giúp nhanh, nhưng hook và mô tả vẫn quyết định người xem dừng lại — xem [hook 3 giây](/blog/tiktok-hook-3-giay) và [mô tả SEO](/blog/huong-dan-viet-mo-ta-video-seo).',
  ],
};

function countBlogLinks(content: string): number {
  return (content.match(/\]\(\/blog\//g) || []).length;
}

function injectBridges(content: string, bridges: string[]): string {
  if (countBlogLinks(content) >= 2) return content;
  const block = bridges.map((b) => `\n\n${b}`).join('');
  // Insert before last H2 if present, else append
  const matches = [...content.matchAll(/^## .+$/gm)];
  if (matches.length >= 2) {
    const last = matches[matches.length - 1]!;
    const idx = last.index ?? -1;
    if (idx > 0) {
      return content.slice(0, idx).trimEnd() + block + '\n\n' + content.slice(idx);
    }
  }
  return content.trimEnd() + block + '\n';
}

async function upsertPillar(): Promise<void> {
  const contentPath = join(__dirname, 'content', 'lam-tiktok-affiliate-tu-0.md');
  const content = readFileSync(contentPath, 'utf8');
  const row = {
    slug: 'lam-tiktok-affiliate-tu-0',
    title: 'Làm TikTok affiliate từ 0: bản đồ mình ước có lúc mới bắt đầu',
    description:
      'Pillar nối hook, kịch bản, mô tả SEO, hậu trường, 7 ngày affiliate, FAQ, sai lầm và mindset giá trị trước — lộ trình thực dụng, không công thức thần thánh.',
    category: 'affiliate',
    tags: ['pillar', 'tiktok', 'affiliate', 'lo-trinh', 'tu-0'],
    products: [],
    published: true,
    cover_image: null,
    content,
  };

  const { error } = await client.from('posts').upsert(row, { onConflict: 'slug' });
  if (error) {
    console.error('Pillar upsert failed:', error.message);
    process.exit(1);
  }
  console.log('OK pillar:', row.slug, `(~${content.split(/\s+/).length} words)`);
}

async function patchPosts(): Promise<void> {
  const { data, error } = await client.from('posts').select('id, slug, content, category').eq('published', true);
  if (error) {
    console.error('Load posts failed:', error.message);
    process.exit(1);
  }

  let updated = 0;
  for (const row of data ?? []) {
    const slug = String(row.slug);
    let content = String(row.content ?? '');
    const bridges = BRIDGES[slug];
    let changed = false;

    if (bridges) {
      const next = injectBridges(content, bridges);
      if (next !== content) {
        content = next;
        changed = true;
      }
    }

    const mapped = resolveCategorySlug(slug, String(row.category)) ?? null;
    const categoryUpdate = mapped && mapped !== row.category ? mapped : null;
    if (categoryUpdate) changed = true;

    if (!changed) {
      const links = countBlogLinks(content);
      console.log(`skip ${slug} (blog links: ${links}, category: ${row.category})`);
      continue;
    }

    const patch: Record<string, unknown> = { content };
    if (categoryUpdate) patch.category = categoryUpdate;

    const { error: upErr } = await client.from('posts').update(patch).eq('id', row.id);
    if (upErr) {
      console.error(`Fail ${slug}:`, upErr.message);
      continue;
    }

    const localMd = join(__dirname, 'content', `${slug}.md`);
    if (existsSync(localMd) && bridges) {
      const local = readFileSync(localMd, 'utf8');
      const patchedLocal = injectBridges(local, bridges);
      if (patchedLocal !== local) writeFileSync(localMd, patchedLocal, 'utf8');
    }

    updated += 1;
    console.log(
      `OK ${slug} (blog links: ${countBlogLinks(content)}${categoryUpdate ? `, category→${categoryUpdate}` : ''})`,
    );
  }
  console.log(`Updated ${updated} posts.`);
}

await upsertPillar();
await patchPosts();
