<?php
declare(strict_types=1);

namespace App\Controller;

use App\Repository\Sqlite\SqliteCategoryRepository;
use App\Repository\Sqlite\SqliteUserCategoryRepository;
use App\Service\CategoryService;
use App\Service\UserCategoryService;
use App\Util\Response;

class CategoryController extends BaseController
{
    public function list(): void
    {
        $uid = $this->requireAuth();
        $service = new UserCategoryService($this->categoryRepo(), $this->userCategoryRepo());
        Response::json($service->listMergedForUser($uid));
    }

    public function listUserCategories(): void
    {
        $uid = $this->requireAuth();
        $service = new UserCategoryService($this->categoryRepo(), $this->userCategoryRepo());
        Response::json($service->listUserCategories($uid));
    }

    public function createUserCategory(): void
    {
        $uid = $this->requireAuth();
        $service = new UserCategoryService($this->categoryRepo(), $this->userCategoryRepo());
        $item = $service->createForUser($uid, $this->jsonInput());
        Response::json($item, 201);
    }

    public function updateUserCategory(array $params): void
    {
        $uid = $this->requireAuth();
        $id = (int)($params['id'] ?? 0);
        $service = new UserCategoryService($this->categoryRepo(), $this->userCategoryRepo());
        $item = $service->updateForUser($id, $uid, $this->jsonInput());
        Response::json($item);
    }

    public function deleteUserCategory(array $params): void
    {
        $uid = $this->requireAuth();
        $id = (int)($params['id'] ?? 0);
        $service = new UserCategoryService($this->categoryRepo(), $this->userCategoryRepo());
        $result = $service->deleteForUser($id, $uid);
        Response::json($result);
    }

    private function categoryRepo()
    {
        return new SqliteCategoryRepository($this->db());
    }

    private function userCategoryRepo()
    {
        return new SqliteUserCategoryRepository($this->db());
    }
}
