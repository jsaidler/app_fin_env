<?php
declare(strict_types=1);

namespace App\Repository;

use App\Domain\User;

interface UserRepositoryInterface
{
    public function findByEmail(string $email): ?User;
    public function findById(int $id): ?User;
    public function create(string $name, string $email, string $passwordHash): User;
    /** @return User[] */
    public function listAll(): array;
    public function updateUser(int $id, array $data): ?User;
    public function updatePassword(int $id, string $passwordHash): bool;
    public function deleteUser(int $id): bool;
}
