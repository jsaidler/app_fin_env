(() => {
  const getScrollElement = async (root) => {
    if (!root) return document.scrollingElement || document.documentElement;
    if (root.tagName === 'ION-CONTENT' && typeof root.getScrollElement === 'function') {
      try {
        return await root.getScrollElement();
      } catch {
        return document.scrollingElement || document.documentElement;
      }
    }
    if (typeof root.getScrollElement === 'function') {
      try {
        return await root.getScrollElement();
      } catch {
        return root;
      }
    }
    return root;
  };

  const normalizePage = (value, fallback) => {
    if (!value) return fallback;
    return value.replace('#', '').trim().toLowerCase();
  };

  const initNav = async (nav) => {
    const scope = nav.dataset.pageScope || '';
    const scrollRootSelector = nav.dataset.scrollRoot || '';
    const scrollRoot = scrollRootSelector ? document.querySelector(scrollRootSelector) : null;
    const scrollEl = await getScrollElement(scrollRoot);
    const tabs = Array.from(nav.querySelectorAll('[data-page-target]'));
    if (!tabs.length) return;

    if (scope === 'app-shell' && document.body.classList.contains('is-auth-view')) {
      const observer = new MutationObserver(() => {
        if (!document.body.classList.contains('is-auth-view')) {
          observer.disconnect();
          initNav(nav);
        }
      });
      observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
      return;
    }

    const pages = Array.from(document.querySelectorAll('[data-page]')).filter((page) => {
      if (!scope) return true;
      return page.dataset.pageScope === scope;
    });
    if (!pages.length) return;

    const scrollPositions = new Map();
    const pageMap = new Map();
    pages.forEach((page) => pageMap.set(page.dataset.page, page));

    const setActive = (pageId, options = {}) => {
      const nextId = normalizePage(pageId, tabs[0].dataset.pageTarget);
      const targetPage = pageMap.get(nextId) || pageMap.get(tabs[0].dataset.pageTarget);
      if (!targetPage) return;

      const current = pages.find((page) => page.classList.contains('is-active'));
      if (current && current !== targetPage) {
        scrollPositions.set(current.dataset.page, scrollEl.scrollTop || 0);
      }

      pages.forEach((page) => {
        const isActive = page === targetPage;
        page.classList.toggle('is-active', isActive);
        page.toggleAttribute('hidden', !isActive);
      });

      tabs.forEach((tab) => {
        const isActive = tab.dataset.pageTarget === targetPage.dataset.page;
        tab.classList.toggle('is-active', isActive);
        tab.classList.toggle('v6-pill--active', isActive);
        tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
        if (isActive) {
          tab.setAttribute('aria-current', 'page');
        } else {
          tab.removeAttribute('aria-current');
        }
      });

      if (!options.skipHash) {
        const hash = `#${targetPage.dataset.page}`;
        if (window.location.hash !== hash) {
          history.replaceState(null, '', hash);
        }
      }

      const stored = scrollPositions.get(targetPage.dataset.page) || 0;
      requestAnimationFrame(() => {
        scrollEl.scrollTop = stored;
      });
    };

    tabs.forEach((tab) => {
      tab.setAttribute('role', 'tab');
      tab.addEventListener('click', (event) => {
        event.preventDefault();
        setActive(tab.dataset.pageTarget);
      });
    });

    const initial = normalizePage(window.location.hash, tabs[0].dataset.pageTarget);
    setActive(initial, { skipHash: true });

    window.addEventListener('hashchange', () => {
      setActive(window.location.hash);
    });
  };

  const boot = () => {
    document.querySelectorAll('[data-v6-pills]').forEach((nav) => {
      initNav(nav);
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
