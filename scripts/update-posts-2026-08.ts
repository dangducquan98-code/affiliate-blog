/**
 * August 2026 fact-check pass: apply targeted passage edits to published posts.
 *
 * Each edit must match exactly once in the current DB content, otherwise the
 * script aborts before writing anything. Research and sources for every edit
 * live in docs/research-updates-2026-08.md.
 *
 * Usage: npx tsx scripts/update-posts-2026-08.ts [--dry]
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
  console.error('Missing real Supabase credentials in .env.local');
  process.exit(1);
}

type Edit = { note: string; find: string; replace: string };
type PostEdits = { slug: string; edits: Edit[] };

const plan: PostEdits[] = [
  {
    slug: 'cookie-shopee-affiliate-tiktok-4k',
    edits: [
      {
        note: 'state the official 7-day window instead of "một khoảng thời gian"',
        find: 'Khi ai đó bấm vào link affiliate của bạn, hệ thống ghi lại một dấu trên máy hoặc trên app của họ. Trong khoảng thời gian sau đó, nếu người ta mua hàng thì đơn hàng có thể được tính cho bạn.',
        replace:
          'Khi ai đó bấm vào link affiliate của bạn, hệ thống ghi lại một dấu trên máy hoặc trên app của họ. Dấu đó sống bảy ngày — điều khoản của Shopee ghi thẳng con số đó, và ghi cho cả app lẫn web. Trong bảy ngày đó, nếu người ta mua hàng thì đơn hàng có thể được tính cho bạn.',
      },
      {
        note: 'add the practical consequence of a bounded window',
        find:
          'Người xem clip của mình thường không mua ngay. Họ lưu clip lại, hoặc họ bấm vào link, xem giá, rồi đóng app. Vài ngày sau lương về, hoặc tới đúng đợt sale, thì họ mới mua. Trong khi đó mình thì đã ngồi kết luận cái clip đó thất bại từ tối hôm đăng rồi.',
        replace:
          'Người xem clip của mình thường không mua ngay. Họ lưu clip lại, hoặc họ bấm vào link, xem giá, rồi đóng app. Vài ngày sau lương về, hoặc tới đúng đợt sale, thì họ mới mua. Trong khi đó mình thì đã ngồi kết luận cái clip đó thất bại từ tối hôm đăng rồi.\n\nCái bảy ngày kia cắt hai đường. Nó đủ dài để mình đừng đọc số theo ngày, mà cũng đủ ngắn để một người đợi tới đợt sale cuối tháng thì phải bấm vào link của mình lần nữa thì đơn đó mới được tính. Nên mình không coi một cú bấm là xong việc. Người nào đã đọc bài trên blog thì lần sau họ quay lại, và cái đó thì mình làm được, khác với việc ngồi mong đúng bảy ngày.',
      },
      {
        note: 'the "unknown" section is now answered by the official terms',
        find:
          '## Nói rõ luôn phần mình không biết\n\nMình không biết cửa sổ cookie chính xác bao nhiêu ngày ở mọi trường hợp, vì con số đó Shopee có thể điều chỉnh và nó khác nhau theo chương trình. Mình cũng không biết vì sao có đơn hiện trong dashboard rồi mấy hôm sau lại mất, dù mình đoán là do khách hủy hoặc do đơn không đủ điều kiện. Mấy cái đó mình đọc lại điều khoản mỗi khi thấy lạ, chứ mình không đi giải thích thay cho họ.',
        replace:
          '## Hai chỗ mình từng không biết, giờ thì biết rồi\n\nHồi đầu mình không biết cửa sổ cookie là bao nhiêu ngày nên mình cứ nói vòng vo kiểu "một khoảng thời gian". Rồi có một tối mình ngồi đọc thẳng bản điều khoản trong trung tâm trợ giúp của Shopee, và nó ghi rõ bảy ngày. Kèm theo đó là một chi tiết mình không để ý: ghi nhận theo cú bấm cuối. Nghĩa là nếu người ta bấm link của bạn hôm nay rồi mai bấm link của người khác trước khi đặt hàng, đơn đó về tay người kia.\n\nChỗ thứ hai là chuyện đơn hiện trong dashboard rồi mấy hôm sau lại biến mất. Cái này thì hóa ra mình đoán đúng: đơn bị hủy, đơn khách từ chối nhận, đơn trả hàng hoàn tiền đều không được tính là đơn thành công. Nên con số của mấy ngày đầu là số tạm, và mình đã học được cách đừng vui sớm.\n\nMình kể chuyện đi đọc điều khoản không phải để ra vẻ chăm chỉ. Nó mất chừng hai mươi phút và nó xóa hai câu hỏi mà mình ngồi đoán mấy tháng trời. Cuối bản đó có ghi ngày cập nhật, nên thỉnh thoảng mở lại xem có đổi gì không cũng đáng, hơn là nghe kể lại trong nhóm.',
      },
    ],
  },
  {
    slug: 'lam-tiktok-affiliate-tu-0',
    edits: [
      {
        note: 'state the 7-day window',
        find:
          'Shopee affiliate chạy theo cookie. Nói gọn thì khi ai đó bấm vào link của bạn, cửa sổ cookie mở ra, và trong khoảng thời gian đó nếu họ mua hàng thì bạn có thể được tính hoa hồng, kể cả khi họ mua món khác chứ không phải món bạn review.',
        replace:
          'Shopee affiliate chạy theo cookie. Nói gọn thì khi ai đó bấm vào link của bạn, cửa sổ cookie mở ra trong bảy ngày — con số này nằm trong điều khoản của Shopee — và trong bảy ngày đó nếu họ mua hàng thì bạn có thể được tính hoa hồng, kể cả khi họ mua món khác chứ không phải món bạn review.',
      },
      {
        note: 'signing up is no longer a ten-minute formality after the e-commerce law took effect',
        find:
          'Đây là thứ tự mình khuyên ngược với phần lớn video hướng dẫn ngoài kia. Đăng ký affiliate mất mười phút, còn làm ra một video có người xem hết thì mất vài tuần.',
        replace:
          'Đây là thứ tự mình khuyên ngược với phần lớn video hướng dẫn ngoài kia. Đăng ký affiliate là việc làm một buổi — từ giữa năm nay thì có thêm bước xác thực danh tính nữa, mình kể riêng ở [bài này](/blog/xac-thuc-danh-tinh-affiliate-2026) — còn làm ra một video có người xem hết thì mất vài tuần.',
      },
    ],
  },
  {
    slug: 'faq-bat-dau-affiliate',
    edits: [
      {
        note: '"đăng ký và lấy link ngay" is no longer true since 01/7/2026',
        find:
          'Với Shopee affiliate thì bạn có thể đăng ký và lấy link ngay, không cần điều kiện follow. Cái thật sự cần không phải số follow mà là có người xem đúng đối tượng.',
        replace:
          'Không sàn nào đặt mức follow tối thiểu để bạn lấy link. Cái bạn phải qua là thủ tục: từ giữa năm nay các sàn buộc phải xác thực danh tính người làm tiếp thị liên kết trước khi cấp link, nên bước đầu tiên là giấy tờ chứ không phải số follow. Mình viết riêng chuyện đó ở [bài này](/blog/xac-thuc-danh-tinh-affiliate-2026). Còn cái thật sự quyết định thì vẫn không phải số follow, mà là có người xem đúng đối tượng.',
      },
      {
        note: 'state the 7-day window in the cookie answer',
        find:
          'Cookie nghĩa là khi ai đó bấm vào link của bạn, hệ thống ghi lại một dấu, và trong khoảng thời gian sau đó nếu người ta mua hàng thì đơn có thể được tính cho bạn, kể cả khi họ mua món khác.',
        replace:
          'Cookie nghĩa là khi ai đó bấm vào link của bạn, hệ thống ghi lại một dấu, và trong bảy ngày sau đó nếu người ta mua hàng thì đơn có thể được tính cho bạn, kể cả khi họ mua món khác. Bảy ngày là con số ghi trong điều khoản Shopee, và đơn được tính theo cú bấm cuối cùng trước khi đặt hàng.',
      },
    ],
  },
  {
    slug: 'doc-dashboard-shopee-affiliate',
    edits: [
      {
        note: 'the dashboard number is gross; fees and tax withholding come off before payout',
        find:
          '**Doanh thu ước tính.** Số này lên xuống, có phần bị trừ khi đơn bị hủy hoặc trả. Nhìn nó mỗi ngày thì cảm xúc bị kéo theo mà không rút ra được bài học nào. Mình chỉ nhìn nó một lần cuối tháng.',
        replace:
          '**Doanh thu ước tính.** Số này lên xuống, có phần bị trừ khi đơn bị hủy hoặc trả. Nhìn nó mỗi ngày thì cảm xúc bị kéo theo mà không rút ra được bài học nào. Mình chỉ nhìn nó một lần cuối tháng.\n\nVà phải nói thêm một chỗ mà hồi đầu mình không biết: con số trên bảng là số trước khi trừ. Sàn có phí của sàn, rồi tới lúc chi trả còn khoản thuế được giữ lại nộp thay. Nên số về ví luôn nhỏ hơn số mình đã ghi vào sổ tuần trước đó, và tháng đầu tiên thấy vậy mình tưởng mình cộng nhầm. Mình kể kỹ chỗ chênh đó ở [bài riêng](/blog/tien-hoa-hong-ve-vi-khac-dashboard).',
      },
    ],
  },
  {
    slug: 'chinh-sach-affiliate-2026-theo-doi',
    edits: [
      {
        note: 'section intro claimed these were only hunches; two are now law in force',
        find:
          '## Mấy thứ mình để mắt trong năm nay\n\nKhông phải dự đoán. Chỉ là mấy hướng mà mình thấy đáng để ý khi đọc thông báo hằng tháng.',
        replace:
          '## Mấy thứ mình để mắt trong năm nay\n\nMục này hồi mình viết lần đầu toàn là phỏng đoán. Năm nay thì hai trong số đó đã thành văn bản có hiệu lực, nên mình sửa lại cho đúng, và giữ nguyên mấy cái còn lại đúng như bản chất của chúng: mấy hướng đáng để ý khi đọc thông báo hằng tháng.',
      },
      {
        note: 'two predictions have since become law in force; replace with the facts',
        find:
          '**Yêu cầu về minh bạch nội dung tài trợ.** Xu hướng chung là ngày càng chặt hơn, và mình nghĩ đó là chuyện tốt cho người làm tử tế.\n\n**Chuyện kê khai thu nhập.** Cái này mình chỉ ghi là mình có để mắt, chứ mình chưa dám viết bài về nó. Mình chưa nắm đủ và đây là loại chuyện mà viết sai thì hại người đọc. Ai cần thì hỏi người làm kế toán, đừng hỏi một cái blog.',
        replace:
          '**Yêu cầu về minh bạch nội dung tài trợ.** Chỗ này mình từng ghi là "xu hướng ngày càng chặt hơn", tức là mình đang đoán. Giờ thì hết đoán: Luật Quảng cáo sửa đổi có hiệu lực từ đầu năm nay, và trong đó có một câu mà ai làm review nên đọc — chưa dùng hoặc chưa hiểu rõ sản phẩm thì không được giới thiệu. Mình viết riêng về chuyện đó ở [bài này](/blog/luat-quang-cao-2026-nguoi-review).\n\n**Xác thực danh tính người làm tiếp thị liên kết.** Cái này mới, và nó là thay đổi ảnh hưởng tới nhiều người nhất trong năm. Từ giữa năm nay, sàn phải xác thực danh tính bạn trước khi cấp link. Không phải chuyện đọc rồi để đó, mà là chuyện không làm thì không có link. Mình kể đủ ở [bài riêng](/blog/xac-thuc-danh-tinh-affiliate-2026).\n\n**Chuyện kê khai thu nhập.** Trước mình ghi là chưa dám viết. Giờ mình viết được một phần, đúng cái phần mình kiểm chứng được: sàn giữ lại một khoản trước khi chuyển tiền cho mình, nên số về ví khác số trên dashboard. Còn phần tính thuế cả năm ra bao nhiêu thì mình vẫn không viết, vì mình không đủ tư cách. Cái mình làm được thì ở [bài này](/blog/tien-hoa-hong-ve-vi-khac-dashboard), còn lại thì hỏi người làm kế toán, đừng hỏi một cái blog.',
      },
    ],
  },
  {
    slug: 'tiktok-shop-vs-affiliate-cookie',
    edits: [
      {
        note: 'both routes now require identity verification, so neither is the low-friction option',
        find:
          'Chính sách hai bên cũng đổi. Cách mình theo dõi mấy thay đổi đó mà không bị cuốn theo tin đồn thì mình viết riêng ở [bài này](/blog/chinh-sach-affiliate-2026-theo-doi).',
        replace:
          'Chính sách hai bên cũng đổi. Cách mình theo dõi mấy thay đổi đó mà không bị cuốn theo tin đồn thì mình viết riêng ở [bài này](/blog/chinh-sach-affiliate-2026-theo-doi).\n\nCó một chỗ mà từ giữa năm nay hai cửa giống hệt nhau, nên mình bỏ ra khỏi phần cân nhắc: cả hai đều bắt xác thực danh tính trước khi cấp link. Hồi trước có người chọn cửa này thay cửa kia vì thấy đỡ thủ tục hơn. Giờ thì không còn cửa nào đỡ thủ tục cả, và mình nghĩ đó là chuyện nên biết trước khi ngồi cân. Chi tiết thì mình để ở [bài về xác thực danh tính](/blog/xac-thuc-danh-tinh-affiliate-2026).',
      },
    ],
  },
  {
    slug: '20-mon-do-lam-video-tiktok',
    edits: [
      {
        note: 'contradicts the wireless mic review post, where he has owned one for three months',
        find:
          'Mic không dây. Tiện hơn thật, nhưng đắt hơn mấy lần, phải sạc, và thêm một chỗ để hỏng là chuyện kết nối. Mình tới giờ vẫn chưa mua vì kiểu quay của mình không cần.',
        replace:
          'Mic không dây. Tiện hơn thật, nhưng đắt hơn mấy lần, phải sạc, và thêm một chỗ để hỏng là chuyện kết nối. Mình có mua một con và mình vẫn dùng, chỉ là mình xếp nó vào nhóm này vì mình mua sớm hơn mức cần: lúc đó hai mươi bảy trên ba mươi clip gần nhất là mình ngồi yên ở bàn. Nếu bạn cũng ngồi bàn là chính thì cứ để đó đã, mình kể cả chỗ nó thắng lẫn chỗ nó làm mình bực ở [bài so sánh dây và không dây](/blog/mic-khong-day-mini-vs-mic-day).',
      },
    ],
  },
  {
    slug: 'huong-dan-honeygain-treo-may',
    edits: [
      {
        note: 'Honeygain rule is one device per IP, not merely diminishing returns',
        find:
          'Đừng cài mười máy trong cùng một nhà để nhân lên, vì nó tính theo địa chỉ mạng chứ không tính theo máy. Mình có thử cài thêm máy thứ hai cùng mạng và số gần như không đổi.',
        replace:
          'Đừng cài mười máy trong cùng một nhà để nhân lên. Mình có thử cài thêm máy thứ hai cùng mạng và số gần như không đổi, rồi sau đó mình đọc điều khoản mới hiểu vì sao: quy định của họ là một thiết bị trên một địa chỉ mạng. Tài khoản được phép có tới mười thiết bị, nhưng mười thiết bị đó phải ở mười địa chỉ mạng khác nhau. Nên nhồi thêm máy trong nhà thì không được thêm đồng nào, mà còn có rủi ro bị họ khóa tài khoản. Không đáng.',
      },
    ],
  },
];

const dry = process.argv.includes('--dry');

async function main() {
  const client = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const staged: { slug: string; content: string; applied: string[] }[] = [];
  const problems: string[] = [];
  const skipped: string[] = [];

  for (const { slug, edits } of plan) {
    const { data, error } = await client
      .from('posts')
      .select('slug,content')
      .eq('slug', slug)
      .maybeSingle();

    if (error || !data) {
      problems.push(`${slug}: post not found (${error?.message ?? 'no row'})`);
      continue;
    }

    let content = String(data.content ?? '');
    const applied: string[] = [];

    for (const edit of edits) {
      if (content.includes(edit.replace)) {
        skipped.push(`${slug} :: ${edit.note}`);
        continue;
      }
      const hits = content.split(edit.find).length - 1;
      if (hits !== 1) {
        problems.push(`${slug} :: ${edit.note} — expected 1 match, found ${hits}`);
        continue;
      }
      content = content.replace(edit.find, edit.replace);
      applied.push(edit.note);
    }

    staged.push({ slug, content, applied });
  }

  if (problems.length > 0) {
    console.error('Aborting, no writes performed:');
    for (const p of problems) console.error(`  - ${p}`);
    process.exit(1);
  }

  for (const { slug, content, applied } of staged) {
    if (applied.length === 0) continue;
    if (!dry) {
      const { error } = await client
        .from('posts')
        .update({ content, published: true })
        .eq('slug', slug);
      if (error) {
        console.error(`${slug}: update failed — ${error.message}`);
        process.exit(1);
      }
    }
    console.log(`${dry ? '[dry] ' : ''}${slug} — ${applied.length} edit(s)`);
    for (const note of applied) console.log(`    · ${note}`);
  }

  const total = staged.reduce((n, s) => n + s.applied.length, 0);
  const touched = staged.filter((s) => s.applied.length > 0).length;
  console.log(`\n${dry ? 'Would apply' : 'Applied'} ${total} edits across ${touched} posts.`);
  if (skipped.length > 0) console.log(`Skipped ${skipped.length} edits already present.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
