<?php
declare(strict_types=1);

namespace App\Service;

use App\Repository\EntryRepositoryInterface;
use App\Repository\UserAccountRepositoryInterface;

class ReportService
{
    private EntryRepositoryInterface $entries;
    private ?UserAccountRepositoryInterface $accounts;
    /** @var array<string, array<int, object>> */
    private array $entriesByUserCache = [];

    public function __construct(EntryRepositoryInterface $entries, ?UserAccountRepositoryInterface $accounts = null)
    {
        $this->entries = $entries;
        $this->accounts = $accounts;
    }

    public function summary(int $userId): array
    {
        $entries = $this->entriesForUser($userId, false);
        return $this->summaryFromEntries($entries);
    }

    public function dashboardSnapshot(int $userId, string $month, array $entriesGroupsFilters = []): array
    {
        $entries = $this->entriesForUser($userId, false);
        return $this->dashboardSnapshotFromEntries($entries, $userId, $month, $entriesGroupsFilters);
    }

    /** @param array<int, object> $entries */
    public function dashboardSnapshotFromEntries(array $entries, int $userId, string $month, array $entriesGroupsFilters = []): array
    {
        $monthKey = $this->normalizeMonthKey($month);
        $monthBounds = $this->monthBounds($monthKey);
        $previousMonth = (new \DateTimeImmutable($monthKey . '-01'))->modify('-1 month')->format('Y-m');
        $prevBounds = $this->monthBounds($previousMonth);
        [$monthEntries, $previousMonthEntries] = $this->splitEntriesByMonths($entries, $monthKey, $previousMonth);

        $entriesGroups = $this->entriesGroupsReportFromEntries($entries, $entriesGroupsFilters);

        return [
            'month' => $monthKey,
            'summary' => $this->summaryFromEntries($entries),
            'month_aggregate' => $this->aggregateFromEntries($monthEntries, [
                'start' => $monthBounds['start'],
                'end' => $monthBounds['end'],
                'type' => null,
                'category' => null,
            ], $userId, false),
            'previous_month_aggregate' => $this->aggregateFromEntries($previousMonthEntries, [
                'start' => $prevBounds['start'],
                'end' => $prevBounds['end'],
                'type' => null,
                'category' => null,
            ], $userId, false),
            'entry_groups' => $entriesGroups,
        ];
    }

    /**
     * @param array<int, object> $entries
     * @return array{0: array<int, object>, 1: array<int, object>}
     */
    private function splitEntriesByMonths(array $entries, string $month, string $previousMonth): array
    {
        $current = [];
        $previous = [];
        foreach ($entries as $entry) {
            $entryMonth = substr((string)($entry->date ?? ''), 0, 7);
            if ($entryMonth === $month) {
                $current[] = $entry;
                continue;
            }
            if ($entryMonth === $previousMonth) {
                $previous[] = $entry;
            }
        }
        return [$current, $previous];
    }

    /** @param array<int, object> $entries */
    private function summaryFromEntries(array $entries): array
    {
        $totalIn = 0;
        $totalOut = 0;
        $pendingIn = 0;
        $pendingOut = 0;
        $pendingCount = 0;
        $perMonth = [];
        foreach ($entries as $entry) {
            if ($entry->deletedAt) {
                continue;
            }
            if ($entry->needsReview) {
                $pendingCount += 1;
                if ($entry->type === 'in') {
                    $pendingIn += $entry->amount;
                } else {
                    $pendingOut += $entry->amount;
                }
                continue;
            }
            $amount = $entry->amount;
            $month = substr($entry->date, 0, 7);
            if (!isset($perMonth[$month])) {
                $perMonth[$month] = ['in' => 0, 'out' => 0];
            }
            if ($entry->type === 'in') {
                $totalIn += $amount;
                $perMonth[$month]['in'] += $amount;
            } else {
                $totalOut += $amount;
                $perMonth[$month]['out'] += $amount;
            }
        }
        ksort($perMonth);
        return [
            'total_in' => $totalIn,
            'total_out' => $totalOut,
            'balance' => $totalIn - $totalOut,
            'pending_in' => $pendingIn,
            'pending_out' => $pendingOut,
            'pending_balance' => $pendingIn - $pendingOut,
            'pending_count' => $pendingCount,
            'per_month' => $perMonth,
            'daily_series' => $this->dailySeries($this->approvedEntries($entries)),
            'last_12_months' => $this->last12Months($entries),
        ];
    }

