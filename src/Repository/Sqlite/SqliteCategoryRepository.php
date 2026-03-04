<?php
declare(strict_types=1);

namespace App\Repository\Sqlite;

use App\Domain\Category;
use App\Repository\CategoryRepositoryInterface;
use PDO;

class SqliteCategoryRepository implements CategoryRepositoryInterface
{
    private PDO $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function listAll(): array
    {
        $rows = $this->pdo->query('SELECT * FROM categories ORDER BY name ASC')->fetchAll();
        return array_map(fn($r) => Category::fromArray($r), $rows);
    }

    public function listForUser(int $userId): array
    {
        $stmt = $this->pdo->prepare('SELECT * FROM categories WHERE owner_user_id IS NULL OR owner_user_id = :uid ORDER BY name ASC');
        $stmt->execute(['uid' => $userId]);
        $rows = $stmt->fetchAll();
        return array_map(fn($r) => Category::fromArray($r), $rows);
    }

    public function find(int $id): ?Category
    {
        $stmt = $this->pdo->prepare('SELECT * FROM categories WHERE id = :id LIMIT 1');
        $stmt->execute(['id' => $id]);
        $row = $stmt->fetch();
        return $row ? Category::fromArray($row) : null;
    }

    public function create(string $name, string $type, ?string $alterdataAuto = null, array $meta = []): Category
    {
        $now = date('c');
        $accountClass = (string)($meta['account_class'] ?? 'synthetic');
        $parentCategoryId = isset($meta['parent_category_id']) && (int)$meta['parent_category_id'] > 0 ? (int)$meta['parent_category_id'] : null;
        $allowsAnalyticChildren = isset($meta['allows_analytic_children']) && (int)$meta['allows_analytic_children'] === 0 ? 0 : 1;
        $ownerUserId = isset($meta['owner_user_id']) && (int)$meta['owner_user_id'] > 0 ? (int)$meta['owner_user_id'] : null;
        $stmt = $this->pdo->prepare(
            'INSERT INTO categories (
                name, type, account_class, parent_category_id, allows_analytic_children, owner_user_id, alterdata_auto,
                created_at, updated_at, last_modified_by_user_id, last_modified_at
            ) VALUES (
                :name,:type,:account_class,:parent_category_id,:allows_analytic_children,:owner_user_id,:auto,
                :created,:updated,:last_modified_by,:last_modified_at
            )'
        );
        $stmt->execute([
            'name' => $name,
            'type' => $type,
            'account_class' => $accountClass,
            'parent_category_id' => $parentCategoryId,
            'allows_analytic_children' => $allowsAnalyticChildren,
            'owner_user_id' => $ownerUserId,
            'auto' => $alterdataAuto,
            'created' => $now,
            'updated' => $now,
            'last_modified_by' => null,
            'last_modified_at' => null,
        ]);
        $id = (int)$this->pdo->lastInsertId();
        return Category::fromArray([
            'id' => $id,
            'name' => $name,
            'type' => $type,
            'account_class' => $accountClass,
            'parent_category_id' => $parentCategoryId,
            'allows_analytic_children' => $allowsAnalyticChildren,
            'owner_user_id' => $ownerUserId,
            'alterdata_auto' => $alterdataAuto ?? '',
            'created_at' => $now,
            'updated_at' => $now,
        ]);
    }

    public function update(int $id, array $data): ?Category
    {
        $existing = $this->find($id);
        if (!$existing) {
            return null;
        }
        $merged = array_merge($existing->toArray(), $data);
        $merged['updated_at'] = date('c');
        $modifierId = isset($data['last_modified_by_user_id']) ? (int)$data['last_modified_by_user_id'] : null;
        $modifiedAt = isset($data['last_modified_by_user_id']) ? date('c') : null;
        $stmt = $this->pdo->prepare(
            'UPDATE categories SET
                name=:name,
                type=:type,
                account_class=:account_class,
                parent_category_id=:parent_category_id,
                allows_analytic_children=:allows_analytic_children,
                owner_user_id=:owner_user_id,
                alterdata_auto=:auto,
                updated_at=:updated,
                last_modified_by_user_id = COALESCE(:last_modified_by,last_modified_by_user_id),
                last_modified_at = COALESCE(:last_modified_at,last_modified_at)
             WHERE id=:id'
        );
        $stmt->execute([
            'name' => $merged['name'],
            'type' => $merged['type'],
            'account_class' => $merged['account_class'] ?? 'synthetic',
            'parent_category_id' => isset($merged['parent_category_id']) && (int)$merged['parent_category_id'] > 0 ? (int)$merged['parent_category_id'] : null,
            'allows_analytic_children' => isset($merged['allows_analytic_children']) && (int)$merged['allows_analytic_children'] === 0 ? 0 : 1,
            'owner_user_id' => isset($merged['owner_user_id']) && (int)$merged['owner_user_id'] > 0 ? (int)$merged['owner_user_id'] : null,
            'auto' => $merged['alterdata_auto'] ?? '',
            'updated' => $merged['updated_at'],
            'last_modified_by' => $modifierId && $modifierId > 0 ? $modifierId : null,
            'last_modified_at' => $modifiedAt,
            'id' => $id,
        ]);
        return Category::fromArray($merged);
    }

    public function delete(int $id): bool
    {
        $stmt = $this->pdo->prepare('DELETE FROM categories WHERE id=:id');
        $stmt->execute(['id' => $id]);
        return $stmt->rowCount() > 0;
    }
}
