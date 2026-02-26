<?php
declare(strict_types=1);

namespace App\Service;

use App\Repository\EntryRepositoryInterface;
use App\Repository\UserAccountRepositoryInterface;
use App\Util\Response;
use App\Util\Validator;
use App\Service\MonthLockService;
use App\Service\AdminNotificationService;
use App\Domain\Entry;

class EntryService
{
    private EntryRepositoryInterface $entries;
    private UserAccountRepositoryInterface $accounts;
    private ?MonthLockService $locks;
    private ?string $uploadDir;
    private ?AdminNotificationService $notifications;

    public function __construct(
        EntryRepositoryInterface $entries,
        UserAccountRepositoryInterface $accounts,
        ?MonthLockService $locks = null,
        ?string $uploadDir = null,
        ?AdminNotificationService $notifications = null
    )
    {
        $this->entries = $entries;
        $this->accounts = $accounts;
        $this->locks = $locks;
        $this->uploadDir = $uploadDir;
        $this->notifications = $notifications;
    }

    public function list(int $userId): array
    {
        return $this->entries->listByUser($userId);
    }

    public function listDeleted(int $userId): array
    {
        return $this->entries->listByUser($userId, true);
    }

    public function create(int $userId, array $input): array
    {
        $this->assertValid($input, $userId);
        $this->assertAttachmentOwner($input['attachment_path'] ?? null, $userId);
        $month = substr($input['date'], 0, 7);
        $closed = $this->isClosed($month, $userId);
        $payload = $input;
        $payload['account_id'] = $this->normalizeAccountId($payload['account_id'] ?? null, $userId);
        if ($closed) {
            $payload['needs_review'] = 1;
            $payload['reviewed_at'] = null;
            $payload['valid_amount'] = 0.0;
        } else {
            $payload['needs_review'] = 0;
            $payload['reviewed_at'] = date('c');
            $payload['valid_amount'] = null;
        }
        $entry = $this->entries->create($userId, $payload);
        if ($closed) {
            $this->notifyAdmin($userId, $entry, 'created');
        }
        return $entry->toArray();
    }

    public function update(int $userId, int $id, array $input): array
    {
        $existing = $this->entries->find($id, $userId);
        if (!$existing) {
            Response::json(['error' => 'Lancamento nao encontrado'], 404);
        }
        $this->assertValid(array_merge($existing->toArray(), $input), $userId);
        if (array_key_exists('attachment_path', $input)) {
            $this->assertAttachmentOwner($input['attachment_path'], $userId);
        }
        $originalMonth = substr($existing->date, 0, 7);
        $targetDate = $input['date'] ?? $existing->date;
        $newMonth = substr($targetDate, 0, 7);
        $closed = $this->isClosed($originalMonth, $userId) || $this->isClosed($newMonth, $userId);
        $payload = $input;
        $payload['account_id'] = $this->normalizeAccountId($payload['account_id'] ?? null, $userId);
        if ($closed) {
            $payload['needs_review'] = 1;
            $payload['reviewed_at'] = null;
            if (!array_key_exists('valid_amount', $payload)) {
                $payload['valid_amount'] = $existing->validAmount !== null ? $existing->validAmount : $existing->amount;
            }
        }
        $entry = $this->entries->update($id, $userId, $payload);
        if ($closed && $entry) {
            $this->notifyAdmin($userId, $entry, 'updated');
        }
        return $entry?->toArray() ?? [];
    }

    public function delete(int $userId, int $id, ?int $modifiedByUserId = null): bool
    {
        $entry = $this->entries->find($id, $userId);
        if (!$entry) {
            Response::json(['error' => 'Lancamento nao encontrado'], 404);
        }
        $month = substr($entry->date, 0, 7);
        $isClosed = $this->isClosed($month, $userId);
        $hard = !$isClosed;
        if ($isClosed) {
            $deleted = $this->entries->update($id, $userId, [
                'deleted_at' => date('c'),
                'deleted_type' => 'soft',
                'needs_review' => 1,
                'reviewed_at' => null,
                'valid_amount' => $entry->validAmount !== null ? $entry->validAmount : $entry->amount,
                'last_modified_by_user_id' => $modifiedByUserId && $modifiedByUserId > 0 ? $modifiedByUserId : $userId,
            ]);
            $ok = (bool)$deleted;
        } else {
            $deleted = $this->entries->update($id, $userId, [
                'deleted_at' => date('c'),
                'deleted_type' => $hard ? 'hard' : 'soft',
                'last_modified_by_user_id' => $modifiedByUserId && $modifiedByUserId > 0 ? $modifiedByUserId : $userId,
            ]);
            $ok = (bool)$deleted;
        }
        if ($ok && $isClosed) {
            $this->notifyAdmin($userId, $entry, 'deleted');
        }
        return $ok;
    }

    public function restore(int $userId, int $id, ?int $modifiedByUserId = null): array
    {
        $entry = $this->entries->find($id, $userId);
        if (!$entry || !$entry->deletedAt) {
            Response::json(['error' => 'Lancamento nao encontrado ou ativo'], 404);
        }
        $restored = $this->entries->update($id, $userId, [
            'deleted_at' => null,
            'deleted_type' => null,
            'last_modified_by_user_id' => $modifiedByUserId && $modifiedByUserId > 0 ? $modifiedByUserId : $userId,
        ]);
        return $restored?->toArray() ?? [];
    }

    public function purge(int $userId, int $id): bool
    {
        $entry = $this->entries->find($id, $userId);
        if (!$entry || !$entry->deletedAt) {
            Response::json(['error' => 'Lancamento nao encontrado ou ativo'], 404);
        }
        $month = substr($entry->date, 0, 7);
        if ($this->locks && $this->locks->isClosedForUser($month, $userId)) {
            Response::json(['error' => 'Lancamento consolidado. Contate o administrador.'], 403);
        }
        if ($entry->attachmentPath) {
            $this->deleteAttachment($entry->attachmentPath);
        }
        return $this->entries->purge($id, $userId);
    }

    public function purgeOlderThanDays(int $days): void
    {
        $cutoff = strtotime('-' . (int)$days . ' days');
        foreach ($this->entries->listAll(['include_deleted' => true]) as $entry) {
            if (!$entry->deletedAt) continue;
            if ($entry->deletedType !== 'hard') continue;
            if (strtotime($entry->deletedAt) <= $cutoff) {
                if ($entry->attachmentPath) {
                    $this->deleteAttachment($entry->attachmentPath);
                }
                $this->entries->purge($entry->id, $entry->userId);
            }
        }
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

    private function isClosed(string $month, int $userId): bool
    {
        return $this->locks ? $this->locks->isClosedForUser($month, $userId) : false;
    }

    private function deleteAttachment(?string $file): void
    {
        if (!$file) return;
        $relative = ltrim($file, DIRECTORY_SEPARATOR . '/');
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

    private function notifyAdmin(int $userId, Entry $entry, string $action): void
    {
        if (!$this->notifications) {
            return;
        }
        $payload = [
            'date' => $entry->date,
            'type' => $entry->type,
            'amount' => $entry->amount,
            'category' => $entry->category,
            'description' => $entry->description,
        ];
        $this->notifications->logEntryChange($userId, $entry->id, $action, $payload);
    }
}
