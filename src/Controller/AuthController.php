<?php
declare(strict_types=1);

namespace App\Controller;

use App\Service\AuthService;
use App\Service\PasswordResetService;
use App\Util\LoginThrottle;
use App\Util\Response;

class AuthController extends BaseController
{
    public function register(): void
    {
        $service = new AuthService($this->userRepo(), $this->config['secret'], $this->config['token_ttl']);
        $result = $service->register($this->jsonInput());
        $this->setAuthCookie($result['token'] ?? '');
        Response::json($result, 201);
    }

    public function login(): void
    {
        $input = $this->jsonInput();
        $throttle = $this->loginThrottle();
        $identity = strtolower(trim((string)($input['email'] ?? '')));
        $key = hash('sha256', $this->clientIp() . '|' . $identity);
        $state = $throttle->consume($key);
        if (!$state['allowed']) {
            header('Retry-After: ' . (string)$state['retry_after']);
            Response::json(['error' => 'Muitas tentativas. Tente novamente em alguns minutos.'], 429);
        }

        $service = new AuthService($this->userRepo(), $this->config['secret'], $this->config['token_ttl']);
        $result = $service->login($input);
        $throttle->clear($key);
        $this->setAuthCookie($result['token'] ?? '');
        Response::json($result);
    }

    public function logout(): void
    {
        $this->clearAuthCookie();
        Response::json(['ok' => true]);
    }

    public function forgotPassword(): void
    {
        $input = $this->jsonInput();
        $email = strtolower(trim((string)($input['email'] ?? '')));

        $throttle = $this->forgotThrottle();
        $key = hash('sha256', $this->clientIp() . '|' . $email);
        $state = $throttle->consume($key);
        if (!$state['allowed']) {
            header('Retry-After: ' . (string)$state['retry_after']);
            Response::json(['error' => 'Muitas tentativas. Aguarde alguns minutos.'], 429);
        }

        $service = new PasswordResetService(
            $this->userRepo(),
            $this->db(),
            (int)($this->config['password_reset_ttl'] ?? 1800),
            (string)($this->config['password_reset_from'] ?? 'no-reply@caixasimples.local')
        );
        $service->requestReset($email, $this->clientIp(), (string)($this->config['app_name'] ?? 'Aplicativo'), $this->publicBaseUrl());

        Response::json([
            'ok' => true,
            'message' => 'Se o email estiver cadastrado, voce recebera instrucoes para redefinir a senha.',
        ]);
    }

    public function resetPassword(): void
    {
        $input = $this->jsonInput();
        $token = trim((string)($input['token'] ?? ''));
        $password = (string)($input['password'] ?? '');

        $throttle = $this->resetThrottle();
        $tokenHint = $token !== '' ? substr(hash('sha256', $token), 0, 24) : 'empty';
        $key = hash('sha256', $this->clientIp() . '|' . $tokenHint);
        $state = $throttle->consume($key);
        if (!$state['allowed']) {
            header('Retry-After: ' . (string)$state['retry_after']);
            Response::json(['error' => 'Muitas tentativas. Aguarde alguns minutos.'], 429);
        }

        if (strlen($password) < 8) {
            Response::json(['error' => 'A nova senha deve ter pelo menos 8 caracteres.'], 422);
        }

        $service = new PasswordResetService(
            $this->userRepo(),
            $this->db(),
            (int)($this->config['password_reset_ttl'] ?? 1800),
            (string)($this->config['password_reset_from'] ?? 'no-reply@caixasimples.local')
        );
        $ok = $service->resetPassword($token, $password);
        if (!$ok) {
            Response::json(['error' => 'Token invalido ou expirado. Solicite um novo link.'], 422);
        }

        $throttle->clear($key);
        Response::json(['ok' => true, 'message' => 'Senha redefinida com sucesso.']);
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

    private function loginThrottle(): LoginThrottle
    {
        $dataDir = $this->config['paths']['data'] ?? (__DIR__ . '/../../data');
        return new LoginThrottle(rtrim((string)$dataDir, '/\\') . '/login-throttle.json', 8, 600);
    }

    private function forgotThrottle(): LoginThrottle
    {
        $dataDir = $this->config['paths']['data'] ?? (__DIR__ . '/../../data');
        return new LoginThrottle(rtrim((string)$dataDir, '/\\') . '/forgot-password-throttle.json', 5, 900);
    }

    private function resetThrottle(): LoginThrottle
    {
        $dataDir = $this->config['paths']['data'] ?? (__DIR__ . '/../../data');
        return new LoginThrottle(rtrim((string)$dataDir, '/\\') . '/reset-password-throttle.json', 8, 900);
    }

    private function clientIp(): string
    {
        $forwarded = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? '';
        if ($forwarded !== '') {
            $parts = explode(',', $forwarded);
            $candidate = trim((string)($parts[0] ?? ''));
            if (filter_var($candidate, FILTER_VALIDATE_IP)) {
                return $candidate;
            }
        }
        $remote = (string)($_SERVER['REMOTE_ADDR'] ?? '');
        return filter_var($remote, FILTER_VALIDATE_IP) ? $remote : 'unknown';
    }

    private function publicBaseUrl(): string
    {
        $configured = trim((string)($this->config['app_url'] ?? ''));
        if ($configured !== '') {
            return rtrim($configured, '/');
        }

        $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
        $host = trim((string)($_SERVER['HTTP_HOST'] ?? ''));
        if ($host === '') {
            return '';
        }
        return $scheme . '://' . $host;
    }
}
