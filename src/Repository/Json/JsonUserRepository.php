<?php
declare(strict_types=1);

namespace App\Repository\Json;

use App\Domain\User;
use App\Repository\UserRepositoryInterface;
use App\Storage\JsonStorage;

class JsonUserRepository implements UserRepositoryInterface
{
    private JsonStorage $storage;

    public function __construct(string $dataDir)
    {
        $this->storage = new JsonStorage(rtrim($dataDir, '/') . '/users.json');
    }

    public function findByEmail(string $email): ?User
    {
        $data = $this->load();
        foreach ($data['users'] as $user) {
            if (strcasecmp($user['email'], $email) === 0) {
                return User::fromArray($user);
            }
        }
        return null;
    }

    public function findById(int $id): ?User
    {
        $data = $this->load();
        foreach ($data['users'] as $user) {
            if ((int) $user['id'] === $id) {
                return User::fromArray($user);
            }
        }
        return null;
    }

    public function create(string $name, string $email, string $passwordHash): User
    {
        $data = $this->load();
        $id = ++$data['last_id'];
        $user = [
            'id' => $id,
            'name' => $name,
            'email' => strtolower($email),
            'password_hash' => $passwordHash,
            'role' => 'user',
            'theme' => 'dark',
            'alterdata_code' => '',
            'created_at' => date('c'),
        ];
        $data['users'][] = $user;
        $this->storage->write($data);
        return User::fromArray($user);
    }

    public function listAll(): array
    {
        $data = $this->load();
        return array_map(fn ($u) => User::fromArray($u), $data['users']);
    }

    public function updateUser(int $id, array $data): ?User
    {
        $payload = $this->load();
        foreach ($payload['users'] as &$user) {
            if ((int)$user['id'] === $id) {
                $user['name'] = $data['name'] ?? $user['name'];
                $user['email'] = isset($data['email']) ? strtolower($data['email']) : $user['email'];
                $user['role'] = $data['role'] ?? $user['role'] ?? 'user';
                $user['theme'] = $data['theme'] ?? $user['theme'] ?? 'dark';
                if (array_key_exists('alterdata_code', $data)) {
                    $user['alterdata_code'] = trim((string)$data['alterdata_code']);
                }
                $this->storage->write($payload);
                return User::fromArray($user);
            }
        }
        return null;
    }

    public function updatePassword(int $id, string $passwordHash): bool
    {
        $data = $this->load();
        foreach ($data['users'] as &$user) {
            if ((int)$user['id'] === $id) {
                $user['password_hash'] = $passwordHash;
                $this->storage->write($data);
                return true;
            }
        }
        return false;
    }

    public function deleteUser(int $id): bool
    {
        $data = $this->load();
        $before = count($data['users']);
        $data['users'] = array_values(array_filter($data['users'], fn($u) => (int)$u['id'] !== $id));
        if (count($data['users']) < $before) {
            $this->storage->write($data);
            return true;
        }
        return false;
    }

    private function load(): array
    {
        $data = $this->storage->read();
        if (!$data) {
            $data = ['last_id' => 0, 'users' => []];
        }
        if (!isset($data['last_id'])) {
            $data['last_id'] = count($data['users']);
        }
        return $data;
    }
}
