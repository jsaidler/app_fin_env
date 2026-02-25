<?php
declare(strict_types=1);

namespace App\Domain;

class UserCategory
{
    public int $id;
    public int $userId;
    public string $name;
    public string $icon = '';
    public int $globalCategoryId;
    public string $globalName = '';
    public string $type = '';
    public string $globalAlterdataAuto = '';
    public string $createdAt;
    public string $updatedAt;
    public ?int $lastModifiedByUserId = null;
    public ?string $lastModifiedAt = null;

    public static function fromArray(array $data): self
    {
        $item = new self();
        $item->id = (int)($data['id'] ?? 0);
        $item->userId = (int)($data['user_id'] ?? 0);
        $item->name = (string)($data['name'] ?? '');
        $item->icon = (string)($data['icon'] ?? '');
        $item->globalCategoryId = (int)($data['global_category_id'] ?? 0);
        $item->globalName = (string)($data['global_name'] ?? '');
        $item->type = (string)($data['global_type'] ?? ($data['type'] ?? ''));
        $item->globalAlterdataAuto = (string)($data['global_alterdata_auto'] ?? '');
        $item->createdAt = (string)($data['created_at'] ?? date('c'));
        $item->updatedAt = (string)($data['updated_at'] ?? date('c'));
        $item->lastModifiedByUserId = array_key_exists('last_modified_by_user_id', $data) && $data['last_modified_by_user_id'] !== null
            ? (int)$data['last_modified_by_user_id']
            : null;
        $item->lastModifiedAt = (string)($data['last_modified_at'] ?? '') ?: null;
        return $item;
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->userId,
            'name' => $this->name,
            'icon' => $this->icon,
            'global_category_id' => $this->globalCategoryId,
            'global_name' => $this->globalName,
            'type' => $this->type,
            'global_alterdata_auto' => $this->globalAlterdataAuto,
            'created_at' => $this->createdAt,
            'updated_at' => $this->updatedAt,
            'last_modified_by_user_id' => $this->lastModifiedByUserId,
            'last_modified_at' => $this->lastModifiedAt,
        ];
    }
}
