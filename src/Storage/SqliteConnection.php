<?php
declare(strict_types=1);

namespace App\Storage;

use PDO;
use RuntimeException;

class SqliteConnection
{
    private const SCHEMA_VERSION = 2026030602;
    private static ?PDO $pdo = null;

    public static function make(string $dbPath): PDO
    {
        if (self::$pdo instanceof PDO) {
            return self::$pdo;
        }
        if (!in_array('sqlite', PDO::getAvailableDrivers(), true)) {
            throw new RuntimeException('Driver PDO SQLite ausente. Ative a extensao pdo_sqlite no PHP da hospedagem.');
        }
        $dir = dirname($dbPath);
        if (!is_dir($dir)) {
            mkdir($dir, 0775, true);
        }
        $pdo = new PDO('sqlite:' . $dbPath, null, null, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
        $pdo->exec('PRAGMA foreign_keys = ON');
        self::migrate($pdo);
        self::$pdo = $pdo;
        return $pdo;
    }

    private static function migrate(PDO $pdo): void
    {
        $currentVersion = 0;
        try {
            $currentVersion = (int)($pdo->query('PRAGMA user_version')->fetchColumn() ?: 0);
        } catch (\Throwable) {
            $currentVersion = 0;
        }
        if ($currentVersion >= self::SCHEMA_VERSION) {
            return;
        }

        $pdo->exec('CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            password_hash TEXT NOT NULL,
            role TEXT NOT NULL DEFAULT "user",
            theme TEXT NOT NULL DEFAULT "dark",
            alterdata_code TEXT,
            created_at TEXT NOT NULL
        )');

        $pdo->exec('CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            type TEXT NOT NULL,
            icon TEXT NOT NULL DEFAULT "",
            color TEXT NOT NULL DEFAULT "",
            alterdata_auto TEXT,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        )');

        $pdo->exec('CREATE TABLE IF NOT EXISTS user_categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            icon TEXT NOT NULL DEFAULT "label",
            color TEXT NOT NULL DEFAULT "",
            global_category_id INTEGER NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY(global_category_id) REFERENCES categories(id) ON DELETE CASCADE
        )');
        $pdo->exec('CREATE INDEX IF NOT EXISTS idx_user_categories_user ON user_categories(user_id)');
        $pdo->exec('CREATE INDEX IF NOT EXISTS idx_user_categories_global ON user_categories(global_category_id)');
        $pdo->exec('CREATE UNIQUE INDEX IF NOT EXISTS idx_user_categories_user_name_nocase ON user_categories(user_id, name COLLATE NOCASE)');

        $pdo->exec('CREATE TABLE IF NOT EXISTS user_accounts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            type TEXT NOT NULL,
            icon TEXT NOT NULL DEFAULT "account_balance_wallet",
            color TEXT NOT NULL DEFAULT "",
            initial_balance REAL NOT NULL DEFAULT 0,
            active INTEGER NOT NULL DEFAULT 1,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
        )');
        $pdo->exec('CREATE INDEX IF NOT EXISTS idx_user_accounts_user ON user_accounts(user_id)');
        $pdo->exec('CREATE INDEX IF NOT EXISTS idx_user_accounts_active ON user_accounts(active)');
        $pdo->exec('CREATE UNIQUE INDEX IF NOT EXISTS idx_user_accounts_user_name_nocase ON user_accounts(user_id, name COLLATE NOCASE)');

        $pdo->exec('CREATE TABLE IF NOT EXISTS entries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            type TEXT NOT NULL,
            amount REAL NOT NULL,
            category TEXT NOT NULL,
            category_id INTEGER,
            account_id INTEGER,
            description TEXT,
            date TEXT NOT NULL,
            attachment_path TEXT,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            deleted_at TEXT,
            deleted_type TEXT,
            FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY(category_id) REFERENCES categories(id) ON DELETE SET NULL,
            FOREIGN KEY(account_id) REFERENCES user_accounts(id) ON DELETE SET NULL
        )');
        $pdo->exec('CREATE INDEX IF NOT EXISTS idx_entries_user_date ON entries(user_id, date)');
        $pdo->exec('CREATE INDEX IF NOT EXISTS idx_entries_deleted ON entries(deleted_at)');

        $pdo->exec('CREATE TABLE IF NOT EXISTS recurrences (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            type TEXT NOT NULL,
            amount REAL NOT NULL,
            category TEXT NOT NULL,
            category_id INTEGER,
            account_id INTEGER,
            description TEXT,
            frequency TEXT NOT NULL,
            start_date TEXT NOT NULL,
            next_run_date TEXT NOT NULL,
            last_run_date TEXT,
            active INTEGER NOT NULL DEFAULT 1,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY(category_id) REFERENCES categories(id) ON DELETE SET NULL,
            FOREIGN KEY(account_id) REFERENCES user_accounts(id) ON DELETE CASCADE
        )');
        $pdo->exec('CREATE INDEX IF NOT EXISTS idx_recurrences_user_active_next ON recurrences(user_id, active, next_run_date)');
        $pdo->exec('CREATE INDEX IF NOT EXISTS idx_recurrences_account ON recurrences(account_id)');

        $pdo->exec('CREATE TABLE IF NOT EXISTS recurrence_runs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            recurrence_id INTEGER NOT NULL,
            scheduled_date TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT "pending",
            entry_id INTEGER,
            executed_at TEXT,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY(recurrence_id) REFERENCES recurrences(id) ON DELETE CASCADE,
            FOREIGN KEY(entry_id) REFERENCES entries(id) ON DELETE SET NULL
        )');
        $pdo->exec('CREATE INDEX IF NOT EXISTS idx_recurrence_runs_user_date ON recurrence_runs(user_id, scheduled_date DESC)');
        $pdo->exec('CREATE INDEX IF NOT EXISTS idx_recurrence_runs_recurrence ON recurrence_runs(recurrence_id)');
        $pdo->exec('CREATE INDEX IF NOT EXISTS idx_recurrence_runs_status ON recurrence_runs(status)');
        $pdo->exec('CREATE UNIQUE INDEX IF NOT EXISTS idx_recurrence_runs_unique ON recurrence_runs(recurrence_id, scheduled_date)');

        $pdo->exec('CREATE TABLE IF NOT EXISTS month_locks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            month TEXT NOT NULL,
            closed INTEGER NOT NULL DEFAULT 1,
            updated_at TEXT NOT NULL,
            UNIQUE(user_id, month),
            FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
        )');
        $pdo->exec('CREATE INDEX IF NOT EXISTS idx_month_locks_month ON month_locks(month)');

        $pdo->exec('CREATE TABLE IF NOT EXISTS admin_notifications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            entry_id INTEGER NOT NULL,
            action TEXT NOT NULL,
            month TEXT NOT NULL,
            payload TEXT,
            created_at TEXT NOT NULL,
            read_at TEXT,
            FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY(entry_id) REFERENCES entries(id) ON DELETE CASCADE
        )');
        $pdo->exec('CREATE INDEX IF NOT EXISTS idx_admin_notifications_read ON admin_notifications(read_at)');
        $pdo->exec('CREATE INDEX IF NOT EXISTS idx_admin_notifications_month ON admin_notifications(month)');

        $pdo->exec('CREATE TABLE IF NOT EXISTS admin_activity_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            action TEXT NOT NULL,
            month TEXT,
            actor_user_id INTEGER,
            actor_name TEXT,
            actor_email TEXT,
            users_affected INTEGER NOT NULL DEFAULT 0,
            records_affected INTEGER NOT NULL DEFAULT 0,
            payload TEXT,
            created_at TEXT NOT NULL,
            FOREIGN KEY(actor_user_id) REFERENCES users(id) ON DELETE SET NULL
        )');
        $pdo->exec('CREATE INDEX IF NOT EXISTS idx_admin_activity_action_created ON admin_activity_logs(action, created_at DESC)');
        $pdo->exec('CREATE INDEX IF NOT EXISTS idx_admin_activity_month ON admin_activity_logs(month)');

        $pdo->exec('CREATE TABLE IF NOT EXISTS alterdata_export_columns (
            column_code TEXT PRIMARY KEY,
            source_scope TEXT NOT NULL,
            source_field TEXT NOT NULL,
            fixed_value TEXT,
            updated_at TEXT NOT NULL
        )');

        $pdo->exec('CREATE TABLE IF NOT EXISTS support_messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            thread_id INTEGER,
            sender_role TEXT NOT NULL,
            message TEXT NOT NULL,
            attachment_path TEXT,
            created_at TEXT NOT NULL,
            read_at TEXT,
            FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
        )');
        self::ensureColumn($pdo, 'support_messages', 'thread_id', 'INTEGER');
        self::ensureColumn($pdo, 'support_messages', 'attachment_path', 'TEXT');
        self::ensureColumn($pdo, 'support_messages', 'attachment_type', 'TEXT');
        self::ensureColumn($pdo, 'support_messages', 'attachment_ref_type', 'TEXT');
        self::ensureColumn($pdo, 'support_messages', 'attachment_ref_id', 'INTEGER');
        self::ensureColumn($pdo, 'support_messages', 'attachment_title', 'TEXT');
        $pdo->exec('CREATE INDEX IF NOT EXISTS idx_support_messages_user ON support_messages(user_id)');
        $pdo->exec('CREATE INDEX IF NOT EXISTS idx_support_messages_thread ON support_messages(thread_id)');
        $pdo->exec('CREATE INDEX IF NOT EXISTS idx_support_messages_read ON support_messages(read_at)');

        $pdo->exec('CREATE TABLE IF NOT EXISTS support_threads (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            subject TEXT NOT NULL,
            entry_id INTEGER,
            created_by_role TEXT NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            closed_at TEXT,
            FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY(entry_id) REFERENCES entries(id) ON DELETE SET NULL
        )');
        $pdo->exec('CREATE INDEX IF NOT EXISTS idx_support_threads_user ON support_threads(user_id)');
        $pdo->exec('CREATE INDEX IF NOT EXISTS idx_support_threads_entry ON support_threads(entry_id)');

        $pdo->exec('CREATE TABLE IF NOT EXISTS password_resets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            token_hash TEXT NOT NULL UNIQUE,
            requested_ip TEXT,
            created_at TEXT NOT NULL,
            expires_at TEXT NOT NULL,
            used_at TEXT,
            FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
        )');
        $pdo->exec('CREATE INDEX IF NOT EXISTS idx_password_resets_user ON password_resets(user_id)');
        $pdo->exec('CREATE INDEX IF NOT EXISTS idx_password_resets_expires ON password_resets(expires_at)');
        $pdo->exec('CREATE INDEX IF NOT EXISTS idx_password_resets_used ON password_resets(used_at)');

        self::ensureColumn($pdo, 'users', 'alterdata_code', 'TEXT');
        self::ensureColumn($pdo, 'users', 'token_version', 'INTEGER NOT NULL DEFAULT 0');
        self::ensureColumn($pdo, 'categories', 'alterdata_auto', 'TEXT');
        self::ensureColumn($pdo, 'categories', 'account_class', 'TEXT NOT NULL DEFAULT "synthetic"');
        self::ensureColumn($pdo, 'categories', 'parent_category_id', 'INTEGER');
        self::ensureColumn($pdo, 'categories', 'allows_analytic_children', 'INTEGER NOT NULL DEFAULT 1');
        self::ensureColumn($pdo, 'categories', 'owner_user_id', 'INTEGER');
        self::ensureColumn($pdo, 'categories', 'icon', 'TEXT NOT NULL DEFAULT ""');
        self::ensureColumn($pdo, 'categories', 'color', 'TEXT NOT NULL DEFAULT ""');
        self::ensureColumn($pdo, 'user_categories', 'color', 'TEXT NOT NULL DEFAULT ""');
        self::ensureColumn($pdo, 'user_accounts', 'color', 'TEXT NOT NULL DEFAULT ""');
        self::ensureColumn($pdo, 'user_accounts', 'initial_balance', 'REAL NOT NULL DEFAULT 0');
        self::ensureColumn($pdo, 'entries', 'account_id', 'INTEGER');
        self::ensureColumn($pdo, 'entries', 'category_id', 'INTEGER');
        self::ensureColumn($pdo, 'entries', 'needs_review', 'INTEGER NOT NULL DEFAULT 0');
        self::ensureColumn($pdo, 'entries', 'reviewed_at', 'TEXT');
        self::ensureColumn($pdo, 'entries', 'valid_amount', 'REAL');
        self::ensureColumn($pdo, 'entries', 'recurrence_id', 'INTEGER');
        self::ensureColumn($pdo, 'entries', 'last_modified_by_user_id', 'INTEGER');
        self::ensureColumn($pdo, 'entries', 'last_modified_at', 'TEXT');
        self::ensureColumn($pdo, 'categories', 'last_modified_by_user_id', 'INTEGER');
        self::ensureColumn($pdo, 'categories', 'last_modified_at', 'TEXT');
        self::ensureColumn($pdo, 'user_categories', 'account_class', 'TEXT NOT NULL DEFAULT "analytic"');
        self::ensureColumn($pdo, 'user_categories', 'last_modified_by_user_id', 'INTEGER');
        self::ensureColumn($pdo, 'user_categories', 'last_modified_at', 'TEXT');
        self::ensureColumn($pdo, 'recurrences', 'category_id', 'INTEGER');
        self::migrateRecurrencesOptionalAccount($pdo);
        $pdo->exec('CREATE INDEX IF NOT EXISTS idx_entries_account_id ON entries(account_id)');
        $pdo->exec('CREATE INDEX IF NOT EXISTS idx_entries_category_id ON entries(category_id)');
        $pdo->exec('CREATE INDEX IF NOT EXISTS idx_entries_recurrence_id ON entries(recurrence_id)');
        $pdo->exec('CREATE INDEX IF NOT EXISTS idx_entries_last_modified_by ON entries(last_modified_by_user_id)');
        // Composite indexes aligned with dashboard/report filters.
        $pdo->exec('CREATE INDEX IF NOT EXISTS idx_entries_user_deleted_date_id ON entries(user_id, deleted_at, date DESC, id DESC)');
        $pdo->exec('CREATE INDEX IF NOT EXISTS idx_entries_user_account_deleted_date ON entries(user_id, account_id, deleted_at, date DESC)');
        $pdo->exec('CREATE INDEX IF NOT EXISTS idx_entries_user_review_deleted_date ON entries(user_id, needs_review, deleted_at, date DESC)');
        $pdo->exec('CREATE INDEX IF NOT EXISTS idx_entries_user_type_deleted_date ON entries(user_id, type, deleted_at, date DESC)');
        $pdo->exec('CREATE INDEX IF NOT EXISTS idx_categories_last_modified_by ON categories(last_modified_by_user_id)');
        $pdo->exec('CREATE INDEX IF NOT EXISTS idx_categories_parent ON categories(parent_category_id)');
        $pdo->exec('CREATE INDEX IF NOT EXISTS idx_categories_owner ON categories(owner_user_id)');
        $pdo->exec('CREATE INDEX IF NOT EXISTS idx_categories_allows_analytic_children ON categories(allows_analytic_children)');
        $pdo->exec('CREATE INDEX IF NOT EXISTS idx_categories_owner_name_nocase ON categories(COALESCE(owner_user_id, 0), name COLLATE NOCASE)');
        $pdo->exec('CREATE INDEX IF NOT EXISTS idx_user_categories_last_modified_by ON user_categories(last_modified_by_user_id)');
        $pdo->exec('CREATE INDEX IF NOT EXISTS idx_user_categories_account_class ON user_categories(account_class)');
        $pdo->exec('CREATE INDEX IF NOT EXISTS idx_recurrences_category_id ON recurrences(category_id)');
        $pdo->exec("UPDATE categories SET color = '#1F8A70' WHERE owner_user_id IS NOT NULL AND trim(coalesce(color,'')) = ''");
        $pdo->exec("UPDATE user_accounts SET color = '#1F8A70' WHERE trim(coalesce(color,'')) = ''");
        $pdo->exec("UPDATE user_categories SET color = '#1F8A70' WHERE trim(coalesce(color,'')) = ''");
        $pdo->exec("UPDATE categories SET allows_analytic_children = 0 WHERE lower(coalesce(account_class,'')) = 'analytic'");
        $pdo->exec('UPDATE categories SET allows_analytic_children = 1 WHERE allows_analytic_children IS NULL');
        self::backfillUserCategoriesToCategories($pdo);
        self::backfillEntryAndRecurrenceCategoryIds($pdo);
        self::backfillLegacyCategoryLinks($pdo);
        self::repairAnalyticCategoryConsistency($pdo);
        self::backfillSupportThreads($pdo);
        $pdo->exec('PRAGMA user_version = ' . self::SCHEMA_VERSION);
    }

    private static function migrateRecurrencesOptionalAccount(PDO $pdo): void
    {
        $stmt = $pdo->query('PRAGMA table_info(recurrences)');
        $columns = $stmt ? $stmt->fetchAll() : [];
        if (!$columns) {
            return;
        }

        $accountColumn = null;
        foreach ($columns as $column) {
            if (($column['name'] ?? '') === 'account_id') {
                $accountColumn = $column;
                break;
            }
        }
        if (!$accountColumn) {
            return;
        }

        $isNotNull = (int)($accountColumn['notnull'] ?? 0) === 1;
        if (!$isNotNull) {
            return;
        }

        $pdo->beginTransaction();
        try {
            $pdo->exec('PRAGMA foreign_keys = OFF');

            $pdo->exec('CREATE TABLE recurrences_tmp (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                type TEXT NOT NULL,
                amount REAL NOT NULL,
                category TEXT NOT NULL,
                category_id INTEGER,
                account_id INTEGER,
                description TEXT,
                frequency TEXT NOT NULL,
                start_date TEXT NOT NULL,
                next_run_date TEXT NOT NULL,
                last_run_date TEXT,
                active INTEGER NOT NULL DEFAULT 1,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
                FOREIGN KEY(category_id) REFERENCES categories(id) ON DELETE SET NULL,
                FOREIGN KEY(account_id) REFERENCES user_accounts(id) ON DELETE CASCADE
            )');

            $pdo->exec('INSERT INTO recurrences_tmp (
                id, user_id, type, amount, category, account_id, description,
                category_id,
                frequency, start_date, next_run_date, last_run_date, active, created_at, updated_at
            )
            SELECT
                id,
                user_id,
                type,
                amount,
                category,
                CASE WHEN account_id IS NULL OR account_id <= 0 THEN NULL ELSE account_id END,
                category_id,
                description,
                frequency,
                start_date,
                next_run_date,
                last_run_date,
                active,
                created_at,
                updated_at
            FROM recurrences');

            $pdo->exec('DROP TABLE recurrences');
            $pdo->exec('ALTER TABLE recurrences_tmp RENAME TO recurrences');
            $pdo->exec('CREATE INDEX IF NOT EXISTS idx_recurrences_user_active_next ON recurrences(user_id, active, next_run_date)');
            $pdo->exec('CREATE INDEX IF NOT EXISTS idx_recurrences_account ON recurrences(account_id)');
            $pdo->exec('CREATE INDEX IF NOT EXISTS idx_recurrences_category_id ON recurrences(category_id)');

            $pdo->exec('PRAGMA foreign_keys = ON');
            $pdo->commit();
        } catch (\Throwable $e) {
            if ($pdo->inTransaction()) {
                $pdo->rollBack();
            }
            $pdo->exec('PRAGMA foreign_keys = ON');
            throw $e;
        }
    }

    private static function backfillSupportThreads(PDO $pdo): void
    {
        $stmt = $pdo->query('SELECT DISTINCT user_id FROM support_messages WHERE thread_id IS NULL OR thread_id = 0');
        $users = $stmt ? $stmt->fetchAll() : [];
        if (!$users) {
            return;
        }
        $findThread = $pdo->prepare('SELECT id FROM support_threads WHERE user_id = :uid ORDER BY created_at ASC, id ASC LIMIT 1');
        $insertThread = $pdo->prepare('INSERT INTO support_threads (user_id, subject, entry_id, created_by_role, created_at, updated_at, closed_at) VALUES (:uid, :subject, NULL, :role, :created, :updated, NULL)');
        $updateMessages = $pdo->prepare('UPDATE support_messages SET thread_id = :tid WHERE user_id = :uid AND (thread_id IS NULL OR thread_id = 0)');
        foreach ($users as $row) {
            $uid = (int)($row['user_id'] ?? 0);
            if ($uid <= 0) {
                continue;
            }
            $findThread->execute(['uid' => $uid]);
            $threadId = (int)($findThread->fetchColumn() ?: 0);
            if ($threadId <= 0) {
                $now = date('c');
                $insertThread->execute([
                    'uid' => $uid,
                    'subject' => 'Atendimento',
                    'role' => 'system',
                    'created' => $now,
                    'updated' => $now,
                ]);
                $threadId = (int)$pdo->lastInsertId();
            }
            if ($threadId > 0) {
                $updateMessages->execute([
                    'tid' => $threadId,
                    'uid' => $uid,
                ]);
            }
        }
    }

    private static function backfillEntryAndRecurrenceCategoryIds(PDO $pdo): void
    {
        $pdo->exec(
            "UPDATE entries
             SET category_id = coalesce(
                 (
                     SELECT c.id
                     FROM categories c
                     WHERE lower(c.name) = lower(entries.category)
                       AND c.owner_user_id IS NULL
                     ORDER BY c.id
                     LIMIT 1
                 ),
                 (
                     SELECT c2.id
                     FROM categories c2
                     WHERE lower(c2.name) = lower(entries.category)
                     ORDER BY c2.id
                     LIMIT 1
                 )
             )
             WHERE (category_id IS NULL OR category_id <= 0)
               AND trim(coalesce(category, '')) <> ''"
        );

        $pdo->exec(
            "UPDATE recurrences
             SET category_id = coalesce(
                 (
                     SELECT c.id
                     FROM categories c
                     WHERE lower(c.name) = lower(recurrences.category)
                       AND c.owner_user_id IS NULL
                     ORDER BY c.id
                     LIMIT 1
                 ),
                 (
                     SELECT c2.id
                     FROM categories c2
                     WHERE lower(c2.name) = lower(recurrences.category)
                     ORDER BY c2.id
                     LIMIT 1
                 )
             )
             WHERE (category_id IS NULL OR category_id <= 0)
               AND trim(coalesce(category, '')) <> ''"
        );
    }

    private static function backfillUserCategoriesToCategories(PDO $pdo): void
    {
        $pdo->exec(
            'INSERT INTO categories (
                name, type, icon, color, account_class, parent_category_id, allows_analytic_children, owner_user_id,
                alterdata_auto, created_at, updated_at, last_modified_by_user_id, last_modified_at
            )
             SELECT uc.name,
                    coalesce(c.type, "out") AS type,
                    coalesce(uc.icon, "label") AS icon,
                    coalesce(uc.color, "") AS color,
                    "analytic" AS account_class,
                    uc.global_category_id AS parent_category_id,
                    0 AS allows_analytic_children,
                    uc.user_id AS owner_user_id,
                    "" AS alterdata_auto,
                    uc.created_at,
                    uc.updated_at,
                    uc.last_modified_by_user_id,
                    uc.last_modified_at
               FROM user_categories uc
          LEFT JOIN categories c ON c.id = uc.global_category_id
              WHERE NOT EXISTS (
                    SELECT 1
                      FROM categories k
                     WHERE k.owner_user_id = uc.user_id
                       AND lower(k.name) = lower(uc.name)
                       AND lower(coalesce(k.account_class, "")) = "analytic"
              )'
        );

        $pdo->exec(
            'UPDATE entries
                SET category_id = (
                    SELECT c.id
                      FROM categories c
                     WHERE c.owner_user_id = entries.user_id
                       AND lower(coalesce(c.account_class, "")) = "analytic"
                       AND lower(c.name) = lower(entries.category)
                     ORDER BY c.id
                     LIMIT 1
                )
              WHERE trim(coalesce(entries.category, "")) <> ""
                AND EXISTS (
                    SELECT 1
                      FROM categories c
                     WHERE c.owner_user_id = entries.user_id
                       AND lower(coalesce(c.account_class, "")) = "analytic"
                       AND lower(c.name) = lower(entries.category)
                )'
        );

        $pdo->exec(
            'UPDATE recurrences
                SET category_id = (
                    SELECT c.id
                      FROM categories c
                     WHERE c.owner_user_id = recurrences.user_id
                       AND lower(coalesce(c.account_class, "")) = "analytic"
                       AND lower(c.name) = lower(recurrences.category)
                     ORDER BY c.id
                     LIMIT 1
                )
              WHERE trim(coalesce(recurrences.category, "")) <> ""
                AND EXISTS (
                    SELECT 1
                      FROM categories c
                     WHERE c.owner_user_id = recurrences.user_id
                       AND lower(coalesce(c.account_class, "")) = "analytic"
                       AND lower(c.name) = lower(recurrences.category)
                )'
        );
    }

