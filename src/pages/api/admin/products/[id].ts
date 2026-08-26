import type { APIRoute } from 'astro';
import { requireAdmin } from '../../../../lib/admin-auth';
import { isMissingProductsTableError, parseProductPayload } from '../../../../lib/products';
import { createServiceClient, isSupabaseServiceConfigured } from '../../../../lib/supabase';

export const prerender = false;

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function tableMissingResponse() {
  return json(
    {
      error:
        'Bảng products chưa tồn tại. Chạy migration supabase/migrations/20260826_products.sql.',
      tableMissing: true,
    },
    503,
  );
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

  const { data, error } = await client.from('products').select('*').eq('id', id).maybeSingle();
  if (error) {
    if (isMissingProductsTableError(error.message)) return tableMissingResponse();
    return json({ error: error.message }, 500);
  }
  if (!data) return json({ error: 'Not found' }, 404);
  return json({ product: data });
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

  const parsed = parseProductPayload(body);
  if (parsed.error || !parsed.data) return json({ error: parsed.error || 'Invalid payload' }, 400);

  const { data, error } = await client
    .from('products')
    .update(parsed.data)
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    if (isMissingProductsTableError(error.message)) return tableMissingResponse();
    return json({ error: error.message }, 500);
  }
  return json({ product: data });
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

  const { error } = await client.from('products').delete().eq('id', id);
  if (error) {
    if (isMissingProductsTableError(error.message)) return tableMissingResponse();
    return json({ error: error.message }, 500);
  }
  return json({ ok: true });
};
