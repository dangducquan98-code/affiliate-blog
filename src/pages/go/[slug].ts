import type { APIRoute } from 'astro';
import { getAffiliate, resolveAffiliateUrl } from '../../lib/affiliates';

export const prerender = false;

export const GET: APIRoute = ({ params }) => {
  const slug = params.slug;
  if (!slug) {
    return new Response('Missing slug', { status: 400 });
  }

  const affiliate = getAffiliate(slug);
  if (!affiliate) {
    return new Response('Affiliate not found', { status: 404 });
  }

  const destination = resolveAffiliateUrl(slug);
  if (!destination) {
    return new Response(
      `Missing env ${slug} destination. Set AFFILIATE_* in .env.local`,
      { status: 500 },
    );
  }

  return Response.redirect(destination, 302);
};
