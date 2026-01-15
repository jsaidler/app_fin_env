<?php
declare(strict_types=1);

namespace App\Repository;

use App\Domain\Category;

interface CategoryRepositoryInterface
{
    /** @return Category[] */
    public function listAll(): array;
    public function find(int $id): ?Category;
    public function create(string $name, string $type, ?string $alterdataAuto = null): Category;
    public function update(int $id, array $data): ?Category;
    public function delete(int $id): bool;
}
