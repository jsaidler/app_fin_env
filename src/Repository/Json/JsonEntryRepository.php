<?php
declare(strict_types=1);

namespace App\Repository\Json;

use App\Domain\Entry;
use App\Repository\EntryRepositoryInterface;
use App\Storage\JsonStorage;

class JsonEntryRepository implements EntryRepositoryInterface
{
    private string $dataDir;

    public function __construct(string $dataDir)
    {
        $this->dataDir = rtrim($dataDir, '/');
    }

    public function listByUser(int $userId, bool $includeDeleted = false): array
    {
        $data = $this->loadForUser($userId);
        $entries = array_filter($data['entries'], function ($e) use ($userId, $includeDeleted) {
            if ((int)$e['user_id'] !== $userId) return false;
            if (!$includeDeleted && !empty($e['deleted_at'])) return false;
            return true;
        });
        return array_map(fn($e) => Entry::fromArray($e), array_values($entries));
    }

    public function find(int $id, int $userId): ?Entry
    {
        $data = $this->loadForUser($userId);
        foreach ($data['entries'] as $entry) {
            if ((int)$entry['id'] === $id && (int)$entry['user_id'] === $userId) {
                return Entry::fromArray($entry);
            }
        }
        return null;
    }

    public function create(int $userId, array $data): Entry
    {
        $stored = $this->loadForUser($userId);
        $id = ++$stored['last_id'];
        $entry = [
            'id' => $id,
            'user_id' => $userId,
            'type' => $data['type'],
            'amount' => (float)$data['amount'],
            'category' => $data['category'],
            'description' => $data['description'] ?? '',
            'date' => $data['date'],
            'attachment_path' => $data['attachment_path'] ?? null,
            'created_at' => date('c'),
            'updated_at' => date('c'),
            'deleted_at' => null,
            'deleted_type' => null,
            'needs_review' => !empty($data['needs_review']) ? 1 : 0,
            'reviewed_at' => $data['reviewed_at'] ?? null,
        ];
        $stored['entries'][] = $entry;
        $this->writeForUser($userId, $stored);
        return Entry::fromArray($entry);
    }

    public function update(int $id, int $userId, array $data): ?Entry
    {
        $stored = $this->loadForUser($userId);
        foreach ($stored['entries'] as &$entry) {
            if ((int)$entry['id'] === $id && (int)$entry['user_id'] === $userId) {
                $entry['type'] = $data['type'] ?? $entry['type'];
                $entry['amount'] = isset($data['amount']) ? (float)$data['amount'] : $entry['amount'];
                $entry['category'] = $data['category'] ?? $entry['category'];
                $entry['description'] = $data['description'] ?? $entry['description'];
                $entry['date'] = $data['date'] ?? $entry['date'];
                $entry['attachment_path'] = $data['attachment_path'] ?? $entry['attachment_path'];
                if (array_key_exists('deleted_at', $data)) {
                    $entry['deleted_at'] = $data['deleted_at'];
                }
                if (array_key_exists('deleted_type', $data)) {
                    $entry['deleted_type'] = $data['deleted_type'];
                }
                if (array_key_exists('needs_review', $data)) {
                    $entry['needs_review'] = $data['needs_review'] ? 1 : 0;
                }
                if (array_key_exists('reviewed_at', $data)) {
                    $entry['reviewed_at'] = $data['reviewed_at'];
                }
                $entry['updated_at'] = date('c');
                $this->writeForUser($userId, $stored);
                return Entry::fromArray($entry);
            }
        }
        return null;
    }

    public function delete(int $id, int $userId, bool $hard = false): bool
    {
        $stored = $this->loadForUser($userId);
        $changed = false;
        foreach ($stored['entries'] as &$entry) {
            if ((int)$entry['id'] === $id && (int)$entry['user_id'] === $userId && empty($entry['deleted_at'])) {
                $entry['deleted_at'] = date('c');
                $entry['deleted_type'] = $hard ? 'hard' : 'soft';
                $entry['updated_at'] = date('c');
                $changed = true;
                break;
            }
        }
        if ($changed) {
            $this->writeForUser($userId, $stored);
        }
        return $changed;
    }

    public function purge(int $id, ?int $userId = null): bool
    {
        if ($userId !== null) {
            return $this->purgeFromUser($id, $userId);
        }
        foreach ($this->userDirs() as $uid) {
            if ($this->purgeFromUser($id, $uid)) {
                return true;
            }
        }
        return false;
    }

    public function setReviewStatus(int $id, bool $needsReview, ?string $reviewedAt = null): bool
    {
        foreach ($this->userDirs() as $uid) {
            $stored = $this->loadForUser($uid);
            foreach ($stored['entries'] as &$entry) {
                if ((int)$entry['id'] === $id) {
                    $entry['needs_review'] = $needsReview ? 1 : 0;
                    $entry['reviewed_at'] = $reviewedAt;
                    $entry['updated_at'] = date('c');
                    $this->writeForUser($uid, $stored);
                    return true;
                }
            }
        }
        return false;
    }

