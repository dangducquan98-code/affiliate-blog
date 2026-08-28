export function isValidAffiliateUrl(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed) return true;
  try {
    const host = new URL(trimmed).hostname.toLowerCase();
    return host.includes('shopee');
  } catch {
    return false;
  }
}

export function affiliateUrlError(url: string): string | null {
  if (!url.trim()) return null;
  return isValidAffiliateUrl(url) ? null : 'URL phải là link Shopee (vd. s.shopee.vn).';
}
