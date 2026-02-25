<?php
declare(strict_types=1);

namespace App\Repository;

use App\Domain\Entry;

interface EntryRepositoryInterface
{
    /** @return Entry[] */
    public function listByUser(int $userId, bool $includeDeleted = false): array;
    public function find(int $id, int $userId): ?Entry;
    public function create(int $userId, array $data): Entry;
    public function update(int $id, int $userId, array $data): ?Entry;
    public function delete(int $id, int $userId, bool $hard = false): bool;
    public function purge(int $id, ?int $userId = null): bool;
    public function setReviewStatus(int $id, bool $needsReview, ?string $reviewedAt = null): bool;
    public function reassignCategoryForUser(int $userId, string $fromCategory, string $toCategory): int;
    public function countByUserAccount(int $userId, int $accountId, bool $includeDeleted = true): int;
    /** @return Entry[] */
    public function listByRecurrence(int $userId, int $recurrenceId): array;

    /** Admin operations */
    /** @return Entry[] */
    public function listAll(array $filters = []): array;
    public function findById(int $id): ?Entry;
    public function updateAdmin(int $id, array $data): ?Entry;
    public function deleteAdmin(int $id, bool $hard = false): bool;
}
