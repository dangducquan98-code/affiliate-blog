/** Topic clusters for internal linking + related posts (slug-based). */

export const CONTENT_CLUSTERS: readonly (readonly string[])[] = [
  // Làm TikTok craft
  [
    'tiktok-hook-3-giay',
    'tiktok-kich-ban-quay-ngan',
    'huong-dan-viet-mo-ta-video-seo',
    'tong-hop-cau-hook-tiktok',
    'hau-truong-1-video-30-giay',
    '20-mon-do-lam-video-tiktok',
    'tiktok-chon-san-pham-review',
  ],
  // Affiliate / mindset
  [
    '7-ngay-affiliate',
    'faq-bat-dau-affiliate',
    '5-sai-lam-review',
    'gia-tri-truoc-ban-hang-sau',
    'hanh-trinh-4k-follow',
    'lam-tiktok-affiliate-tu-0',
  ],
  // Blogspot / tools
  [
    'khoa-hoc-tao-hook-diamondhook',
    'text-to-speech-ai-thu-am',
    'tiktok-hook-3-giay',
    'huong-dan-viet-mo-ta-video-seo',
  ],
] as const;

/** Map legacy/misc categories → pillar slug for related browsing. */
export const CATEGORY_ALIASES: Record<string, string> = {
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

export function normalizeCategorySlug(category: string): string {
  const c = category.trim();
  return CATEGORY_ALIASES[c] || c;
}

export function clusterPeersOf(slug: string): string[] {
  const peers = new Set<string>();
  for (const cluster of CONTENT_CLUSTERS) {
    if (cluster.includes(slug)) {
      for (const s of cluster) {
        if (s !== slug) peers.add(s);
      }
    }
  }
  return [...peers];
}
