/** Canonical category slug per published post — single source for DB, scripts, content frontmatter. */

import { isValidCategorySlug } from './categories.ts';

export const POST_CATEGORY_BY_SLUG: Readonly<Record<string, string>> = {
  'lam-tiktok-affiliate-tu-0': 'mmo',
  'khoa-hoc-tao-hook-diamondhook': 'mmo',
  'tong-hop-cau-hook-tiktok': 'mmo',
  'huong-dan-viet-mo-ta-video-seo': 'mmo',
  'faq-bat-dau-affiliate': 'mmo',
  'hau-truong-1-video-30-giay': 'mmo',
  '5-sai-lam-review': 'mmo',
  'hanh-trinh-4k-follow': 'mmo',
  '7-ngay-affiliate': 'mmo',
  'tiktok-kich-ban-quay-ngan': 'mmo',
  'tiktok-hook-3-giay': 'mmo',
  'tiktok-chon-san-pham-review': 'mmo',
  'huong-dan-honeygain-treo-may': 'mmo',
  'gia-tri-truoc-ban-hang-sau': 'tu-duy',
  '20-mon-do-lam-video-tiktok': 'cong-nghe',
  'text-to-speech-ai-thu-am': 'cong-nghe',
  'review-mic-boya-by-m1': 'cong-nghe',
  'view-co-click-khong-7-cho-soi': 'mmo',
  'cookie-shopee-affiliate-tiktok-4k': 'mmo',
  'thang-dau-co-don-affiliate-so-that': 'mmo',
  'comment-ghim-3-mau-khong-spam': 'mmo',
  'funnel-tiktok-blog-caption': 'mmo',
  'chuc-mung-neu-ban-khong-giau': 'tu-duy',
  've-khac-ky-phan-1-tham-lam-mong-cau': 'tu-duy',
  'tam-the-con-tot-hoi-khac': 'tu-duy',
  'nga-tinh-tiep-sau-10-clip-flop': 'tu-duy',
  'thoi-quen-sang-15-phut-truoc-khi-quay': 'tu-duy',
};

/** Pre-pillar / old category slugs → current pillar slugs. */
export const LEGACY_CATEGORY_MAP: Readonly<Record<string, string>> = {
  'lam-tiktok': 'mmo',
  affiliate: 'mmo',
  'review-gear': 'cong-nghe',
  'ai-cong-cu': 'cong-nghe',
  'huong-dan': 'mmo',
  'hau-truong': 'mmo',
  'tiktok-money': 'mmo',
  'hanh-trinh': 'mmo',
  'sai-lam': 'mmo',
  mindset: 'tu-duy',
  faq: 'mmo',
  sach: 'review-sach',
  'cong-cu-ai': 'cong-nghe',
};

export function getPostCategoryBySlug(slug: string): string | undefined {
  const mapped = POST_CATEGORY_BY_SLUG[slug];
  if (mapped && isValidCategorySlug(mapped)) return mapped;
  return undefined;
}

export function resolveCategorySlug(slug: string, legacyCategory?: string): string | undefined {
  const bySlug = getPostCategoryBySlug(slug);
  if (bySlug) return bySlug;
  if (legacyCategory && LEGACY_CATEGORY_MAP[legacyCategory]) {
    return LEGACY_CATEGORY_MAP[legacyCategory];
  }
  if (legacyCategory && isValidCategorySlug(legacyCategory)) return legacyCategory;
  return undefined;
}
