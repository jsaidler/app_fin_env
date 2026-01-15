#!/usr/bin/env python3
from __future__ import annotations

import re
import sys
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


def read_utf8(path: Path) -> str:
    try:
        return path.read_text(encoding="utf-8")
    except UnicodeDecodeError as exc:
        raise AssertionError(f"{path}: not valid UTF-8 ({exc})")


def html_ids(html: str) -> set[str]:
    return set(re.findall(r'id="([^"]+)"', html))


def assert_ids_present(ids: set[str], required: list[str], label: str) -> None:
    missing = [item for item in required if item not in ids]
    if missing:
        raise AssertionError(f"{label}: missing ids: {', '.join(missing)}")


def assert_not_contains(text: str, needles: list[str], label: str) -> None:
    found = [n for n in needles if n in text]
    if found:
        raise AssertionError(f"{label}: unexpected tokens: {', '.join(found)}")


def assert_contains(text: str, needles: list[str], label: str) -> None:
    missing = [n for n in needles if n not in text]
    if missing:
        raise AssertionError(f"{label}: expected tokens not found: {', '.join(missing)}")


def test_html_utf8_and_ids() -> None:
    index = read_utf8(ROOT / "public" / "index.html")
    admin = read_utf8(ROOT / "public" / "admin.html")

    assert_not_contains(
        index,
        ["Sa¡", "lan‡", "Movimenta‡", "VisÆo", "Mˆs", "\ufffd"],
        "public/index.html",
    )

    index_ids = html_ids(index)
    admin_ids = html_ids(admin)

    assert_ids_present(
        index_ids,
        [
            "filter-type",
            "filter-start",
            "filter-end",
            "report-type",
            "report-start",
            "report-end",
            "entry-category",
            "entry-date",
            "entry-amount",
            "entry-form",
        ],
        "public/index.html",
    )

    assert_ids_present(
        admin_ids,
        [
            "admin-impersonate-user",
            "admin-entry-type",
            "admin-entry-category",
            "admin-filter-type",
            "admin-filter-start",
            "admin-filter-end",
            "admin-export-type",
            "admin-export-user",
        ],
        "public/admin.html",
    )


def test_no_legacy_month_ids() -> None:
    app_js = read_utf8(ROOT / "public" / "assets" / "js" / "app.js")
    admin_js = read_utf8(ROOT / "public" / "assets" / "js" / "admin.js")
    index = read_utf8(ROOT / "public" / "index.html")
    admin = read_utf8(ROOT / "public" / "admin.html")

    assert_not_contains(app_js, ["filter-month", "report-month"], "public/assets/js/app.js")
    assert_not_contains(admin_js, ["admin-filter-month"], "public/assets/js/admin.js")
    assert_not_contains(index, ["filter-month", "report-month"], "public/index.html")
    assert_not_contains(admin, ["admin-filter-month"], "public/admin.html")


def test_searchable_select_hooks() -> None:
    app_js = read_utf8(ROOT / "public" / "assets" / "js" / "app.js")
    admin_js = read_utf8(ROOT / "public" / "assets" / "js" / "admin.js")
    ui_js = read_utf8(ROOT / "public" / "assets" / "js" / "ui.js")

    assert_contains(
        app_js,
        ["ui.enhanceSelect('filter-type')", "ui.enhanceSelect('report-type')", "ui.enhanceSelect('entry-category')"],
        "public/assets/js/app.js",
    )
    assert_contains(admin_js, ["enhanceAdminSelects();"], "public/assets/js/admin.js")
    assert_contains(ui_js, ["enhanceSelect(", "select-search"], "public/assets/js/ui.js")


def test_backend_range_support() -> None:
    admin_controller = read_utf8(ROOT / "src" / "Controller" / "AdminController.php")
    export_controller = read_utf8(ROOT / "src" / "Controller" / "ExportController.php")
    export_service = read_utf8(ROOT / "src" / "Service" / "ExportService.php")
    sqlite_repo = read_utf8(ROOT / "src" / "Repository" / "Sqlite" / "SqliteEntryRepository.php")
    mysql_repo = read_utf8(ROOT / "src" / "Repository" / "MySql" / "MySqlEntryRepository.php")
    json_repo = read_utf8(ROOT / "src" / "Repository" / "Json" / "JsonEntryRepository.php")

    assert_contains(admin_controller, ["normalizeRange", "'start' =>", "'end' =>"], "src/Controller/AdminController.php")
    assert_contains(
        export_controller,
        ["normalizeRange", "$filters['start']", "$filters['end']"],
        "src/Controller/ExportController.php",
    )
    assert_contains(export_service, ["formatPeriodLabel", "start", "end"], "src/Service/ExportService.php")
    assert_contains(sqlite_repo, ["date >= :start", "date <= :end"], "src/Repository/Sqlite/SqliteEntryRepository.php")
    assert_contains(mysql_repo, ["date >= :start", "date <= :end"], "src/Repository/MySql/MySqlEntryRepository.php")
    assert_contains(json_repo, ["filters['start']", "filters['end']"], "src/Repository/Json/JsonEntryRepository.php")


def main() -> int:
    tests = [
        test_html_utf8_and_ids,
        test_no_legacy_month_ids,
        test_searchable_select_hooks,
        test_backend_range_support,
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
