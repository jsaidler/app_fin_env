<?php
declare(strict_types=1);

namespace App\Controller;

use App\Repository\Sqlite\SqliteEntryRepository;
use App\Repository\Sqlite\SqliteRecurrenceRepository;
use App\Repository\Sqlite\SqliteUserAccountRepository;
use App\Service\AdminNotificationService;
use App\Service\EntryService;
use App\Service\MonthLockService;
use App\Service\RecurrenceService;
use App\Util\Response;

class EntryController extends BaseController
{
    public function list(): void
    {
        $uid = $this->requireAuth();
        $service = new EntryService($this->entryRepo(), $this->accountRepo(), $this->lockService(), $this->config['paths']['uploads'] ?? null, $this->notificationService());
        $this->recurrenceService()->syncDueEntries($uid);
        $service->purgeOlderThanDays(7);
        $includeDeleted = isset($_GET['include_deleted']) && $_GET['include_deleted'] === '1';
        $entries = $includeDeleted ? $service->listDeleted($uid) : $service->list($uid);
        $closed = array_filter($this->lockService()->listClosed(), fn($l) => $l['user_id'] === $uid && $l['closed']);
        $closedMonths = array_map(fn($l) => $l['month'], $closed);
        $data = array_map(function($e) use ($closedMonths, $includeDeleted) {
            $arr = $e->toArray();
            $month = substr($arr['date'], 0, 7);
            $locked = in_array($month, $closedMonths, true);
            $arr['can_delete'] = true;
            $arr['locked'] = $locked;
            if ($arr['deleted_at']) {
                if ($arr['deleted_type'] === 'rejected') {
                    $arr['status'] = 'rejected';
                } else {
                    $arr['status'] = $arr['deleted_type'] === 'hard' ? 'deleted_hard' : 'deleted_soft';
                }
            } else {
                $arr['status'] = !empty($arr['needs_review']) ? 'pending' : ($locked ? 'locked' : 'open');
            }
            if (!$includeDeleted) {
                unset($arr['deleted_at'], $arr['deleted_type']);
            }
            return $arr;
        }, $entries);
        Response::json($data);
    }

    public function summary(): void
    {
        $uid = $this->requireAuth();
        $filters = [
            'start' => $_GET['start'] ?? null,
            'end' => $_GET['end'] ?? null,
            'type' => $_GET['type'] ?? null,
            'category' => $_GET['category'] ?? null,
        ];
        $service = new \App\Service\ReportService($this->entryRepo());
        $this->recurrenceService()->syncDueEntries($uid);
        $summary = $service->aggregateEntriesView($uid, $filters);
        $filtered = $service->filterEntriesForUser($uid, $filters);
        $closed = array_filter($this->lockService()->listClosed(), fn($l) => $l['user_id'] === $uid && $l['closed']);
        $closedMonths = array_map(fn($l) => $l['month'], $closed);
        $hasLocked = false;
        foreach ($filtered as $entry) {
            $month = substr((string)$entry->date, 0, 7);
            if (in_array($month, $closedMonths, true)) {
                $hasLocked = true;
                break;
            }
        }
        $summary['has_locked'] = $hasLocked;
        Response::json($summary);
    }

    public function create(): void
    {
        $uid = $this->requireAuth();
        $modifierUserId = $this->actorModifierId($uid);
        $service = new EntryService($this->entryRepo(), $this->accountRepo(), $this->lockService(), $this->config['paths']['uploads'] ?? null, $this->notificationService());
        $this->recurrenceService()->syncDueEntries($uid);
        $input = $this->jsonInput();
        $input['last_modified_by_user_id'] = $modifierUserId;
        $data = $service->create($uid, $input);

        $frequency = trim((string)($input['recurrence_frequency'] ?? ''));
        if ($frequency !== '') {
            $recurrence = $this->recurrenceService()->createForUser($uid, [
                'type' => $data['type'] ?? ($input['type'] ?? ''),
                'amount' => $data['amount'] ?? ($input['amount'] ?? 0),
                'category' => $data['category'] ?? ($input['category'] ?? ''),
                'account_id' => $data['account_id'] ?? ($input['account_id'] ?? 0),
                'description' => $data['description'] ?? ($input['description'] ?? ''),
                'frequency' => $frequency,
                'start_date' => $data['date'] ?? ($input['date'] ?? date('Y-m-d')),
                'next_run_date' => $this->nextDateByFrequency(
                    (string)($data['date'] ?? ($input['date'] ?? date('Y-m-d'))),
                    $frequency
                ),
                'active' => 1,
            ]);

            $entryUpdated = $service->update($uid, (int)($data['id'] ?? 0), [
                'recurrence_id' => (int)($recurrence['id'] ?? 0),
                'last_modified_by_user_id' => $modifierUserId,
            ]);
            $data = $entryUpdated;
            $data['recurrence'] = [
                'id' => (int)($recurrence['id'] ?? 0),
                'frequency' => (string)($recurrence['frequency'] ?? $frequency),
            ];
        }
        Response::json($data, 201);
    }

