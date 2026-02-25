<?php
declare(strict_types=1);

namespace App\Repository\Sqlite;

use App\Domain\Entry;
use App\Repository\EntryRepositoryInterface;
use PDO;

class SqliteEntryRepository implements EntryRepositoryInterface
{
    private PDO $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function listByUser(int $userId, bool $includeDeleted = false): array
    {
        $sql = 'SELECT e.*, ua.name AS account_name, ua.type AS account_type
                FROM entries e
                LEFT JOIN user_accounts ua ON ua.id = e.account_id
                WHERE e.user_id = :uid';
        if (!$includeDeleted) {
            $sql .= ' AND e.deleted_at IS NULL';
        }
        $sql .= ' ORDER BY e.date DESC, e.id DESC';
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute(['uid' => $userId]);
        $rows = $stmt->fetchAll();
        return array_map(fn($r) => Entry::fromArray($r), $rows);
    }

    public function find(int $id, int $userId): ?Entry
    {
        $stmt = $this->pdo->prepare(
            'SELECT e.*, ua.name AS account_name, ua.type AS account_type
             FROM entries e
             LEFT JOIN user_accounts ua ON ua.id = e.account_id
             WHERE e.id = :id AND e.user_id = :uid
             LIMIT 1'
        );
        $stmt->execute(['id' => $id, 'uid' => $userId]);
        $row = $stmt->fetch();
        return $row ? Entry::fromArray($row) : null;
    }

    public function create(int $userId, array $data): Entry
    {
        $now = date('c');
        $modifierId = isset($data['last_modified_by_user_id']) ? (int)$data['last_modified_by_user_id'] : $userId;
        $modifiedAt = $now;
        $needsReview = !empty($data['needs_review']) ? 1 : 0;
        $reviewedAt = $data['reviewed_at'] ?? null;
        $stmt = $this->pdo->prepare('INSERT INTO entries (user_id,type,amount,category,account_id,description,date,attachment_path,created_at,updated_at,deleted_at,deleted_type,needs_review,reviewed_at,recurrence_id,last_modified_by_user_id,last_modified_at) VALUES (:uid,:type,:amount,:category,:account_id,:description,:date,:attachment,:created,:updated,NULL,NULL,:needs_review,:reviewed_at,:recurrence_id,:last_modified_by,:last_modified_at)');
        $stmt->execute([
            'uid' => $userId,
            'type' => $data['type'],
            'amount' => $data['amount'],
            'category' => $data['category'],
            'account_id' => isset($data['account_id']) ? (int)$data['account_id'] : null,
            'description' => $data['description'] ?? '',
            'date' => $data['date'],
            'attachment' => $data['attachment_path'] ?? null,
            'created' => $now,
            'updated' => $now,
            'needs_review' => $needsReview,
            'reviewed_at' => $reviewedAt,
            'recurrence_id' => isset($data['recurrence_id']) ? (int)$data['recurrence_id'] : null,
            'last_modified_by' => $modifierId > 0 ? $modifierId : null,
            'last_modified_at' => $modifiedAt,
        ]);
        $id = (int)$this->pdo->lastInsertId();
        return Entry::fromArray([
            'id' => $id,
            'user_id' => $userId,
            'type' => $data['type'],
            'amount' => (float)$data['amount'],
            'category' => $data['category'],
            'account_id' => isset($data['account_id']) ? (int)$data['account_id'] : null,
            'description' => $data['description'] ?? '',
            'date' => $data['date'],
            'attachment_path' => $data['attachment_path'] ?? null,
            'created_at' => $now,
            'updated_at' => $now,
            'deleted_at' => null,
            'deleted_type' => null,
            'needs_review' => $needsReview,
            'reviewed_at' => $reviewedAt,
            'recurrence_id' => isset($data['recurrence_id']) ? (int)$data['recurrence_id'] : null,
        ]);
    }

