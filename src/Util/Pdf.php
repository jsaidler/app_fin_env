<?php
declare(strict_types=1);

namespace App\Util;

class Pdf
{
    // Minimal PDF generator for simple text-based reports.
    public static function simpleReport(string $title, array $lines): string
    {
        $objects = [];
        $objects[] = "1 0 obj<< /Type /Catalog /Pages 2 0 R >>endobj";
        $objects[] = "2 0 obj<< /Type /Pages /Kids [3 0 R] /Count 1 >>endobj";
        $content = self::buildContent($title, $lines);
        $len = strlen($content);
        $objects[] = "3 0 obj<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>endobj";
        $objects[] = "4 0 obj<< /Length $len >>stream\n$content\nendstream endobj";
        $objects[] = "5 0 obj<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>endobj";

        $pdf = "%PDF-1.4\n";
        $offsets = [];
        foreach ($objects as $obj) {
            $offsets[] = strlen($pdf);
            $pdf .= $obj . "\n";
        }
        $xref = strlen($pdf);
        $pdf .= "xref\n0 " . (count($objects) + 1) . "\n";
        $pdf .= "0000000000 65535 f \n";
        foreach ($offsets as $off) {
            $pdf .= sprintf("%010d 00000 n \n", $off);
        }
        $pdf .= "trailer<< /Size " . (count($objects) + 1) . " /Root 1 0 R >>\nstartxref\n$xref\n%%EOF";
        return $pdf;
    }

    private static function buildContent(string $title, array $lines): string
    {
        $y = 800;
        $buf = "BT /F1 18 Tf 50 $y Td ($title) Tj ET\n";
        $y -= 28;
        $buf .= "BT /F1 12 Tf 50 $y Td (Gerado em " . date('d/m/Y H:i') . ") Tj ET\n";
        $y -= 22;
        foreach ($lines as $line) {
            $safe = self::escape($line);
            $buf .= "BT /F1 12 Tf 50 $y Td ($safe) Tj ET\n";
            $y -= 18;
            if ($y < 60) {
                break; // simple one-page safeguard
            }
        }
        return $buf;
    }

    private static function escape(string $text): string
    {
        // PDF text operators exigem ASCII/Latin-1. Translitera para evitar caracteres inválidos.
        $safe = iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $text);
        if ($safe === false) {
            $safe = $text;
        }
        $safe = preg_replace('/[^\x20-\x7E]/', '', $safe) ?? $safe;
        return str_replace(['\\', '(', ')'], ['\\\\', '\\(', '\\)'], $safe);
    }
}
