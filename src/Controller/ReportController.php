<?php
declare(strict_types=1);

namespace App\Controller;

use App\Repository\Sqlite\SqliteEntryRepository;
use App\Service\MonthLockService;
use App\Service\ReportService;
use App\Util\Response;

class ReportController extends BaseController
{
    public function summary(): void
    {
        $uid = $this->requireAuth();
        $service = new ReportService($this->entryRepo());
        $summary = $service->summary($uid);
        Response::json($summary);
    }

    public function aggregate(): void
    {
        $uid = $this->requireAuth();
        $filters = [
            'start' => $_GET['start'] ?? null,
            'end' => $_GET['end'] ?? null,
            'type' => $_GET['type'] ?? null,
            'category' => $_GET['category'] ?? null,
        ];
        $service = new ReportService($this->entryRepo());
        $data = $service->aggregateReport($uid, $filters);
        Response::json($data);
    }

    public function closure(): void
    {
        $uid = $this->requireAuth();
        $month = trim((string)($_GET['month'] ?? ''));
        if (!preg_match('/^\\d{4}-\\d{2}$/', $month)) {
            Response::json(['error' => 'Mes invalido'], 422);
        }
        $service = new ReportService($this->entryRepo());
        $report = $service->monthClosure($uid, $month);
        $lock = $this->lockService()->getLockForUser($month, $uid);
        $closed = $lock ? (bool)$lock['closed'] : false;
        $report['closed'] = $closed;
        $report['closed_at'] = $lock['updated_at'] ?? null;
        Response::json($report);
    }

    private function entryRepo()
    {
        return new SqliteEntryRepository($this->db());
    }

    private function lockService(): MonthLockService
    {
        return new MonthLockService($this->db());
    }
}
