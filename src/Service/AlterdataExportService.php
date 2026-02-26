<?php
declare(strict_types=1);

namespace App\Service;

use App\Repository\CategoryRepositoryInterface;
use App\Repository\EntryRepositoryInterface;
use App\Repository\UserCategoryRepositoryInterface;
use App\Repository\UserRepositoryInterface;
use App\Util\Response;

class AlterdataExportService
{
    private EntryRepositoryInterface $entries;
    private UserRepositoryInterface $users;
    private CategoryRepositoryInterface $categories;
    private UserCategoryRepositoryInterface $userCategories;

    public function __construct(
        EntryRepositoryInterface $entries,
        UserRepositoryInterface $users,
        CategoryRepositoryInterface $categories,
        UserCategoryRepositoryInterface $userCategories
    )
    {
        $this->entries = $entries;
        $this->users = $users;
        $this->categories = $categories;
        $this->userCategories = $userCategories;
    }

    public function exportText(array $filters = []): string
    {
        return $this->exportResult($filters)['text'];
    }

    public function exportResult(array $filters = []): array
    {
        $query = ['include_deleted' => true];
        $month = $filters['month'] ?? '';
        $type = $filters['type'] ?? 'all';
        $columnMap = $this->normalizeColumnMap((array)($filters['column_map'] ?? []));
        $userIds = array_values(array_unique(array_map('intval', (array)($filters['user_ids'] ?? []))));
        $userIds = array_values(array_filter($userIds, fn(int $id): bool => $id > 0));
        if ($month) {
            $query['month'] = $month;
        }
        if ($type !== 'all') {
            $query['type'] = $type;
        }
        if (count($userIds) === 1) {
            $query['user_id'] = $userIds[0];
        }

        $entries = array_values(array_filter($this->entries->listAll($query), fn($e) => !$e->deletedAt && !$e->needsReview));
        if (count($userIds) > 1) {
            $allowed = array_flip($userIds);
            $entries = array_values(array_filter($entries, fn($entry) => isset($allowed[(int)$entry->userId])));
        }
        if (!$entries) {
            Response::json(['error' => 'Nenhuma movimentacao encontrada'], 404);
        }
        usort($entries, fn($a, $b) => strcmp($a->date, $b->date));

        $users = [];
        foreach ($this->users->listAll() as $user) {
            $users[$user->id] = $user;
        }

        $catsById = [];
        $catsByKey = [];
        foreach ($this->categories->listAll() as $cat) {
            $id = (int)($cat->id ?? 0);
            if ($id > 0) {
                $catsById[$id] = $cat;
            }
            $catsByKey[$this->normalizeCategoryKey((string)$cat->name)] = $cat;
        }

        $userCatMap = [];
        foreach ($this->userCategories->listAll() as $userCategory) {
            $uid = (int)$userCategory->userId;
            $key = $this->normalizeCategoryKey((string)$userCategory->name);
            if (!isset($userCatMap[$uid])) {
                $userCatMap[$uid] = [];
            }
            $userCatMap[$uid][$key] = $userCategory;
        }

        $missingUsers = [];
        $missingCats = [];
        $lines = [];
        $exportedUserIds = [];
        foreach ($entries as $entry) {
            $user = $users[$entry->userId] ?? null;
            if (!$user) {
                continue;
            }
            $catKey = $this->normalizeCategoryKey((string)$entry->category);
            $userCat = $userCatMap[$entry->userId][$catKey] ?? null;
            $cat = null;
            if ($userCat) {
                $cat = $catsById[(int)$userCat->globalCategoryId] ?? null;
            }
            if (!$cat) {
                $cat = $catsByKey[$catKey] ?? null;
            }

            $lineValues = [];
            $shouldSkip = false;
            foreach ($columnMap as $column) {
                $resolved = $this->resolveColumnValue($column, $entry, $user, $cat, $month);
                if (!empty($resolved['missing']) && $resolved['missing'] === 'user_alterdata') {
                    $missingUsers[$user->id] = $user->name ?: ('ID ' . $user->id);
                    $shouldSkip = true;
                }
                if (!empty($resolved['missing']) && $resolved['missing'] === 'category_alterdata') {
                    $missingCats[$entry->category] = $entry->category;
                    $shouldSkip = true;
                }
                $lineValues[] = (string)($resolved['value'] ?? '');
            }
            if ($shouldSkip) {
                continue;
            }

            $lines[] = implode(';', $lineValues);
            $exportedUserIds[(int)$entry->userId] = true;
        }

        if ($missingUsers || $missingCats) {
            $parts = [];
            if ($missingUsers) {
                $parts[] = 'Usuarios sem codigo alterdata: ' . implode(', ', $missingUsers);
            }
            if ($missingCats) {
                $parts[] = 'Categorias sem lancamento auto: ' . implode(', ', $missingCats);
            }
            Response::json(['error' => implode(' | ', $parts)], 422);
        }

        if (!$lines) {
            Response::json(['error' => 'Nenhuma movimentacao valida para exportar'], 404);
        }

        return [
            'text' => implode("\n", $lines),
            'records_exported' => count($lines),
            'users_affected' => count($exportedUserIds),
        ];
    }

