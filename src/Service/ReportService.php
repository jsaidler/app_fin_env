<?php
declare(strict_types=1);

namespace App\Service;

use App\Repository\EntryRepositoryInterface;

class ReportService
{
    private EntryRepositoryInterface $entries;

    public function __construct(EntryRepositoryInterface $entries)
    {
        $this->entries = $entries;
    }

    public function summary(int $userId): array
    {
        $entries = $this->entries->listByUser($userId);
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
        $entries = $this->entries->listByUser($userId);
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
        $entries = $this->entries->listByUser($userId);
        $filtered = $this->filterEntries($entries, $filters);
        $approved = $this->approvedEntries($filtered);
        return [
            'totals' => $this->totals($approved),
            'pending' => $this->pendingTotals($filtered),
            'by_day' => $this->dailySeries($approved),
            'by_category' => $this->categorySummary($approved),
            'by_account' => $this->accountSummary($approved),
            'last_12_months' => $this->last12Months($entries),
        ];
    }

    public function aggregateEntriesView(int $userId, array $filters): array
    {
        $entries = $this->entries->listByUser($userId);
        $filtered = $this->filterEntries($entries, $filters);
        $approved = $this->approvedEntries($filtered);
        return [
            'totals' => $this->totals($approved),
            'pending' => $this->pendingTotals($filtered),
            'insights' => $this->insights($approved),
        ];
    }

    public function entriesGroupsReport(int $userId, array $filters): array
    {
        $typeFilter = trim((string)($filters['type'] ?? ''));
        $deletedOnly = $typeFilter === 'deleted' || !empty($filters['deleted_only']);
        $entries = $this->entries->listByUser($userId, $deletedOnly);
        if ($deletedOnly) {
            $entries = array_values(array_filter($entries, fn($e) => !empty($e->deletedAt)));
        }
        $filtered = $this->filterEntries($entries, $filters);
        $approvedFiltered = $this->approvedEntries($filtered);

        // Totais por nível independentes de filtros comuns.
        // No modo "deleted", o escopo-base são todos os excluídos.
        $approvedAll = $deletedOnly ? $approvedFiltered : $this->approvedEntries($entries);

        $groupedFiltered = $this->groupedByYearMonth($approvedFiltered);
        $groupedAllTotals = $this->groupedByYearMonth($approvedAll);
        $grouped = $this->mergeGroupTotals($groupedFiltered, $groupedAllTotals);

        return [
            'totals' => $this->totals($approvedAll),
            'count' => count($approvedFiltered),
            'groups' => $grouped,
        ];
    }

