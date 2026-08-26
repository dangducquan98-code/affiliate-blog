import type { APIRoute } from 'astro';
import { requireAdmin } from '../../../lib/admin-auth';
import { parseProductPayload } from '../../../lib/products';
import { isMissingProductsTableError } from '../../../lib/products';
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

  const { data, error } = await client.from('products').select('*').order('name', { ascending: true });
  if (error) {
    if (isMissingProductsTableError(error.message)) {
      return json(
        {
          error:
            'Bảng products chưa tồn tại. Chạy migration supabase/migrations/20260826_products.sql.',
          tableMissing: true,
          products: [],
        },
        503,
      );
    }
    return json({ error: error.message }, 500);
  }
  return json({ products: data ?? [] });
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

  const parsed = parseProductPayload(body);
  if (parsed.error || !parsed.data) return json({ error: parsed.error || 'Invalid payload' }, 400);

  const { data, error } = await client.from('products').insert(parsed.data).select('*').single();
  if (error) {
    if (isMissingProductsTableError(error.message)) {
      return json(
        {
          error:
            'Bảng products chưa tồn tại. Chạy migration supabase/migrations/20260826_products.sql.',
          tableMissing: true,
        },
        503,
      );
    }
    return json({ error: error.message }, 500);
  }
  return json({ product: data }, 201);
};
