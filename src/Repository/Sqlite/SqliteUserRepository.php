<?php
declare(strict_types=1);

namespace App\Repository\Sqlite;

use App\Domain\User;
use App\Repository\UserRepositoryInterface;
use PDO;

class SqliteUserRepository implements UserRepositoryInterface
{
    private PDO $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function findByEmail(string $email): ?User
    {
        $stmt = $this->pdo->prepare('SELECT * FROM users WHERE lower(email) = lower(:email) LIMIT 1');
        $stmt->execute(['email' => $email]);
        $row = $stmt->fetch();
        return $row ? User::fromArray($row) : null;
    }

    public function findById(int $id): ?User
    {
        $stmt = $this->pdo->prepare('SELECT * FROM users WHERE id = :id LIMIT 1');
        $stmt->execute(['id' => $id]);
        $row = $stmt->fetch();
        return $row ? User::fromArray($row) : null;
    }

    public function create(string $name, string $email, string $passwordHash): User
    {
        $now = date('c');
        $stmt = $this->pdo->prepare('INSERT INTO users (name,email,password_hash,role,theme,alterdata_code,created_at) VALUES (:name,:email,:ph,:role,:theme,:alterdata_code,:created)');
        $stmt->execute([
            'name' => $name,
            'email' => strtolower($email),
            'ph' => $passwordHash,
            'role' => 'user',
            'theme' => 'dark',
            'alterdata_code' => '',
            'created' => $now,
        ]);
        $id = (int)$this->pdo->lastInsertId();
        return User::fromArray([
            'id' => $id,
            'name' => $name,
            'email' => strtolower($email),
            'password_hash' => $passwordHash,
            'role' => 'user',
            'theme' => 'dark',
            'alterdata_code' => '',
            'created_at' => $now,
        ]);
    }

    public function listAll(): array
    {
        $rows = $this->pdo->query('SELECT * FROM users ORDER BY created_at DESC, id DESC')->fetchAll();
        return array_map(fn($r) => User::fromArray($r), $rows);
    }

    public function updateUser(int $id, array $data): ?User
    {
        $existing = $this->findById($id);
        if (!$existing) {
            return null;
        }
        $merged = [
            'name' => $data['name'] ?? $existing->name,
            'email' => isset($data['email']) ? strtolower($data['email']) : $existing->email,
            'role' => $data['role'] ?? $existing->role,
            'theme' => $data['theme'] ?? $existing->theme,
            'alterdata_code' => array_key_exists('alterdata_code', $data) ? trim((string)$data['alterdata_code']) : $existing->alterdataCode,
        ];
        $stmt = $this->pdo->prepare('UPDATE users SET name=:name,email=:email,role=:role,theme=:theme,alterdata_code=:alterdata_code WHERE id=:id');
        $stmt->execute([
            'name' => $merged['name'],
            'email' => $merged['email'],
            'role' => $merged['role'],
            'theme' => $merged['theme'],
            'alterdata_code' => $merged['alterdata_code'],
            'id' => $id,
        ]);
        return $this->findById($id);
    }

    public function updatePassword(int $id, string $passwordHash): bool
    {
        $stmt = $this->pdo->prepare('UPDATE users SET password_hash=:ph WHERE id=:id');
        $stmt->execute(['ph' => $passwordHash, 'id' => $id]);
        return $stmt->rowCount() > 0;
    }

    public function deleteUser(int $id): bool
    {
        $stmt = $this->pdo->prepare('DELETE FROM users WHERE id=:id');
        $stmt->execute(['id' => $id]);
        return $stmt->rowCount() > 0;
    }
}
