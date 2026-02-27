import { test, expect } from "@playwright/test";
import { loginViaUi, userCreds } from "./helpers/auth.mjs";

test("manifest esta acessivel e consistente", async ({ request }) => {
  const response = await request.get("/manifest.json");
  expect(response.ok()).toBeTruthy();
  const manifest = await response.json();
  expect(manifest.display).toBe("standalone");
  expect(String(manifest.start_url || "")).toContain("/dashboard");
  expect(Array.isArray(manifest.icons)).toBeTruthy();
  expect(manifest.icons.length).toBeGreaterThanOrEqual(2);
});

test("service worker registra no dashboard", async ({ page, context }) => {
  await loginViaUi(page, userCreds);

  const existing = context.serviceWorkers();
  if (existing.length > 0) {
    expect(existing.length).toBeGreaterThan(0);
    return;
  }

  const worker = await context.waitForEvent("serviceworker", { timeout: 15000 });
  expect(worker.url()).toContain("/service-worker.js");
});

