import type { PostProduct } from '../../posts';

export function parseProductsInput(raw: unknown): PostProduct[] {
  if (typeof raw === 'string') {
    try {
      return parseProductsInput(JSON.parse(raw));
    } catch {
      return [];
    }
  }
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => {
      if (!item || typeof item !== 'object') return null;
      const row = item as Record<string, unknown>;
      const name = String(row.name || '').trim();
      const priceHint = String(row.priceHint || '').trim();
      const goSlug = String(row.goSlug || '').trim();
      if (!name || !goSlug) return null;
      return { name, priceHint, goSlug };
    })
    .filter((item): item is PostProduct => item !== null);
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
