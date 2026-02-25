<?php
declare(strict_types=1);

namespace App\Repository\Sqlite;

use App\Domain\UserCategory;
use App\Repository\UserCategoryRepositoryInterface;
use PDO;

class SqliteUserCategoryRepository implements UserCategoryRepositoryInterface
{
    private PDO $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function listByUser(int $userId): array
    {
        $stmt = $this->pdo->prepare(
            'SELECT uc.*, c.name AS global_name, c.type AS global_type, c.alterdata_auto AS global_alterdata_auto
             FROM user_categories uc
             INNER JOIN categories c ON c.id = uc.global_category_id
             WHERE uc.user_id = :uid
             ORDER BY uc.name COLLATE NOCASE ASC'
        );
        $stmt->execute(['uid' => $userId]);
        $rows = $stmt->fetchAll();
        return array_map(fn($row) => UserCategory::fromArray($row), $rows);
    }

    public function listAll(): array
    {
        $rows = $this->pdo->query(
            'SELECT uc.*, c.name AS global_name, c.type AS global_type, c.alterdata_auto AS global_alterdata_auto
             FROM user_categories uc
             INNER JOIN categories c ON c.id = uc.global_category_id
             ORDER BY uc.user_id ASC, uc.name COLLATE NOCASE ASC'
        )->fetchAll();
        return array_map(fn($row) => UserCategory::fromArray($row), $rows);
    }

    public function findForUser(int $id, int $userId): ?UserCategory
    {
        $stmt = $this->pdo->prepare(
            'SELECT uc.*, c.name AS global_name, c.type AS global_type, c.alterdata_auto AS global_alterdata_auto
             FROM user_categories uc
             INNER JOIN categories c ON c.id = uc.global_category_id
             WHERE uc.id = :id AND uc.user_id = :uid
             LIMIT 1'
        );
        $stmt->execute(['id' => $id, 'uid' => $userId]);
        $row = $stmt->fetch();
        return $row ? UserCategory::fromArray($row) : null;
    }

    public function findByUserAndName(int $userId, string $name): ?UserCategory
    {
        $stmt = $this->pdo->prepare(
            'SELECT uc.*, c.name AS global_name, c.type AS global_type, c.alterdata_auto AS global_alterdata_auto
             FROM user_categories uc
             INNER JOIN categories c ON c.id = uc.global_category_id
             WHERE uc.user_id = :uid AND lower(uc.name) = lower(:name)
             LIMIT 1'
        );
        $stmt->execute(['uid' => $userId, 'name' => $name]);
        $row = $stmt->fetch();
        return $row ? UserCategory::fromArray($row) : null;
    }

    public function create(int $userId, string $name, string $icon, int $globalCategoryId): UserCategory
    {
        $now = date('c');
        $stmt = $this->pdo->prepare(
            'INSERT INTO user_categories (user_id, name, icon, global_category_id, created_at, updated_at, last_modified_by_user_id, last_modified_at)
             VALUES (:uid, :name, :icon, :global_id, :created_at, :updated_at, :last_modified_by, :last_modified_at)'
        );
        $stmt->execute([
            'uid' => $userId,
            'name' => $name,
            'icon' => $icon,
            'global_id' => $globalCategoryId,
            'created_at' => $now,
            'updated_at' => $now,
            'last_modified_by' => null,
            'last_modified_at' => null,
        ]);
        $id = (int)$this->pdo->lastInsertId();
        return $this->findForUser($id, $userId) ?? UserCategory::fromArray([
            'id' => $id,
            'user_id' => $userId,
            'name' => $name,
            'icon' => $icon,
            'global_category_id' => $globalCategoryId,
            'created_at' => $now,
            'updated_at' => $now,
        ]);
    }

    public function updateForUser(int $id, int $userId, array $data): ?UserCategory
    {
        $existing = $this->findForUser($id, $userId);
        if (!$existing) {
            return null;
        }
        $merged = array_merge($existing->toArray(), $data);
        $merged['updated_at'] = date('c');
        $modifierId = isset($data['last_modified_by_user_id']) ? (int)$data['last_modified_by_user_id'] : null;
        $modifiedAt = isset($data['last_modified_by_user_id']) ? date('c') : null;

        $stmt = $this->pdo->prepare(
            'UPDATE user_categories
             SET name = :name,
                 icon = :icon,
                 global_category_id = :global_id,
                 updated_at = :updated_at,
                 last_modified_by_user_id = COALESCE(:last_modified_by,last_modified_by_user_id),
                 last_modified_at = COALESCE(:last_modified_at,last_modified_at)
             WHERE id = :id AND user_id = :uid'
        );
        $stmt->execute([
            'name' => $merged['name'],
            'icon' => $merged['icon'],
            'global_id' => (int)$merged['global_category_id'],
            'updated_at' => $merged['updated_at'],
            'last_modified_by' => $modifierId && $modifierId > 0 ? $modifierId : null,
            'last_modified_at' => $modifiedAt,
            'id' => $id,
            'uid' => $userId,
        ]);

        return $this->findForUser($id, $userId);
    }

    public function deleteForUser(int $id, int $userId): bool
    {
        $stmt = $this->pdo->prepare('DELETE FROM user_categories WHERE id = :id AND user_id = :uid');
        $stmt->execute(['id' => $id, 'uid' => $userId]);
        return $stmt->rowCount() > 0;
    }
}
