<?php
declare(strict_types=1);

namespace App\Service;

use PDO;

class AdminNotificationService
{
    private PDO $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function logEntryChange(int $userId, int $entryId, string $action, array $payload): void
    {
        $month = substr((string)($payload['date'] ?? ''), 0, 7);
        $stmt = $this->pdo->prepare('INSERT INTO admin_notifications (user_id, entry_id, action, month, payload, created_at, read_at) VALUES (:uid,:eid,:action,:month,:payload,:created,NULL)');
        $stmt->execute([
            'uid' => $userId,
            'eid' => $entryId,
            'action' => $action,
            'month' => $month,
            'payload' => json_encode($payload, JSON_UNESCAPED_UNICODE),
            'created' => date('c'),
        ]);
    }

    public function listUnread(): array
    {
        $stmt = $this->pdo->query('SELECT n.id, n.user_id, n.entry_id, n.action, n.month, n.payload, n.created_at, u.name, u.email, u.alterdata_code
            FROM admin_notifications n
            LEFT JOIN users u ON u.id = n.user_id
            WHERE n.read_at IS NULL
            ORDER BY n.created_at DESC, n.id DESC');
        $rows = $stmt ? $stmt->fetchAll() : [];
        return array_map(function ($row) {
            $payload = [];
            if (!empty($row['payload'])) {
                $decoded = json_decode((string)$row['payload'], true);
                if (is_array($decoded)) {
                    $payload = $decoded;
                }
            }
            return [
                'id' => (int)$row['id'],
                'user_id' => (int)$row['user_id'],
                'user_name' => $row['name'] ?? '',
                'user_email' => $row['email'] ?? '',
                'alterdata_code' => $row['alterdata_code'] ?? '',
                'entry_id' => (int)$row['entry_id'],
                'action' => $row['action'] ?? '',
                'month' => $row['month'] ?? '',
                'created_at' => $row['created_at'] ?? '',
                'payload' => $payload,
            ];
        }, $rows);
    }

    public function markRead(int $id): bool
    {
        $stmt = $this->pdo->prepare('UPDATE admin_notifications SET read_at=:read_at WHERE id=:id AND read_at IS NULL');
        $stmt->execute([
            'read_at' => date('c'),
            'id' => $id,
        ]);
        return $stmt->rowCount() > 0;
    }

    public function markReadByEntry(int $entryId): int
    {
        $stmt = $this->pdo->prepare('UPDATE admin_notifications SET read_at=:read_at WHERE entry_id=:entry_id AND read_at IS NULL');
        $stmt->execute([
            'read_at' => date('c'),
            'entry_id' => $entryId,
        ]);
        return $stmt->rowCount();
    }
}
