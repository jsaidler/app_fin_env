<?php
declare(strict_types=1);

namespace App\Controller;

use App\Repository\Sqlite\SqliteUserRepository;
use App\Storage\SqliteConnection;
use App\Util\Logger;
use App\Util\Response;
use App\Util\Token;
use PDO;

abstract class BaseController
{
    protected array $config;
    protected ?array $authPayload = null;

    public function __construct()
    {
        $this->config = $GLOBALS['config'] ?? [];
    }

    protected function jsonInput(): array
    {
        $raw = file_get_contents('php://input') ?: '';
        $data = json_decode($raw, true);
        return is_array($data) ? $data : [];
    }

    protected function requireAuth(): int
    {
        $token = $this->readAuthToken();
        if (!$token) {
            Logger::warning('Auth ausente ou malformado', ['path' => $_SERVER['REQUEST_URI'] ?? '']);
            Response::json(['error' => 'Unauthorized'], 401);
        }
        $payload = Token::verify($token, $this->config['secret']);
        if (!$payload || !isset($payload['uid'])) {
            Logger::warning('Token invalido ou expirado', ['path' => $_SERVER['REQUEST_URI'] ?? '', 'token' => substr($token, 0, 24) . '...']);
            Response::json(['error' => 'Token invalido'], 401);
        }
        $this->authPayload = $payload;
        $uid = (int) $payload['uid'];

        // Cross-check user existence and role in storage to avoid trusting stale tokens
        $user = $this->userRepo()->findById($uid);
        if (!$user) {
            Logger::warning('Token valido mas usuario nao encontrado', ['uid' => $uid, 'path' => $_SERVER['REQUEST_URI'] ?? '']);
            Response::json(['error' => 'Usuario nao encontrado'], 401);
        }
        $role = $payload['role'] ?? $user->role ?? 'user';
        $this->authPayload['role'] = $role;
        return $uid;
    }

    private function readAuthToken(): ?string
    {
        $header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
        if (str_starts_with($header, 'Bearer ')) {
            return substr($header, 7);
        }
        $cookie = $_COOKIE['auth_token'] ?? '';
        return $cookie !== '' ? $cookie : null;
    }

    protected function requireAdmin(): int
    {
        $uid = $this->requireAuth();
        $role = $this->authPayload['role'] ?? 'user';
        if ($role !== 'admin') {
            Logger::warning('Acesso negado para nao-admin', ['uid' => $uid, 'role' => $role, 'path' => $_SERVER['REQUEST_URI'] ?? '']);
            Response::json(['error' => 'Acesso restrito a administradores'], 403);
        }
        return $uid;
    }

    protected function userRepo()
    {
        return new SqliteUserRepository($this->db());
    }

    protected function db(): PDO
    {
        $path = $this->config['db']['path'] ?? ($this->config['paths']['sqlite'] ?? (__DIR__ . '/../../data/caixa.sqlite'));
        try {
            return SqliteConnection::make($path, $this->config['paths']['data'] ?? null);
        } catch (\Throwable $e) {
            Response::json(['error' => 'Banco de dados indisponivel: ' . $e->getMessage()], 500);
        }
    }
}
