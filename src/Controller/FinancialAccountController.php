<?php
declare(strict_types=1);

namespace App\Controller;

use App\Repository\Sqlite\SqliteEntryRepository;
use App\Repository\Sqlite\SqliteUserAccountRepository;
use App\Repository\Sqlite\SqliteUserCategoryRepository;
use App\Service\UserAccountService;
use App\Util\Response;

class FinancialAccountController extends BaseController
{
    public function list(): void
    {
        $uid = $this->requireAuth();
        $includeInactive = isset($_GET['include_inactive']) && $_GET['include_inactive'] === '1';
        $service = new UserAccountService($this->accountRepo(), $this->entryRepo(), $this->userCategoryRepo());
        Response::json($service->listForUser($uid, $includeInactive));
    }

    public function create(): void
    {
        $uid = $this->requireAuth();
        $service = new UserAccountService($this->accountRepo(), $this->entryRepo(), $this->userCategoryRepo());
        $item = $service->createForUser($uid, $this->jsonInput());
        Response::json($item, 201);
    }

    public function update(array $params): void
    {
        $uid = $this->requireAuth();
        $id = (int)($params['id'] ?? 0);
        $service = new UserAccountService($this->accountRepo(), $this->entryRepo(), $this->userCategoryRepo());
        $item = $service->updateForUser($id, $uid, $this->jsonInput());
        Response::json($item);
    }

    public function delete(array $params): void
    {
        $uid = $this->requireAuth();
        $id = (int)($params['id'] ?? 0);
        $service = new UserAccountService($this->accountRepo(), $this->entryRepo(), $this->userCategoryRepo());
        $result = $service->deleteForUser($id, $uid);
        Response::json($result);
    }

    public function listTags(): void
    {
        $uid = $this->requireAuth();
        $includeInactive = isset($_GET['include_inactive']) && $_GET['include_inactive'] === '1';
        $service = new UserAccountService($this->accountRepo(), $this->entryRepo(), $this->userCategoryRepo());
        $rows = $service->listForUser($uid, $includeInactive);
        $rows = array_map(function ($row) {
            $row['resource'] = 'tag';
            return $row;
        }, $rows);
        Response::json($rows);
    }

    public function createTag(): void
    {
        $uid = $this->requireAuth();
        $service = new UserAccountService($this->accountRepo(), $this->entryRepo(), $this->userCategoryRepo());
        $item = $service->createForUser($uid, $this->jsonInput());
        $item['resource'] = 'tag';
        Response::json($item, 201);
    }

    public function updateTag(array $params): void
    {
        $uid = $this->requireAuth();
        $id = (int)($params['id'] ?? 0);
        $service = new UserAccountService($this->accountRepo(), $this->entryRepo(), $this->userCategoryRepo());
        $item = $service->updateForUser($id, $uid, $this->jsonInput());
        $item['resource'] = 'tag';
        Response::json($item);
    }

    public function deleteTag(array $params): void
    {
        $uid = $this->requireAuth();
        $id = (int)($params['id'] ?? 0);
        $service = new UserAccountService($this->accountRepo(), $this->entryRepo(), $this->userCategoryRepo());
        $result = $service->deleteForUser($id, $uid);
        $result['resource'] = 'tag';
        Response::json($result);
    }

    private function accountRepo()
    {
        return new SqliteUserAccountRepository($this->db());
    }

    private function entryRepo()
    {
        return new SqliteEntryRepository($this->db());
    }

    private function userCategoryRepo()
    {
        return new SqliteUserCategoryRepository($this->db());
    }
}
