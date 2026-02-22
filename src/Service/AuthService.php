<?php
declare(strict_types=1);

namespace App\Service;

use App\Repository\UserRepositoryInterface;
use App\Util\Response;
use App\Util\Token;
use App\Util\Validator;

class AuthService
{
    private UserRepositoryInterface $users;
    private string $secret;
    private int $ttl;

    public function __construct(UserRepositoryInterface $users, string $secret, int $ttl)
    {
        $this->users = $users;
        $this->secret = $secret;
        $this->ttl = $ttl;
    }

    public function register(array $input): array
    {
        $name = trim($input['name'] ?? '');
        $email = strtolower(trim($input['email'] ?? ''));
        $pass = $input['password'] ?? '';
        if (!Validator::nonEmpty($name) || !Validator::email($email) || strlen($pass) < 6) {
            Response::json(['error' => 'Dados invalidos'], 422);
        }
        if ($this->users->findByEmail($email)) {
            Response::json(['error' => 'Email ja cadastrado'], 409);
        }
        $hash = password_hash($pass, PASSWORD_DEFAULT);
        $user = $this->users->create($name, $email, $hash);
        $token = Token::issue(['uid' => $user->id], $this->secret, $this->ttl);
        return ['token' => $token, 'user' => ['id' => $user->id, 'name' => $user->name, 'email' => $user->email]];
    }

    public function login(array $input): array
    {
        $email = strtolower(trim($input['email'] ?? ''));
        $pass = $input['password'] ?? '';
        if (!Validator::email($email) || !Validator::nonEmpty($pass)) {
            \App\Util\Logger::warning('Login com payload invalido');
            $this->denyAuth();
        }

        $user = $this->users->findByEmail($email);
        if (!$user || !password_verify($pass, $user->passwordHash)) {
            \App\Util\Logger::warning('Login falhou');
            $this->denyAuth();
        }

        $token = Token::issue(['uid' => $user->id, 'role' => $user->role], $this->secret, $this->ttl);
        \App\Util\Logger::info('Login efetuado', ['uid' => $user->id, 'email' => $email]);
        return [
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'theme' => $user->theme,
            ],
        ];
    }

    private function denyAuth(): void
    {
        usleep(random_int(180000, 320000));
        Response::json(['error' => 'Email ou senha incorretos'], 401);
    }
}
