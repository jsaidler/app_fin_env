<?php
declare(strict_types=1);

namespace App\Repository;

use App\Domain\Recurrence;

interface RecurrenceRepositoryInterface
{
    /** @return Recurrence[] */
    public function listByUser(int $userId, bool $activeOnly = false): array;

    public function findForUser(int $id, int $userId): ?Recurrence;

    public function create(int $userId, array $data): Recurrence;

    public function updateForUser(int $id, int $userId, array $data): ?Recurrence;

    public function deleteForUser(int $id, int $userId): bool;

    /** @return Recurrence[] */
    public function listDueByUser(int $userId, string $dateIso): array;
}