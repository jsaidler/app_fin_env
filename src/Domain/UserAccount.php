<?php
declare(strict_types=1);

namespace App\Domain;

class UserAccount
{
    public int $id;
    public int $userId;
    public string $name;
    public string $type;
    public string $icon = '';
    public float $initialBalance = 0.0;
    public bool $active = true;
    public string $createdAt;
    public string $updatedAt;

    public static function fromArray(array $data): self
    {
        $item = new self();
        $item->id = (int)($data['id'] ?? 0);
        $item->userId = (int)($data['user_id'] ?? 0);
        $item->name = (string)($data['name'] ?? '');
        $item->type = (string)($data['type'] ?? '');
        $item->icon = (string)($data['icon'] ?? '');
        $item->initialBalance = (float)($data['initial_balance'] ?? 0);
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
            'name' => $this->name,
            'type' => $this->type,
            'icon' => $this->icon,
            'initial_balance' => $this->initialBalance,
            'active' => $this->active ? 1 : 0,
            'created_at' => $this->createdAt,
            'updated_at' => $this->updatedAt,
        ];
    }
}
