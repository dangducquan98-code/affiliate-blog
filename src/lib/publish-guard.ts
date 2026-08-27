import { productSlugOf, type PostProduct } from './admin-posts';

export type CatalogAffiliateRow = {
  slug: string;
  name: string;
  affiliate_url: string | null;
};

export type MissingAffiliateProduct = {
  slug: string;
  name: string;
};

/** Products attached to a post that have no usable affiliate_url. */
export function findMissingAffiliateProducts(
  products: PostProduct[],
  catalog: Map<string, CatalogAffiliateRow>,
): MissingAffiliateProduct[] {
  const missing: MissingAffiliateProduct[] = [];
  for (const item of products) {
    const slug = productSlugOf(item);
    if (!slug) continue;
    const row = catalog.get(slug);
    const url = row?.affiliate_url?.trim() || '';
    if (!url) {
      missing.push({
        slug,
        name: row?.name?.trim() || slug,
      });
    }
  }
  return missing;
}

export function missingAffiliateErrorMessage(missing: MissingAffiliateProduct[]): string {
  if (missing.length === 0) return '';
  if (missing.length === 1) {
    return `Sản phẩm ${missing[0]!.name} chưa có link affiliate`;
  }
  const names = missing.map((m) => m.name).join(', ');
  return `Sản phẩm chưa có link affiliate: ${names}`;
}
