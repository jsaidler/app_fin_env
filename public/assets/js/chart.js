const chart = {
  render(canvas, series) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width = canvas.clientWidth;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    if (!series || series.length === 0) return;
    // total cumulativa
    let running = 0;
    const cumulative = series.map(s => {
      running += s.in - s.out;
      return { ...s, total: running };
    });
    const max = Math.max(...cumulative.flatMap(s => [s.in, s.out, s.total]), 1);
    const paddingX = 42;
    const paddingY = 32;
    const stepX = (w - paddingX * 2) / Math.max(series.length - 1, 1);
    const colors = { in: '#22c55e', out: '#f87171', total: '#1877f2' };
    const drawLine = (key) => {
      ctx.beginPath();
      cumulative.forEach((s, i) => {
        const x = paddingX + stepX * i;
        const val = s[key];
        const y = h - paddingY - ((val / max) * (h - paddingY * 2));
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      });
      ctx.strokeStyle = colors[key];
      ctx.lineWidth = 3;
      ctx.stroke();
      // dots
      cumulative.forEach((s, i) => {
        const x = paddingX + stepX * i;
        const val = s[key];
        const y = h - paddingY - ((val / max) * (h - paddingY * 2));
        ctx.fillStyle = colors[key];
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
      });
    };
    drawLine('total');
    drawLine('in');
    drawLine('out');
    ctx.fillStyle = '#94a3b8';
    ctx.font = '12px Inter, sans-serif';
    const skip = Math.max(1, Math.ceil(cumulative.length / 5));
    cumulative.forEach((s, i) => {
      if (i % skip !== 0 && i !== cumulative.length - 1) return;
      const x = paddingX + stepX * i - 12;
      const lbl = s.label && s.label.length === 10 ? `${s.label.slice(8,10)}/${s.label.slice(5,7)}` : s.label;
      ctx.fillText(lbl, x, h - 10);
    });
  }
};
