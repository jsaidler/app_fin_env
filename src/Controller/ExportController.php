<?php
declare(strict_types=1);

namespace App\Controller;

use App\Repository\Sqlite\SqliteCategoryRepository;
use App\Repository\Sqlite\SqliteEntryRepository;
use App\Repository\Sqlite\SqliteUserRepository;
use App\Service\AlterdataExportService;
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
        $this->requireAdmin();
        $month = $_GET['month'] ?? '';
        $type = $_GET['type'] ?? 'all';
        $userId = isset($_GET['user_id']) ? (int)$_GET['user_id'] : null;
        $service = new AlterdataExportService($this->entryRepo(), $this->userRepo(), $this->categoryRepo());
        $txt = $service->exportText([
            'month' => $month,
            'type' => $type,
            'user_id' => $userId,
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
