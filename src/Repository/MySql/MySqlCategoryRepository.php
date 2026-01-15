<?php
declare(strict_types=1);

namespace App\Repository\MySql;

use App\Domain\Category;
use App\Repository\CategoryRepositoryInterface;
use PDO;

class MySqlCategoryRepository implements CategoryRepositoryInterface
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

    public function find(int $id): ?Category
    {
        $stmt = $this->pdo->prepare('SELECT * FROM categories WHERE id = :id LIMIT 1');
        $stmt->execute(['id' => $id]);
        $row = $stmt->fetch();
        return $row ? Category::fromArray($row) : null;
    }

    public function create(string $name, string $type, ?string $alterdataAuto = null): Category
    {
        $stmt = $this->pdo->prepare('INSERT INTO categories (name, type, alterdata_auto, created_at, updated_at) VALUES (:name,:type,:auto,NOW(),NOW())');
        $stmt->execute(['name' => $name, 'type' => $type, 'auto' => $alterdataAuto]);
        $id = (int)$this->pdo->lastInsertId();
        return Category::fromArray([
            'id' => $id,
            'name' => $name,
            'type' => $type,
            'alterdata_auto' => $alterdataAuto ?? '',
            'created_at' => date('c'),
            'updated_at' => date('c'),
        ]);
    }

    public function update(int $id, array $data): ?Category
    {
        $existing = $this->find($id);
        if (!$existing) {
            return null;
        }
        $merged = array_merge($existing->toArray(), $data);
        $stmt = $this->pdo->prepare('UPDATE categories SET name=:name, type=:type, alterdata_auto=:auto, updated_at=NOW() WHERE id=:id');
        $stmt->execute([
            'name' => $merged['name'],
            'type' => $merged['type'],
            'auto' => $merged['alterdata_auto'] ?? '',
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
