<?php
declare(strict_types=1);

namespace App\Domain;

class Category
{
    public int $id;
    public string $name;
    public string $type; // in|out
    public string $accountClass = 'synthetic'; // synthetic|analytic
    public ?int $parentCategoryId = null;
    public bool $allowsAnalyticChildren = true;
    public ?int $ownerUserId = null; // null = global default; >0 = user-scoped global account
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
        $c->accountClass = (string)($data['account_class'] ?? 'synthetic');
        $c->parentCategoryId = array_key_exists('parent_category_id', $data) && $data['parent_category_id'] !== null
            ? (int)$data['parent_category_id']
            : null;
        $c->allowsAnalyticChildren = (int)($data['allows_analytic_children'] ?? 1) === 1;
        $c->ownerUserId = array_key_exists('owner_user_id', $data) && $data['owner_user_id'] !== null
            ? (int)$data['owner_user_id']
            : null;
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
            'account_class' => $this->accountClass,
            'parent_category_id' => $this->parentCategoryId,
            'allows_analytic_children' => $this->allowsAnalyticChildren ? 1 : 0,
            'owner_user_id' => $this->ownerUserId,
            'alterdata_auto' => $this->alterdataAuto,
            'created_at' => $this->createdAt,
            'updated_at' => $this->updatedAt,
            'last_modified_by_user_id' => $this->lastModifiedByUserId,
            'last_modified_at' => $this->lastModifiedAt,
        ];
    }
}