    /**
     * Mantém estrutura/entries filtrados, mas troca totais de ano/mês/dia pelos totais-base do período.
     *
     * @param array<int, array<string, mixed>> $filtered
     * @param array<int, array<string, mixed>> $base
     * @return array<int, array<string, mixed>>
     */
    private function mergeGroupTotals(array $filtered, array $base): array
    {
        $baseYears = [];
        foreach ($base as $yearNode) {
            $yearKey = (string)($yearNode['year'] ?? '');
            if ($yearKey === '') {
                continue;
            }
            $baseYears[$yearKey] = $yearNode;
        }

        return array_map(function ($yearNode) use ($baseYears) {
            $yearKey = (string)($yearNode['year'] ?? '');
            $baseYear = $baseYears[$yearKey] ?? null;
            if (is_array($baseYear) && isset($baseYear['totals'])) {
                $yearNode['totals'] = $baseYear['totals'];
            }

            $baseMonths = [];
            if (is_array($baseYear) && !empty($baseYear['months']) && is_array($baseYear['months'])) {
                foreach ($baseYear['months'] as $monthNode) {
                    $monthKey = (string)($monthNode['month'] ?? '');
                    if ($monthKey !== '') {
                        $baseMonths[$monthKey] = $monthNode;
                    }
                }
            }

            $yearNode['months'] = array_map(function ($monthNode) use ($baseMonths) {
                $monthKey = (string)($monthNode['month'] ?? '');
                $baseMonth = $baseMonths[$monthKey] ?? null;
                if (is_array($baseMonth) && isset($baseMonth['totals'])) {
                    $monthNode['totals'] = $baseMonth['totals'];
                }

                $baseDays = [];
                if (is_array($baseMonth) && !empty($baseMonth['days']) && is_array($baseMonth['days'])) {
                    foreach ($baseMonth['days'] as $dayNode) {
                        $dayKey = (string)($dayNode['date'] ?? '');
                        if ($dayKey !== '') {
                            $baseDays[$dayKey] = $dayNode;
                        }
                    }
                }

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

    public function filterEntriesForUser(int $userId, array $filters): array
    {
        $entries = $this->entries->listByUser($userId);
        return $this->filterEntries($entries, $filters);
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
        if ($type === 'all' || $type === '' || $type === 'deleted') {
            $type = null;
        }
        $includeDeleted = (bool)($filters['include_deleted'] ?? false);
        $deletedOnly = (bool)($filters['deleted_only'] ?? false) || (($filters['type'] ?? null) === 'deleted');

        if ($deletedOnly) {
            return array_values(array_filter($entries, fn($e) => !empty($e->deletedAt)));
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
        [$start, $end] = $this->normalizeRange($filters);

        return array_values(array_filter($entries, function ($e) use ($type, $categories, $query, $start, $end, $includeDeleted, $deletedOnly) {
            if (!$includeDeleted && !$deletedOnly && !empty($e->deletedAt)) {
                return false;
            }
            if ($deletedOnly && empty($e->deletedAt)) {
                return false;
            }
            if ($type && $e->type !== $type) {
                return false;
            }
            $entryCategory = trim((string)($e->category ?? ''));
            if ($categories && !in_array($this->lower($entryCategory), $categories, true)) {
                return false;
            }
            if ($query !== null) {
                $description = trim((string)($e->description ?? ''));
                $searchIndex = $this->lower($description . ' ' . $entryCategory . ' ' . (string)$e->date);
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
        usort($entries, function ($a, $b) {
            $byDate = strcmp((string)$b->date, (string)$a->date);
            if ($byDate !== 0) {
                return $byDate;
            }
            return strcmp((string)($b->updatedAt ?? $b->createdAt ?? ''), (string)($a->updatedAt ?? $a->createdAt ?? ''));
        });

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

    private function accumulateEntryTotals(array &$totals, object $entry): void
    {
        $amount = (float)abs((float)$entry->amount);
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
            if ($entry->type === 'in') {
                $totalIn += $entry->amount;
            } else {
                $totalOut += $entry->amount;
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
            if ($entry->type === 'in') {
                $byDay[$day]['in'] += $entry->amount;
            } else {
                $byDay[$day]['out'] += $entry->amount;
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
            if ($entry->type === 'in') {
                $map[$name]['in'] += $entry->amount;
            } else {
                $map[$name]['out'] += $entry->amount;
            }
        }
        $items = array_values($map);
        $totalAll = 0;
        foreach ($items as $item) {
            $totalAll += $item['in'] + $item['out'];
        }
        usort($items, fn($a, $b) => ($b['in'] + $b['out']) <=> ($a['in'] + $a['out']));
        $items = array_slice($items, 0, 6);
        foreach ($items as &$item) {
            $share = $totalAll ? (($item['in'] + $item['out']) / $totalAll) * 100 : 0;
            $item['share'] = (int)round($share);
            $item['balance'] = $item['in'] - $item['out'];
        }
        unset($item);
        return $items;
    }

    /** @param array<int, object> $entries */
    private function accountSummary(array $entries): array
    {
        $map = [];
        foreach ($entries as $entry) {
            $name = trim((string)($entry->accountName ?? ''));
            if ($name === '') {
                $name = 'Sem conta/cartão';
            }
            $accountId = (int)($entry->accountId ?? 0);
            $key = ($accountId > 0 ? $accountId . ':' : 'name:') . strtolower($name);
            if (!isset($map[$key])) {
                $map[$key] = [
                    'id' => $accountId,
                    'name' => $name,
                    'type' => (string)($entry->accountType ?? 'bank'),
                    'in' => 0,
                    'out' => 0,
                ];
            }
            if ($entry->type === 'in') {
                $map[$key]['in'] += $entry->amount;
            } else {
                $map[$key]['out'] += $entry->amount;
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
}
