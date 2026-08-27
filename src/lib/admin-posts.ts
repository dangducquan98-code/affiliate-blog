import type { Product } from './products';

/** New catalog ref stored on posts.products */
export type PostProductRef = { slug: string };

/** Legacy shape from MDX migrate / older admin saves */
export type PostProductLegacy = {
  name: string;
  priceHint: string;
  goSlug: string;
};

export type PostProduct = PostProductRef | PostProductLegacy;

export type DisplayProduct = {
  slug: string;
  name: string;
  priceHint: string;
  /** True when catalog has a non-empty affiliate_url, or legacy product (env fallback via /go). */
  hasLink: boolean;
};

export function isLegacyProduct(item: PostProduct): item is PostProductLegacy {
  return 'goSlug' in item && Boolean((item as PostProductLegacy).goSlug);
}

export function productSlugOf(item: PostProduct): string {
  if ('slug' in item && item.slug) return item.slug;
  if (isLegacyProduct(item)) return item.goSlug;
  return '';
}

export function parseProductsInput(raw: unknown): PostProduct[] {
  if (typeof raw === 'string') {
    try {
      return parseProductsInput(JSON.parse(raw));
    } catch {
      return [];
    }
  }
  if (!Array.isArray(raw)) return [];
  return normalizeStoredProducts(raw);
}

export function normalizeStoredProducts(raw: unknown[]): PostProduct[] {
  return raw
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const row = item as Record<string, unknown>;

      // New format: { slug }
      const slug = String(row.slug || '').trim();
      if (slug && !row.goSlug && !row.name) {
        return { slug } satisfies PostProductRef;
      }
      if (slug && !row.goSlug) {
        return { slug } satisfies PostProductRef;
      }

      // Legacy: { name, priceHint, goSlug }
      const name = String(row.name || '').trim();
      const priceHint = String(row.priceHint || '').trim();
      const goSlug = String(row.goSlug || '').trim();
      if (name && goSlug) {
        return { name, priceHint, goSlug } satisfies PostProductLegacy;
      }

      // Slug-only even if extra empty fields
      if (slug) return { slug } satisfies PostProductRef;
      return null;
    })
    .filter((item): item is PostProduct => item !== null);
}

/** Join catalog by slug; keep legacy display fields when present. */
export function resolveDisplayProducts(
  products: PostProduct[],
  catalog: Map<string, Product>,
): DisplayProduct[] {
  return products
    .map((item) => {
      const slug = productSlugOf(item);
      if (!slug) return null;
      const fromCatalog = catalog.get(slug);
      if (fromCatalog) {
        const url = fromCatalog.affiliate_url?.trim() ?? '';
        return {
          slug,
          name: fromCatalog.name,
          priceHint: fromCatalog.price_hint,
          hasLink: url.length > 0,
        };
      }
      if (isLegacyProduct(item)) {
        return {
          slug: item.goSlug,
          name: item.name,
          priceHint: item.priceHint,
          hasLink: true,
        };
      }
      return { slug, name: slug, priceHint: '', hasLink: false };
    })
    .filter((item): item is DisplayProduct => item !== null);
}

export function slugify(input: string): string {
  return input
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export type PostWritePayload = {
  slug: string;
  title: string;
  description: string;
  content: string;
  tags: string[];
  category: string;
  cover_image: string | null;
  products: PostProduct[];
  published: boolean;
};

export function parsePostPayload(body: Record<string, unknown>): {
  data?: PostWritePayload;
  error?: string;
} {
  const title = String(body.title || '').trim();
  const description = String(body.description || '').trim();
  const content = String(body.content || '');
  const category = String(body.category || '').trim();
  let slug = String(body.slug || '').trim();
  if (!slug && title) slug = slugify(title);

  if (!title) return { error: 'Thiếu tiêu đề.' };
  if (!slug) return { error: 'Thiếu slug.' };
  if (!description) return { error: 'Thiếu mô tả.' };
  if (!category) return { error: 'Thiếu category.' };

  const tagsRaw = body.tags;
  const tags =
    typeof tagsRaw === 'string'
      ? tagsRaw
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean)
      : Array.isArray(tagsRaw)
        ? tagsRaw.map(String).map((t) => t.trim()).filter(Boolean)
        : [];

  const cover =
    body.cover_image == null || body.cover_image === ''
      ? null
      : String(body.cover_image).trim();

  return {
    data: {
      slug,
      title,
      description,
      content,
      tags,
      category,
      cover_image: cover,
      products: parseProductsInput(body.products),
      published: Boolean(body.published),
    },
  };
}
