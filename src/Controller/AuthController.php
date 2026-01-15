<?php
declare(strict_types=1);

namespace App\Controller;

use App\Service\AuthService;
use App\Util\Response;

class AuthController extends BaseController
{
    public function register(): void
    {
        $service = new AuthService($this->userRepo(), $this->config['secret'], $this->config['token_ttl']);
        $result = $service->register($this->jsonInput());
        Response::json($result, 201);
    }

    public function login(): void
    {
        $service = new AuthService($this->userRepo(), $this->config['secret'], $this->config['token_ttl']);
        $result = $service->login($this->jsonInput());
        Response::json($result);
    }
}
