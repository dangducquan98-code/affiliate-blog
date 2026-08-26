/**
 * Seed 3 TikTok series posts into Supabase `posts`.
 *
 * Prerequisites:
 * 1. Run supabase/migrations/20260826_blog_upgrade.sql
 * 2. Run supabase/migrations/20260826_products.sql (gear catalog)
 * 3. Real keys in .env.local
 *
 * Usage (DO NOT run until Hermes verifies products migration):
 *   npm run seed:tiktok-series
 *
 * Idempotent by slug (upsert on slug conflict).
 * posts.products stored as [{ "slug": "..." }].
 */

import { readFileSync } from 'node:fs';
import { createClient } from '@supabase/supabase-js';

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

loadEnvFile('.env.local');
loadEnvFile('.env');

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
  content: string;
  published: boolean;
};

const posts: SeedPost[] = [
  {
    slug: 'tiktok-chon-san-pham-review',
    title: 'ĐỪNG review lung tung — chọn sản phẩm thế nào cho đỡ phí công',
    description:
      'Mình hay chọn nhầm sản phẩm để review trên TikTok. Bài này ghi lại cách lọc cho đỡ phí công quay — và gear tối thiểu để bắt đầu.',
    category: 'huong-dan',
    tags: ['tiktok', 'affiliate', 'review', 'series'],
    products: [
      { slug: 'mic-boya-m1' },
      { slug: 'den-ring-light-10' },
      { slug: 'tripod-phone-flexible' },
    ],
    published: true,
    content: `Hôm qua mình mở app Shopee, định “review nhanh” một món đang hot. Xong ngồi nghĩ lại: video này giúp được ai? Hay chỉ giúp mình thấy… bận?

Có thế thôi đã đủ để dừng lại.

## Mình từng review vì “thấy mọi người đang làm”

Giai đoạn đầu kênh TikTok (~review sản phẩm, giờ quanh 4K followers), mình chọn sản phẩm kiểu:

- Đang trend → làm
- Hoa hồng cao → làm
- Bạn bè hỏi → làm

Ý là… làm thì có view. Nhưng cookie affiliate? Lủng cà lủng củng. Người xem vào, xem xong, không biết mua cái gì, đi đâu.

Hmm... thế là vẫn mệt đầu.

## Bộ lọc 4 câu (mình đang dùng)

Trước khi bấm quay, mình tự hỏi:

1. **Mình dùng thật chưa?** Nếu chưa — đừng review kiểu “xài 2 ngày”. Nói thẳng là unbox/first look cũng được, đừng đóng giả.
2. **Người xem có vấn đề rõ không?** “Cáp đứt hoài”, “hub một cổng thôi”, “quay TikTok mà tiếng như trong toilet” — vấn đề cụ thể thì video mới “đâm” được.
3. **Giá có “đáng thử” không?** Niche mình theo: gadget / phụ kiện dưới tầm ~800k. Đắt quá, anh em ngại bấm. Rẻ quá mà đồ bỏ xừ — mất uy tín.
4. **Có chỗ gắn link sạch không?** Bio, comment ghim, hoặc kéo về blog \`/go/<slug>\`. Không có lối thoát traffic thì quay làm gì?

Không phải vì hoa hồng thấp mà bỏ. Nhưng nếu cả 4 câu đều “không” — mình bỏ.

## Disclosure (nói thẳng)

Bài trên Quân Kiu Daily có thể chứa **link affiliate Shopee**. Anh em bấm, mua trong cửa sổ cookie, mình có thể nhận hoa hồng — **giá anh em trả không đổi**. Mình vẫn chọn/review theo trải nghiệm thật; không thích thì nói không thích.

## Gear tối thiểu để bắt đầu (không cần studio)

Không cần đợi “đủ đồ”. Mình từng quay bằng điện thoại + ánh sáng cửa sổ. Sau mới thêm dần:

- Mic cài áo — tiếng sạch hơn nhiều so với mic điện thoại khi ngồi trong phòng máy lạnh
- Đèn vòng nhỏ — mặt đỡ tối, đỡ bóng đổ kiểu “phim kinh dị”
- Tripod linh hoạt — khỏi cầm máy run, khỏi cắt ngang vì mỏi tay

Chi tiết deal nằm cuối bài (nếu có). Không có link cũng không sao — quan trọng là anh em biết *cần* gì trước.

## Kết

Chọn sản phẩm không phải bước “sáng tạo”. Nó là bước **đỡ phí công**. Quay 20 video sai sản phẩm mệt phết hơn quay 5 video đúng vấn đề.

Anh em đang chọn sản phẩm theo trend, theo hoa hồng, hay theo cái mình đang dùng dở? 👇`,
  },
  {
    slug: 'tiktok-hook-3-giay',
    title: '3 giây đầu quyết định video sống hay chết',
    description:
      'Hook TikTok không phải câu thần chú. Mình ghi lại vài kiểu mở đầu đã “work” trên kênh review — và gear giúp hook nghe rõ, nhìn sạch.',
    category: 'huong-dan',
    tags: ['tiktok', 'hook', 'script', 'series'],
    products: [
      { slug: 'mic-wireless-mini' },
      { slug: 'den-led-panel' },
      { slug: 'phone-clamp-cold-shoe' },
    ],
    published: true,
    content: `Mở TikTok. Vuốt. Vuốt. Vuốt.

Ơ thật ra video của mình cũng nằm trong đống bị vuốt đó. Có thế thôi!

## Hook không phải “câu hay” — hook là lý do dừng tay

Mình từng mở đầu kiểu sách vở: “Hôm nay mình sẽ chia sẻ về…” — chết ngay ở giây 1.

Giờ mình thử mở bằng **tình huống**:

- “Cáp này mình thay lần thứ ba trong năm.”
- “Hub một cổng. Một. Cổng.”
- “Quay review mà tiếng như đang nói trong toilet.”

Người ta dừng vì *nhận ra mình*. Không phải vì mình “chuyên gia”.

## 3 kiểu hook mình hay dùng

**1. Phản biện nhẹ**  
“Đừng mua đèn vòng nếu…” — nghe có vẻ clickbait, nhưng phải *đúng*. Nếu không đúng, anh em bỏ xừ luôn lần sau.

**2. Con số cụ thể**  
“3 giây”, “dưới 300k”, “một cổng” — não thích nắm được cái gì đó.

**3. Tự vấn**  
“Không biết có phải mình kỳ không mà…” — gần giọng nhật ký. Kênh nhỏ sống nhờ độ thật, không nhờ studio.

## Disclosure

Có link affiliate Shopee ở cuối / trong CTA. Anh em mua qua link, mình có thể có hoa hồng; giá không đổi. Mình nói rõ để khỏi “nói chuyện như đang giấu gì”.

## Vì sao gear lại dính tới hook?

Hook mà **không nghe rõ** — người ta vuốt. Hook mà **mặt tối như hang** — người ta vuốt.

Không cần setup đắt:

- Mic không dây mini — đi lại vẫn nói được, khỏi sợ tụt dây
- Đèn LED panel nhỏ — chỉnh góc, đỡ bóng dưới mắt
- Kẹp máy + cold shoe — gắn mic/đèn gọn, khỏi “lóc cóc” tìm chỗ để

Quay hook sạch đã là một nửa video. Nửa còn lại là đừng nói dài dòng trước khi vào điểm.

## Kết

3 giây đầu không cần đẹp. Cần **rõ vấn đề**.

Anh em đang mở video bằng lời chào, hay bằng tình huống? Clip gần nhất của bạn, giây đầu nói gì — paste thử xem? 👇`,
  },
  {
    slug: 'tiktok-kich-ban-quay-ngan',
    title: 'Kịch bản 15–60 giây: nói gì, cắt gì, chốt gì',
    description:
      'Mình viết kịch bản TikTok như đang nhắn tin cho bạn — ngắn, có nhịp, có chỗ chốt. Kèm vài món gear giúp quay một mạch đỡ mệt.',
    category: 'huong-dan',
    tags: ['tiktok', 'script', 'quay-phim', 'series'],
    products: [
      { slug: 'gimbal-phone-budget' },
      { slug: 'lav-mic-foam' },
      { slug: 'powerbank-pd-20k' },
      { slug: 'backdrop-green-portable' },
    ],
    published: true,
    content: `Mình từng “quay freestyle”. Xong ngồi dựng 40 phút để cứu một take dài 2 phút.

Giờ mình viết trước. Không phải viết tiểu thuyết — viết như tin nhắn.

## Khung 15–60 giây mình hay dùng

1. **Hook (0–3s):** tình huống / phản biện / con số  
2. **Vấn đề (3–15s):** vì sao anh em quan tâm  
3. **Cách làm / trải nghiệm (15–40s):** 1–2 điểm thôi, đừng 7 tip  
4. **Chốt + lối thoát (cuối):** bio / blog / “link ở…” — nói tự nhiên, đừng hô “MUA NGAY”

Nhịp: câu ngắn → câu dài giải thích → câu ngắn chốt. Giống lúc nói chuyện, không giống lúc đọc slide.

## Cắt gì?

Cắt phần mình “giải thích lại lần hai”.  
Cắt lời chào dài.  
Cắt đoạn “ờ thì… ừm…”.

Giữ lại chỗ tự vấn — nghe người thật hơn. Nhưng đừng tự vấn cả phút.

## Disclosure

Series này có thể gắn link affiliate (Shopee). Có hoa hồng nếu anh em mua trong cửa sổ cookie; không ảnh hưởng giá. Mình vẫn nói đồ nào đáng, đồ nào chữa cháy tạm.

## Gear giúp “quay một mạch”

Khi kịch bản đã ngắn, setup đỡ phải nghĩ:

- Gimbal giá mềm — walk-and-talk đỡ rung (không bắt buộc mọi video)
- Wind muff / bọc xốp mic — ra ngoài gió đỡ “phèo phèo”
- Pin dự phòng PD — live / take nhiều lần thì hết pin đúng lúc đang vào flow là mệt phết
- Phông xanh portable — chỉ khi cần tách nền; indoor bình thường thì tường sạch còn hơn

Không phải mua hết mới được đăng. Mua đúng cái đang *đau*.

## Kết

Kịch bản tốt không làm video nhàm. Nó làm video **bớt ôm đồm**.

Anh em đang viết script trước, hay bấm quay rồi tính? Nếu đang freestyle — thử viết 5 dòng trước clip tiếp theo xem khác gì? 👇`,
  },
];

async function main() {
  const client = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // Soft-check products table (warn only — posts can still insert)
  const { error: productsError } = await client.from('products').select('slug').limit(1);
  if (productsError) {
    console.warn(
      'Warning: products table check failed (run 20260826_products.sql first):',
      productsError.message,
    );
  }

  for (const post of posts) {
    const row = {
      slug: post.slug,
      title: post.title,
      description: post.description,
      content: post.content,
      tags: post.tags,
      category: post.category,
      cover_image: null,
      products: post.products,
      published: post.published,
    };

    const { error } = await client.from('posts').upsert(row, { onConflict: 'slug' });
    if (error) {
      console.error(`Failed: ${post.slug}`, error.message);
      process.exitCode = 1;
      continue;
    }
    console.log(`Upserted: ${post.slug} (${post.products.length} product slugs)`);
  }

  console.log('Done. Review outline: docs/content-series-tiktok.md');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
