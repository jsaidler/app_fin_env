<?php
declare(strict_types=1);

namespace App\Storage;

use RuntimeException;

class JsonStorage
{
    private string $file;

    public function __construct(string $file)
    {
        $this->file = $file;
    }

    public function read(): array
    {
        if (!file_exists($this->file)) {
            return [];
        }
        $raw = file_get_contents($this->file);
        return $raw ? json_decode($raw, true, flags: JSON_THROW_ON_ERROR) : [];
    }

    public function write(array $data): void
    {
        $fp = fopen($this->file, 'c+');
        if (!$fp) {
            throw new RuntimeException('Cannot open storage file');
        }
        if (!flock($fp, LOCK_EX)) {
            throw new RuntimeException('Cannot lock storage');
        }
        ftruncate($fp, 0);
        fwrite($fp, json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT));
        fflush($fp);
        flock($fp, LOCK_UN);
        fclose($fp);
    }
}
