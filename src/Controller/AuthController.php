<?php
declare(strict_types=1);

namespace App\Controller;

use App\Service\AuthService;
use App\Util\Response;

class AuthController extends BaseController
{
    public function register(): void
    {
        $service = new AuthService($this->userRepo(), $this->config['secret'], $this->config['token_ttl']);
        $result = $service->register($this->jsonInput());
        $this->setAuthCookie($result['token'] ?? '');
        unset($result['token']);
        Response::json($result, 201);
    }

    public function login(): void
    {
        $service = new AuthService($this->userRepo(), $this->config['secret'], $this->config['token_ttl']);
        $result = $service->login($this->jsonInput());
        $this->setAuthCookie($result['token'] ?? '');
        unset($result['token']);
        Response::json($result);
    }

    public function logout(): void
    {
        $this->clearAuthCookie();
        Response::json(['ok' => true]);
    }

    private function setAuthCookie(string $token): void
    {
        if ($token === '') {
            return;
        }
        $ttl = (int)($this->config['token_ttl'] ?? 0);
        $secure = !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off';
        setcookie('auth_token', $token, [
            'expires' => $ttl > 0 ? time() + $ttl : 0,
            'path' => '/',
            'httponly' => true,
            'samesite' => 'Lax',
            'secure' => $secure,
        ]);
    }

    private function clearAuthCookie(): void
    {
        $secure = !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off';
        setcookie('auth_token', '', [
            'expires' => time() - 3600,
            'path' => '/',
            'httponly' => true,
            'samesite' => 'Lax',
            'secure' => $secure,
        ]);
    }
}
