<?php
declare(strict_types=1);

namespace App\Service;

use PDO;

class MonthLockService
{
    private PDO $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function isClosedForUser(string $month, int $userId): bool
    {
        $stmt = $this->pdo->prepare('SELECT closed FROM month_locks WHERE user_id = :uid AND month = :month LIMIT 1');
        $stmt->execute(['uid' => $userId, 'month' => $month]);
        $row = $stmt->fetch();
        return $row ? ((int)$row['closed'] === 1) : false;
    }

    public function setClosedForUsers(string $month, array $userIds, bool $closed): void
    {
        $now = date('c');
        $stmt = $this->pdo->prepare('INSERT INTO month_locks (user_id, month, closed, updated_at) VALUES (:uid,:month,:closed,:updated) ON CONFLICT(user_id, month) DO UPDATE SET closed=excluded.closed, updated_at=excluded.updated_at');
        $this->pdo->beginTransaction();
        try {
            foreach ($userIds as $uid) {
                $stmt->execute([
                    'uid' => (int)$uid,
                    'month' => $month,
                    'closed' => $closed ? 1 : 0,
                    'updated' => $now,
                ]);
            }
            $this->pdo->commit();
        } catch (\Throwable $e) {
            $this->pdo->rollBack();
            throw $e;
        }
    }

    public function listClosed(): array
    {
        $rows = $this->pdo->query('SELECT user_id, month, closed, updated_at FROM month_locks ORDER BY month DESC, user_id ASC')->fetchAll();
        return array_map(fn($r) => [
            'user_id' => (int)$r['user_id'],
            'month' => $r['month'],
            'closed' => (bool)$r['closed'],
            'updated_at' => $r['updated_at'],
        ], $rows);
    }

    public function getLockForUser(string $month, int $userId): ?array
    {
        $stmt = $this->pdo->prepare('SELECT user_id, month, closed, updated_at FROM month_locks WHERE user_id = :uid AND month = :month LIMIT 1');
        $stmt->execute(['uid' => $userId, 'month' => $month]);
        $row = $stmt->fetch();
        if (!$row) {
            return null;
        }
        return [
            'user_id' => (int)$row['user_id'],
            'month' => $row['month'],
            'closed' => (bool)$row['closed'],
            'updated_at' => $row['updated_at'],
        ];
    }
}
