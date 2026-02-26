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
        $service = new SupportService($this->db(), $this->config['paths']['uploads'] ?? null);
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
        $service = new SupportService($this->db(), $this->config['paths']['uploads'] ?? null);
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
        $service = new SupportService($this->db(), $this->config['paths']['uploads'] ?? null);
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
        $attachmentType = trim((string)($input['attachment_type'] ?? ''));
        $attachmentRefType = trim((string)($input['attachment_ref_type'] ?? ''));
        $attachmentRefId = isset($input['attachment_ref_id']) ? (int)$input['attachment_ref_id'] : 0;
        $attachmentTitle = trim((string)($input['attachment_title'] ?? ''));
        if ($threadId <= 0 || ($message === '' && $attachment === '' && $attachmentRefId <= 0)) {
            Response::json(['error' => 'Mensagem invalida'], 422);
        }
        if ($attachment && !str_starts_with($attachment, $uid . '/')) {
            Response::json(['error' => 'Anexo invalido'], 422);
        }
        $attachmentMeta = $this->normalizeAttachmentMeta($uid, $attachmentType, $attachment, $attachmentRefType, $attachmentRefId, $attachmentTitle);
        $service = new SupportService($this->db(), $this->config['paths']['uploads'] ?? null);
        $thread = $service->findThread($threadId);
        if (!$thread || (int)$thread['user_id'] !== $uid) {
            Response::json(['error' => 'Atendimento invalido'], 404);
        }
        $created = $service->sendMessage($threadId, $uid, 'user', $message, $attachment ?: null, $attachmentMeta);
        Response::json($created, 201);
    }

    private function normalizeAttachmentMeta(
        int $userId,
        string $attachmentType,
        string $attachmentPath,
        string $attachmentRefType,
        int $attachmentRefId,
        string $attachmentTitle
    ): array {
        $allowedTypes = ['file', 'screenshot', 'audio', 'entry', 'category', 'category_global', 'account', 'recurrence'];
        $type = in_array($attachmentType, $allowedTypes, true) ? $attachmentType : '';
        $refType = in_array($attachmentRefType, ['entry', 'category', 'category_global', 'account', 'recurrence'], true) ? $attachmentRefType : '';
        $refId = $attachmentRefId > 0 ? $attachmentRefId : 0;

        if ($type === 'audio' && $attachmentPath === '') {
            Response::json(['error' => 'Anexo de áudio inválido'], 422);
        }
        if (($type === 'file' || $type === 'screenshot') && $attachmentPath === '') {
            Response::json(['error' => 'Anexo de arquivo inválido'], 422);
        }
        if (in_array($type, ['entry', 'category', 'category_global', 'account', 'recurrence'], true)) {
            if ($refType === '') {
                $refType = $type;
            }
            if ($refId <= 0) {
                Response::json(['error' => 'Referência inválida'], 422);
            }
            $this->assertReferenceOwnership($userId, $refType, $refId);
        } elseif ($refType !== '' || $refId > 0) {
            if ($refType === '' || $refId <= 0) {
                Response::json(['error' => 'Referência inválida'], 422);
            }
            $this->assertReferenceOwnership($userId, $refType, $refId);
            if ($type === '') {
                $type = $refType;
            }
        }

        return [
            'type' => $type !== '' ? $type : null,
            'ref_type' => $refType !== '' ? $refType : null,
            'ref_id' => $refId > 0 ? $refId : null,
            'title' => $attachmentTitle !== '' ? $attachmentTitle : null,
        ];
    }

    private function assertReferenceOwnership(int $userId, string $refType, int $refId): void
    {
        $pdo = $this->db();
        $map = [
            'entry' => ['table' => 'entries', 'user_col' => 'user_id'],
            'category' => ['table' => 'user_categories', 'user_col' => 'user_id'],
            'account' => ['table' => 'user_accounts', 'user_col' => 'user_id'],
            'recurrence' => ['table' => 'recurrences', 'user_col' => 'user_id'],
        ];
        if ($refType === 'category_global') {
            $stmt = $pdo->prepare('SELECT id FROM categories WHERE id = :id LIMIT 1');
            $stmt->execute(['id' => $refId]);
            $exists = (int)($stmt->fetchColumn() ?: 0);
            if ($exists <= 0) {
                Response::json(['error' => 'Referência inválida para este usuário'], 422);
            }
            return;
        }
        if (!isset($map[$refType])) {
            Response::json(['error' => 'Referência inválida'], 422);
        }
        $table = $map[$refType]['table'];
        $userCol = $map[$refType]['user_col'];
        $stmt = $pdo->prepare("SELECT id FROM {$table} WHERE id = :id AND {$userCol} = :uid LIMIT 1");
        $stmt->execute(['id' => $refId, 'uid' => $userId]);
        $exists = (int)($stmt->fetchColumn() ?: 0);
        if ($exists <= 0) {
            Response::json(['error' => 'Referência inválida para este usuário'], 422);
        }
    }
}
