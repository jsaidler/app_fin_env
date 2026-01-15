const v2 = (() => {
  let tooltipDebugLayer = null;
  window.__ui = window.__ui || {
    tooltip: {
      enabled: true,
      isOpen: false,
      rect: null,
      anchorRect: null,
      lastOpenReason: '',
      lastCloseReason: ''
    },
    overlay: {
      isBlocking: false,
      blockingLevel: '',
      openOverlays: []
    },
    drawerHints: {
      enabled: false,
      isOpen: false,
      rect: null,
      anchorRect: null,
      bounds: null
    }
  };
  const formatDate = (value) => {
    if (!value) return '';
    const date = new Date(`${value}T00:00:00`);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  const toIsoDate = (date) => date.toISOString().slice(0, 10);

  const clampDate = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const getPresetRange = (preset) => {
    const today = clampDate(new Date());
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

    switch (preset) {
      case 'today':
        return { start: today, end: today };
      case 'yesterday':
        return { start: yesterday, end: yesterday };
      case 'last7':
        return { start: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6), end: today };
      case 'last30':
        return { start: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 29), end: today };
      case 'last90':
        return { start: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 89), end: today };
      case 'thisMonth':
        return { start: startOfMonth, end: endOfMonth };
      case 'lastMonth':
        return { start: startOfLastMonth, end: endOfLastMonth };
      default:
        return null;
    }
  };

  const closeInlinePanels = (except) => {
    document.querySelectorAll('[data-inline-panel].is-open').forEach((panel) => {
      if (panel === except) return;
      panel.classList.remove('is-open');
      const body = panel.querySelector('.v4-drawer__panel') || panel.querySelector('.v2-search-select__panel');
      if (body) body.hidden = true;
      const trigger = panel.querySelector('[aria-expanded="true"]');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    });
  };

  const closeActionDockMenus = () => {
    document.querySelectorAll('[data-action-dock].is-open').forEach((dock) => {
      dock.classList.remove('is-open');
      const menu = dock.querySelector('.v5-action-dock__menu');
      if (menu) menu.hidden = true;
    });
  };

  const initDateRanges = () => {
    document.querySelectorAll('[data-date-range]').forEach((container) => {
      const trigger = container.querySelector('.v2-date-range__trigger');
      const panel = container.querySelector('.v2-date-range__panel');
      const customWrap = container.querySelector('.v2-date-range__custom');
      const customTrigger = container.querySelector('.v2-date-range__custom-trigger');
      const popover = container.querySelector('ion-popover');
      const startPicker = container.querySelector('#date-range-start');
      const endPicker = container.querySelector('#date-range-end');
      const applyBtn = container.querySelector('.v2-date-range__apply');

      if (!trigger || !startPicker || !endPicker || !applyBtn) return;

      const isInline = Boolean(panel);

      const updateTrigger = (start, end) => {
        if (!start || !end) {
          if (trigger.dataset.iconOnly === 'true') {
            trigger.setAttribute('aria-label', 'Período aberto');
            const summary = container.querySelector('.v4-drawer__summary');
            if (summary) summary.textContent = 'Período aberto';
            return;
          }
          trigger.textContent = 'Período aberto';
          return;
        }
        const label = `${formatDate(start)} – ${formatDate(end)}`;
        if (trigger.dataset.iconOnly === 'true') {
          trigger.setAttribute('aria-label', label);
          const summary = container.querySelector('.v4-drawer__summary');
          if (summary) summary.textContent = label;
          return;
        }
        trigger.textContent = label;
      };

      const openPanel = () => {
        if (!panel) return;
        closeInlinePanels(container);
        panel.hidden = false;
        container.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
        requestAnimationFrame(() => {
          if (!startPicker.value || !endPicker.value) {
            const preset = getPresetRange('thisMonth');
            if (preset) {
              startPicker.value = toIsoDate(preset.start);
              endPicker.value = toIsoDate(preset.end);
            }
          }
        });
      };

      const closePanel = () => {
        if (!panel) return;
        panel.hidden = true;
        container.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
      };

      const applyRange = (startValue, endValue) => {
        const start = startValue || startPicker.value;
        const end = endValue || endPicker.value;
        updateTrigger(start, end);
        if (popover) popover.dismiss();
        if (isInline) closePanel();
      };

      if (popover) {
        popover.addEventListener('ionPopoverDidPresent', () => {
          if (!startPicker.value || !endPicker.value) {
            const preset = getPresetRange('thisMonth');
            if (preset) {
              startPicker.value = toIsoDate(preset.start);
              endPicker.value = toIsoDate(preset.end);
            }
          }
        });
      }

      container.querySelectorAll('[data-range-preset]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const preset = getPresetRange(btn.dataset.rangePreset);
          if (!preset) return;
          startPicker.value = toIsoDate(preset.start);
          endPicker.value = toIsoDate(preset.end);
        });
      });

      if (customTrigger && customWrap) {
        customTrigger.addEventListener('click', () => {
          customWrap.classList.toggle('is-collapsed');
        });
      }

      trigger.addEventListener('click', (event) => {
        if (!isInline) return;
        event.preventDefault();
        if (panel.hidden) {
          openPanel();
        } else {
          closePanel();
        }
      });

      applyBtn.addEventListener('click', () => applyRange());

      if (isInline) trigger.setAttribute('aria-expanded', 'false');
    });
  };

  const initSearchSelects = () => {
    document.querySelectorAll('[data-search-select]').forEach((container) => {
      const select = container.querySelector('select');
      const trigger = container.querySelector('.v2-search-select__trigger');
      const panel = container.querySelector('.v2-search-select__panel');
      const popover = container.querySelector('ion-popover');
      const searchbar = container.querySelector('ion-searchbar');
      const optionsWrap = container.querySelector('.v2-search-select__options');
      const empty = container.querySelector('.v2-search-select__empty');
      const loading = container.querySelector('.v2-search-select__loading');

      if (!select || !trigger || !searchbar || !optionsWrap || !empty) return;

      const isInline = Boolean(panel);
      const recentKey = `search-select-recent:${select.id || 'default'}`;

      const options = Array.from(select.options).map((opt) => ({
        value: opt.value,
        label: opt.text,
        disabled: opt.disabled
      }));

      const setTriggerLabel = () => {
        const selected = select.options[select.selectedIndex];
        const label = selected?.text || 'Selecionar';
        const summary = container.querySelector('.v4-drawer__summary');
        if (trigger.dataset.iconOnly === 'true') {
          trigger.setAttribute('aria-label', label);
          if (summary) summary.textContent = label;
          return;
        }
        trigger.textContent = label;
      };

      const saveRecent = (value) => {
        const recent = JSON.parse(localStorage.getItem(recentKey) || '[]');
        const next = [value, ...recent.filter((v) => v !== value)].slice(0, 3);
        localStorage.setItem(recentKey, JSON.stringify(next));
      };

      const getRecent = () => {
        return JSON.parse(localStorage.getItem(recentKey) || '[]');
      };

      const openPanel = () => {
        if (!panel) return;
        closeInlinePanels(container);
        panel.hidden = false;
        container.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
        searchbar.value = '';
        buildOptions();
        setTimeout(() => searchbar.setFocus(), 0);
      };

      const closePanel = () => {
        if (!panel) return;
        panel.hidden = true;
        container.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
      };

      const buildOptions = (filter = '') => {
        optionsWrap.innerHTML = '';
        const query = filter.trim().toLowerCase();
        const recent = getRecent();
        let visibleCount = 0;

        if (container.dataset.state === 'loading') {
          if (loading) loading.hidden = false;
          empty.hidden = true;
          return;
        }

        if (loading) loading.hidden = true;

        const renderOption = (opt, isRecent = false) => {
          if (opt.disabled) return;
          if (query && !opt.label.toLowerCase().includes(query)) return;
          const btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'v2-search-select__option';
          btn.dataset.value = opt.value;
          btn.textContent = isRecent ? `${opt.label} • Recente` : opt.label;
          btn.addEventListener('click', () => {
            select.value = opt.value;
            select.dispatchEvent(new Event('change', { bubbles: true }));
            saveRecent(opt.value);
            setTriggerLabel();
            if (popover) popover.dismiss();
            if (isInline) closePanel();
          });
          optionsWrap.appendChild(btn);
          visibleCount += 1;
        };

        if (!query && recent.length) {
          recent.forEach((value) => {
            const opt = options.find((item) => item.value === value);
            if (opt) renderOption(opt, true);
          });
        }

        if (container.dataset.state !== 'empty') {
          options.forEach((opt) => renderOption(opt));
        }

        empty.hidden = visibleCount > 0;
      };

      const moveActive = (direction) => {
        const items = Array.from(optionsWrap.querySelectorAll('.v2-search-select__option:not([hidden])'));
        if (!items.length) return;
        let index = items.findIndex((item) => item.classList.contains('is-active'));
        if (index === -1) index = 0;
        items.forEach((item) => item.classList.remove('is-active'));
        const nextIndex = Math.max(0, Math.min(items.length - 1, index + direction));
        items[nextIndex].classList.add('is-active');
        items[nextIndex].scrollIntoView({ block: 'nearest' });
      };

      const selectActive = () => {
        const active = optionsWrap.querySelector('.v2-search-select__option.is-active');
        if (!active) return;
        const value = active.dataset.value;
        const opt = options.find((item) => item.value === value);
        if (!opt) return;
        select.value = opt.value;
        select.dispatchEvent(new Event('change', { bubbles: true }));
        saveRecent(opt.value);
        setTriggerLabel();
        if (popover) popover.dismiss();
        if (isInline) closePanel();
      };

      if (popover) {
        popover.addEventListener('ionPopoverDidPresent', () => {
          searchbar.value = '';
          buildOptions();
          setTimeout(() => searchbar.setFocus(), 0);
        });
      }

      searchbar.addEventListener('ionInput', (ev) => buildOptions(ev.target.value || ''));
      searchbar.addEventListener('keydown', (ev) => {
        if (ev.key === 'ArrowDown') {
          ev.preventDefault();
          moveActive(1);
        } else if (ev.key === 'ArrowUp') {
          ev.preventDefault();
          moveActive(-1);
        } else if (ev.key === 'Enter') {
          ev.preventDefault();
          selectActive();
        } else if (ev.key === 'Escape') {
          if (popover) popover.dismiss();
          if (isInline) closePanel();
        }
      });

      trigger.addEventListener('click', (event) => {
        if (!isInline) return;
        event.preventDefault();
        if (panel.hidden) {
          openPanel();
        } else {
          closePanel();
        }
      });

      if (container.dataset.demoRecent) {
        try {
          localStorage.setItem(recentKey, JSON.stringify(container.dataset.demoRecent.split(',')));
        } catch {
          // Ignore localStorage failures.
        }
      }

      setTriggerLabel();
      if (isInline) trigger.setAttribute('aria-expanded', 'false');
    });
  };

  const OverlayManager = (() => {
    const levels = {
      tooltip: 1,
      popover: 2,
      modal: 3,
      drawer: 3
    };
    const registry = new Map();
    let activeLevel = 0;

    const update = () => {
      activeLevel = 0;
      registry.forEach((level) => {
        if (level > activeLevel) activeLevel = level;
      });
      document.body.dataset.overlayLevel = `${activeLevel}`;
      const openOverlays = [];
      registry.forEach((level, key) => {
        openOverlays.push({ key: key?.id || key?.tagName || 'overlay', level });
      });
      window.__ui.overlay.openOverlays = openOverlays;
      window.__ui.overlay.isBlocking = activeLevel >= levels.popover;
      window.__ui.overlay.blockingLevel = activeLevel ? `${activeLevel}` : '';
    };

    const open = (type, element) => {
      const level = levels[type] || levels.popover;
      registry.set(element || type, level);
      update();
    };

    const close = (elementOrType) => {
      registry.delete(elementOrType);
      update();
    };

    const hasActive = () => registry.size > 0;

    const isBlocked = (type) => activeLevel > (levels[type] || levels.tooltip);

    const isWithinOverlay = (node) => {
      if (!node) return false;
      const direct = node.closest?.('ion-modal, ion-popover, ion-action-sheet');
      if (direct) return true;
      const root = node.getRootNode?.();
      if (root?.host && root.host.matches?.('ion-modal, ion-popover, ion-action-sheet')) {
        return true;
      }
      for (const key of registry.keys()) {
        if (key instanceof Element && key.contains(node)) return true;
      }
      return false;
    };

    const reset = () => {
      registry.clear();
      update();
    };

    return { open, close, hasActive, isBlocked, isWithinOverlay, reset };
  })();

  const DrawerHintManager = (() => {
    const state = {
      enabled: false,
      timer: null,
      hoverTimer: null,
      hoverAnchor: null,
      anchor: null,
      active: null,
      holdDelay: 400,
      hoverDelay: 200,
      threshold: 8,
      startX: 0,
      startY: 0
    };

    const hoverEnabled = () => window.matchMedia?.('(hover: hover) and (pointer: fine)').matches;

    const setEnabled = (value) => {
      state.enabled = Boolean(value);
      if (!state.enabled) closeAll();
      window.__ui.drawerHints.enabled = state.enabled;
    };

    const closeAll = () => {
      if (state.active) {
        state.active.remove();
        state.active = null;
      }
      state.anchor = null;
      if (state.timer) clearTimeout(state.timer);
      state.timer = null;
      if (state.hoverTimer) clearTimeout(state.hoverTimer);
      state.hoverTimer = null;
      window.__ui.drawerHints.isOpen = false;
      window.__ui.drawerHints.rect = null;
      window.__ui.drawerHints.anchorRect = null;
      window.__ui.drawerHints.bounds = null;
    };

    const findAnchor = (event) => {
      const path = event.composedPath ? event.composedPath() : [event.target];
      return path.find((node) => node?.dataset?.drawerHint);
    };

    const openHint = (anchor) => {
      if (!state.enabled || !anchor) return;
      const text = anchor.getAttribute('data-drawer-hint') || '';
      const container = anchor.closest('.v4-drawer');
      if (!container || !text) return;
      closeAll();
      const hint = document.createElement('div');
      hint.className = 'drawer-hint';
      hint.textContent = text;
      container.appendChild(hint);
      const anchorRect = anchor.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const hintRect = hint.getBoundingClientRect();
      const minLeft = containerRect.left + 8;
      const maxLeft = containerRect.right - hintRect.width - 8;
      const minTop = containerRect.top + 8;
      const maxTop = containerRect.bottom - hintRect.height - 8;
      const proposedLeft = anchorRect.left;
      const proposedTop = anchorRect.bottom + 6;
      const left = Math.min(Math.max(proposedLeft, minLeft), maxLeft);
      const top = Math.min(Math.max(proposedTop, minTop), maxTop);
      hint.style.left = `${left - containerRect.left}px`;
      hint.style.top = `${top - containerRect.top}px`;
      state.active = hint;
      window.__ui.drawerHints.isOpen = true;
      window.__ui.drawerHints.rect = hint.getBoundingClientRect();
      window.__ui.drawerHints.anchorRect = anchorRect;
      window.__ui.drawerHints.bounds = containerRect;
    };

    const bind = () => {
      document.addEventListener('pointerdown', (event) => {
        const anchor = findAnchor(event);
        if (!anchor || !state.enabled) return;
        if (hoverEnabled() && event.pointerType === 'mouse') return;
        state.anchor = anchor;
        state.startX = event.clientX;
        state.startY = event.clientY;
        if (state.timer) clearTimeout(state.timer);
        state.timer = setTimeout(() => openHint(anchor), state.holdDelay);
      }, true);

      document.addEventListener('pointermove', (event) => {
        if (!state.anchor || !state.timer) return;
        const dx = event.clientX - state.startX;
        const dy = event.clientY - state.startY;
        if (Math.hypot(dx, dy) > state.threshold) closeAll();
      }, true);

      document.addEventListener('pointerup', (event) => {
        if (hoverEnabled() && event.pointerType === 'mouse' && state.hoverAnchor) return;
        closeAll();
      }, true);
      document.addEventListener('pointercancel', closeAll, true);
      document.addEventListener('scroll', closeAll, true);
      document.addEventListener('wheel', closeAll, { passive: true });
      document.addEventListener('touchmove', closeAll, { passive: true });

      document.addEventListener('pointerover', (event) => {
        if (!hoverEnabled() || event.pointerType !== 'mouse') return;
        const anchor = findAnchor(event);
        if (!anchor || !state.enabled) return;
        state.hoverAnchor = anchor;
        if (state.hoverTimer) clearTimeout(state.hoverTimer);
        state.hoverTimer = setTimeout(() => openHint(anchor), state.hoverDelay);
      }, true);

      document.addEventListener('pointerout', (event) => {
        if (!hoverEnabled() || event.pointerType !== 'mouse') return;
        const anchor = findAnchor(event);
        if (!anchor) return;
        if (state.hoverTimer) clearTimeout(state.hoverTimer);
        state.hoverTimer = null;
        if (state.anchor === anchor) closeAll();
        state.hoverAnchor = null;
      }, true);

      document.addEventListener('focusin', (event) => {
        if (!hoverEnabled() || !state.enabled) return;
        const anchor = findAnchor(event);
        if (!anchor) return;
        openHint(anchor);
      }, true);

      document.addEventListener('focusout', (event) => {
        if (!hoverEnabled()) return;
        const anchor = findAnchor(event);
        if (!anchor) return;
        closeAll();
      }, true);
    };

    return { bind, setEnabled, closeAll };
  })();

  const TooltipManager = (() => {
    const state = {
      enabled: true,
      timer: null,
      hoverTimer: null,
      hoverAnchor: null,
      anchor: null,
      bubble: null,
      portal: null,
      holdDelay: 400,
      hoverDelay: 200,
      threshold: 8,
      startX: 0,
      startY: 0
    };

    const hoverEnabled = () => window.matchMedia?.('(hover: hover) and (pointer: fine)').matches;

    const getVar = (name, fallback = 0) => {
      const value = parseFloat(getComputedStyle(document.documentElement).getPropertyValue(name));
      return Number.isFinite(value) ? value : fallback;
    };

    const safeArea = () => ({
      top: getVar('--safe-top', 0),
      right: getVar('--safe-right', 0),
      bottom: getVar('--safe-bottom', 0),
      left: getVar('--safe-left', 0)
    });

    const getViewport = () => {
      if (window.visualViewport) {
        return {
          width: window.visualViewport.width,
          height: window.visualViewport.height,
          offsetLeft: window.visualViewport.offsetLeft,
          offsetTop: window.visualViewport.offsetTop
        };
      }
      return { width: window.innerWidth, height: window.innerHeight, offsetLeft: 0, offsetTop: 0 };
    };

    const ensurePortal = () => {
      if (!state.portal) {
        state.portal = document.getElementById('tooltip-portal');
        if (!state.portal) {
          state.portal = document.createElement('div');
          state.portal.id = 'tooltip-portal';
          state.portal.className = 'tooltip-portal';
          document.body.appendChild(state.portal);
        }
      }
      if (!state.bubble) {
        state.bubble = document.createElement('div');
        state.bubble.className = 'tooltip-bubble';
        state.portal.appendChild(state.bubble);
      }
    };

    const drawDebug = (triggerRect, contentRect, left, top) => {
      if (!tooltipDebugLayer) return;
      const anchorX = triggerRect.left + triggerRect.width / 2;
      const anchorY = triggerRect.top + triggerRect.height / 2;
      const tooltipX = left + contentRect.width / 2;
      const tooltipY = top + contentRect.height / 2;
      tooltipDebugLayer.innerHTML = `
        <rect x="${left}" y="${top}" width="${contentRect.width}" height="${contentRect.height}" fill="none" stroke="rgba(255,255,255,0.6)" stroke-dasharray="4 4"></rect>
        <line x1="${anchorX}" y1="${anchorY}" x2="${tooltipX}" y2="${tooltipY}" stroke="rgba(0,151,255,0.8)" stroke-width="1"></line>
        <circle cx="${anchorX}" cy="${anchorY}" r="2" fill="rgba(255,255,255,0.9)"></circle>
        <circle cx="${tooltipX}" cy="${tooltipY}" r="2" fill="rgba(0,151,255,0.9)"></circle>
      `;
    };

    const position = (anchor) => {
      if (!state.bubble || !anchor) return;
      const triggerRect = anchor.getBoundingClientRect();
      const contentRect = state.bubble.getBoundingClientRect();
      const safe = safeArea();
      const viewport = getViewport();
      const gap = getVar('--space-2', 8);
      const margin = getVar('--space-3', 12);

      const minX = viewport.offsetLeft + safe.left + margin;
      const maxX = viewport.offsetLeft + viewport.width - safe.right - margin;
      const minY = viewport.offsetTop + safe.top + margin;
      const maxY = viewport.offsetTop + viewport.height - safe.bottom - margin;

      const centerX = triggerRect.left + triggerRect.width / 2;
      const centerY = triggerRect.top + triggerRect.height / 2;

      const placements = [
        { top: triggerRect.top - contentRect.height - gap, left: centerX - contentRect.width / 2 },
        { top: triggerRect.bottom + gap, left: centerX - contentRect.width / 2 },
        { top: centerY - contentRect.height / 2, left: triggerRect.left - contentRect.width - gap },
        { top: centerY - contentRect.height / 2, left: triggerRect.right + gap }
      ];

      const pick = placements.find((placement) => (
        placement.left >= minX &&
        placement.top >= minY &&
        placement.left + contentRect.width <= maxX &&
        placement.top + contentRect.height <= maxY
      )) || placements[0];

      const clampedLeft = Math.min(Math.max(pick.left, minX), maxX - contentRect.width);
      const clampedTop = Math.min(Math.max(pick.top, minY), maxY - contentRect.height);

      state.bubble.style.left = `${clampedLeft}px`;
      state.bubble.style.top = `${clampedTop}px`;
      state.bubble.classList.add('is-visible');
      drawDebug(triggerRect, contentRect, clampedLeft, clampedTop);
      window.__ui.tooltip.rect = state.bubble.getBoundingClientRect();
    };

    const open = (anchor, text) => {
      if (!state.enabled) return;
      if (OverlayManager.isBlocked('tooltip') && !OverlayManager.isWithinOverlay(anchor)) return;
      ensurePortal();
      state.bubble.textContent = text || anchor.getAttribute('aria-label') || '';
      state.anchor = anchor;
      requestAnimationFrame(() => position(anchor));
      window.__ui.tooltip.isOpen = true;
      window.__ui.tooltip.anchorRect = anchor.getBoundingClientRect();
      window.__ui.tooltip.lastOpenReason = 'press-hold';
    };

    const closeAll = () => {
      if (state.bubble) state.bubble.classList.remove('is-visible');
      state.anchor = null;
      if (state.timer) clearTimeout(state.timer);
      state.timer = null;
      if (state.hoverTimer) clearTimeout(state.hoverTimer);
      state.hoverTimer = null;
      window.__ui.tooltip.isOpen = false;
      window.__ui.tooltip.rect = null;
      window.__ui.tooltip.anchorRect = null;
    };

    const findAnchor = (event) => {
      const path = event.composedPath ? event.composedPath() : [event.target];
      return path.find((node) => node?.dataset?.tooltip !== undefined);
    };

    const bind = () => {
      document.addEventListener('pointerdown', (event) => {
        const anchor = findAnchor(event);
        if (!anchor || !state.enabled) return;
        if (hoverEnabled() && event.pointerType === 'mouse') return;
        if (OverlayManager.isBlocked('tooltip') && !OverlayManager.isWithinOverlay(anchor)) return;
        state.anchor = anchor;
        state.startX = event.clientX;
        state.startY = event.clientY;
        if (state.timer) clearTimeout(state.timer);
        state.timer = setTimeout(() => open(anchor), state.holdDelay);
      }, true);

      document.addEventListener('pointermove', (event) => {
        if (!state.anchor || !state.timer) return;
        const dx = event.clientX - state.startX;
        const dy = event.clientY - state.startY;
        if (Math.hypot(dx, dy) > state.threshold) {
          window.__ui.tooltip.lastCloseReason = 'move';
          closeAll();
        }
      }, true);

      document.addEventListener('pointerup', (event) => {
        if (hoverEnabled() && event.pointerType === 'mouse' && state.hoverAnchor) return;
        window.__ui.tooltip.lastCloseReason = 'release';
        closeAll();
      }, true);
      document.addEventListener('pointercancel', () => {
        window.__ui.tooltip.lastCloseReason = 'cancel';
        closeAll();
      }, true);
      document.addEventListener('scroll', () => {
        window.__ui.tooltip.lastCloseReason = 'scroll';
        closeAll();
      }, true);
      document.addEventListener('wheel', () => {
        window.__ui.tooltip.lastCloseReason = 'scroll';
        closeAll();
      }, { passive: true });
      document.addEventListener('touchmove', () => {
        window.__ui.tooltip.lastCloseReason = 'scroll';
        closeAll();
      }, { passive: true });

      document.addEventListener('pointerover', (event) => {
        if (!hoverEnabled() || event.pointerType !== 'mouse') return;
        const anchor = findAnchor(event);
        if (!anchor || !state.enabled) return;
        if (OverlayManager.isBlocked('tooltip') && !OverlayManager.isWithinOverlay(anchor)) return;
        state.hoverAnchor = anchor;
        if (state.hoverTimer) clearTimeout(state.hoverTimer);
        state.hoverTimer = setTimeout(() => open(anchor), state.hoverDelay);
      }, true);

      document.addEventListener('pointerout', (event) => {
        if (!hoverEnabled() || event.pointerType !== 'mouse') return;
        const anchor = findAnchor(event);
        if (!anchor) return;
        if (state.hoverTimer) clearTimeout(state.hoverTimer);
        state.hoverTimer = null;
        if (state.anchor === anchor) {
          window.__ui.tooltip.lastCloseReason = 'hover-out';
          closeAll();
        }
        state.hoverAnchor = null;
      }, true);

      if (window.visualViewport) {
        window.visualViewport.addEventListener('scroll', () => {
          window.__ui.tooltip.lastCloseReason = 'scroll';
          closeAll();
        });
        window.visualViewport.addEventListener('resize', () => {
          window.__ui.tooltip.lastCloseReason = 'resize';
          closeAll();
        });
      }

      document.addEventListener('keydown', (event) => {
        if (!state.enabled) return;
        if (!hoverEnabled()) return;
        if (event.key !== 'Enter' && event.key !== ' ') return;
        const anchor = findAnchor(event);
        if (!anchor) return;
        if (OverlayManager.isBlocked('tooltip') && !OverlayManager.isWithinOverlay(anchor)) return;
        open(anchor);
      }, true);

      document.addEventListener('keyup', (event) => {
        if (event.key === 'Enter' || event.key === ' ') closeAll();
      }, true);

      document.addEventListener('focusin', (event) => {
        if (!hoverEnabled() || !state.enabled) return;
        const anchor = findAnchor(event);
        if (!anchor) return;
        if (OverlayManager.isBlocked('tooltip') && !OverlayManager.isWithinOverlay(anchor)) return;
        open(anchor);
      }, true);

      document.addEventListener('focusout', (event) => {
        if (!hoverEnabled()) return;
        const anchor = findAnchor(event);
        if (!anchor) return;
        window.__ui.tooltip.lastCloseReason = 'blur';
        closeAll();
      }, true);
    };

    const setEnabled = (value) => {
      state.enabled = Boolean(value);
      if (!state.enabled) closeAll();
      window.__ui.tooltip.enabled = state.enabled;
    };

    return { bind, open, closeAll, setEnabled };
  })();

  const initSwipeRows = () => {
    const rows = document.querySelectorAll('[data-swipe-row]');
    rows.forEach((row) => {
      let startX = 0;
      let moved = false;
      let pressTimer = null;
      const wrap = row.closest('.v5-entry-wrap');
      const context = row.querySelector('.v5-context-menu');

      const clearPress = () => {
        if (pressTimer) {
          clearTimeout(pressTimer);
          pressTimer = null;
        }
      };

      const closeContext = () => {
        if (context) context.classList.remove('is-open');
      };

      row.addEventListener('pointerdown', (event) => {
        startX = event.clientX;
        moved = false;
        clearPress();
        pressTimer = setTimeout(() => {
          if (context) context.classList.add('is-open');
        }, 520);
      });

      row.addEventListener('pointermove', (event) => {
        const deltaX = event.clientX - startX;
        if (Math.abs(deltaX) > 10) {
          moved = true;
          clearPress();
        }
      });

      row.addEventListener('pointerup', (event) => {
        clearPress();
        if (!wrap) return;
        const deltaX = event.clientX - startX;
        if (moved && deltaX < -40) {
          wrap.classList.add('is-swipe-open');
        } else if (moved && deltaX > 40) {
          wrap.classList.remove('is-swipe-open');
          closeContext();
        }
      });

      row.addEventListener('pointerleave', clearPress);
      row.addEventListener('pointercancel', clearPress);

      row.addEventListener('click', (event) => {
        if (event.target.closest('.v5-context-menu')) return;
        closeContext();
      });
    });
  };

  const initActionDock = () => {
    document.querySelectorAll('[data-action-dock]').forEach((dock) => {
      const main = dock.querySelector('[data-action-dock-main]');
      const menu = dock.querySelector('.v5-action-dock__menu');
      const setAccent = (type) => {
        if (!main) return;
        main.classList.remove('is-in', 'is-out');
        if (type === 'in') main.classList.add('is-in');
        if (type === 'out') main.classList.add('is-out');
        const label = type === 'out' ? 'Novo lançamento: Saída' : 'Novo lançamento: Entrada';
        main.setAttribute('aria-label', label);
        dock.dataset.lastAction = type;
      };

      if (dock.dataset.lastAction) setAccent(dock.dataset.lastAction);

      let pressTimer = null;
      let longPress = false;

      const clearPress = () => {
        if (pressTimer) {
          clearTimeout(pressTimer);
          pressTimer = null;
        }
      };

      const openMenu = () => {
        if (!menu) return;
        closeActionDockMenus();
        menu.hidden = false;
        dock.classList.add('is-open');
        OverlayManager.open('popover', menu);
        TooltipManager.closeAll();
      };

      const closeMenu = () => {
        if (!menu) return;
        menu.hidden = true;
        dock.classList.remove('is-open');
        OverlayManager.close(menu);
      };

      if (main) {
        main.addEventListener('pointerdown', () => {
          longPress = false;
          clearPress();
          pressTimer = setTimeout(() => {
            longPress = true;
            openMenu();
          }, 520);
        });

        main.addEventListener('pointerup', clearPress);
        main.addEventListener('pointerleave', clearPress);
        main.addEventListener('pointercancel', clearPress);

        main.addEventListener('click', (event) => {
          if (longPress) {
            event.preventDefault();
            return;
          }
          const last = dock.dataset.lastAction || 'in';
          setAccent(last);
        });
      }

      dock.querySelectorAll('[data-action-type]').forEach((button) => {
        button.addEventListener('click', () => {
          setAccent(button.dataset.actionType);
          closeMenu();
        });
      });

      document.addEventListener('click', (event) => {
        if (!event.target.closest('[data-action-dock]')) closeMenu();
      });

      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeMenu();
      });
    });
  };

  const initOverlayManager = () => {
    document.addEventListener('ionModalWillPresent', (event) => {
      OverlayManager.open('drawer', event.target);
      TooltipManager.closeAll();
      DrawerHintManager.setEnabled(true);
    });

    document.addEventListener('ionModalDidDismiss', (event) => {
      OverlayManager.close(event.target);
      if (!OverlayManager.hasActive()) {
        DrawerHintManager.setEnabled(false);
      }
    });

    document.addEventListener('ionPopoverWillPresent', (event) => {
      OverlayManager.open('popover', event.target);
      TooltipManager.closeAll();
    });

    document.addEventListener('ionPopoverDidDismiss', (event) => {
      OverlayManager.close(event.target);
    });

    document.addEventListener('ionActionSheetWillPresent', (event) => {
      OverlayManager.open('modal', event.target);
      TooltipManager.closeAll();
    });

    document.addEventListener('ionActionSheetDidDismiss', (event) => {
      OverlayManager.close(event.target);
    });
  };

  const initDebugOverlay = () => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('debug') !== '1') return;
    document.body.classList.add('is-debug');
    const overlay = document.createElement('div');
    overlay.className = 'debug-overlay';
    overlay.innerHTML = '<div class="debug-viewport"></div><div class="debug-safe"></div>';
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'debug-tooltip-layer');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    overlay.appendChild(svg);
    tooltipDebugLayer = svg;
    document.body.appendChild(overlay);
  };

  const initIonicModalBreakpoints = () => {
    document.querySelectorAll('ion-modal').forEach((modal) => {
      const raw = modal.dataset.breakpoints;
      const initial = modal.dataset.initialBreakpoint;
      if (!raw) return;
      const parsed = raw.split(',').map((val) => Number(val.trim())).filter((val) => Number.isFinite(val));
      if (!parsed.length) {
        modal.breakpoints = undefined;
        return;
      }
      modal.breakpoints = parsed;
      const initialValue = Number(initial);
      if (Number.isFinite(initialValue) && parsed.includes(initialValue)) {
        modal.initialBreakpoint = initialValue;
      } else {
        modal.initialBreakpoint = parsed[parsed.length - 1];
      }
    });
  };

  const initSelfTest = () => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('selftest') !== '1') return;

    const panel = document.getElementById('selftest-panel');
    const runButton = document.getElementById('selftest-run');
    const status = document.getElementById('selftest-status');
    const results = document.getElementById('selftest-results');
    const anchors = document.getElementById('selftest-anchors');

    if (!panel || !runButton || !status || !results || !anchors) return;

    panel.hidden = false;
    anchors.hidden = false;

    const waitFrame = () => new Promise((resolve) => requestAnimationFrame(resolve));
    const waitMs = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const getGap = (anchorRect, tooltipRect) => {
      const dx = Math.max(0, anchorRect.left - tooltipRect.right, tooltipRect.left - anchorRect.right);
      const dy = Math.max(0, anchorRect.top - tooltipRect.bottom, tooltipRect.top - anchorRect.bottom);
      return Math.max(dx, dy);
    };

    const getViewportRect = () => {
      if (window.visualViewport) {
        return {
          left: window.visualViewport.offsetLeft,
          top: window.visualViewport.offsetTop,
          right: window.visualViewport.offsetLeft + window.visualViewport.width,
          bottom: window.visualViewport.offsetTop + window.visualViewport.height
        };
      }
      return { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
    };

    const countGlobalTooltips = () => {
      return document.querySelectorAll('#tooltip-portal .tooltip-bubble.is-visible').length;
    };

    const pressHold = async (el, holdMs = 400) => {
      if (!el) return false;
      const rect = el.getBoundingClientRect();
      const down = new PointerEvent('pointerdown', {
        bubbles: true,
        pointerType: 'touch',
        clientX: rect.left + rect.width / 2,
        clientY: rect.top + rect.height / 2
      });
      el.dispatchEvent(down);
      await waitMs(holdMs);
      await waitFrame();
      return true;
    };

    const release = () => {
      const up = new PointerEvent('pointerup', { bubbles: true, pointerType: 'touch' });
      const cancel = new PointerEvent('pointercancel', { bubbles: true, pointerType: 'touch' });
      document.dispatchEvent(up);
      document.dispatchEvent(cancel);
    };

    const closeTooltips = () => {
      TooltipManager.closeAll();
      release();
    };

    const isDrawerOpen = () => {
      const modal = document.querySelector('ion-modal');
      if (!modal) return false;
      const hidden = modal.getAttribute('aria-hidden') === 'true';
      const overlayHidden = modal.getAttribute('overlay-hidden') === 'true';
      const isVisible = modal.classList.contains('show-modal') ||
        modal.getAttribute('aria-hidden') === 'false' ||
        modal.getAttribute('overlay-hidden') === 'false';
      const wrapper = modal.shadowRoot?.querySelector('.modal-wrapper');
      const wrapperVisible = wrapper ? !wrapper.hasAttribute('hidden') && wrapper.clientHeight > 0 : false;
      return (isVisible || wrapperVisible) && !hidden && !overlayHidden;
    };

    const waitForDrawerState = (state, timeoutMs = 1000) => new Promise((resolve) => {
      const targetOpen = state === 'open';
      const start = Date.now();
      const tick = () => {
        if (isDrawerOpen() === targetOpen) return resolve(true);
        if (Date.now() - start > timeoutMs) return resolve(false);
        requestAnimationFrame(tick);
      };
      tick();
    });

    const resetState = async () => {
      TooltipManager.closeAll();
      release();
      const modal = document.querySelector('ion-modal');
      if (modal && isDrawerOpen()) {
        modal.dismiss();
        await waitForDrawerState('closed', 1000);
      }
    };

    const runWithTimeout = async (fn, ms) => {
      let done = false;
      const timer = waitMs(ms).then(() => {
        if (!done) return { ok: false, reason: 'timeout' };
        return null;
      });
      const result = await Promise.race([
        fn().then((ok) => {
          done = true;
          return { ok: Boolean(ok), reason: ok ? '' : 'assert' };
        }),
        timer
      ]);
      return result || { ok: false, reason: 'timeout' };
    };

      const tests = [
        {
          id: 'T1',
          label: 'Tooltip clamp (viewport)',
          run: async () => {
            const anchors = [
              '[aria-label="Topo esquerdo"]',
              '[aria-label="Topo direito"]',
              '[aria-label="Base esquerdo"]',
              '[aria-label="Base direito"]'
            ];
            for (const selector of anchors) {
              const trigger = document.querySelector(selector);
              if (!trigger) return false;
              await pressHold(trigger);
              if (countGlobalTooltips() < 1) return false;
              const bubble = document.querySelector('#tooltip-portal .tooltip-bubble.is-visible');
              if (!bubble) return false;
              const rect = bubble.getBoundingClientRect();
              const viewport = getViewportRect();
              const within = rect.left >= viewport.left && rect.top >= viewport.top &&
                rect.right <= viewport.right && rect.bottom <= viewport.bottom;
              if (!within) return false;
              closeTooltips();
            }
            return true;
          }
        },
        {
          id: 'T2',
          label: 'Tooltip distance <= 16px',
          run: async () => {
            const trigger = document.querySelector('[aria-label="Topo esquerdo"]');
            if (!trigger) return false;
            await pressHold(trigger);
            const bubble = document.querySelector('#tooltip-portal .tooltip-bubble.is-visible');
            if (!bubble) return false;
            const gap = getGap(trigger.getBoundingClientRect(), bubble.getBoundingClientRect());
            closeTooltips();
            return gap <= 16;
          }
        },
        {
          id: 'T3',
          label: 'Overlay close (drawer closes tooltip)',
          run: async () => {
            const anchor = document.querySelector('[aria-label="Voltar"]');
            if (!anchor) return false;
            await pressHold(anchor);
            if (countGlobalTooltips() < 1) return false;
            const drawerTrigger = document.getElementById('filters-trigger-v6d');
            if (!drawerTrigger) return false;
            drawerTrigger.click();
            const opened = await waitForDrawerState('open', 1000);
            if (!opened) return false;
            const visible = countGlobalTooltips();
            return visible === 0;
          }
        },
        {
          id: 'T4',
          label: 'Overlay block (drawer blocks tooltip)',
          run: async () => {
            const trigger = document.getElementById('filters-trigger-v6d');
            if (!trigger) return false;
            trigger.click();
            const opened = await waitForDrawerState('open', 1000);
            if (!opened) return false;
            const target = document.querySelector('[aria-label="Voltar"]');
            if (!target) return false;
            const before = countGlobalTooltips();
            await pressHold(target);
            const after = countGlobalTooltips();
            const modal = document.querySelector('ion-modal');
            if (modal) {
              modal.dismiss();
              await waitForDrawerState('closed', 1000);
            }
            return after === before;
          }
        },
        {
          id: 'T5',
          label: 'Scroll closes tooltip',
          run: async () => {
            const trigger = document.querySelector('[aria-label="Voltar"]');
            if (!trigger) return false;
            await pressHold(trigger);
            if (countGlobalTooltips() < 1) return false;
            const scroller = document.querySelector('ion-content');
          if (scroller) scroller.dispatchEvent(new Event('scroll', { bubbles: true }));
          document.dispatchEvent(new Event('scroll', { bubbles: true }));
          document.dispatchEvent(new WheelEvent('wheel', { bubbles: true, deltaY: 40 }));
          try {
            const touch = new Touch({ identifier: 1, target: document.body, clientX: 10, clientY: 10 });
            const move = new TouchEvent('touchmove', { bubbles: true, touches: [touch], targetTouches: [touch], changedTouches: [touch] });
            document.dispatchEvent(move);
          } catch {
            // TouchEvent not supported in some browsers.
          }
          await waitFrame();
          const visible = countGlobalTooltips();
          return visible === 0;
          }
        },
        {
          id: 'T6',
          label: 'Drawer hints (local)',
          run: async () => {
            const trigger = document.getElementById('filters-trigger-v6d');
            if (!trigger) return false;
            trigger.click();
            const opened = await waitForDrawerState('open', 1000);
            if (!opened) return false;
            const hintAnchor = document.querySelector('[data-drawer-hint]');
            if (!hintAnchor) return false;
            await pressHold(hintAnchor);
            const hint = document.querySelector('.drawer-hint');
            if (!hint) return false;
            const hintRect = hint.getBoundingClientRect();
            const container = hint.closest('.v4-drawer');
            if (!container) return false;
            const containerRect = container.getBoundingClientRect();
            const within = hintRect.left >= containerRect.left &&
              hintRect.top >= containerRect.top &&
              hintRect.right <= containerRect.right &&
              hintRect.bottom <= containerRect.bottom;
            const modal = document.querySelector('ion-modal');
            if (modal) {
              modal.dismiss();
              await waitForDrawerState('closed', 1000);
            }
            return within;
          }
        }
      ];

      runButton.addEventListener('click', async () => {
        status.textContent = 'Executando...';
        results.innerHTML = '';
        TooltipManager.setEnabled(true);
        let allPass = true;
        for (const test of tests) {
          await resetState();
          const result = await runWithTimeout(test.run, 1500);
          const pass = result.ok;
          allPass = allPass && pass;
          const row = document.createElement('div');
          row.className = `selftest-results__item ${pass ? 'is-pass' : 'is-fail'}`;
          row.textContent = `${test.id} ${pass ? 'PASS' : 'FAIL'} - ${test.label}${pass ? '' : ` (${result.reason})`}`;
          results.appendChild(row);
        }
        status.textContent = allPass ? `PASS (viewport ${window.innerWidth}px)` : `FAIL (viewport ${window.innerWidth}px)`;
      });
  };

  const initManualTest = () => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('manualtest') !== '1') return;

    const panel = document.getElementById('manualtest-panel');
    const stepEl = document.getElementById('manualtest-step');
    const descEl = document.getElementById('manualtest-desc');
    const statusEl = document.getElementById('manualtest-status');
    const timerEl = document.getElementById('manualtest-timer');
    const startBtn = document.getElementById('manualtest-start');
    const retryBtn = document.getElementById('manualtest-retry');
    const nextBtn = document.getElementById('manualtest-next');

    if (!panel || !stepEl || !descEl || !statusEl || !timerEl || !startBtn || !retryBtn || !nextBtn) return;

    panel.hidden = false;

    const getViewportRect = () => {
      if (window.visualViewport) {
        return {
          left: window.visualViewport.offsetLeft,
          top: window.visualViewport.offsetTop,
          right: window.visualViewport.offsetLeft + window.visualViewport.width,
          bottom: window.visualViewport.offsetTop + window.visualViewport.height
        };
      }
      return { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
    };

    const getGap = (anchorRect, tooltipRect) => {
      const dx = Math.max(0, anchorRect.left - tooltipRect.right, tooltipRect.left - anchorRect.right);
      const dy = Math.max(0, anchorRect.top - tooltipRect.bottom, tooltipRect.top - anchorRect.bottom);
      return Math.max(dx, dy);
    };

    const steps = [
      {
        id: 'T1',
        desc: 'Pressione e segure no ícone de Ajuda no topo direito até o tooltip aparecer. Mantenha por 1s.',
        validate: () => {
          const ui = window.__ui;
          if (!ui?.tooltip?.isOpen) return { ok: false, reason: 'tooltip não abriu' };
          const rect = ui.tooltip.rect;
          const viewport = getViewportRect();
          if (!rect) return { ok: false, reason: 'tooltip sem rect' };
          const within = rect.left >= viewport.left && rect.top >= viewport.top &&
            rect.right <= viewport.right && rect.bottom <= viewport.bottom;
          return within ? { ok: true } : { ok: false, reason: 'tooltip fora do viewport' };
        }
      },
      {
        id: 'T2',
        desc: 'Ainda segurando, mantenha o tooltip aberto.',
        validate: () => {
          const ui = window.__ui;
          if (!ui?.tooltip?.isOpen) return { ok: false, reason: 'tooltip não aberto' };
          const gap = getGap(ui.tooltip.anchorRect, ui.tooltip.rect);
          return gap <= 16 ? { ok: true } : { ok: false, reason: `distância ${gap}px` };
        }
      },
      {
        id: 'T3',
        desc: 'Com um tooltip aberto (press-hold no ícone Ajuda), abra a gaveta de filtros.',
        validate: () => {
          const ui = window.__ui;
          if (!ui?.overlay?.isBlocking) return { ok: false, reason: 'drawer não aberto' };
          return ui.tooltip.isOpen ? { ok: false, reason: 'tooltip ainda aberto' } : { ok: true };
        }
      },
      {
        id: 'T4',
        desc: 'Com a gaveta aberta, tente press-hold no ícone Ajuda (fora da gaveta).',
        validate: () => {
          const ui = window.__ui;
          if (!ui?.overlay?.isBlocking) return { ok: false, reason: 'drawer não aberto' };
          return ui.tooltip.isOpen ? { ok: false, reason: 'tooltip abriu' } : { ok: true };
        }
      },
      {
        id: 'T5',
        desc: 'Feche a gaveta. Abra um tooltip (press-hold no ícone Ajuda) e faça scroll.',
        validate: () => {
          const ui = window.__ui;
          if (!ui?.tooltip?.lastOpenReason) return { ok: false, reason: 'tooltip não abriu' };
          if (ui.tooltip.isOpen) return { ok: false, reason: 'tooltip não fechou' };
          return ui.tooltip.lastCloseReason === 'scroll'
            ? { ok: true }
            : { ok: false, reason: ui.tooltip.lastCloseReason || 'sem motivo de fechamento' };
        }
      },
      {
        id: 'T6',
        desc: 'Abra a gaveta. Pressione e segure no ícone de Período dentro da gaveta.',
        validate: () => {
          const ui = window.__ui;
          if (!ui?.drawerHints?.enabled) return { ok: false, reason: 'drawer hints desabilitados' };
          if (!ui.drawerHints.isOpen) return { ok: false, reason: 'hint não abriu' };
          const rect = ui.drawerHints.rect;
          const bounds = ui.drawerHints.bounds;
          if (!rect || !bounds) return { ok: false, reason: 'sem rect/bounds' };
          const within = rect.left >= bounds.left && rect.top >= bounds.top &&
            rect.right <= bounds.right && rect.bottom <= bounds.bottom;
          return within ? { ok: true } : { ok: false, reason: 'hint fora da gaveta' };
        }
      }
    ];

    let current = 0;
    let timer = null;
    let poller = null;
    let remaining = 15;
    let session = null;
    let attemptListener = null;

    const render = () => {
      const step = steps[current];
      stepEl.textContent = step.id;
      descEl.textContent = step.desc;
      timerEl.textContent = `${remaining}s`;
    };

    const resetTimer = () => {
      remaining = 15;
      timerEl.textContent = `${remaining}s`;
    };

    const stopTimer = () => {
      if (timer) clearInterval(timer);
      timer = null;
    };

    const resetSession = () => {
      session = {
        tooltipOpened: false,
        tooltipRectOk: false,
        minGap: Number.POSITIVE_INFINITY,
        overlayOpenSeen: false,
        tooltipOpenedBeforeOverlay: false,
        tooltipOpenDuringOverlay: false,
        attemptDuringOverlay: false,
        scrollClosed: false,
        drawerHintOpen: false,
        hintWithin: false
      };
    };

    const sampleStep = () => {
      const ui = window.__ui;
      if (!ui) return;
      const step = steps[current];
      if (ui.tooltip.isOpen) session.tooltipOpened = true;
      switch (step.id) {
        case 'T1': {
          if (ui.tooltip.isOpen && ui.tooltip.rect) {
            const viewport = getViewportRect();
            const rect = ui.tooltip.rect;
            session.tooltipRectOk = rect.left >= viewport.left && rect.top >= viewport.top &&
              rect.right <= viewport.right && rect.bottom <= viewport.bottom;
          }
          break;
        }
        case 'T2': {
          if (ui.tooltip.isOpen && ui.tooltip.rect && ui.tooltip.anchorRect) {
            const gap = getGap(ui.tooltip.anchorRect, ui.tooltip.rect);
            session.minGap = Math.min(session.minGap, gap);
          }
          break;
        }
        case 'T3': {
          if (!ui.overlay.isBlocking && ui.tooltip.isOpen) {
            session.tooltipOpenedBeforeOverlay = true;
          }
          if (ui.overlay.isBlocking) {
            session.overlayOpenSeen = true;
            if (ui.tooltip.isOpen) session.tooltipOpenDuringOverlay = true;
          }
          break;
        }
        case 'T4': {
          if (ui.overlay.isBlocking) {
            session.overlayOpenSeen = true;
            if (ui.tooltip.isOpen) session.tooltipOpenDuringOverlay = true;
          }
          break;
        }
        case 'T5': {
          if (ui.tooltip.lastOpenReason) session.tooltipOpened = true;
          if (ui.tooltip.lastCloseReason === 'scroll') session.scrollClosed = true;
          break;
        }
        case 'T6': {
          if (ui.drawerHints.isOpen && ui.drawerHints.rect && ui.drawerHints.bounds) {
            session.drawerHintOpen = true;
            const rect = ui.drawerHints.rect;
            const bounds = ui.drawerHints.bounds;
            session.hintWithin = rect.left >= bounds.left && rect.top >= bounds.top &&
              rect.right <= bounds.right && rect.bottom <= bounds.bottom;
          }
          break;
        }
        default:
          break;
      }
    };

    const stopRun = () => {
      stopTimer();
      if (poller) clearInterval(poller);
      poller = null;
      if (attemptListener) {
        document.removeEventListener('pointerdown', attemptListener, true);
        attemptListener = null;
      }
    };

    const evaluateStep = () => {
      const step = steps[current];
      switch (step.id) {
        case 'T1':
          return session.tooltipOpened && session.tooltipRectOk
            ? { ok: true }
            : { ok: false, reason: session.tooltipOpened ? 'tooltip fora do viewport' : 'tooltip não abriu' };
        case 'T2':
          return session.tooltipOpened && session.minGap <= 16
            ? { ok: true }
            : { ok: false, reason: session.tooltipOpened ? `distância ${session.minGap}px` : 'tooltip não abriu' };
        case 'T3':
          return session.tooltipOpenedBeforeOverlay && session.overlayOpenSeen && !session.tooltipOpenDuringOverlay
            ? { ok: true }
            : { ok: false, reason: 'tooltip não fechou com drawer' };
        case 'T4':
          return session.overlayOpenSeen && session.attemptDuringOverlay && !session.tooltipOpenDuringOverlay
            ? { ok: true }
            : { ok: false, reason: session.attemptDuringOverlay ? 'tooltip abriu com drawer' : 'sem tentativa no drawer' };
        case 'T5':
          return session.tooltipOpened && session.scrollClosed
            ? { ok: true }
            : { ok: false, reason: 'scroll não fechou tooltip' };
        case 'T6':
          return session.drawerHintOpen && session.hintWithin
            ? { ok: true }
            : { ok: false, reason: session.drawerHintOpen ? 'hint fora da gaveta' : 'hint não abriu' };
        default:
          return { ok: false, reason: 'etapa inválida' };
      }
    };

    const startTimer = () => {
      stopRun();
      resetSession();
      const step = steps[current];
      if (step.id === 'T4') {
        attemptListener = (event) => {
          const path = event.composedPath ? event.composedPath() : [event.target];
          const hasTooltip = path.some((node) => node?.dataset?.tooltip !== undefined);
          const insideDrawer = path.some((node) => node?.classList?.contains('v4-drawer'));
          if (window.__ui.overlay.isBlocking && hasTooltip && !insideDrawer) {
            session.attemptDuringOverlay = true;
          }
        };
        document.addEventListener('pointerdown', attemptListener, true);
      }
      statusEl.textContent = 'Executando...';
      poller = setInterval(sampleStep, 200);
      resetTimer();
      timer = setInterval(() => {
        remaining -= 1;
        timerEl.textContent = `${remaining}s`;
        if (remaining <= 0) {
          stopRun();
          const result = evaluateStep();
          statusEl.textContent = result.ok ? 'PASS' : `FAIL: ${result.reason}`;
        }
      }, 1000);
    };

    startBtn.addEventListener('click', () => startTimer());
    retryBtn.addEventListener('click', () => {
      stopRun();
      statusEl.textContent = 'Aguardando';
      resetTimer();
    });
    nextBtn.addEventListener('click', () => {
      stopRun();
      statusEl.textContent = 'Aguardando';
      resetTimer();
      current = (current + 1) % steps.length;
      render();
    });

    render();
  };

  const initUtf8Gate = () => {
    const gate = document.getElementById('utf8-gate');
    if (!gate) return;

    const charsetEl = document.getElementById('utf8-gate-charset');
    const sentinelEl = document.getElementById('utf8-gate-sentinel');
    const statusEl = document.getElementById('utf8-gate-status');
    const hintEl = document.getElementById('utf8-gate-hint');

    const expected = 'can\u00f4nicos, lan\u00e7amentos, sa\u00eddas, m\u00eas, S\u00e3o Jo\u00e3o, \u00e7\u00e1\u00e9\u00ed\u00f3\u00fa, \u00e3\u00f5';
    const charset = (document.characterSet || '').toLowerCase();

    if (charsetEl) charsetEl.textContent = document.characterSet || 'unknown';
    const charsetOk = charset === 'utf-8';
    const sentinelOk = sentinelEl && sentinelEl.textContent === expected;

    if (statusEl) {
      statusEl.classList.remove('is-pass', 'is-fail');
      if (charsetOk && sentinelOk) {
        statusEl.textContent = 'PASS';
        statusEl.classList.add('is-pass');
        if (hintEl) hintEl.textContent = 'UTF-8 confirmado.';
      } else {
        statusEl.textContent = 'FAIL';
        statusEl.classList.add('is-fail');
        if (hintEl) {
          if (!charsetOk) {
            hintEl.textContent = 'Meta charset ou headers n\u00e3o est\u00e3o em UTF-8.';
          } else {
            hintEl.textContent = 'Sentinela corrompida: regrave o arquivo em UTF-8.';
          }
        }
      }
    }
  };

  const initV6PAsserts = () => {
    const runBtn = document.getElementById('v6p-run');
    const statusEl = document.getElementById('v6p-status');
    const resultsEl = document.getElementById('v6p-results');
    const manualBtn = document.getElementById('v6p-manual-start');
    const manualStatus = document.getElementById('v6p-manual-status');
    const manualTimer = document.getElementById('v6p-manual-timer');
    if (!runBtn || !statusEl || !resultsEl || !manualBtn || !manualStatus || !manualTimer) return;

    const getNorthStarSection = () => {
      const headers = Array.from(document.querySelectorAll('h2.v3-section__title'));
      const header = headers.find((el) => el.textContent.trim() === 'North Star V6D');
      return header ? header.closest('section') : null;
    };

    const isVisible = (el) => !!(el && (el.offsetParent || el.getClientRects().length));

    const getViewportRect = () => {
      if (window.visualViewport) {
        return {
          left: window.visualViewport.offsetLeft,
          top: window.visualViewport.offsetTop,
          right: window.visualViewport.offsetLeft + window.visualViewport.width,
          bottom: window.visualViewport.offsetTop + window.visualViewport.height
        };
      }
      return { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
    };

    const luminance = (rgb) => {
      const [r, g, b] = rgb.map((c) => {
        const v = c / 255;
        return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };

    const parseRgb = (value) => {
      const match = value.match(/rgba?\\((\\d+),\\s*(\\d+),\\s*(\\d+)/i);
      if (!match) return null;
      return [Number(match[1]), Number(match[2]), Number(match[3])];
    };

    const runAsserts = () => {
      const results = [];

      const badClass = Array.from(document.querySelectorAll('[class],[id]')).filter((el) => {
        const id = (el.id || '').toLowerCase();
        const cls = (el.className || '').toString().toLowerCase();
        return /fab|floating-add|quickadd/.test(id) || /fab|floating-add|quickadd/.test(cls);
      });
      const addIcon = Array.from(document.querySelectorAll('.msr')).find((el) => el.textContent.trim() === 'add');
      const a1Pass = badClass.length === 0 && !addIcon;
      results.push({ id: 'A1', pass: a1Pass, msg: a1Pass ? 'PASS' : 'FAIL: FAB/add detectado' });

      const dock = document.getElementById('v6d-dual-dock');
      const dockButtons = dock ? Array.from(dock.querySelectorAll('button[aria-label]')).filter(isVisible) : [];
      const labels = dockButtons.map((el) => el.getAttribute('aria-label'));
      const a2Pass = dockButtons.length === 2 &&
        labels.includes('Nova entrada') &&
        labels.includes('Nova saída');
      results.push({ id: 'A2', pass: a2Pass, msg: a2Pass ? 'PASS' : 'FAIL: dock != 2 ações Nova entrada/Nova saída' });

      const northStar = getNorthStarSection();
      let a3Pass = true;
      if (northStar) {
        const textTargets = ['Filtros', 'Tipo', 'Período', 'Categoria'];
        const nodes = Array.from(northStar.querySelectorAll('*')).filter((el) => {
          if (!isVisible(el)) return false;
          if (el.closest('ion-modal')) return false;
          if (el.closest('.v6d-filter-summary')) return false;
          if (el.tagName === 'SCRIPT' || el.tagName === 'STYLE') return false;
          return textTargets.some((t) => el.textContent.includes(t));
        });
        a3Pass = nodes.length === 0;
      }
      results.push({ id: 'A3', pass: a3Pass, msg: a3Pass ? 'PASS' : 'FAIL: texto de filtros fora do drawer' });

      const dashboard = document.querySelector('.v6d-dashboard');
      let a4Pass = false;
      if (dashboard) {
        const bg = getComputedStyle(dashboard).backgroundColor;
        const rgb = parseRgb(bg);
        if (rgb) {
          a4Pass = luminance(rgb) < 0.18;
        }
      }
      results.push({ id: 'A4', pass: a4Pass, msg: a4Pass ? 'PASS' : 'FAIL: background não é dark' });

      resultsEl.innerHTML = '';
      const allPass = results.every((r) => r.pass);
      for (const row of results) {
        const item = document.createElement('div');
        item.className = `selftest-results__item ${row.pass ? 'is-pass' : 'is-fail'}`;
        item.textContent = `${row.id} ${row.msg}`;
        resultsEl.appendChild(item);
      }
      statusEl.textContent = allPass ? 'PASS' : 'FAIL';
    };

    runBtn.addEventListener('click', runAsserts);
    runAsserts();

    const steps = Array.from(document.querySelectorAll('#v6p-manual-steps .v6p-step'));
    let current = 0;
    let remaining = 15;
    let timerId = null;

    const setStepState = (index) => {
      steps.forEach((step, idx) => {
        step.classList.toggle('is-active', idx === index);
        const buttons = step.querySelectorAll('[data-v6p-pass],[data-v6p-fail]');
        buttons.forEach((btn) => {
          btn.disabled = idx !== index;
        });
      });
      remaining = 15;
      manualTimer.textContent = `${remaining}s`;
      manualStatus.textContent = 'Aguardando';
      manualStatus.classList.remove('is-pass', 'is-fail');
    };

    const stopTimer = () => {
      if (timerId) clearInterval(timerId);
      timerId = null;
    };

    const finishStep = (step, pass) => {
      const status = step.querySelector('.v6p-step__status');
      if (status) {
        status.textContent = pass ? 'PASS' : 'FAIL';
        status.classList.toggle('is-pass', pass);
        status.classList.toggle('is-fail', !pass);
      }
      stopTimer();
      if (pass) {
        if (current >= steps.length - 1) {
          manualStatus.textContent = 'PASS';
          manualStatus.classList.add('is-pass');
          manualStatus.classList.remove('is-fail');
          return;
        }
        current = Math.min(current + 1, steps.length - 1);
        setStepState(current);
      } else {
        manualStatus.textContent = 'FAIL';
        manualStatus.classList.add('is-fail');
      }
    };

    steps.forEach((step) => {
      const passBtn = step.querySelector('[data-v6p-pass]');
      const failBtn = step.querySelector('[data-v6p-fail]');
      passBtn?.addEventListener('click', () => finishStep(step, true));
      failBtn?.addEventListener('click', () => finishStep(step, false));
    });

    manualBtn.addEventListener('click', () => {
      stopTimer();
      manualStatus.textContent = 'Executando';
      manualStatus.classList.remove('is-pass', 'is-fail');
      timerId = setInterval(() => {
        remaining -= 1;
        manualTimer.textContent = `${remaining}s`;
        if (remaining <= 0) {
          const step = steps[current];
          finishStep(step, false);
        }
      }, 1000);
    });

    setStepState(current);
  };

  const init = () => {
    TooltipManager.bind();
    initSearchSelects();
    initDateRanges();
    initSwipeRows();
    initActionDock();
    initOverlayManager();
    DrawerHintManager.bind();
    initDebugOverlay();
    initSelfTest();
    initManualTest();
    initUtf8Gate();
    initV6PAsserts();
    initIonicModalBreakpoints();
  };

  return { init };
})();

document.addEventListener('DOMContentLoaded', () => {
  if (window.customElements?.whenDefined) {
    Promise.all([
      customElements.whenDefined('ion-popover'),
      customElements.whenDefined('ion-searchbar'),
      customElements.whenDefined('ion-datetime'),
    ]).then(() => v2.init());
  } else {
    v2.init();
  }
});
