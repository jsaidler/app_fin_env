<?php
declare(strict_types=1);

namespace App\Controller;

use App\Repository\Sqlite\SqliteEntryRepository;
use App\Repository\Sqlite\SqliteRecurrenceRepository;
use App\Repository\Sqlite\SqliteRecurrenceRunRepository;
use App\Repository\Sqlite\SqliteUserAccountRepository;
use App\Service\RecurrenceService;
use App\Util\Response;

class RecurrenceController extends BaseController
{
    public function list(): void
    {
        $uid = $this->requireAuth();
        $service = $this->service();
        Response::json($service->listForUser($uid));
    }

    public function detail(array $params): void
    {
        $uid = $this->requireAuth();
        $id = (int)($params['id'] ?? 0);
        $service = $this->service();
        Response::json($service->detailForUser($id, $uid));
    }

    public function create(): void
    {
        $uid = $this->requireAuth();
        $service = $this->service();
        $item = $service->createForUser($uid, $this->jsonInput());
        Response::json($item, 201);
    }

    public function update(array $params): void
    {
        $uid = $this->requireAuth();
        $id = (int)($params['id'] ?? 0);
        $service = $this->service();
        $item = $service->updateForUser($id, $uid, $this->jsonInput());
        Response::json($item);
    }

    public function delete(array $params): void
    {
        $uid = $this->requireAuth();
        $id = (int)($params['id'] ?? 0);
        $service = $this->service();
        Response::json(['deleted' => $service->deleteForUser($id, $uid)]);
    }

    public function confirmRun(array $params): void
    {
        $uid = $this->requireAuth();
        $recurrenceId = (int)($params['id'] ?? 0);
        $runId = (int)($params['runId'] ?? 0);
        $service = $this->service();
        $item = $service->confirmRunForUser($recurrenceId, $runId, $uid, $this->jsonInput());
        Response::json($item);
    }

    public function skipRun(array $params): void
    {
        $uid = $this->requireAuth();
        $recurrenceId = (int)($params['id'] ?? 0);
        $runId = (int)($params['runId'] ?? 0);
        $service = $this->service();
        $item = $service->skipRunForUser($recurrenceId, $runId, $uid);
        Response::json($item);
    }

    private function service(): RecurrenceService
    {
        return new RecurrenceService(
            new SqliteRecurrenceRepository($this->db()),
            new SqliteRecurrenceRunRepository($this->db()),
            new SqliteEntryRepository($this->db()),
            new SqliteUserAccountRepository($this->db())
        );
    }
}
