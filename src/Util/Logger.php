<?php
declare(strict_types=1);

namespace App\Util;

class Logger
{
    private const LEVEL_RANK = [
        'INFO' => 10,
        'WARNING' => 20,
        'ERROR' => 30,
    ];

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
        if (!self::shouldLog($level)) {
            return;
        }
        $line = [
            'time' => date('c'),
            'level' => $level,
            'message' => $message,
            'context' => self::sanitize($context),
        ];
        $target = $GLOBALS['config']['paths']['data'] . '/app.log';
        self::rotateIfNeeded($target);
        $payload = json_encode($line, JSON_UNESCAPED_UNICODE);
        @file_put_contents($target, $payload . PHP_EOL, FILE_APPEND | LOCK_EX);
    }

    private static function shouldLog(string $level): bool
    {
        $cfgLevel = strtoupper((string)($GLOBALS['config']['log_level'] ?? 'INFO'));
        $threshold = self::LEVEL_RANK[$cfgLevel] ?? self::LEVEL_RANK['INFO'];
        $current = self::LEVEL_RANK[strtoupper($level)] ?? self::LEVEL_RANK['INFO'];
        return $current >= $threshold;
    }

    private static function rotateIfNeeded(string $target): void
    {
        $maxBytes = (int)($GLOBALS['config']['log_max_bytes'] ?? (5 * 1024 * 1024));
        $maxFiles = (int)($GLOBALS['config']['log_max_files'] ?? 5);
        if ($maxBytes <= 0 || $maxFiles < 1) {
            return;
        }
        self::pruneArchives($target, $maxFiles);
        clearstatcache(true, $target);
        if (!is_file($target)) {
            return;
        }
        $size = @filesize($target);
        if (!is_int($size) || $size < $maxBytes) {
            return;
        }

        $highestArchive = $target . '.' . $maxFiles;
        if (is_file($highestArchive)) {
            @unlink($highestArchive);
        }
        for ($i = $maxFiles - 1; $i >= 1; $i--) {
            $from = $target . '.' . $i;
            $to = $target . '.' . ($i + 1);
            if (is_file($from)) {
                if (is_file($to)) {
                    @unlink($to);
                }
                @rename($from, $to);
            }
        }
        if (is_file($target . '.1')) {
            @unlink($target . '.1');
        }
        @rename($target, $target . '.1');
        self::pruneArchives($target, $maxFiles);
    }

    private static function pruneArchives(string $target, int $maxFiles): void
    {
        $pattern = $target . '.*';
        $matches = glob($pattern);
        if (!is_array($matches) || !$matches) {
            return;
        }
        $archives = [];
        foreach ($matches as $path) {
            if (!is_string($path)) {
                continue;
            }
            if (!preg_match('/\.(\d+)$/', $path, $m)) {
                continue;
            }
            $idx = (int)($m[1] ?? 0);
            if ($idx <= 0) {
                continue;
            }
            $archives[$idx] = $path;
        }
        if (!$archives) {
            return;
        }
        krsort($archives, SORT_NUMERIC);
        foreach ($archives as $idx => $path) {
            if ($idx <= $maxFiles) {
                continue;
            }
            @unlink($path);
        }
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
