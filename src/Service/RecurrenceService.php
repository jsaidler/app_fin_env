<?php
declare(strict_types=1);

namespace App\Service;

use App\Domain\Recurrence;
use App\Repository\EntryRepositoryInterface;
use App\Repository\RecurrenceRepositoryInterface;
use App\Repository\UserAccountRepositoryInterface;
use App\Util\Response;
use App\Util\Validator;

class RecurrenceService
{
    private RecurrenceRepositoryInterface $recurrences;
    private EntryRepositoryInterface $entries;
    private UserAccountRepositoryInterface $accounts;

    public function __construct(
        RecurrenceRepositoryInterface $recurrences,
        EntryRepositoryInterface $entries,
        UserAccountRepositoryInterface $accounts
    ) {
        $this->recurrences = $recurrences;
        $this->entries = $entries;
        $this->accounts = $accounts;
    }

    public function listForUser(int $userId): array
    {
        $this->syncDueEntries($userId);
        $items = $this->recurrences->listByUser($userId, false);
        return array_map(fn(Recurrence $item) => $this->decorateRecurrence($item), $items);
    }

    public function detailForUser(int $id, int $userId): array
    {
        $this->syncDueEntries($userId);
        $item = $this->recurrences->findForUser($id, $userId);
        if (!$item) {
            Response::json(['error' => 'Recorrencia nao encontrada'], 404);
        }
        return $this->decorateRecurrence($item, true);
    }

    public function createForUser(int $userId, array $input): array
    {
        $payload = $this->normalizePayload($input, $userId);
        $created = $this->recurrences->create($userId, $payload);
        $this->syncDueEntries($userId);
        $fresh = $this->recurrences->findForUser($created->id, $userId) ?? $created;
        return $this->decorateRecurrence($fresh, true);
    }

    public function updateForUser(int $id, int $userId, array $input): array
    {
        $existing = $this->recurrences->findForUser($id, $userId);
        if (!$existing) {
            Response::json(['error' => 'Recorrencia nao encontrada'], 404);
        }

        $merged = array_merge($existing->toArray(), $input);
        $payload = $this->normalizePayload($merged, $userId, true, $existing);

        $updated = $this->recurrences->updateForUser($id, $userId, $payload);
        if (!$updated) {
            Response::json(['error' => 'Recorrencia nao encontrada'], 404);
        }
        $this->syncDueEntries($userId);
        $fresh = $this->recurrences->findForUser($updated->id, $userId) ?? $updated;
        return $this->decorateRecurrence($fresh, true);
    }

    public function deleteForUser(int $id, int $userId): bool
    {
        $existing = $this->recurrences->findForUser($id, $userId);
        if (!$existing) {
            Response::json(['error' => 'Recorrencia nao encontrada'], 404);
        }
        return $this->recurrences->deleteForUser($id, $userId);
    }

    public function syncDueEntries(int $userId): int
    {
        $today = date('Y-m-d');
        $dueItems = $this->recurrences->listDueByUser($userId, $today);
        $created = 0;

        foreach ($dueItems as $recurrence) {
            $safety = 0;
            $cursor = $recurrence->nextRunDate;
            $existingEntries = $this->entries->listByRecurrence($userId, $recurrence->id);
            $existingDates = [];
            foreach ($existingEntries as $entry) {
                if (empty($entry->deletedAt)) {
                    $existingDates[(string)$entry->date] = true;
                }
            }

            while ($recurrence->active && $cursor <= $today && $safety < 366) {
                if (empty($existingDates[$cursor])) {
                    $this->entries->create($userId, [
                        'type' => $recurrence->type,
                        'amount' => $recurrence->amount,
                        'category' => $recurrence->category,
                        'account_id' => $recurrence->accountId > 0 ? $recurrence->accountId : null,
                        'description' => $recurrence->description,
                        'date' => $cursor,
                        'attachment_path' => null,
                        'needs_review' => 0,
                        'reviewed_at' => date('c'),
                        'recurrence_id' => $recurrence->id,
                    ]);
                    $existingDates[$cursor] = true;
                    $created += 1;
                }

                $next = $this->nextDate($cursor, $recurrence->frequency);
                $recurrence = $this->recurrences->updateForUser($recurrence->id, $userId, [
                    'last_run_date' => $cursor,
                    'next_run_date' => $next,
                    'active' => 1,
                ]) ?? $recurrence;

                $cursor = $next;
                $safety += 1;
            }
        }

        return $created;
    }

