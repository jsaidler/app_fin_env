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
        Response::json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'theme' => $user->theme,
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
