/** Top progress bar for same-origin /admin navigations (MPA). */

export function initAdminNavigation(): void {
  const progress = document.getElementById('admin-nav-progress');
  const root = document.querySelector('.admin-app, .admin-login-page');
  let navigating = false;

  function startNavigation(): void {
    if (navigating) return;
    navigating = true;
    progress?.removeAttribute('hidden');
    progress?.classList.add('is-active');
    root?.classList.add('is-navigating');
    root?.setAttribute('aria-busy', 'true');
    document.body.classList.add('admin-navigating');
  }

  function endNavigation(): void {
    navigating = false;
    progress?.classList.remove('is-active');
    progress?.setAttribute('hidden', '');
    root?.classList.remove('is-navigating');
    root?.removeAttribute('aria-busy');
    document.body.classList.remove('admin-navigating');
  }

  function shouldHandleLink(anchor: HTMLAnchorElement, event: MouseEvent): boolean {
    if (anchor.target === '_blank' || event.defaultPrevented) return false;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
    const href = anchor.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:'))
      return false;
    let url: URL;
    try {
      url = new URL(href, window.location.href);
    } catch {
      return false;
    }
    if (url.origin !== window.location.origin) return false;
    if (!url.pathname.startsWith('/admin')) return false;
    if (url.pathname === window.location.pathname && url.search === window.location.search) return false;
    return true;
  }

  document.addEventListener(
    'click',
    (event) => {
      const anchor = (event.target as HTMLElement | null)?.closest('a[href]');
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (!shouldHandleLink(anchor, event)) return;
      startNavigation();
    },
    true,
  );

  document.addEventListener('submit', (event) => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;
    const action = form.getAttribute('action') || window.location.pathname;
    if (!action.includes('/admin') && !action.includes('/api/admin/logout')) return;
    startNavigation();
  });

  window.addEventListener('pageshow', endNavigation);
  window.addEventListener('pagehide', startNavigation);
}
