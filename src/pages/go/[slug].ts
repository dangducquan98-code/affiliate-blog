import type { APIRoute } from 'astro';
import { resolveGoDestination } from '../../lib/go-resolve';

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
  const result = await resolveGoDestination(params.slug);
  if (!result.ok) {
    return new Response(result.message, { status: result.status });
  }
  return Response.redirect(result.destination, 302);
};
