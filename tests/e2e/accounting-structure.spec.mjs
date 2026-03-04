import { test, expect } from "@playwright/test";
import { adminCreds, loginViaUi, userCreds } from "./helpers/auth.mjs";

test("usuario recebe arvore de categorias e alias de tags", async ({ page }) => {
  await loginViaUi(page, userCreds);

  const treeResponse = await page.request.get("/api/categories/tree", {
    headers: { Accept: "application/json" },
  });
  expect(treeResponse.status()).toBe(200);
  const tree = await treeResponse.json();
  expect(Array.isArray(tree)).toBeTruthy();

  if (Array.isArray(tree) && tree.length > 0) {
    const first = tree[0] || {};
    expect(typeof first.account_class).toBe("string");
    expect(Array.isArray(first.children || [])).toBeTruthy();
  }

  const tagsResponse = await page.request.get("/api/tags", {
    headers: { Accept: "application/json" },
  });
  expect(tagsResponse.status()).toBe(200);
  const tags = await tagsResponse.json();
  expect(Array.isArray(tags)).toBeTruthy();
  if (Array.isArray(tags) && tags.length > 0) {
    expect(String(tags[0]?.resource || "")).toBe("tag");
  }
});

test("admin recebe arvore global de categorias", async ({ page }) => {
  await loginViaUi(page, adminCreds);

  const response = await page.request.get("/api/admin/categories/tree", {
    headers: { Accept: "application/json" },
  });
  expect(response.status()).toBe(200);
  const payload = await response.json();
  expect(Array.isArray(payload)).toBeTruthy();
  if (Array.isArray(payload) && payload.length > 0) {
    expect(typeof payload[0]?.name).toBe("string");
    expect(Array.isArray(payload[0]?.children || [])).toBeTruthy();
  }
});
