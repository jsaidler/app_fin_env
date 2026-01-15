<?php
declare(strict_types=1);

namespace App\Controller;

use App\Service\UploadService;
use App\Util\Response;

class UploadController extends BaseController
{
    public function upload(): void
    {
        // Usuários autenticados também precisam anexar comprovantes nos lançamentos
        $uid = $this->requireAuth();
        $role = $this->authPayload['role'] ?? 'user';
        $targetId = $uid;
        if ($role === 'admin' && isset($_POST['user_id'])) {
            $candidate = (int)$_POST['user_id'];
            if ($candidate > 0) {
                $targetId = $candidate;
            }
        }
        $service = new UploadService($this->config['paths']['uploads']);
        try {
            $filename = $service->handle($_FILES['file'] ?? [], $targetId);
            Response::json(['file' => $filename], 201);
        } catch (\Throwable $e) {
            Response::json(['error' => $e->getMessage()], 400);
        }
    }
}