    public function update(array $params): void
    {
        $uid = $this->requireAuth();
        $modifierUserId = $this->actorModifierId($uid);
        $id = (int) ($params['id'] ?? 0);
        $service = new EntryService($this->entryRepo(), $this->accountRepo(), $this->lockService(), $this->config['paths']['uploads'] ?? null, $this->notificationService());
        $this->recurrenceService()->syncDueEntries($uid);
        $input = $this->jsonInput();
        $input['last_modified_by_user_id'] = $modifierUserId;
        $data = $service->update($uid, $id, $input);
        Response::json($data);
    }

    public function delete(array $params): void
    {
        $uid = $this->requireAuth();
        $modifierUserId = $this->actorModifierId($uid);
        $id = (int) ($params['id'] ?? 0);
        $service = new EntryService($this->entryRepo(), $this->accountRepo(), $this->lockService(), $this->config['paths']['uploads'] ?? null, $this->notificationService());
        $this->recurrenceService()->syncDueEntries($uid);
        $deleted = $service->delete($uid, $id, $modifierUserId);
        Response::json(['deleted' => $deleted]);
    }

    public function trash(): void
    {
        $uid = $this->requireAuth();
        $service = new EntryService($this->entryRepo(), $this->accountRepo(), $this->lockService(), $this->config['paths']['uploads'] ?? null, $this->notificationService());
        $this->recurrenceService()->syncDueEntries($uid);
        $entries = array_filter($service->listDeleted($uid), fn($e) => $e->deletedAt !== null);
        $data = array_values(array_map(function($e) {
            $arr = $e->toArray();
            $arr['status'] = $arr['deleted_type'] === 'hard' ? 'deleted_hard' : 'deleted_soft';
            return $arr;
        }, $entries));
        Response::json($data);
    }

    public function restore(array $params): void
    {
        $uid = $this->requireAuth();
        $modifierUserId = $this->actorModifierId($uid);
        $id = (int) ($params['id'] ?? 0);
        $service = new EntryService($this->entryRepo(), $this->accountRepo(), $this->lockService(), $this->config['paths']['uploads'] ?? null, $this->notificationService());
        $this->recurrenceService()->syncDueEntries($uid);
        $data = $service->restore($uid, $id, $modifierUserId);
        Response::json($data);
    }

    public function purge(array $params): void
    {
        $uid = $this->requireAuth();
        $id = (int) ($params['id'] ?? 0);
        $service = new EntryService($this->entryRepo(), $this->accountRepo(), $this->lockService(), $this->config['paths']['uploads'] ?? null, $this->notificationService());
        $this->recurrenceService()->syncDueEntries($uid);
        $ok = $service->purge($uid, $id);
        Response::json(['deleted' => $ok]);
    }

    private function entryRepo()
    {
        return new SqliteEntryRepository($this->db());
    }

    private function accountRepo()
    {
        return new SqliteUserAccountRepository($this->db());
    }

    private function recurrenceRepo()
    {
        return new SqliteRecurrenceRepository($this->db());
    }

    private function lockService(): MonthLockService
    {
        return new MonthLockService($this->db());
    }

    private function notificationService(): AdminNotificationService
    {
        return new AdminNotificationService($this->db());
    }

    private function recurrenceService(): RecurrenceService
    {
        return new RecurrenceService($this->recurrenceRepo(), $this->entryRepo(), $this->accountRepo());
    }

    private function nextDateByFrequency(string $dateIso, string $frequency): string
    {
        $date = \DateTimeImmutable::createFromFormat('Y-m-d', $dateIso);
        if (!$date) {
            return $dateIso;
        }
        $normalized = strtolower(trim($frequency));
        return match ($normalized) {
            'daily' => $date->modify('+1 day')->format('Y-m-d'),
            'weekly' => $date->modify('+7 days')->format('Y-m-d'),
            'biweekly', 'quinzenal' => $date->modify('+14 days')->format('Y-m-d'),
            'annual', 'anual', 'yearly' => $date->modify('+1 year')->format('Y-m-d'),
            default => $date->modify('+1 month')->format('Y-m-d'),
        };
    }

    private function actorModifierId(int $defaultUserId): int
    {
        $impBy = isset($this->authPayload['imp_by']) ? (int)$this->authPayload['imp_by'] : 0;
        return $impBy > 0 ? $impBy : $defaultUserId;
    }
}
