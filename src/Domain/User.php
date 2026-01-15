<?php
declare(strict_types=1);

namespace App\Domain;

class User
{
    public int $id;
    public string $email;
    public string $name;
    public string $passwordHash;
    public string $createdAt;
    public string $role = 'user'; // user|admin
    public string $theme = 'dark'; // dark|light
    public string $alterdataCode = '';

    public static function fromArray(array $data): self
    {
        $u = new self();
        $u->id = (int) $data['id'];
        $u->email = $data['email'];
        $u->name = $data['name'];
        $u->passwordHash = $data['password_hash'];
        $u->createdAt = $data['created_at'] ?? date('c');
        $u->role = $data['role'] ?? 'user';
        $u->theme = $data['theme'] ?? 'dark';
        $u->alterdataCode = $data['alterdata_code'] ?? '';
        return $u;
    }

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'email' => $this->email,
            'name' => $this->name,
            'password_hash' => $this->passwordHash,
            'created_at' => $this->createdAt,
            'role' => $this->role,
            'theme' => $this->theme,
            'alterdata_code' => $this->alterdataCode,
        ];
    }
}
