<?php
declare(strict_types=1);

namespace App\Service;

use App\Repository\EntryRepositoryInterface;
use App\Repository\UserRepositoryInterface;
use App\Util\Response;
use App\Util\Validator;
use App\Service\MonthLockService;

class AdminEntryService
{
    private EntryRepositoryInterface $entries;
    private UserRepositoryInterface $users;
    private ?MonthLockService $locks;
    private ?string $uploadDir;

    public function __construct(EntryRepositoryInterface $entries, UserRepositoryInterface $users, ?MonthLockService $locks = null, ?string $uploadDir = null)
    {
        $this->entries = $entries;
        $this->users = $users;
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
        if (!$user || $user->role === 'admin') {
            Response::json(['error' => 'Usuario invalido'], 422);
        }
        $merged = array_merge($entry->toArray(), $input);
        $this->assertValid($merged);
        $merged['needs_review'] = 0;
        $merged['reviewed_at'] = date('c');
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
        if (!$user || $user->role === 'admin') {
            Response::json(['error' => 'Usuario invalido'], 422);
        }
        $this->assertValid($input);
        $input['needs_review'] = 0;
        $input['reviewed_at'] = date('c');
        $entry = $this->entries->create($userId, $input);
        return $entry->toArray();
    }

    public function delete(int $id): array
    {
        $entry = $this->entries->findById($id);
        if (!$entry) {
            Response::json(['error' => 'Lancamento nao encontrado'], 404);
        }
        $month = substr($entry->date, 0, 7);
        $isClosed = $this->locks && $this->locks->isClosedForUser($month, $entry->userId);
        $hard = !$isClosed;
        if ($hard && $entry->attachmentPath) {
            $this->deleteAttachment($entry->attachmentPath);
        }
        // Admin mantém lixeira compartilhada: registros fechados ficam como soft delete
        $ok = $this->entries->deleteAdmin($id, $hard);
        if ($ok && !$hard) {
            $this->entries->setReviewStatus($id, false, date('c'));
        }
        return ['deleted' => true, 'soft' => $isClosed];
    }

    public function approve(int $id): bool
    {
        $entry = $this->entries->findById($id);
        if (!$entry) {
            Response::json(['error' => 'Lancamento nao encontrado'], 404);
        }
        return $this->entries->setReviewStatus($id, false, date('c'));
    }

    public function reject(int $id): array
    {
        $entry = $this->entries->findById($id);
        if (!$entry) {
            Response::json(['error' => 'Lancamento nao encontrado'], 404);
        }
        $payload = $entry->toArray();
        $payload['needs_review'] = 0;
        $payload['reviewed_at'] = date('c');
        if ($entry->deletedAt) {
            $payload['deleted_at'] = null;
            $payload['deleted_type'] = null;
        } else {
            $payload['deleted_at'] = date('c');
            $payload['deleted_type'] = 'rejected';
        }
        $updated = $this->entries->update($id, $entry->userId, $payload);
        return $updated?->toArray() ?? [];
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
}
