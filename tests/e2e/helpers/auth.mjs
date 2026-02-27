import { expect } from "@playwright/test";

export const userCreds = {
  email: process.env.E2E_USER_EMAIL || "user.suite@local",
  password: process.env.E2E_USER_PASSWORD || "User#67890",
};

export const adminCreds = {
  email: process.env.E2E_ADMIN_EMAIL || "admin.suite@local",
  password: process.env.E2E_ADMIN_PASSWORD || "Admin#12345",
};

export async function loginViaUi(page, { email, password }) {
  await page.goto("/");
  await expect(page.locator("#login-form")).toBeVisible();
  await page.fill("#login-email", email);
  await page.fill("#login-password", password);
  await page.click("#login-submit");
  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.locator('[data-tab="lancamentos"]')).toBeVisible();
}

export async function authTokenFromStorage(page) {
  const token = await page.evaluate(() => localStorage.getItem("caixa_auth_token") || "");
  return String(token || "");
}

export async function activateTab(page, tabName) {
  await page.evaluate((name) => {
    const btn = document.querySelector(`.dash-tab[data-tab="${name}"]`);
    if (btn instanceof HTMLElement) btn.click();
  }, tabName);
  await expect(page.locator(`.dash-tab[data-tab="${tabName}"]`)).toHaveAttribute("aria-selected", "true");
}
