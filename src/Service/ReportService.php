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
        if ($type === 'all' || $type === '') {
            $type = null;
        }
        $category = trim((string)($filters['category'] ?? ''));
        if ($category === '') {
            $category = null;
        }
        $category = $category !== null ? $this->lower($category) : null;
        [$start, $end] = $this->normalizeRange($filters);

        return array_values(array_filter($entries, function ($e) use ($type, $category, $start, $end) {
            if (!empty($e->deletedAt)) {
                return false;
            }
            if ($type && $e->type !== $type) {
                return false;
            }
            $entryCategory = trim((string)($e->category ?? ''));
            if ($category !== null && $this->lower($entryCategory) !== $category) {
                return false;
            }
            return $this->isInRange((string)$e->date, $start, $end);
        }));
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