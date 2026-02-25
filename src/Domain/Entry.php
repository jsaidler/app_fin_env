<?php
declare(strict_types=1);

namespace App\Domain;

class Entry
{
    public int $id;
    public int $userId;
    public string $type; // in|out
    public float $amount;
    public string $category;
    public ?int $accountId = null;
    public string $accountName = '';
    public string $accountType = '';
    public string $description;
    public string $date;
    public ?string $attachmentPath;
    public string $createdAt;
    public string $updatedAt;
    public ?string $deletedAt = null;
    public ?string $deletedType = null;
    public bool $needsReview = false;
    public ?string $reviewedAt = null;
    public ?int $recurrenceId = null;

    public static function fromArray(array $data): self
    {
        $e = new self();
        $e->id = (int) $data['id'];
        $e->userId = (int) $data['user_id'];
        $e->type = $data['type'];
        $e->amount = (float) $data['amount'];
        $e->category = $data['category'];
        $e->accountId = array_key_exists('account_id', $data) && $data['account_id'] !== null ? (int)$data['account_id'] : null;
        $e->accountName = (string)($data['account_name'] ?? '');
        $e->accountType = (string)($data['account_type'] ?? '');
        $e->description = $data['description'] ?? '';
        $e->date = $data['date'];
        $e->attachmentPath = $data['attachment_path'] ?? null;
        $e->createdAt = $data['created_at'] ?? date('c');
        $e->updatedAt = $data['updated_at'] ?? date('c');
        $e->deletedAt = $data['deleted_at'] ?? null;
        $e->deletedType = $data['deleted_type'] ?? null;
        $e->needsReview = !empty($data['needs_review']);
        $e->reviewedAt = $data['reviewed_at'] ?? null;
        $e->recurrenceId = array_key_exists('recurrence_id', $data) && $data['recurrence_id'] !== null ? (int)$data['recurrence_id'] : null;
        return $e;
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
            'date' => $this->date,
            'attachment_path' => $this->attachmentPath,
            'created_at' => $this->createdAt,
            'updated_at' => $this->updatedAt,
            'deleted_at' => $this->deletedAt,
            'deleted_type' => $this->deletedType,
            'needs_review' => $this->needsReview ? 1 : 0,
            'reviewed_at' => $this->reviewedAt,
            'recurrence_id' => $this->recurrenceId,
        ];
    }
}
