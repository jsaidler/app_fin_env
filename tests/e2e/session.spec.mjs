import { test, expect } from "@playwright/test";
import { adminCreds, loginViaUi, csrfTokenFromCookie } from "./helpers/auth.mjs";

async function fetchSuiteUserIdAsAdmin(page) {
  const response = await page.request.get("/api/admin/users", {
    headers: { Accept: "application/json" },
  });
  expect(response.status()).toBe(200);
  const users = await response.json();
  const target = Array.isArray(users)
    ? users.find((item) => String(item?.email || "").toLowerCase() === "user.suite@local")
    : null;
  const id = Number(target?.id || 0);
  expect(id).toBeGreaterThan(0);
  return id;
}

test("cookie de sessao invalido redireciona dashboard para login", async ({ page }) => {
  await loginViaUi(page, adminCreds);

  await page.context().addCookies([
    {
      name: "auth_token",
      value: "token-invalido",
      domain: "127.0.0.1",
      path: "/",
    },
  ]);

  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator("#login-form")).toBeVisible();
});

test("logout em uma aba invalida sessao na outra", async ({ context, page }) => {
  await loginViaUi(page, adminCreds);

  const secondPage = await context.newPage();
  await secondPage.goto("/dashboard");
  await expect(secondPage.locator('[data-tab="lancamentos"]')).toBeVisible();

  await page.request.post("/api/auth/logout");

  await secondPage.reload();
  await expect(secondPage).toHaveURL(/\/$/);
  await expect(secondPage.locator("#login-form")).toBeVisible();
});

test("personificacao permanece ativa apos refresh", async ({ page }) => {
  await loginViaUi(page, adminCreds);
  const userId = await fetchSuiteUserIdAsAdmin(page);
  const csrf = await csrfTokenFromCookie(page);
  expect(csrf).not.toBe("");

  const impersonateResponse = await page.request.post(`/api/admin/users/${userId}/impersonate`, {
    headers: {
      Accept: "application/json",
      "X-CSRF-Token": csrf,
    },
  });
  expect(impersonateResponse.status()).toBe(200);

  await page.goto("/dashboard");
  await expect(page.locator("#impersonation-banner")).toBeVisible();

  await page.reload();
  await expect(page.locator("#impersonation-banner")).toBeVisible();
});

test("encerrar personificacao restaura sessao admin apos refresh", async ({ page }) => {
  await loginViaUi(page, adminCreds);
  const userId = await fetchSuiteUserIdAsAdmin(page);
  const csrf = await csrfTokenFromCookie(page);
  expect(csrf).not.toBe("");

  const impersonateResponse = await page.request.post(`/api/admin/users/${userId}/impersonate`, {
    headers: {
      Accept: "application/json",
      "X-CSRF-Token": csrf,
    },
  });
  expect(impersonateResponse.status()).toBe(200);

  const csrfAfterImpersonation = await csrfTokenFromCookie(page);
  expect(csrfAfterImpersonation).not.toBe("");
  const stopResponse = await page.request.post("/api/admin/impersonation/stop", {
    headers: {
      Accept: "application/json",
      "X-CSRF-Token": csrfAfterImpersonation,
    },
  });
  expect(stopResponse.status()).toBe(200);

  await page.goto("/dashboard");
  await expect(page.locator("#impersonation-banner")).toBeHidden();
  await expect(page.locator("#dash-admin-tab")).toBeVisible();
});