    public function monthClosure(int $userId, string $month): array
    {
        $entries = $this->entriesForUser($userId, false);
        $totalIn = 0;
        $totalOut = 0;
        $count = 0;
        $pendingIn = 0;
        $pendingOut = 0;
        $pendingCount = 0;
        foreach ($entries as $entry) {
            if ($entry->deletedAt) {
                continue;
            }
            if (substr($entry->date, 0, 7) !== $month) {
                continue;
            }
            if ($entry->needsReview) {
                $pendingCount += 1;
                if ($entry->type === 'in') {
                    $pendingIn += $entry->amount;
                } else {
                    $pendingOut += $entry->amount;
                }
                continue;
            }
            if ($entry->type === 'in') {
                $totalIn += $entry->amount;
            } else {
                $totalOut += $entry->amount;
            }
            $count += 1;
        }
        return [
            'month' => $month,
            'total_in' => $totalIn,
            'total_out' => $totalOut,
            'balance' => $totalIn - $totalOut,
            'count' => $count,
            'pending_in' => $pendingIn,
            'pending_out' => $pendingOut,
            'pending_balance' => $pendingIn - $pendingOut,
            'pending_count' => $pendingCount,
        ];
    }

    public function aggregateReport(int $userId, array $filters): array
    {
        $entries = $this->entriesForUser($userId, false);
        return $this->aggregateFromEntries($entries, $filters, $userId, true);
    }

    /** @param array<int, object> $entries */
    private function aggregateFromEntries(array $entries, array $filters, int $userId, bool $includeLast12Months): array
    {
        $filtered = $this->filterEntries($entries, $filters);
        $result = $this->aggregateMetricsFromFilteredEntries($filtered, $userId);
        if ($includeLast12Months) {
            $result['last_12_months'] = $this->last12Months($entries);
        }
        return $result;
    }

    /**
     * Aggregates all visible metrics in a single pass over filtered entries.
     *
     * @param array<int, object> $filtered
     * @return array<string, mixed>
     */
    private function aggregateMetricsFromFilteredEntries(array $filtered, int $userId): array
    {
        $totalsIn = 0.0;
        $totalsOut = 0.0;
        $totalsCount = 0;
        $pendingIn = 0.0;
        $pendingOut = 0.0;
        $pendingCount = 0;
        $daily = [];
        $categories = [];
        $accountsMap = [];
        $canonicalNoAccount = 'Sem conta/cartao';

        if ($userId > 0 && $this->accounts) {
            foreach ($this->accounts->listByUser($userId, false) as $account) {
                $accountId = (int)($account->id ?? 0);
                if ($accountId <= 0) {
                    continue;
                }
                $name = trim((string)($account->name ?? ''));
                if ($name === '') {
                    continue;
                }
                $key = 'id:' . $accountId;
                $accountsMap[$key] = [
                    'id' => $accountId,
                    'name' => $name,
                    'type' => (string)($account->type ?? 'bank'),
                    'in' => 0.0,
                    'out' => 0.0,
                    'initial_balance' => (float)($account->initialBalance ?? 0.0),
                ];
            }
        }

        foreach ($filtered as $entry) {
            if (!empty($entry->needsReview)) {
                $pendingCount += 1;
                if ($entry->type === 'in') {
                    $pendingIn += (float)$entry->amount;
                } else {
                    $pendingOut += (float)$entry->amount;
                }
            }

            if (!empty($entry->deletedAt)) {
                continue;
            }

            $amount = $this->effectiveAmount($entry);
            if ($entry->type === 'in') {
                $totalsIn += $amount;
            } else {
                $totalsOut += $amount;
            }
            $totalsCount += 1;

            $day = (string)$entry->date;
            if (!isset($daily[$day])) {
                $daily[$day] = ['label' => $day, 'in' => 0.0, 'out' => 0.0, 'total' => 0.0];
            }
            if ($entry->type === 'in') {
                $daily[$day]['in'] += $amount;
            } else {
                $daily[$day]['out'] += $amount;
            }
            $daily[$day]['total'] = $daily[$day]['in'] - $daily[$day]['out'];

            $categoryId = (int)($entry->categoryId ?? 0);
            $categoryName = trim((string)($entry->category ?? ''));
            $categoryName = $categoryName !== '' ? $categoryName : 'Sem categoria';
            $categoryKey = $categoryId > 0
                ? ('id:' . $categoryId)
                : ('name:' . $this->lower($categoryName));
            if (!isset($categories[$categoryKey])) {
                $categories[$categoryKey] = [
                    'id' => $categoryId,
                    'name' => $categoryName,
                    'in' => 0.0,
                    'out' => 0.0,
                ];
            }
            if ($entry->type === 'in') {
                $categories[$categoryKey]['in'] += $amount;
            } else {
                $categories[$categoryKey]['out'] += $amount;
            }

            $accountId = (int)($entry->accountId ?? 0);
            $accountName = trim((string)($entry->accountName ?? ''));
            if ($accountId <= 0) {
                $accountName = $canonicalNoAccount;
                $accountId = 0;
            } elseif ($accountName === '') {
                $accountName = 'Conta #' . $accountId;
            }
            $accountKey = $accountId > 0
                ? ('id:' . $accountId)
                : ('name:' . strtolower($accountName));
            if (!isset($accountsMap[$accountKey])) {
                $accountsMap[$accountKey] = [
                    'id' => $accountId,
                    'name' => $accountName,
                    'type' => (string)($entry->accountType ?? 'bank'),
                    'in' => 0.0,
                    'out' => 0.0,
                    'initial_balance' => 0.0,
                ];
            }
            if ($entry->type === 'in') {
                $accountsMap[$accountKey]['in'] += $amount;
            } else {
                $accountsMap[$accountKey]['out'] += $amount;
            }
        }

        ksort($daily);
        $byDay = array_values($daily);

        $byCategory = array_values($categories);
        $categoryTotalFlow = 0.0;
        foreach ($byCategory as $item) {
            $categoryTotalFlow += (float)$item['in'] + (float)$item['out'];
        }
        usort($byCategory, fn($a, $b) => (($b['in'] + $b['out']) <=> ($a['in'] + $a['out'])));
        foreach ($byCategory as &$item) {
            $share = $categoryTotalFlow ? ((((float)$item['in'] + (float)$item['out']) / $categoryTotalFlow) * 100) : 0;
            $item['share'] = (int)round($share);
            $item['balance'] = (float)$item['in'] - (float)$item['out'];
        }
        unset($item);

        $byAccount = array_values($accountsMap);
        $accountTotalFlow = 0.0;
        foreach ($byAccount as $item) {
            $accountTotalFlow += (float)$item['in'] + (float)$item['out'];
        }
        usort($byAccount, fn($a, $b) => (($b['in'] + $b['out']) <=> ($a['in'] + $a['out'])));
        foreach ($byAccount as &$item) {
            $share = $accountTotalFlow ? ((((float)$item['in'] + (float)$item['out']) / $accountTotalFlow) * 100) : 0;
            $item['share'] = (int)round($share);
            $item['balance'] = (float)$item['in'] - (float)$item['out'];
        }
        unset($item);

        return [
            'totals' => [
                'in' => $totalsIn,
                'out' => $totalsOut,
                'balance' => $totalsIn - $totalsOut,
                'count' => $totalsCount,
            ],
            'pending' => [
                'in' => $pendingIn,
                'out' => $pendingOut,
                'balance' => $pendingIn - $pendingOut,
                'count' => $pendingCount,
            ],
            'by_day' => $byDay,
            'by_category' => $byCategory,
            'by_account' => $byAccount,
        ];
    }

