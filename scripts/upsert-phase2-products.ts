/**
 * Phase 2: upsert 8 new products with Shopee affiliate URLs.
 *
 * Usage: npx tsx scripts/upsert-phase2-products.ts
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

const products = [
  {
    slug: 'so-tay-bujo-a5',
    name: 'Sổ tay bullet journal A5 (ô chấm)',
    category: 'khac',
    price_hint: '~40–120k',
    affiliate_url: 'https://s.shopee.vn/80CEBze4cJ',
  },
  {
    slug: 'sach-tam-ly-hoc-ve-tien',
    name: 'Sách Tâm lý học về tiền (Morgan Housel)',
    category: 'sach',
    price_hint: '~80–200k',
    affiliate_url: 'https://s.shopee.vn/60R9oLbFt7',
  },
  {
    slug: 'sach-suy-tuong',
    name: 'Sách Suy tưởng (Marcus Aurelius)',
    category: 'sach',
    price_hint: '~80–180k',
    affiliate_url: 'https://s.shopee.vn/gPdSZUHeC',
  },
  {
    slug: 'sach-khac-ky-moi-ngay',
    name: 'Sách Chủ nghĩa Khắc kỷ mỗi ngày (Daily Stoic)',
    category: 'sach',
    price_hint: '~120–250k',
    affiliate_url: 'https://s.shopee.vn/4fvmDwt8wE',
  },
  {
    slug: 'sach-cha-giau-cha-ngheo',
    name: 'Sách Cha giàu cha nghèo (Robert Kiyosaki)',
    category: 'sach',
    price_hint: '~80–200k',
    affiliate_url: 'https://s.shopee.vn/4fvmDzV2U0',
  },
  {
    slug: 'so-thu-chi-a5',
    name: 'Sổ thu chi cá nhân A5',
    category: 'khac',
    price_hint: '~40–100k',
    affiliate_url: 'https://s.shopee.vn/904lNyEl0L',
  },
  {
    slug: 'sach-khoi-nghiep-tinh-gon',
    name: 'Sách Khởi nghiệp tinh gọn (Eric Ries)',
    category: 'sach',
    price_hint: '~100–220k',
    affiliate_url: 'https://s.shopee.vn/6fgqbhI9I2',
  },
  {
    slug: 'sach-5-ngon-ngu-yeu-thuong',
    name: 'Sách 5 ngôn ngữ yêu thương (Gary Chapman)',
    category: 'sach',
    price_hint: '~80–180k',
    affiliate_url: 'https://s.shopee.vn/60R9oUKUNx',
  },
];

async function main() {
  const client = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  let ok = 0;
  for (const p of products) {
    const row = {
      slug: p.slug,
      name: p.name,
      category: p.category,
      price_hint: p.price_hint,
      affiliate_url: p.affiliate_url,
      image: null,
    };
    const { error } = await client.from('products').upsert(row, { onConflict: 'slug' });
    if (error) {
      console.error(`Failed: ${p.slug}`, error.message);
      process.exitCode = 1;
      continue;
    }
    ok++;
    console.log(`Upserted product: ${p.slug}`);
  }
  console.log(`Done. ${ok}/${products.length} products upserted.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
