#!/usr/bin/env python3
from __future__ import annotations

import json
import os
import shutil
import socket
import sqlite3
import subprocess
import tempfile
import time
import unittest
import urllib.error
import urllib.parse
import urllib.request
from datetime import date, datetime, timezone
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]


def free_port() -> int:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(("127.0.0.1", 0))
        return int(s.getsockname()[1])


def php_hash(password: str) -> str:
    p = subprocess.run(["php", "-r", f"echo password_hash('{password}', PASSWORD_DEFAULT);"], cwd=str(ROOT), capture_output=True, text=True, check=True)
    return p.stdout.strip()


class Api:
    def __init__(self, base: str) -> None:
        self.base = base.rstrip("/")

    def call(self, method: str, path: str, token: str | None = None, params: dict[str, Any] | None = None, payload: Any = None, accept: str = "application/json") -> tuple[int, Any, str]:
        q = "?" + urllib.parse.urlencode(params, doseq=True) if params else ""
        url = f"{self.base}{path}{q}"
        headers = {"Accept": accept}
        body = None
        if payload is not None:
            body = json.dumps(payload).encode("utf-8")
            headers["Content-Type"] = "application/json"
        if token:
            headers["Authorization"] = f"Bearer {token}"
            headers["X-Auth-Token"] = token
        req = urllib.request.Request(url, data=body, method=method.upper(), headers=headers)
        try:
            with urllib.request.urlopen(req, timeout=12) as r:
                raw = r.read().decode("utf-8", errors="replace")
                return int(r.status), self._json(raw), raw
        except urllib.error.HTTPError as e:
            try:
                raw = e.read().decode("utf-8", errors="replace")
            except Exception:
                raw = ""
            return int(e.code), self._json(raw), raw

    @staticmethod
    def _json(raw: str) -> Any:
        raw = raw.strip()
        if not raw:
            return {}
        try:
            return json.loads(raw)
        except json.JSONDecodeError:
            return {"_raw": raw}


