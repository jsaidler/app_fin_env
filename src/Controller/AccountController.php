<?php
declare(strict_types=1);

namespace App\Controller;

use App\Service\AccountService;
use App\Util\Response;

class AccountController extends BaseController
{
    public function profile(): void
    {
        $uid = $this->requireAuth();
        $user = $this->userRepo()->findById($uid);
        if (!$user) {
            Response::json(['error' => 'Usuário não encontrado'], 404);
        }
        $impersonation = ['active' => false];
        $impBy = isset($this->authPayload['imp_by']) ? (int)$this->authPayload['imp_by'] : 0;
        if ($impBy > 0) {
            $adminUser = $this->userRepo()->findById($impBy);
            $impersonation = [
                'active' => true,
                'admin' => [
                    'id' => $impBy,
                    'name' => $adminUser ? $adminUser->name : '',
                    'email' => $adminUser ? $adminUser->email : '',
                ],
            ];
        }
        Response::json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'alterdata_code' => $user->alterdataCode,
            'theme' => $user->theme,
            'impersonation' => $impersonation,
        ]);
    }

    public function updateProfile(): void
    {
        $uid = $this->requireAuth();
        $service = new AccountService($this->userRepo());
        $pref = $service->updatePreferences($uid, $this->jsonInput());
        Response::json($pref);
    }

    public function updatePassword(): void
    {
        $uid = $this->requireAuth();
        $service = new AccountService($this->userRepo());
        $service->updatePassword($uid, $this->jsonInput());
        Response::json(['ok' => true]);
    }

    public function preferences(): void
    {
        $uid = $this->requireAuth();
        $service = new AccountService($this->userRepo());
        $pref = $service->updatePreferences($uid, $this->jsonInput());
        Response::json($pref);
    }

}
