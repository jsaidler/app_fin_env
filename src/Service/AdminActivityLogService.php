<?php
declare(strict_types=1);

namespace App\Service;

use PDO;

class AdminActivityLogService
{
    private PDO $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function record(array $data): void
    {
        $stmt = $this->pdo->prepare(
            'INSERT INTO admin_activity_logs (action, month, actor_user_id, actor_name, actor_email, users_affected, records_affected, payload, created_at)
             VALUES (:action, :month, :actor_user_id, :actor_name, :actor_email, :users_affected, :records_affected, :payload, :created_at)'
        );
        $stmt->execute([
            'action' => (string)($data['action'] ?? ''),
            'month' => trim((string)($data['month'] ?? '')) ?: null,
            'actor_user_id' => isset($data['actor_user_id']) ? (int)$data['actor_user_id'] : null,
            'actor_name' => trim((string)($data['actor_name'] ?? '')) ?: null,
            'actor_email' => trim((string)($data['actor_email'] ?? '')) ?: null,
            'users_affected' => (int)($data['users_affected'] ?? 0),
            'records_affected' => (int)($data['records_affected'] ?? 0),
            'payload' => json_encode($data['payload'] ?? [], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
            'created_at' => date('c'),
        ]);
    }

    public function listByAction(string $action, int $limit = 30): array
    {
        $safeLimit = max(1, min(100, $limit));
        $stmt = $this->pdo->prepare(
            "SELECT id, action, month, actor_user_id, actor_name, actor_email, users_affected, records_affected, payload, created_at
               FROM admin_activity_logs
              WHERE action = :action
              ORDER BY created_at DESC, id DESC
              LIMIT {$safeLimit}"
        );
        $stmt->execute(['action' => $action]);
        $rows = $stmt->fetchAll() ?: [];
        return array_map(function (array $row): array {
            $payload = json_decode((string)($row['payload'] ?? ''), true);
            return [
                'id' => (int)($row['id'] ?? 0),
                'action' => (string)($row['action'] ?? ''),
                'month' => (string)($row['month'] ?? ''),
                'actor' => [
                    'id' => isset($row['actor_user_id']) ? (int)$row['actor_user_id'] : null,
                    'name' => (string)($row['actor_name'] ?? ''),
                    'email' => (string)($row['actor_email'] ?? ''),
                ],
                'users_affected' => (int)($row['users_affected'] ?? 0),
                'records_affected' => (int)($row['records_affected'] ?? 0),
                'payload' => is_array($payload) ? $payload : [],
                'created_at' => (string)($row['created_at'] ?? ''),
            ];
        }, $rows);
    }
}

