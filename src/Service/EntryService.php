<?php
declare(strict_types=1);

namespace App\Service;

use App\Repository\EntryRepositoryInterface;
use App\Util\Response;
use App\Util\Validator;
use App\Service\MonthLockService;
use App\Service\AdminNotificationService;
use App\Domain\Entry;

class EntryService
{
    private EntryRepositoryInterface $entries;
    private ?MonthLockService $locks;
    private ?string $uploadDir;
    private ?AdminNotificationService $notifications;

    public function __construct(EntryRepositoryInterface $entries, ?MonthLockService $locks = null, ?string $uploadDir = null, ?AdminNotificationService $notifications = null)
    {
        $this->entries = $entries;
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
        $this->assertValid($input);
        $month = substr($input['date'], 0, 7);
        $closed = $this->isClosed($month, $userId);
        $payload = $input;
        if ($closed) {
            $payload['needs_review'] = 1;
            $payload['reviewed_at'] = null;
        } else {
            $payload['needs_review'] = 0;
            $payload['reviewed_at'] = date('c');
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
        $this->assertValid(array_merge($existing->toArray(), $input));
        $originalMonth = substr($existing->date, 0, 7);
        $targetDate = $input['date'] ?? $existing->date;
        $newMonth = substr($targetDate, 0, 7);
        $closed = $this->isClosed($originalMonth, $userId) || $this->isClosed($newMonth, $userId);
        $payload = $input;
        if ($closed) {
            $payload['needs_review'] = 1;
            $payload['reviewed_at'] = null;
        }
        $entry = $this->entries->update($id, $userId, $payload);
        if ($closed && $entry) {
            $this->notifyAdmin($userId, $entry, 'updated');
        }
        return $entry?->toArray() ?? [];
    }

    public function delete(int $userId, int $id): bool
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
            ]);
            $ok = (bool)$deleted;
        } else {
            $ok = $this->entries->delete($id, $userId, $hard);
        }
        if ($ok && $hard && $entry->attachmentPath) {
            $this->deleteAttachment($entry->attachmentPath);
        }
        if ($ok && $isClosed) {
            $this->notifyAdmin($userId, $entry, 'deleted');
        }
        return $ok;
    }

    public function restore(int $userId, int $id): array
    {
        $entry = $this->entries->find($id, $userId);
        if (!$entry || !$entry->deletedAt) {
            Response::json(['error' => 'Lancamento nao encontrado ou ativo'], 404);
        }
        $restored = $this->entries->update($id, $userId, [
            'deleted_at' => null,
            'deleted_type' => null,
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

    private function assertValid(array $input): void
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
        if (!Validator::date($input['date'] ?? '')) {
            Response::json(['error' => 'Data invalida'], 422);
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
