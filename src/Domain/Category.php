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

    public static function fromArray(array $data): self
    {
        $c = new self();
        $c->id = (int)$data['id'];
        $c->name = $data['name'];
        $c->type = $data['type'];
        $c->alterdataAuto = $data['alterdata_auto'] ?? '';
        $c->createdAt = $data['created_at'] ?? date('c');
        $c->updatedAt = $data['updated_at'] ?? date('c');
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
        ];
    }
}
