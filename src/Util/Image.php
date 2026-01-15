<?php
declare(strict_types=1);

namespace App\Util;

class Image
{
    public static function saveUploaded(array $file, string $uploadDir, ?int $userId = null): ?string
    {
        if (($file['error'] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_NO_FILE) {
            return null;
        }
        if (!$userId) {
            throw new \RuntimeException('Usuario invalido para upload');
        }
        if ($file['error'] !== UPLOAD_ERR_OK) {
            throw new \RuntimeException('Upload failed');
        }
        $maxBytes = 10 * 1024 * 1024;
        if (($file['size'] ?? 0) > $maxBytes) {
            throw new \RuntimeException('Arquivo muito grande (max 10MB)');
        }
        $mime = null;
        if (function_exists('finfo_open')) {
            $finfo = finfo_open(FILEINFO_MIME_TYPE);
            $mime = $finfo ? finfo_file($finfo, $file['tmp_name']) : null;
            if ($finfo) {
                finfo_close($finfo);
            }
        }
        if (!$mime && function_exists('getimagesize')) {
            $info = @getimagesize($file['tmp_name']);
            if ($info && isset($info['mime'])) {
                $mime = $info['mime'];
            }
        }
        if (!$mime && !empty($file['type'])) {
            $mime = $file['type'];
        }
        $allowed = ['image/jpeg', 'image/png', 'image/webp'];
        if (!in_array($mime, $allowed, true)) {
            throw new \RuntimeException('Formato de imagem nao permitido');
        }
        $resource = self::createImageResource($file['tmp_name'], $mime);
        if (!$resource) {
            throw new \RuntimeException('Imagem invalida ou suporte a imagem ausente no servidor');
        }
        $resource = self::resizeToLimit($resource, 1920, 1920);
        $compressed = self::compressToMax($resource, 500 * 1024);
        $uid = trim((string)$userId, '/');
        $targetDir = rtrim($uploadDir, '/\\') . '/' . $uid . '/uploads/';
        if (!is_dir($targetDir)) {
            mkdir($targetDir, 0775, true);
        }
        $name = bin2hex(random_bytes(8)) . '.jpg';
        $dest = $targetDir . $name;
        if (file_put_contents($dest, $compressed) === false) {
            throw new \RuntimeException('Erro ao salvar upload');
        }
        return $uid . '/uploads/' . $name;
    }

    private static function createImageResource(string $path, string $mime)
    {
        $fallback = function_exists('imagecreatefromstring')
            ? @imagecreatefromstring((string) @file_get_contents($path))
            : null;

        return match ($mime) {
            'image/jpeg' => function_exists('imagecreatefromjpeg') ? @imagecreatefromjpeg($path) : $fallback,
            'image/png' => function_exists('imagecreatefrompng') ? @imagecreatefrompng($path) : $fallback,
            'image/webp' => function_exists('imagecreatefromwebp') ? @imagecreatefromwebp($path) : $fallback,
            default => $fallback,
        };
    }

    private static function resizeToLimit($img, int $maxW, int $maxH)
    {
        $w = imagesx($img);
        $h = imagesy($img);
        if ($w <= $maxW && $h <= $maxH) {
            return $img;
        }
        $ratio = min($maxW / $w, $maxH / $h);
        $nw = (int) floor($w * $ratio);
        $nh = (int) floor($h * $ratio);
        $dst = imagecreatetruecolor($nw, $nh);
        imagecopyresampled($dst, $img, 0, 0, 0, 0, $nw, $nh, $w, $h);
        return $dst;
    }

    private static function compressToMax($img, int $maxBytes): string
    {
        if (!function_exists('imagejpeg')) {
            throw new \RuntimeException('Biblioteca de imagem (GD) ausente');
        }
        $quality = 90;
        $data = '';
        do {
            ob_start();
            imagejpeg($img, null, $quality);
            $data = ob_get_clean();
            if (strlen($data) <= $maxBytes || $quality <= 50) {
                break;
            }
            $quality -= 5;
        } while (true);
        return $data;
    }
}
