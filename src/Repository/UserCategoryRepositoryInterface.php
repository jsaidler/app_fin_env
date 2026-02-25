<?php
declare(strict_types=1);

namespace App\Repository;

use App\Domain\UserCategory;

interface UserCategoryRepositoryInterface
{
    /** @return UserCategory[] */
    public function listByUser(int $userId): array;

    /** @return UserCategory[] */
    public function listAll(): array;

    public function findForUser(int $id, int $userId): ?UserCategory;

    public function findByUserAndName(int $userId, string $name): ?UserCategory;

    public function create(int $userId, string $name, string $icon, int $globalCategoryId): UserCategory;

    public function updateForUser(int $id, int $userId, array $data): ?UserCategory;

    public function deleteForUser(int $id, int $userId): bool;
}

