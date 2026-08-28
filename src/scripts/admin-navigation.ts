import { initNavigationProgress } from './navigation-progress';

export function initAdminNavigation(): void {
  initNavigationProgress({
    progressId: 'admin-nav-progress',
    navigatingBodyClass: 'admin-navigating',
    rootSelector: '.admin-app, .admin-login-page',
    matchPathname: (pathname) => pathname.startsWith('/admin'),
    matchFormAction: (action) => action.includes('/admin') || action.includes('/api/admin/logout'),
  });
}
