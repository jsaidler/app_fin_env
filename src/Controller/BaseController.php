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
    protected string $authTokenSource = '';

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
        $auth = $this->readAuthToken();
        $token = $auth['token'] ?? null;
        if (!$token) {
            Logger::warning('Auth ausente ou malformado', ['path' => $_SERVER['REQUEST_URI'] ?? '']);
            Response::json(['error' => 'Unauthorized'], 401);
        }
        $this->authTokenSource = (string)($auth['source'] ?? '');
        $payload = Token::verify($token, $this->config['secret']);
        if (!$payload || !isset($payload['uid'])) {
            Logger::warning('Token invalido ou expirado', ['path' => $_SERVER['REQUEST_URI'] ?? '']);
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

        if ($this->authTokenSource === 'cookie') {
            $this->setCsrfCookie();
            if ($this->isStateChangingRequest()) {
                $this->assertCsrfToken();
            }
        }

        return $uid;
    }

    private function readAuthToken(): array
    {
        $header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
        if (str_starts_with($header, 'Bearer ')) {
            return ['token' => substr($header, 7), 'source' => 'authorization'];
        }
        $xAuth = trim((string)($_SERVER['HTTP_X_AUTH_TOKEN'] ?? ''));
        if ($xAuth !== '') {
            return ['token' => $xAuth, 'source' => 'x-auth-token'];
        }
        $cookie = $_COOKIE['auth_token'] ?? '';
        if ($cookie !== '') {
            return ['token' => $cookie, 'source' => 'cookie'];
        }
        return ['token' => null, 'source' => ''];
    }

    protected function requireAdmin(): int
    {
        $uid = $this->requireAuth();
        $role = $this->authPayload['role'] ?? 'user';
        if ($role === 'admin') {
            return $uid;
        }

        $impBy = isset($this->authPayload['imp_by']) ? (int)$this->authPayload['imp_by'] : 0;
        if ($impBy > 0) {
            $admin = $this->userRepo()->findById($impBy);
            if ($admin && $admin->role === 'admin') {
                return $impBy;
            }
        }

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

    protected function setCsrfCookie(?string $token = null): string
    {
        $value = trim((string)($token ?? ($_COOKIE['csrf_token'] ?? '')));
        if ($value === '') {
            try {
                $value = bin2hex(random_bytes(32));
            } catch (\Throwable) {
                $value = hash('sha256', uniqid('csrf', true) . mt_rand());
            }
        }
        $secure = !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off';
        setcookie('csrf_token', $value, [
            'expires' => 0,
            'path' => '/',
            'httponly' => false,
            'samesite' => 'Lax',
            'secure' => $secure,
        ]);
        $_COOKIE['csrf_token'] = $value;
        return $value;
    }

    protected function clearCsrfCookie(): void
    {
        $secure = !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off';
        setcookie('csrf_token', '', [
            'expires' => time() - 3600,
            'path' => '/',
            'httponly' => false,
            'samesite' => 'Lax',
            'secure' => $secure,
        ]);
        unset($_COOKIE['csrf_token']);
    }

    private function isStateChangingRequest(): bool
    {
        $method = strtoupper((string)($_SERVER['REQUEST_METHOD'] ?? 'GET'));
        return in_array($method, ['POST', 'PUT', 'PATCH', 'DELETE'], true);
    }

    private function assertCsrfToken(): void
    {
        $cookieToken = trim((string)($_COOKIE['csrf_token'] ?? ''));
        $headerToken = trim((string)($_SERVER['HTTP_X_CSRF_TOKEN'] ?? ''));
        if ($cookieToken === '' || $headerToken === '' || !hash_equals($cookieToken, $headerToken)) {
            Logger::warning('Falha de validacao CSRF', ['path' => $_SERVER['REQUEST_URI'] ?? '']);
            Response::json(['error' => 'CSRF token invalido'], 419);
        }
    }

    protected function db(): PDO
    {
        $path = $this->config['db']['path'] ?? ($this->config['paths']['sqlite'] ?? (__DIR__ . '/../../data/caixa.sqlite'));
        try {
            return SqliteConnection::make($path);
        } catch (\Throwable $e) {
            Response::json(['error' => 'Banco de dados indisponivel: ' . $e->getMessage()], 500);
        }
    }
}
