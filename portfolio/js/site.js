import { initProjectMedia } from './media.js';

export function initNavigation(root = document) {
  const toggle = root.querySelector?.('[data-nav-toggle]');
  const menu = root.querySelector?.('#primary-navigation');
  const view = root.defaultView ?? root.ownerDocument?.defaultView ?? globalThis;
  const mobileQuery = view.matchMedia?.('(max-width: 47.99rem)') ?? {
    matches: true,
  };
  let stopped = false;

  if (!toggle || !menu) return () => {};

  root.documentElement?.classList?.add('js');
  toggle.setAttribute('aria-expanded', 'false');

  const setOpen = (open, { restoreFocus = false } = {}) => {
    toggle.setAttribute('aria-expanded', String(open));
    menu.hidden = !open;
    if (restoreFocus) toggle.focus?.();
  };

  const handleToggle = () => {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  };
  const handleEscape = (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false, { restoreFocus: true });
    }
  };
  const handleLink = () => setOpen(false);
  const syncViewport = () => {
    const mobile = Boolean(mobileQuery.matches);
    toggle.hidden = !mobile;
    toggle.setAttribute('aria-expanded', 'false');
    menu.hidden = mobile;
  };

  toggle.addEventListener('click', handleToggle);
  root.addEventListener?.('keydown', handleEscape);
  const links = [...(menu.querySelectorAll?.('a') ?? [])];
  links.forEach((link) => link.addEventListener('click', handleLink));
  mobileQuery.addEventListener?.('change', syncViewport);
  if (!mobileQuery.addEventListener) mobileQuery.addListener?.(syncViewport);
  syncViewport();

  return function teardownNavigation() {
    if (stopped) return;
    stopped = true;
    toggle.removeEventListener('click', handleToggle);
    root.removeEventListener?.('keydown', handleEscape);
    links.forEach((link) => link.removeEventListener('click', handleLink));
    mobileQuery.removeEventListener?.('change', syncViewport);
    if (!mobileQuery.removeEventListener) mobileQuery.removeListener?.(syncViewport);
  };
}

if (typeof document !== 'undefined') {
  initNavigation(document);
  initProjectMedia(document);
}
