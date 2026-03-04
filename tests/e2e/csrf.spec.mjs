import { test, expect } from "@playwright/test";
import { loginViaUi, userCreds, adminCreds, csrfTokenFromCookie } from "./helpers/auth.mjs";

function seedPayload() {
  return {
    type: "out",
    amount: 9.99,
    category: "Gastos",
    description: "e2e-csrf-seed",
    date: new Date().toISOString().slice(0, 10),
  };
}

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

test("csrf bloqueia escrita sem X-CSRF-Token", async ({ page }) => {
  await loginViaUi(page, userCreds);
  const response = await page.request.post("/api/entries", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    data: seedPayload(),
  });
  expect(response.status()).toBe(419);
});

test("csrf bloqueia escrita com X-CSRF-Token invalido", async ({ page }) => {
  await loginViaUi(page, userCreds);
  const response = await page.request.post("/api/entries", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-CSRF-Token": "invalid-token",
    },
    data: seedPayload(),
  });
  expect(response.status()).toBe(419);
});

test("csrf permite escrita com X-CSRF-Token valido", async ({ page }) => {
  await loginViaUi(page, userCreds);
  const csrf = await csrfTokenFromCookie(page);
  expect(csrf).not.toBe("");

  const response = await page.request.post("/api/entries", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-CSRF-Token": csrf,
    },
    data: seedPayload(),
  });
  expect(response.status()).toBe(201);
});

test("csrf bloqueia personificacao admin sem X-CSRF-Token", async ({ page }) => {
  await loginViaUi(page, adminCreds);
  const userId = await fetchSuiteUserIdAsAdmin(page);
  const response = await page.request.post(`/api/admin/users/${userId}/impersonate`, {
    headers: {
      Accept: "application/json",
    },
  });
  expect(response.status()).toBe(419);
});

test("csrf bloqueia personificacao admin com token invalido", async ({ page }) => {
  await loginViaUi(page, adminCreds);
  const userId = await fetchSuiteUserIdAsAdmin(page);
  const response = await page.request.post(`/api/admin/users/${userId}/impersonate`, {
    headers: {
      Accept: "application/json",
      "X-CSRF-Token": "invalid-token",
    },
  });
  expect(response.status()).toBe(419);
});

test("csrf permite personificacao admin e encerrar com token valido", async ({ page }) => {
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

  const stopWithoutCsrf = await page.request.post("/api/admin/impersonation/stop", {
    headers: {
      Accept: "application/json",
    },
  });
  expect(stopWithoutCsrf.status()).toBe(419);

  const csrfAfterImpersonation = await csrfTokenFromCookie(page);
  expect(csrfAfterImpersonation).not.toBe("");
  const stopWithCsrf = await page.request.post("/api/admin/impersonation/stop", {
    headers: {
      Accept: "application/json",
      "X-CSRF-Token": csrfAfterImpersonation,
    },
  });
  expect(stopWithCsrf.status()).toBe(200);
});