    public function aggregateEntriesView(int $userId, array $filters): array
    {
        $entries = $this->entriesForUser($userId, false);
        $filtered = $this->filterEntries($entries, $filters);
        $visible = array_values(array_filter($filtered, fn($e) => empty($e->deletedAt)));
        return [
            'totals' => $this->totals($visible),
            'pending' => $this->pendingTotals($filtered),
            'insights' => $this->insights($visible),
        ];
    }

    public function entriesGroupsReport(int $userId, array $filters): array
    {
        $typeFilter = trim((string)($filters['type'] ?? ''));
        $deletedOnly = $typeFilter === 'deleted' || !empty($filters['deleted_only']);
        $entries = $this->entriesForUser($userId, $deletedOnly);
        return $this->entriesGroupsReportFromEntries($entries, $filters);
    }

    /** @param array<int, object> $entries */
    private function entriesGroupsReportFromEntries(array $entries, array $filters): array
    {
        $typeFilter = trim((string)($filters['type'] ?? ''));
        $pendingOnly = $typeFilter === 'pending';
        $deletedOnly = $typeFilter === 'deleted' || !empty($filters['deleted_only']);
        if ($deletedOnly) {
            $entries = array_values(array_filter($entries, fn($e) => !empty($e->deletedAt)));
        }
        $filtered = $this->filterEntries($entries, $filters);
        $groupEntriesFiltered = $filtered;

        // Base totals independent from common filters.
        // In "deleted" mode, the base scope is deleted entries.
        $groupEntriesAll = $deletedOnly
            ? $groupEntriesFiltered
            : ($pendingOnly
                ? array_values(array_filter($entries, fn($e) => empty($e->deletedAt) && !empty($e->needsReview)))
                : array_values(array_filter($entries, fn($e) => empty($e->deletedAt))));

        $groupedFiltered = $this->groupedByYearMonth($groupEntriesFiltered);
        $groupedAllTotalsIndex = $this->groupedTotalsIndex($groupEntriesAll);
        $grouped = $this->mergeGroupTotals($groupedFiltered, $groupedAllTotalsIndex);

        return [
            'totals' => $this->totals($groupEntriesAll),
            'count' => count($groupEntriesFiltered),
            'groups' => $grouped,
        ];
    }

