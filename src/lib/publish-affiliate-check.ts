import type { SupabaseClient } from '@supabase/supabase-js';
import { productSlugOf, type PostProduct } from './admin-posts';
import {
  findMissingAffiliateProducts,
  missingAffiliateErrorMessage,
  type CatalogAffiliateRow,
} from './publish-guard';

/** Load catalog rows for post product slugs; return 400 Response if any lack affiliate_url. */
export async function rejectIfMissingAffiliateUrls(
  client: SupabaseClient,
  products: PostProduct[],
): Promise<Response | null> {
  const slugs = [...new Set(products.map(productSlugOf).filter(Boolean))];
  if (slugs.length === 0) return null;

  const { data, error } = await client
    .from('products')
    .select('slug, name, affiliate_url')
    .in('slug', slugs);

  if (error) {
    // If products table missing, don't block publish — env fallback still possible for /go
    if (/does not exist|PGRST205|42P01/i.test(error.message)) return null;
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const catalog = new Map<string, CatalogAffiliateRow>();
  for (const row of data ?? []) {
    const r = row as { slug: string; name: string; affiliate_url: string | null };
    catalog.set(r.slug, {
      slug: r.slug,
      name: r.name,
      affiliate_url: r.affiliate_url,
    });
  }

  // Slugs not found in catalog also count as missing URL
  for (const slug of slugs) {
    if (!catalog.has(slug)) {
      catalog.set(slug, { slug, name: slug, affiliate_url: null });
    }
  }

  const missing = findMissingAffiliateProducts(products, catalog);
  if (missing.length === 0) return null;

  return new Response(JSON.stringify({ error: missingAffiliateErrorMessage(missing) }), {
    status: 400,
    headers: { 'Content-Type': 'application/json' },
  });
}
