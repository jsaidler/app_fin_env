<?php
declare(strict_types=1);

namespace App\Service;

use App\Repository\CategoryRepositoryInterface;
use App\Util\Response;
use App\Util\Validator;

class CategoryService
{
    private CategoryRepositoryInterface $categories;

    public function __construct(CategoryRepositoryInterface $categories)
    {
        $this->categories = $categories;
    }

    public function list(): array
    {
        return array_map(fn($c) => $c->toArray(), $this->categories->listAll());
    }

    public function listTree(?int $userId = null): array
    {
        $rows = $userId && $userId > 0
            ? $this->categories->listForUser($userId)
            : $this->categories->listAll();
        $nodes = array_map(fn($item) => $item->toArray(), $rows);
        return $this->buildTree($nodes);
    }

    public function create(array $input, ?int $modifiedByUserId = null): array
    {
        $name = trim($input['name'] ?? '');
        $type = $input['type'] ?? '';
        $accountClass = $this->normalizeAccountClass($input['account_class'] ?? 'synthetic');
        $parentCategoryId = $this->normalizePositiveOrNull($input['parent_category_id'] ?? null);
        $ownerUserId = $this->normalizePositiveOrNull($input['owner_user_id'] ?? null);
        $alterdataAutoRaw = isset($input['alterdata_auto']) ? trim((string)$input['alterdata_auto']) : '';
        if (!Validator::nonEmpty($name) || !in_array($type, ['in', 'out'], true)) {
            Response::json(['error' => 'Dados de conta invalidos'], 422);
        }
        $this->assertParentConstraints($accountClass, $type, $parentCategoryId, $ownerUserId, null);
        $alterdataAuto = $this->composeAlterdataCode($alterdataAutoRaw, $parentCategoryId);
        $cat = $this->categories->create($name, $type, $alterdataAuto, [
            'account_class' => $accountClass,
            'parent_category_id' => $parentCategoryId,
            'allows_analytic_children' => $accountClass === 'analytic' ? 0 : 1,
            'owner_user_id' => $ownerUserId,
        ]);
        if ($modifiedByUserId && $modifiedByUserId > 0) {
            $cat = $this->categories->update((int)$cat->id, [
                'last_modified_by_user_id' => (int)$modifiedByUserId,
            ]) ?? $cat;
        }
        return $cat->toArray();
    }

    public function update(int $id, array $input, ?int $modifiedByUserId = null): array
    {
        $existing = $this->categories->find($id);
        if (!$existing) {
            Response::json(['error' => 'Conta nao encontrada'], 404);
        }
        $data = [];
        if (isset($input['name'])) {
            if (!Validator::nonEmpty($input['name'])) {
                Response::json(['error' => 'Nome invalido'], 422);
            }
            $data['name'] = trim($input['name']);
        }
        if (isset($input['type'])) {
            if (!in_array($input['type'], ['in', 'out'], true)) {
                Response::json(['error' => 'Tipo invalido'], 422);
            }
            $data['type'] = $input['type'];
        }
        if (array_key_exists('account_class', $input)) {
            $data['account_class'] = $this->normalizeAccountClass($input['account_class']);
        }
        if (array_key_exists('parent_category_id', $input)) {
            $data['parent_category_id'] = $this->normalizePositiveOrNull($input['parent_category_id']);
        }
        if (array_key_exists('owner_user_id', $input)) {
            $data['owner_user_id'] = $this->normalizePositiveOrNull($input['owner_user_id']);
        }
        $alterdataInputValue = array_key_exists('alterdata_auto', $input)
            ? trim((string)$input['alterdata_auto'])
            : trim((string)$existing->alterdataAuto);
        $nextAccountClass = (string)($data['account_class'] ?? $existing->accountClass);
        $nextType = (string)($data['type'] ?? $existing->type);
        $nextParentCategoryId = array_key_exists('parent_category_id', $data)
            ? $this->normalizePositiveOrNull($data['parent_category_id'])
            : $existing->parentCategoryId;
        $data['allows_analytic_children'] = $nextAccountClass === 'analytic' ? 0 : 1;
        $nextOwnerUserId = array_key_exists('owner_user_id', $data)
            ? $this->normalizePositiveOrNull($data['owner_user_id'])
            : $existing->ownerUserId;
        $this->assertParentConstraints($nextAccountClass, $nextType, $nextParentCategoryId, $nextOwnerUserId, $id);
        $this->assertAccountClassTransitionConstraints($id, $existing->accountClass, $nextAccountClass);
        $data['alterdata_auto'] = $this->composeAlterdataCode($alterdataInputValue, $nextParentCategoryId);
        if ($modifiedByUserId && $modifiedByUserId > 0) {
            $data['last_modified_by_user_id'] = (int)$modifiedByUserId;
        }
        $cat = $this->categories->update($id, $data);
        if (!$cat) {
            Response::json(['error' => 'Conta nao encontrada'], 404);
        }
        return $cat->toArray();
    }

    public function delete(int $id): array
    {
        $ok = $this->categories->delete($id);
        if (!$ok) {
            Response::json(['error' => 'Conta nao encontrada'], 404);
        }
        return ['deleted' => true];
    }

