<?php
declare(strict_types=1);

namespace App\Service;

use App\Repository\CategoryRepositoryInterface;
use App\Repository\EntryRepositoryInterface;
use App\Repository\UserCategoryRepositoryInterface;
use App\Util\Response;
use App\Util\Validator;

class UserCategoryService
{
    private CategoryRepositoryInterface $globalCategories;
    private UserCategoryRepositoryInterface $userCategories;
    private EntryRepositoryInterface $entries;

    public function __construct(
        CategoryRepositoryInterface $globalCategories,
        UserCategoryRepositoryInterface $userCategories,
        EntryRepositoryInterface $entries
    ) {
        $this->globalCategories = $globalCategories;
        $this->userCategories = $userCategories;
        $this->entries = $entries;
    }

    public function listMergedForUser(int $userId): array
    {
        $globals = array_map(function ($item) {
            $data = $item->toArray();
            $data['scope'] = 'global';
            $data['icon'] = $data['icon'] ?? '';
            $data['global_category_id'] = (int)$data['id'];
            return $data;
        }, $this->globalCategories->listAll());

        $users = array_map(function ($item) {
            $data = $item->toArray();
            $data['scope'] = 'user';
            return $data;
        }, $this->userCategories->listByUser($userId));

        $byName = [];
        foreach ($globals as $global) {
            $byName[strtolower((string)$global['name'])] = $global;
        }
        foreach ($users as $userCategory) {
            $byName[strtolower((string)$userCategory['name'])] = $userCategory;
        }

        $merged = array_values($byName);
        usort($merged, fn($a, $b) => strcasecmp((string)($a['name'] ?? ''), (string)($b['name'] ?? '')));
        return $merged;
    }

    public function listUserCategories(int $userId): array
    {
        return array_map(fn($item) => $item->toArray(), $this->userCategories->listByUser($userId));
    }

    public function createForUser(int $userId, array $input): array
    {
        $name = trim((string)($input['name'] ?? ''));
        $icon = $this->normalizeIcon($input['icon'] ?? '');
        $globalCategoryId = (int)($input['global_category_id'] ?? 0);
        if (!Validator::nonEmpty($name) || $globalCategoryId <= 0) {
            Response::json(['error' => 'Dados de categoria inválidos'], 422);
        }

        $global = $this->globalCategories->find($globalCategoryId);
        if (!$global) {
            Response::json(['error' => 'Categoria global não encontrada'], 404);
        }
        $this->assertNameAvailable($userId, $name);

        $created = $this->userCategories->create($userId, $name, $icon, $globalCategoryId);
        return $created->toArray();
    }

    public function updateForUser(int $id, int $userId, array $input): array
    {
        $existing = $this->userCategories->findForUser($id, $userId);
        if (!$existing) {
            Response::json(['error' => 'Categoria do usuário não encontrada'], 404);
        }

        $name = array_key_exists('name', $input) ? trim((string)$input['name']) : $existing->name;
        $icon = array_key_exists('icon', $input) ? $this->normalizeIcon($input['icon']) : $existing->icon;
        $globalCategoryId = array_key_exists('global_category_id', $input)
            ? (int)$input['global_category_id']
            : $existing->globalCategoryId;

        if (!Validator::nonEmpty($name) || $globalCategoryId <= 0) {
            Response::json(['error' => 'Dados de categoria inválidos'], 422);
        }

        $global = $this->globalCategories->find($globalCategoryId);
        if (!$global) {
            Response::json(['error' => 'Categoria global não encontrada'], 404);
        }

        $this->assertNameAvailable($userId, $name, $id);
        $updated = $this->userCategories->updateForUser($id, $userId, [
            'name' => $name,
            'icon' => $icon,
            'global_category_id' => $globalCategoryId,
        ]);
        if (!$updated) {
            Response::json(['error' => 'Categoria do usuário não encontrada'], 404);
        }
        return $updated->toArray();
    }

    public function deleteForUser(int $id, int $userId): array
    {
        $existing = $this->userCategories->findForUser($id, $userId);
        if (!$existing) {
            Response::json(['error' => 'Categoria do usuário não encontrada'], 404);
        }

        $global = $this->globalCategories->find((int)$existing->globalCategoryId);
        if (!$global) {
            Response::json(['error' => 'Categoria global vinculada não encontrada'], 404);
        }

        $this->entries->reassignCategoryForUser($userId, (string)$existing->name, (string)$global->name);

        $ok = $this->userCategories->deleteForUser($id, $userId);
        if (!$ok) {
            Response::json(['error' => 'Categoria do usuário não encontrada'], 404);
        }
        return ['deleted' => true];
    }

    private function normalizeIcon($value): string
    {
        $icon = trim((string)$value);
        if ($icon === '') {
            return 'label';
        }
        if (!preg_match('/^[a-z0-9_]{2,64}$/i', $icon)) {
            Response::json(['error' => 'Ícone inválido'], 422);
        }
        return strtolower($icon);
    }

    private function assertNameAvailable(int $userId, string $name, ?int $ignoreUserCategoryId = null): void
    {
        foreach ($this->globalCategories->listAll() as $global) {
            if (strcasecmp((string)$global->name, $name) === 0) {
                Response::json(['error' => 'Nome já existe em categorias globais'], 409);
            }
        }

        $existing = $this->userCategories->findByUserAndName($userId, $name);
        if ($existing && ($ignoreUserCategoryId === null || $existing->id !== $ignoreUserCategoryId)) {
            Response::json(['error' => 'Nome já existe em suas categorias'], 409);
        }
    }
}
