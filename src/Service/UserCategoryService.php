<?php
declare(strict_types=1);

namespace App\Service;

use App\Repository\CategoryRepositoryInterface;
use App\Repository\EntryRepositoryInterface;
use App\Repository\RecurrenceRepositoryInterface;
use App\Repository\UserAccountRepositoryInterface;
use App\Repository\UserCategoryRepositoryInterface;
use App\Util\Response;
use App\Util\Validator;

class UserCategoryService
{
    private CategoryRepositoryInterface $globalCategories;
    private UserCategoryRepositoryInterface $userCategories;
    private EntryRepositoryInterface $entries;
    private ?RecurrenceRepositoryInterface $recurrences;
    private ?UserAccountRepositoryInterface $accounts;

    public function __construct(
        CategoryRepositoryInterface $globalCategories,
        UserCategoryRepositoryInterface $userCategories,
        EntryRepositoryInterface $entries,
        ?RecurrenceRepositoryInterface $recurrences = null,
        ?UserAccountRepositoryInterface $accounts = null
    ) {
        $this->globalCategories = $globalCategories;
        $this->userCategories = $userCategories;
        $this->entries = $entries;
        $this->recurrences = $recurrences;
        $this->accounts = $accounts;
    }

    public function listMergedForUser(int $userId): array
    {
        $globals = array_map(function ($item) {
            $data = $item->toArray();
            $data['scope'] = 'global';
            $data['icon'] = $data['icon'] ?? '';
            $data['color'] = '';
            $data['global_category_id'] = (int)$data['id'];
            return $data;
        }, $this->visibleGlobalCategoriesForUser($userId));

        $users = array_map(function ($item) {
            $data = $item->toArray();
            $data['scope'] = 'user';
            return $data;
        }, $this->userCategories->listByUser($userId));

        $merged = array_merge($globals, $users);
        usort($merged, fn($a, $b) => strcasecmp((string)($a['name'] ?? ''), (string)($b['name'] ?? '')));
        return $merged;
    }

    public function listUserCategories(int $userId): array
    {
        return array_map(fn($item) => $item->toArray(), $this->userCategories->listByUser($userId));
    }

    public function listTreeForUser(int $userId): array
    {
        $globals = array_map(fn($item) => $item->toArray(), $this->visibleGlobalCategoriesForUser($userId));
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
        $color = $this->normalizeColor($input['color'] ?? '');
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
        $this->assertColorAvailable($userId, $color);

        $created = $this->userCategories->create($userId, $name, $icon, $color, $globalCategoryId, [
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
        $color = array_key_exists('color', $input) ? $this->normalizeColor($input['color']) : $this->normalizeColor($existing->color);
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
        if (strcasecmp($color, (string)$existing->color) !== 0) {
            $this->assertColorAvailable($userId, $color, $id);
        }
        $updated = $this->userCategories->updateForUser($id, $userId, [
            'name' => $name,
            'icon' => $icon,
            'color' => $color,
            'global_category_id' => $globalCategoryId,
            'account_class' => 'analytic',
            'last_modified_by_user_id' => ($modifiedByUserId && $modifiedByUserId > 0) ? (int)$modifiedByUserId : null,
        ]);
        if (!$updated) {
            Response::json(['error' => 'Conta do usuario nao encontrada'], 404);
        }
        if (strcasecmp((string)$existing->name, $name) !== 0) {
            $this->entries->reassignCategoryForUser($userId, (string)$existing->name, $name);
            $this->recurrences?->reassignCategoryForUser($userId, (string)$existing->name, $name);
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
        $this->recurrences?->reassignCategoryForUser($userId, (string)$existing->name, (string)$global->name);

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

    private function normalizeColor($value): string
    {
        $color = strtoupper(trim((string)$value));
        if ($color === '') {
            Response::json(['error' => 'Cor obrigatoria'], 422);
        }
        if (!preg_match('/^#[0-9A-F]{6}$/', $color)) {
            Response::json(['error' => 'Cor invalida'], 422);
        }
        return $color;
    }

    private function assertColorAvailable(int $userId, string $color, ?int $ignoreUserCategoryId = null): void
    {
        foreach ($this->userCategories->listByUser($userId) as $item) {
            if ($ignoreUserCategoryId !== null && (int)$item->id === $ignoreUserCategoryId) {
                continue;
            }
            if (strcasecmp((string)$item->color, $color) === 0) {
                Response::json(['error' => 'Cor ja utilizada em outra conta'], 409);
            }
        }
        if (!$this->accounts) {
            return;
        }
        foreach ($this->accounts->listByUser($userId, true) as $item) {
            if (strcasecmp((string)$item->color, $color) === 0) {
                Response::json(['error' => 'Cor ja utilizada em outra tag'], 409);
            }
        }
    }

    private function assertNameAvailable(int $userId, string $name, ?int $ignoreUserCategoryId = null): void
    {
        foreach ($this->visibleGlobalCategoriesForUser($userId) as $global) {
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

    private function visibleGlobalCategoriesForUser(int $userId): array
    {
        return array_values(array_filter($this->globalCategories->listForUser($userId), function ($item) use ($userId): bool {
            $ownerId = (int)($item->ownerUserId ?? 0);
            $accountClass = strtolower((string)($item->accountClass ?? 'synthetic'));
            return !($ownerId === $userId && $accountClass === 'analytic');
        }));
    }
}
