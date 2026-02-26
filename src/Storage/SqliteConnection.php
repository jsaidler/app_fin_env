<?php
declare(strict_types=1);

namespace App\Storage;

use PDO;
use RuntimeException;

class SqliteConnection
{
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
            alterdata_auto TEXT,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        )');

        $pdo->exec('CREATE TABLE IF NOT EXISTS user_categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            icon TEXT NOT NULL DEFAULT "label",
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
            description TEXT,
            date TEXT NOT NULL,
            attachment_path TEXT,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            deleted_at TEXT,
            deleted_type TEXT,
            FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
        )');
        $pdo->exec('CREATE INDEX IF NOT EXISTS idx_entries_user_date ON entries(user_id, date)');
        $pdo->exec('CREATE INDEX IF NOT EXISTS idx_entries_deleted ON entries(deleted_at)');

        $pdo->exec('CREATE TABLE IF NOT EXISTS recurrences (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            type TEXT NOT NULL,
            amount REAL NOT NULL,
            category TEXT NOT NULL,
            account_id INTEGER NOT NULL,
            description TEXT,
            frequency TEXT NOT NULL,
            start_date TEXT NOT NULL,
            next_run_date TEXT NOT NULL,
            last_run_date TEXT,
            active INTEGER NOT NULL DEFAULT 1,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY(account_id) REFERENCES user_accounts(id) ON DELETE CASCADE
        )');
        $pdo->exec('CREATE INDEX IF NOT EXISTS idx_recurrences_user_active_next ON recurrences(user_id, active, next_run_date)');
        $pdo->exec('CREATE INDEX IF NOT EXISTS idx_recurrences_account ON recurrences(account_id)');

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
        self::ensureColumn($pdo, 'categories', 'alterdata_auto', 'TEXT');
        self::ensureColumn($pdo, 'user_accounts', 'initial_balance', 'REAL NOT NULL DEFAULT 0');
        self::ensureColumn($pdo, 'entries', 'account_id', 'INTEGER');
        self::ensureColumn($pdo, 'entries', 'needs_review', 'INTEGER NOT NULL DEFAULT 0');
        self::ensureColumn($pdo, 'entries', 'reviewed_at', 'TEXT');
        self::ensureColumn($pdo, 'entries', 'valid_amount', 'REAL');
        self::ensureColumn($pdo, 'entries', 'recurrence_id', 'INTEGER');
        self::ensureColumn($pdo, 'entries', 'last_modified_by_user_id', 'INTEGER');
        self::ensureColumn($pdo, 'entries', 'last_modified_at', 'TEXT');
        self::ensureColumn($pdo, 'categories', 'last_modified_by_user_id', 'INTEGER');
        self::ensureColumn($pdo, 'categories', 'last_modified_at', 'TEXT');
        self::ensureColumn($pdo, 'user_categories', 'last_modified_by_user_id', 'INTEGER');
        self::ensureColumn($pdo, 'user_categories', 'last_modified_at', 'TEXT');
        $pdo->exec('CREATE INDEX IF NOT EXISTS idx_entries_account_id ON entries(account_id)');
        $pdo->exec('CREATE INDEX IF NOT EXISTS idx_entries_recurrence_id ON entries(recurrence_id)');
        $pdo->exec('CREATE INDEX IF NOT EXISTS idx_entries_last_modified_by ON entries(last_modified_by_user_id)');
        $pdo->exec('CREATE INDEX IF NOT EXISTS idx_categories_last_modified_by ON categories(last_modified_by_user_id)');
        $pdo->exec('CREATE INDEX IF NOT EXISTS idx_user_categories_last_modified_by ON user_categories(last_modified_by_user_id)');
        self::backfillSupportThreads($pdo);
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
