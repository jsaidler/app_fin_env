<?php
declare(strict_types=1);

namespace App\Repository\Sqlite;

use App\Domain\RecurrenceRun;
use App\Repository\RecurrenceRunRepositoryInterface;
use PDO;

class SqliteRecurrenceRunRepository implements RecurrenceRunRepositoryInterface
{
    public function __construct(private PDO $pdo)
    {
    }

    public function listByRecurrence(int $userId, int $recurrenceId, int $limit = 240): array
    {
        $stmt = $this->pdo->prepare(
            'SELECT *
             FROM recurrence_runs
             WHERE user_id = :uid
               AND recurrence_id = :rid
             ORDER BY scheduled_date DESC, id DESC
             LIMIT :lim'
        );
        $stmt->bindValue(':uid', $userId, PDO::PARAM_INT);
        $stmt->bindValue(':rid', $recurrenceId, PDO::PARAM_INT);
        $stmt->bindValue(':lim', max(1, $limit), PDO::PARAM_INT);
        $stmt->execute();
        $rows = $stmt->fetchAll();
        return array_map(fn($row) => RecurrenceRun::fromArray($row), $rows);
    }

    public function findForUser(int $id, int $userId): ?RecurrenceRun
    {
        $stmt = $this->pdo->prepare(
            'SELECT *
             FROM recurrence_runs
             WHERE id = :id
               AND user_id = :uid
             LIMIT 1'
        );
        $stmt->execute(['id' => $id, 'uid' => $userId]);
        $row = $stmt->fetch();
        return $row ? RecurrenceRun::fromArray($row) : null;
    }

    public function findByRecurrenceDate(int $userId, int $recurrenceId, string $scheduledDate): ?RecurrenceRun
    {
        $stmt = $this->pdo->prepare(
            'SELECT *
             FROM recurrence_runs
             WHERE user_id = :uid
               AND recurrence_id = :rid
               AND scheduled_date = :scheduled_date
             LIMIT 1'
        );
        $stmt->execute([
            'uid' => $userId,
            'rid' => $recurrenceId,
            'scheduled_date' => $scheduledDate,
        ]);
        $row = $stmt->fetch();
        return $row ? RecurrenceRun::fromArray($row) : null;
    }

    public function createPending(int $userId, int $recurrenceId, string $scheduledDate): RecurrenceRun
    {
        $existing = $this->findByRecurrenceDate($userId, $recurrenceId, $scheduledDate);
        if ($existing) {
            return $existing;
        }

        $now = date('c');
        $stmt = $this->pdo->prepare(
            'INSERT INTO recurrence_runs (
                user_id, recurrence_id, scheduled_date, status, entry_id, executed_at, created_at, updated_at
            ) VALUES (
                :uid, :rid, :scheduled_date, :status, NULL, NULL, :created_at, :updated_at
            )'
        );
        $stmt->execute([
            'uid' => $userId,
            'rid' => $recurrenceId,
            'scheduled_date' => $scheduledDate,
            'status' => 'pending',
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        return $this->findForUser((int)$this->pdo->lastInsertId(), $userId)
            ?? RecurrenceRun::fromArray([
                'id' => (int)$this->pdo->lastInsertId(),
                'user_id' => $userId,
                'recurrence_id' => $recurrenceId,
                'scheduled_date' => $scheduledDate,
                'status' => 'pending',
                'entry_id' => null,
                'executed_at' => null,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
    }

    public function updateForUser(int $id, int $userId, array $data): ?RecurrenceRun
    {
        $existing = $this->findForUser($id, $userId);
        if (!$existing) {
            return null;
        }
        $merged = array_merge($existing->toArray(), $data);
        $merged['updated_at'] = date('c');

        $stmt = $this->pdo->prepare(
            'UPDATE recurrence_runs
             SET status = :status,
                 entry_id = :entry_id,
                 executed_at = :executed_at,
                 updated_at = :updated_at
             WHERE id = :id
               AND user_id = :uid'
        );
        $entryId = isset($merged['entry_id']) && (int)$merged['entry_id'] > 0 ? (int)$merged['entry_id'] : null;
        $stmt->execute([
            'status' => (string)($merged['status'] ?? 'pending'),
            'entry_id' => $entryId,
            'executed_at' => $merged['executed_at'] ?? null,
            'updated_at' => $merged['updated_at'],
            'id' => $id,
            'uid' => $userId,
        ]);

        return $this->findForUser($id, $userId);
    }
}

