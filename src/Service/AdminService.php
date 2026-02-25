<?php
declare(strict_types=1);

namespace App\Service;

use App\Repository\EntryRepositoryInterface;
use App\Repository\UserRepositoryInterface;
use App\Util\Response;

class AdminService
{
    private UserRepositoryInterface $users;
    private EntryRepositoryInterface $entries;
    private MonthLockService $locks;
    private ?string $uploadDir;

    public function __construct(UserRepositoryInterface $users, EntryRepositoryInterface $entries, MonthLockService $locks, ?string $uploadDir = null)
    {
        $this->users = $users;
        $this->entries = $entries;
        $this->locks = $locks;
        $this->uploadDir = $uploadDir;
    }

    public function listUsers(): array
    {
        return array_map(fn($u) => [
            'id' => $u->id,
            'name' => $u->name,
            'email' => $u->email,
            'role' => $u->role,
            'theme' => $u->theme,
            'alterdata_code' => $u->alterdataCode,
            'created_at' => $u->createdAt,
        ], $this->users->listAll());
    }

    public function createUser(array $data): array
    {
        $name = trim($data['name'] ?? '');
        $email = strtolower(trim($data['email'] ?? ''));
        $password = $data['password'] ?? '';
        $role = $data['role'] ?? 'user';
        $alterdataCode = trim((string)($data['alterdata_code'] ?? ''));
        if (!\App\Util\Validator::email($email) || strlen($password) < 8 || $name === '') {
            Response::json(['error' => 'Dados invalidos'], 422);
        }
        if ($this->users->findByEmail($email)) {
            Response::json(['error' => 'Email ja existe'], 409);
        }
        if (!in_array($role, ['user', 'admin'], true)) {
            Response::json(['error' => 'Papel invalido'], 422);
        }
        $this->assertAlterdataUnique($alterdataCode);
        $user = $this->users->create($name, $email, password_hash($password, PASSWORD_DEFAULT));
        if ($role !== 'user') {
            $user = $this->users->updateUser($user->id, ['role' => $role]) ?? $user;
        }
        if ($alterdataCode !== '') {
            $user = $this->users->updateUser($user->id, ['alterdata_code' => $alterdataCode]) ?? $user;
        }
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'theme' => $user->theme,
            'alterdata_code' => $user->alterdataCode,
            'created_at' => $user->createdAt,
        ];
    }

    public function updateUser(int $id, array $data): array
    {
        $alterdataCode = array_key_exists('alterdata_code', $data) ? trim((string)$data['alterdata_code']) : null;
        if ($alterdataCode !== null) {
            $this->assertAlterdataUnique($alterdataCode, $id);
        }
        $allowed = [
            'name' => $data['name'] ?? null,
            'email' => $data['email'] ?? null,
            'role' => $data['role'] ?? null,
            'theme' => $data['theme'] ?? null,
            'alterdata_code' => $alterdataCode,
        ];
        $user = $this->users->updateUser($id, array_filter($allowed, fn($v) => $v !== null));
        if (!$user) {
            Response::json(['error' => 'Usuario nao encontrado'], 404);
        }
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'theme' => $user->theme,
            'alterdata_code' => $user->alterdataCode,
            'created_at' => $user->createdAt,
        ];
    }

    public function deleteUser(int $id): array
    {
        $ok = $this->users->deleteUser($id);
        if (!$ok) {
            Response::json(['error' => 'Usuario nao encontrado'], 404);
        }
        return ['deleted' => true];
    }

    public function closeMonth(string $month, array $userIds, bool $closed): array
    {
        if (!preg_match('/^\d{4}-\d{2}$/', $month)) {
            Response::json(['error' => 'Mes invalido'], 422);
        }
        if (empty($userIds)) {
            Response::json(['error' => 'Selecione ao menos um usuario'], 422);
        }
        $validIds = [];
        foreach ($userIds as $uid) {
            if ($this->users->findById((int)$uid)) {
                $validIds[] = (int)$uid;
            }
        }
        if (!$validIds) {
            Response::json(['error' => 'Usuarios invalidos'], 422);
        }
        $this->locks->setClosedForUsers($month, $validIds, $closed);
        $purgedCount = 0;
        if ($closed) {
            $purgedCount = $this->purgeDeletedForMonth($month, $validIds);
        }
        $locksUpdated = count($validIds);
        return [
            'closed_months' => $this->locks->listClosed(),
            'summary' => [
                'users_affected' => $locksUpdated,
                'locks_updated' => $locksUpdated,
                'purged_entries' => $purgedCount,
                'records_affected' => $locksUpdated + $purgedCount,
            ],
        ];
    }

    private function purgeDeletedForMonth(string $month, array $userIds): int
    {
        $entries = $this->entries->listAll(['include_deleted' => true, 'month' => $month]);
        $purged = 0;
        foreach ($entries as $entry) {
            if (!in_array($entry->userId, $userIds, true)) continue;
            if (!$entry->deletedAt) continue;
            if ($entry->attachmentPath) {
                $this->deleteAttachment($entry->attachmentPath);
            }
            $this->entries->purge($entry->id, $entry->userId);
            $purged++;
        }
        return $purged;
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

    private function assertAlterdataUnique(string $code, ?int $ignoreId = null): void
    {
        if ($code === '') {
            return;
        }
        foreach ($this->users->listAll() as $user) {
            if ($user->alterdataCode === $code && ($ignoreId === null || $user->id !== $ignoreId)) {
                Response::json(['error' => 'Codigo Alterdata ja utilizado'], 409);
            }
        }
    }
}
