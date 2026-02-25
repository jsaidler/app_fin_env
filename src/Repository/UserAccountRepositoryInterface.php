<?php
declare(strict_types=1);

namespace App\Repository;

use App\Domain\UserAccount;

interface UserAccountRepositoryInterface
{
    /** @return UserAccount[] */
    public function listByUser(int $userId, bool $includeInactive = false): array;

    public function findForUser(int $id, int $userId): ?UserAccount;

    public function findByUserAndName(int $userId, string $name): ?UserAccount;

    public function create(int $userId, string $name, string $type, string $icon, float $initialBalance = 0.0): UserAccount;

    public function updateForUser(int $id, int $userId, array $data): ?UserAccount;

    public function setActiveForUser(int $id, int $userId, bool $active): bool;

    public function deleteForUser(int $id, int $userId): bool;
}
