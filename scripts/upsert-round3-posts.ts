/**
 * Round 3: upsert posts that pay off the leftover gear reviews, close the Stoic series
 * and widen the three priority pillars (mmo, tu-duy, tai-chinh).
 *
 * Usage: npx tsx scripts/upsert-round3-posts.ts [phase]
 *   phase: 1 | 2 | 3 | all (default: all)
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
  console.error(
    'Missing real Supabase credentials. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local',
  );
  process.exit(1);
}

type SeedPost = {
  phase: 1 | 2 | 3;
  slug: string;
  category: string;
  title: string;
  description: string;
  tags: string[];
  products: { slug: string }[];
};

const posts: SeedPost[] = [
  // Phase 1 — cong-nghe leftovers + Stoic parts 2 and 3
  {
    phase: 1,
    slug: 'wind-muff-lav-co-can-khong',
    category: 'cong-nghe',
    title: 'Wind muff cho mic lav — món 25 nghìn và ba tháng mình mới hiểu khi nào nó cứu',
    description:
      'Mình để cái bọc xốp trong ngăn kéo ba tháng vì nghĩ quay trong nhà thì chống gió làm gì. Hóa ra thứ nó chặn nhiều nhất lại là hơi thở của mình và tiếng vải cọ.',
    tags: ['cong-nghe', 'review', 'mic', 'thu-am', 'gear'],
    products: [{ slug: 'lav-mic-foam' }],
  },
  {
    phase: 1,
    slug: 'pin-du-phong-20k-quay-ngoai-troi',
    category: 'cong-nghe',
    title: 'Pin dự phòng 20.000mAh sau mấy buổi quay ngoài trời — thứ mình cần không phải dung lượng',
    description:
      'Buổi quay ngoài trời đầu tiên của mình chết ở phút thứ bốn mươi dù trong túi có pin dự phòng. Bài này là chỗ mình chọn sai chỉ số, và cái giá phải trả khi vừa quay vừa sạc.',
    tags: ['cong-nghe', 'review', 'pin-du-phong', 'gear', 'quay-ngoai-troi'],
    products: [{ slug: 'powerbank-pd-20k' }],
  },
  {
    phase: 1,
    slug: 'gimbal-gia-mem-kenh-review-tinh',
    category: 'cong-nghe',
    title: 'Gimbal giá mềm — mình mượn dùng hai tuần rồi trả lại',
    description:
      'Con gimbal đó tốt thật, ba việc nó làm mình đều thích. Nó chỉ không hợp với một kênh mà hai mươi bảy trên ba mươi clip là ngồi yên ở bàn.',
    tags: ['cong-nghe', 'review', 'gimbal', 'gear', 'quyet-dinh-mua'],
    products: [{ slug: 'gimbal-phone-budget' }],
  },
  {
    phase: 1,
    slug: 've-khac-ky-phan-2-ngoai-tam-kiem-soat',
    category: 'tu-duy',
    title: 'Về khắc kỷ — phần 2: những thứ ngoài tầm kiểm soát',
    description:
      'Câu "đừng bận tâm chuyện ngoài tầm kiểm soát" nghe đơn giản đến mức đáng ngờ. Mình kẻ ba cột trên giấy và phát hiện ra thế giới không chia hai, nó chia ba.',
    tags: ['tu-duy', 'stoic', 'khac-ky', 'series', 'creator'],
    products: [{ slug: 'sach-khac-ky-moi-ngay' }],
  },
  {
    phase: 1,
    slug: 've-khac-ky-phan-3-memento-mori',
    category: 'tu-duy',
    title: 'Về khắc kỷ — phần 3: Memento Mori và cái đồng hồ cát trên tay mình',
    description:
      'Phần cuối của series. Vì sao một câu về cái chết lại là cái đạp chân xuống đất mạnh nhất mình biết, và cái bẫy biến nó thành một cây roi.',
    tags: ['tu-duy', 'stoic', 'khac-ky', 'series', 'memento-mori'],
    products: [{ slug: 'sach-suy-tuong' }],
  },

  // Phase 2 — mmo
  {
    phase: 2,
    slug: 'doc-dashboard-shopee-affiliate',
    category: 'mmo',
    title: 'Đọc dashboard Shopee Affiliate — tuần đầu nên nhìn số nào, bỏ qua số nào',
    description:
      'Tuần đầu mình mở dashboard chừng ba chục lần một ngày và không hiểu gì. Đây là bốn số mình nhìn bây giờ, ba số mình bỏ qua, và lý do nhìn theo tuần chứ đừng nhìn theo giờ.',
    tags: ['mmo', 'affiliate', 'shopee', 'dashboard', 'so-lieu'],
    products: [],
  },
  {
    phase: 2,
    slug: 'test-ab-cho-dat-link-affiliate',
    category: 'mmo',
    title: 'Test A/B chỗ đặt link: bio, comment ghim hay mô tả — mình làm hai tuần',
    description:
      'Mình đổi ba thứ cùng một lúc trong một tuần rồi ngồi đoán cái nào có tác dụng. Lần thứ hai mình làm tử tế hơn: một biến một lần, ghi tay năm cột, và đọc xu hướng chứ không đọc con số.',
    tags: ['mmo', 'affiliate', 'tiktok', 'test-ab', 'link'],
    products: [{ slug: 'so-tay-bujo-a5' }],
  },
  {
    phase: 2,
    slug: 'tiktok-shop-vs-affiliate-cookie',
    category: 'mmo',
    title: 'TikTok Shop hay affiliate cookie — kênh nhỏ như mình dồn vào đâu',
    description:
      'Hai cách kiếm hoa hồng khác nhau ở một chỗ căn bản: ai giữ khách sau cú click. Mình kể mình chọn gì cho kênh gần 4K, và trường hợp nào mình sẽ chọn ngược lại.',
    tags: ['mmo', 'affiliate', 'tiktok-shop', 'cookie', 'so-sanh'],
    products: [],
  },
  {
    phase: 2,
    slug: 'chinh-sach-affiliate-2026-theo-doi',
    category: 'mmo',
    title: 'Chính sách affiliate 2026 — mình theo dõi ở đâu cho đỡ hoang mang',
    description:
      'Cứ vài tuần lại có một cái post kiểu "sàn sắp cắt hết hoa hồng" và cả nhóm nháo lên. Đây là ba chỗ mình mở mỗi tháng, và quy tắc mình đặt ra để không đổi cách làm vì một tin đồn.',
    tags: ['mmo', 'affiliate', 'chinh-sach', 'shopee', 'cap-nhat'],
    products: [],
  },

  // Phase 3 — tai-chinh + tu-duy + cong-nghe
  {
    phase: 3,
    slug: 'nhu-cau-hay-mong-muon-truoc-khi-mua',
    category: 'tai-chinh',
    title: 'Nhu cầu hay mong muốn — ba câu mình hỏi trước khi bấm đặt hàng',
    description:
      'Ranh giới nhu cầu và mong muốn không nằm ở món đồ, nó nằm ở hoàn cảnh của người mua. Ba câu mình hỏi và một quyển sổ ghi lại những món mình đã không mua.',
    tags: ['tai-chinh', 'chi-tieu', 'quyet-dinh-mua', 'thoi-quen'],
    products: [{ slug: 'so-thu-chi-a5' }],
  },
  {
    phase: 3,
    slug: 'truoc-khi-nghi-toi-dau-tu',
    category: 'tai-chinh',
    title: 'Trước khi nghĩ tới đầu tư — bốn việc mình làm xong đã',
    description:
      'Mình không nói nên bỏ tiền vào đâu, mình không đủ tư cách. Mình chỉ kể bốn việc mà nếu chưa xong thì mình chưa dám nghĩ tới chuyện đó.',
    tags: ['tai-chinh', 'dau-tu', 'nguoi-moi', 'tiet-kiem'],
    products: [{ slug: 'sach-cha-giau-cha-ngheo' }],
  },
  {
    phase: 3,
    slug: 'thu-nhap-khong-deu-chia-the-nao',
    category: 'tai-chinh',
    title: 'Thu nhập tháng có tháng không — mình chia tiền thế nào cho đỡ hụt',
    description:
      'Tháng đầu có đơn mình tiêu như thể tháng nào cũng vậy. Hai tháng sau thì hụt. Giờ mình lấy mức thấp nhất làm chuẩn và tự trả lương cho mình đều mỗi tháng.',
    tags: ['tai-chinh', 'thu-nhap-phu', 'ngan-sach', 'affiliate'],
    products: [{ slug: 'sach-tam-ly-hoc-ve-tien' }],
  },
  {
    phase: 3,
    slug: 'ky-luat-khi-het-dong-luc',
    category: 'tu-duy',
    title: 'Kỷ luật khi hết động lực — mình hạ tiêu chuẩn xuống mức không thể trượt',
    description:
      'Mình đợi có hứng rồi mới làm, và cái hứng đó thì tuần có tuần không. Bài này là cách mình định nghĩa một ngày tối thiểu nhỏ đến mức buồn cười, và vì sao nó sống được.',
    tags: ['tu-duy', 'ky-luat', 'thoi-quen', 'creator', 'dong-luc'],
    products: [],
  },
  {
    phase: 3,
    slug: 'mic-khong-day-mini-vs-mic-day',
    category: 'cong-nghe',
    title: 'Mic không dây mini vs mic có dây — sau ba tháng đổi qua đổi lại',
    description:
      'Mình dùng song song hai loại và cuối cùng không bỏ loại nào. Bài này là cái ranh giới mình rút ra được: quay ngồi thì dây thắng, quay đứng dậy đi lại thì không dây thắng.',
    tags: ['cong-nghe', 'review', 'mic', 'so-sanh', 'thu-am'],
    products: [{ slug: 'mic-wireless-mini' }],
  },
];

function countStats(text: string): { words: number; goLinks: number; blogLinks: number } {
  const words = text.split(/\s+/).filter(Boolean).length;
  const goLinks = (text.match(/\]\(\/go\/[^)]+\)/g) || []).length;
  const blogLinks = (text.match(/\]\(\/blog\/[^)]+\)/g) || []).length;
  return { words, goLinks, blogLinks };
}

async function main() {
  const arg = (process.argv[2] || 'all').trim();
  const selected = arg === 'all' ? posts : posts.filter((p) => String(p.phase) === arg);

  if (selected.length === 0) {
    console.error(`No posts for phase "${arg}"`);
    process.exit(1);
  }

  const client = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  let ok = 0;
  for (const post of selected) {
    const contentPath = join(__dirname, 'content', 'round3', `${post.slug}.md`);
    const raw = readFileSync(contentPath, 'utf8');
    const parsed = matter(raw);
    const content = parsed.content.trim();

    const category =
      (typeof parsed.data.category === 'string' && parsed.data.category.trim()) || post.category;
    if (category !== post.category) {
      console.error(`Category mismatch for ${post.slug}: ${category} vs ${post.category}`);
      process.exitCode = 1;
      continue;
    }

    const { words, goLinks, blogLinks } = countStats(content);
    console.log(
      `  ${post.slug}: words=${words} goLinks=${goLinks} blogLinks=${blogLinks} category=${category}`,
    );

    const row: Record<string, unknown> = {
      slug: post.slug,
      title: post.title,
      description: post.description,
      content,
      tags: post.tags,
      category,
      products: post.products,
      published: true,
      cover_image: null,
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

  console.log(`Done. ${ok}/${selected.length} posts upserted (phase=${arg}).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
