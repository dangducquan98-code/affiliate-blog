import { getAffiliate, resolveAffiliateUrl, slugToEnvKey } from './affiliates';
import { getProductBySlug } from './products';

export type GoResolveResult =
  | { ok: true; destination: string }
  | { ok: false; status: 400 | 404 | 500; message: string };

/**
 * Resolve /go/<slug> destination:
 * 1. products.affiliate_url from DB (if table exists and URL non-empty)
 * 2. Fallback AFFILIATE_<SLUG> env
 * 3. 404 if no metadata (DB row or YAML); 500 if metadata but no URL
 *
 * When products table is missing, skips DB and uses env/YAML only (no crash).
 */
export async function resolveGoDestination(slug: string | undefined): Promise<GoResolveResult> {
  if (!slug) {
    return { ok: false, status: 400, message: 'Missing slug' };
  }

  const { product, tableMissing } = await getProductBySlug(slug);
  const dbUrl = product?.affiliate_url?.trim() || null;
  if (dbUrl) {
    return { ok: true, destination: dbUrl };
  }

  const envUrl = resolveAffiliateUrl(slug);
  if (envUrl) {
    return { ok: true, destination: envUrl };
  }

  const yamlAffiliate = getAffiliate(slug);
  const hasMetadata = Boolean(product) || Boolean(yamlAffiliate);

  if (!hasMetadata) {
    // Table missing: still 404 for unknown slugs (same as before for YAML-only world)
    void tableMissing;
    return { ok: false, status: 404, message: 'Affiliate not found' };
  }

  const key = slugToEnvKey(slug);
  return {
    ok: false,
    status: 500,
    message: `Missing destination for ${slug}. Set affiliate_url in admin products or ${key} in .env.local`,
  };
}
