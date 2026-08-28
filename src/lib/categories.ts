/** Shared post categories (content pillars) — blog, admin, sitemap. */

export type Category = {
  slug: string;
  label: string;
  description: string;
};

export const CATEGORIES: readonly Category[] = [
  {
    slug: 'mmo',
    label: 'MMO — Kiếm tiền online',
    description:
      'Lộ trình và bài học thực chiến về kiếm thêm thu nhập online — affiliate TikTok/Shopee, passive income, side project. Từ góc người đang làm kênh ~4K, có checklist và sai lầm thật.',
  },
  {
    slug: 'tu-duy',
    label: 'Phát triển tư duy',
    description:
      'Góc nhìn Stoic, mindset, thói quen, tự vấn — viết chân thật như podcast Kiu Kể Lể. Giá trị đọc độc lập, không motivational sáo.',
  },
  {
    slug: 'tai-chinh',
    label: 'Tài chính cá nhân',
    description:
      'Cách nghĩ và thực hành về tiền cá nhân: ngân sách, quỹ dự phòng, thu nhập phụ — góc người trẻ/văn phòng, không flex. Không phải tư vấn đầu tư chuyên nghiệp.',
  },
  {
    slug: 'review-sach',
    label: 'Review sách',
    description:
      'Tóm tắt sách đã đọc, bài học rút ra, ai nên/không nên đọc — kiểu “mình đọc xong thấy X, áp dụng Y”. Phần giá trị đứng được khi bỏ link.',
  },
  {
    slug: 'cong-nghe',
    label: 'Công nghệ & Công cụ',
    description:
      'Review hands-on mic, đèn, tripod, AI TTS, app — điều kiện dùng thật, ưng/không ưng, so sánh giá mềm. Content-first; link sau phần giá trị.',
  },
  {
    slug: 'trai-nghiem',
    label: 'Trải nghiệm & Đời sống',
    description:
      'Mẩu đời thật — công việc, gia đình, burnout, quyết định cá nhân — viết như nhật ký có chủ đích. Hầu như không affiliate.',
  },
] as const;

export const DEFAULT_CATEGORY_SLUG = 'mmo';

/** Old category slugs → redirect target (301). `/deals` is not a pillar. */
export const LEGACY_CATEGORY_REDIRECTS: Readonly<Record<string, string>> = {
  'lam-tiktok': '/category/mmo',
  affiliate: '/category/mmo',
  'review-gear': '/category/cong-nghe',
  'ai-cong-cu': '/category/cong-nghe',
  deal: '/deals',
};

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

export function getLegacyCategoryRedirect(slug: string): string | undefined {
  return LEGACY_CATEGORY_REDIRECTS[slug];
}

/** Options for admin <select> — same source as public routes. */
export function categorySelectOptions(): { value: string; label: string }[] {
  return CATEGORIES.map((c) => ({ value: c.slug, label: c.label }));
}
