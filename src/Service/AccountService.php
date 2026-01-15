<?php
declare(strict_types=1);

namespace App\Service;

use App\Repository\UserRepositoryInterface;
use App\Util\Response;

class AccountService
{
    private UserRepositoryInterface $users;

    public function __construct(UserRepositoryInterface $users)
    {
        $this->users = $users;
    }

    public function updatePassword(int $userId, array $input): void
    {
        $current = $input['current_password'] ?? '';
        $new = $input['password'] ?? '';
        if (strlen($new) < 8) {
            Response::json(['error' => 'Senha muito curta'], 422);
        }
        $user = $this->users->findById($userId);
        if (!$user || !password_verify($current, $user->passwordHash)) {
            Response::json(['error' => 'Senha atual incorreta'], 403);
        }
        $hash = password_hash($new, PASSWORD_DEFAULT);
        $this->users->updatePassword($userId, $hash);
    }

    public function updatePreferences(int $userId, array $input): array
    {
        $data = [];
        if (isset($input['theme'])) {
            $theme = $input['theme'];
            if (!in_array($theme, ['dark', 'light'], true)) {
                Response::json(['error' => 'Tema inválido'], 422);
            }
            $data['theme'] = $theme;
        }
        if (isset($input['name'])) {
            $name = trim((string)$input['name']);
            if ($name === '') {
                Response::json(['error' => 'Nome inválido'], 422);
            }
            $data['name'] = $name;
        }
        if (!$data) {
            Response::json(['error' => 'Nada a atualizar'], 422);
        }
        $user = $this->users->updateUser($userId, $data);
        if (!$user) {
            Response::json(['error' => 'Usuário não encontrado'], 404);
        }
        return ['theme' => $user->theme, 'name' => $user->name];
    }
}

