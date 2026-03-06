import { chromium } from "@playwright/test";
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const RUNTIME_DIR = path.join(ROOT, "tests", "_runtime");
const OUTPUT_DIR = path.join(ROOT, "output", "playwright");
const PORT = Number(process.env.E2E_PORT || 8123);
const BASE_URL = process.env.E2E_BASE_URL || `http://127.0.0.1:${PORT}`;
const DB_PATH = process.env.E2E_DB_PATH || path.join(RUNTIME_DIR, `measure-${process.pid}.sqlite`);
const DATA_PATH = process.env.DATA_PATH || path.join(RUNTIME_DIR, `measure-data-${process.pid}`);

const USER_EMAIL = process.env.E2E_USER_EMAIL || "user.suite@local";
const USER_PASSWORD = process.env.E2E_USER_PASSWORD || "User#67890";

mkdirSync(RUNTIME_DIR, { recursive: true });
mkdirSync(OUTPUT_DIR, { recursive: true });

const env = {
  ...process.env,
  APP_ENV: "dev",
  APP_SECRET: process.env.APP_SECRET || "playwright-e2e-secret",
  DB_PATH,
  DATA_PATH,
  UPLOADS_PATH: path.join(DATA_PATH, "users"),
};

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: ROOT,
      env,
      stdio: options.stdio || "pipe",
      shell: false,
    });
    let stdout = "";
    let stderr = "";
    child.stdout?.on("data", (chunk) => {
      stdout += String(chunk);
    });
    child.stderr?.on("data", (chunk) => {
      stderr += String(chunk);
    });
    child.on("close", (code) => {
      if (code === 0) resolve({ code, stdout, stderr });
      else reject(new Error(`${command} ${args.join(" ")} failed (${code})\n${stderr || stdout}`));
    });
  });
}

async function waitForServer(url, timeoutMs = 15000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {
      // retry
    }
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error("Server did not become ready in time.");
}

function summarize(events) {
  const byEndpoint = new Map();
  for (const event of events) {
    const key = `${event.method} ${event.path}`;
    byEndpoint.set(key, (byEndpoint.get(key) || 0) + 1);
  }
  const endpoints = Array.from(byEndpoint.entries())
    .map(([endpoint, count]) => ({ endpoint, count }))
    .sort((a, b) => b.count - a.count || a.endpoint.localeCompare(b.endpoint));
  return {
    total_api_requests: events.length,
    unique_endpoints: endpoints.length,
    endpoints,
  };
}

async function main() {
  console.log("Starting request metrics script...");
  console.log(`DB_PATH=${DB_PATH}`);
  console.log(`DATA_PATH=${DATA_PATH}`);
  console.log("Seeding database...");
  await run("php", ["scripts/e2e_seed.php"], { stdio: "pipe" });
  console.log("Database seeded.");
  const server = spawn("php", ["-S", `127.0.0.1:${PORT}`, "-t", "public", "public/index.php"], {
    cwd: ROOT,
    env,
    stdio: "ignore",
  });

  try {
    await waitForServer(`${BASE_URL}/`);

    console.log(`Seeding/Server ready at ${BASE_URL}`);
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ baseURL: BASE_URL });
    const page = await context.newPage();
    page.setDefaultTimeout(20_000);

    const phaseEvents = new Map();
    let currentPhase = "idle";
    let lastApiEventAt = 0;

    function recordRequest(req, status) {
      try {
        const url = new URL(req.url());
        if (url.origin !== new URL(BASE_URL).origin) return;
        if (!url.pathname.startsWith("/api/")) return;
        const bucket = phaseEvents.get(currentPhase) || [];
        bucket.push({
          method: req.method(),
          path: `${url.pathname}${url.search}`,
          status,
          ts: Date.now(),
        });
        phaseEvents.set(currentPhase, bucket);
        lastApiEventAt = Date.now();
      } catch {
        // ignore parse errors
      }
    }

    page.on("requestfinished", (req) => recordRequest(req, "finished"));
    page.on("requestfailed", (req) => recordRequest(req, "failed"));

    async function waitForApiQuiet(quietMs = 700, maxMs = 15000) {
      const start = Date.now();
      while (Date.now() - start < maxMs) {
        if (Date.now() - lastApiEventAt >= quietMs) return;
        await page.waitForTimeout(100);
      }
    }

    async function measurePhase(name, action) {
      console.log(`Running phase: ${name}`);
      phaseEvents.set(name, []);
      currentPhase = name;
      await action();
      await waitForApiQuiet();
      currentPhase = "idle";
      return summarize(phaseEvents.get(name) || []);
    }

    await page.goto("/");
    await page.fill("#login-email", USER_EMAIL);
    await page.fill("#login-password", USER_PASSWORD);

    const results = {};
    results.open_app_login = await measurePhase("open_app_login", async () => {
      await page.click("#login-submit");
      await page.waitForURL(/\/dashboard/);
      await page.locator('.dash-tab[data-tab="lancamentos"]').waitFor();
    });

    results.switch_to_categories = await measurePhase("switch_to_categories", async () => {
      await page.click('.dash-tab[data-tab="categorias"]');
      await page.locator('.dash-tab[data-tab="categorias"][aria-selected="true"]').waitFor();
    });

    results.switch_to_accounts = await measurePhase("switch_to_accounts", async () => {
      await page.click('.dash-tab[data-tab="contas"]');
      await page.locator('.dash-tab[data-tab="contas"][aria-selected="true"]').waitFor();
    });

    results.apply_filter_type_in = await measurePhase("apply_filter_type_in", async () => {
      await page.click('.dash-tab[data-tab="lancamentos"]');
      await page.click("#open-entry-filters-summary");
      await page.click('#entries-filter-type ion-segment-button[value="in"]');
      await page.click("#apply-entry-filters");
    });

    results.create_entry_via_api = await measurePhase("create_entry_via_api", async () => {
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
            amount: 15.5,
            category: "Salario",
            account_id: null,
            date: today,
            description: "medicao-playwright",
          }),
        });
      });
    });

    await browser.close();

    const outPath = path.join(OUTPUT_DIR, "request-metrics.json");
    writeFileSync(outPath, JSON.stringify({
      generated_at: new Date().toISOString(),
      base_url: BASE_URL,
      flows: results,
    }, null, 2), "utf-8");

    console.log("=== Request Metrics (API) ===");
    for (const [flow, data] of Object.entries(results)) {
      console.log(`\n[${flow}] total=${data.total_api_requests} unique=${data.unique_endpoints}`);
      for (const row of data.endpoints.slice(0, 8)) {
        console.log(`  ${String(row.count).padStart(2, " ")}x  ${row.endpoint}`);
      }
    }
    console.log(`\nSaved: ${outPath}`);
  } finally {
    server.kill("SIGTERM");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
