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
        $query = ['include_deleted' => true];
        $month = $filters['month'] ?? '';
        $type = $filters['type'] ?? 'all';
        $userId = $filters['user_id'] ?? null;
        if ($month) {
            $query['month'] = $month;
        }
        if ($type !== 'all') {
            $query['type'] = $type;
        }
        if ($userId) {
            $query['user_id'] = (int)$userId;
        }

        $entries = array_values(array_filter($this->entries->listAll($query), fn($e) => !$e->deletedAt && !$e->needsReview));
        if (!$entries) {
            Response::json(['error' => 'Nenhuma movimentacao encontrada'], 404);
        }
        usort($entries, fn($a, $b) => strcmp($a->date, $b->date));

        $users = [];
        foreach ($this->users->listAll() as $user) {
            $users[$user->id] = $user;
        }

        $cats = [];
        foreach ($this->categories->listAll() as $cat) {
            $cats[strtolower($cat->name)] = $cat;
        }

        $userCatMap = [];
        foreach ($this->userCategories->listAll() as $userCategory) {
            $uid = (int)$userCategory->userId;
            $key = strtolower((string)$userCategory->name);
            if (!isset($userCatMap[$uid])) {
                $userCatMap[$uid] = [];
            }
            $userCatMap[$uid][$key] = $userCategory;
        }

        $missingUsers = [];
        $missingCats = [];
        $lines = [];
        foreach ($entries as $entry) {
            $user = $users[$entry->userId] ?? null;
            if (!$user || $user->role === 'admin') {
                continue;
            }
            if ($user->alterdataCode === '') {
                $missingUsers[$user->id] = $user->name ?: ('ID ' . $user->id);
                continue;
            }
            $catKey = strtolower($entry->category);
            $userCat = $userCatMap[$entry->userId][$catKey] ?? null;
            $cat = null;
            if ($userCat) {
                $cat = $this->categories->find((int)$userCat->globalCategoryId);
            }
            if (!$cat) {
                $cat = $cats[$catKey] ?? null;
            }
            if (!$cat || $cat->alterdataAuto === '') {
                $missingCats[$entry->category] = $entry->category;
                continue;
            }
            $lines[] = implode(';', [
                $this->sanitize($user->alterdataCode),
                $entry->date,
                $entry->type === 'in' ? 'E' : 'S',
                $this->sanitize($entry->category),
                $this->sanitize($cat->alterdataAuto),
                $this->formatAmount($entry->amount),
                $this->sanitize($entry->description),
            ]);
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

        return implode("\n", $lines);
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
}
