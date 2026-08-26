import type { APIRoute } from 'astro';
import { listPublishedPosts } from '../lib/posts';
import { getSiteUrl } from '../lib/site';

export const prerender = false;

function xmlEscape(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export const GET: APIRoute = async () => {
  const site = getSiteUrl().replace(/\/$/, '');
  const staticPaths = ['/', '/blog', '/deals', '/about'];
  const { posts } = await listPublishedPosts();

  const urls = [
    ...staticPaths.map((path) => ({
      loc: `${site}${path === '/' ? '' : path}`,
      lastmod: undefined as string | undefined,
    })),
    ...posts.map((post) => ({
      loc: `${site}/blog/${post.slug}`,
      lastmod: post.updated_at,
    })),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map((entry) => {
    const lastmod = entry.lastmod
      ? `\n    <lastmod>${xmlEscape(new Date(entry.lastmod).toISOString())}</lastmod>`
      : '';
    return `  <url>\n    <loc>${xmlEscape(entry.loc)}</loc>${lastmod}\n  </url>`;
  })
  .join('\n')}
</urlset>
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  });
};
