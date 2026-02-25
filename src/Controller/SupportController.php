<?php
declare(strict_types=1);

namespace App\Controller;

use App\Service\SupportService;
use App\Util\Response;

class SupportController extends BaseController
{
    public function threads(): void
    {
        $uid = $this->requireAuth();
        $service = new SupportService($this->db());
        $threads = $service->listThreadsForUser($uid);
        Response::json(['threads' => $threads]);
    }

    public function createThread(): void
    {
        $uid = $this->requireAuth();
        $input = $this->jsonInput();
        $subject = trim((string)($input['subject'] ?? ''));
        if ($subject === '') {
            Response::json(['error' => 'Assunto obrigatorio'], 422);
        }
        $service = new SupportService($this->db());
        $created = $service->createThread($uid, $subject, 'user');
        Response::json($created, 201);
    }

    public function messages(): void
    {
        $uid = $this->requireAuth();
        $threadId = isset($_GET['thread_id']) ? (int)$_GET['thread_id'] : 0;
        if ($threadId <= 0) {
            Response::json(['error' => 'Atendimento invalido'], 422);
        }
        $service = new SupportService($this->db());
        $thread = $service->findThread($threadId);
        if (!$thread || (int)$thread['user_id'] !== $uid) {
            Response::json(['error' => 'Atendimento invalido'], 404);
        }
        $messages = $service->listMessages($threadId, 'admin');
        Response::json(['messages' => $messages]);
    }

    public function createMessage(): void
    {
        $uid = $this->requireAuth();
        $input = $this->jsonInput();
        $threadId = (int)($input['thread_id'] ?? 0);
        $message = trim((string)($input['message'] ?? ''));
        $attachment = trim((string)($input['attachment_path'] ?? ''));
        if ($threadId <= 0 || ($message === '' && $attachment === '')) {
            Response::json(['error' => 'Mensagem invalida'], 422);
        }
        if ($attachment && !str_starts_with($attachment, $uid . '/')) {
            Response::json(['error' => 'Anexo invalido'], 422);
        }
        $service = new SupportService($this->db());
        $thread = $service->findThread($threadId);
        if (!$thread || (int)$thread['user_id'] !== $uid) {
            Response::json(['error' => 'Atendimento invalido'], 404);
        }
        $created = $service->sendMessage($threadId, $uid, 'user', $message, $attachment ?: null);
        Response::json($created, 201);
    }
}