    private function sanitize(string $value): string
    {
        $value = str_replace(["\r", "\n", ";"], ' ', $value);
        return trim($value);
    }

    private function formatAmount(float $amount): string
    {
        return number_format($amount, 2, '.', '');
    }

    private function normalizeColumnMap(array $raw): array
    {
        $defaults = AlterdataExportConfigService::defaultColumns();
        $merged = [];
        foreach ($defaults as $column => $base) {
            $merged[$column] = $base;
        }
        foreach ($raw as $row) {
            $column = strtoupper(trim((string)($row['column'] ?? '')));
            if (!isset($merged[$column])) {
                continue;
            }
            $merged[$column] = [
                'column' => $column,
                'source_scope' => (string)($row['source_scope'] ?? $merged[$column]['source_scope']),
                'source_field' => (string)($row['source_field'] ?? $merged[$column]['source_field']),
                'fixed_value' => (string)($row['fixed_value'] ?? $merged[$column]['fixed_value']),
            ];
        }
        ksort($merged);
        return array_values($merged);
    }

    private function resolveColumnValue(array $column, object $entry, object $user, ?object $cat, string $month): array
    {
        $scope = (string)($column['source_scope'] ?? '');
        $field = (string)($column['source_field'] ?? '');
        $fixed = (string)($column['fixed_value'] ?? '');

        if ($scope === 'fixed') {
            return ['value' => $this->sanitize($fixed), 'missing' => null];
        }

        if ($scope === 'entry') {
            $value = match ($field) {
                'id' => (string)((int)($entry->id ?? 0)),
                'date' => (string)($entry->date ?? ''),
                'amount' => $this->formatAmount((float)($entry->amount ?? 0)),
                'type' => (string)($entry->type ?? ''),
                'type_code' => ((string)($entry->type ?? '') === 'in') ? 'E' : 'S',
                'category' => $this->sanitize((string)($entry->category ?? '')),
                'description' => $this->sanitize((string)($entry->description ?? '')),
                'account_name' => $this->sanitize((string)($entry->accountName ?? '')),
                'account_id' => (string)((int)($entry->accountId ?? 0)),
                default => '',
            };
            return ['value' => $value, 'missing' => null];
        }

        if ($scope === 'category') {
            if (!$cat) {
                return ['value' => '', 'missing' => ($field === 'alterdata_auto' ? 'category_alterdata' : null)];
            }
            $value = match ($field) {
                'id' => (string)((int)($cat->id ?? 0)),
                'name' => $this->sanitize((string)($cat->name ?? '')),
                'type' => (string)($cat->type ?? ''),
                'alterdata_auto' => $this->sanitize((string)($cat->alterdataAuto ?? '')),
                default => '',
            };
            $missing = ($field === 'alterdata_auto' && trim($value) === '') ? 'category_alterdata' : null;
            return ['value' => $value, 'missing' => $missing];
        }

        if ($scope === 'user') {
            $value = match ($field) {
                'id' => (string)((int)($user->id ?? 0)),
                'name' => $this->sanitize((string)($user->name ?? '')),
                'email' => $this->sanitize((string)($user->email ?? '')),
                'alterdata_code' => $this->sanitize((string)($user->alterdataCode ?? '')),
                default => '',
            };
            $missing = ($field === 'alterdata_code' && trim($value) === '') ? 'user_alterdata' : null;
            return ['value' => $value, 'missing' => $missing];
        }

        // fallback de compatibilidade
        if ($scope === 'system') {
            $value = $field === 'month' ? $month : '';
            return ['value' => $this->sanitize((string)$value), 'missing' => null];
        }

        return ['value' => '', 'missing' => null];
    }

    private function normalizeCategoryKey(string $value): string
    {
        $normalized = trim($value);
        $normalized = function_exists('mb_strtolower')
            ? mb_strtolower($normalized, 'UTF-8')
            : strtolower($normalized);
        $converted = @iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $normalized);
        if (is_string($converted) && $converted !== '') {
            $normalized = strtolower($converted);
        }
        $normalized = preg_replace('/[^a-z0-9]+/', '', $normalized) ?? '';
        return $normalized;
    }

    private function closestCategoryKey(string $needle, array $candidates): ?string
    {
        $needle = trim($needle);
        if ($needle === '' || !$candidates) {
            return null;
        }
        $bestKey = null;
        $bestDistance = PHP_INT_MAX;
        foreach ($candidates as $candidate) {
            $candidate = trim((string)$candidate);
            if ($candidate === '') {
                continue;
            }
            $distance = levenshtein($needle, $candidate);
            if ($distance < $bestDistance) {
                $bestDistance = $distance;
                $bestKey = $candidate;
            }
        }
        // Tolerância baixa para corrigir pequenas variações de encoding/acentuação.
        return ($bestKey !== null && $bestDistance <= 2) ? $bestKey : null;
    }
}
