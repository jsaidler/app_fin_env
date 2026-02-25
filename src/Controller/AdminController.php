<?php
declare(strict_types=1);

namespace App\Controller;

use App\Repository\Sqlite\SqliteCategoryRepository;
use App\Repository\Sqlite\SqliteEntryRepository;
use App\Repository\Sqlite\SqliteUserAccountRepository;
use App\Repository\Sqlite\SqliteUserRepository;
use App\Service\AdminEntryService;
use App\Service\AdminService;
use App\Service\AdminNotificationService;
use App\Service\CategoryService;
use App\Service\MonthLockService;
use App\Service\ReportService;
use App\Service\SupportService;
use App\Util\Response;

class AdminController extends BaseController
{
    public function users(): void
    {
        $this->requireAdmin();
        $service = new AdminService($this->userRepo(), $this->entryRepo(), $this->lockService(), $this->config['paths']['uploads'] ?? null);
        Response::json($service->listUsers());
    }

    public function createUser(): void
    {
        $this->requireAdmin();
        $service = new AdminService($this->userRepo(), $this->entryRepo(), $this->lockService(), $this->config['paths']['uploads'] ?? null);
        $user = $service->createUser($this->jsonInput());
        Response::json($user, 201);
    }

    public function updateUser(array $params): void
    {
        $this->requireAdmin();
        $id = (int)($params['id'] ?? 0);
        $service = new AdminService($this->userRepo(), $this->entryRepo(), $this->lockService(), $this->config['paths']['uploads'] ?? null);
        $user = $service->updateUser($id, $this->jsonInput());
        Response::json($user);
    }

    public function deleteUser(array $params): void
    {
        $this->requireAdmin();
        $id = (int)($params['id'] ?? 0);
        $service = new AdminService($this->userRepo(), $this->entryRepo(), $this->lockService(), $this->config['paths']['uploads'] ?? null);
        $result = $service->deleteUser($id);
        Response::json($result);
    }

    public function categories(): void
    {
        $this->requireAdmin();
        $service = new CategoryService($this->categoryRepo());
        Response::json($service->list());
    }

    public function createCategory(): void
    {
        $this->requireAdmin();
        $service = new CategoryService($this->categoryRepo());
        $cat = $service->create($this->jsonInput());
        Response::json($cat, 201);
    }

    public function updateCategory(array $params): void
    {
        $this->requireAdmin();
        $id = (int)($params['id'] ?? 0);
        $service = new CategoryService($this->categoryRepo());
        $cat = $service->update($id, $this->jsonInput());
        Response::json($cat);
    }

    public function deleteCategory(array $params): void
    {
        $this->requireAdmin();
        $id = (int)($params['id'] ?? 0);
        $service = new CategoryService($this->categoryRepo());
        $cat = $service->delete($id);
        Response::json($cat);
    }

    public function adminEntries(): void
    {
        $this->requireAdmin();
        [$startDate, $endDate] = $this->normalizeRange($_GET['start'] ?? null, $_GET['end'] ?? null);
        $filters = [
            'user_id' => isset($_GET['user_id']) ? (int)$_GET['user_id'] : null,
            'type' => $_GET['type'] ?? null,
            'month' => $_GET['month'] ?? null,
            'start' => $startDate,
            'end' => $endDate,
            'needs_review' => isset($_GET['needs_review']) ? (int)$_GET['needs_review'] === 1 : null,
        ];
        $filters = array_filter($filters, fn($v) => $v !== null && $v !== '');
        $service = new AdminEntryService($this->entryRepo(), $this->userRepo(), $this->accountRepo(), $this->lockService(), $this->config['paths']['uploads'] ?? null);
        $data = $service->list($filters);
        Response::json($data);
    }

    public function createAdminEntry(): void
    {
        $this->requireAdmin();
        $service = new AdminEntryService($this->entryRepo(), $this->userRepo(), $this->accountRepo(), $this->lockService(), $this->config['paths']['uploads'] ?? null);
        $entry = $service->create($this->jsonInput());
        Response::json($entry, 201);
    }

