/** Shared post categories — blog, admin, sitemap. */

export type Category = {
  slug: string;
  label: string;
  description: string;
};

export const CATEGORIES: readonly Category[] = [
  {
    slug: 'lam-tiktok',
    label: 'Làm TikTok',
    description:
      'Hook, kịch bản, SEO mô tả, hậu trường quay — những thứ mình vẫn làm đều trên kênh.',
  },
  {
    slug: 'affiliate',
    label: 'Affiliate & Kiếm tiền',
    description:
      'Sai lầm mình từng mắc, mindset và lộ trình bắt đầu affiliate — không hứa làm giàu nhanh.',
  },
  {
    slug: 'review-gear',
    label: 'Review Gear',
    description: 'Mic, đèn, tripod — review tay thật, nói thẳng đồ tệ và đồ đáng tiền.',
  },
  {
    slug: 'ai-cong-cu',
    label: 'AI & Công cụ',
    description: 'AI và tool giúp làm content nhanh hơn — mình dùng gì, cái nào chỉ hype.',
  },
  {
    slug: 'deal',
    label: 'Deal / mua sắm',
    description: 'Deal Shopee mình đang để ý — giá tham khảo, bạn check lại trước khi chốt.',
  },
] as const;

export const DEFAULT_CATEGORY_SLUG = 'lam-tiktok';

const bySlug = new Map(CATEGORIES.map((c) => [c.slug, c]));

export function getCategoryBySlug(slug: string): Category | undefined {
  return bySlug.get(slug);
}

export function getCategoryLabel(slug: string): string {
  return bySlug.get(slug)?.label ?? slug;
}

export function isValidCategorySlug(slug: string): boolean {
  return bySlug.has(slug);
}

/** Options for admin <select> — same source as public routes. */
export function categorySelectOptions(): { value: string; label: string }[] {
  return CATEGORIES.map((c) => ({ value: c.slug, label: c.label }));
}
