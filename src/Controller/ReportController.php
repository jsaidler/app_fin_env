<?php
declare(strict_types=1);

namespace App\Controller;

use App\Repository\Sqlite\SqliteCategoryRepository;
use App\Repository\Sqlite\SqliteEntryRepository;
use App\Repository\Sqlite\SqliteRecurrenceRepository;
use App\Repository\Sqlite\SqliteRecurrenceRunRepository;
use App\Repository\Sqlite\SqliteUserAccountRepository;
use App\Service\AdminNotificationService;
use App\Service\EntryService;
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
            'category_id' => $_GET['category_id'] ?? null,
        ];
        $service = new ReportService($this->entryRepo(), $this->accountRepo());
        $data = $service->aggregateReport($uid, $filters);
        $this->logDiagnostics('aggregate', $uid, $filters, $data);
        Response::json($data);
    }

    public function dashboard(): void
    {
        $uid = $this->requireAuth();
        $this->recurrenceService()->syncDueEntries($uid);
        $month = trim((string)($_GET['month'] ?? ''));
        $entriesGroupsFilters = $this->entriesGroupsFiltersFromRequest();
        $entryService = new EntryService(
            $this->entryRepo(),
            $this->categoryRepo(),
            $this->accountRepo(),
            $this->lockService(),
            $this->config['paths']['uploads'] ?? null,
            $this->notificationService()
        );
        $entryService->purgeOlderThanDays(7);
        $entries = $this->entryRepo()->listByUser($uid);

        $service = new ReportService($this->entryRepo(), $this->accountRepo());
        $data = $service->dashboardSnapshotFromEntries($entries, $uid, $month, $entriesGroupsFilters);
        $data['session_profile'] = $this->sessionProfilePayload($uid);
        $data['entries'] = $this->entriesPayloadFromEntries($uid, $entries);
        $this->logDiagnostics('dashboard', $uid, ['month' => $month, 'entry_groups_filters' => $entriesGroupsFilters], $data);
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
            'category_id' => $_GET['category_id'] ?? null,
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
        if (!empty($this->config['report_diagnostics'])) {
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

    private function categoryRepo()
    {
        return new SqliteCategoryRepository($this->db());
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
        return new RecurrenceService($this->recurrenceRepo(), $this->recurrenceRunRepo(), $this->entryRepo(), $this->categoryRepo(), $this->accountRepo());
    }

    private function recurrenceRunRepo()
    {
        return new SqliteRecurrenceRunRepository($this->db());
    }

    private function entriesGroupsFiltersFromRequest(): array
    {
        $categoriesRaw = $_GET['categories'] ?? ($_GET['category'] ?? null);
        $categories = [];
        if (is_array($categoriesRaw)) {
            $categories = array_values(array_filter(array_map('trim', $categoriesRaw), fn($v) => $v !== ''));
        } elseif (is_string($categoriesRaw) && trim($categoriesRaw) !== '') {
            $categories = array_values(array_filter(array_map('trim', explode(',', $categoriesRaw)), fn($v) => $v !== ''));
        }

        return [
            'start' => $_GET['start'] ?? null,
            'end' => $_GET['end'] ?? null,
            'type' => $_GET['type'] ?? null,
            'entry_type' => $_GET['entry_type'] ?? null,
            'q' => $_GET['q'] ?? null,
            'categories' => $categories,
            'category_id' => $_GET['category_id'] ?? null,
            'account_id' => $_GET['account_id'] ?? null,
            'account' => $_GET['account'] ?? null,
            'no_account' => $_GET['no_account'] ?? null,
        ];
    }

    /**
     * @param array<int, object> $entries
     * @return array<int, array<string, mixed>>
     */
    private function entriesPayloadFromEntries(int $uid, array $entries): array
    {
        $closed = array_filter($this->lockService()->listClosed(), fn($lock) => (int)($lock['user_id'] ?? 0) === $uid && !empty($lock['closed']));
        $closedMonths = array_map(fn($lock) => (string)($lock['month'] ?? ''), $closed);

        return array_map(function ($entry) use ($closedMonths) {
            $arr = $entry->toArray();
            $month = substr((string)($arr['date'] ?? ''), 0, 7);
            $locked = in_array($month, $closedMonths, true);
            $arr['can_delete'] = true;
            $arr['locked'] = $locked;
            if (!empty($arr['deleted_at'])) {
                if (($arr['deleted_type'] ?? '') === 'rejected') {
                    $arr['status'] = 'rejected';
                } else {
                    $arr['status'] = ($arr['deleted_type'] ?? '') === 'hard' ? 'deleted_hard' : 'deleted_soft';
                }
            } else {
                $arr['status'] = !empty($arr['needs_review']) ? 'pending' : ($locked ? 'locked' : 'open');
            }
            unset($arr['deleted_at'], $arr['deleted_type']);
            return $arr;
        }, $entries);
    }

    private function notificationService(): AdminNotificationService
    {
        return new AdminNotificationService($this->db());
    }

    private function sessionProfilePayload(int $uid): array
    {
        $user = $this->userRepo()->findById($uid);
        if (!$user) {
            return [
                'id' => 0,
                'name' => '',
                'email' => '',
                'role' => '',
                'alterdata_code' => '',
                'impersonation' => ['active' => false],
            ];
        }

        $impersonation = ['active' => false];
        $impBy = isset($this->authPayload['imp_by']) ? (int)$this->authPayload['imp_by'] : 0;
        if ($impBy > 0) {
            $adminUser = $this->userRepo()->findById($impBy);
            $impersonation = [
                'active' => true,
                'admin' => [
                    'id' => $impBy,
                    'name' => $adminUser ? $adminUser->name : '',
                    'email' => $adminUser ? $adminUser->email : '',
                ],
            ];
        }

        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'alterdata_code' => $user->alterdataCode,
            'impersonation' => $impersonation,
        ];
    }
}
