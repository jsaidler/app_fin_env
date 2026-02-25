<?php
declare(strict_types=1);

namespace App\Controller;

use App\Repository\Sqlite\SqliteCategoryRepository;
use App\Repository\Sqlite\SqliteEntryRepository;
use App\Repository\Sqlite\SqliteUserCategoryRepository;
use App\Service\CategoryService;
use App\Service\UserCategoryService;
use App\Util\Response;

class CategoryController extends BaseController
{
    public function list(): void
    {
        $uid = $this->requireAuth();
        $service = new UserCategoryService($this->categoryRepo(), $this->userCategoryRepo(), $this->entryRepo());
        Response::json($service->listMergedForUser($uid));
    }

    public function listUserCategories(): void
    {
        $uid = $this->requireAuth();
        $service = new UserCategoryService($this->categoryRepo(), $this->userCategoryRepo(), $this->entryRepo());
        Response::json($service->listUserCategories($uid));
    }

    public function createUserCategory(): void
    {
        $uid = $this->requireAuth();
        $service = new UserCategoryService($this->categoryRepo(), $this->userCategoryRepo(), $this->entryRepo());
        $item = $service->createForUser($uid, $this->jsonInput());
        Response::json($item, 201);
    }

    public function updateUserCategory(array $params): void
    {
        $uid = $this->requireAuth();
        $id = (int)($params['id'] ?? 0);
        $service = new UserCategoryService($this->categoryRepo(), $this->userCategoryRepo(), $this->entryRepo());
        $item = $service->updateForUser($id, $uid, $this->jsonInput());
        Response::json($item);
    }

    public function deleteUserCategory(array $params): void
    {
        $uid = $this->requireAuth();
        $id = (int)($params['id'] ?? 0);
        $service = new UserCategoryService($this->categoryRepo(), $this->userCategoryRepo(), $this->entryRepo());
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

    private function entryRepo()
    {
        return new SqliteEntryRepository($this->db());
    }
}
