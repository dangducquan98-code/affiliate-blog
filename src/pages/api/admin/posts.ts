import type { APIRoute } from 'astro';
import { requireAdmin } from '../../../lib/admin-auth';
import { parsePostPayload } from '../../../lib/admin-posts';
import { createServiceClient, isSupabaseServiceConfigured } from '../../../lib/supabase';

export const prerender = false;

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const GET: APIRoute = async ({ cookies }) => {
  if (!requireAdmin(cookies)) return json({ error: 'Unauthorized' }, 401);
  if (!isSupabaseServiceConfigured()) {
    return json({ error: 'Supabase service role chưa cấu hình.' }, 503);
  }

  const client = createServiceClient();
  if (!client) return json({ error: 'Không tạo được service client.' }, 503);

  const { data, error } = await client
    .from('posts')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) return json({ error: error.message }, 500);
  return json({ posts: data ?? [] });
};

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!requireAdmin(cookies)) return json({ error: 'Unauthorized' }, 401);
  if (!isSupabaseServiceConfigured()) {
    return json({ error: 'Supabase service role chưa cấu hình.' }, 503);
  }

  const client = createServiceClient();
  if (!client) return json({ error: 'Không tạo được service client.' }, 503);

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return json({ error: 'Invalid JSON' }, 400);

  const parsed = parsePostPayload(body);
  if (parsed.error || !parsed.data) return json({ error: parsed.error || 'Invalid payload' }, 400);

  const { data, error } = await client
    .from('posts')
    .insert(parsed.data)
    .select('*')
    .single();

  if (error) return json({ error: error.message }, 500);
  return json({ post: data }, 201);
};
