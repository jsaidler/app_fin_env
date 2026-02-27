import { defineConfig } from "@playwright/test";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PORT = Number(process.env.E2E_PORT || 8000);
const BASE_URL = process.env.E2E_BASE_URL || `http://127.0.0.1:${PORT}`;
const ROOT = path.dirname(fileURLToPath(import.meta.url));
const E2E_DB_PATH = process.env.E2E_DB_PATH || path.join(ROOT, "tests", "_runtime", "playwright-e2e.sqlite");

export default defineConfig({
  testDir: "./tests/e2e",
  workers: 1,
  fullyParallel: false,
  retries: process.env.CI ? 2 : 0,
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  use: {
    baseURL: BASE_URL,
    headless: true,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  reporter: [["list"], ["html", { open: "never" }]],
  webServer: {
    command:
      process.env.E2E_SERVER_CMD ||
      `php scripts/e2e_seed.php && php -S 127.0.0.1:${PORT} -t public public/index.php`,
    url: BASE_URL,
    timeout: 120_000,
    reuseExistingServer: false,
    env: {
      ...process.env,
      APP_ENV: process.env.APP_ENV || "dev",
      APP_SECRET: process.env.APP_SECRET || "playwright-e2e-secret",
      DB_PATH: E2E_DB_PATH,
    },
  },
});
