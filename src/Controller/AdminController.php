<?php
declare(strict_types=1);

namespace App\Controller;

use App\Repository\Sqlite\SqliteCategoryRepository;
use App\Repository\Sqlite\SqliteEntryRepository;
use App\Repository\Sqlite\SqliteUserAccountRepository;
use App\Repository\Sqlite\SqliteUserRepository;
use App\Service\AdminEntryService;
use App\Service\AdminActivityLogService;
use App\Service\AdminService;
use App\Service\AdminNotificationService;
use App\Service\CategoryService;
use App\Service\MonthLockService;
use App\Service\ReportService;
use App\Service\SupportService;
use App\Util\Response;
use App\Util\Token;

class AdminController extends BaseController
{
    public function users(): void
    {
        $this->requireAdmin();
        $service = new AdminService($this->userRepo(), $this->entryRepo(), $this->lockService(), $this->config['paths']['uploads'] ?? null);
        $rows = $service->listUsers();
        $pendingsByUser = $this->buildUsersPendingMap(array_map(static fn(array $row): int => (int)($row['id'] ?? 0), $rows));
        foreach ($rows as &$row) {
            $uid = (int)($row['id'] ?? 0);
            $pending = $pendingsByUser[$uid] ?? [
                'close' => ['has_pending' => false, 'count' => 0],
                'export' => ['has_pending' => false, 'count' => 0],
            ];
            $row['pending'] = $pending;
            $row['has_pending_close'] = (bool)($pending['close']['has_pending'] ?? false);
            $row['has_pending_export'] = (bool)($pending['export']['has_pending'] ?? false);
            $row['has_pending_any'] = $row['has_pending_close'] || $row['has_pending_export'];
        }
        unset($row);
        Response::json($rows);
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
        $adminId = $this->requireAdmin();
        $service = new CategoryService($this->categoryRepo());
        $cat = $service->create($this->jsonInput(), $adminId);
        Response::json($cat, 201);
    }