    public function update(int $id, int $userId, array $data): ?Entry
    {
        $existing = $this->find($id, $userId);
        if (!$existing) {
            return null;
        }
        $merged = array_merge($existing->toArray(), $data);
        $merged['updated_at'] = date('c');
        $modifierId = isset($data['last_modified_by_user_id']) ? (int)$data['last_modified_by_user_id'] : null;
        $modifiedAt = isset($data['last_modified_by_user_id']) ? date('c') : null;
        $stmt = $this->pdo->prepare('UPDATE entries SET type=:type, amount=:amount, category=:category, account_id=:account_id, description=:description, date=:date, attachment_path=:attachment, deleted_at=:deleted_at, deleted_type=:deleted_type, needs_review=:needs_review, reviewed_at=:reviewed_at, recurrence_id=:recurrence_id, updated_at=:updated_at, last_modified_by_user_id = COALESCE(:last_modified_by,last_modified_by_user_id), last_modified_at = COALESCE(:last_modified_at,last_modified_at) WHERE id=:id AND user_id=:uid');
        $stmt->execute([
            'type' => $merged['type'],
            'amount' => $merged['amount'],
            'category' => $merged['category'],
            'account_id' => isset($merged['account_id']) ? (int)$merged['account_id'] : null,
            'description' => $merged['description'],
            'date' => $merged['date'],
            'attachment' => $merged['attachment_path'],
            'deleted_at' => $merged['deleted_at'],
            'deleted_type' => $merged['deleted_type'],
            'needs_review' => !empty($merged['needs_review']) ? 1 : 0,
            'reviewed_at' => $merged['reviewed_at'],
            'recurrence_id' => isset($merged['recurrence_id']) ? (int)$merged['recurrence_id'] : null,
            'updated_at' => $merged['updated_at'],
            'last_modified_by' => $modifierId && $modifierId > 0 ? $modifierId : null,
            'last_modified_at' => $modifiedAt,
            'id' => $id,
            'uid' => $userId,
        ]);
        return Entry::fromArray($merged);
    }

    public function delete(int $id, int $userId, bool $hard = false): bool
    {
        $now = date('c');
        $stmt = $this->pdo->prepare('UPDATE entries SET deleted_at=:deleted_at, deleted_type=:deleted_type, updated_at=:updated_at, last_modified_by_user_id = COALESCE(:last_modified_by,last_modified_by_user_id), last_modified_at = COALESCE(:last_modified_at,last_modified_at) WHERE id=:id AND user_id=:uid AND deleted_at IS NULL');
        $stmt->execute([
            'deleted_at' => $now,
            'deleted_type' => $hard ? 'hard' : 'soft',
            'updated_at' => $now,
            'last_modified_by' => $userId > 0 ? $userId : null,
            'last_modified_at' => $now,
            'id' => $id,
            'uid' => $userId,
        ]);
        return $stmt->rowCount() > 0;
    }

    public function purge(int $id, ?int $userId = null): bool
    {
        $sql = 'DELETE FROM entries WHERE id=:id';
        $params = ['id' => $id];
        if ($userId !== null) {
            $sql .= ' AND user_id = :uid';
            $params['uid'] = $userId;
        }
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        return $stmt->rowCount() > 0;
    }

    public function setReviewStatus(int $id, bool $needsReview, ?string $reviewedAt = null): bool
    {
        $stmt = $this->pdo->prepare('UPDATE entries SET needs_review=:needs_review, reviewed_at=:reviewed_at, updated_at=:updated_at WHERE id=:id');
        $stmt->execute([
            'needs_review' => $needsReview ? 1 : 0,
            'reviewed_at' => $reviewedAt,
            'updated_at' => date('c'),
            'id' => $id,
        ]);
        return $stmt->rowCount() > 0;
    }

    public function reassignCategoryForUser(int $userId, string $fromCategory, string $toCategory): int
    {
        $from = trim($fromCategory);
        $to = trim($toCategory);
        if ($userId <= 0 || $from === '' || $to === '' || strcasecmp($from, $to) === 0) {
            return 0;
        }
        $stmt = $this->pdo->prepare(
            'UPDATE entries
             SET category = :to_category,
                 updated_at = :updated_at,
                 last_modified_by_user_id = :last_modified_by,
                 last_modified_at = :last_modified_at
             WHERE user_id = :uid
               AND lower(category) = lower(:from_category)'
        );
        $stmt->execute([
            'to_category' => $to,
            'updated_at' => date('c'),
            'last_modified_by' => $userId > 0 ? $userId : null,
            'last_modified_at' => date('c'),
            'uid' => $userId,
            'from_category' => $from,
        ]);
        return (int)$stmt->rowCount();
    }

    public function listAll(array $filters = []): array
    {
        $includeDeleted = (bool)($filters['include_deleted'] ?? false);
        $sql = 'SELECT e.*, ua.name AS account_name, ua.type AS account_type
                FROM entries e
                LEFT JOIN user_accounts ua ON ua.id = e.account_id
                WHERE 1=1';
        $params = [];
        if (!$includeDeleted) {
            $sql .= ' AND e.deleted_at IS NULL';
        }
        if (isset($filters['user_id'])) {
            $sql .= ' AND e.user_id = :uid';
            $params['uid'] = $filters['user_id'];
        }
        if (isset($filters['type'])) {
            $sql .= ' AND e.type = :type';
            $params['type'] = $filters['type'];
        }
        if (!empty($filters['start'])) {
            $sql .= ' AND e.date >= :start';
            $params['start'] = $filters['start'];
        }
        if (!empty($filters['end'])) {
            $sql .= ' AND e.date <= :end';
            $params['end'] = $filters['end'];
        }
        if (isset($filters['month'])) {
            $sql .= ' AND substr(e.date, 1, 7) = :month';
            $params['month'] = $filters['month'];
        }
        if (isset($filters['needs_review'])) {
            $sql .= ' AND e.needs_review = :needs_review';
            $params['needs_review'] = $filters['needs_review'] ? 1 : 0;
        }
        if (isset($filters['account_id'])) {
            $sql .= ' AND e.account_id = :account_id';
            $params['account_id'] = (int)$filters['account_id'];
        }
        $sql .= ' ORDER BY e.date DESC, e.id DESC';
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        $rows = $stmt->fetchAll();
        return array_map(fn($r) => Entry::fromArray($r), $rows);
    }

