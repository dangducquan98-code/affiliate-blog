/**
 * Round 2: upsert posts that fill the empty pillars (tai-chinh, review-sach, trai-nghiem, cong-nghe).
 *
 * Usage: npx tsx scripts/upsert-round2-posts.ts [phase]
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
  // Phase 1 — tai-chinh
  {
    phase: 1,
    slug: 'chi-phi-kenh-tiktok-mot-thang',
    category: 'tai-chinh',
    title: 'Chi phí thật của một tháng làm kênh TikTok — mình ngồi cộng lại và hơi giật mình',
    description:
      'Mình kẻ hai cột trên giấy rồi cộng đủ gear, điện, tool và cả thời gian cho một tháng làm kênh. Số không to, nhưng có bốn năm dòng mình chưa bao giờ tính là chi phí.',
    tags: ['tai-chinh', 'chi-phi', 'tiktok', 'creator', 'gear'],
    products: [{ slug: 'powerbank-pd-20k' }],
  },
  {
    phase: 1,
    slug: 'quy-khan-cap-khi-vua-co-con',
    category: 'tai-chinh',
    title: 'Quỹ khẩn cấp khi vừa có con — mình đặt mục tiêu thế nào cho đỡ hoảng',
    description:
      'Một đêm con sốt hơn một giờ sáng, mình nhận ra mình có tiền mà không biết rút ở đâu trong mười phút. Đây là cách mình đặt mốc theo tháng chi tiêu chứ không theo số tiền.',
    tags: ['tai-chinh', 'quy-khan-cap', 'gia-dinh', 'tiet-kiem'],
    products: [{ slug: 'sach-cha-giau-cha-ngheo' }],
  },
  {
    phase: 1,
    slug: 'thu-nhap-phu-khi-nao-dang',
    category: 'tai-chinh',
    title: 'Thu nhập phụ: khi nào đáng làm, khi nào nó ăn mất việc chính',
    description:
      'Mình trả lời trật một câu trong buổi họp vì tối trước dựng video tới một giờ sáng. Ba câu mình tự soi sau hôm đó, và mấy dấu hiệu việc phụ đang lỗ ngầm.',
    tags: ['tai-chinh', 'thu-nhap-phu', 'side-income', 'cong-viec'],
    products: [{ slug: 'sach-7-ngay-affiliate' }],
  },
  {
    phase: 1,
    slug: 'ngan-sach-3-tang-lam-them-online',
    category: 'tai-chinh',
    title: 'Ngân sách 3 tầng cho người làm thêm online — mình chia tiền trên giấy',
    description:
      'Mình bỏ ba cái app quản lý chi tiêu, mỗi cái dùng được chín ngày. Giờ mình chia ba tầng, ghi tay mười phút mỗi tuần, và nó sống được.',
    tags: ['tai-chinh', 'ngan-sach', 'thu-chi', 'side-income'],
    products: [{ slug: 'so-thu-chi-a5' }],
  },
  {
    phase: 1,
    slug: 'tra-gop-gear-creator-co-nen',
    category: 'tai-chinh',
    title: 'Trả góp gear creator — mình đã suýt bấm và lý do mình dừng lại',
    description:
      'Điền xong hết thông tin trả góp sáu tháng rồi mình tắt tab. Trả góp không làm món đồ rẻ đi, nó làm cái quyết định nhẹ đi — và cái đắt ở đây là quyết định.',
    tags: ['tai-chinh', 'tra-gop', 'gear', 'creator', 'quyet-dinh'],
    products: [{ slug: 'gimbal-phone-budget' }],
  },

  // Phase 2 — review-sach
  {
    phase: 2,
    slug: 'review-sach-7-ngay-affiliate',
    category: 'review-sach',
    title: '7 Ngày Affiliate — đọc xong mình làm khác chỗ nào',
    description:
      'Mình mua cuốn này vào đúng tuần mình đang bế tắc, và nó không làm mình có đơn. Đây là phần mình dùng được thật, phần mình bỏ qua, và ai thì chưa nên đọc.',
    tags: ['review-sach', 'affiliate', 'sach', 'mmo'],
    products: [{ slug: 'sach-7-ngay-affiliate' }],
  },
  {
    phase: 2,
    slug: 'review-sach-content-bac-ty',
    category: 'review-sach',
    title: 'Content Bạc Tỷ — phần nào đáng, phần nào mình bỏ qua',
    description:
      'Một cuốn viết cho người có đội, mà mình thì làm một mình trong bếp lúc mười một giờ đêm. Mình kể phần mình lấy được và phần mình đọc xong thì gấp lại.',
    tags: ['review-sach', 'content', 'sach', 'tiktok'],
    products: [{ slug: 'sach-content-bac-ty' }],
  },
  {
    phase: 2,
    slug: 'review-sach-suy-tuong-stoic-nguoi-moi',
    category: 'review-sach',
    title: 'Sách Stoic cho người mới — mình bắt đầu từ Suy tưởng',
    description:
      'Ba cuốn Stoic mình đã đọc và cuốn mình khuyên đọc trước. Cả cách đọc một cuốn không có mạch, đọc lệch trang cũng không sao.',
    tags: ['review-sach', 'stoic', 'khac-ky', 'sach'],
    products: [{ slug: 'sach-suy-tuong' }],
  },
  {
    phase: 2,
    slug: 'review-sach-tam-ly-hoc-ve-tien',
    category: 'review-sach',
    title: 'Tâm lý học về tiền — đọc lúc đang mê affiliate thì thấm chỗ nào',
    description:
      'Mình mở cuốn này ra để tìm cách kiếm tiền nhanh hơn, và nó không có chỗ nào trả lời. Nhưng có hai chương làm mình đổi hành vi quanh tiền.',
    tags: ['review-sach', 'tai-chinh', 'sach', 'tam-ly'],
    products: [{ slug: 'sach-tam-ly-hoc-ve-tien' }],
  },
  {
    phase: 2,
    slug: 'review-sach-khoi-nghiep-tinh-gon',
    category: 'review-sach',
    title: 'Khởi nghiệp tinh gọn — mình lấy được gì cho một kênh một người',
    description:
      'Cuốn này viết cho startup, mình thì có một cái điện thoại và một cái bàn 1m². Nhưng có một khái niệm trong đó mình dịch lại được cho kênh nhỏ.',
    tags: ['review-sach', 'khoi-nghiep', 'sach', 'creator'],
    products: [{ slug: 'sach-khoi-nghiep-tinh-gon' }],
  },

  // Phase 3 — trai-nghiem + cong-nghe
  {
    phase: 3,
    slug: 'nhung-ngay-phai-chiu-dung',
    category: 'trai-nghiem',
    title: 'Những ngày phải chịu đựng',
    description:
      'Mười một đơn hàng 8/3 không gửi đi kịp, một chính sách phép mới mà mình phải đi làm rõ. Mấy dòng mình viết năm 2022, giờ ngồi kể lại đầy đủ.',
    tags: ['trai-nghiem', 'nhat-ky', 'cong-viec', 'stoic'],
    products: [{ slug: 'sach-suy-tuong' }],
  },
  {
    phase: 3,
    slug: 'khong-thuong-tet-dong-cam',
    category: 'trai-nghiem',
    title: 'Không thưởng Tết — hôm đó mình không muốn nói gì tích cực',
    description:
      'Sếp họp cả công ty và thông báo không có thưởng Tết. Mình làm truyền thông nội bộ, việc của mình là mang năng lượng đến cho anh em, mà hôm đó thì mình không làm.',
    tags: ['trai-nghiem', 'cong-viec', 'nhat-ky', 'tai-chinh'],
    products: [{ slug: 'so-thu-chi-a5' }],
  },
  {
    phase: 3,
    slug: 'kiem-them-va-gia-dinh-lech-nhip',
    category: 'trai-nghiem',
    title: 'Khi kiếm thêm và gia đình lệch nhịp',
    description:
      'Có tuần mình quay bốn tối liền, và cuối tuần đó vợ mình không nói gì cả. Bài này mình không có kết luận đẹp, mình chỉ kể thật chỗ mình đang loay hoay.',
    tags: ['trai-nghiem', 'gia-dinh', 'creator', 'can-bang'],
    products: [{ slug: 'sach-5-ngon-ngu-yeu-thuong' }],
  },
  {
    phase: 3,
    slug: 'tuan-view-tut-lam-gi',
    category: 'trai-nghiem',
    title: 'Tuần view tụt — mình làm gì ngoài việc "cố thêm"',
    description:
      'Bốn ngày liền view rơi xuống còn một phần mấy. Mình ghi lại đúng những gì mình làm trong tuần đó, không có phần drama thuật toán.',
    tags: ['trai-nghiem', 'tiktok', 'creator', 'stoic'],
    products: [{ slug: 'sach-khac-ky-moi-ngay' }],
  },
  {
    phase: 3,
    slug: 'lam-tiktok-mot-minh-11h-toi',
    category: 'trai-nghiem',
    title: 'Làm TikTok một mình lúc 11 giờ đêm',
    description:
      'Bàn một mét vuông, con ngủ ở phòng bên, và mình nói thầm vào mic để không ai thức. Không phải bài truyền cảm hứng, chỉ là một buổi tối kể lại đúng như nó có.',
    tags: ['trai-nghiem', 'tiktok', 'creator', 'nhat-ky'],
    products: [{ slug: 'den-ring-light-10' }],
  },
  {
    phase: 3,
    slug: 'den-ring-light-10-inch-2-thang',
    category: 'cong-nghe',
    title: 'Đèn ring 10 inch sau 2 tháng quay ban đêm — ưng gì, không ưng gì',
    description:
      'Mình mua đèn ring vì clip quay ban đêm nhìn xám như phim tài liệu. Hai tháng sau, đây là chỗ nó cứu mình và chỗ nó làm mình khó chịu.',
    tags: ['cong-nghe', 'review', 'den', 'ring-light', 'gear'],
    products: [{ slug: 'den-ring-light-10' }],
  },
  {
    phase: 3,
    slug: 'tripod-linh-hoat-vs-ke-sach',
    category: 'cong-nghe',
    title: 'Tripod linh hoạt vs kê sách — sau 20 clip unbox',
    description:
      'Mình kê sách suốt mấy tháng đầu và nó dùng được thật. Bài này là chỗ nó hỏng việc, và ai thì vẫn cứ kê sách tiếp cũng chẳng sao.',
    tags: ['cong-nghe', 'review', 'tripod', 'gear', 'setup'],
    products: [{ slug: 'tripod-phone-flexible' }],
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
  const selected =
    arg === 'all' ? posts : posts.filter((p) => String(p.phase) === arg);

  if (selected.length === 0) {
    console.error(`No posts for phase "${arg}"`);
    process.exit(1);
  }

  const client = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  let ok = 0;
  for (const post of selected) {
    const contentPath = join(__dirname, 'content', 'round2', `${post.slug}.md`);
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
