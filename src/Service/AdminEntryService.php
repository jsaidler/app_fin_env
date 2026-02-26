<?php
declare(strict_types=1);

namespace App\Service;

use App\Repository\EntryRepositoryInterface;
use App\Repository\UserAccountRepositoryInterface;
use App\Repository\UserRepositoryInterface;
use App\Util\Response;
use App\Util\Validator;
use App\Service\MonthLockService;

class AdminEntryService
{
    private EntryRepositoryInterface $entries;
    private UserRepositoryInterface $users;
    private UserAccountRepositoryInterface $accounts;
    private ?MonthLockService $locks;
    private ?string $uploadDir;

    public function __construct(
        EntryRepositoryInterface $entries,
        UserRepositoryInterface $users,
        UserAccountRepositoryInterface $accounts,
        ?MonthLockService $locks = null,
        ?string $uploadDir = null
    )
    {
        $this->entries = $entries;
        $this->users = $users;
        $this->accounts = $accounts;
        $this->locks = $locks;
        $this->uploadDir = $uploadDir;
    }

    public function list(array $filters = []): array
    {
        $filters['include_deleted'] = true;
        $items = $this->entries->listAll($filters);
        return array_map(function ($e) {
            $arr = $e->toArray();
            $month = substr($arr['date'], 0, 7);
            $isLocked = $this->locks ? $this->locks->isClosedForUser($month, (int)$arr['user_id']) : false;
            $arr['locked'] = $isLocked;
            $arr['soft_deleted'] = !empty($arr['deleted_at']);
            $arr['needs_review'] = !empty($arr['needs_review']);
            $arr['pending_review'] = $arr['needs_review'];
            return $arr;
        }, $items);
    }

    public function update(int $id, array $input): array
    {
        $entry = $this->entries->findById($id);
        if (!$entry) {
            Response::json(['error' => 'Lancamento nao encontrado'], 404);
        }
        $userId = (int)($input['user_id'] ?? $entry->userId);
        $user = $this->users->findById($userId);
        if (!$user) {
            Response::json(['error' => 'Usuario invalido'], 422);
        }
        $merged = array_merge($entry->toArray(), $input);
        $this->assertValid($merged, $userId);
        if (array_key_exists('attachment_path', $input)) {
            $this->assertAttachmentOwner($input['attachment_path'], $userId);
        }
        $merged['account_id'] = $this->normalizeAccountId($merged['account_id'] ?? null, $userId);
        $merged['needs_review'] = 0;
        $merged['reviewed_at'] = date('c');
        $merged['valid_amount'] = null;
        if (!empty($input['admin_user_id'])) {
            $merged['last_modified_by_user_id'] = (int)$input['admin_user_id'];
        }
        $updated = $this->entries->updateAdmin($id, $merged);
        return $updated?->toArray() ?? [];
    }

    public function create(array $input): array
    {
        $userId = (int)($input['user_id'] ?? 0);
        if ($userId <= 0) {
            Response::json(['error' => 'Usuario invalido'], 422);
        }
        $user = $this->users->findById($userId);
        if (!$user) {
            Response::json(['error' => 'Usuario invalido'], 422);
        }
        $this->assertValid($input, $userId);
        if (array_key_exists('attachment_path', $input)) {
            $this->assertAttachmentOwner($input['attachment_path'], $userId);
        }
        $input['account_id'] = $this->normalizeAccountId($input['account_id'] ?? null, $userId);
        $input['needs_review'] = 0;
        $input['reviewed_at'] = date('c');
        $input['valid_amount'] = null;
        if (!empty($input['admin_user_id'])) {
            $input['last_modified_by_user_id'] = (int)$input['admin_user_id'];
        }
        $entry = $this->entries->create($userId, $input);
        return $entry->toArray();
    }

    public function delete(int $id, ?int $adminUserId = null): array
    {
        $entry = $this->entries->findById($id);
        if (!$entry) {
            Response::json(['error' => 'Lancamento nao encontrado'], 404);
        }
        $month = substr($entry->date, 0, 7);
        $isClosed = $this->locks && $this->locks->isClosedForUser($month, $entry->userId);
        $hard = !$isClosed;
        // Admin mantém lixeira compartilhada: registros fechados ficam como soft delete
        $payload = $entry->toArray();
        $payload['deleted_at'] = date('c');
        $payload['deleted_type'] = $hard ? 'hard' : 'soft';
        if ($adminUserId && $adminUserId > 0) {
            $payload['last_modified_by_user_id'] = $adminUserId;
        }
        $updated = $this->entries->updateAdmin($id, $payload);
        $ok = (bool)$updated;
        if ($ok && !$hard) {
            $this->entries->setReviewStatus($id, false, date('c'));
        }
        return ['deleted' => true, 'soft' => $isClosed];
    }

