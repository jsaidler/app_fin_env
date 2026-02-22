<?php
declare(strict_types=1);

namespace App\Util;

final class LoginThrottle
{
    private string $stateFile;
    private int $limit;
    private int $windowSeconds;

    public function __construct(string $stateFile, int $limit = 8, int $windowSeconds = 600)
    {
        $this->stateFile = $stateFile;
        $this->limit = max(1, $limit);
        $this->windowSeconds = max(60, $windowSeconds);
    }

    public function consume(string $key): array
    {
        return $this->mutate(function (array $state, int $now) use ($key): array {
            $cutoff = $now - $this->windowSeconds;
            foreach ($state as $k => $attempts) {
                $state[$k] = $this->filterRecent($attempts, $cutoff);
                if ($state[$k] === []) {
                    unset($state[$k]);
                }
            }

            $attempts = $state[$key] ?? [];
            if (count($attempts) >= $this->limit) {
                $oldest = min($attempts);
                $retryAfter = max(1, $this->windowSeconds - ($now - (int)$oldest));
                return [
                    'state' => $state,
                    'result' => ['allowed' => false, 'retry_after' => $retryAfter],
                ];
            }

            $attempts[] = $now;
            $state[$key] = $attempts;

            return [
                'state' => $state,
                'result' => ['allowed' => true, 'retry_after' => 0],
            ];
        });
    }

    public function clear(string $key): void
    {
        $this->mutate(function (array $state, int $now) use ($key): array {
            unset($state[$key]);
            return ['state' => $state, 'result' => null];
        });
    }

    private function filterRecent(mixed $attempts, int $cutoff): array
    {
        if (!is_array($attempts)) {
            return [];
        }
        return array_values(array_filter($attempts, function ($ts) use ($cutoff): bool {
            return is_int($ts) && $ts >= $cutoff;
        }));
    }

    private function mutate(callable $callback): mixed
    {
        $dir = dirname($this->stateFile);
        if (!is_dir($dir)) {
            mkdir($dir, 0775, true);
        }

        $fp = fopen($this->stateFile, 'c+');
        if ($fp === false) {
            return ['allowed' => true, 'retry_after' => 0];
        }

        try {
            if (!flock($fp, LOCK_EX)) {
                return ['allowed' => true, 'retry_after' => 0];
            }

            $raw = stream_get_contents($fp);
            $decoded = is_string($raw) && $raw !== '' ? json_decode($raw, true) : [];
            $state = is_array($decoded) ? $decoded : [];
            $now = time();

            $payload = $callback($state, $now);
            $nextState = is_array($payload['state'] ?? null) ? $payload['state'] : [];
            $result = $payload['result'] ?? null;

            ftruncate($fp, 0);
            rewind($fp);
            fwrite($fp, json_encode($nextState, JSON_UNESCAPED_UNICODE));
            fflush($fp);

            return $result;
        } finally {
            flock($fp, LOCK_UN);
            fclose($fp);
        }
    }
}
