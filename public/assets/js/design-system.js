(() => {
  const iconFontName = 'Material Symbols Rounded';

  const formatCurrency = (value, currency = 'BRL') => {
    const number = Number(value || 0);
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(number);
  };

  const formatDate = (value, options) => {
    if (!value) return '';
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat('pt-BR', options || { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
  };

  const formatShortDate = (value) => formatDate(value, { day: '2-digit', month: 'short' });

  const formatDayLabel = (value) => {
    if (!value) return '';
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    const today = new Date();
    const normalize = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const diff = (normalize(date) - normalize(today)) / 86400000;
    if (diff === 0) return 'Hoje';
    if (diff === -1) return 'Ontem';
    return formatDate(date);
  };

  const toISODate = (date) => {
    if (!date) return '';
    const d = date instanceof Date ? date : new Date(date);
    if (Number.isNaN(d.getTime())) return '';
    return d.toISOString().slice(0, 10);
  };

  const icon = (name, options = {}) => {
    const span = document.createElement('span');
    span.className = options.className || 'material-symbols-rounded';
    span.textContent = name;
    span.setAttribute('aria-hidden', 'true');
    if (options.title) span.setAttribute('title', options.title);
    return span;
  };

  const updateIconFontStatus = () => {
    if (!document.fonts || !document.fonts.check) {
      document.documentElement.classList.add('icon-font-missing');
      return;
    }
    const loaded = document.fonts.check(`16px "${iconFontName}"`);
    document.documentElement.classList.toggle('icon-font-missing', !loaded);
  };

  const ensureIconFont = () => {
    updateIconFontStatus();
    if (!document.fonts || !document.fonts.load) return;
    document.fonts.load(`16px "${iconFontName}"`).then(updateIconFontStatus).catch(() => {});
    setTimeout(updateIconFontStatus, 1200);
  };

  const buildSparkline = (data, opts = {}) => {
    const width = opts.width || 240;
    const height = opts.height || 48;
    const max = Math.max(...data, 1);
    const min = Math.min(...data, 0);
    const range = max - min || 1;
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1 || 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    });
    const path = points.map((point, index) => (index === 0 ? `M${point}` : `L${point}`)).join(' ');
    return `<svg viewBox="0 0 ${width} ${height}" width="100%" height="${height}" class="ds-chart-spark"><path d="${path}" /></svg>`;
  };

  const buildBars = (data, opts = {}) => {
    const width = opts.width || 260;
    const height = opts.height || 96;
    const gap = opts.gap || 8;
    const max = Math.max(...data, 1);
    const barWidth = (width - gap * (data.length - 1)) / data.length;
    const bars = data.map((value, index) => {
      const barHeight = (value / max) * height;
      const x = index * (barWidth + gap);
      const y = height - barHeight;
      return `<rect x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${barWidth.toFixed(2)}" height="${barHeight.toFixed(2)}" rx="6" />`;
    }).join('');
    return `<svg viewBox="0 0 ${width} ${height}" width="100%" height="${height}" class="ds-chart-bars">${bars}</svg>`;
  };

  const buildHBar = (data, opts = {}) => {
    const width = opts.width || 260;
    const height = opts.height || 120;
    const max = Math.max(...data.map((d) => d.value), 1);
    const rowHeight = height / data.length;
    const bars = data.map((item, index) => {
      const barWidth = (item.value / max) * width;
      const y = index * rowHeight + rowHeight * 0.2;
      return `<rect x="0" y="${y.toFixed(2)}" width="${barWidth.toFixed(2)}" height="${(rowHeight * 0.6).toFixed(2)}" rx="6" />`;
    }).join('');
    return `<svg viewBox="0 0 ${width} ${height}" width="100%" height="${height}" class="ds-chart-hbars">${bars}</svg>`;
  };

  const createMockState = () => {
    const today = new Date();
    const iso = (daysAgo) => {
      const d = new Date(today);
      d.setDate(today.getDate() - daysAgo);
      return toISODate(d);
    };
    return {
      categoriesState: 'loading',
      categories: [
        { id: 'sales', name: 'Vendas' },
        { id: 'services', name: 'Serviços' },
        { id: 'marketing', name: 'Marketing' },
        { id: 'taxes', name: 'Impostos' },
        { id: 'ops', name: 'Operações' },
      ],
      transactions: [
        { id: 't1', type: 'in', amount: 4200, date: iso(0), categoryId: 'sales', note: 'Pix loja', status: 'official' },
        { id: 't2', type: 'out', amount: 680, date: iso(0), categoryId: 'marketing', note: 'Campanha social', status: 'official' },
        { id: 't3', type: 'in', amount: 2100, date: iso(1), categoryId: 'services', note: 'Assinatura mensal', status: 'official' },
        { id: 't4', type: 'out', amount: 1200, date: iso(2), categoryId: 'ops', note: 'Equipe', status: 'official' },
        { id: 't5', type: 'out', amount: 330, date: iso(3), categoryId: 'taxes', note: 'Guia', status: 'official' },
      ],
      pendingQueue: [],
      trash: [],
      chats: [
        {
          id: 'c1',
          title: 'Contabilidade',
          badge: 0,
          messages: [
            { id: 'm1', author: 'system', text: 'Ticket aberto para revisão de lançamentos.', time: formatDate(today) },
            { id: 'm2', author: 'agent', text: 'Olá! Como podemos ajudar?', time: formatDate(today) }
          ]
        },
        {
          id: 'c2',
          title: 'Suporte técnico',
          badge: 0,
          messages: [
            { id: 'm3', author: 'agent', text: 'Estamos analisando o erro do PDF.', time: formatDate(today) }
          ]
        },
        {
          id: 'c3',
          title: 'Onboarding',
          badge: 0,
          messages: [
            { id: 'm4', author: 'agent', text: 'Checklist enviado. Precisa de ajuda?', time: formatDate(today) }
          ]
        }
      ],
      closedMonth: false,
      officialTotals: null
    };
  };

  window.ds = {
    formatCurrency,
    formatDate,
    formatShortDate,
    formatDayLabel,
    toISODate,
    icon,
    ensureIconFont,
    charts: {
      sparkline: buildSparkline,
      bars: buildBars,
      hbars: buildHBar
    },
    createMockState
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureIconFont);
  } else {
    ensureIconFont();
  }
})();
