<?php
declare(strict_types=1);

namespace App\Domain;

class Category
{
    public int $id;
    public string $name;
    public string $type; // in|out
    public string $alterdataAuto = '';
    public string $createdAt;
    public string $updatedAt;
    public ?int $lastModifiedByUserId = null;
    public ?string $lastModifiedAt = null;

    public static function fromArray(array $data): self
    {
        $c = new self();
        $c->id = (int)$data['id'];
        $c->name = $data['name'];
        $c->type = $data['type'];
        $c->alterdataAuto = $data['alterdata_auto'] ?? '';
        $c->createdAt = $data['created_at'] ?? date('c');
        $c->updatedAt = $data['updated_at'] ?? date('c');
        $c->lastModifiedByUserId = array_key_exists('last_modified_by_user_id', $data) && $data['last_modified_by_user_id'] !== null
            ? (int)$data['last_modified_by_user_id']
            : null;
        $c->lastModifiedAt = $data['last_modified_at'] ?? null;
        return $c;
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'type' => $this->type,
            'alterdata_auto' => $this->alterdataAuto,
            'created_at' => $this->createdAt,
            'updated_at' => $this->updatedAt,
            'last_modified_by_user_id' => $this->lastModifiedByUserId,
            'last_modified_at' => $this->lastModifiedAt,
        ];
    }
}
