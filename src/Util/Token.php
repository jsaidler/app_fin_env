<?php
declare(strict_types=1);

namespace App\Util;

class Token
{
    public static function issue(array $payload, string $secret, int $ttlSeconds): string
    {
        $payload['exp'] = time() + $ttlSeconds;
        $data = base64_encode(json_encode($payload));
        $sig = hash_hmac('sha256', $data, $secret);
        return $data . '.' . $sig;
    }

    public static function verify(string $token, string $secret): ?array
    {
        [$data, $sig] = explode('.', $token) + [null, null];
        if (!$data || !$sig) {
            return null;
        }
        $expected = hash_hmac('sha256', $data, $secret);
        if (!hash_equals($expected, $sig)) {
            return null;
        }
        $payload = json_decode(base64_decode($data), true);
        if (!$payload || ($payload['exp'] ?? 0) < time()) {
            return null;
        }
        return $payload;
    }
}