    private static function backfillLegacyCategoryLinks(PDO $pdo): void
    {
        $categories = $pdo->query('SELECT id, name, type, account_class, parent_category_id, owner_user_id FROM categories')->fetchAll() ?: [];
        $byId = [];
        $globalByKey = [];
        $analyticByUserKey = [];
        foreach ($categories as $row) {
            $id = (int)($row['id'] ?? 0);
            if ($id <= 0) {
                continue;
            }
            $byId[$id] = $row;
            $key = self::normalizeCategoryKey((string)($row['name'] ?? ''));
            if ($key === '') {
                continue;
            }
            $owner = (int)($row['owner_user_id'] ?? 0);
            $klass = strtolower((string)($row['account_class'] ?? ''));
            if ($owner > 0 && $klass === 'analytic') {
                $analyticByUserKey[$owner . ':' . $key] = $id;
                continue;
            }
            if ($owner <= 0) {
                $globalByKey[$key] = $id;
            }
        }

        $defaultParentByType = self::defaultAnalyticParentByType($categories);
        $now = date('c');
        $insert = $pdo->prepare(
            'INSERT INTO categories (
                name, type, icon, color, account_class, parent_category_id, allows_analytic_children, owner_user_id,
                alterdata_auto, created_at, updated_at
            ) VALUES (
                :name, :type, :icon, :color, "analytic", :parent_id, 0, :owner_user_id, "", :created_at, :updated_at
            )'
        );
        $updateEntryCategoryId = $pdo->prepare(
            'UPDATE entries
                SET category_id = :category_id
              WHERE user_id = :uid
                AND (category_id IS NULL OR category_id <= 0)
                AND category = :category_name'
        );
        $updateRecurrenceCategoryId = $pdo->prepare(
            'UPDATE recurrences
                SET category_id = :category_id
              WHERE user_id = :uid
                AND (category_id IS NULL OR category_id <= 0)
                AND category = :category_name'
        );

