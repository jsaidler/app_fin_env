import { test, expect } from "@playwright/test";
import { adminCreds, csrfTokenFromCookie, loginViaUi, userCreds } from "./helpers/auth.mjs";

function isoDate(offsetDays = 0) {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().slice(0, 10);
}

async function authJson(page, method, url, data = null) {
  const csrf = await csrfTokenFromCookie(page);
  expect(csrf).not.toBe("");
  const req = method.toLowerCase();
  const response = await page.request[req](url, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-CSRF-Token": csrf,
    },
    ...(data === null ? {} : { data }),
  });
  return response;
}

async function findSuiteUserIdAsAdmin(page) {
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

test("fluxo critico: criar, editar e excluir lancamento", async ({ page }) => {
  await loginViaUi(page, userCreds);

  const createdResponse = await authJson(page, "post", "/api/entries", {
    type: "out",
    amount: 77.45,
    category: "Gastos",
    description: "e2e-crud-lancamento",
    date: isoDate(),
  });
  expect(createdResponse.status()).toBe(201);
  const created = await createdResponse.json();
  const entryId = Number(created?.id || 0);
  expect(entryId).toBeGreaterThan(0);

  const updatedResponse = await authJson(page, "put", `/api/entries/${entryId}`, {
    type: "out",
    amount: 99.9,
    category: "Gastos",
    description: "e2e-crud-lancamento-editado",
    date: isoDate(),
  });
  expect(updatedResponse.status()).toBe(200);
  const updated = await updatedResponse.json();
  expect(Number(updated?.amount || 0)).toBeCloseTo(99.9, 2);
  expect(String(updated?.description || "")).toContain("editado");

  const deletedResponse = await authJson(page, "delete", `/api/entries/${entryId}`);
  expect(deletedResponse.status()).toBe(200);
  const deleted = await deletedResponse.json();
  expect(Boolean(deleted?.deleted)).toBeTruthy();

  const withDeletedResponse = await page.request.get("/api/entries?include_deleted=1", {
    headers: { Accept: "application/json" },
  });
  expect(withDeletedResponse.status()).toBe(200);
  const withDeleted = await withDeletedResponse.json();
  const deletedRow = Array.isArray(withDeleted)
    ? withDeleted.find((item) => Number(item?.id || 0) === entryId)
    : null;
  expect(deletedRow).toBeTruthy();
  expect(String(deletedRow?.deleted_type || "")).not.toBe("");
});

test("fluxo critico: movimentacao entre contas via lancamentos pareados", async ({ page }) => {
  await loginViaUi(page, userCreds);

  const accountsResponse = await page.request.get("/api/accounts", { headers: { Accept: "application/json" } });
  expect(accountsResponse.status()).toBe(200);
  const accounts = await accountsResponse.json();
  const source = Array.isArray(accounts) ? accounts.find((item) => Number(item?.id || 0) > 0) : null;
  expect(Number(source?.id || 0)).toBeGreaterThan(0);

  const createdAccountResponse = await authJson(page, "post", "/api/accounts", {
    name: "Conta Destino E2E",
    type: "bank",
    icon: "account_balance_wallet",
    initial_balance: 0,
  });
  expect(createdAccountResponse.status()).toBe(201);
  const createdAccount = await createdAccountResponse.json();
  const targetAccountId = Number(createdAccount?.id || 0);
  expect(targetAccountId).toBeGreaterThan(0);

  const transferAmount = 33.21;
  const transferDate = isoDate();
  const transferRef = `e2e-transfer-${Date.now()}`;

  const outResponse = await authJson(page, "post", "/api/entries", {
    type: "out",
    amount: transferAmount,
    category: "Gastos",
    description: transferRef,
    date: transferDate,
    account_id: Number(source.id),
  });
  expect(outResponse.status()).toBe(201);

  const inResponse = await authJson(page, "post", "/api/entries", {
    type: "in",
    amount: transferAmount,
    category: "Dizimo",
    description: transferRef,
    date: transferDate,
    account_id: targetAccountId,
  });
  expect(inResponse.status()).toBe(201);

  const start = transferDate.slice(0, 8) + "01";
  const aggregateResponse = await page.request.get(`/api/reports/aggregate?start=${start}&end=${transferDate}`, {
    headers: { Accept: "application/json" },
  });
  expect(aggregateResponse.status()).toBe(200);
  const aggregate = await aggregateResponse.json();
  const byAccount = Array.isArray(aggregate?.by_account) ? aggregate.by_account : [];
  const sourceSummary = byAccount.find((item) => Number(item?.id || 0) === Number(source.id));
  const targetSummary = byAccount.find((item) => Number(item?.id || 0) === targetAccountId);

  expect(sourceSummary).toBeTruthy();
  expect(targetSummary).toBeTruthy();
  expect(Number(sourceSummary?.out || 0)).toBeGreaterThanOrEqual(transferAmount);
  expect(Number(targetSummary?.in || 0)).toBeGreaterThanOrEqual(transferAmount);
});

test("fluxo critico: agendamento recorrente exige confirmacao para gerar lancamento", async ({ page }) => {
  await loginViaUi(page, userCreds);

  const dueDate = isoDate();
  const recurrenceDescription = `e2e-recorrencia-${Date.now()}`;
  const recurrenceResponse = await authJson(page, "post", "/api/recurrences", {
    type: "in",
    amount: 45.67,
    category: "Dizimo",
    description: recurrenceDescription,
    start_date: dueDate,
    frequency: "monthly",
    active: 1,
  });
  expect([200, 201]).toContain(recurrenceResponse.status());
  const createdRecurrence = await recurrenceResponse.json();
  const recurrenceId = Number(createdRecurrence?.id || 0);
  expect(recurrenceId).toBeGreaterThan(0);

  const recurrenceDetailResponse = await page.request.get(`/api/recurrences/${recurrenceId}`, {
    headers: { Accept: "application/json" },
  });
  expect(recurrenceDetailResponse.status()).toBe(200);
  const recurrenceDetail = await recurrenceDetailResponse.json();
  expect(Number(recurrenceDetail?.entries_count || 0)).toBe(0);

  const runs = Array.isArray(recurrenceDetail?.runs) ? recurrenceDetail.runs : [];
  const pendingRun = runs.find((item) => String(item?.status || "") === "pending");
  const runId = Number(pendingRun?.id || 0);
  expect(runId).toBeGreaterThan(0);

  const confirmResponse = await authJson(
    page,
    "post",
    `/api/recurrences/${recurrenceId}/runs/${runId}/confirm`,
    { description: recurrenceDescription }
  );
  expect(confirmResponse.status()).toBe(200);
  const confirmed = await confirmResponse.json();
  expect(Number(confirmed?.entries_count || 0)).toBeGreaterThan(0);

  const entries = Array.isArray(confirmed?.entries) ? confirmed.entries : [];
  const recurrenceEntry = entries.find((item) => Number(item?.recurrence_id || 0) === recurrenceId);
  expect(recurrenceEntry).toBeTruthy();
  expect(String(recurrenceEntry?.description || "")).toContain(recurrenceDescription);
});

test("fluxo critico: conta opcional consistente entre lancamento e recorrencia", async ({ page }) => {
  await loginViaUi(page, userCreds);

  const accountResponse = await authJson(page, "post", "/api/accounts", {
    name: `Conta Opcional E2E ${Date.now()}`,
    type: "bank",
    icon: "account_balance",
    initial_balance: 0,
  });
  expect(accountResponse.status()).toBe(201);
  const createdAccount = await accountResponse.json();
  const accountId = Number(createdAccount?.id || 0);
  expect(accountId).toBeGreaterThan(0);

  const entryDate = isoDate();
  const entryDescription = `e2e-opcional-entry-${Date.now()}`;
  const entryCreateResponse = await authJson(page, "post", "/api/entries", {
    type: "out",
    amount: 17.9,
    category: "Gastos",
    description: entryDescription,
    date: entryDate,
    account_id: accountId,
  });
  expect(entryCreateResponse.status()).toBe(201);
  const createdEntry = await entryCreateResponse.json();
  const entryId = Number(createdEntry?.id || 0);
  expect(entryId).toBeGreaterThan(0);

  const entryUpdateResponse = await authJson(page, "put", `/api/entries/${entryId}`, {
    type: "out",
    amount: 17.9,
    category: "Gastos",
    description: `${entryDescription}-sem-conta`,
    date: entryDate,
    account_id: null,
  });
  expect(entryUpdateResponse.status()).toBe(200);

  const entriesResponse = await page.request.get("/api/entries", {
    headers: { Accept: "application/json" },
  });
  expect(entriesResponse.status()).toBe(200);
  const entries = await entriesResponse.json();
  const updatedEntry = Array.isArray(entries)
    ? entries.find((item) => Number(item?.id || 0) === entryId)
    : null;
  expect(updatedEntry).toBeTruthy();
  expect(updatedEntry?.account_id === null || Number(updatedEntry?.account_id || 0) === 0).toBeTruthy();

  const recStartDate = isoDate(20);
  const recDescription = `e2e-opcional-rec-${Date.now()}`;
  const recurrenceCreateResponse = await authJson(page, "post", "/api/recurrences", {
    type: "in",
    amount: 23.45,
    category: "Dizimo",
    description: recDescription,
    start_date: recStartDate,
    frequency: "monthly",
    account_id: accountId,
  });
  expect([200, 201]).toContain(recurrenceCreateResponse.status());
  const createdRecurrence = await recurrenceCreateResponse.json();
  const recurrenceId = Number(createdRecurrence?.id || 0);
  expect(recurrenceId).toBeGreaterThan(0);

  const recurrenceUpdateResponse = await authJson(page, "put", `/api/recurrences/${recurrenceId}`, {
    type: "in",
    amount: 23.45,
    category: "Dizimo",
    description: `${recDescription}-sem-conta`,
    start_date: recStartDate,
    next_run_date: recStartDate,
    frequency: "monthly",
    account_id: null,
  });
  expect(recurrenceUpdateResponse.status()).toBe(200);

  const recurrenceDetailResponse = await page.request.get(`/api/recurrences/${recurrenceId}`, {
    headers: { Accept: "application/json" },
  });
  expect(recurrenceDetailResponse.status()).toBe(200);
  const recurrenceDetail = await recurrenceDetailResponse.json();
  expect(Number(recurrenceDetail?.id || 0)).toBe(recurrenceId);
  expect(Number(recurrenceDetail?.account_id || 0)).toBe(0);
  expect(Number(recurrenceDetail?.next_entry?.account_id || 0)).toBe(0);
});

test("fluxo critico: fechamento de mes marca lancamento novo como pendente de revisao", async ({ page }) => {
  const targetMonth = "2030-01";
  const targetDate = "2030-01-15";

  await loginViaUi(page, adminCreds);
  const targetUserId = await findSuiteUserIdAsAdmin(page);

  const closeMonthResponse = await authJson(page, "post", "/api/admin/close-month", {
    month: targetMonth,
    user_ids: [targetUserId],
    closed: true,
  });
  expect(closeMonthResponse.status()).toBe(200);
  const closeMonth = await closeMonthResponse.json();
  expect(Number(closeMonth?.summary?.locks_updated || 0)).toBeGreaterThan(0);

  const logoutResponse = await authJson(page, "post", "/api/auth/logout", {});
  expect(logoutResponse.status()).toBe(200);

  await loginViaUi(page, userCreds);

  const entryInClosedMonthResponse = await authJson(page, "post", "/api/entries", {
    type: "in",
    amount: 80,
    category: "Salario",
    description: "e2e-fechamento-mes",
    date: targetDate,
  });
  expect(entryInClosedMonthResponse.status()).toBe(201);
  const entryInClosedMonth = await entryInClosedMonthResponse.json();
  expect(Number(entryInClosedMonth?.needs_review || 0)).toBe(1);

  const summaryResponse = await page.request.get(`/api/entries/summary?start=${targetMonth}-01&end=${targetMonth}-31`, {
    headers: { Accept: "application/json" },
  });
  expect(summaryResponse.status()).toBe(200);
  const summary = await summaryResponse.json();
  expect(Boolean(summary?.has_locked)).toBeTruthy();
});
