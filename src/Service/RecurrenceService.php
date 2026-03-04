<?php
declare(strict_types=1);

namespace App\Service;

use App\Domain\Recurrence;
use App\Repository\EntryRepositoryInterface;
use App\Repository\RecurrenceRepositoryInterface;
use App\Repository\RecurrenceRunRepositoryInterface;
use App\Repository\UserAccountRepositoryInterface;
use App\Util\Response;
use App\Util\Validator;

class RecurrenceService
{
    private const SYNC_COOLDOWN_SECONDS = 8;
    /** @var array<int, int> */
    private static array $lastSyncAtByUser = [];

    private RecurrenceRepositoryInterface $recurrences;
    private RecurrenceRunRepositoryInterface $runs;
    private EntryRepositoryInterface $entries;
    private UserAccountRepositoryInterface $accounts;

    public function __construct(
        RecurrenceRepositoryInterface $recurrences,
        RecurrenceRunRepositoryInterface $runs,
        EntryRepositoryInterface $entries,
        UserAccountRepositoryInterface $accounts
    ) {
        $this->recurrences = $recurrences;
        $this->runs = $runs;
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

    public function confirmRunForUser(int $recurrenceId, int $runId, int $userId, array $input = []): array
    {
        $this->syncDueEntries($userId, true);
        $recurrence = $this->recurrences->findForUser($recurrenceId, $userId);
        if (!$recurrence) {
            Response::json(['error' => 'Recorrencia nao encontrada'], 404);
        }
        $run = $this->runs->findForUser($runId, $userId);
        if (!$run || $run->recurrenceId !== $recurrenceId) {
            Response::json(['error' => 'Agendamento nao encontrado'], 404);
        }
        if ($run->status === 'skipped') {
            Response::json(['error' => 'Agendamento ja marcado como nao executado'], 409);
        }

        if ($run->entryId && $run->status === 'confirmed') {
            $this->runs->updateForUser($runId, $userId, [
                'status' => 'confirmed',
                'executed_at' => $run->executedAt ?: date('c'),
            ]);
            return $this->detailForUser($recurrenceId, $userId);
        }

        $entryDate = (string)($input['date'] ?? $run->scheduledDate);
        if (!Validator::date($entryDate)) {
            Response::json(['error' => 'Data invalida'], 422);
        }
        $amount = $input['amount'] ?? $recurrence->amount;
        if (!Validator::positiveNumber($amount)) {
            Response::json(['error' => 'Valor invalido'], 422);
        }
        $type = (string)($input['type'] ?? $recurrence->type);
        if (!in_array($type, ['in', 'out'], true)) {
            Response::json(['error' => 'Tipo invalido'], 422);
        }
        $category = trim((string)($input['category'] ?? $recurrence->category));
        if (!Validator::nonEmpty($category)) {
            Response::json(['error' => 'Categoria obrigatoria'], 422);
        }
        $accountId = $this->normalizeAccountId($input['account_id'] ?? $recurrence->accountId, $userId);
        $description = trim((string)($input['description'] ?? $recurrence->description));

        $entry = $this->entries->create($userId, [
            'type' => $type,
            'amount' => (float)$amount,
            'category' => $category,
            'account_id' => $accountId > 0 ? $accountId : null,
            'description' => $description,
            'date' => $entryDate,
            'attachment_path' => null,
            'needs_review' => 0,
            'reviewed_at' => date('c'),
            'recurrence_id' => $recurrenceId,
        ]);

        $this->runs->updateForUser($runId, $userId, [
            'status' => 'confirmed',
            'entry_id' => $entry->id,
            'executed_at' => date('c'),
        ]);

        return $this->detailForUser($recurrenceId, $userId);
    }

    public function skipRunForUser(int $recurrenceId, int $runId, int $userId): array
    {
        $this->syncDueEntries($userId, true);
        $recurrence = $this->recurrences->findForUser($recurrenceId, $userId);
        if (!$recurrence) {
            Response::json(['error' => 'Recorrencia nao encontrada'], 404);
        }
        $run = $this->runs->findForUser($runId, $userId);
        if (!$run || $run->recurrenceId !== $recurrenceId) {
            Response::json(['error' => 'Agendamento nao encontrado'], 404);
        }
        if ($run->status === 'confirmed') {
            Response::json(['error' => 'Agendamento ja confirmado'], 409);
        }
        $this->runs->updateForUser($runId, $userId, [
            'status' => 'skipped',
            'entry_id' => null,
            'executed_at' => null,
        ]);
        return $this->detailForUser($recurrenceId, $userId);
    }

    public function syncDueEntries(int $userId, bool $force = false): int
    {
        $nowTs = time();
        if (!$force) {
            $lastSync = (int)(self::$lastSyncAtByUser[$userId] ?? 0);
            if ($lastSync > 0 && ($nowTs - $lastSync) < self::SYNC_COOLDOWN_SECONDS) {
                return 0;
            }
        }
        self::$lastSyncAtByUser[$userId] = $nowTs;

        $today = date('Y-m-d');
        $dueItems = $this->recurrences->listDueByUser($userId, $today);
        $created = 0;

        foreach ($dueItems as $recurrence) {
            $safety = 0;
            $cursor = $recurrence->nextRunDate;
            while ($recurrence->active && $cursor <= $today && $safety < 366) {
                $run = $this->runs->findByRecurrenceDate($userId, $recurrence->id, $cursor);
                if (!$run) {
                    $this->runs->createPending($userId, $recurrence->id, $cursor);
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

    private function normalizeAccountId($value, int $userId): ?int
    {
        if ($value === null || $value === '') {
            return null;
        }
        $accountId = (int)$value;
        if ($accountId <= 0) {
            return null;
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
        $runs = $this->runs->listByRecurrence($item->userId, $item->id, 240);
        $entries = $this->entries->listByRecurrence($item->userId, $item->id);

        $activeEntries = array_values(array_filter($entries, fn($entry) => empty($entry->deletedAt)));
        usort($activeEntries, fn($a, $b) => strcmp((string)$b->date, (string)$a->date));

        $payload['entries_count'] = count($activeEntries);
        $payload['last_entry_date'] = $activeEntries[0]->date ?? null;
        $payload['runs'] = array_map(fn($run) => $run->toArray(), $runs);
        $payload['runs_summary'] = [
            'pending' => count(array_filter($runs, fn($run) => $run->status === 'pending')),
            'confirmed' => count(array_filter($runs, fn($run) => $run->status === 'confirmed')),
            'skipped' => count(array_filter($runs, fn($run) => $run->status === 'skipped')),
        ];
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
