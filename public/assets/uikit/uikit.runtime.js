(() => {
  const root = document.documentElement;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  const resolveEl = (input) => {
    if (!input) return null;
    if (input instanceof Element) return input;
    if (typeof input === 'string') return document.querySelector(input);
    return null;
  };

  const isVisible = (el) => {
    if (!el) return false;
    if (el.hidden) return false;
    return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
  };

  const setActivePill = (nav, target) => {
    const navEl = resolveEl(nav) || document;
    const pills = navEl.querySelectorAll('.ui-pill, .pill-nav__pill, [data-pill]');
    let targetEl = resolveEl(target);
    if (!targetEl && typeof target === 'string') {
      targetEl = navEl.querySelector(`[data-pill="${target}"]`) || navEl.querySelector(`[data-go-view="${target}"]`);
    }
    pills.forEach((pill) => {
      pill.classList.toggle('active', pill === targetEl);
    });
    return targetEl;
  };

  const transitionSection = (from, to, options = {}) => {
    const fromEl = resolveEl(from);
    const toEl = resolveEl(to);
    if (!toEl) return;

    const duration = Math.min(220, Math.max(150, Number(options.duration) || 180));
    const offset = Number(options.offset) || 8;
    const easing = options.easing || 'cubic-bezier(0.2, 0.8, 0.2, 1)';

    if (prefersReduced.matches) {
      if (fromEl) fromEl.hidden = true;
      toEl.hidden = false;
      return;
    }

    if (toEl.hidden) toEl.hidden = false;

    const inAnim = toEl.animate(
      [
        { opacity: 0, transform: `translateY(${offset}px)` },
        { opacity: 1, transform: 'translateY(0)' },
      ],
      { duration, easing, fill: 'both' }
    );

    let outAnim = null;
    if (fromEl && fromEl !== toEl) {
      outAnim = fromEl.animate(
        [
          { opacity: 1, transform: 'translateY(0)' },
          { opacity: 0, transform: `translateY(-${offset}px)` },
        ],
        { duration, easing, fill: 'both' }
      );
    }

    const cleanup = () => {
      if (fromEl && fromEl !== toEl) {
        fromEl.hidden = true;
        fromEl.style.opacity = '';
        fromEl.style.transform = '';
      }
      toEl.style.opacity = '';
      toEl.style.transform = '';
    };

    inAnim.onfinish = cleanup;
    if (outAnim) outAnim.onfinish = cleanup;
  };

  const ensureFabSafeArea = (options = {}) => {
    const fabSelector = options.fabSelector || '.ui-fab, .fab-safe';
    const safeDefault = getComputedStyle(root).getPropertyValue('--ui-fab-safe-default').trim() || '72px';

    const update = () => {
      const fab = document.querySelector(fabSelector);
      const hasFab = isVisible(fab);
      root.style.setProperty('--ui-fab-safe', hasFab ? safeDefault : '0px');
    };

    update();
    window.addEventListener('resize', update);
    return update;
  };

  window.UIKit = window.UIKit || {};
  window.UIKit.setActivePill = setActivePill;
  window.UIKit.transitionSection = transitionSection;
  window.UIKit.ensureFabSafeArea = ensureFabSafeArea;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ensureFabSafeArea());
  } else {
    ensureFabSafeArea();
  }
})();
