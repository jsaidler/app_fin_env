<?php
declare(strict_types=1);

namespace App\Repository\Sqlite;

use App\Domain\Recurrence;
use App\Repository\RecurrenceRepositoryInterface;
use PDO;

class SqliteRecurrenceRepository implements RecurrenceRepositoryInterface
{
    private PDO $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function listByUser(int $userId, bool $activeOnly = false): array
    {
        $sql = 'SELECT r.*, ua.name AS account_name, ua.type AS account_type
                FROM recurrences r
                LEFT JOIN user_accounts ua ON ua.id = r.account_id
                WHERE r.user_id = :uid';
        if ($activeOnly) {
            $sql .= ' AND r.active = 1';
        }
        $sql .= ' ORDER BY r.active DESC, r.next_run_date ASC, r.id DESC';
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute(['uid' => $userId]);
        $rows = $stmt->fetchAll();
        return array_map(fn($row) => Recurrence::fromArray($row), $rows);
    }

    public function findForUser(int $id, int $userId): ?Recurrence
    {
        $stmt = $this->pdo->prepare(
            'SELECT r.*, ua.name AS account_name, ua.type AS account_type
             FROM recurrences r
             LEFT JOIN user_accounts ua ON ua.id = r.account_id
             WHERE r.id = :id AND r.user_id = :uid
             LIMIT 1'
        );
        $stmt->execute(['id' => $id, 'uid' => $userId]);
        $row = $stmt->fetch();
        return $row ? Recurrence::fromArray($row) : null;
    }

    public function create(int $userId, array $data): Recurrence
    {
        $now = date('c');
        $stmt = $this->pdo->prepare(
            'INSERT INTO recurrences (
                user_id, type, amount, category, account_id, description,
                frequency, start_date, next_run_date, last_run_date, active, created_at, updated_at
            ) VALUES (
                :uid, :type, :amount, :category, :account_id, :description,
                :frequency, :start_date, :next_run_date, :last_run_date, :active, :created_at, :updated_at
            )'
        );
        $stmt->execute([
            'uid' => $userId,
            'type' => $data['type'],
            'amount' => (float)$data['amount'],
            'category' => $data['category'],
            'account_id' => (int)$data['account_id'],
            'description' => (string)($data['description'] ?? ''),
            'frequency' => $data['frequency'],
            'start_date' => $data['start_date'],
            'next_run_date' => $data['next_run_date'],
            'last_run_date' => $data['last_run_date'] ?? null,
            'active' => !empty($data['active']) ? 1 : 0,
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        $id = (int)$this->pdo->lastInsertId();
        return $this->findForUser($id, $userId) ?? Recurrence::fromArray([
            'id' => $id,
            'user_id' => $userId,
            'type' => $data['type'],
            'amount' => (float)$data['amount'],
            'category' => $data['category'],
            'account_id' => (int)$data['account_id'],
            'description' => (string)($data['description'] ?? ''),
            'frequency' => $data['frequency'],
            'start_date' => $data['start_date'],
            'next_run_date' => $data['next_run_date'],
            'last_run_date' => $data['last_run_date'] ?? null,
            'active' => !empty($data['active']) ? 1 : 0,
            'created_at' => $now,
            'updated_at' => $now,
        ]);
    }

    public function updateForUser(int $id, int $userId, array $data): ?Recurrence
    {
        $existing = $this->findForUser($id, $userId);
        if (!$existing) {
            return null;
        }

        $merged = array_merge($existing->toArray(), $data);
        $merged['updated_at'] = date('c');

        $stmt = $this->pdo->prepare(
            'UPDATE recurrences
             SET type = :type,
                 amount = :amount,
                 category = :category,
                 account_id = :account_id,
                 description = :description,
                 frequency = :frequency,
                 start_date = :start_date,
                 next_run_date = :next_run_date,
                 last_run_date = :last_run_date,
                 active = :active,
                 updated_at = :updated_at
             WHERE id = :id AND user_id = :uid'
        );

        $stmt->execute([
            'type' => $merged['type'],
            'amount' => (float)$merged['amount'],
            'category' => $merged['category'],
            'account_id' => (int)$merged['account_id'],
            'description' => (string)($merged['description'] ?? ''),
            'frequency' => $merged['frequency'],
            'start_date' => $merged['start_date'],
            'next_run_date' => $merged['next_run_date'],
            'last_run_date' => $merged['last_run_date'] ?? null,
            'active' => !empty($merged['active']) ? 1 : 0,
            'updated_at' => $merged['updated_at'],
            'id' => $id,
            'uid' => $userId,
        ]);

        return $this->findForUser($id, $userId);
    }

    public function deleteForUser(int $id, int $userId): bool
    {
        $stmt = $this->pdo->prepare('DELETE FROM recurrences WHERE id = :id AND user_id = :uid');
        $stmt->execute(['id' => $id, 'uid' => $userId]);
        return $stmt->rowCount() > 0;
    }

    public function listDueByUser(int $userId, string $dateIso): array
    {
        $stmt = $this->pdo->prepare(
            'SELECT r.*, ua.name AS account_name, ua.type AS account_type
             FROM recurrences r
             LEFT JOIN user_accounts ua ON ua.id = r.account_id
             WHERE r.user_id = :uid
               AND r.active = 1
               AND r.next_run_date <= :date_iso
             ORDER BY r.next_run_date ASC, r.id ASC'
        );
        $stmt->execute([
            'uid' => $userId,
            'date_iso' => $dateIso,
        ]);
        $rows = $stmt->fetchAll();
        return array_map(fn($row) => Recurrence::fromArray($row), $rows);
    }
}