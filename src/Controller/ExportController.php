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

    private function userRepo()
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
