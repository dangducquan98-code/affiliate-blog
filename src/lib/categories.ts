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
      'Hook, kịch bản, SEO mô tả và hậu trường làm video ngắn — từ 0 đến ra content đều đặn.',
  },
  {
    slug: 'affiliate',
    label: 'Affiliate & Kiếm tiền',
    description:
      'Mindset, sai lầm thường gặp và lộ trình bắt đầu kiếm tiền affiliate bền vững.',
  },
  {
    slug: 'review-gear',
    label: 'Review Gear',
    description: 'Đồ quay, mic, đèn và phụ kiện đáng tiền cho creator — review thật tay.',
  },
  {
    slug: 'ai-cong-cu',
    label: 'AI & Công cụ',
    description: 'Công cụ AI và workflow giúp làm content nhanh hơn mà vẫn giữ chất lượng.',
  },
  {
    slug: 'deal',
    label: 'Deal / mua sắm',
    description: 'Deal Shopee và gợi ý mua sắm đáng tiền — cập nhật khi có deal mới.',
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
