import { initNavigationProgress } from './navigation-progress';

/** Public site: blog, categories, deals, /go, etc. (not /admin). */
export function initSiteNavigation(): void {
  initNavigationProgress({
    progressId: 'site-nav-progress',
    navigatingBodyClass: 'site-navigating',
    rootSelector: '.site-wrap',
    matchPathname: (pathname) => !pathname.startsWith('/admin'),
  });
}
