const api = {
  async request(method, url, body) {
    const headers = { 'Content-Type': 'application/json' };
    if (state.token) headers['Authorization'] = 'Bearer ' + state.token;
    const res = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    }).catch(() => null);
    if (!res) return { ok: false, error: 'Sem conexão' };
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, data, error: data.error || (!res.ok && res.statusText) };
  },
  get(url) { return this.request('GET', url); },
  post(url, body) { return this.request('POST', url, body); },
  put(url, body) { return this.request('PUT', url, body); },
  del(url) { return this.request('DELETE', url); }
};