    public function updateAdminEntry(array $params): void
    {
        $this->requireAdmin();
        $id = (int)($params['id'] ?? 0);
        $service = new AdminEntryService($this->entryRepo(), $this->userRepo(), $this->accountRepo(), $this->lockService(), $this->config['paths']['uploads'] ?? null);
        $entry = $service->update($id, $this->jsonInput());
        Response::json($entry);
    }

    public function deleteAdminEntry(array $params): void
    {
        $this->requireAdmin();
        $id = (int)($params['id'] ?? 0);
        $service = new AdminEntryService($this->entryRepo(), $this->userRepo(), $this->accountRepo(), $this->lockService(), $this->config['paths']['uploads'] ?? null);
        $res = $service->delete($id);
        Response::json($res);
    }

    public function approveAdminEntry(array $params): void
    {
        $this->requireAdmin();
        $id = (int)($params['id'] ?? 0);
        if ($id <= 0) {
            Response::json(['error' => 'Lancamento invalido'], 422);
        }
        $service = new AdminEntryService($this->entryRepo(), $this->userRepo(), $this->accountRepo(), $this->lockService(), $this->config['paths']['uploads'] ?? null);
        $ok = $service->approve($id);
        (new AdminNotificationService($this->db()))->markReadByEntry($id);
        Response::json(['approved' => $ok]);
    }

    public function rejectAdminEntry(array $params): void
    {
        $this->requireAdmin();
        $id = (int)($params['id'] ?? 0);
        if ($id <= 0) {
            Response::json(['error' => 'Lancamento invalido'], 422);
        }
        $service = new AdminEntryService($this->entryRepo(), $this->userRepo(), $this->accountRepo(), $this->lockService(), $this->config['paths']['uploads'] ?? null);
        $entry = $service->reject($id);
        (new AdminNotificationService($this->db()))->markReadByEntry($id);
        Response::json(['rejected' => true, 'entry' => $entry]);
    }

    public function closeMonth(): void
    {
        $this->requireAdmin();
        $input = $this->jsonInput();
        $month = $input['month'] ?? '';
        $closed = (bool)($input['closed'] ?? true);
        $userIds = $input['user_ids'] ?? [];
        $service = new AdminService($this->userRepo(), $this->entryRepo(), $this->lockService(), $this->config['paths']['uploads'] ?? null);
        $result = $service->closeMonth($month, $userIds, $closed);
        Response::json($result);
    }

    public function closedMonths(): void
    {
        $uid = $this->requireAuth();
        $role = $this->authPayload['role'] ?? 'user';
        $locks = $this->lockService();
        $list = $locks->listClosed();
        if ($role !== 'admin') {
            $list = array_values(array_filter($list, fn($l) => $l['user_id'] === $uid));
        }
        Response::json(['closed_months' => $list]);
    }

    public function notifications(): void
    {
        $this->requireAdmin();
        $service = new AdminNotificationService($this->db());
        $list = $service->listUnread();
        Response::json(['notifications' => $list]);
    }

    public function markNotificationRead(array $params): void
    {
        $this->requireAdmin();
        $id = (int)($params['id'] ?? 0);
        if ($id <= 0) {
            Response::json(['error' => 'Notificacao invalida'], 422);
        }
        $service = new AdminNotificationService($this->db());
        $ok = $service->markRead($id);
        if (!$ok) {
            Response::json(['error' => 'Notificacao nao encontrada'], 404);
        }
        Response::json(['ok' => true]);
    }

