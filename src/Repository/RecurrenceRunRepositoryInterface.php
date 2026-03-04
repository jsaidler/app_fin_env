<?php
declare(strict_types=1);

namespace App\Repository;

use App\Domain\RecurrenceRun;

interface RecurrenceRunRepositoryInterface
{
    /** @return RecurrenceRun[] */
    public function listByRecurrence(int $userId, int $recurrenceId, int $limit = 240): array;

    public function findForUser(int $id, int $userId): ?RecurrenceRun;

    public function findByRecurrenceDate(int $userId, int $recurrenceId, string $scheduledDate): ?RecurrenceRun;

    public function createPending(int $userId, int $recurrenceId, string $scheduledDate): RecurrenceRun;

    public function updateForUser(int $id, int $userId, array $data): ?RecurrenceRun;
}