    private function normalizeAccountClass($value): string
    {
        $class = strtolower(trim((string)$value));
        if (!in_array($class, ['synthetic', 'analytic'], true)) {
            Response::json(['error' => 'Classe de conta invalida'], 422);
        }
        return $class;
    }

    private function normalizePositiveOrNull($value): ?int
    {
        if ($value === null || $value === '' || $value === false) {
            return null;
        }
        $id = (int)$value;
        return $id > 0 ? $id : null;
    }

    private function assertParentConstraints(string $accountClass, string $type, ?int $parentCategoryId, ?int $ownerUserId, ?int $selfId): void
    {
        if ($accountClass === 'analytic' && !$parentCategoryId) {
            Response::json(['error' => 'Conta analitica exige conta sintetica pai'], 422);
        }
        if (!$parentCategoryId) {
            return;
        }
        if ($selfId && $parentCategoryId === $selfId) {
            Response::json(['error' => 'Conta nao pode apontar para si mesma'], 422);
        }
        if ($selfId) {
            $cursorId = $parentCategoryId;
            $visited = [];
            while ($cursorId && $cursorId > 0 && !isset($visited[$cursorId])) {
                $visited[$cursorId] = true;
                if ($cursorId === $selfId) {
                    Response::json(['error' => 'Conta pai invalida: ciclo na arvore'], 422);
                }
                $cursor = $this->categories->find($cursorId);
                if (!$cursor) {
                    break;
                }
                $cursorId = $cursor->parentCategoryId ? (int)$cursor->parentCategoryId : null;
            }
        }
        $parent = $this->categories->find($parentCategoryId);
        if (!$parent) {
            Response::json(['error' => 'Conta pai nao encontrada'], 404);
        }
        if (strtolower((string)$parent->accountClass) !== 'synthetic') {
            Response::json(['error' => 'Conta pai deve ser sintetica'], 422);
        }
        if ($accountClass === 'analytic' && $this->hasSyntheticChildren((int)$parent->id, $selfId)) {
            Response::json(['error' => 'Conta pai com filhas sinteticas nao pode receber filha analitica'], 422);
        }
        if ((string)$parent->type !== (string)$type) {
            Response::json(['error' => 'Conta pai deve ter o mesmo tipo'], 422);
        }
        $parentOwner = $parent->ownerUserId ? (int)$parent->ownerUserId : null;
        if ($ownerUserId && $parentOwner && $ownerUserId !== $parentOwner) {
            Response::json(['error' => 'Conta pai pertence a outro usuario'], 422);
        }
    }

    private function assertAccountClassTransitionConstraints(int $id, string $fromClass, string $toClass): void
    {
        if ($fromClass === $toClass) {
            return;
        }
        if ($fromClass === 'synthetic' && $toClass === 'analytic') {
            foreach ($this->categories->listAll() as $item) {
                if ((int)$item->parentCategoryId === $id) {
                    Response::json(['error' => 'Conta sintetica com filhas nao pode virar analitica'], 422);
                }
            }
        }
    }

    private function hasSyntheticChildren(int $parentId, ?int $ignoreCategoryId = null): bool
    {
        foreach ($this->categories->listAll() as $item) {
            if ((int)$item->parentCategoryId !== $parentId) {
                continue;
            }
            if ($ignoreCategoryId && (int)$item->id === $ignoreCategoryId) {
                continue;
            }
            if (strtolower((string)$item->accountClass) === 'synthetic') {
                return true;
            }
        }
        return false;
    }

    private function composeAlterdataCode(string $rawCode, ?int $parentCategoryId): string
    {
        $code = trim($rawCode);
        if (!Validator::nonEmpty($code)) {
            Response::json(['error' => 'Codigo Alterdata obrigatorio para conta global'], 422);
        }
        if (!$parentCategoryId) {
            return $code;
        }
        $parent = $this->categories->find($parentCategoryId);
        if (!$parent) {
            Response::json(['error' => 'Conta pai nao encontrada'], 404);
        }
        $parentCode = trim((string)$parent->alterdataAuto);
        if (!Validator::nonEmpty($parentCode)) {
            Response::json(['error' => 'Conta pai sem codigo Alterdata'], 422);
        }
        if (str_starts_with($code, $parentCode . '.')) {
            return $code;
        }
        $segments = array_values(array_filter(array_map('trim', explode('.', $code)), fn($seg) => $seg !== ''));
        $suffix = $segments ? (string)end($segments) : $code;
        return $parentCode . '.' . $suffix;
    }

    private function buildTree(array $rows): array
    {
        $byId = [];
        foreach ($rows as $row) {
            $id = (int)($row['id'] ?? 0);
            if ($id <= 0) {
                continue;
            }
            $row['children'] = [];
            $byId[$id] = $row;
        }

        $roots = [];
        foreach ($byId as $id => $node) {
            $parentId = isset($node['parent_category_id']) ? (int)$node['parent_category_id'] : 0;
            if ($parentId > 0 && isset($byId[$parentId])) {
                $byId[$parentId]['children'][] = &$byId[$id];
                continue;
            }
            $roots[] = &$byId[$id];
        }
        unset($node);

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
}