        $distinct = $pdo->query(
            'SELECT user_id, category
               FROM entries
              WHERE trim(coalesce(category, "")) <> ""
                AND (category_id IS NULL OR category_id <= 0)
              GROUP BY user_id, category'
        )->fetchAll() ?: [];

        foreach ($distinct as $row) {
            $uid = (int)($row['user_id'] ?? 0);
            $name = trim((string)($row['category'] ?? ''));
            if ($uid <= 0 || $name === '') {
                continue;
            }
            $key = self::normalizeCategoryKey($name);
            if ($key === '') {
                continue;
            }

            $categoryId = 0;
            $analyticKey = $uid . ':' . $key;
            if (isset($analyticByUserKey[$analyticKey])) {
                $categoryId = (int)$analyticByUserKey[$analyticKey];
            } elseif (isset($globalByKey[$key])) {
                $categoryId = (int)$globalByKey[$key];
            } else {
                $type = self::dominantEntryTypeForName($pdo, $uid, $name);
                $parentId = (int)($defaultParentByType[$type] ?? 0);
                $insert->execute([
                    'name' => $name,
                    'type' => $type,
                    'icon' => 'label',
                    'color' => '#1F8A70',
                    'parent_id' => $parentId > 0 ? $parentId : null,
                    'owner_user_id' => $uid,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
                $categoryId = (int)$pdo->lastInsertId();
                if ($categoryId > 0) {
                    $analyticByUserKey[$analyticKey] = $categoryId;
                }
            }

            if ($categoryId <= 0) {
                continue;
            }
            $updateEntryCategoryId->execute([
                'category_id' => $categoryId,
                'uid' => $uid,
                'category_name' => $name,
            ]);
            $updateRecurrenceCategoryId->execute([
                'category_id' => $categoryId,
                'uid' => $uid,
                'category_name' => $name,
            ]);
        }
    }

    private static function repairAnalyticCategoryConsistency(PDO $pdo): void
    {
        $categories = $pdo->query('SELECT id, type, account_class, parent_category_id, owner_user_id FROM categories')->fetchAll() ?: [];
        $defaultParentByType = self::defaultAnalyticParentByType($categories);
        $byId = [];
        foreach ($categories as $row) {
            $id = (int)($row['id'] ?? 0);
            if ($id > 0) {
                $byId[$id] = $row;
            }
        }
        $hasSyntheticChildren = [];
        foreach ($categories as $row) {
            $parentId = (int)($row['parent_category_id'] ?? 0);
            if ($parentId <= 0) {
                continue;
            }
            $klass = strtolower((string)($row['account_class'] ?? ''));
            if ($klass !== 'synthetic') {
                continue;
            }
            $hasSyntheticChildren[$parentId] = true;
        }

        $analyticRows = $pdo->query(
            'SELECT id, type, parent_category_id, owner_user_id
               FROM categories
              WHERE owner_user_id IS NOT NULL
                AND lower(coalesce(account_class, "")) = "analytic"'
        )->fetchAll() ?: [];

        $updateCategory = $pdo->prepare(
            'UPDATE categories
                SET type = :type,
                    parent_category_id = :parent_id,
                    updated_at = :updated_at
              WHERE id = :id'
        );
        $updateEntriesType = $pdo->prepare(
            'UPDATE entries
                SET type = :type
              WHERE category_id = :category_id
                AND deleted_at IS NULL
                AND type <> :type'
        );
        $updateRecurrencesType = $pdo->prepare(
            'UPDATE recurrences
                SET type = :type
              WHERE category_id = :category_id
                AND type <> :type'
        );

        foreach ($analyticRows as $row) {
            $categoryId = (int)($row['id'] ?? 0);
            if ($categoryId <= 0) {
                continue;
            }
            $owner = (int)($row['owner_user_id'] ?? 0);
            $dominantType = self::dominantEntryTypeForCategoryId($pdo, $categoryId, (string)($row['type'] ?? 'out'));
            $parentId = (int)($row['parent_category_id'] ?? 0);
            $parent = $parentId > 0 ? ($byId[$parentId] ?? null) : null;
            $validParent = false;
            if (is_array($parent)) {
                $parentClass = strtolower((string)($parent['account_class'] ?? ''));
                $parentType = (string)($parent['type'] ?? '');
                $validParent = $parentClass === 'synthetic'
                    && $parentType === $dominantType
                    && empty($hasSyntheticChildren[$parentId]);
            }
            if (!$validParent) {
                $parentId = (int)($defaultParentByType[$dominantType] ?? 0);
            }

            $updateCategory->execute([
                'type' => $dominantType,
                'parent_id' => $parentId > 0 ? $parentId : null,
                'updated_at' => date('c'),
                'id' => $categoryId,
            ]);
            $updateEntriesType->execute([
                'type' => $dominantType,
                'category_id' => $categoryId,
            ]);
            $updateRecurrencesType->execute([
                'type' => $dominantType,
                'category_id' => $categoryId,
            ]);
            unset($owner);
        }
    }

    private static function dominantEntryTypeForName(PDO $pdo, int $userId, string $categoryName): string
    {
        $stmt = $pdo->prepare(
            'SELECT type, COUNT(*) AS qty
               FROM entries
              WHERE user_id = :uid
                AND category = :category_name
                AND deleted_at IS NULL
              GROUP BY type'
        );
        $stmt->execute(['uid' => $userId, 'category_name' => $categoryName]);
        $rows = $stmt->fetchAll() ?: [];
        $inQty = 0;
        $outQty = 0;
        foreach ($rows as $row) {
            $type = (string)($row['type'] ?? '');
            $qty = (int)($row['qty'] ?? 0);
            if ($type === 'in') {
                $inQty += $qty;
            } elseif ($type === 'out') {
                $outQty += $qty;
            }
        }
        return $inQty >= $outQty ? 'in' : 'out';
    }

    private static function dominantEntryTypeForCategoryId(PDO $pdo, int $categoryId, string $fallback): string
    {
        $stmt = $pdo->prepare(
            'SELECT type, COUNT(*) AS qty
               FROM entries
              WHERE category_id = :category_id
                AND deleted_at IS NULL
              GROUP BY type'
        );
        $stmt->execute(['category_id' => $categoryId]);
        $rows = $stmt->fetchAll() ?: [];
        $inQty = 0;
        $outQty = 0;
        foreach ($rows as $row) {
            $type = (string)($row['type'] ?? '');
            $qty = (int)($row['qty'] ?? 0);
            if ($type === 'in') {
                $inQty += $qty;
            } elseif ($type === 'out') {
                $outQty += $qty;
            }
        }
        if ($inQty === 0 && $outQty === 0) {
            return ($fallback === 'in' || $fallback === 'out') ? $fallback : 'out';
        }
        return $inQty >= $outQty ? 'in' : 'out';
    }

    /** @param array<int, array<string, mixed>> $categories */
    private static function defaultAnalyticParentByType(array $categories): array
    {
        $byId = [];
        foreach ($categories as $row) {
            $id = (int)($row['id'] ?? 0);
            if ($id > 0) {
                $byId[$id] = $row;
            }
        }
        $syntheticChildren = [];
        foreach ($categories as $row) {
            $parentId = (int)($row['parent_category_id'] ?? 0);
            if ($parentId <= 0) {
                continue;
            }
            $klass = strtolower((string)($row['account_class'] ?? ''));
            if ($klass === 'synthetic') {
                $syntheticChildren[$parentId] = true;
            }
        }

        $depthMemo = [];
        $depthOf = function (int $id) use (&$depthOf, &$depthMemo, $byId): int {
            if (isset($depthMemo[$id])) {
                return $depthMemo[$id];
            }
            $row = $byId[$id] ?? null;
            if (!$row) {
                return 0;
            }
            $parentId = (int)($row['parent_category_id'] ?? 0);
            if ($parentId <= 0 || !isset($byId[$parentId])) {
                $depthMemo[$id] = 0;
                return 0;
            }
            $depth = 1 + $depthOf($parentId);
            $depthMemo[$id] = $depth;
            return $depth;
        };

        $candidates = ['in' => [], 'out' => []];
        foreach ($categories as $row) {
            $id = (int)($row['id'] ?? 0);
            if ($id <= 0) {
                continue;
            }
            $klass = strtolower((string)($row['account_class'] ?? ''));
            $owner = (int)($row['owner_user_id'] ?? 0);
            $type = (string)($row['type'] ?? '');
            if ($klass !== 'synthetic' || $owner > 0 || !in_array($type, ['in', 'out'], true)) {
                continue;
            }
            if (!empty($syntheticChildren[$id])) {
                continue;
            }
            $candidates[$type][] = ['id' => $id, 'depth' => $depthOf($id)];
        }

        $result = [];
        foreach (['in', 'out'] as $type) {
            usort($candidates[$type], function ($a, $b) {
                $depthCmp = ($a['depth'] <=> $b['depth']);
                if ($depthCmp !== 0) {
                    return $depthCmp;
                }
                return ($a['id'] <=> $b['id']);
            });
            $result[$type] = (int)($candidates[$type][0]['id'] ?? 0);
        }
        return $result;
    }

    private static function normalizeCategoryKey(string $value): string
    {
        $normalized = trim($value);
        $normalized = function_exists('mb_strtolower')
            ? mb_strtolower($normalized, 'UTF-8')
            : strtolower($normalized);
        $converted = @iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $normalized);
        if (is_string($converted) && $converted !== '') {
            $normalized = strtolower($converted);
        }
        $normalized = preg_replace('/[^a-z0-9]+/', '', $normalized) ?? '';
        return $normalized;
    }

    private static function columnExists(PDO $pdo, string $table, string $column): bool
    {
        $stmt = $pdo->query('PRAGMA table_info(' . $table . ')');
        $rows = $stmt ? $stmt->fetchAll() : [];
        foreach ($rows as $row) {
            if (($row['name'] ?? '') === $column) {
                return true;
            }
        }
        return false;
    }

    private static function ensureColumn(PDO $pdo, string $table, string $column, string $definition): void
    {
        if (!self::columnExists($pdo, $table, $column)) {
            $pdo->exec('ALTER TABLE ' . $table . ' ADD COLUMN ' . $column . ' ' . $definition);
        }
    }
}
