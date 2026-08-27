import type { APIRoute } from 'astro';
import { logGoClickFromRequest } from '../../lib/click-events';
import { resolveGoDestination } from '../../lib/go-resolve';

export const prerender = false;

export const GET: APIRoute = async ({ params, request, url }) => {
  const slug = params.slug ?? '';
  const result = await resolveGoDestination(slug);
  if (!result.ok) {
    return new Response(result.message, {
      status: result.status,
      headers: { 'Cache-Control': 'no-store' },
    });
  }

  // Fire-and-forget — never block redirect on analytics
  logGoClickFromRequest(slug, url, request.headers);

  return new Response(null, {
    status: 302,
    headers: {
      Location: result.destination,
      'Cache-Control': 'no-store',
    },
  });
};
