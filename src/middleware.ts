import { defineMiddleware } from 'astro:middleware';

const NO_STORE = 'no-store';
const PUBLIC_CACHE = 'public, s-maxage=120, stale-while-revalidate=300';

function isNoStorePath(pathname: string): boolean {
  return (
    pathname.startsWith('/go') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api')
  );
}

function isPublicCachePath(pathname: string): boolean {
  if (pathname === '/') return true;
  return (
    pathname.startsWith('/blog') ||
    pathname.startsWith('/category') ||
    pathname.startsWith('/categories') ||
    pathname.startsWith('/deals') ||
    pathname.startsWith('/about')
  );
}

export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();
  const { pathname } = context.url;

  if (isNoStorePath(pathname)) {
    response.headers.set('Cache-Control', NO_STORE);
    return response;
  }

  if (isPublicCachePath(pathname) && response.status === 200) {
    response.headers.set('Cache-Control', PUBLIC_CACHE);
    response.headers.set('Vercel-CDN-Cache-Control', PUBLIC_CACHE);
  }

  return response;
});
