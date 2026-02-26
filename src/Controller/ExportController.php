<?php
declare(strict_types=1);

namespace App\Controller;

use App\Repository\Sqlite\SqliteCategoryRepository;
use App\Repository\Sqlite\SqliteEntryRepository;
use App\Repository\Sqlite\SqliteUserCategoryRepository;
use App\Repository\Sqlite\SqliteUserRepository;
use App\Service\AlterdataExportService;
use App\Service\AdminActivityLogService;
use App\Service\ExportService;
use App\Service\MonthLockService;
use App\Util\Response;

class ExportController extends BaseController
{
    public function pdf(): void
    {
        $uid = $this->requireAuth();
        $month = $_GET['month'] ?? '';
        [$startDate, $endDate] = $this->normalizeRange($_GET['start'] ?? null, $_GET['end'] ?? null);
        if ($startDate || $endDate) {
            $month = '';
        }
        $type = $_GET['type'] ?? 'all';
        $service = new ExportService($this->entryRepo());
        $filters = ['month' => $month, 'type' => $type];
        if ($startDate) $filters['start'] = $startDate;
        if ($endDate) $filters['end'] = $endDate;
        $pdf = $service->pdfReport($uid, $filters);
        Response::pdf($pdf, 'relatorio-caixa.pdf');
    }

    public function alterdata(): void
    {
        $adminId = $this->requireAdmin();
        $month = $_GET['month'] ?? '';
        if (!preg_match('/^\d{4}-\d{2}$/', $month)) {
            Response::json(['error' => 'Informe um mês válido para exportação.', 'error_code' => 'invalid_month'], 422);
        }
        $type = $_GET['type'] ?? 'all';
        $userIds = [];
        if (isset($_GET['user_ids'])) {
            $raw = $_GET['user_ids'];
            if (is_array($raw)) {
                foreach ($raw as $value) {
                    $id = (int)$value;
                    if ($id > 0) $userIds[] = $id;
                }
            } elseif (is_string($raw)) {
                foreach (explode(',', $raw) as $value) {
                    $id = (int)trim($value);
                    if ($id > 0) $userIds[] = $id;
                }
            }
        } elseif (isset($_GET['user_id'])) {
            $id = (int)$_GET['user_id'];
            if ($id > 0) $userIds[] = $id;
        }
        $userIds = array_values(array_unique($userIds));

        // Exportação mensal só pode ocorrer para competência fechada e sem pendências.
        $monthEntries = $this->entryRepo()->listAll([
            'month' => $month,
            'include_deleted' => true,
        ]);
        $selectedMap = $userIds ? array_flip($userIds) : null;
        $scopedEntries = array_values(array_filter($monthEntries, static function ($entry) use ($selectedMap): bool {
            if (!empty($entry->deletedAt)) {
                return false;
            }
            if ($selectedMap !== null && !isset($selectedMap[(int)$entry->userId])) {
                return false;
            }
            return true;
        }));

        $targetUserIds = [];
        foreach ($scopedEntries as $entry) {
            $uid = (int)$entry->userId;
            if ($uid > 0) {
                $targetUserIds[$uid] = true;
            }
        }
        $targetUserIds = array_values(array_map('intval', array_keys($targetUserIds)));

        if ($targetUserIds) {
            $usersById = [];
            foreach ($this->userRepo()->listAll() as $user) {
                $usersById[(int)$user->id] = $user;
            }

            $pendingByUser = [];
            foreach ($scopedEntries as $entry) {
                if (empty($entry->needsReview)) {
                    continue;
                }
                $uid = (int)$entry->userId;
                $pendingByUser[$uid] = (int)($pendingByUser[$uid] ?? 0) + 1;
            }
            if ($pendingByUser) {
                $labels = [];
                foreach ($pendingByUser as $uid => $qty) {
                    $user = $usersById[$uid] ?? null;
                    $name = trim((string)($user?->name ?? $user?->email ?? ('Usuário #' . $uid)));
                    $labels[] = $name . ' (' . $qty . ')';
                }
                Response::json([
                    'error' => 'Existem pendências no mês selecionado. Aprove/reprove os lançamentos pendentes antes de fechar/exportar.',
                    'error_code' => 'month_has_pending_entries',
                    'month' => $month,
                    'user_ids' => $targetUserIds,
                    'pending_users' => $labels,
                    'pending_count' => array_sum($pendingByUser),
                ], 422);
            }

            $notClosed = [];
            $lockService = $this->lockService();
            foreach ($targetUserIds as $uid) {
                if (!$lockService->isClosedForUser($month, $uid)) {
                    $notClosed[] = $uid;
                }
            }
            if ($notClosed) {
                $labels = [];
                foreach ($notClosed as $uid) {
                    $user = $usersById[$uid] ?? null;
                    $labels[] = trim((string)($user?->name ?? $user?->email ?? ('Usuário #' . $uid)));
                }
                Response::json([
                    'error' => 'Mês não fechado para os usuários selecionados. Faça o fechamento antes de exportar.',
                    'error_code' => 'month_not_closed',
                    'month' => $month,
                    'user_ids' => $notClosed,
                    'users' => $labels,
                ], 422);
            }
        }

        $service = new AlterdataExportService($this->entryRepo(), $this->userRepo(), $this->categoryRepo(), $this->userCategoryRepo());
        $result = $service->exportResult([
            'month' => $month,
            'type' => $type,
            'user_ids' => $userIds,
        ]);
        $txt = (string)($result['text'] ?? '');
        $admin = $this->userRepo()->findById($adminId);
        (new AdminActivityLogService($this->db()))->record([
            'action' => 'export_alterdata',
            'month' => $month,
            'actor_user_id' => $adminId,
            'actor_name' => $admin ? $admin->name : '',
            'actor_email' => $admin ? $admin->email : '',
            'users_affected' => (int)($result['users_affected'] ?? 0),
            'records_affected' => (int)($result['records_exported'] ?? 0),
            'payload' => [
                'type' => $type,
                'all_users' => count($userIds) === 0,
                'user_ids' => $userIds,
            ],
        ]);
        $suffix = $month ? ('-' . $month) : '';
        Response::text($txt, 'alterdata' . $suffix . '.txt');
    }

    private function entryRepo()
    {
        return new SqliteEntryRepository($this->db());
    }

    protected function userRepo()
    {
        return new SqliteUserRepository($this->db());
    }

    private function categoryRepo()
    {
        return new SqliteCategoryRepository($this->db());
    }

    private function userCategoryRepo()
    {
        return new SqliteUserCategoryRepository($this->db());
    }

    private function lockService(): MonthLockService
    {
        return new MonthLockService($this->db());
    }

    private function normalizeRange(?string $start, ?string $end): array
    {
        $startDate = $this->normalizeDate($start, true);
        $endDate = $this->normalizeDate($end, false);
        if ($startDate && $endDate && $startDate > $endDate) {
            $tmp = $startDate;
            $startDate = $endDate;
            $endDate = $tmp;
        }
        return [$startDate, $endDate];
    }

    private function normalizeDate(?string $value, bool $isStart): ?string
    {
        $value = trim((string)$value);
        if ($value === '') return null;
        if (preg_match('/^\\d{4}-\\d{2}$/', $value)) {
            return $value . ($isStart ? '-01' : '-31');
        }
        if (preg_match('/^\\d{4}-\\d{2}-\\d{2}$/', $value)) {
            return $value;
        }
        return null;
    }
}
