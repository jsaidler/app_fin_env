<?php
declare(strict_types=1);

namespace App\Controller;

use App\Repository\Sqlite\SqliteEntryRepository;
use App\Repository\Sqlite\SqliteRecurrenceRepository;
use App\Repository\Sqlite\SqliteUserAccountRepository;
use App\Service\MonthLockService;
use App\Service\RecurrenceService;
use App\Service\ReportService;
use App\Util\Logger;
use App\Util\Response;

class ReportController extends BaseController
{
    public function summary(): void
    {
        $uid = $this->requireAuth();
        $this->recurrenceService()->syncDueEntries($uid);
        $service = new ReportService($this->entryRepo(), $this->accountRepo());
        $summary = $service->summary($uid);
        Response::json($summary);
    }

    public function aggregate(): void
    {
        $uid = $this->requireAuth();
        $this->recurrenceService()->syncDueEntries($uid);
        $filters = [
            'start' => $_GET['start'] ?? null,
            'end' => $_GET['end'] ?? null,
            'type' => $_GET['type'] ?? null,
            'category' => $_GET['category'] ?? null,
        ];
        $service = new ReportService($this->entryRepo(), $this->accountRepo());
        $data = $service->aggregateReport($uid, $filters);
        $this->logDiagnostics('aggregate', $uid, $filters, $data);
        Response::json($data);
    }

    public function closure(): void
    {
        $uid = $this->requireAuth();
        $this->recurrenceService()->syncDueEntries($uid);
        $month = trim((string)($_GET['month'] ?? ''));
        if (!preg_match('/^\\d{4}-\\d{2}$/', $month)) {
            Response::json(['error' => 'Mes invalido'], 422);
        }
        $service = new ReportService($this->entryRepo(), $this->accountRepo());
        $report = $service->monthClosure($uid, $month);
        $lock = $this->lockService()->getLockForUser($month, $uid);
        $closed = $lock ? (bool)$lock['closed'] : false;
        $report['closed'] = $closed;
        $report['closed_at'] = $lock['updated_at'] ?? null;
        Response::json($report);
    }

    public function entriesGroups(): void
    {
        $uid = $this->requireAuth();
        $this->recurrenceService()->syncDueEntries($uid);
        $categoriesRaw = $_GET['categories'] ?? ($_GET['category'] ?? null);
        $categories = [];
        if (is_array($categoriesRaw)) {
            $categories = array_values(array_filter(array_map('trim', $categoriesRaw), fn($v) => $v !== ''));
        } elseif (is_string($categoriesRaw) && trim($categoriesRaw) !== '') {
            $categories = array_values(array_filter(array_map('trim', explode(',', $categoriesRaw)), fn($v) => $v !== ''));
        }

        $filters = [
            'start' => $_GET['start'] ?? null,
            'end' => $_GET['end'] ?? null,
            'type' => $_GET['type'] ?? null,
            'entry_type' => $_GET['entry_type'] ?? null,
            'q' => $_GET['q'] ?? null,
            'categories' => $categories,
            'account_id' => $_GET['account_id'] ?? null,
            'account' => $_GET['account'] ?? null,
            'no_account' => $_GET['no_account'] ?? null,
        ];

        $service = new ReportService($this->entryRepo(), $this->accountRepo());
        $data = $service->entriesGroupsReport($uid, $filters);
        $this->logDiagnostics('entries-groups', $uid, $filters, $data);
        Response::json($data);
    }

    private function logDiagnostics(string $endpoint, int $uid, array $filters, array $data): void
    {
        if (!$this->diagnosticsEnabled()) {
            return;
        }

        $groupCount = is_array($data['groups'] ?? null) ? count($data['groups']) : 0;
        $categoryCount = is_array($data['by_category'] ?? null) ? count($data['by_category']) : 0;
        $accountCount = is_array($data['by_account'] ?? null) ? count($data['by_account']) : 0;
        $totalsCount = (int)($data['totals']['count'] ?? 0);
        $totalsBalance = (float)($data['totals']['balance'] ?? 0.0);

        Logger::info('report_diagnostics', [
            'endpoint' => $endpoint,
            'uid' => $uid,
            'auth_uid' => (int)($this->authPayload['uid'] ?? 0),
            'auth_role' => (string)($this->authPayload['role'] ?? ''),
            'imp_by' => isset($this->authPayload['imp_by']) ? (int)$this->authPayload['imp_by'] : 0,
            'path' => (string)($_SERVER['REQUEST_URI'] ?? ''),
            'filters' => $filters,
            'group_count' => $groupCount,
            'by_category_count' => $categoryCount,
            'by_account_count' => $accountCount,
            'totals_count' => $totalsCount,
            'totals_balance' => $totalsBalance,
        ]);
    }

    private function diagnosticsEnabled(): bool
    {
        $env = (string)($this->config['env'] ?? 'prod');
        if ($env === 'dev') {
            return true;
        }
        $debug = strtolower(trim((string)($_GET['debug_report'] ?? '')));
        return in_array($debug, ['1', 'true', 'yes', 'on'], true);
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

    private function recurrenceRepo()
    {
        return new SqliteRecurrenceRepository($this->db());
    }

    private function recurrenceService(): RecurrenceService
    {
        return new RecurrenceService($this->recurrenceRepo(), $this->entryRepo(), $this->accountRepo());
    }
}
