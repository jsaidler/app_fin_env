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
            'SELECT c.id,
                    c.owner_user_id AS user_id,
                    c.name,
                    c.icon,
                    c.color,
                    c.parent_category_id AS global_category_id,
                    c.account_class,
                    c.created_at,
                    c.updated_at,
                    c.last_modified_by_user_id,
                    c.last_modified_at,
                    g.name AS global_name,
                    g.type AS global_type,
                    g.alterdata_auto AS global_alterdata_auto
             FROM categories c
             LEFT JOIN categories g ON g.id = c.parent_category_id
             WHERE c.owner_user_id = :uid
               AND c.account_class = "analytic"
             ORDER BY c.name COLLATE NOCASE ASC'
        );
        $stmt->execute(['uid' => $userId]);
        $rows = $stmt->fetchAll();
        return array_map(fn($row) => UserCategory::fromArray($row), $rows);
    }

    public function listAll(): array
    {
        $rows = $this->pdo->query(
            'SELECT c.id,
                    c.owner_user_id AS user_id,
                    c.name,
                    c.icon,
                    c.color,
                    c.parent_category_id AS global_category_id,
                    c.account_class,
                    c.created_at,
                    c.updated_at,
                    c.last_modified_by_user_id,
                    c.last_modified_at,
                    g.name AS global_name,
                    g.type AS global_type,
                    g.alterdata_auto AS global_alterdata_auto
             FROM categories c
             LEFT JOIN categories g ON g.id = c.parent_category_id
             WHERE c.owner_user_id IS NOT NULL
               AND c.account_class = "analytic"
             ORDER BY c.owner_user_id ASC, c.name COLLATE NOCASE ASC'
        )->fetchAll();
        return array_map(fn($row) => UserCategory::fromArray($row), $rows);
    }

    public function findForUser(int $id, int $userId): ?UserCategory
    {
        $stmt = $this->pdo->prepare(
            'SELECT c.id,
                    c.owner_user_id AS user_id,
                    c.name,
                    c.icon,
                    c.color,
                    c.parent_category_id AS global_category_id,
                    c.account_class,
                    c.created_at,
                    c.updated_at,
                    c.last_modified_by_user_id,
                    c.last_modified_at,
                    g.name AS global_name,
                    g.type AS global_type,
                    g.alterdata_auto AS global_alterdata_auto
             FROM categories c
             LEFT JOIN categories g ON g.id = c.parent_category_id
             WHERE c.id = :id
               AND c.owner_user_id = :uid
               AND c.account_class = "analytic"
             LIMIT 1'
        );
        $stmt->execute(['id' => $id, 'uid' => $userId]);
        $row = $stmt->fetch();
        return $row ? UserCategory::fromArray($row) : null;
    }

    public function findByUserAndName(int $userId, string $name): ?UserCategory
    {
        $stmt = $this->pdo->prepare(
            'SELECT c.id,
                    c.owner_user_id AS user_id,
                    c.name,
                    c.icon,
                    c.color,
                    c.parent_category_id AS global_category_id,
                    c.account_class,
                    c.created_at,
                    c.updated_at,
                    c.last_modified_by_user_id,
                    c.last_modified_at,
                    g.name AS global_name,
                    g.type AS global_type,
                    g.alterdata_auto AS global_alterdata_auto
             FROM categories c
             LEFT JOIN categories g ON g.id = c.parent_category_id
             WHERE c.owner_user_id = :uid
               AND c.account_class = "analytic"
               AND lower(c.name) = lower(:name)
             LIMIT 1'
        );
        $stmt->execute(['uid' => $userId, 'name' => $name]);
        $row = $stmt->fetch();
        return $row ? UserCategory::fromArray($row) : null;
    }

    public function create(int $userId, string $name, string $icon, string $color, int $globalCategoryId, array $meta = []): UserCategory
    {
        $now = date('c');
        $accountClass = (string)($meta['account_class'] ?? 'analytic');
        $parent = $this->findGlobalParent($globalCategoryId);
        $type = (string)($parent['type'] ?? 'out');
        $stmt = $this->pdo->prepare(
            'INSERT INTO categories (
                name, type, icon, color, account_class, parent_category_id, allows_analytic_children,
                owner_user_id, alterdata_auto, created_at, updated_at, last_modified_by_user_id, last_modified_at
            ) VALUES (
                :name, :type, :icon, :color, :account_class, :parent_category_id, 0,
                :owner_user_id, :alterdata_auto, :created_at, :updated_at, :last_modified_by, :last_modified_at
            )'
        );
        $stmt->execute([
            'name' => $name,
            'type' => $type,
            'icon' => $icon,
            'color' => $color,
            'account_class' => $accountClass,
            'parent_category_id' => $globalCategoryId,
            'owner_user_id' => $userId,
            'alterdata_auto' => '',
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
            'color' => $color,
            'global_category_id' => $globalCategoryId,
            'account_class' => $accountClass,
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
        $globalCategoryId = (int)($merged['global_category_id'] ?? 0);
        $parent = $this->findGlobalParent($globalCategoryId);
        $type = (string)($parent['type'] ?? 'out');

        $stmt = $this->pdo->prepare(
            'UPDATE categories
             SET name = :name,
                 icon = :icon,
                 color = :color,
                 type = :type,
                 account_class = :account_class,
                 parent_category_id = :global_id,
                 allows_analytic_children = 0,
                 updated_at = :updated_at,
                 last_modified_by_user_id = COALESCE(:last_modified_by,last_modified_by_user_id),
                 last_modified_at = COALESCE(:last_modified_at,last_modified_at)
             WHERE id = :id
               AND owner_user_id = :uid
               AND account_class = "analytic"'
        );
        $stmt->execute([
            'name' => $merged['name'],
            'icon' => $merged['icon'],
            'color' => (string)($merged['color'] ?? ''),
            'type' => $type,
            'account_class' => $merged['account_class'] ?? 'analytic',
            'global_id' => $globalCategoryId,
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
        $stmt = $this->pdo->prepare(
            'DELETE FROM categories
             WHERE id = :id
               AND owner_user_id = :uid
               AND account_class = "analytic"'
        );
        $stmt->execute(['id' => $id, 'uid' => $userId]);
        return $stmt->rowCount() > 0;
    }

    private function findGlobalParent(int $id): array
    {
        $stmt = $this->pdo->prepare('SELECT id, type FROM categories WHERE id = :id LIMIT 1');
        $stmt->execute(['id' => $id]);
        $row = $stmt->fetch();
        return is_array($row) ? $row : [];
    }
}
