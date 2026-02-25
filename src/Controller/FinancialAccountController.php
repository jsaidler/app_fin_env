<?php
declare(strict_types=1);

namespace App\Controller;

use App\Repository\Sqlite\SqliteEntryRepository;
use App\Repository\Sqlite\SqliteUserAccountRepository;
use App\Service\UserAccountService;
use App\Util\Response;

class FinancialAccountController extends BaseController
{
    public function list(): void
    {
        $uid = $this->requireAuth();
        if (($this->authPayload['role'] ?? 'user') === 'admin') {
            Response::json(['error' => 'Administradores não usam contas/cartões de lançamentos'], 403);
        }
        $includeInactive = isset($_GET['include_inactive']) && $_GET['include_inactive'] === '1';
        $service = new UserAccountService($this->accountRepo(), $this->entryRepo());
        Response::json($service->listForUser($uid, $includeInactive));
    }

    public function create(): void
    {
        $uid = $this->requireAuth();
        if (($this->authPayload['role'] ?? 'user') === 'admin') {
            Response::json(['error' => 'Administradores não usam contas/cartões de lançamentos'], 403);
        }
        $service = new UserAccountService($this->accountRepo(), $this->entryRepo());
        $item = $service->createForUser($uid, $this->jsonInput());
        Response::json($item, 201);
    }

    public function update(array $params): void
    {
        $uid = $this->requireAuth();
        if (($this->authPayload['role'] ?? 'user') === 'admin') {
            Response::json(['error' => 'Administradores não usam contas/cartões de lançamentos'], 403);
        }
        $id = (int)($params['id'] ?? 0);
        $service = new UserAccountService($this->accountRepo(), $this->entryRepo());
        $item = $service->updateForUser($id, $uid, $this->jsonInput());
        Response::json($item);
    }

    public function delete(array $params): void
    {
        $uid = $this->requireAuth();
        if (($this->authPayload['role'] ?? 'user') === 'admin') {
            Response::json(['error' => 'Administradores não usam contas/cartões de lançamentos'], 403);
        }
        $id = (int)($params['id'] ?? 0);
        $service = new UserAccountService($this->accountRepo(), $this->entryRepo());
        $result = $service->deleteForUser($id, $uid);
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
}

