import type { APIRoute } from 'astro';
import { requireAdmin } from '../../../../lib/admin-auth';
import { normalizeStoredProducts, parsePostPayload } from '../../../../lib/admin-posts';
import { rejectIfMissingAffiliateUrls } from '../../../../lib/publish-affiliate-check';
import { createServiceClient, isSupabaseServiceConfigured } from '../../../../lib/supabase';

export const prerender = false;

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

export const GET: APIRoute = async ({ params, cookies }) => {
  if (!requireAdmin(cookies)) return json({ error: 'Unauthorized' }, 401);
  const id = params.id;
  if (!id) return json({ error: 'Missing id' }, 400);
  if (!isSupabaseServiceConfigured()) {
    return json({ error: 'Supabase service role chưa cấu hình.' }, 503);
  }

  const client = createServiceClient();
  if (!client) return json({ error: 'Không tạo được service client.' }, 503);

  const { data, error } = await client.from('posts').select('*').eq('id', id).maybeSingle();
  if (error) return json({ error: error.message }, 500);
  if (!data) return json({ error: 'Not found' }, 404);
  return json({ post: data });
};

export const PUT: APIRoute = async ({ params, request, cookies }) => {
  if (!requireAdmin(cookies)) return json({ error: 'Unauthorized' }, 401);
  const id = params.id;
  if (!id) return json({ error: 'Missing id' }, 400);
  if (!isSupabaseServiceConfigured()) {
    return json({ error: 'Supabase service role chưa cấu hình.' }, 503);
  }

  const client = createServiceClient();
  if (!client) return json({ error: 'Không tạo được service client.' }, 503);

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return json({ error: 'Invalid JSON' }, 400);

  // Allow publish-only toggle
  if (Object.keys(body).length === 1 && 'published' in body) {
    const wantPublish = Boolean(body.published);
    if (wantPublish) {
      const { data: existing, error: loadErr } = await client
        .from('posts')
        .select('products')
        .eq('id', id)
        .maybeSingle();
      if (loadErr) return json({ error: loadErr.message }, 500);
      if (!existing) return json({ error: 'Not found' }, 404);
      const products = normalizeStoredProducts(
        Array.isArray(existing.products) ? existing.products : [],
      );
      const blocked = await rejectIfMissingAffiliateUrls(client, products);
      if (blocked) return blocked;
    }

    const { data, error } = await client
      .from('posts')
      .update({ published: wantPublish })
      .eq('id', id)
      .select('*')
      .single();
    if (error) return json({ error: error.message }, 500);
    return json({ post: data });
  }

  const parsed = parsePostPayload(body);
  if (parsed.error || !parsed.data) return json({ error: parsed.error || 'Invalid payload' }, 400);

  if (parsed.data.published) {
    const blocked = await rejectIfMissingAffiliateUrls(client, parsed.data.products);
    if (blocked) return blocked;
  }

  const { data: clash } = await client
    .from('posts')
    .select('id')
    .eq('slug', parsed.data.slug)
    .neq('id', id)
    .maybeSingle();
  if (clash) {
    return json(
      { error: `Slug "${parsed.data.slug}" đã được bài khác dùng. Chọn slug khác.` },
      409,
    );
  }

  const { data, error } = await client
    .from('posts')
    .update(parsed.data)
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    if (error.code === '23505' || /duplicate|unique/i.test(error.message)) {
      return json(
        { error: `Slug "${parsed.data.slug}" đã tồn tại. Chọn slug khác.` },
        409,
      );
    }
    return json({ error: error.message }, 500);
  }
  return json({ post: data });
};

export const DELETE: APIRoute = async ({ params, cookies }) => {
  if (!requireAdmin(cookies)) return json({ error: 'Unauthorized' }, 401);
  const id = params.id;
  if (!id) return json({ error: 'Missing id' }, 400);
  if (!isSupabaseServiceConfigured()) {
    return json({ error: 'Supabase service role chưa cấu hình.' }, 503);
  }

  const client = createServiceClient();
  if (!client) return json({ error: 'Không tạo được service client.' }, 503);

  const { error } = await client.from('posts').delete().eq('id', id);
  if (error) return json({ error: error.message }, 500);
  return json({ ok: true });
};
