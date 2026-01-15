<?php
declare(strict_types=1);

namespace App\Util;

class Logger
{
    public static function info(string $message, array $context = []): void
    {
        self::write('INFO', $message, $context);
    }

    public static function warning(string $message, array $context = []): void
    {
        self::write('WARNING', $message, $context);
    }

    public static function error(string $message, array $context = []): void
    {
        self::write('ERROR', $message, $context);
    }

    private static function write(string $level, string $message, array $context): void
    {
        $line = [
            'time' => date('c'),
            'level' => $level,
            'message' => $message,
            'context' => self::sanitize($context),
        ];
        $target = $GLOBALS['config']['paths']['data'] . '/app.log';
        $payload = json_encode($line, JSON_UNESCAPED_UNICODE);
        @file_put_contents($target, $payload . PHP_EOL, FILE_APPEND | LOCK_EX);
    }

    private static function sanitize(array $context): array
    {
        return array_map(function ($v) {
            if (is_string($v) && strlen($v) > 2048) {
                return substr($v, 0, 2048) . '...';
            }
            return $v;
        }, $context);
    }
}
