<?php
declare(strict_types=1);

namespace App\Controller;

use App\Repository\Sqlite\SqliteCategoryRepository;
use App\Service\CategoryService;
use App\Util\Response;

class CategoryController extends BaseController
{
    public function list(): void
    {
        // Disponibiliza as categorias definidas pelo admin para qualquer usuario autenticado
        $this->requireAuth();
        $service = new CategoryService($this->categoryRepo());
        Response::json($service->list());
    }

    private function categoryRepo()
    {
        return new SqliteCategoryRepository($this->db());
    }
}
