<?php
declare(strict_types=1);

namespace App\Storage;

use PDO;
use RuntimeException;

class SqliteConnection
{
    private static ?PDO $pdo = null;

    public static function make(string $dbPath, ?string $dataDir = null): PDO
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
        if ($dataDir) {
            self::importFromJsonIfEmpty($pdo, $dataDir);
        }
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

        self::ensureColumn($pdo, 'users', 'alterdata_code', 'TEXT');
        self::ensureColumn($pdo, 'categories', 'alterdata_auto', 'TEXT');
        self::ensureColumn($pdo, 'entries', 'needs_review', 'INTEGER NOT NULL DEFAULT 0');
        self::ensureColumn($pdo, 'entries', 'reviewed_at', 'TEXT');
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

    private static function importFromJsonIfEmpty(PDO $pdo, string $dataDir): void
    {
        $hasData = (int)$pdo->query('SELECT COUNT(*) FROM users')->fetchColumn()
            + (int)$pdo->query('SELECT COUNT(*) FROM categories')->fetchColumn()
            + (int)$pdo->query('SELECT COUNT(*) FROM entries')->fetchColumn();
        if ($hasData > 0) {
            return;
        }
        $dataDir = rtrim($dataDir, DIRECTORY_SEPARATOR . '/');
        $usersFile = $dataDir . '/users.json';
        $categoriesFile = $dataDir . '/categories.json';
        $userBase = $dataDir . '/users';
        $locksFile = $dataDir . '/closed-months.json';

        $users = is_file($usersFile) ? self::decodeJson($usersFile)['users'] ?? [] : [];
        $categories = is_file($categoriesFile) ? self::decodeJson($categoriesFile)['categories'] ?? [] : [];
        $locks = is_file($locksFile) ? self::extractLocks(self::decodeJson($locksFile)) : [];

        $pdo->beginTransaction();
        try {
            $userStmt = $pdo->prepare('INSERT INTO users (id,name,email,password_hash,role,theme,alterdata_code,created_at) VALUES (:id,:name,:email,:ph,:role,:theme,:alterdata_code,:created)');
            $userIds = [];
            foreach ($users as $user) {
                $uid = isset($user['id']) ? (int)$user['id'] : null;
                $userStmt->execute([
                    'id' => $uid,
                    'name' => $user['name'] ?? '',
                    'email' => strtolower($user['email'] ?? ''),
                    'ph' => $user['password_hash'] ?? '',
                    'role' => $user['role'] ?? 'user',
                    'theme' => $user['theme'] ?? 'dark',
                    'alterdata_code' => $user['alterdata_code'] ?? '',
                    'created' => $user['created_at'] ?? date('c'),
                ]);
                if ($uid) {
                    $userIds[$uid] = true;
                }
            }

            $catStmt = $pdo->prepare('INSERT INTO categories (id,name,type,alterdata_auto,created_at,updated_at) VALUES (:id,:name,:type,:auto,:created,:updated)');
            foreach ($categories as $cat) {
                $catStmt->execute([
                    'id' => $cat['id'] ?? null,
                    'name' => $cat['name'] ?? '',
                    'type' => $cat['type'] ?? 'in',
                    'auto' => $cat['alterdata_auto'] ?? null,
                    'created' => $cat['created_at'] ?? date('c'),
                    'updated' => $cat['updated_at'] ?? date('c'),
                ]);
            }

            if (is_dir($userBase)) {
                $entryStmt = $pdo->prepare('INSERT INTO entries (id,user_id,type,amount,category,description,date,attachment_path,created_at,updated_at,deleted_at,deleted_type) VALUES (:id,:uid,:type,:amount,:category,:description,:date,:attachment,:created,:updated,:deleted_at,:deleted_type)');
                foreach (scandir($userBase) ?: [] as $dir) {
                    if ($dir === '.' || $dir === '..') {
                        continue;
                    }
                    $uid = (int)$dir;
                    if ($uid <= 0 || (!empty($userIds) && !isset($userIds[$uid]))) {
                        continue;
                    }
                    $entryFile = $userBase . '/' . $dir . '/entries.json';
                    if (!is_file($entryFile)) {
                        continue;
                    }
                    $data = self::decodeJson($entryFile);
                    foreach ($data['entries'] ?? [] as $entry) {
                        $entryStmt->execute([
                            'id' => $entry['id'] ?? null,
                            'uid' => $entry['user_id'] ?? $uid,
                            'type' => $entry['type'] ?? 'in',
                            'amount' => (float)($entry['amount'] ?? 0),
                            'category' => $entry['category'] ?? '',
                            'description' => $entry['description'] ?? '',
                            'date' => $entry['date'] ?? '',
                            'attachment' => $entry['attachment_path'] ?? null,
                            'created' => $entry['created_at'] ?? date('c'),
                            'updated' => $entry['updated_at'] ?? date('c'),
                            'deleted_at' => $entry['deleted_at'] ?? null,
                            'deleted_type' => $entry['deleted_type'] ?? null,
                        ]);
                    }
                }
            }

            if ($locks) {
                $lockStmt = $pdo->prepare('INSERT INTO month_locks (user_id, month, closed, updated_at) VALUES (:uid,:month,:closed,:updated) ON CONFLICT(user_id, month) DO UPDATE SET closed=excluded.closed, updated_at=excluded.updated_at');
                foreach ($locks as $lock) {
                    $uid = isset($lock['user_id']) ? (int)$lock['user_id'] : 0;
                    if ($uid <= 0 || (!empty($userIds) && !isset($userIds[$uid]))) {
                        continue;
                    }
                    $lockStmt->execute([
                        'uid' => $uid,
                        'month' => $lock['month'],
                        'closed' => $lock['closed'] ? 1 : 0,
                        'updated' => $lock['updated_at'] ?? date('c'),
                    ]);
                }
            }

            $pdo->commit();
        } catch (\Throwable $e) {
            $pdo->rollBack();
            throw new RuntimeException('Falha ao migrar dados do JSON para SQLite: ' . $e->getMessage(), 0, $e);
        }
    }

    private static function decodeJson(string $file): array
    {
        $raw = file_get_contents($file);
        if ($raw === false) {
            return [];
        }
        $data = json_decode($raw, true);
        return is_array($data) ? $data : [];
    }

    private static function extractLocks(array $data): array
    {
        if (isset($data['locks']) && is_array($data['locks'])) {
            return $data['locks'];
        }
        if (isset($data['closed']) && is_array($data['closed'])) {
            $locks = [];
            foreach ($data['closed'] as $month) {
                $locks[] = ['user_id' => 0, 'month' => $month, 'closed' => true, 'updated_at' => date('c')];
            }
            return $locks;
        }
        return [];
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
