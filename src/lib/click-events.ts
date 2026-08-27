import { parseGoClickMeta, type GoClickMeta } from './click-meta';
import { createServiceClient, isSupabaseServiceConfigured } from './supabase';

export type GoClickEvent = GoClickMeta & { slug: string };

/**
 * Fire-and-forget insert into click_events (service role).
 * Never throws to caller — logging must not block redirect.
 */
export function logGoClick(event: GoClickEvent): void {
  void insertClickEvent(event).catch(() => {
    /* swallow — table may not exist yet */
  });
}

export async function insertClickEvent(event: GoClickEvent): Promise<void> {
  if (!isSupabaseServiceConfigured()) return;
  const client = createServiceClient();
  if (!client) return;

  const slug = event.slug.trim();
  if (!slug) return;

  await client.from('click_events').insert({
    slug,
    referrer: event.referrer,
    utm_source: event.utm_source,
    utm_medium: event.utm_medium,
    utm_campaign: event.utm_campaign,
  });
}

export function logGoClickFromRequest(slug: string, url: URL, headers: Headers): void {
  logGoClick({ slug, ...parseGoClickMeta(url, headers) });
}

export type ClickSlugCount = { slug: string; count: number };

export type ClickStats7d = {
  total: number;
  top: ClickSlugCount[];
  available: boolean;
  error: string | null;
};

/** Admin dashboard: clicks in last 7 days. */
export async function getClickStatsLast7Days(): Promise<ClickStats7d> {
  if (!isSupabaseServiceConfigured()) {
    return { total: 0, top: [], available: false, error: 'Supabase service role chưa cấu hình.' };
  }
  const client = createServiceClient();
  if (!client) {
    return { total: 0, top: [], available: false, error: 'Không tạo được service client.' };
  }

  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await client
    .from('click_events')
    .select('slug')
    .gte('created_at', since);

  if (error) {
    const missing =
      /relation .*click_events.* does not exist|Could not find the table/i.test(error.message) ||
      error.code === '42P01' ||
      error.code === 'PGRST205';
    return {
      total: 0,
      top: [],
      available: false,
      error: missing
        ? 'Bảng click_events chưa có — chạy migration 20260827_click_events.sql'
        : error.message,
    };
  }

  const counts = new Map<string, number>();
  for (const row of data ?? []) {
    const slug = String((row as { slug?: string }).slug || '').trim();
    if (!slug) continue;
    counts.set(slug, (counts.get(slug) || 0) + 1);
  }

  const top = [...counts.entries()]
    .map(([slug, count]) => ({ slug, count }))
    .sort((a, b) => b.count - a.count || a.slug.localeCompare(b.slug))
    .slice(0, 10);

  const total = [...counts.values()].reduce((sum, n) => sum + n, 0);

  return { total, top, available: true, error: null };
}
