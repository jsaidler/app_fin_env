import { test, expect } from "@playwright/test";
import { loginViaUi, userCreds, activateTab } from "./helpers/auth.mjs";
import fs from "node:fs";
import path from "node:path";

test("request metrics by user flow", async ({ page }, testInfo) => {
  const phaseEvents = new Map();
  let currentPhase = "idle";
  let lastApiAt = 0;
  const baseUrl = testInfo.project.use.baseURL || "http://127.0.0.1";
  const base = new URL(baseUrl);

  function record(req) {
    try {
      const url = new URL(req.url());
      if (url.origin !== base.origin) return;
      if (!url.pathname.startsWith("/api/")) return;
      const bucket = phaseEvents.get(currentPhase) || [];
      bucket.push({
        method: req.method(),
        path: `${url.pathname}${url.search}`,
        ts: Date.now(),
      });
      phaseEvents.set(currentPhase, bucket);
      lastApiAt = Date.now();
    } catch {
      // no-op
    }
  }

  page.on("request", (req) => record(req));

  async function waitQuiet(quietMs = 700, timeoutMs = 12000) {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
      if (Date.now() - lastApiAt >= quietMs) return;
      await page.waitForTimeout(100);
    }
  }

  function summarize(events) {
    const map = new Map();
    for (const ev of events) {
      const k = `${ev.method} ${ev.path}`;
      map.set(k, (map.get(k) || 0) + 1);
    }
    const endpoints = Array.from(map.entries())
      .map(([endpoint, count]) => ({ endpoint, count }))
      .sort((a, b) => b.count - a.count || a.endpoint.localeCompare(b.endpoint));
    return {
      total_api_requests: events.length,
      unique_endpoints: endpoints.length,
      endpoints,
    };
  }

  async function measure(name, action) {
    phaseEvents.set(name, []);
    currentPhase = name;
    await action();
    await waitQuiet();
    currentPhase = "idle";
    return summarize(phaseEvents.get(name) || []);
  }

  const results = {};
  results.open_app_login = await measure("open_app_login", async () => {
    await loginViaUi(page, userCreds);
  });

  results.switch_to_categories = await measure("switch_to_categories", async () => {
    await activateTab(page, "categorias");
  });

  results.switch_to_accounts = await measure("switch_to_accounts", async () => {
    await activateTab(page, "contas");
  });

  results.apply_filter_type_in = await measure("apply_filter_type_in", async () => {
    await activateTab(page, "lancamentos");
    await page.click("#open-entry-filters-summary");
    await page.click('#entries-filter-type ion-segment-button[value="in"]');
    await page.click("#apply-entry-filters");
  });

  results.create_entry_via_api = await measure("create_entry_via_api", async () => {
    await page.evaluate(async () => {
      const csrf = String(document.cookie || "")
        .split(";")
        .map((part) => part.trim())
        .find((part) => part.startsWith("csrf_token="))
        ?.split("=")[1] || "";
      const today = new Date().toISOString().slice(0, 10);
      await fetch("/api/entries", {
        method: "POST",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "X-CSRF-Token": decodeURIComponent(csrf),
        },
        body: JSON.stringify({
          type: "in",
          amount: 17.25,
          category: "Salario",
          account_id: null,
          date: today,
          description: "metric-entry",
        }),
      });
    });
  });

  const artifactDir = path.resolve("output", "playwright");
  fs.mkdirSync(artifactDir, { recursive: true });
  const outPath = path.join(artifactDir, "request-metrics.json");
  fs.writeFileSync(
    outPath,
    JSON.stringify(
      {
        generated_at: new Date().toISOString(),
        base_url: baseUrl,
        flows: results,
      },
      null,
      2
    ),
    "utf-8"
  );

  for (const [flow, data] of Object.entries(results)) {
    console.log(`[${flow}] total=${data.total_api_requests} unique=${data.unique_endpoints}`);
    for (const row of data.endpoints.slice(0, 6)) {
      console.log(`  ${String(row.count).padStart(2, " ")}x ${row.endpoint}`);
    }
  }

  expect(Object.keys(results).length).toBeGreaterThan(0);
});
