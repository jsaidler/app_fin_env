/* Design System JS (shared) — state, helpers, charts, runtime checks */
(function(){
  const DS = {};
  const uid = () => Math.random().toString(36).slice(2, 10);

  function initIconFallback(){
    try{
      if (document.fonts){
        const ok = document.fonts.check('20px "Material Symbols Rounded"') || document.fonts.check('20px "Material Icons"');
        if(!ok) document.documentElement.classList.add('no-material');
      } else {
        document.documentElement.classList.add('no-material');
      }
    }catch(_){
      document.documentElement.classList.add('no-material');
    }
  }

  DS.icon = function(name){
    return `<span class="micon" aria-hidden="true">${name}</span>`;
  };

  const fmtBRL = new Intl.NumberFormat('pt-BR', { style:'currency', currency:'BRL' });
  DS.money = (n) => fmtBRL.format(n || 0);

  const fmtDate = new Intl.DateTimeFormat('pt-BR', { day:'2-digit', month:'2-digit', year:'numeric' });
  DS.date = (iso) => fmtDate.format(new Date(iso));

  DS.dayLabel = (iso) => {
    const d = new Date(iso);
    const now = new Date();
    const startOf = (x)=> new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
    const diff = (startOf(d) - startOf(now)) / (24*3600*1000);
    if(diff === 0) return "Hoje";
    if(diff === -1) return "Ontem";
    return fmtDate.format(d);
  };

  DS.time = (iso) => new Date(iso).toLocaleTimeString('pt-BR', { hour:'2-digit', minute:'2-digit' });

  const state = {
    categoriesState: "ok", // loading|ok|empty|error
    categories: [
      { id:"cat_1", name:"Vendas" },
      { id:"cat_2", name:"Serviços" },
      { id:"cat_3", name:"Fornecedores" },
      { id:"cat_4", name:"Aluguel" },
      { id:"cat_5", name:"Impostos" },
      { id:"cat_6", name:"Transporte" },
    ],
    transactions: [],
    trash: [],
    pendingQueue: [],
    tickets: [],
    activeTicketId: null,
    selectedTxId: null,
    lastUndo: null,
  };

  function seed(){
    const now = new Date();
    const iso = (d)=> d.toISOString();
    const addTx = (daysAgo, type, amount, catId, note, hasReceipt, monthClosed, status) => {
      const d = new Date(now.getTime() - daysAgo*24*3600*1000);
      d.setHours(12 + (daysAgo%4)*2, 10, 0, 0);
      state.transactions.push({
        id: "tx_" + uid(),
        dateISO: iso(d),
        type,
        amount,
        categoryId: catId,
        note: note || "",
        hasReceipt: !!hasReceipt,
        monthClosed: !!monthClosed,
        status: status || (monthClosed ? "official" : "active"),
      });
    };

    addTx(0, "in", 1250.00, "cat_1", "Recebimento", true, false, "active");
    addTx(0, "out", 220.50, "cat_6", "Combustível", false, false, "active");
    addTx(1, "out", 180.00, "cat_3", "Material", true, false, "active");
    addTx(2, "in", 980.00, "cat_2", "Serviço", false, false, "active");

    addTx(8, "out", 1200.00, "cat_4", "Aluguel", true, true, "official");
    addTx(9, "out", 430.90, "cat_5", "Tributos", false, true, "official");
    addTx(10, "in", 3100.00, "cat_1", "Vendas", false, true, "official");
    addTx(11, "out", 510.20, "cat_3", "Fornecedor", true, true, "official");

    const t1 = { id:"t_" + uid(), title:"Suporte / Contabilidade", unread: 1, messages: [
      { id:"m_"+uid(), from:"support", text:"Olá! Se precisar, pode enviar prints e detalhes por aqui.", timeISO: new Date(now.getTime()-2*3600*1000).toISOString() },
      { id:"m_"+uid(), from:"user", text:"Beleza. Vou organizar os lançamentos do mês.", timeISO: new Date(now.getTime()-90*60*1000).toISOString() },
      { id:"m_"+uid(), from:"support", text:"Perfeito. Quando o mês estiver fechado, alterações viram pendência para aprovação.", timeISO: new Date(now.getTime()-70*60*1000).toISOString() },
    ]};
    const t2 = { id:"t_" + uid(), title:"Dúvida: categorias", unread: 0, messages: [
      { id:"m_"+uid(), from:"user", text:"Algumas categorias não aparecem. É normal?", timeISO: new Date(now.getTime()-28*60*1000).toISOString() },
      { id:"m_"+uid(), from:"support", text:"As categorias são cadastradas pela contabilidade. Se faltar alguma, nos avise por aqui.", timeISO: new Date(now.getTime()-24*60*1000).toISOString() },
    ]};
    state.tickets = [t1, t2];
    state.activeTicketId = t1.id;
  }
  seed();

  DS.getState = ()=> state;
  DS.getCategoryName = (id) => (state.categories.find(c=>c.id===id)?.name) || "—";

  DS.groupByDay = (txs) => {
    const groups = new Map();
    for(const tx of txs){
      const label = DS.dayLabel(tx.dateISO);
      if(!groups.has(label)) groups.set(label, []);
      groups.get(label).push(tx);
    }
    const order = Array.from(groups.keys()).sort((a,b)=>{
      const pa = groups.get(a)[0]?.dateISO || "";
      const pb = groups.get(b)[0]?.dateISO || "";
      return pb.localeCompare(pa);
    });
    return order.map(k=>({label:k, items: groups.get(k).sort((a,b)=>b.dateISO.localeCompare(a.dateISO))}));
  };

  DS.sum = (txs)=> txs.reduce((acc, t)=> acc + (t.type==="in"? t.amount : -t.amount), 0);
  DS.sumIn = (txs)=> txs.filter(t=>t.type==="in").reduce((a,t)=>a+t.amount,0);
  DS.sumOut = (txs)=> txs.filter(t=>t.type==="out").reduce((a,t)=>a+t.amount,0);

  DS.getOfficialClosedTxs = ()=> state.transactions.filter(t=>t.monthClosed && t.status==="official");
  DS.getOpenTxs = ()=> state.transactions.filter(t=>!t.monthClosed);
  DS.getPending = ()=> state.pendingQueue.filter(p=>p.state==="waiting");
  DS.nowISO = ()=> new Date().toISOString();

  DS.txShort = (txId)=>{
    const tx = state.transactions.find(t=>t.id===txId);
    if(!tx) return "lançamento";
    const sig = tx.type==="in" ? "+" : "−";
    return `${sig}${DS.money(tx.amount)} • ${DS.getCategoryName(tx.categoryId)} • ${DS.date(tx.dateISO)}`;
  };

  DS.addSystemMessage = (text)=>{
    const t = state.tickets[0];
    if(!t) return;
    t.messages.push({ id:"m_"+uid(), from:"system", text, timeISO: DS.nowISO() });
  };

  DS.addChatMessage = (ticketId, from, text, attachment, linkedTx)=>{
    const t = state.tickets.find(x=>x.id===ticketId);
    if(!t) return;
    t.messages.push({ id:"m_"+uid(), from, text, timeISO: DS.nowISO(), attachment: attachment||null, linkedTx: linkedTx||null });
  };

  DS.createPending = (kind, txId, patch, meta) => {
    const p = {
      id: "p_"+uid(),
      kind, txId,
      createdAtISO: DS.nowISO(),
      patch: patch || null,
      state: "waiting",
      meta: meta || {}
    };
    state.pendingQueue.unshift(p);
    const tx = state.transactions.find(t=>t.id===txId);
    if(tx){
      if(kind==="edit") tx.status = "pending_edit";
      if(kind==="delete") tx.status = "pending_delete";
      if(kind==="restore") tx.status = "pending_restore";
    }
    DS.addSystemMessage(`Pendência criada: ${kind} • ${DS.txShort(txId)}`);
    const main = state.tickets[0];
    if(main) main.unread = (main.unread||0) + 1;
    return p;
  };

  DS.moveToTrash = (txId)=>{
    const txIdx = state.transactions.findIndex(t=>t.id===txId);
    if(txIdx<0) return null;
    const tx = state.transactions[txIdx];
    const now = new Date();
    const expires = new Date(now.getTime() + 7*24*3600*1000);
    const item = { id:"tr_"+uid(), txSnapshot: {...tx}, deletedAtISO: now.toISOString(), expiresAtISO: expires.toISOString() };
    state.trash.unshift(item);
    state.transactions.splice(txIdx,1);
    return item;
  };

  DS.restoreFromTrash = (trashId)=>{
    const idx = state.trash.findIndex(x=>x.id===trashId);
    if(idx<0) return null;
    const item = state.trash[idx];
    state.trash.splice(idx,1);
    state.transactions.unshift({...item.txSnapshot, status: item.txSnapshot.monthClosed ? "official" : "active"});
    return item;
  };

  DS.trashRemaining = (item)=>{
    const now = Date.now();
    const exp = new Date(item.expiresAtISO).getTime();
    const ms = exp - now;
    if(ms <= 0) return "Expirado";
    const days = Math.floor(ms / (24*3600*1000));
    const hrs = Math.floor((ms % (24*3600*1000)) / (3600*1000));
    if(days >= 1) return `Expira em ${days}d`;
    return `Expira em ${hrs}h`;
  };

  DS.approvePending = (pid)=>{
    const p = state.pendingQueue.find(x=>x.id===pid);
    if(!p || p.state!=="waiting") return;
    const tx = state.transactions.find(t=>t.id===p.txId);

    if(p.kind==="delete"){
      DS.moveToTrash(p.txId);
    } else if(p.kind==="edit"){
      if(tx && p.patch){
        Object.assign(tx, p.patch);
        tx.status = tx.monthClosed ? "official" : "active";
      }
    } else if(p.kind==="restore"){
      const trId = p.meta && p.meta.trashId;
      if(trId) DS.restoreFromTrash(trId);
    }
    p.state = "approved";
    const tx2 = state.transactions.find(t=>t.id===p.txId);
    if(tx2 && tx2.monthClosed) tx2.status = "official";
    DS.addSystemMessage(`Pendência aprovada: ${p.kind} • ${DS.txShort(p.txId)}`);
  };

  DS.rejectPending = (pid)=>{
    const p = state.pendingQueue.find(x=>x.id===pid);
    if(!p || p.state!=="waiting") return;
    const tx = state.transactions.find(t=>t.id===p.txId);
    if(tx) tx.status = tx.monthClosed ? "official" : "active";
    p.state = "rejected";
    DS.addSystemMessage(`Pendência rejeitada: ${p.kind} • ${DS.txShort(p.txId)}`);
  };

  DS.saveTx = ({mode, txId, data})=>{
    if(mode==="create"){
      const tx = {
        id: "tx_" + uid(),
        dateISO: data.dateISO,
        type: data.type,
        amount: data.amount,
        categoryId: data.categoryId,
        note: data.note || "",
        hasReceipt: !!data.hasReceipt,
        monthClosed: !!data.monthClosed,
        status: data.monthClosed ? "official" : "active",
      };
      state.transactions.unshift(tx);
      state.lastUndo = { kind:"create", txId: tx.id };
      return { ok:true, tx };
    }
    const tx = state.transactions.find(t=>t.id===txId);
    if(!tx) return { ok:false };
    if(tx.monthClosed){
      DS.createPending("edit", txId, {...data, monthClosed:true}, {});
      state.lastUndo = { kind:"pending", pid: state.pendingQueue[0]?.id };
      return { ok:true, pending:true };
    } else {
      Object.assign(tx, data);
      tx.status = "active";
      state.lastUndo = { kind:"edit", txId };
      return { ok:true, tx };
    }
  };

  DS.requestDelete = (txId)=>{
    const tx = state.transactions.find(t=>t.id===txId);
    if(!tx) return { ok:false };
    if(tx.monthClosed){
      DS.createPending("delete", txId, null, {});
      state.lastUndo = { kind:"pending", pid: state.pendingQueue[0]?.id };
      return { ok:true, pending:true };
    } else {
      const tr = DS.moveToTrash(txId);
      state.lastUndo = { kind:"trash", trashId: tr?.id };
      return { ok:true, trashed:true };
    }
  };

  DS.requestRestore = (trashId)=>{
    const item = state.trash.find(x=>x.id===trashId);
    if(!item) return { ok:false };
    const wasClosed = !!item.txSnapshot.monthClosed;
    if(wasClosed){
      const p = DS.createPending("restore", item.txSnapshot.id, null, { trashId });
      state.lastUndo = { kind:"pending", pid: p.id };
      return { ok:true, pending:true };
    } else {
      DS.restoreFromTrash(trashId);
      state.lastUndo = { kind:"restore", trashId };
      return { ok:true, restored:true };
    }
  };

  DS.undo = ()=>{
    const u = state.lastUndo;
    if(!u) return false;
    if(u.kind==="create"){
      const idx = state.transactions.findIndex(t=>t.id===u.txId);
      if(idx>=0) state.transactions.splice(idx,1);
      state.lastUndo = null;
      return true;
    }
    if(u.kind==="trash"){
      DS.restoreFromTrash(u.trashId);
      state.lastUndo = null;
      return true;
    }
    if(u.kind==="pending"){
      const idx = state.pendingQueue.findIndex(p=>p.id===u.pid);
      if(idx>=0){
        const p = state.pendingQueue[idx];
        const tx = state.transactions.find(t=>t.id===p.txId);
        if(tx) tx.status = tx.monthClosed ? "official" : "active";
        state.pendingQueue.splice(idx,1);
      }
      state.lastUndo = null;
      return true;
    }
    return false;
  };

  DS.sparklineSVG = (series, opts)=>{
    const w = (opts && opts.w) || 320;
    const h = (opts && opts.h) || 70;
    const pad = 6;
    const min = Math.min(...series);
    const max = Math.max(...series);
    const dx = (w - pad*2) / (series.length - 1);
    const scaleY = (v)=> {
      if(max===min) return h/2;
      return pad + (h - pad*2) * (1 - (v - min) / (max - min));
    };
    let d = "";
    series.forEach((v,i)=>{
      const x = pad + i*dx;
      const y = scaleY(v);
      d += (i===0 ? "M" : "L") + x.toFixed(2) + " " + y.toFixed(2) + " ";
    });
    const lastX = pad + (series.length-1)*dx;
    const lastY = scaleY(series[series.length-1]);
    const accent = "rgb(0,93,151)";
    return `
<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Tendência do saldo">
  <path d="${d}" fill="none" stroke="${accent}" stroke-width="2" stroke-linecap="round"/>
  <circle cx="${lastX.toFixed(2)}" cy="${lastY.toFixed(2)}" r="2.6" fill="${accent}"/>
</svg>`;
  };

  DS.barsDualSVG = (ins, outs, labels, opts)=>{
    const w = (opts && opts.w) || 320;
    const h = (opts && opts.h) || 92;
    const pad = 10;
    const n = labels.length;
    const max = Math.max(...ins, ...outs, 1);
    const barW = (w - pad*2) / (n*2 + (n-1));
    const gap = barW;
    const scale = (v)=> (h - pad*2) * (v/max);
    const accent = "rgb(0,93,151)";
    const outc = "rgba(185,28,28,.70)";
    let x = pad;
    let bars = "";
    for(let i=0;i<n;i++){
      const hi = scale(ins[i]);
      const ho = scale(outs[i]);
      bars += `<rect x="${x}" y="${(h-pad-hi).toFixed(2)}" width="${barW.toFixed(2)}" height="${hi.toFixed(2)}" rx="3" fill="${accent}" opacity="0.50"/>`;
      x += barW;
      bars += `<rect x="${x}" y="${(h-pad-ho).toFixed(2)}" width="${barW.toFixed(2)}" height="${ho.toFixed(2)}" rx="3" fill="${outc}" opacity="0.55"/>`;
      x += barW + gap;
    }
    return `
<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Entradas versus saídas">
  ${bars}
</svg>`;
  };

  DS.selfCheck = ()=>{
    const res = [];
    const ligatures = ["chevron_right","palette","arrow_upward","arrow_downward","delete","edit","chat","lock","schedule","warning"];
    let bad = 0;
    document.querySelectorAll('.micon').forEach(el=>{
      const txt = (el.textContent || "").trim();
      if(ligatures.includes(txt)){
        const fs = parseFloat(getComputedStyle(el).fontSize || "16");
        if(fs > 0.5 && !document.documentElement.classList.contains('no-material')) bad++;
      }
    });
    res.push({k:"Ícones não aparecem como texto", ok: bad===0});
    res.push({k:"Pílulas horizontais (overflow + snap)", ok: !!document.querySelector('.pills')});
    res.push({k:"Dock persistente Entrada/Saída", ok: !!document.querySelector('#actionDock')});
    return res;
  };

  DS.initIconFallback = initIconFallback;
  window.DS = DS;
})();
