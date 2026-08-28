/**
 * Import Honeygain guide from Notion Markdown export.
 *
 * Usage:
 *   npm run import:honeygain
 *   npm run import:honeygain -- "/path/to/ExportBlock-...-Part-1"
 *
 * Uploads images to Supabase `blog-images/posts/honeygain/` and upserts post.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const POST_SLUG = 'huong-dan-honeygain-treo-may';
const AFFILIATE_URL = 'https://r.honeygain.me/DANGD3B943';
const STORAGE_PREFIX = `posts/${POST_SLUG}`;

const IMAGE_FILES = [
  { file: 'image.png', key: 'IMG_01', name: '01-dang-ky.png' },
  { file: 'image 1.png', key: 'IMG_02', name: '02-xac-nhan-email.png' },
  { file: 'image 2.png', key: 'IMG_03', name: '03-tai-mac.png' },
  { file: 'image 3.png', key: 'IMG_04', name: '04-tai-app.png' },
  { file: 'image 4.png', key: 'IMG_05', name: '05-dang-nhap-app.png' },
  { file: 'image 5.png', key: 'IMG_06', name: '06-dang-chay.png' },
  { file: 'image 6.png', key: 'IMG_07', name: '07-jumptask.png' },
  { file: 'image 7.png', key: 'IMG_08', name: '08-lich-su-rut.png' },
] as const;

const COVER_URL =
  'https://photo2.tinhte.vn/data/attachment-files/2024/11/8520203_honeygain.jpg';

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

function getPublicStorageUrl(path: string): string {
  const base = url.replace(/\/$/, '');
  return `${base}/storage/v1/object/public/blog-images/${path.replace(/^\/+/, '')}`;
}

function findImageDir(exportRoot: string): string {
  const stat = existsSync(join(exportRoot, 'image.png'));
  if (stat) return exportRoot;
  const entries = readdirSync(exportRoot, { withFileTypes: true });
  const dir = entries.find((e) => e.isDirectory());
  if (!dir) throw new Error(`Không tìm thấy folder ảnh trong ${exportRoot}`);
  return join(exportRoot, dir.name);
}

function contentTypeFor(name: string): string {
  const ext = name.split('.').pop()?.toLowerCase();
  if (ext === 'png') return 'image/png';
  if (ext === 'jpg' || ext === 'jpeg') return 'image/jpeg';
  if (ext === 'webp') return 'image/webp';
  return 'application/octet-stream';
}

async function uploadFile(
  client: ReturnType<typeof createClient>,
  localPath: string,
  storagePath: string,
): Promise<void> {
  const buffer = readFileSync(localPath);
  const { error } = await client.storage.from('blog-images').upload(storagePath, buffer, {
    contentType: contentTypeFor(localPath),
    upsert: true,
  });
  if (error) throw new Error(`Upload ${storagePath}: ${error.message}`);
}

async function main() {
  if (!url || url.includes('placeholder') || !serviceKey || serviceKey.includes('placeholder')) {
    console.error('Thiếu SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY trong .env.local');
    process.exit(1);
  }

  const exportRoot =
    process.argv[2] || join(__dirname, 'content', 'assets', 'honeygain');

  if (!existsSync(exportRoot)) {
    console.error(`Không thấy export folder: ${exportRoot}`);
    process.exit(1);
  }

  const imageDir = findImageDir(exportRoot);
  const client = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const urlMap: Record<string, string> = {
    IMG_COVER: COVER_URL,
    GO_HONEYGAIN: AFFILIATE_URL,
  };

  console.log('Uploading images from', imageDir);
  for (const img of IMAGE_FILES) {
    const local = join(imageDir, img.file);
    if (!existsSync(local)) {
      throw new Error(`Thiếu file ảnh: ${local}`);
    }
    const storagePath = `${STORAGE_PREFIX}/${img.name}`;
    await uploadFile(client, local, storagePath);
    urlMap[img.key] = getPublicStorageUrl(storagePath);
    console.log(`  ✓ ${img.file} → ${storagePath}`);
  }

  let content = readFileSync(join(__dirname, 'content', `${POST_SLUG}.md`), 'utf8');
  for (const [key, value] of Object.entries(urlMap)) {
    content = content.replaceAll(`{{${key}}}`, value);
  }

  const post = {
    slug: POST_SLUG,
    title: 'Hướng dẫn treo máy kiếm tiền với Honeygain — cho người mới',
    description:
      'Mình ghi lại từng bước cài Honeygain trên Mac: treo máy, rút tiền, JumpTask, và vài lưu ý để đỡ mất thời gian mò.',
    content: content.trim(),
    tags: ['honeygain', 'kiem-tien-online', 'passive-income', 'huong-dan'],
    category: 'affiliate',
    products: [],
    published: true,
    cover_image: COVER_URL,
  };

  const { error: postError } = await client.from('posts').upsert(post, { onConflict: 'slug' });
  if (postError) throw new Error(postError.message);
  console.log(`Upserted post: ${POST_SLUG}`);

  const { error: deleteError } = await client.from('products').delete().eq('slug', 'honeygain');
  if (deleteError && !deleteError.message.includes('does not exist')) {
    console.warn('Could not remove honeygain product row:', deleteError.message);
  }

  console.log('\nDone.');
  console.log(`Blog: /blog/${POST_SLUG}`);
  console.log(`Link trong bài: ${AFFILIATE_URL}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
