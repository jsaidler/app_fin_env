import { test, expect } from "@playwright/test";
import { adminCreds, loginViaUi, activateTab } from "./helpers/auth.mjs";

test("admin visualiza aba de administracao", async ({ page }) => {
  await loginViaUi(page, adminCreds);
  const adminTab = page.locator('#dash-admin-tab:not([hidden])');
  await expect(adminTab).toBeVisible();
  await activateTab(page, "administracao");
  await expect(page.locator('#sec-administracao:not([hidden])')).toBeVisible();
});
