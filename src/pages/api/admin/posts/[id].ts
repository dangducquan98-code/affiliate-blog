import type { APIRoute } from 'astro';
import { requireAdmin } from '../../../../lib/admin-auth';
import { parsePostPayload } from '../../../../lib/admin-posts';
import { createServiceClient, isSupabaseServiceConfigured } from '../../../../lib/supabase';

export const prerender = false;

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
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
    const { data, error } = await client
      .from('posts')
      .update({ published: Boolean(body.published) })
      .eq('id', id)
      .select('*')
      .single();
    if (error) return json({ error: error.message }, 500);
    return json({ post: data });
  }

  const parsed = parsePostPayload(body);
  if (parsed.error || !parsed.data) return json({ error: parsed.error || 'Invalid payload' }, 400);

  const { data, error } = await client
    .from('posts')
    .update(parsed.data)
    .eq('id', id)
    .select('*')
    .single();

  if (error) return json({ error: error.message }, 500);
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
