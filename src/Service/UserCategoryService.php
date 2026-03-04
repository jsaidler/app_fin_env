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
        }, $this->globalCategories->listForUser($userId));

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

    public function listTreeForUser(int $userId): array
    {
        $globals = array_map(fn($item) => $item->toArray(), $this->globalCategories->listForUser($userId));
        $users = array_map(fn($item) => $item->toArray(), $this->userCategories->listByUser($userId));

        $globalById = [];
        foreach ($globals as $global) {
            $id = (int)($global['id'] ?? 0);
            if ($id <= 0) {
                continue;
            }
            $global['scope'] = 'global';
            $global['children'] = [];
            $globalById[$id] = $global;
        }

        foreach ($users as $userNode) {
            $gid = (int)($userNode['global_category_id'] ?? 0);
            if ($gid <= 0 || !isset($globalById[$gid])) {
                continue;
            }
            $userNode['scope'] = 'user';
            $userNode['children'] = [];
            $globalById[$gid]['children'][] = $userNode;
        }

        // Link all global parent-child relations first.
        foreach (array_keys($globalById) as $id) {
            $parentId = isset($globalById[$id]['parent_category_id']) ? (int)$globalById[$id]['parent_category_id'] : 0;
            if ($parentId > 0 && isset($globalById[$parentId])) {
                $globalById[$parentId]['children'][] = &$globalById[$id];
            }
        }

        // Collect roots after linking to keep full hierarchy regardless of iteration order.
        $roots = [];
        foreach (array_keys($globalById) as $id) {
            $parentId = isset($globalById[$id]['parent_category_id']) ? (int)$globalById[$id]['parent_category_id'] : 0;
            if ($parentId > 0 && isset($globalById[$parentId])) {
                continue;
            }
            $roots[] = &$globalById[$id];
        }

        $sortFn = function (&$items) use (&$sortFn): void {
            usort($items, fn($a, $b) => strcasecmp((string)($a['name'] ?? ''), (string)($b['name'] ?? '')));
            foreach ($items as &$item) {
                if (!empty($item['children']) && is_array($item['children'])) {
                    $sortFn($item['children']);
                }
            }
        };
        $sortFn($roots);
        return $roots;
    }

    public function createForUser(int $userId, array $input, ?int $modifiedByUserId = null): array
    {
        $name = trim((string)($input['name'] ?? ''));
        $icon = $this->normalizeIcon($input['icon'] ?? '');
        $globalCategoryId = (int)($input['global_category_id'] ?? 0);
        $accountClass = strtolower(trim((string)($input['account_class'] ?? 'analytic')));
        if (!Validator::nonEmpty($name) || $globalCategoryId <= 0) {
            Response::json(['error' => 'Dados de conta invalidos'], 422);
        }
        if ($accountClass !== 'analytic') {
            Response::json(['error' => 'Usuario so pode criar conta analitica'], 422);
        }

        $global = $this->globalCategories->find($globalCategoryId);
        if (!$global) {
            Response::json(['error' => 'Conta global nao encontrada'], 404);
        }
        $this->assertGlobalParentEligible($globalCategoryId, $global);
        $this->assertNameAvailable($userId, $name);

        $created = $this->userCategories->create($userId, $name, $icon, $globalCategoryId, [
            'account_class' => 'analytic',
        ]);
        if ($modifiedByUserId && $modifiedByUserId > 0) {
            $created = $this->userCategories->updateForUser((int)$created->id, $userId, [
                'last_modified_by_user_id' => (int)$modifiedByUserId,
            ]) ?? $created;
        }
        return $created->toArray();
    }

    public function updateForUser(int $id, int $userId, array $input, ?int $modifiedByUserId = null): array
    {
        $existing = $this->userCategories->findForUser($id, $userId);
        if (!$existing) {
            Response::json(['error' => 'Conta do usuario nao encontrada'], 404);
        }

        $name = array_key_exists('name', $input) ? trim((string)$input['name']) : $existing->name;
        $icon = array_key_exists('icon', $input) ? $this->normalizeIcon($input['icon']) : $existing->icon;
        $globalCategoryId = array_key_exists('global_category_id', $input)
            ? (int)$input['global_category_id']
            : $existing->globalCategoryId;
        $accountClass = array_key_exists('account_class', $input)
            ? strtolower(trim((string)$input['account_class']))
            : (string)($existing->accountClass ?: 'analytic');

        if (!Validator::nonEmpty($name) || $globalCategoryId <= 0) {
            Response::json(['error' => 'Dados de conta invalidos'], 422);
        }
        if ($accountClass !== 'analytic') {
            Response::json(['error' => 'Usuario so pode manter conta analitica'], 422);
        }

        $global = $this->globalCategories->find($globalCategoryId);
        if (!$global) {
            Response::json(['error' => 'Conta global nao encontrada'], 404);
        }
        $this->assertGlobalParentEligible($globalCategoryId, $global);

        $this->assertNameAvailable($userId, $name, $id);
        $updated = $this->userCategories->updateForUser($id, $userId, [
            'name' => $name,
            'icon' => $icon,
            'global_category_id' => $globalCategoryId,
            'account_class' => 'analytic',
            'last_modified_by_user_id' => ($modifiedByUserId && $modifiedByUserId > 0) ? (int)$modifiedByUserId : null,
        ]);
        if (!$updated) {
            Response::json(['error' => 'Conta do usuario nao encontrada'], 404);
        }
        return $updated->toArray();
    }

    public function deleteForUser(int $id, int $userId): array
    {
        $existing = $this->userCategories->findForUser($id, $userId);
        if (!$existing) {
            Response::json(['error' => 'Conta do usuario nao encontrada'], 404);
        }

        $global = $this->globalCategories->find((int)$existing->globalCategoryId);
        if (!$global) {
            Response::json(['error' => 'Conta global vinculada nao encontrada'], 404);
        }

        $this->entries->reassignCategoryForUser($userId, (string)$existing->name, (string)$global->name);

        $ok = $this->userCategories->deleteForUser($id, $userId);
        if (!$ok) {
            Response::json(['error' => 'Conta do usuario nao encontrada'], 404);
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
            Response::json(['error' => 'Icone invalido'], 422);
        }
        return strtolower($icon);
    }

    private function assertNameAvailable(int $userId, string $name, ?int $ignoreUserCategoryId = null): void
    {
        foreach ($this->globalCategories->listForUser($userId) as $global) {
            if (strcasecmp((string)$global->name, $name) === 0) {
                Response::json(['error' => 'Nome ja existe em contas globais'], 409);
            }
        }

        $existing = $this->userCategories->findByUserAndName($userId, $name);
        if ($existing && ($ignoreUserCategoryId === null || $existing->id !== $ignoreUserCategoryId)) {
            Response::json(['error' => 'Nome ja existe em suas contas'], 409);
        }
    }

    private function assertGlobalParentEligible(int $globalCategoryId, $global): void
    {
        $accountClass = strtolower((string)($global->accountClass ?? 'synthetic'));
        if ($accountClass !== 'synthetic') {
            Response::json(['error' => 'Conta pai deve ser sintetica'], 422);
        }
        foreach ($this->globalCategories->listAll() as $child) {
            if ((int)$child->parentCategoryId !== $globalCategoryId) {
                continue;
            }
            if (strtolower((string)$child->accountClass) === 'synthetic') {
                Response::json(['error' => 'Conta pai com filhas sinteticas nao pode receber conta analitica'], 422);
            }
        }
    }
}
