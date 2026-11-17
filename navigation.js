/* One owner for in-page navigation. No scroll observers, polling or retries. */
(() => {
  'use strict';
  const initialHash = location.hash;
  const initialUrl = location.pathname + location.search;
  let userMoved = false;

  // Chrome can keep returning to a native fragment while large images load.
  // Restore the URL with history, then position once, rather than leaving a
  // pending browser fragment scroll competing with the visitor's scrolling.
  if (initialHash) history.replaceState(history.state, '', initialUrl);
  const markMoved = () => { userMoved = true; };
  window.addEventListener('wheel', markMoved, { passive: true, once: true });
  window.addEventListener('touchstart', markMoved, { passive: true, once: true });
  window.addEventListener('pointerdown', markMoved, { passive: true, once: true });
  window.addEventListener('keydown', markMoved, { once: true });

  function targetFor(hash) {
    try { return document.getElementById(decodeURIComponent(hash.slice(1))); }
    catch { return null; }
  }

  function position(target) {
    // Instant section jumps cannot fight subsequent wheel/touch input.
    target.scrollIntoView({ behavior: 'instant', block: 'start' });
  }

  document.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey ||
        event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
    if (!link || link.hasAttribute('download') ||
        (link.target && link.target !== '_self')) return;
    const url = new URL(link.href, location.href);
    if (url.origin !== location.origin || url.pathname !== location.pathname ||
        url.search !== location.search || !url.hash) return;
    const target = targetFor(url.hash);
    if (!target) return;
    userMoved = true;
    event.preventDefault();
    // Let the menu's own React handler update its state instead of removing
    // classes behind React's back. Do not intercept external enquiry links.
    const menu = document.querySelector('.menu-button[aria-expanded="true"]');
    if (menu) menu.click();
    if (location.hash !== url.hash) history.pushState(history.state, '', url.hash);
    position(target);
    if (link.classList.contains('skip')) {
      const previous = target.getAttribute('tabindex');
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      target.addEventListener('blur', () => {
        if (previous === null) target.removeAttribute('tabindex');
        else target.setAttribute('tabindex', previous);
      }, { once: true });
    }
  }, true);

  document.addEventListener('DOMContentLoaded', () => {
    if (!initialHash || location.pathname + location.search !== initialUrl || location.hash) return;
    history.replaceState(history.state, '', initialUrl + initialHash);
    const target = targetFor(initialHash);
    if (target && !userMoved) position(target);
  }, { once: true });
})();