class IntegrationApiSuite(unittest.TestCase):
    proc: subprocess.Popen[str] | None = None
    workdir: Path | None = None
    db: Path | None = None
    api: Api
    base_url = ""
    admin_token = ""
    user_token = ""
    admin_id = 0
    user_id = 0
    ids: dict[str, int] = {}

    @classmethod
    def setUpClass(cls) -> None:
        runtime = ROOT / "tests" / "_runtime"
        runtime.mkdir(parents=True, exist_ok=True)
        cls.workdir = Path(tempfile.mkdtemp(prefix="api-suite-", dir=str(runtime)))
        cls.db = cls.workdir / "suite.sqlite"
        port = free_port()
        cls.base_url = f"http://127.0.0.1:{port}"
        cls.api = Api(cls.base_url)
        cls.ids = {}

        env = os.environ.copy()
        env["APP_ENV"] = "dev"
        env["APP_SECRET"] = "integration-suite-secret"
        env["DB_PATH"] = str(cls.db)
        cls.proc = subprocess.Popen(
            ["php", "-S", f"127.0.0.1:{port}", "-t", "public", "public/index.php"],
            cwd=str(ROOT),
            env=env,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            text=True,
        )
        cls.wait_ready()
        cls.seed()
        cls.login()

    @classmethod
    def tearDownClass(cls) -> None:
        if cls.proc:
            cls.proc.terminate()
            try:
                cls.proc.wait(timeout=5)
            except subprocess.TimeoutExpired:
                cls.proc.kill()
                cls.proc.wait(timeout=5)
        if cls.workdir and cls.workdir.exists():
            shutil.rmtree(cls.workdir, ignore_errors=True)

    @classmethod
    def wait_ready(cls) -> None:
        end = time.time() + 15
        while time.time() < end:
            if cls.proc and cls.proc.poll() is not None:
                raise AssertionError("php server exited")
            try:
                st, _, _ = cls.api.call("GET", "/")
                if st == 200:
                    return
            except Exception:
                pass
            time.sleep(0.2)
        raise AssertionError("server not ready")

    @classmethod
    def seed(cls) -> None:
        assert cls.db is not None
        cls.api.call("GET", "/")
        now = datetime.now(timezone.utc).isoformat()
        conn = sqlite3.connect(str(cls.db))
        try:
            cur = conn.cursor()
            cur.execute("INSERT INTO users (name,email,password_hash,role,theme,alterdata_code,created_at) VALUES (?,?,?,?,?,?,?)", ("Suite Admin", "admin.suite@local", php_hash("Admin#12345"), "admin", "dark", "", now))
            cls.admin_id = int(cur.lastrowid)
            cur.execute("INSERT INTO users (name,email,password_hash,role,theme,alterdata_code,created_at) VALUES (?,?,?,?,?,?,?)", ("Suite User", "user.suite@local", php_hash("User#12345"), "user", "dark", "", now))
            cls.user_id = int(cur.lastrowid)
            cur.execute("INSERT INTO categories (name,type,alterdata_auto,created_at,updated_at) VALUES (?,?,?,?,?)", ("Salario", "in", "AUTOIN", now, now))
            cls.ids["cat_salary"] = int(cur.lastrowid)
            cur.execute("INSERT INTO categories (name,type,alterdata_auto,created_at,updated_at) VALUES (?,?,?,?,?)", ("Gastos", "out", "AUTOOUT", now, now))
            cls.ids["cat_expense"] = int(cur.lastrowid)
            cur.execute("INSERT INTO categories (name,type,alterdata_auto,created_at,updated_at) VALUES (?,?,?,?,?)", ("Reserva", "in", "AUTORES", now, now))
            reserve = int(cur.lastrowid)
            cur.execute("INSERT INTO user_categories (user_id,name,icon,global_category_id,created_at,updated_at) VALUES (?,?,?,?,?,?)", (cls.user_id, "Dizimo", "savings", reserve, now, now))
            conn.commit()
        finally:
            conn.close()

    @classmethod
    def login(cls) -> None:
        st, p, raw = cls.api.call("POST", "/api/auth/login", payload={"email": "admin.suite@local", "password": "Admin#12345"})
        if st != 200:
            raise AssertionError(raw)
        cls.admin_token = str(p.get("token", ""))
        st, p, raw = cls.api.call("POST", "/api/auth/login", payload={"email": "user.suite@local", "password": "User#12345"})
        if st != 200:
            raise AssertionError(raw)
        cls.user_token = str(p.get("token", ""))

    def ok(self, st: int, raw: str) -> None:
        self.assertGreaterEqual(st, 200, raw)
        self.assertLess(st, 300, raw)

    def test_01_auth_account(self) -> None:
        st, p, raw = self.api.call("GET", "/api/account/profile", token=self.user_token); self.ok(st, raw); self.assertEqual(int(p.get("id", 0)), self.user_id)
        st, p, raw = self.api.call("PUT", "/api/account/preferences", token=self.user_token, payload={"theme": "light", "name": "Suite User Updated"}); self.ok(st, raw)
        st, _, raw = self.api.call("PUT", "/api/account/password", token=self.user_token, payload={"current_password": "User#12345", "password": "User#67890"}); self.assertEqual(st, 200, raw)
        st, p, raw = self.api.call("POST", "/api/auth/login", payload={"email": "user.suite@local", "password": "User#67890"}); self.assertEqual(st, 200, raw); self.user_token = str(p.get("token", ""))
        st, _, raw = self.api.call("POST", "/api/auth/password/forgot", payload={"email": "user.suite@local"}); self.assertEqual(st, 200, raw)
        st, _, raw = self.api.call("POST", "/api/auth/password/reset", payload={"token": "invalid", "password": "Another#12345"}); self.assertEqual(st, 422, raw)

    def test_02_accounts_categories_entries_reports(self) -> None:
        st, p, raw = self.api.call("POST", "/api/accounts", token=self.user_token, payload={"name": "Conta Suite", "type": "bank", "icon": "account_balance", "initial_balance": 0}); self.assertEqual(st, 201, raw); aid = int(p.get("id", 0)); self.ids["account"] = aid
        st, _, raw = self.api.call("PUT", f"/api/accounts/{aid}", token=self.user_token, payload={"name": "Conta Suite Updated", "type": "bank", "icon": "account_balance", "initial_balance": 10}); self.assertEqual(st, 200, raw)
        st, p, raw = self.api.call("POST", "/api/user-categories", token=self.user_token, payload={"name": "Categoria Suite", "icon": "sell", "global_category_id": self.ids["cat_expense"]}); self.assertEqual(st, 201, raw); cid = int(p.get("id", 0)); self.ids["ucat"] = cid
        st, _, raw = self.api.call("PUT", f"/api/user-categories/{cid}", token=self.user_token, payload={"name": "Categoria Suite Atualizada", "icon": "sell", "global_category_id": self.ids["cat_expense"]}); self.assertEqual(st, 200, raw)

        today = date.today().isoformat(); month = today[:7]
        st, p, raw = self.api.call("POST", "/api/entries", token=self.user_token, payload={"type": "in", "amount": 1000, "category": "Salario", "description": "suite-income", "date": today, "account_id": aid}); self.assertEqual(st, 201, raw); ein = int(p.get("id", 0))
        st, p, raw = self.api.call("POST", "/api/entries", token=self.user_token, payload={"type": "out", "amount": 200, "category": "Gastos", "description": "suite-expense", "date": today}); self.assertEqual(st, 201, raw); eout = int(p.get("id", 0))
        st, _, raw = self.api.call("PUT", f"/api/entries/{eout}", token=self.user_token, payload={"type": "out", "amount": 210, "category": "Categoria Suite Atualizada", "description": "suite-expense-updated", "date": today}); self.assertEqual(st, 200, raw)
        st, _, raw = self.api.call("GET", "/api/entries", token=self.user_token); self.assertEqual(st, 200, raw)
        st, s, raw = self.api.call("GET", "/api/entries/summary", token=self.user_token, params={"start": f"{month}-01", "end": f"{month}-31"}); self.ok(st, raw); self.assertIn("totals", s)
        st, a, raw = self.api.call("GET", "/api/reports/aggregate", token=self.user_token, params={"start": f"{month}-01", "end": f"{month}-31"}); self.ok(st, raw); self.assertGreaterEqual(int((a.get("totals") or {}).get("count", 0)), 2)
        st, g, raw = self.api.call("GET", "/api/reports/entries-groups", token=self.user_token, params={"start": f"{month}-01", "end": f"{month}-31", "type": "all"}); self.ok(st, raw); self.assertGreaterEqual(int(g.get("count", 0)), 2)
        st, _, raw = self.api.call("DELETE", f"/api/entries/{ein}", token=self.user_token); self.assertEqual(st, 200, raw)
        st, t, raw = self.api.call("GET", "/api/entries/trash", token=self.user_token); self.ok(st, raw); self.assertTrue(any(int(x.get("id", 0)) == ein for x in t if isinstance(x, dict)), raw)
        st, _, raw = self.api.call("PUT", f"/api/entries/{ein}/restore", token=self.user_token, payload={}); self.assertEqual(st, 200, raw)
        st, _, raw = self.api.call("DELETE", f"/api/entries/{ein}", token=self.user_token); self.assertEqual(st, 200, raw)
        st, p, raw = self.api.call("DELETE", f"/api/entries/{ein}/purge", token=self.user_token); self.ok(st, raw); self.assertTrue(bool(p.get("deleted", False)), raw)
        st, p, raw = self.api.call("DELETE", f"/api/accounts/{aid}", token=self.user_token); self.ok(st, raw); self.assertTrue(bool(p.get("deactivated", False)) or bool(p.get("deleted", False)), raw)
        st, _, raw = self.api.call("DELETE", f"/api/user-categories/{cid}", token=self.user_token); self.assertEqual(st, 200, raw)

    def test_03_recurrence_support_user(self) -> None:
        today = date.today().isoformat()
        st, p, raw = self.api.call("POST", "/api/accounts", token=self.user_token, payload={"name": "Conta Rec", "type": "bank", "icon": "account_balance", "initial_balance": 0}); self.assertEqual(st, 201, raw); aid = int(p.get("id", 0))
        st, p, raw = self.api.call("POST", "/api/recurrences", token=self.user_token, payload={"type": "out", "amount": 50, "category": "Gastos", "description": "suite-rec", "frequency": "monthly", "start_date": today, "next_run_date": today, "account_id": aid}); self.assertEqual(st, 201, raw); rid = int(p.get("id", 0))
        st, _, raw = self.api.call("GET", "/api/recurrences", token=self.user_token); self.assertEqual(st, 200, raw)
        st, d, raw = self.api.call("GET", f"/api/recurrences/{rid}", token=self.user_token); self.ok(st, raw); self.assertEqual(int(d.get("id", 0)), rid)
        st, _, raw = self.api.call("PUT", f"/api/recurrences/{rid}", token=self.user_token, payload={"type": "out", "amount": 75, "category": "Gastos", "description": "suite-rec-updated", "frequency": "weekly", "start_date": today, "next_run_date": today, "account_id": aid}); self.assertEqual(st, 200, raw)
        st, _, raw = self.api.call("DELETE", f"/api/recurrences/{rid}", token=self.user_token); self.assertEqual(st, 200, raw)
        st, _, raw = self.api.call("GET", "/api/reports/summary", token=self.user_token); self.assertEqual(st, 200, raw)
        st, _, raw = self.api.call("GET", "/api/reports/closure", token=self.user_token, params={"month": today[:7]}); self.assertEqual(st, 200, raw)

        st, p, raw = self.api.call("POST", "/api/support/threads", token=self.user_token, payload={"subject": "Suite suporte user"}); self.assertEqual(st, 201, raw); tid = int(p.get("id", 0)); self.ids["thread"] = tid
        st, _, raw = self.api.call("POST", "/api/support/messages", token=self.user_token, payload={"thread_id": tid, "message": "msg user"}); self.assertEqual(st, 201, raw)
        st, _, raw = self.api.call("GET", "/api/support/messages", token=self.user_token, params={"thread_id": tid}); self.assertEqual(st, 200, raw)

    def test_04_admin_core_flows(self) -> None:
        st, _, raw = self.api.call("GET", "/api/admin/users", token=self.user_token); self.assertEqual(st, 403, raw)
        st, _, raw = self.api.call("GET", "/api/admin/users", token=self.admin_token); self.assertEqual(st, 200, raw)
        st, p, raw = self.api.call("POST", "/api/admin/users", token=self.admin_token, payload={"name": "Suite Extra", "email": "extra.suite@local", "password": "Extra#12345", "role": "user"}); self.assertEqual(st, 201, raw); uid = int(p.get("id", 0))
        st, _, raw = self.api.call("PUT", f"/api/admin/users/{uid}", token=self.admin_token, payload={"name": "Suite Extra Updated"}); self.assertEqual(st, 200, raw)
        st, _, raw = self.api.call("GET", f"/api/admin/users/{self.user_id}/stats", token=self.admin_token); self.assertEqual(st, 200, raw)
        st, p, raw = self.api.call("POST", f"/api/admin/users/{self.user_id}/impersonate", token=self.admin_token, payload={}); self.assertEqual(st, 200, raw); imp = str(p.get("token", ""))
        st, p, raw = self.api.call("GET", "/api/account/profile", token=imp); self.ok(st, raw); self.assertTrue(bool((p.get("impersonation") or {}).get("active", False)), raw)
        st, _, raw = self.api.call("DELETE", f"/api/admin/users/{uid}", token=self.admin_token); self.assertEqual(st, 200, raw)

    def test_05_admin_categories_entries_support_export(self) -> None:
        today = date.today().isoformat(); month = today[:7]
        st, p, raw = self.api.call("POST", "/api/admin/categories", token=self.admin_token, payload={"name": "Suite Global", "type": "out", "alterdata_auto": "SUITEA"}); self.assertEqual(st, 201, raw); cid = int(p.get("id", 0))
        st, _, raw = self.api.call("PUT", f"/api/admin/categories/{cid}", token=self.admin_token, payload={"name": "Suite Global Updated", "type": "out", "alterdata_auto": "SUITEB"}); self.assertEqual(st, 200, raw)
        st, _, raw = self.api.call("GET", f"/api/admin/categories/{cid}/stats", token=self.admin_token); self.assertEqual(st, 200, raw)
        st, _, raw = self.api.call("DELETE", f"/api/admin/categories/{cid}", token=self.admin_token); self.assertEqual(st, 200, raw)

        st, p, raw = self.api.call("POST", "/api/accounts", token=self.user_token, payload={"name": "Conta Admin Entry", "type": "bank", "icon": "account_balance", "initial_balance": 0}); self.assertEqual(st, 201, raw); aid = int(p.get("id", 0))
        st, p, raw = self.api.call("POST", "/api/admin/entries", token=self.admin_token, payload={"user_id": self.user_id, "type": "out", "amount": 33, "category": "Gastos", "description": "admin-entry", "date": today, "account_id": aid}); self.assertEqual(st, 201, raw); eid = int(p.get("id", 0))
        st, _, raw = self.api.call("GET", "/api/admin/entries", token=self.admin_token, params={"user_id": self.user_id}); self.assertEqual(st, 200, raw)
        st, _, raw = self.api.call("PUT", f"/api/admin/entries/{eid}", token=self.admin_token, payload={"user_id": self.user_id, "type": "out", "amount": 44, "category": "Gastos", "description": "admin-entry-upd", "date": today, "account_id": aid}); self.assertEqual(st, 200, raw)
        st, _, raw = self.api.call("PUT", f"/api/admin/entries/{eid}/approve", token=self.admin_token, payload={}); self.assertEqual(st, 200, raw)
        st, _, raw = self.api.call("PUT", f"/api/admin/entries/{eid}/reject", token=self.admin_token, payload={}); self.assertEqual(st, 200, raw)
        st, _, raw = self.api.call("DELETE", f"/api/admin/entries/{eid}", token=self.admin_token); self.assertEqual(st, 200, raw)

        st, _, raw = self.api.call("POST", "/api/admin/close-month", token=self.admin_token, payload={"month": month, "closed": True, "user_ids": [self.user_id]}); self.assertEqual(st, 200, raw)
        st, _, raw = self.api.call("GET", "/api/admin/close-month/history", token=self.admin_token); self.assertEqual(st, 200, raw)
        st, _, raw = self.api.call("GET", "/api/admin/closed-months", token=self.admin_token); self.assertEqual(st, 200, raw)
        st, _, raw = self.api.call("GET", "/api/admin/reports/closure", token=self.admin_token, params={"month": month, "user_id": self.user_id}); self.assertEqual(st, 200, raw)

        tid = int(self.ids.get("thread", 0))
        self.assertGreater(tid, 0)
        st, _, raw = self.api.call("GET", "/api/admin/support/threads", token=self.admin_token); self.assertEqual(st, 200, raw)
        st, _, raw = self.api.call("GET", "/api/admin/support/messages", token=self.admin_token, params={"thread_id": tid}); self.assertEqual(st, 200, raw)
        st, _, raw = self.api.call("POST", "/api/admin/support/messages", token=self.admin_token, payload={"thread_id": tid, "message": "resposta admin"}); self.assertEqual(st, 201, raw)
        st, _, raw = self.api.call("POST", "/api/admin/support/threads", token=self.admin_token, payload={"user_id": self.user_id, "subject": "thread admin"}); self.assertEqual(st, 201, raw)

        st, _, raw = self.api.call("GET", "/api/admin/users/{}".format(self.user_id) + "/categories", token=self.admin_token); self.assertEqual(st, 200, raw)
        st, _, raw = self.api.call("GET", "/api/admin/users/{}".format(self.user_id) + "/accounts", token=self.admin_token); self.assertEqual(st, 200, raw)
        st, _, raw = self.api.call("GET", "/api/admin/users/{}".format(self.user_id) + "/recurrences", token=self.admin_token); self.assertEqual(st, 200, raw)

        st, _, raw = self.api.call("GET", "/api/admin/export/alterdata/config", token=self.admin_token); self.assertEqual(st, 200, raw)
        st, _, raw = self.api.call("PUT", "/api/admin/export/alterdata/config/H", token=self.admin_token, payload={"source_scope": "fixed", "source_field": "value", "fixed_value": "OBS"}); self.assertEqual(st, 200, raw)
        st, _, raw = self.api.call("GET", "/api/admin/export/alterdata", token=self.admin_token, params={"month": month, "user_id": self.user_id}, accept="text/plain"); self.assertIn(st, (200, 422), raw)
        st, _, raw = self.api.call("GET", "/api/admin/export/alterdata/history", token=self.admin_token); self.assertEqual(st, 200, raw)
        st, _, raw = self.api.call("GET", "/api/export/pdf", token=self.user_token, params={"month": month, "type": "all"}, accept="application/pdf"); self.assertEqual(st, 200, raw)


if __name__ == "__main__":
    unittest.main(verbosity=2)
