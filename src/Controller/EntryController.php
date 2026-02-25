<?php
declare(strict_types=1);

namespace App\Controller;

use App\Repository\Sqlite\SqliteEntryRepository;
use App\Repository\Sqlite\SqliteUserAccountRepository;
use App\Service\AdminNotificationService;
use App\Service\EntryService;
use App\Service\MonthLockService;
use App\Util\Response;

class EntryController extends BaseController
{
    public function list(): void
    {
        $uid = $this->requireAuth();
        if (($this->authPayload['role'] ?? 'user') === 'admin') {
            Response::json(['error' => 'Administradores nao lancam entradas'], 403);
        }
        $service = new EntryService($this->entryRepo(), $this->accountRepo(), $this->lockService(), $this->config['paths']['uploads'] ?? null, $this->notificationService());
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
        if (($this->authPayload['role'] ?? 'user') === 'admin') {
            Response::json(['error' => 'Administradores nao lancam entradas'], 403);
        }
        $filters = [
            'start' => $_GET['start'] ?? null,
            'end' => $_GET['end'] ?? null,
            'type' => $_GET['type'] ?? null,
            'category' => $_GET['category'] ?? null,
        ];
        $service = new \App\Service\ReportService($this->entryRepo());
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
        if (($this->authPayload['role'] ?? 'user') === 'admin') {
            Response::json(['error' => 'Administradores nao lancam entradas'], 403);
        }
        $service = new EntryService($this->entryRepo(), $this->accountRepo(), $this->lockService(), $this->config['paths']['uploads'] ?? null, $this->notificationService());
        $data = $service->create($uid, $this->jsonInput());
        Response::json($data, 201);
    }

    public function update(array $params): void
    {
        $uid = $this->requireAuth();
        if (($this->authPayload['role'] ?? 'user') === 'admin') {
            Response::json(['error' => 'Administradores nao lancam entradas'], 403);
        }
        $id = (int) ($params['id'] ?? 0);
        $service = new EntryService($this->entryRepo(), $this->accountRepo(), $this->lockService(), $this->config['paths']['uploads'] ?? null, $this->notificationService());
        $data = $service->update($uid, $id, $this->jsonInput());
        Response::json($data);
    }

    public function delete(array $params): void
    {
        $uid = $this->requireAuth();
        if (($this->authPayload['role'] ?? 'user') === 'admin') {
            Response::json(['error' => 'Administradores nao lancam entradas'], 403);
        }
        $id = (int) ($params['id'] ?? 0);
        $service = new EntryService($this->entryRepo(), $this->accountRepo(), $this->lockService(), $this->config['paths']['uploads'] ?? null, $this->notificationService());
        $deleted = $service->delete($uid, $id);
        Response::json(['deleted' => $deleted]);
    }

    public function trash(): void
    {
        $uid = $this->requireAuth();
        if (($this->authPayload['role'] ?? 'user') === 'admin') {
            Response::json(['error' => 'Administradores nao usam este recurso'], 403);
        }
        $service = new EntryService($this->entryRepo(), $this->accountRepo(), $this->lockService(), $this->config['paths']['uploads'] ?? null, $this->notificationService());
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
        if (($this->authPayload['role'] ?? 'user') === 'admin') {
            Response::json(['error' => 'Administradores nao lancam entradas'], 403);
        }
        $id = (int) ($params['id'] ?? 0);
        $service = new EntryService($this->entryRepo(), $this->accountRepo(), $this->lockService(), $this->config['paths']['uploads'] ?? null, $this->notificationService());
        $data = $service->restore($uid, $id);
        Response::json($data);
    }

    public function purge(array $params): void
    {
        $uid = $this->requireAuth();
        if (($this->authPayload['role'] ?? 'user') === 'admin') {
            Response::json(['error' => 'Administradores nao lancam entradas'], 403);
        }
        $id = (int) ($params['id'] ?? 0);
        $service = new EntryService($this->entryRepo(), $this->accountRepo(), $this->lockService(), $this->config['paths']['uploads'] ?? null, $this->notificationService());
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

    private function lockService(): MonthLockService
    {
        return new MonthLockService($this->db());
    }

    private function notificationService(): AdminNotificationService
    {
        return new AdminNotificationService($this->db());
    }
}