    /**
     * Keeps filtered entries structure, but replaces year/month/day totals with period base totals.
     *
     * @param array<int, array<string, mixed>> $filtered
     * @param array<string, mixed> $baseIndex
     * @return array<int, array<string, mixed>>
     */
    private function mergeGroupTotals(array $filtered, array $baseIndex): array
    {
        $baseYears = is_array($baseIndex['years'] ?? null) ? $baseIndex['years'] : [];

        return array_map(function ($yearNode) use ($baseYears) {
            $yearKey = (string)($yearNode['year'] ?? '');
            $baseYear = $baseYears[$yearKey] ?? null;
            if (is_array($baseYear) && isset($baseYear['totals'])) {
                $yearNode['totals'] = $baseYear['totals'];
            }

            $baseMonths = is_array($baseYear['months'] ?? null) ? $baseYear['months'] : [];

            $yearNode['months'] = array_map(function ($monthNode) use ($baseMonths) {
                $monthKey = (string)($monthNode['month'] ?? '');
                $baseMonth = $baseMonths[$monthKey] ?? null;
                if (is_array($baseMonth) && isset($baseMonth['totals'])) {
                    $monthNode['totals'] = $baseMonth['totals'];
                }

                $baseDays = is_array($baseMonth['days'] ?? null) ? $baseMonth['days'] : [];

                $monthNode['days'] = array_map(function ($dayNode) use ($baseDays) {
                    $dayKey = (string)($dayNode['date'] ?? '');
                    $baseDay = $baseDays[$dayKey] ?? null;
                    if (is_array($baseDay) && isset($baseDay['totals'])) {
                        $dayNode['totals'] = $baseDay['totals'];
                    }
                    return $dayNode;
                }, is_array($monthNode['days'] ?? null) ? $monthNode['days'] : []);

                return $monthNode;
            }, is_array($yearNode['months'] ?? null) ? $yearNode['months'] : []);

            return $yearNode;
        }, $filtered);
    }

    /**
     * Builds a compact totals index by year/month/day in one pass, without carrying entry arrays.
     *
     * @param array<int, object> $entries
     * @return array<string, mixed>
     */
    private function groupedTotalsIndex(array $entries): array
    {
        $years = [];
        foreach ($entries as $entry) {
            $date = (string)($entry->date ?? '');
            if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
                continue;
            }
            $yearKey = substr($date, 0, 4);
            $monthKey = substr($date, 0, 7);
            $dayKey = $date;

            if (!isset($years[$yearKey])) {
                $years[$yearKey] = [
                    'totals' => ['in' => 0.0, 'out' => 0.0, 'balance' => 0.0, 'count' => 0],
                    'months' => [],
                ];
            }
            $this->accumulateEntryTotals($years[$yearKey]['totals'], $entry);

            if (!isset($years[$yearKey]['months'][$monthKey])) {
                $years[$yearKey]['months'][$monthKey] = [
                    'totals' => ['in' => 0.0, 'out' => 0.0, 'balance' => 0.0, 'count' => 0],
                    'days' => [],
                ];
            }
            $this->accumulateEntryTotals($years[$yearKey]['months'][$monthKey]['totals'], $entry);

            if (!isset($years[$yearKey]['months'][$monthKey]['days'][$dayKey])) {
                $years[$yearKey]['months'][$monthKey]['days'][$dayKey] = [
                    'totals' => ['in' => 0.0, 'out' => 0.0, 'balance' => 0.0, 'count' => 0],
                ];
            }
            $this->accumulateEntryTotals($years[$yearKey]['months'][$monthKey]['days'][$dayKey]['totals'], $entry);
        }