    private function normalizePayload(array $input, int $userId, bool $isUpdate = false, ?Recurrence $existing = null): array
    {
        $type = trim((string)($input['type'] ?? ''));
        $amount = $input['amount'] ?? null;
        $category = trim((string)($input['category'] ?? ''));
        $accountId = $this->normalizeAccountId($input['account_id'] ?? null, $userId);
        $description = trim((string)($input['description'] ?? ''));
        $frequency = $this->normalizeFrequency((string)($input['frequency'] ?? ''));
        $startDate = (string)($input['start_date'] ?? '');
        $active = array_key_exists('active', $input) ? (bool)$input['active'] : true;

        if (!in_array($type, ['in', 'out'], true)) {
            Response::json(['error' => 'Tipo invalido'], 422);
        }
        if (!Validator::positiveNumber($amount)) {
            Response::json(['error' => 'Valor invalido'], 422);
        }
        if (!Validator::nonEmpty($category)) {
            Response::json(['error' => 'Categoria obrigatoria'], 422);
        }
        if ($startDate === '') {
            $startDate = $isUpdate && $existing ? $existing->startDate : date('Y-m-d');
        }
        if (!Validator::date($startDate)) {
            Response::json(['error' => 'Data inicial invalida'], 422);
        }

        $nextRunDate = (string)($input['next_run_date'] ?? '');
        if ($nextRunDate === '') {
            $nextRunDate = $isUpdate && $existing ? $existing->nextRunDate : $startDate;
        }
        if (!Validator::date($nextRunDate)) {
            $nextRunDate = $startDate;
        }

        $lastRunDate = $input['last_run_date'] ?? null;
        if ($lastRunDate !== null && $lastRunDate !== '' && !Validator::date((string)$lastRunDate)) {
            Response::json(['error' => 'Ultima data de execucao invalida'], 422);
        }

        return [
            'type' => $type,
            'amount' => (float)$amount,
            'category' => $category,
            'account_id' => $accountId,
            'description' => $description,
            'frequency' => $frequency,
            'start_date' => $startDate,
            'next_run_date' => $nextRunDate,
            'last_run_date' => $lastRunDate ?: null,
            'active' => $active ? 1 : 0,
        ];
    }

    private function normalizeAccountId($value, int $userId): int
    {
        if ($value === null || $value === '') {
            return 0;
        }
        $accountId = (int)$value;
        if ($accountId <= 0) {
            return 0;
        }
        $account = $this->accounts->findForUser($accountId, $userId);
        if (!$account || !$account->active) {
            Response::json(['error' => 'Conta/cartao invalido'], 422);
        }
        return $accountId;
    }

    private function normalizeFrequency(string $value): string
    {
        $frequency = trim(strtolower($value));
        $map = [
            'daily' => 'daily',
            'weekly' => 'weekly',
            'biweekly' => 'biweekly',
            'quinzenal' => 'biweekly',
            'monthly' => 'monthly',
            'mensal' => 'monthly',
            'yearly' => 'annual',
            'annual' => 'annual',
            'anual' => 'annual',
        ];
        $normalized = $map[$frequency] ?? null;
        if (!$normalized) {
            Response::json(['error' => 'Frequencia invalida'], 422);
        }
        return $normalized;
    }

    private function nextDate(string $dateIso, string $frequency): string
    {
        $date = \DateTimeImmutable::createFromFormat('Y-m-d', $dateIso);
        if (!$date) {
            return $dateIso;
        }
        return match ($frequency) {
            'daily' => $date->modify('+1 day')->format('Y-m-d'),
            'weekly' => $date->modify('+7 days')->format('Y-m-d'),
            'biweekly' => $date->modify('+14 days')->format('Y-m-d'),
            'annual' => $date->modify('+1 year')->format('Y-m-d'),
            default => $date->modify('+1 month')->format('Y-m-d'),
        };
    }

    private function decorateRecurrence(Recurrence $item, bool $withEntries = false): array
    {
        $payload = $item->toArray();
        $entries = $this->entries->listByRecurrence($item->userId, $item->id);

        $activeEntries = array_values(array_filter($entries, fn($entry) => empty($entry->deletedAt)));
        usort($activeEntries, fn($a, $b) => strcmp((string)$b->date, (string)$a->date));

        $payload['entries_count'] = count($activeEntries);
        $payload['last_entry_date'] = $activeEntries[0]->date ?? null;
        $payload['next_entry'] = [
            'date' => $item->nextRunDate,
            'amount' => $item->amount,
            'type' => $item->type,
            'category' => $item->category,
            'description' => $item->description,
            'account_id' => $item->accountId,
            'account_name' => $item->accountName,
            'account_type' => $item->accountType,
        ];

        if ($withEntries) {
            $payload['entries'] = array_map(fn($entry) => $entry->toArray(), $activeEntries);
        }

        return $payload;
    }
}
