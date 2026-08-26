import type { APIRoute } from 'astro';
import { getSiteUrl } from '../lib/site';

export const prerender = true;

export const GET: APIRoute = () => {
  const site = getSiteUrl().replace(/\/$/, '');
  const body = `User-agent: *
Allow: /

Sitemap: ${site}/sitemap.xml
`;
  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