    public function listAll(array $filters = []): array
    {
        $entries = [];
        foreach ($this->userDirs() as $uid) {
            $data = $this->loadForUser($uid);
            foreach ($data['entries'] as $e) {
                if (empty($filters['include_deleted']) && !empty($e['deleted_at'])) continue;
                if (isset($filters['user_id']) && (int)$filters['user_id'] !== (int)$e['user_id']) continue;
                if (isset($filters['type']) && $filters['type'] !== $e['type']) continue;
                if (!empty($filters['start']) && $e['date'] < $filters['start']) continue;
                if (!empty($filters['end']) && $e['date'] > $filters['end']) continue;
                if (isset($filters['month']) && substr($e['date'], 0, 7) !== $filters['month']) continue;
                if (isset($filters['needs_review']) && (int)!empty($e['needs_review']) !== (int)($filters['needs_review'] ? 1 : 0)) continue;
                $entries[] = Entry::fromArray($e);
            }
        }
        return $entries;
    }

    public function findById(int $id): ?Entry
    {
        foreach ($this->userDirs() as $uid) {
            $data = $this->loadForUser($uid);
            foreach ($data['entries'] as $entry) {
                if ((int)$entry['id'] === $id) {
                    return Entry::fromArray($entry);
                }
            }
        }
        return null;
    }

    public function updateAdmin(int $id, array $data): ?Entry
    {
        foreach ($this->userDirs() as $uid) {
            $stored = $this->loadForUser($uid);
            foreach ($stored['entries'] as &$entry) {
                if ((int)$entry['id'] === $id && empty($entry['deleted_at'])) {
                    $entry['type'] = $data['type'] ?? $entry['type'];
                    $entry['amount'] = isset($data['amount']) ? (float)$data['amount'] : $entry['amount'];
                    $entry['category'] = $data['category'] ?? $entry['category'];
                    $entry['description'] = $data['description'] ?? $entry['description'];
                    $entry['date'] = $data['date'] ?? $entry['date'];
                    $entry['attachment_path'] = $data['attachment_path'] ?? $entry['attachment_path'];
                    $entry['user_id'] = isset($data['user_id']) ? (int)$data['user_id'] : $entry['user_id'];
                    if (array_key_exists('needs_review', $data)) {
                        $entry['needs_review'] = $data['needs_review'] ? 1 : 0;
                    }
                    if (array_key_exists('reviewed_at', $data)) {
                        $entry['reviewed_at'] = $data['reviewed_at'];
                    }
                    $entry['updated_at'] = date('c');
                    $this->writeForUser((int)$entry['user_id'], $stored);
                    return Entry::fromArray($entry);
                }
            }
        }
        return null;
    }

    public function deleteAdmin(int $id, bool $hard = false): bool
    {
        foreach ($this->userDirs() as $uid) {
            $stored = $this->loadForUser($uid);
            foreach ($stored['entries'] as &$entry) {
                if ((int)$entry['id'] === $id && empty($entry['deleted_at'])) {
                    $entry['deleted_at'] = date('c');
                    $entry['deleted_type'] = $hard ? 'hard' : 'soft';
                    $entry['updated_at'] = date('c');
                    $this->writeForUser($uid, $stored);
                    return true;
                }
            }
        }
        return false;
    }

    private function purgeFromUser(int $id, int $userId): bool
    {
        $stored = $this->loadForUser($userId);
        $changed = false;
        foreach ($stored['entries'] as $idx => $entry) {
            if ((int)$entry['id'] === $id) {
                unset($stored['entries'][$idx]);
                $changed = true;
                break;
            }
        }
        if ($changed) {
            $stored['entries'] = array_values($stored['entries']);
            $this->writeForUser($userId, $stored);
        }
        return $changed;
    }

    private function loadForUser(int $userId): array
    {
        $storage = new JsonStorage($this->userFile($userId));
        $data = $storage->read();
        if (!$data) {
            $data = ['last_id' => 0, 'entries' => []];
        }
        if (!isset($data['last_id'])) {
            $data['last_id'] = count($data['entries']);
        }
        return $data;
    }

    private function writeForUser(int $userId, array $data): void
    {
        $file = $this->userFile($userId);
        $dir = dirname($file);
        if (!is_dir($dir)) {
            mkdir($dir, 0775, true);
        }
        (new JsonStorage($file))->write($data);
    }

    private function userFile(int $userId): string
    {
        return $this->dataDir . '/users/' . $userId . '/entries.json';
    }

    private function userDirs(): array
    {
        $base = $this->dataDir . '/users';
        if (!is_dir($base)) {
            return [];
        }
        $dirs = array_filter(scandir($base) ?: [], fn($d) => $d !== '.' && $d !== '..' && is_dir($base . '/' . $d));
        return array_map('intval', $dirs);
    }
}
