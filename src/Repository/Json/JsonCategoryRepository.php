<?php
declare(strict_types=1);

namespace App\Repository\Json;

use App\Domain\Category;
use App\Repository\CategoryRepositoryInterface;
use App\Storage\JsonStorage;

class JsonCategoryRepository implements CategoryRepositoryInterface
{
    private JsonStorage $storage;

    public function __construct(string $dataDir)
    {
        $this->storage = new JsonStorage(rtrim($dataDir, '/') . '/categories.json');
    }

    public function listAll(): array
    {
        $data = $this->load();
        return array_map(fn($c) => Category::fromArray($c), $data['categories']);
    }

    public function find(int $id): ?Category
    {
        $data = $this->load();
        foreach ($data['categories'] as $cat) {
            if ((int)$cat['id'] === $id) {
                return Category::fromArray($cat);
            }
        }
        return null;
    }

    public function create(string $name, string $type, ?string $alterdataAuto = null): Category
    {
        $data = $this->load();
        $id = ++$data['last_id'];
        $cat = [
            'id' => $id,
            'name' => $name,
            'type' => $type,
            'alterdata_auto' => $alterdataAuto ?? '',
            'created_at' => date('c'),
            'updated_at' => date('c'),
        ];
        $data['categories'][] = $cat;
        $this->storage->write($data);
        return Category::fromArray($cat);
    }

    public function update(int $id, array $data): ?Category
    {
        $stored = $this->load();
        foreach ($stored['categories'] as &$cat) {
            if ((int)$cat['id'] === $id) {
                $cat['name'] = $data['name'] ?? $cat['name'];
                $cat['type'] = $data['type'] ?? $cat['type'];
                if (array_key_exists('alterdata_auto', $data)) {
                    $cat['alterdata_auto'] = $data['alterdata_auto'] ?? '';
                }
                $cat['updated_at'] = date('c');
                $this->storage->write($stored);
                return Category::fromArray($cat);
            }
        }
        return null;
    }

    public function delete(int $id): bool
    {
        $stored = $this->load();
        $before = count($stored['categories']);
        $stored['categories'] = array_values(array_filter($stored['categories'], fn($c) => (int)$c['id'] !== $id));
        if (count($stored['categories']) < $before) {
            $this->storage->write($stored);
            return true;
        }
        return false;
    }

    private function load(): array
    {
        $data = $this->storage->read();
        if (!$data) {
            $data = [
                'last_id' => 0,
                'categories' => [
                    ['id' => 1, 'name' => 'Salario', 'type' => 'in', 'alterdata_auto' => '', 'created_at' => date('c'), 'updated_at' => date('c')],
                    ['id' => 2, 'name' => 'Investimentos', 'type' => 'in', 'alterdata_auto' => '', 'created_at' => date('c'), 'updated_at' => date('c')],
                    ['id' => 3, 'name' => 'Moradia', 'type' => 'out', 'alterdata_auto' => '', 'created_at' => date('c'), 'updated_at' => date('c')],
                    ['id' => 4, 'name' => 'Alimentacao', 'type' => 'out', 'alterdata_auto' => '', 'created_at' => date('c'), 'updated_at' => date('c')],
                ],
            ];
            $data['last_id'] = max(array_column($data['categories'], 'id'));
            $this->storage->write($data);
        }
        if (!isset($data['last_id'])) {
            $data['last_id'] = count($data['categories']);
        }
        return $data;
    }
}
