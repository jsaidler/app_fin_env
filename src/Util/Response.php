<?php
declare(strict_types=1);

namespace App\Util;

class Response
{
    public static function json(array $data, int $status = 200): void
    {
        if ($status >= 400) {
            $msg = $data['error'] ?? 'Erro';
            $level = $status >= 500 ? 'error' : 'warning';
            if (class_exists(Logger::class)) {
                Logger::$level($msg, [
                    'status' => $status,
                    'path' => $_SERVER['REQUEST_URI'] ?? '',
                    'payload' => $data,
                ]);
            }
        }
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
        exit;
    }

    public static function pdf(string $content, string $filename = 'relatorio.pdf'): void
    {
        header('Content-Type: application/pdf');
        header('Content-Disposition: attachment; filename="' . $filename . '"');
        echo $content;
        exit;
    }

    public static function text(string $content, string $filename = 'export.txt'): void
    {
        header('Content-Type: text/plain; charset=utf-8');
        header('Content-Disposition: attachment; filename="' . $filename . '"');
        echo $content;
        exit;
    }
}
