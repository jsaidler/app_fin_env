#!/usr/bin/env python3
from __future__ import annotations

import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def read_utf8(path: Path) -> str:
    try:
        return path.read_text(encoding="utf-8")
    except UnicodeDecodeError as exc:
        raise AssertionError(f"{path}: not valid UTF-8 ({exc})")
    except FileNotFoundError:
        raise AssertionError(f"{path}: file not found")


def assert_contains(text: str, needles: list[str], label: str) -> None:
    missing = [n for n in needles if n not in text]
    if missing:
        raise AssertionError(f"{label}: expected tokens not found: {', '.join(missing)}")


def assert_not_contains(text: str, needles: list[str], label: str) -> None:
    found = [n for n in needles if n in text]
    if found:
        raise AssertionError(f"{label}: unexpected tokens: {', '.join(found)}")


def test_login_screen() -> None:
    index = read_utf8(ROOT / "public" / "index.html")
    css = read_utf8(ROOT / "public" / "assets" / "css" / "app.css")
    app_js = read_utf8(ROOT / "public" / "assets" / "js" / "app.js")

    assert_contains(index, ["id=\"login-form\"", "id=\"login-email\"", "id=\"login-password\""], "public/index.html")
    assert_contains(index, ['<script type="module" src="/assets/js/app.js"></script>'], "public/index.html")
    assert_contains(index, ["viewport-fit=cover", "rel=\"manifest\""], "public/index.html")
    assert_contains(index, ["/assets/css/tokens.css", "/assets/css/components.css", "login-brand__logo"], "public/index.html")

    assert_contains(css, ["--safe-top", "--safe-bottom", "min-height: 100dvh", ".login-brand", ".login-stage"], "public/assets/css/app.css")

    assert_contains(app_js, ["/api/auth/login", "credentials: \"same-origin\"", "/dashboard"], "public/assets/js/app.js")
    assert_contains(app_js, ["serviceWorker", "register(\"/service-worker.js\")"], "public/assets/js/app.js")
    assert_not_contains(app_js, ["localStorage", "sessionStorage"], "public/assets/js/app.js")


def test_pwa_assets() -> None:
    manifest = read_utf8(ROOT / "public" / "manifest.json")
    sw = read_utf8(ROOT / "public" / "service-worker.js")

    assert_contains(manifest, ["\"display\": \"standalone\"", "\"start_url\": \"/\""], "public/manifest.json")
    assert_contains(sw, ["CACHE_NAME", "assets/css/app.css", "assets/css/dashboard.css", "pathname.startsWith(\"/api/\")", "self.addEventListener(\"install\""], "public/service-worker.js")


def test_dashboard_screen() -> None:
    dashboard = read_utf8(ROOT / "public" / "dashboard.html")
    dashboard_css = read_utf8(ROOT / "public" / "assets" / "css" / "dashboard.css")
    dashboard_js = read_utf8(ROOT / "public" / "assets" / "js" / "dashboard.js")
    front_controller = read_utf8(ROOT / "public" / "index.php")

    assert_contains(
        dashboard,
        ["<ion-app>", "<ion-toolbar>", "class=\"topbar-title\"", "class=\"tab-pill is-active\"", "<ion-list", "id=\"dash-menu-btn\"", "id=\"dash-refresh-menu\"", "id=\"dash-logout-menu\""],
        "public/dashboard.html",
    )
    assert_contains(dashboard, ["/assets/vendor/ionic/css/ionic.bundle.css", "/assets/vendor/ionic/dist/ionic/ionic.esm.js"], "public/dashboard.html")
    assert_contains(dashboard, ["/assets/css/dashboard.css", "/assets/js/dashboard.js"], "public/dashboard.html")
    assert_contains(dashboard_css, [".dash-shell", "ion-card.hero", ".tab-strip-scroll", ".tab-pill", ".row", ".budget-ring"], "public/assets/css/dashboard.css")
    assert_contains(dashboard_js, ["/api/account/profile", "/api/reports/aggregate", "/api/reports/summary", "/api/auth/logout", "dash-user-title"], "public/assets/js/dashboard.js")
    assert_contains(front_controller, ["'/dashboard'"], "public/index.php")


def test_backend_security_login() -> None:
    auth_controller = read_utf8(ROOT / "src" / "Controller" / "AuthController.php")
    auth_service = read_utf8(ROOT / "src" / "Service" / "AuthService.php")
    index_php = read_utf8(ROOT / "public" / "index.php")

    assert_contains(auth_controller, ["LoginThrottle", "consume(", "Retry-After", "Muitas tentativas"], "src/Controller/AuthController.php")
    assert_contains(auth_service, ["denyAuth", "Email ou senha incorretos", "random_int("], "src/Service/AuthService.php")
    assert_contains(index_php, ["Content-Security-Policy", "X-Frame-Options: DENY", "X-Content-Type-Options: nosniff"], "public/index.php")


def test_sqlite_only_backend() -> None:
    config = read_utf8(ROOT / "config" / "config.php")
    sqlite_conn = read_utf8(ROOT / "src" / "Storage" / "SqliteConnection.php")
    bootstrap = read_utf8(ROOT / "src" / "bootstrap.php")

    assert_contains(config, ["'driver' => 'sqlite'"], "config/config.php")
    assert_not_contains(sqlite_conn, ["importFromJsonIfEmpty", "decodeJson(", "extractLocks("], "src/Storage/SqliteConnection.php")
    assert_not_contains(bootstrap, ["migrates JSON if empty"], "src/bootstrap.php")

    removed = [
        ROOT / "src" / "Storage" / "MySqlConnection.php",
        ROOT / "src" / "Storage" / "JsonStorage.php",
    ]
    for path in removed:
        if path.exists():
            raise AssertionError(f"{path}: should not exist")


def main() -> int:
    tests = [
        test_login_screen,
        test_pwa_assets,
        test_dashboard_screen,
        test_backend_security_login,
        test_sqlite_only_backend,
    ]
    failures = 0
    for test in tests:
        try:
            test()
            print(f"[PASS] {test.__name__}")
        except AssertionError as exc:
            failures += 1
            print(f"[FAIL] {test.__name__}: {exc}")
    if failures:
        print(f"{failures} test(s) failed.")
        return 1
    print("All tests passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
