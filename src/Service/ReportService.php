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
}
