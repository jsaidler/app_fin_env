<?php
declare(strict_types=1);

namespace App\Repository\Sqlite;

use App\Domain\UserAccount;
use App\Repository\UserAccountRepositoryInterface;
use PDO;

class SqliteUserAccountRepository implements UserAccountRepositoryInterface
{
    private PDO $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function listByUser(int $userId, bool $includeInactive = false): array
    {
        $sql = 'SELECT * FROM user_accounts WHERE user_id = :uid';
        if (!$includeInactive) {
            $sql .= ' AND active = 1';
        }
        $sql .= ' ORDER BY active DESC, name COLLATE NOCASE ASC';
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute(['uid' => $userId]);
        $rows = $stmt->fetchAll();
        return array_map(fn($row) => UserAccount::fromArray($row), $rows);
    }

    public function findForUser(int $id, int $userId): ?UserAccount
    {
        $stmt = $this->pdo->prepare('SELECT * FROM user_accounts WHERE id = :id AND user_id = :uid LIMIT 1');
        $stmt->execute(['id' => $id, 'uid' => $userId]);
        $row = $stmt->fetch();
        return $row ? UserAccount::fromArray($row) : null;
    }

    public function findByUserAndName(int $userId, string $name): ?UserAccount
    {
        $stmt = $this->pdo->prepare('SELECT * FROM user_accounts WHERE user_id = :uid AND lower(name) = lower(:name) LIMIT 1');
        $stmt->execute(['uid' => $userId, 'name' => $name]);
        $row = $stmt->fetch();
        return $row ? UserAccount::fromArray($row) : null;
    }

    public function create(int $userId, string $name, string $type, string $icon, float $initialBalance = 0.0): UserAccount
    {
        $now = date('c');
        $stmt = $this->pdo->prepare(
            'INSERT INTO user_accounts (user_id, name, type, icon, initial_balance, active, created_at, updated_at)
             VALUES (:uid, :name, :type, :icon, :initial_balance, 1, :created, :updated)'
        );
        $stmt->execute([
            'uid' => $userId,
            'name' => $name,
            'type' => $type,
            'icon' => $icon,
            'initial_balance' => $initialBalance,
            'created' => $now,
            'updated' => $now,
        ]);
        $id = (int)$this->pdo->lastInsertId();
        return $this->findForUser($id, $userId) ?? UserAccount::fromArray([
            'id' => $id,
            'user_id' => $userId,
            'name' => $name,
            'type' => $type,
            'icon' => $icon,
            'initial_balance' => $initialBalance,
            'active' => 1,
            'created_at' => $now,
            'updated_at' => $now,
        ]);
    }

    public function updateForUser(int $id, int $userId, array $data): ?UserAccount
    {
        $existing = $this->findForUser($id, $userId);
        if (!$existing) {
            return null;
        }
        $merged = array_merge($existing->toArray(), $data);
        $merged['updated_at'] = date('c');

        $stmt = $this->pdo->prepare(
            'UPDATE user_accounts
             SET name = :name,
                 type = :type,
                 icon = :icon,
                 initial_balance = :initial_balance,
                 active = :active,
                 updated_at = :updated_at
             WHERE id = :id AND user_id = :uid'
        );
        $stmt->execute([
            'name' => $merged['name'],
            'type' => $merged['type'],
            'icon' => $merged['icon'],
            'initial_balance' => (float)($merged['initial_balance'] ?? 0),
            'active' => (int)($merged['active'] ?? 1) === 1 ? 1 : 0,
            'updated_at' => $merged['updated_at'],
            'id' => $id,
            'uid' => $userId,
        ]);
        return $this->findForUser($id, $userId);
    }

    public function setActiveForUser(int $id, int $userId, bool $active): bool
    {
        $stmt = $this->pdo->prepare(
            'UPDATE user_accounts
             SET active = :active,
                 updated_at = :updated_at
             WHERE id = :id AND user_id = :uid'
        );
        $stmt->execute([
            'active' => $active ? 1 : 0,
            'updated_at' => date('c'),
            'id' => $id,
            'uid' => $userId,
        ]);
        return $stmt->rowCount() > 0;
    }

    public function deleteForUser(int $id, int $userId): bool
    {
        $stmt = $this->pdo->prepare('DELETE FROM user_accounts WHERE id = :id AND user_id = :uid');
        $stmt->execute(['id' => $id, 'uid' => $userId]);
        return $stmt->rowCount() > 0;
    }
}
