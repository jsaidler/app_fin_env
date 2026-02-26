<?php
declare(strict_types=1);

namespace App\Service;

use PDO;
use App\Util\Response;

class AlterdataExportConfigService
{
    private PDO $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function list(): array
    {
        $defaults = self::defaultColumns();
        $stmt = $this->pdo->query('SELECT column_code, source_scope, source_field, fixed_value, updated_at FROM alterdata_export_columns');
        $rows = $stmt ? $stmt->fetchAll() : [];
        foreach ($rows as $row) {
            $column = strtoupper((string)($row['column_code'] ?? ''));
            if (!isset($defaults[$column])) {
                continue;
            }
            $defaults[$column] = [
                'column' => $column,
                'source_scope' => (string)($row['source_scope'] ?? $defaults[$column]['source_scope']),
                'source_field' => (string)($row['source_field'] ?? $defaults[$column]['source_field']),
                'fixed_value' => (string)($row['fixed_value'] ?? ''),
                'updated_at' => (string)($row['updated_at'] ?? ''),
            ];
        }
        return array_values($defaults);
    }

    public function get(string $column): array
    {
        $column = strtoupper(trim($column));
        $defaults = self::defaultColumns();
        if (!isset($defaults[$column])) {
            Response::json(['error' => 'Coluna invalida'], 422);
        }
        foreach ($this->list() as $item) {
            if (strtoupper((string)($item['column'] ?? '')) === $column) {
                return $item;
            }
        }
        return $defaults[$column];
    }

    public function upsert(string $column, array $input): array
    {
        $column = strtoupper(trim($column));
        $defaults = self::defaultColumns();
        if (!isset($defaults[$column])) {
            Response::json(['error' => 'Coluna invalida'], 422);
        }

        $scope = trim((string)($input['source_scope'] ?? $defaults[$column]['source_scope']));
        $field = trim((string)($input['source_field'] ?? $defaults[$column]['source_field']));
        $fixed = trim((string)($input['fixed_value'] ?? ''));

        $allowed = self::allowedFieldsByScope();
        if (!isset($allowed[$scope])) {
            Response::json(['error' => 'Origem invalida'], 422);
        }
        if (!in_array($field, $allowed[$scope], true)) {
            Response::json(['error' => 'Campo invalido para a origem selecionada'], 422);
        }
        if ($scope === 'fixed' && $fixed === '') {
            Response::json(['error' => 'Informe o valor fixo'], 422);
        }
        if ($scope !== 'fixed') {
            $fixed = '';
        }

        $now = date('c');
        $stmt = $this->pdo->prepare(
            'INSERT INTO alterdata_export_columns (column_code, source_scope, source_field, fixed_value, updated_at)
             VALUES (:column_code, :source_scope, :source_field, :fixed_value, :updated_at)
             ON CONFLICT(column_code) DO UPDATE SET
               source_scope = excluded.source_scope,
               source_field = excluded.source_field,
               fixed_value = excluded.fixed_value,
               updated_at = excluded.updated_at'
        );
        $stmt->execute([
            'column_code' => $column,
            'source_scope' => $scope,
            'source_field' => $field,
            'fixed_value' => $fixed,
            'updated_at' => $now,
        ]);

        return [
            'column' => $column,
            'source_scope' => $scope,
            'source_field' => $field,
            'fixed_value' => $fixed,
            'updated_at' => $now,
        ];
    }

    public static function defaultColumns(): array
    {
        return [
            'A' => ['column' => 'A', 'source_scope' => 'category', 'source_field' => 'alterdata_auto', 'fixed_value' => '', 'updated_at' => ''],
            'B' => ['column' => 'B', 'source_scope' => 'entry', 'source_field' => 'account_name', 'fixed_value' => '', 'updated_at' => ''],
            'C' => ['column' => 'C', 'source_scope' => 'entry', 'source_field' => 'type_code', 'fixed_value' => '', 'updated_at' => ''],
            'D' => ['column' => 'D', 'source_scope' => 'entry', 'source_field' => 'date', 'fixed_value' => '', 'updated_at' => ''],
            'E' => ['column' => 'E', 'source_scope' => 'entry', 'source_field' => 'amount', 'fixed_value' => '', 'updated_at' => ''],
            'F' => ['column' => 'F', 'source_scope' => 'category', 'source_field' => 'name', 'fixed_value' => '', 'updated_at' => ''],
            'G' => ['column' => 'G', 'source_scope' => 'entry', 'source_field' => 'description', 'fixed_value' => '', 'updated_at' => ''],
            'H' => ['column' => 'H', 'source_scope' => 'fixed', 'source_field' => 'value', 'fixed_value' => '', 'updated_at' => ''],
            'I' => ['column' => 'I', 'source_scope' => 'fixed', 'source_field' => 'value', 'fixed_value' => '', 'updated_at' => ''],
            'J' => ['column' => 'J', 'source_scope' => 'entry', 'source_field' => 'id', 'fixed_value' => '', 'updated_at' => ''],
        ];
    }

    public static function allowedFieldsByScope(): array
    {
        return [
            'entry' => ['date', 'amount', 'type', 'type_code', 'category', 'description', 'account_name'],
            'category' => ['name', 'type', 'alterdata_auto'],
            'user' => ['name', 'email', 'alterdata_code'],
            'fixed' => ['value'],
        ];
    }
}
