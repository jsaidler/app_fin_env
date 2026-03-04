<?php
declare(strict_types=1);

namespace App\Domain;

class RecurrenceRun
{
    public int $id;
    public int $userId;
    public int $recurrenceId;
    public string $scheduledDate;
    public string $status;
    public ?int $entryId = null;
    public ?string $executedAt = null;
    public string $createdAt;
    public string $updatedAt;

    public static function fromArray(array $data): self
    {
        $item = new self();
        $item->id = (int)($data['id'] ?? 0);
        $item->userId = (int)($data['user_id'] ?? 0);
        $item->recurrenceId = (int)($data['recurrence_id'] ?? 0);
        $item->scheduledDate = (string)($data['scheduled_date'] ?? date('Y-m-d'));
        $item->status = (string)($data['status'] ?? 'pending');
        $item->entryId = isset($data['entry_id']) && $data['entry_id'] !== null ? (int)$data['entry_id'] : null;
        $item->executedAt = isset($data['executed_at']) && $data['executed_at'] !== '' ? (string)$data['executed_at'] : null;
        $item->createdAt = (string)($data['created_at'] ?? date('c'));
        $item->updatedAt = (string)($data['updated_at'] ?? date('c'));
        return $item;
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->userId,
            'recurrence_id' => $this->recurrenceId,
            'scheduled_date' => $this->scheduledDate,
            'status' => $this->status,
            'entry_id' => $this->entryId,
            'executed_at' => $this->executedAt,
            'created_at' => $this->createdAt,
            'updated_at' => $this->updatedAt,
        ];
    }
}

