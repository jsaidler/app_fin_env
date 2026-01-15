<?php
declare(strict_types=1);

namespace App\Service;

use ZipArchive;

class BackupService
{
    private string $dataDir;
    private ?string $email;
    private string $stateFile;

    public function __construct(string $dataDir, ?string $email, ?string $stateFile = null)
    {
        $this->dataDir = rtrim($dataDir, DIRECTORY_SEPARATOR . '/');
        $this->email = $email ? trim($email) : null;
        $this->stateFile = $stateFile ?: ($this->dataDir . '/.backup_state.json');
    }

    public function maybeSend(): void
    {
        if (!$this->email || !is_dir($this->dataDir)) {
            return;
        }
        $today = date('Y-m-d');
        $last = $this->loadLast();
        if ($last === $today) {
            return;
        }
        $tmpZip = $this->createArchive();
        if (!$tmpZip) {
            return;
        }
        $parts = $this->splitIfNeeded($tmpZip, 20 * 1024 * 1024);
        foreach ($parts as $idx => $file) {
            $this->sendMail($file, count($parts) > 1 ? $idx + 1 : null);
        }
        $this->saveLast($today);
        foreach ($parts as $file) {
            @unlink($file);
        }
    }

    private function createArchive(): ?string
    {
        $zipPath = sys_get_temp_dir() . '/backup-' . date('Ymd-His') . '.zip';
        $zip = new ZipArchive();
        if ($zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
            return null;
        }
        $this->addDirToZip($zip, $this->dataDir, strlen($this->dataDir) + 1);
        $zip->close();
        return $zipPath;
    }

    private function addDirToZip(ZipArchive $zip, string $dir, int $stripLen): void
    {
        $files = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($dir, \FilesystemIterator::SKIP_DOTS)
        );
        foreach ($files as $file) {
            $path = (string) $file;
            if (is_dir($path)) {
                continue;
            }
            $local = substr($path, $stripLen);
            $zip->addFile($path, $local);
        }
    }

    /**
     * @return string[]
     */
    private function splitIfNeeded(string $zipPath, int $maxBytes): array
    {
        $size = filesize($zipPath) ?: 0;
        if ($size <= $maxBytes) {
            return [$zipPath];
        }
        $parts = [];
        $data = file_get_contents($zipPath);
        if ($data === false) {
            return [$zipPath];
        }
        $chunks = str_split($data, $maxBytes);
        foreach ($chunks as $i => $chunk) {
            $partPath = $zipPath . '.part' . ($i + 1);
            file_put_contents($partPath, $chunk);
            $parts[] = $partPath;
        }
        @unlink($zipPath);
        return $parts;
    }

    private function sendMail(string $filePath, ?int $part = null): void
    {
        $to = $this->email;
        $subject = 'Backup diário Caixa Simples' . ($part ? " (parte {$part})" : '');
        $boundary = md5((string) microtime(true));
        $headers = [];
        $headers[] = 'From: backup@caixasimples.local';
        $headers[] = 'MIME-Version: 1.0';
        $headers[] = 'Content-Type: multipart/mixed; boundary="' . $boundary . '"';

        $body = "--{$boundary}\r\n";
        $body .= "Content-Type: text/plain; charset=\"UTF-8\"\r\n\r\n";
        $body .= "Segue backup diário da pasta data.\r\n";
        $body .= "--{$boundary}\r\n";
        $body .= 'Content-Type: application/zip; name="' . basename($filePath) . "\"\r\n";
        $body .= "Content-Transfer-Encoding: base64\r\n";
        $body .= 'Content-Disposition: attachment; filename="' . basename($filePath) . "\"\r\n\r\n";
        $body .= chunk_split(base64_encode((string) file_get_contents($filePath))) . "\r\n";
        $body .= "--{$boundary}--";

        @mail($to, $subject, $body, implode("\r\n", $headers));
    }

    private function loadLast(): ?string
    {
        if (!is_file($this->stateFile)) {
            return null;
        }
        $data = json_decode(file_get_contents($this->stateFile) ?: 'null', true);
        return is_array($data) ? ($data['last'] ?? null) : null;
    }

    private function saveLast(string $day): void
    {
        $dir = dirname($this->stateFile);
        if (!is_dir($dir)) {
            mkdir($dir, 0775, true);
        }
        file_put_contents($this->stateFile, json_encode(['last' => $day]));
    }
}
