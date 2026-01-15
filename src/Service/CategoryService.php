<?php
declare(strict_types=1);

namespace App\Service;

use App\Repository\CategoryRepositoryInterface;
use App\Util\Response;
use App\Util\Validator;

class CategoryService
{
    private CategoryRepositoryInterface $categories;

    public function __construct(CategoryRepositoryInterface $categories)
    {
        $this->categories = $categories;
    }

    public function list(): array
    {
        return array_map(fn($c) => $c->toArray(), $this->categories->listAll());
    }

    public function create(array $input): array
    {
        $name = trim($input['name'] ?? '');
        $type = $input['type'] ?? '';
        $alterdataAuto = isset($input['alterdata_auto']) ? trim((string)$input['alterdata_auto']) : null;
        if (!Validator::nonEmpty($name) || !in_array($type, ['in', 'out'], true)) {
            Response::json(['error' => 'Dados de categoria invalidos'], 422);
        }
        $cat = $this->categories->create($name, $type, $alterdataAuto);
        return $cat->toArray();
    }

    public function update(int $id, array $input): array
    {
        $data = [];
        if (isset($input['name'])) {
            if (!Validator::nonEmpty($input['name'])) {
                Response::json(['error' => 'Nome invalido'], 422);
            }
            $data['name'] = trim($input['name']);
        }
        if (isset($input['type'])) {
            if (!in_array($input['type'], ['in', 'out'], true)) {
                Response::json(['error' => 'Tipo invalido'], 422);
            }
            $data['type'] = $input['type'];
        }
        if (array_key_exists('alterdata_auto', $input)) {
            $data['alterdata_auto'] = trim((string)$input['alterdata_auto']);
        }
        $cat = $this->categories->update($id, $data);
        if (!$cat) {
            Response::json(['error' => 'Categoria nao encontrada'], 404);
        }
        return $cat->toArray();
    }

    public function delete(int $id): array
    {
        $ok = $this->categories->delete($id);
        if (!$ok) {
            Response::json(['error' => 'Categoria nao encontrada'], 404);
        }
        return ['deleted' => true];
    }
}