        return ['years' => $years];
    }

    public function filterEntriesForUser(int $userId, array $filters): array
    {
        $entries = $this->entriesForUser($userId, false);
        return $this->filterEntries($entries, $filters);
    }

    /** @return array<int, object> */
    private function entriesForUser(int $userId, bool $includeDeleted): array
    {
        $key = $userId . ':' . ($includeDeleted ? '1' : '0');
        if (!array_key_exists($key, $this->entriesByUserCache)) {
            $this->entriesByUserCache[$key] = $this->entries->listByUser($userId, $includeDeleted);
        }
        return $this->entriesByUserCache[$key];
    }

    /** @param array<int, object> $entries */
    private function approvedEntries(array $entries): array
    {
        return array_values(array_filter($entries, fn($e) => empty($e->needsReview)));
    }

    /** @param array<int, object> $entries */
    private function filterEntries(array $entries, array $filters): array
    {
        $type = $filters['type'] ?? null;
        $pendingOnly = $type === 'pending';
        $entryType = trim((string)($filters['entry_type'] ?? ''));
        if ($entryType !== 'in' && $entryType !== 'out') {
            $entryType = '';
        }
        if ($type === 'all' || $type === '' || $type === 'deleted' || $type === 'pending') {
            $type = null;
        }
        if ($entryType !== '') {
            $type = $entryType;
        }
        $includeDeleted = (bool)($filters['include_deleted'] ?? false);
        $deletedOnly = (bool)($filters['deleted_only'] ?? false) || (($filters['type'] ?? null) === 'deleted');

        if ($deletedOnly) {
            return array_values(array_filter($entries, function ($e) use ($type) {
                if (empty($e->deletedAt)) {
                    return false;
                }
                if ($type && $e->type !== $type) {
                    return false;
                }
                return true;
            }));
        }
        $categories = [];
        if (!empty($filters['categories']) && is_array($filters['categories'])) {
            $categories = array_values(array_filter(array_map(function ($value) {
                $text = trim((string)$value);
                return $text !== '' ? $this->lower($text) : '';
            }, $filters['categories']), fn($value) => $value !== ''));
        } else {
            $category = trim((string)($filters['category'] ?? ''));
            if ($category !== '') {
                $categories = [$this->lower($category)];
            }
        }
        $query = trim((string)($filters['q'] ?? ''));
        $query = $query !== '' ? $this->lower($query) : null;
        $accountIdFilter = null;
        if (array_key_exists('account_id', $filters) && $filters['account_id'] !== null && $filters['account_id'] !== '') {
            $accountIdFilter = (int)$filters['account_id'];
        }
        $categoryIdFilter = null;
        if (array_key_exists('category_id', $filters) && $filters['category_id'] !== null && $filters['category_id'] !== '') {
            $categoryIdFilter = (int)$filters['category_id'];
        }
        $noAccountFilter = false;
        if (!empty($filters['no_account'])) {
            $rawNoAccount = strtolower(trim((string)$filters['no_account']));
            $noAccountFilter = in_array($rawNoAccount, ['1', 'true', 'yes', 'on'], true);
        }
        if ($accountIdFilter !== null && $accountIdFilter <= 0) {
            $noAccountFilter = true;
        }
        [$start, $end] = $this->normalizeRange($filters);

        return array_values(array_filter($entries, function ($e) use ($type, $pendingOnly, $categories, $query, $accountIdFilter, $categoryIdFilter, $noAccountFilter, $start, $end, $includeDeleted, $deletedOnly) {
            if (!$includeDeleted && !$deletedOnly && !empty($e->deletedAt)) {
                return false;
            }
            if ($deletedOnly && empty($e->deletedAt)) {
                return false;
            }
            if ($pendingOnly && empty($e->needsReview)) {
                return false;
            }
            if ($type && $e->type !== $type) {
                return false;
            }
            $entryCategory = trim((string)($e->category ?? ''));
            if ($categories && !in_array($this->lower($entryCategory), $categories, true)) {
                return false;
            }
            $entryCategoryId = (int)($e->categoryId ?? 0);
            if ($categoryIdFilter !== null && $categoryIdFilter > 0 && $entryCategoryId !== $categoryIdFilter) {
                return false;
            }
            $entryAccountId = (int)($e->accountId ?? 0);
            if ($noAccountFilter) {
                if ($entryAccountId > 0) {
                    return false;
                }
            }
            if ($accountIdFilter !== null && $accountIdFilter > 0 && $entryAccountId !== $accountIdFilter) {
                return false;
            }
            if ($query !== null) {
                $description = trim((string)($e->description ?? ''));
                $entryAccountName = trim((string)($e->accountName ?? ''));
                $searchIndex = $this->lower($description . ' ' . $entryCategory . ' ' . $entryAccountName . ' ' . (string)$e->date);
                if (strpos($searchIndex, $query) === false) {
                    return false;
                }
            }
            return $this->isInRange((string)$e->date, $start, $end);
        }));
    }

    /** @param array<int, object> $entries */
    private function groupedByYearMonth(array $entries): array
    {
        if (!$this->isEntriesSortedDesc($entries)) {
            usort($entries, function ($a, $b) {
                $byDate = strcmp((string)$b->date, (string)$a->date);
                if ($byDate !== 0) {
                    return $byDate;
                }
                return strcmp((string)($b->updatedAt ?? $b->createdAt ?? ''), (string)($a->updatedAt ?? $a->createdAt ?? ''));
            });
        }

        $years = [];

        foreach ($entries as $entry) {
            $date = \DateTimeImmutable::createFromFormat('Y-m-d', (string)$entry->date);
            if (!$date) {
                continue;
            }

            $yearKey = $date->format('Y');
            $monthKey = $date->format('Y-m');

            if (!isset($years[$yearKey])) {
                $years[$yearKey] = [
                    'year' => $yearKey,
                    'label' => $yearKey,
                    'totals' => ['in' => 0.0, 'out' => 0.0, 'balance' => 0.0, 'count' => 0],
                    'months' => [],
                ];
            }
            $this->accumulateEntryTotals($years[$yearKey]['totals'], $entry);

            if (!isset($years[$yearKey]['months'][$monthKey])) {
                $years[$yearKey]['months'][$monthKey] = [
                    'month' => $monthKey,
                    'label' => $this->monthLabelPt($date),
                    'totals' => ['in' => 0.0, 'out' => 0.0, 'balance' => 0.0, 'count' => 0],
                    'days' => [],
                ];
            }
            $this->accumulateEntryTotals($years[$yearKey]['months'][$monthKey]['totals'], $entry);

            $dayKey = $date->format('Y-m-d');
            if (!isset($years[$yearKey]['months'][$monthKey]['days'][$dayKey])) {
                $years[$yearKey]['months'][$monthKey]['days'][$dayKey] = [
                    'date' => $dayKey,
                    'label' => $this->dayLabelPt($date),
                    'totals' => ['in' => 0.0, 'out' => 0.0, 'balance' => 0.0, 'count' => 0],
                    'entries' => [],
                ];
            }

            $this->accumulateEntryTotals($years[$yearKey]['months'][$monthKey]['days'][$dayKey]['totals'], $entry);
            $years[$yearKey]['months'][$monthKey]['days'][$dayKey]['entries'][] = $entry->toArray();
        }

        krsort($years);
        $result = array_values(array_map(function ($yearNode) {
            krsort($yearNode['months']);
            $yearNode['months'] = array_values(array_map(function ($monthNode) {
                krsort($monthNode['days']);
                $monthNode['days'] = array_values(array_map(function ($dayNode) {
                    usort($dayNode['entries'], function ($a, $b) {
                        $byDate = strcmp((string)($b['date'] ?? ''), (string)($a['date'] ?? ''));
                        if ($byDate !== 0) {
                            return $byDate;
                        }
                        return strcmp((string)($b['updated_at'] ?? $b['created_at'] ?? ''), (string)($a['updated_at'] ?? $a['created_at'] ?? ''));
                    });
                    return $dayNode;
                }, $monthNode['days']));
                return $monthNode;
            }, $yearNode['months']));
            return $yearNode;
        }, $years));

        return $result;
    }

    /** @param array<int, object> $entries */
    private function isEntriesSortedDesc(array $entries): bool
    {
        $prevDate = null;
        $prevTs = null;
        foreach ($entries as $entry) {
            $date = (string)($entry->date ?? '');
            $ts = (string)($entry->updatedAt ?? $entry->createdAt ?? '');
            if ($prevDate !== null) {
                if ($prevDate < $date) {
                    return false;
                }
                if ($prevDate === $date && $prevTs < $ts) {
                    return false;
                }
            }
            $prevDate = $date;
            $prevTs = $ts;
        }
        return true;
    }

    private function accumulateEntryTotals(array &$totals, object $entry): void
    {
        $amount = (float)abs($this->effectiveAmount($entry));
        if ($entry->type === 'in') {
            $totals['in'] += $amount;
            $totals['balance'] += $amount;
        } else {
            $totals['out'] += $amount;
            $totals['balance'] -= $amount;
        }
        $totals['count'] += 1;
    }

    private function monthLabelPt(\DateTimeImmutable $date): string
    {
        $months = [
            '01' => 'janeiro',
            '02' => 'fevereiro',
            '03' => 'marco',
            '04' => 'abril',
            '05' => 'maio',
            '06' => 'junho',
            '07' => 'julho',
            '08' => 'agosto',
            '09' => 'setembro',
            '10' => 'outubro',
            '11' => 'novembro',
            '12' => 'dezembro',
        ];
        $m = $date->format('m');
        $name = $months[$m] ?? $m;
        $name = function_exists('mb_convert_case')
            ? mb_convert_case($name, MB_CASE_TITLE, 'UTF-8')
            : ucfirst($name);
        return $name . ' ' . $date->format('Y');
    }

    private function dayLabelPt(\DateTimeImmutable $date): string
    {
        $weekdays = [
            '1' => 'seg',
            '2' => 'ter',
            '3' => 'qua',
            '4' => 'qui',
            '5' => 'sex',
            '6' => 'sab',
            '7' => 'dom',
        ];
        $months = [
            '01' => 'janeiro',
            '02' => 'fevereiro',
            '03' => 'marco',
            '04' => 'abril',
            '05' => 'maio',
            '06' => 'junho',
            '07' => 'julho',
            '08' => 'agosto',
            '09' => 'setembro',
            '10' => 'outubro',
            '11' => 'novembro',
            '12' => 'dezembro',
        ];

        $weekday = $weekdays[$date->format('N')] ?? '';
        $day = $date->format('d');
        $month = $months[$date->format('m')] ?? $date->format('m');
        return sprintf('%s, %s de %s', $weekday, $day, $month);
    }

    private function normalizeRange(array $filters): array
    {
        $start = $this->normalizeDate($filters['start'] ?? null, true);
        $end = $this->normalizeDate($filters['end'] ?? null, false);
        if ($start && $end && $start > $end) {
            $tmp = $start;
            $start = $end;
            $end = $tmp;
        }
        return [$start, $end];
    }

    private function normalizeDate(?string $value, bool $isStart): ?string
    {
        $value = trim((string)$value);
        if ($value === '') {
            return null;
        }
        if (preg_match('/^\d{4}-\d{2}$/', $value)) {
            $date = \DateTimeImmutable::createFromFormat('Y-m-d', $value . '-01');
            if (!$date) {
                return null;
            }
            if ($isStart) {
                return $date->format('Y-m-d');
            }
            return $date->modify('last day of this month')->format('Y-m-d');
        }
        if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $value)) {
            return $value;
        }
        return null;
    }

    private function isInRange(string $date, ?string $start, ?string $end): bool
    {
        if ($start && $date < $start) {
            return false;
        }
        if ($end && $date > $end) {
            return false;
        }
        return true;
    }

    /** @param array<int, object> $entries */
    private function totals(array $entries): array
    {
        $totalIn = 0;
        $totalOut = 0;
        foreach ($entries as $entry) {
            $amount = $this->effectiveAmount($entry);
            if ($entry->type === 'in') {
                $totalIn += $amount;
            } else {
                $totalOut += $amount;
            }
        }
        return [
            'in' => $totalIn,
            'out' => $totalOut,
            'balance' => $totalIn - $totalOut,
            'count' => count($entries),
        ];
    }

    /** @param array<int, object> $entries */
    private function pendingTotals(array $entries): array
    {
        $pendingIn = 0;
        $pendingOut = 0;
        $pendingCount = 0;
        foreach ($entries as $entry) {
            if (empty($entry->needsReview)) {
                continue;
            }
            $pendingCount += 1;
            if ($entry->type === 'in') {
                $pendingIn += $entry->amount;
            } else {
                $pendingOut += $entry->amount;
            }
        }
        return [
            'in' => $pendingIn,
            'out' => $pendingOut,
            'balance' => $pendingIn - $pendingOut,
            'count' => $pendingCount,
        ];
    }

    /** @param array<int, object> $entries */
    private function insights(array $entries): array
    {
        $maxIn = 0;
        $maxOut = 0;
        $totalAbs = 0;
        foreach ($entries as $entry) {
            $amount = (float)$entry->amount;
            $totalAbs += abs($amount);
            if ($entry->type === 'in') {
                $maxIn = max($maxIn, $amount);
            } else {
                $maxOut = max($maxOut, $amount);
            }
        }
        $count = count($entries);
        $avg = $count ? $totalAbs / $count : 0;
        return [
            'max_in' => $maxIn,
            'max_out' => $maxOut,
            'avg' => $avg,
            'count' => $count,
        ];
    }

    /** @param array<int, object> $entries */
    private function dailySeries(array $entries): array
    {
        $byDay = [];
        foreach ($entries as $entry) {
            $day = (string)$entry->date;
            if (!isset($byDay[$day])) {
                $byDay[$day] = ['label' => $day, 'in' => 0, 'out' => 0, 'total' => 0];
            }
            $amount = $this->effectiveAmount($entry);
            if ($entry->type === 'in') {
                $byDay[$day]['in'] += $amount;
            } else {
                $byDay[$day]['out'] += $amount;
            }
            $byDay[$day]['total'] = $byDay[$day]['in'] - $byDay[$day]['out'];
        }
        ksort($byDay);
        return array_values($byDay);
    }

    /** @param array<int, object> $entries */
    private function categorySummary(array $entries): array
    {
        $map = [];
        foreach ($entries as $entry) {
            $name = trim((string)($entry->category ?? ''));
            $name = $name !== '' ? $name : 'Sem categoria';
            if (!isset($map[$name])) {
                $map[$name] = ['name' => $name, 'in' => 0, 'out' => 0];
            }
            $amount = $this->effectiveAmount($entry);
            if ($entry->type === 'in') {
                $map[$name]['in'] += $amount;
            } else {
                $map[$name]['out'] += $amount;
            }
        }
        $items = array_values($map);
        $totalAll = 0;
        foreach ($items as $item) {
            $totalAll += $item['in'] + $item['out'];
        }
        usort($items, fn($a, $b) => ($b['in'] + $b['out']) <=> ($a['in'] + $a['out']));
        foreach ($items as &$item) {
            $share = $totalAll ? (($item['in'] + $item['out']) / $totalAll) * 100 : 0;
            $item['share'] = (int)round($share);
            $item['balance'] = $item['in'] - $item['out'];
        }
        unset($item);
        return $items;
    }

    /** @param array<int, object> $entries */
    private function accountSummary(array $entries, int $userId = 0): array
    {
        $map = [];
        $canonicalNoAccount = 'Sem conta/cartao';

        if ($userId > 0 && $this->accounts) {
            foreach ($this->accounts->listByUser($userId, false) as $account) {
                $accountId = (int)($account->id ?? 0);
                if ($accountId <= 0) {
                    continue;
                }
                $name = trim((string)($account->name ?? ''));
                if ($name === '') {
                    continue;
                }
                $key = 'id:' . $accountId;
                $map[$key] = [
                    'id' => $accountId,
                    'name' => $name,
                    'type' => (string)($account->type ?? 'bank'),
                    'in' => 0.0,
                    'out' => 0.0,
                    'initial_balance' => (float)($account->initialBalance ?? 0.0),
                ];
            }
        }

        foreach ($entries as $entry) {
            $accountId = (int)($entry->accountId ?? 0);
            $name = trim((string)($entry->accountName ?? ''));
            if ($accountId <= 0) {
                $name = $canonicalNoAccount;
                $accountId = 0;
            } elseif ($name === '') {
                $name = 'Conta #' . $accountId;
            }
            $key = $accountId > 0
                ? ('id:' . $accountId)
                : ('name:' . strtolower($name));
            if (!isset($map[$key])) {
                $map[$key] = [
                    'id' => $accountId,
                    'name' => $name,
                    'type' => (string)($entry->accountType ?? 'bank'),
                    'in' => 0.0,
                    'out' => 0.0,
                    'initial_balance' => 0.0,
                ];
            }
            $amount = $this->effectiveAmount($entry);
            if ($entry->type === 'in') {
                $map[$key]['in'] += $amount;
            } else {
                $map[$key]['out'] += $amount;
            }
        }
        $items = array_values($map);
        $totalAll = 0.0;
        foreach ($items as $item) {
            $totalAll += (float)$item['in'] + (float)$item['out'];
        }
        usort($items, fn($a, $b) => ($b['in'] + $b['out']) <=> ($a['in'] + $a['out']));
        foreach ($items as &$item) {
            $share = $totalAll ? ((((float)$item['in'] + (float)$item['out']) / $totalAll) * 100) : 0;
            $item['share'] = (int)round($share);
            $item['balance'] = (float)$item['in'] - (float)$item['out'];
        }
        unset($item);
        return $items;
    }

    /** @param array<int, object> $entries */
    private function last12Months(array $entries): array
    {
        $now = new \DateTimeImmutable('first day of this month');
        $months = [];
        for ($i = 11; $i >= 0; $i--) {
            $d = $now->modify('-' . $i . ' months');
            $key = $d->format('Y-m');
            $months[$key] = [
                'key' => $key,
                'in' => 0,
                'out' => 0,
                'month_balance' => 0,
                'balance' => 0,
                'in_acc' => 0,
                'out_acc' => 0,
            ];
        }
        foreach ($entries as $entry) {
            if (!empty($entry->deletedAt) || !empty($entry->needsReview)) {
                continue;
            }
            $month = substr((string)$entry->date, 0, 7);
            if (!isset($months[$month])) {
                continue;
            }
            if ($entry->type === 'in') {
                $months[$month]['in'] += $entry->amount;
            } else {
                $months[$month]['out'] += $entry->amount;
            }
        }
        $runningIn = 0;
        $runningOut = 0;
        $runningBalance = 0;
        foreach ($months as $key => $data) {
            $runningIn += $data['in'];
            $runningOut += $data['out'];
            $monthBalance = $data['in'] - $data['out'];
            $runningBalance += $monthBalance;
            $months[$key]['month_balance'] = $monthBalance;
            $months[$key]['balance'] = $runningBalance;
            $months[$key]['in_acc'] = $runningIn;
            $months[$key]['out_acc'] = $runningOut;
        }
        return array_values($months);
    }

    private function lower(string $value): string
    {
        return function_exists('mb_strtolower') ? mb_strtolower($value) : strtolower($value);
    }

    private function effectiveAmount(object $entry): float
    {
        if (!empty($entry->needsReview)) {
            if (isset($entry->validAmount) && $entry->validAmount !== null) {
                return (float)$entry->validAmount;
            }
            return (float)$entry->amount;
        }
        return (float)$entry->amount;
    }

    private function normalizeMonthKey(string $month): string
    {
        $value = trim($month);
        if (preg_match('/^\d{4}-\d{2}$/', $value)) {
            return $value;
        }
        return (new \DateTimeImmutable('first day of this month'))->format('Y-m');
    }

    /** @return array{start:string,end:string} */
    private function monthBounds(string $monthKey): array
    {
        $date = \DateTimeImmutable::createFromFormat('Y-m-d', $monthKey . '-01');
        if (!$date) {
            $date = new \DateTimeImmutable('first day of this month');
        }
        return [
            'start' => $date->format('Y-m-d'),
            'end' => $date->modify('last day of this month')->format('Y-m-d'),
        ];
    }
}