    public function updateCategory(array $params): void
    {
        $adminId = $this->requireAdmin();
        $id = (int)($params['id'] ?? 0);
        $service = new CategoryService($this->categoryRepo());
        $cat = $service->update($id, $this->jsonInput(), $adminId);
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

    public function categoryStats(array $params): void
    {
        $this->requireAdmin();
        $id = (int)($params['id'] ?? 0);
        if ($id <= 0) {
            Response::json(['error' => 'Categoria invalida'], 422);
        }
        $category = $this->categoryRepo()->find($id);
        if (!$category) {
            Response::json(['error' => 'Categoria nao encontrada'], 404);
        }
        $pdo = $this->db();

        $childStmt = $pdo->prepare('SELECT COUNT(*) FROM user_categories WHERE global_category_id = :id');
        $childStmt->execute(['id' => $id]);
        $childCount = (int)($childStmt->fetchColumn() ?: 0);

        $entryStmt = $pdo->prepare(
            'SELECT COUNT(*)
               FROM entries e
               JOIN user_categories uc ON uc.user_id = e.user_id AND uc.name = e.category
              WHERE uc.global_category_id = :id
                AND e.deleted_at IS NULL'
        );
        $entryStmt->execute(['id' => $id]);
        $entriesCount = (int)($entryStmt->fetchColumn() ?: 0);

        $recStmt = $pdo->prepare(
            'SELECT COUNT(*)
               FROM recurrences r
               JOIN user_categories uc ON uc.user_id = r.user_id AND uc.name = r.category
              WHERE uc.global_category_id = :id
                AND r.active = 1'
        );
        $recStmt->execute(['id' => $id]);
        $recurrencesCount = (int)($recStmt->fetchColumn() ?: 0);

        $userStmt = $pdo->prepare('SELECT COUNT(DISTINCT user_id) FROM user_categories WHERE global_category_id = :id');
        $userStmt->execute(['id' => $id]);
        $usersCount = (int)($userStmt->fetchColumn() ?: 0);

        Response::json([
            'id' => $id,
            'name' => $category->name,
            'type' => $category->type,
            'child_categories' => $childCount,
            'entries' => $entriesCount,
            'recurrences' => $recurrencesCount,
            'users' => $usersCount,
        ]);
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
        $adminId = $this->requireAdmin();
        $service = new AdminEntryService($this->entryRepo(), $this->userRepo(), $this->accountRepo(), $this->lockService(), $this->config['paths']['uploads'] ?? null);
        $input = $this->jsonInput();
        $input['admin_user_id'] = $adminId;
        $entry = $service->create($input);
        Response::json($entry, 201);
    }

    public function updateAdminEntry(array $params): void
    {
        $adminId = $this->requireAdmin();
        $id = (int)($params['id'] ?? 0);
        $service = new AdminEntryService($this->entryRepo(), $this->userRepo(), $this->accountRepo(), $this->lockService(), $this->config['paths']['uploads'] ?? null);
        $input = $this->jsonInput();
        $input['admin_user_id'] = $adminId;
        $entry = $service->update($id, $input);
        Response::json($entry);
    }

    public function deleteAdminEntry(array $params): void
    {
        $adminId = $this->requireAdmin();
        $id = (int)($params['id'] ?? 0);
        $service = new AdminEntryService($this->entryRepo(), $this->userRepo(), $this->accountRepo(), $this->lockService(), $this->config['paths']['uploads'] ?? null);
        $res = $service->delete($id, $adminId);
        Response::json($res);
    }

    public function approveAdminEntry(array $params): void
    {
        $adminId = $this->requireAdmin();
        $id = (int)($params['id'] ?? 0);
        if ($id <= 0) {
            Response::json(['error' => 'Lancamento invalido'], 422);
        }
        $service = new AdminEntryService($this->entryRepo(), $this->userRepo(), $this->accountRepo(), $this->lockService(), $this->config['paths']['uploads'] ?? null);
        $ok = $service->approve($id, $adminId);
        (new AdminNotificationService($this->db()))->markReadByEntry($id);
        Response::json(['approved' => $ok]);
    }

    public function rejectAdminEntry(array $params): void
    {
        $adminId = $this->requireAdmin();
        $id = (int)($params['id'] ?? 0);
        if ($id <= 0) {
            Response::json(['error' => 'Lancamento invalido'], 422);
        }
        $service = new AdminEntryService($this->entryRepo(), $this->userRepo(), $this->accountRepo(), $this->lockService(), $this->config['paths']['uploads'] ?? null);
        $entry = $service->reject($id, $adminId);
        (new AdminNotificationService($this->db()))->markReadByEntry($id);
        Response::json(['rejected' => true, 'entry' => $entry]);
    }

    public function closeMonth(): void
    {
        $adminId = $this->requireAdmin();
        $input = $this->jsonInput();
        $month = $input['month'] ?? '';
        $closed = (bool)($input['closed'] ?? true);
        $userIds = $input['user_ids'] ?? [];
        $allUsers = (bool)($input['all_users'] ?? false);
        if ($allUsers) {
            $userIds = array_values(array_map(
                fn($u) => (int)$u->id,
                $this->userRepo()->listAll()
            ));
        }
        $service = new AdminService($this->userRepo(), $this->entryRepo(), $this->lockService(), $this->config['paths']['uploads'] ?? null);
        $result = $service->closeMonth($month, $userIds, $closed);
        $admin = $this->userRepo()->findById($adminId);
        $summary = $result['summary'] ?? [];
        (new AdminActivityLogService($this->db()))->record([
            'action' => 'close_month',
            'month' => $month,
            'actor_user_id' => $adminId,
            'actor_name' => $admin ? $admin->name : '',
            'actor_email' => $admin ? $admin->email : '',
            'users_affected' => (int)($summary['users_affected'] ?? 0),
            'records_affected' => (int)($summary['records_affected'] ?? 0),
            'payload' => [
                'closed' => $closed,
                'all_users' => $allUsers,
                'user_ids' => array_values(array_map('intval', (array)$userIds)),
                'locks_updated' => (int)($summary['locks_updated'] ?? 0),
                'purged_entries' => (int)($summary['purged_entries'] ?? 0),
            ],
        ]);
        Response::json($result);
    }

    public function closeMonthHistory(): void
    {
        $this->requireAdmin();
        $list = (new AdminActivityLogService($this->db()))->listByAction('close_month', 30);
        Response::json(['items' => $list]);
    }

    public function exportAlterdataHistory(): void
    {
        $this->requireAdmin();
        $list = (new AdminActivityLogService($this->db()))->listByAction('export_alterdata', 30);
        Response::json(['items' => $list]);
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

    public function userStats(array $params): void
    {
        $this->requireAdmin();
        $id = (int)($params['id'] ?? 0);
        if ($id <= 0) {
            Response::json(['error' => 'Usuario invalido'], 422);
        }
        $user = $this->userRepo()->findById($id);
        if (!$user) {
            Response::json(['error' => 'Usuario nao encontrado'], 404);
        }

        $pdo = $this->db();
        $entriesStmt = $pdo->prepare('SELECT COUNT(*) FROM entries WHERE user_id = :uid AND deleted_at IS NULL');
        $entriesStmt->execute(['uid' => $id]);
        $entriesCount = (int)($entriesStmt->fetchColumn() ?: 0);

        $recStmt = $pdo->prepare('SELECT COUNT(*) FROM recurrences WHERE user_id = :uid AND active = 1');
        $recStmt->execute(['uid' => $id]);
        $recurrencesCount = (int)($recStmt->fetchColumn() ?: 0);

        $accStmt = $pdo->prepare('SELECT COUNT(*) FROM user_accounts WHERE user_id = :uid AND active = 1');
        $accStmt->execute(['uid' => $id]);
        $accountsCount = (int)($accStmt->fetchColumn() ?: 0);

        $catStmt = $pdo->prepare('SELECT COUNT(*) FROM user_categories WHERE user_id = :uid');
        $catStmt->execute(['uid' => $id]);
        $categoriesCount = (int)($catStmt->fetchColumn() ?: 0);

        $pendingStmt = $pdo->prepare('SELECT COUNT(*) FROM entries WHERE user_id = :uid AND needs_review = 1 AND deleted_at IS NULL');
        $pendingStmt->execute(['uid' => $id]);
        $pendingCount = (int)($pendingStmt->fetchColumn() ?: 0);

        Response::json([
            'id' => $id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'entries' => $entriesCount,
            'recurrences' => $recurrencesCount,
            'accounts' => $accountsCount,
            'categories' => $categoriesCount,
            'pending_review' => $pendingCount,
        ]);
    }

    public function impersonate(array $params): void
    {
        $adminId = $this->requireAdmin();
        $userId = (int)($params['id'] ?? 0);
        if ($userId <= 0) {
            Response::json(['error' => 'Usuario invalido'], 422);
        }
        $user = $this->userRepo()->findById($userId);
        if (!$user || $user->role === 'admin') {
            Response::json(['error' => 'Usuario invalido para personificacao'], 422);
        }
        $token = Token::issue([
            'uid' => $user->id,
            'role' => $user->role,
            'imp_by' => $adminId,
        ], (string)$this->config['secret'], (int)$this->config['token_ttl']);

        Response::json([
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
            ],
        ]);
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

    private function buildUsersPendingMap(array $userIds): array
    {
        $ids = array_values(array_unique(array_filter(array_map('intval', $userIds), static fn(int $id): bool => $id > 0)));
        if (!$ids) {
            return [];
        }
        $pdo = $this->db();
        $placeholders = implode(',', array_fill(0, count($ids), '?'));

        $closePending = [];
        $stmtClose = $pdo->prepare(
            "SELECT user_id, COUNT(*) AS qty
               FROM entries
              WHERE needs_review = 1
                AND deleted_at IS NULL
                AND user_id IN ($placeholders)
              GROUP BY user_id"
        );
        $stmtClose->execute($ids);
        foreach ($stmtClose->fetchAll() as $row) {
            $uid = (int)($row['user_id'] ?? 0);
            $closePending[$uid] = (int)($row['qty'] ?? 0);
        }

        $exportMissingCategory = [];
        $stmtExport = $pdo->prepare(
            "SELECT e.user_id AS user_id, COUNT(*) AS qty
               FROM entries e
          LEFT JOIN user_categories uc
                 ON uc.user_id = e.user_id
                AND lower(uc.name) = lower(e.category)
          LEFT JOIN categories c_global
                 ON c_global.id = uc.global_category_id
          LEFT JOIN categories c_direct
                 ON lower(c_direct.name) = lower(e.category)
              WHERE e.deleted_at IS NULL
                AND e.needs_review = 0
                AND e.user_id IN ($placeholders)
                AND COALESCE(NULLIF(c_global.alterdata_auto, ''), NULLIF(c_direct.alterdata_auto, '')) IS NULL
              GROUP BY e.user_id"
        );
        $stmtExport->execute($ids);
        foreach ($stmtExport->fetchAll() as $row) {
            $uid = (int)($row['user_id'] ?? 0);
            $exportMissingCategory[$uid] = (int)($row['qty'] ?? 0);
        }

        $hasExportableEntries = [];
        $stmtExportable = $pdo->prepare(
            "SELECT user_id, COUNT(*) AS qty
               FROM entries
              WHERE deleted_at IS NULL
                AND needs_review = 0
                AND user_id IN ($placeholders)
              GROUP BY user_id"
        );
        $stmtExportable->execute($ids);
        foreach ($stmtExportable->fetchAll() as $row) {
            $uid = (int)($row['user_id'] ?? 0);
            $hasExportableEntries[$uid] = (int)($row['qty'] ?? 0) > 0;
        }

        $users = [];
        foreach ($this->userRepo()->listAll() as $user) {
            $users[(int)$user->id] = $user;
        }

        $result = [];
        foreach ($ids as $uid) {
            $closeQty = (int)($closePending[$uid] ?? 0);
            $missingCategoryQty = (int)($exportMissingCategory[$uid] ?? 0);
            $hasExportable = (bool)($hasExportableEntries[$uid] ?? false);
            $missingAlterdata = $hasExportable && trim((string)($users[$uid]->alterdataCode ?? '')) === '';
            $exportQty = $missingCategoryQty + ($missingAlterdata ? 1 : 0);
            $result[$uid] = [
                'close' => [
                    'has_pending' => $closeQty > 0,
                    'count' => $closeQty,
                ],
                'export' => [
                    'has_pending' => $exportQty > 0,
                    'count' => $exportQty,
                ],
            ];
        }
        return $result;
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
