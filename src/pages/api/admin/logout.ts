import type { APIRoute } from 'astro';
import { clearAdminSessionCookie } from '../../../lib/admin-auth';

export const prerender = false;

export const POST: APIRoute = async ({ cookies, redirect }) => {
  clearAdminSessionCookie(cookies);
  return redirect('/admin/login');
};