    public function findById(int $id): ?Entry
    {
        $stmt = $this->pdo->prepare(
            'SELECT e.*, ua.name AS account_name, ua.type AS account_type
             FROM entries e
             LEFT JOIN user_accounts ua ON ua.id = e.account_id
             WHERE e.id = :id
             LIMIT 1'
        );
        $stmt->execute(['id' => $id]);
        $row = $stmt->fetch();
        return $row ? Entry::fromArray($row) : null;
    }

    public function updateAdmin(int $id, array $data): ?Entry
    {
        $existing = $this->findById($id);
        if (!$existing || $existing->deletedAt) {
            return null;
        }
        $merged = array_merge($existing->toArray(), $data);
        $merged['updated_at'] = date('c');
        $modifierId = isset($data['last_modified_by_user_id']) ? (int)$data['last_modified_by_user_id'] : null;
        $modifiedAt = isset($data['last_modified_by_user_id']) ? date('c') : null;
        $stmt = $this->pdo->prepare('UPDATE entries SET user_id=:uid, type=:type, amount=:amount, category=:category, account_id=:account_id, description=:description, date=:date, attachment_path=:attachment, needs_review=:needs_review, reviewed_at=:reviewed_at, updated_at=:updated_at, last_modified_by_user_id = COALESCE(:last_modified_by,last_modified_by_user_id), last_modified_at = COALESCE(:last_modified_at,last_modified_at) WHERE id=:id AND deleted_at IS NULL');
        $stmt->execute([
            'uid' => $merged['user_id'],
            'type' => $merged['type'],
            'amount' => $merged['amount'],
            'category' => $merged['category'],
            'account_id' => isset($merged['account_id']) ? (int)$merged['account_id'] : null,
            'description' => $merged['description'],
            'date' => $merged['date'],
            'attachment' => $merged['attachment_path'],
            'needs_review' => !empty($merged['needs_review']) ? 1 : 0,
            'reviewed_at' => $merged['reviewed_at'],
            'updated_at' => $merged['updated_at'],
            'last_modified_by' => $modifierId && $modifierId > 0 ? $modifierId : null,
            'last_modified_at' => $modifiedAt,
            'id' => $id,
        ]);
        return Entry::fromArray($merged);
    }

    public function deleteAdmin(int $id, bool $hard = false): bool
    {
        $now = date('c');
        $stmt = $this->pdo->prepare('UPDATE entries SET deleted_at=:deleted_at, deleted_type=:deleted_type, updated_at=:updated_at WHERE id=:id AND deleted_at IS NULL');
        $stmt->execute([
            'deleted_at' => $now,
            'deleted_type' => $hard ? 'hard' : 'soft',
            'updated_at' => $now,
            'id' => $id,
        ]);
        return $stmt->rowCount() > 0;
    }

    public function countByUserAccount(int $userId, int $accountId, bool $includeDeleted = true): int
    {
        $sql = 'SELECT COUNT(1) FROM entries WHERE user_id = :uid AND account_id = :account_id';
        if (!$includeDeleted) {
            $sql .= ' AND deleted_at IS NULL';
        }
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            'uid' => $userId,
            'account_id' => $accountId,
        ]);
        return (int)$stmt->fetchColumn();
    }

    public function listByRecurrence(int $userId, int $recurrenceId): array
    {
        $stmt = $this->pdo->prepare(
            'SELECT e.*, ua.name AS account_name, ua.type AS account_type
             FROM entries e
             LEFT JOIN user_accounts ua ON ua.id = e.account_id
             WHERE e.user_id = :uid
               AND e.recurrence_id = :recurrence_id
             ORDER BY e.date DESC, e.id DESC'
        );
        $stmt->execute([
            'uid' => $userId,
            'recurrence_id' => $recurrenceId,
        ]);
        $rows = $stmt->fetchAll();
        return array_map(fn($row) => Entry::fromArray($row), $rows);
    }
}
