<?php
declare(strict_types=1);

namespace App\Service;

use App\Repository\UserRepositoryInterface;
use App\Util\Logger;
use App\Util\Validator;
use PDO;

final class PasswordResetService
{
    private UserRepositoryInterface $users;
    private PDO $pdo;
    private int $ttlSeconds;
    private string $mailFrom;

    public function __construct(UserRepositoryInterface $users, PDO $pdo, int $ttlSeconds, string $mailFrom)
    {
        $this->users = $users;
        $this->pdo = $pdo;
        $this->ttlSeconds = max(300, $ttlSeconds);
        $this->mailFrom = trim($mailFrom) !== '' ? trim($mailFrom) : 'no-reply@caixasimples.local';
    }

    public function requestReset(string $email, string $clientIp, string $appName, string $resetBaseUrl): void
    {
        $normalized = strtolower(trim($email));
        if (!Validator::email($normalized)) {
            $this->jitter();
            return;
        }

        $user = $this->users->findByEmail($normalized);
        if (!$user) {
            $this->jitter();
            return;
        }

        $this->purgeExpired();

        $rawToken = bin2hex(random_bytes(32));
        $tokenHash = hash('sha256', $rawToken);
        $now = date('c');
        $expiresAt = date('c', time() + $this->ttlSeconds);

        $this->pdo->beginTransaction();
        try {
            $revokeOld = $this->pdo->prepare('UPDATE password_resets SET used_at = :used WHERE user_id = :uid AND used_at IS NULL');
            $revokeOld->execute([
                'used' => $now,
                'uid' => $user->id,
            ]);

            $insert = $this->pdo->prepare('INSERT INTO password_resets (user_id, token_hash, requested_ip, created_at, expires_at, used_at) VALUES (:uid, :token_hash, :ip, :created, :expires, NULL)');
            $insert->execute([
                'uid' => $user->id,
                'token_hash' => $tokenHash,
                'ip' => $this->sanitizeIp($clientIp),
                'created' => $now,
                'expires' => $expiresAt,
            ]);
            $this->pdo->commit();
        } catch (\Throwable $e) {
            $this->pdo->rollBack();
            Logger::error('Falha ao gerar token de reset', ['error' => $e->getMessage()]);
            $this->jitter();
            return;
        }

        $base = rtrim($resetBaseUrl, '/');
        $link = $base . '/?reset_token=' . rawurlencode($rawToken);
        $this->sendResetEmail($user->email, $user->name, $appName, $link);
    }

    public function resetPassword(string $token, string $newPassword): bool
    {
        $token = trim($token);
        if (!preg_match('/^[a-f0-9]{64}$/', $token)) {
            $this->jitter();
            return false;
        }
        if (strlen($newPassword) < 8) {
            return false;
        }

        $this->purgeExpired();

        $hash = hash('sha256', $token);
        $stmt = $this->pdo->prepare('SELECT id, user_id, expires_at, used_at FROM password_resets WHERE token_hash = :hash LIMIT 1');
        $stmt->execute(['hash' => $hash]);
        $row = $stmt->fetch();
        if (!$row) {
            $this->jitter();
            return false;
        }

        $usedAt = (string)($row['used_at'] ?? '');
        if ($usedAt !== '') {
            $this->jitter();
            return false;
        }
        $expiresAt = strtotime((string)($row['expires_at'] ?? ''));
        if (!$expiresAt || $expiresAt < time()) {
            $this->jitter();
            return false;
        }

        $resetId = (int)$row['id'];
        $uid = (int)$row['user_id'];
        if ($uid <= 0 || !$this->users->findById($uid)) {
            $this->jitter();
            return false;
        }

        $passwordHash = password_hash($newPassword, PASSWORD_DEFAULT);
        $now = date('c');

        $this->pdo->beginTransaction();
        try {
            $updated = $this->users->updatePassword($uid, $passwordHash);
            if (!$updated) {
                $this->pdo->rollBack();
                return false;
            }

            $consume = $this->pdo->prepare('UPDATE password_resets SET used_at = :used WHERE id = :id AND used_at IS NULL');
            $consume->execute([
                'used' => $now,
                'id' => $resetId,
            ]);
            if ($consume->rowCount() < 1) {
                $this->pdo->rollBack();
                return false;
            }

            $revoke = $this->pdo->prepare('UPDATE password_resets SET used_at = :used WHERE user_id = :uid AND used_at IS NULL');
            $revoke->execute([
                'used' => $now,
                'uid' => $uid,
            ]);
            $this->pdo->commit();
        } catch (\Throwable $e) {
            $this->pdo->rollBack();
            Logger::error('Falha ao resetar senha', ['error' => $e->getMessage()]);
            return false;
        }

        return true;
    }

    private function purgeExpired(): void
    {
        $stmt = $this->pdo->prepare('DELETE FROM password_resets WHERE expires_at <= :now OR used_at IS NOT NULL');
        $stmt->execute(['now' => date('c')]);
    }

    private function sendResetEmail(string $email, string $name, string $appName, string $link): void
    {
        $subject = '[' . $appName . '] Redefinicao de senha';
        $safeName = trim($name) !== '' ? trim($name) : 'usuario';
        $ttlMinutes = (int)ceil($this->ttlSeconds / 60);

        $body = "Ola {$safeName},\n\n";
        $body .= "Recebemos um pedido para redefinir sua senha.\n";
        $body .= "Use o link abaixo para criar uma nova senha:\n\n";
        $body .= $link . "\n\n";
        $body .= "Este link expira em {$ttlMinutes} minutos e pode ser usado uma unica vez.\n";
        $body .= "Se voce nao solicitou essa alteracao, ignore este email.\n";

        $headers = [];
        $headers[] = 'From: ' . $this->mailFrom;
        $headers[] = 'MIME-Version: 1.0';
        $headers[] = 'Content-Type: text/plain; charset=UTF-8';

        $sent = @mail($email, $subject, $body, implode("\r\n", $headers));
        if (!$sent) {
            Logger::warning('Falha ao enviar email de reset', ['email' => $email]);
        }
    }

    private function sanitizeIp(string $ip): string
    {
        return filter_var($ip, FILTER_VALIDATE_IP) ? $ip : 'unknown';
    }

    private function jitter(): void
    {
        usleep(random_int(120000, 240000));
    }
}

