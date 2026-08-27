/** Parse UTM + referrer for /go click logging (pure). */

export type GoClickMeta = {
  referrer: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
};

function paramOrNull(url: URL, key: string): string | null {
  const v = url.searchParams.get(key)?.trim();
  return v ? v : null;
}

export function parseGoClickMeta(url: URL, headers: Headers): GoClickMeta {
  const referer = headers.get('referer')?.trim() || headers.get('referrer')?.trim() || '';
  return {
    referrer: referer || null,
    utm_source: paramOrNull(url, 'utm_source'),
    utm_medium: paramOrNull(url, 'utm_medium'),
    utm_campaign: paramOrNull(url, 'utm_campaign'),
  };
}
