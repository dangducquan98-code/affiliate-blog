import type { APIRoute } from 'astro';
import { requireAdmin } from '../../../lib/admin-auth';
import {
  createServiceClient,
  getPublicStorageUrl,
  isSupabaseServiceConfigured,
} from '../../../lib/supabase';

export const prerender = false;

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!requireAdmin(cookies)) return json({ error: 'Unauthorized' }, 401);
  if (!isSupabaseServiceConfigured()) {
    return json({ error: 'Supabase service role chưa cấu hình.' }, 503);
  }

  const client = createServiceClient();
  if (!client) return json({ error: 'Không tạo được service client.' }, 503);

  const form = await request.formData();
  const file = form.get('file');
  if (!(file instanceof File)) {
    return json({ error: 'Thiếu file ảnh.' }, 400);
  }

  if (!file.type.startsWith('image/')) {
    return json({ error: 'Chỉ chấp nhận file ảnh.' }, 400);
  }

  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const safeExt = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif'].includes(ext) ? ext : 'jpg';
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${safeExt}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await client.storage.from('blog-images').upload(path, buffer, {
    contentType: file.type,
    upsert: false,
  });

  if (error) return json({ error: error.message }, 500);

  const publicUrl = getPublicStorageUrl(path);
  return json({ path, url: publicUrl });
};