    public function closureReport(): void
    {
        $this->requireAdmin();
        $month = trim((string)($_GET['month'] ?? ''));
        $userId = isset($_GET['user_id']) ? (int)$_GET['user_id'] : 0;
        if ($userId <= 0 || !preg_match('/^\\d{4}-\\d{2}$/', $month)) {
            Response::json(['error' => 'Parametros invalidos'], 422);
        }
        $user = $this->userRepo()->findById($userId);
        if (!$user || $user->role === 'admin') {
            Response::json(['error' => 'Usuario invalido'], 422);
        }
        $service = new ReportService($this->entryRepo());
        $report = $service->monthClosure($userId, $month);
        $lock = $this->lockService()->getLockForUser($month, $userId);
        $closed = $lock ? (bool)$lock['closed'] : false;
        $report['closed'] = $closed;
        $report['closed_at'] = $lock['updated_at'] ?? null;
        $report['user'] = [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
        ];
        Response::json($report);
    }

    public function supportThreads(): void
    {
        $this->requireAdmin();
        $service = new SupportService($this->db());
        Response::json(['threads' => $service->listThreads()]);
    }

    public function createSupportThread(): void
    {
        $this->requireAdmin();
        $input = $this->jsonInput();
        $userId = (int)($input['user_id'] ?? 0);
        $entryId = isset($input['entry_id']) ? (int)$input['entry_id'] : null;
        $subject = trim((string)($input['subject'] ?? ''));
        if ($userId <= 0) {
            Response::json(['error' => 'Usuario invalido'], 422);
        }
        $user = $this->userRepo()->findById($userId);
        if (!$user || $user->role === 'admin') {
            Response::json(['error' => 'Usuario invalido'], 422);
        }
        if ($entryId) {
            $entry = $this->entryRepo()->findById($entryId);
            if (!$entry || $entry->userId !== $userId) {
                Response::json(['error' => 'Lancamento invalido'], 422);
            }
            if ($subject === '') {
                $subject = 'Lancamento #' . $entryId;
            }
        }
        if ($subject === '') {
            Response::json(['error' => 'Assunto obrigatorio'], 422);
        }
        $service = new SupportService($this->db());
        $thread = $service->createThread($userId, $subject, 'admin', $entryId ?: null);
        Response::json($thread, 201);
    }

    public function supportMessages(): void
    {
        $this->requireAdmin();
        $threadId = isset($_GET['thread_id']) ? (int)$_GET['thread_id'] : 0;
        if ($threadId <= 0) {
            Response::json(['error' => 'Atendimento invalido'], 422);
        }
        $service = new SupportService($this->db());
        $thread = $service->findThread($threadId);
        if (!$thread) {
            Response::json(['error' => 'Atendimento invalido'], 404);
        }
        $messages = $service->listMessages($threadId, 'user');
        Response::json(['messages' => $messages]);
    }

    public function sendSupportMessage(): void
    {
        $this->requireAdmin();
        $input = $this->jsonInput();
        $threadId = (int)($input['thread_id'] ?? 0);
        $message = trim((string)($input['message'] ?? ''));
        $attachment = trim((string)($input['attachment_path'] ?? ''));
        if ($threadId <= 0 || ($message === '' && $attachment === '')) {
            Response::json(['error' => 'Dados invalidos'], 422);
        }
        $service = new SupportService($this->db());
        $thread = $service->findThread($threadId);
        if (!$thread) {
            Response::json(['error' => 'Atendimento invalido'], 404);
        }
        if ($attachment && !str_starts_with($attachment, $thread['user_id'] . '/')) {
            Response::json(['error' => 'Anexo invalido'], 422);
        }
        $created = $service->sendMessage($threadId, (int)$thread['user_id'], 'admin', $message, $attachment ?: null);
        Response::json($created, 201);
    }

    protected function userRepo()
    {
        return new SqliteUserRepository($this->db());
    }

    protected function entryRepo()
    {
        return new SqliteEntryRepository($this->db());
    }

    protected function categoryRepo()
    {
        return new SqliteCategoryRepository($this->db());
    }

    protected function accountRepo()
    {
        return new SqliteUserAccountRepository($this->db());
    }

    protected function lockService(): MonthLockService
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
