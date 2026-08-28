/** Canonical category slug per published post — single source for DB, scripts, content frontmatter. */

import { isValidCategorySlug } from './categories.ts';

export const POST_CATEGORY_BY_SLUG: Readonly<Record<string, string>> = {
  'khoa-hoc-tao-hook-diamondhook': 'lam-tiktok',
  'tong-hop-cau-hook-tiktok': 'lam-tiktok',
  'huong-dan-viet-mo-ta-video-seo': 'lam-tiktok',
  'hau-truong-1-video-30-giay': 'lam-tiktok',
  'hanh-trinh-4k-follow': 'lam-tiktok',
  'tiktok-kich-ban-quay-ngan': 'lam-tiktok',
  'tiktok-hook-3-giay': 'lam-tiktok',
  'tiktok-chon-san-pham-review': 'lam-tiktok',
  'faq-bat-dau-affiliate': 'affiliate',
  'gia-tri-truoc-ban-hang-sau': 'affiliate',
  '5-sai-lam-review': 'affiliate',
  '7-ngay-affiliate': 'affiliate',
  'lam-tiktok-affiliate-tu-0': 'affiliate',
  'huong-dan-honeygain-treo-may': 'affiliate',
  '20-mon-do-lam-video-tiktok': 'review-gear',
  'text-to-speech-ai-thu-am': 'ai-cong-cu',
};

/** Pre–5-category slugs → current slugs (fallback when slug not in POST_CATEGORY_BY_SLUG). */
export const LEGACY_CATEGORY_MAP: Readonly<Record<string, string>> = {
  'huong-dan': 'lam-tiktok',
  'hau-truong': 'lam-tiktok',
  'tiktok-money': 'lam-tiktok',
  'hanh-trinh': 'lam-tiktok',
  'sai-lam': 'affiliate',
  mindset: 'affiliate',
  faq: 'affiliate',
  sach: 'affiliate',
  'cong-cu-ai': 'ai-cong-cu',
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
