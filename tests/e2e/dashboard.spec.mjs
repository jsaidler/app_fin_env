import { test, expect } from "@playwright/test";
import { loginViaUi, userCreds, activateTab, csrfTokenFromCookie } from "./helpers/auth.mjs";

async function ensureEntrySeed(page) {
  const today = new Date().toISOString().slice(0, 10);
  const csrfToken = await csrfTokenFromCookie(page);
  await page.request.post("/api/entries", {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(csrfToken ? { "X-CSRF-Token": csrfToken } : {}),
    },
    data: {
      type: "out",
      amount: 12.34,
      category: "Gastos",
      description: "e2e-seed",
      date: today,
    },
  });
}

test("login e renderizacao basica do dashboard", async ({ page }) => {
  await loginViaUi(page, userCreds);
  await expect(page.locator('[data-tab="lancamentos"]')).toBeVisible();
  await expect(page.locator("#entries-list")).toBeVisible();
});

test("barra de busca aparece no primeiro carregamento de lancamentos", async ({ page }) => {
  await loginViaUi(page, userCreds);

  const lancamentosTab = page.locator('.dash-tab[data-tab="lancamentos"]');
  await expect(lancamentosTab).toHaveAttribute("aria-selected", "true");

  const searchOverlay = page.locator("#tx-search-overlay");
  await expect(searchOverlay).toBeVisible();
  await expect(searchOverlay).toHaveClass(/is-visible/);
  await expect(page.locator("#entries-search-input")).toBeVisible();
});

test("tabs principais carregam sem erro", async ({ page }) => {
  await loginViaUi(page, userCreds);
  await ensureEntrySeed(page);

  await activateTab(page, "categorias");
  await expect(page.locator('#sec-categorias:not([hidden])')).toBeVisible();

  await activateTab(page, "contas");
  await expect(page.locator('#sec-contas:not([hidden])')).toBeVisible();

  await activateTab(page, "recorrentes");
  await expect(page.locator('#sec-recorrentes:not([hidden])')).toBeVisible();
});

test("abre detalhe de categoria quando existe linha", async ({ page }) => {
  await loginViaUi(page, userCreds);
  await ensureEntrySeed(page);
  await activateTab(page, "categorias");

  const firstRow = page.locator('#sec-categorias:not([hidden]) #categories-list-screen .cat-row').first();
  await expect(firstRow).toBeVisible();

  await firstRow.click();
  await expect(page.locator("#category-detail-modal")).toBeVisible();
  await expect(page.locator("#close-category-detail-modal")).toBeVisible();
  await page.click("#close-category-detail-modal");
});

test("voltar entre abas respeita historico sem recarregar dashboard", async ({ page }) => {
  await loginViaUi(page, userCreds);
  await ensureEntrySeed(page);

  await activateTab(page, "categorias");
  await activateTab(page, "contas");
  await expect(page.locator('.dash-tab[data-tab="contas"]')).toHaveAttribute("aria-selected", "true");

  for (let i = 0; i < 5; i += 1) {
    const categoriasSelected = (await page.locator('.dash-tab[data-tab="categorias"]').getAttribute("aria-selected")) === "true";
    const lancamentosSelected = (await page.locator('.dash-tab[data-tab="lancamentos"]').getAttribute("aria-selected")) === "true";
    if (categoriasSelected || lancamentosSelected) {
      break;
    }
    await page.goBack();
  }
  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.locator('.dash-tab[data-tab="contas"]')).toHaveAttribute("aria-selected", "false");

  const categoriasSelected = (await page.locator('.dash-tab[data-tab="categorias"]').getAttribute("aria-selected")) === "true";
  if (categoriasSelected) {
    await expect(page.locator('#sec-categorias:not([hidden])')).toBeVisible();
  } else {
    await expect(page.locator('.dash-tab[data-tab="lancamentos"]')).toHaveAttribute("aria-selected", "true");
    await expect(page.locator("#entries-list")).toBeVisible();
  }
});

test("voltar fecha modal de detalhe em vez de recarregar pagina", async ({ page }) => {
  await loginViaUi(page, userCreds);
  await ensureEntrySeed(page);
  await activateTab(page, "categorias");

  const firstRow = page.locator('#sec-categorias:not([hidden]) #categories-list-screen .cat-row').first();
  await expect(firstRow).toBeVisible();

  await firstRow.click();
  await expect(page.locator("#category-detail-modal")).toBeVisible();

  await page.goBack();
  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.locator("#category-detail-modal")).toBeHidden();
});

test("ajuda abre com FAQ do app e permite abrir o suporte", async ({ page }) => {
  await loginViaUi(page, userCreds);

  await page.click("#dash-support-btn");
  await expect(page.locator("#support-help-modal")).toBeVisible();
  await expect(page.locator("#support-help-modal .entry-stage__title").first()).toContainText("FAQ do app");
  await expect(page.locator("#support-help-thread-list")).toBeVisible();
  await expect(page.locator("#open-support-chat-from-help")).toBeVisible();

  await page.click("#open-support-chat-from-help");
  await expect(page.locator("#support-modal")).toBeVisible();
  await expect(page.locator("#close-support-modal")).toBeVisible();
});
