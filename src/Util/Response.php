<?php
declare(strict_types=1);

namespace App\Util;

class Response
{
    private static function applyRequestIdHeader(): void
    {
        $requestId = (string)($GLOBALS['request_id'] ?? '');
        if ($requestId !== '') {
            header('X-Request-Id: ' . $requestId);
        }
    }

    public static function json(array $data, int $status = 200): void
    {
        if ($status >= 400) {
            $msg = $data['error'] ?? 'Erro';
            $level = $status >= 500 ? 'error' : 'warning';
            if (class_exists(Logger::class)) {
                Logger::$level($msg, [
                    'status' => $status,
                    'path' => $_SERVER['REQUEST_URI'] ?? '',
                    'request_id' => (string)($GLOBALS['request_id'] ?? ''),
                    'payload' => $data,
                ]);
            }
        }
        http_response_code($status);
        self::applyRequestIdHeader();
        header('Content-Type: application/json; charset=utf-8');
        header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
        header('Pragma: no-cache');
        header('Expires: 0');
        $json = json_encode($data, JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE);
        if ($json === false) {
            if (class_exists(Logger::class)) {
                Logger::error('Falha ao serializar JSON', [
                    'status' => $status,
                    'path' => $_SERVER['REQUEST_URI'] ?? '',
                    'request_id' => (string)($GLOBALS['request_id'] ?? ''),
                    'json_error' => json_last_error_msg(),
                ]);
            }
            $json = '{"error":"Falha ao serializar resposta JSON"}';
            if ($status < 400) {
                http_response_code(500);
            }
        }
        echo $json;
        exit;
    }

    public static function pdf(string $content, string $filename = 'relatorio.pdf'): void
    {
        self::applyRequestIdHeader();
        header('Content-Type: application/pdf');
        header('Content-Disposition: attachment; filename="' . $filename . '"');
        echo $content;
        exit;
    }

    public static function text(string $content, string $filename = 'export.txt'): void
    {
        self::applyRequestIdHeader();
        header('Content-Type: text/plain; charset=utf-8');
        header('Content-Disposition: attachment; filename="' . $filename . '"');
        echo $content;
        exit;
    }
}
