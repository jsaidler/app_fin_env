#!/usr/bin/env python3
from __future__ import annotations

import subprocess
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


def test_static_smoke() -> None:
    index_html = read_utf8(ROOT / "public" / "index.html")
    dashboard_html = read_utf8(ROOT / "public" / "dashboard.html")
    manifest = read_utf8(ROOT / "public" / "manifest.json")
    app_js = read_utf8(ROOT / "public" / "assets" / "js" / "app.js")
    dashboard_js = read_utf8(ROOT / "public" / "assets" / "js" / "dashboard.js")
    front_controller = read_utf8(ROOT / "public" / "index.php")

    assert_contains(index_html, ["rel=\"manifest\"", "id=\"login-form\""], "public/index.html")
    assert_contains(dashboard_html, ["<ion-app", "id=\"sec-contas\"", "id=\"sec-categorias\""], "public/dashboard.html")
    assert_contains(manifest, ["\"display\": \"standalone\"", "\"start_url\": \"/dashboard\""], "public/manifest.json")
    assert_contains(app_js, ["register(\"/service-worker.js\")"], "public/assets/js/app.js")
    assert_contains(dashboard_js, [".register(\"/service-worker.js\")", "loadDashboard()"], "public/assets/js/dashboard.js")
    assert_contains(front_controller, ["/api/reports/aggregate", "/api/reports/entries-groups"], "public/index.php")


def run_integration_suite() -> None:
    proc = subprocess.run(
        [sys.executable, str(ROOT / "tests" / "integration_api_suite.py")],
        cwd=str(ROOT),
        text=True,
    )
    if proc.returncode != 0:
        raise AssertionError(f"integration_api_suite failed with exit code {proc.returncode}")


def main() -> int:
    tests = [
        ("static_smoke", test_static_smoke),
        ("integration_api_suite", run_integration_suite),
    ]
    failures = 0
    for name, fn in tests:
        try:
            fn()
            print(f"[PASS] {name}")
        except AssertionError as exc:
            failures += 1
            print(f"[FAIL] {name}: {exc}")
    if failures:
        print(f"{failures} suite(s) failed.")
        return 1
    print("All suites passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
