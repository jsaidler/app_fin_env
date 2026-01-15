<?php
declare(strict_types=1);

namespace App\Service;

use App\Repository\EntryRepositoryInterface;

class ExportService
{
    private EntryRepositoryInterface $entries;

    public function __construct(EntryRepositoryInterface $entries)
    {
        $this->entries = $entries;
    }

    public function pdfReport(int $userId, array $filters = []): string
    {
        $entries = $this->entries->listByUser($userId);
        $month = $filters['month'] ?? '';
        $start = $filters['start'] ?? '';
        $end = $filters['end'] ?? '';
        $type = $filters['type'] ?? 'all';
        $filtered = array_values(array_filter($entries, function ($entry) use ($month, $type, $start, $end) {
            $okType = $type === 'all' ? true : $entry->type === $type;
            $okMonth = $month ? str_starts_with($entry->date, $month) : true;
            $okStart = $start ? $entry->date >= $start : true;
            $okEnd = $end ? $entry->date <= $end : true;
            return $okType && $okMonth && $okStart && $okEnd && !$entry->deletedAt && !$entry->needsReview;
        }));
        usort($filtered, fn($a, $b) => strcmp($a->date, $b->date));
        return $this->renderTablePdf($filtered, $month, $type, $start, $end);
    }

    private function renderTablePdf(array $entries, string $month, string $type, string $start, string $end): string
    {
        require_once __DIR__ . '/../Util/fpdf.php';
        $pdf = new \FPDF('P', 'mm', 'A4');
        $pdf->AddPage();
        $pdf->SetFont('Arial', 'B', 14);
        $pdf->Cell(0, 10, $this->sanitize('Relatorio de movimentacoes'), 0, 1, 'L');
        $pdf->SetFont('Arial', '', 10);
        $period = $this->formatPeriodLabel($month, $start, $end);
        $typeLabel = $type === 'in' ? 'Somente entradas' : ($type === 'out' ? 'Somente saídas' : 'Entradas e saídas');
        $pdf->Cell(0, 6, $this->sanitize("Periodo: {$period} | Filtro: {$typeLabel}"), 0, 1, 'L');
        $pdf->Ln(2);

        $w = [24, 45, 22, 28, 71]; // total 190mm
        $headers = ['Data', 'Categoria', 'Tipo', 'Valor', 'Descrição'];

        $pdf->SetFillColor(234, 241, 255);
        $pdf->SetTextColor(15, 23, 42);
        $pdf->SetDrawColor(207, 214, 229);
        $pdf->SetLineWidth(0.2);
        $pdf->SetFont('Arial', 'B', 10);
        foreach ($headers as $i => $h) {
            $pdf->Cell($w[$i], 8, $this->sanitize($h), 1, 0, 'L', true);
        }
        $pdf->Ln();

        $pdf->SetFont('Arial', '', 9);
        foreach ($entries as $entry) {
            $row = [
                $this->formatDate($entry->date),
                $entry->category,
                $entry->type === 'in' ? 'Entrada' : 'Saída',
                $this->formatMoney($entry->amount),
                $entry->description ?: '',
            ];
            $this->row($pdf, $w, $row);
        }

        return $pdf->Output('S');
    }

    private function row(\FPDF $pdf, array $w, array $data): void
    {
        $nb = 0;
        foreach ($data as $i => $txt) {
            $nb = max($nb, $this->nbLines($pdf, $w[$i], $this->sanitize($txt)));
        }
        $h = 6 * $nb;
        $this->checkPageBreak($pdf, $h);
        foreach ($data as $i => $txt) {
            $x = $pdf->GetX();
            $y = $pdf->GetY();
            $pdf->Rect($x, $y, $w[$i], $h);
            $pdf->MultiCell($w[$i], 6, $this->sanitize($txt), 0, $i === 3 ? 'R' : 'L');
            $pdf->SetXY($x + $w[$i], $y);
        }
        $pdf->Ln($h);
    }

    private function checkPageBreak(\FPDF $pdf, float $h): void
    {
        // FPDF nativo não expõe getter para margem inferior; usamos o valor padrão de margem (10mm) se não houver método público.
        $bottomMargin = 10;
        $bottom = $pdf->GetPageHeight() - $bottomMargin;
        if ($pdf->GetY() + $h > $bottom) {
            $pdf->AddPage($pdf->CurOrientation);
            $pdf->SetFont('Arial', 'B', 10);
            // Reescreve header da tabela
            $w = [24, 45, 22, 28, 71];
            $headers = ['Data', 'Categoria', 'Tipo', 'Valor', 'Descrição'];
            $pdf->SetFillColor(234, 241, 255);
            $pdf->SetTextColor(15, 23, 42);
            $pdf->SetDrawColor(207, 214, 229);
            $pdf->SetLineWidth(0.2);
            foreach ($headers as $i => $hcell) {
                $pdf->Cell($w[$i], 8, $this->sanitize($hcell), 1, 0, 'L', true);
            }
            $pdf->Ln();
            $pdf->SetFont('Arial', '', 9);
        }
    }

    private function nbLines(\FPDF $pdf, float $w, string $txt): int
    {
        $margin = 2; // aproxima cMargin padrão
        $maxWidth = ($w - 2 * $margin);
        $lines = 1;
        $current = 0.0;
        $words = preg_split('/(\s+)/', $txt, -1, PREG_SPLIT_DELIM_CAPTURE);
        foreach ($words as $word) {
            $wordWidth = $pdf->GetStringWidth($word);
            if ($current + $wordWidth <= $maxWidth) {
                $current += $wordWidth;
            } else {
                if (trim($word) === '') {
                    continue;
                }
                if ($wordWidth > $maxWidth) {
                    $chars = preg_split('//u', $word, -1, PREG_SPLIT_NO_EMPTY);
                    foreach ($chars as $ch) {
                        $cw = $pdf->GetStringWidth($ch);
                        if ($current + $cw > $maxWidth) {
                            $lines++;
                            $current = $cw;
                        } else {
                            $current += $cw;
                        }
                    }
                } else {
                    $lines++;
                    $current = $wordWidth;
                }
            }
        }
        return max(1, $lines);
    }

    private function formatMoney(float $v): string
    {
        return 'R$ ' . number_format($v, 2, ',', '.');
    }

    private function formatDate(string $v): string
    {
        $ts = strtotime($v);
        if ($ts === false) return $v;
        return date('d/m/Y', $ts);
    }

    private function formatPeriodLabel(string $month, string $start, string $end): string
    {
        if ($start || $end) {
            $startLabel = $start ? $this->formatMonth(substr($start, 0, 7)) : 'Inicio aberto';
            $endLabel = $end ? $this->formatMonth(substr($end, 0, 7)) : 'Fim aberto';
            if ($startLabel === $endLabel) return $startLabel;
            return $startLabel . ' a ' . $endLabel;
        }
        return $month ? $this->formatMonth($month) : 'Todos os meses';
    }

    private function formatMonth(string $month): string
    {
        $ts = strtotime($month . '-01');
        if ($ts === false) return $month;
        return date('m/Y', $ts);
    }

    private function strLen(string $text): int
    {
        return function_exists('mb_strlen') ? mb_strlen($text) : strlen($text);
    }

    private function strSub(string $text, int $start, int $length): string
    {
        if (function_exists('mb_substr')) return mb_substr($text, $start, $length);
        return substr($text, $start, $length);
    }

    private function sanitize(string $text): string
    {
        $safe = iconv('UTF-8', 'ISO-8859-1//TRANSLIT', $text);
        if ($safe === false) $safe = $text;
        return $safe;
    }
}
