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
        $sql = 'SELECT * FROM entries WHERE user_id = :uid';
        if (!$includeDeleted) {
            $sql .= ' AND deleted_at IS NULL';
        }
        $sql .= ' ORDER BY date DESC, id DESC';
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute(['uid' => $userId]);
        $rows = $stmt->fetchAll();
        return array_map(fn($r) => Entry::fromArray($r), $rows);
    }

    public function find(int $id, int $userId): ?Entry
    {
        $stmt = $this->pdo->prepare('SELECT * FROM entries WHERE id = :id AND user_id = :uid LIMIT 1');
        $stmt->execute(['id' => $id, 'uid' => $userId]);
        $row = $stmt->fetch();
        return $row ? Entry::fromArray($row) : null;
    }

    public function create(int $userId, array $data): Entry
    {
        $now = date('c');
        $needsReview = !empty($data['needs_review']) ? 1 : 0;
        $reviewedAt = $data['reviewed_at'] ?? null;
        $stmt = $this->pdo->prepare('INSERT INTO entries (user_id,type,amount,category,description,date,attachment_path,created_at,updated_at,deleted_at,deleted_type,needs_review,reviewed_at) VALUES (:uid,:type,:amount,:category,:description,:date,:attachment,:created,:updated,NULL,NULL,:needs_review,:reviewed_at)');
        $stmt->execute([
            'uid' => $userId,
            'type' => $data['type'],
            'amount' => $data['amount'],
            'category' => $data['category'],
            'description' => $data['description'] ?? '',
            'date' => $data['date'],
            'attachment' => $data['attachment_path'] ?? null,
            'created' => $now,
            'updated' => $now,
            'needs_review' => $needsReview,
            'reviewed_at' => $reviewedAt,
        ]);
        $id = (int)$this->pdo->lastInsertId();
        return Entry::fromArray([
            'id' => $id,
            'user_id' => $userId,
            'type' => $data['type'],
            'amount' => (float)$data['amount'],
            'category' => $data['category'],
            'description' => $data['description'] ?? '',
            'date' => $data['date'],
            'attachment_path' => $data['attachment_path'] ?? null,
            'created_at' => $now,
            'updated_at' => $now,
            'deleted_at' => null,
            'deleted_type' => null,
            'needs_review' => $needsReview,
            'reviewed_at' => $reviewedAt,
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
        $stmt = $this->pdo->prepare('UPDATE entries SET type=:type, amount=:amount, category=:category, description=:description, date=:date, attachment_path=:attachment, deleted_at=:deleted_at, deleted_type=:deleted_type, needs_review=:needs_review, reviewed_at=:reviewed_at, updated_at=:updated_at WHERE id=:id AND user_id=:uid');
        $stmt->execute([
            'type' => $merged['type'],
            'amount' => $merged['amount'],
            'category' => $merged['category'],
            'description' => $merged['description'],
            'date' => $merged['date'],
            'attachment' => $merged['attachment_path'],
            'deleted_at' => $merged['deleted_at'],
            'deleted_type' => $merged['deleted_type'],
            'needs_review' => !empty($merged['needs_review']) ? 1 : 0,
            'reviewed_at' => $merged['reviewed_at'],
            'updated_at' => $merged['updated_at'],
            'id' => $id,
            'uid' => $userId,
        ]);
        return Entry::fromArray($merged);
    }

    public function delete(int $id, int $userId, bool $hard = false): bool
    {
        $now = date('c');
        $stmt = $this->pdo->prepare('UPDATE entries SET deleted_at=:deleted_at, deleted_type=:deleted_type, updated_at=:updated_at WHERE id=:id AND user_id=:uid AND deleted_at IS NULL');
        $stmt->execute([
            'deleted_at' => $now,
            'deleted_type' => $hard ? 'hard' : 'soft',
            'updated_at' => $now,
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

    public function listAll(array $filters = []): array
    {
        $includeDeleted = (bool)($filters['include_deleted'] ?? false);
        $sql = 'SELECT * FROM entries WHERE 1=1';
        $params = [];
        if (!$includeDeleted) {
            $sql .= ' AND deleted_at IS NULL';
        }
        if (isset($filters['user_id'])) {
            $sql .= ' AND user_id = :uid';
            $params['uid'] = $filters['user_id'];
        }
        if (isset($filters['type'])) {
            $sql .= ' AND type = :type';
            $params['type'] = $filters['type'];
        }
        if (!empty($filters['start'])) {
            $sql .= ' AND date >= :start';
            $params['start'] = $filters['start'];
        }
        if (!empty($filters['end'])) {
            $sql .= ' AND date <= :end';
            $params['end'] = $filters['end'];
        }
        if (isset($filters['month'])) {
            $sql .= ' AND substr(date, 1, 7) = :month';
            $params['month'] = $filters['month'];
        }
        if (isset($filters['needs_review'])) {
            $sql .= ' AND needs_review = :needs_review';
            $params['needs_review'] = $filters['needs_review'] ? 1 : 0;
        }
        $sql .= ' ORDER BY date DESC, id DESC';
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        $rows = $stmt->fetchAll();
        return array_map(fn($r) => Entry::fromArray($r), $rows);
    }

    public function findById(int $id): ?Entry
    {
        $stmt = $this->pdo->prepare('SELECT * FROM entries WHERE id = :id LIMIT 1');
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
        $stmt = $this->pdo->prepare('UPDATE entries SET user_id=:uid, type=:type, amount=:amount, category=:category, description=:description, date=:date, attachment_path=:attachment, needs_review=:needs_review, reviewed_at=:reviewed_at, updated_at=:updated_at WHERE id=:id AND deleted_at IS NULL');
        $stmt->execute([
            'uid' => $merged['user_id'],
            'type' => $merged['type'],
            'amount' => $merged['amount'],
            'category' => $merged['category'],
            'description' => $merged['description'],
            'date' => $merged['date'],
            'attachment' => $merged['attachment_path'],
            'needs_review' => !empty($merged['needs_review']) ? 1 : 0,
            'reviewed_at' => $merged['reviewed_at'],
            'updated_at' => $merged['updated_at'],
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
}