    public function approve(int $id, ?int $adminUserId = null): bool
    {
        $entry = $this->entries->findById($id);
        if (!$entry) {
            Response::json(['error' => 'Lancamento nao encontrado'], 404);
        }
        if ($adminUserId && $adminUserId > 0) {
            $payload = $entry->toArray();
            $payload['needs_review'] = 0;
            $payload['reviewed_at'] = date('c');
            $payload['valid_amount'] = null;
            $payload['last_modified_by_user_id'] = $adminUserId;
            return (bool)$this->entries->updateAdmin($id, $payload);
        }
        return $this->entries->setReviewStatus($id, false, date('c'));
    }

    public function reject(int $id, ?int $adminUserId = null): array
    {
        $entry = $this->entries->findById($id);
        if (!$entry) {
            Response::json(['error' => 'Lancamento nao encontrado'], 404);
        }
        $payload = $entry->toArray();
        $payload['needs_review'] = 0;
        $payload['reviewed_at'] = date('c');
        $payload['valid_amount'] = null;
        if ($entry->deletedAt) {
            $payload['deleted_at'] = null;
            $payload['deleted_type'] = null;
        } else {
            $payload['deleted_at'] = date('c');
            $payload['deleted_type'] = 'rejected';
        }
        if ($adminUserId && $adminUserId > 0) {
            $payload['last_modified_by_user_id'] = $adminUserId;
        }
        $updated = $this->entries->update($id, $entry->userId, $payload);
        return $updated?->toArray() ?? [];
    }

    private function assertValid(array $input, int $userId): void
    {
        if (!in_array($input['type'] ?? '', ['in', 'out'], true)) {
            Response::json(['error' => 'Tipo invalido'], 422);
        }
        if (!Validator::positiveNumber($input['amount'] ?? null)) {
            Response::json(['error' => 'Valor invalido'], 422);
        }
        if (!Validator::nonEmpty($input['category'] ?? '')) {
            Response::json(['error' => 'Categoria obrigatoria'], 422);
        }
        $this->normalizeAccountId($input['account_id'] ?? null, $userId);
        if (!Validator::date($input['date'] ?? '')) {
            Response::json(['error' => 'Data invalida'], 422);
        }
    }

    private function normalizeAccountId($value, int $userId): ?int
    {
        if ($value === null || $value === '') {
            return null;
        }
        $accountId = (int)$value;
        if ($accountId <= 0) {
            return null;
        }
        $account = $this->accounts->findForUser($accountId, $userId);
        if (!$account || !$account->active) {
            Response::json(['error' => 'Conta/cartao invalido'], 422);
        }
        return $accountId;
    }

    private function deleteAttachment(?string $file): void
    {
        $relative = ltrim((string)$file, DIRECTORY_SEPARATOR . '/');
        if (!$relative) return;
        $baseUpload = $this->uploadDir ? rtrim($this->uploadDir, DIRECTORY_SEPARATOR . '/') : null;
        $bases = array_filter([
            $baseUpload,
            sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'caixa-uploads',
            dirname(__DIR__, 2) . DIRECTORY_SEPARATOR . 'public' . DIRECTORY_SEPARATOR . 'uploads',
        ]);
        $bases = array_unique($bases);
        $candidates = [];
        foreach ($bases as $base) {
            $candidates[] = $base . DIRECTORY_SEPARATOR . $relative;
            if (!str_contains($relative, '/uploads/')) {
                $parts = explode('/', $relative, 2);
                if (count($parts) === 2) {
                    $candidates[] = $base . DIRECTORY_SEPARATOR . $parts[0] . DIRECTORY_SEPARATOR . 'uploads' . DIRECTORY_SEPARATOR . $parts[1];
                }
            }
        }
        foreach ($candidates as $target) {
            if (is_file($target)) {
                @unlink($target);
                return;
            }
        }
    }

    private function assertAttachmentOwner(?string $path, int $userId): void
    {
        $path = trim((string)$path);
        if ($path === '') {
            return;
        }
        $rel = ltrim(str_replace('\\', '/', $path), '/');
        $prefix = $userId . '/';
        if (!str_starts_with($rel, $prefix) || !str_contains($rel, '/uploads/')) {
            Response::json(['error' => 'Anexo invalido'], 422);
        }
        $base = $this->uploadDir ? rtrim($this->uploadDir, '/\\') : null;
        if (!$base) {
            Response::json(['error' => 'Upload indisponivel'], 422);
        }
        $target = $base . '/' . $rel;
        if (!is_file($target)) {
            Response::json(['error' => 'Anexo invalido'], 422);
        }
    }
}
