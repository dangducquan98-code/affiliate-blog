import type { APIRoute } from 'astro';
import {
  clearAdminSessionCookie,
  isAdminPasswordValid,
  setAdminSessionCookie,
} from '../../../lib/admin-auth';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  let password = '';
  const contentType = request.headers.get('content-type') || '';

  if (contentType.includes('application/json')) {
    const body = (await request.json().catch(() => null)) as { password?: string } | null;
    password = body?.password?.trim() || '';
  } else {
    const form = await request.formData();
    password = String(form.get('password') || '').trim();
  }

  if (!isAdminPasswordValid(password)) {
    return new Response(JSON.stringify({ ok: false, error: 'Mật khẩu không đúng.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  setAdminSessionCookie(cookies);
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const DELETE: APIRoute = async ({ cookies }) => {
  clearAdminSessionCookie(cookies);
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
