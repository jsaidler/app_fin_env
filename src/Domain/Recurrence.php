<?php
declare(strict_types=1);

namespace App\Domain;

class Recurrence
{
    public int $id;
    public int $userId;
    public string $type;
    public float $amount;
    public string $category;
    public int $accountId;
    public string $accountName = '';
    public string $accountType = '';
    public string $description = '';
    public string $frequency;
    public string $startDate;
    public string $nextRunDate;
    public ?string $lastRunDate = null;
    public bool $active = true;
    public string $createdAt;
    public string $updatedAt;

    public static function fromArray(array $data): self
    {
        $item = new self();
        $item->id = (int)($data['id'] ?? 0);
        $item->userId = (int)($data['user_id'] ?? 0);
        $item->type = (string)($data['type'] ?? 'out');
        $item->amount = (float)($data['amount'] ?? 0);
        $item->category = (string)($data['category'] ?? '');
        $item->accountId = (int)($data['account_id'] ?? 0);
        $item->accountName = (string)($data['account_name'] ?? '');
        $item->accountType = (string)($data['account_type'] ?? '');
        $item->description = (string)($data['description'] ?? '');
        $item->frequency = (string)($data['frequency'] ?? 'monthly');
        $item->startDate = (string)($data['start_date'] ?? date('Y-m-d'));
        $item->nextRunDate = (string)($data['next_run_date'] ?? $item->startDate);
        $item->lastRunDate = isset($data['last_run_date']) && $data['last_run_date'] !== ''
            ? (string)$data['last_run_date']
            : null;
        $item->active = (int)($data['active'] ?? 1) === 1;
        $item->createdAt = (string)($data['created_at'] ?? date('c'));
        $item->updatedAt = (string)($data['updated_at'] ?? date('c'));
        return $item;
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->userId,
            'type' => $this->type,
            'amount' => $this->amount,
            'category' => $this->category,
            'account_id' => $this->accountId,
            'account_name' => $this->accountName,
            'account_type' => $this->accountType,
            'description' => $this->description,
            'frequency' => $this->frequency,
            'start_date' => $this->startDate,
            'next_run_date' => $this->nextRunDate,
            'last_run_date' => $this->lastRunDate,
            'active' => $this->active ? 1 : 0,
            'created_at' => $this->createdAt,
            'updated_at' => $this->updatedAt,
        ];
    }
}