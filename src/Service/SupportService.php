<?php
declare(strict_types=1);

namespace App\Service;

use PDO;

class SupportService
{
    private PDO $pdo;
    private ?string $uploadDir;
    private bool $retentionCleanupRan = false;

    public function __construct(PDO $pdo, ?string $uploadDir = null)
    {
        $this->pdo = $pdo;
        $this->uploadDir = $uploadDir ? rtrim($uploadDir, DIRECTORY_SEPARATOR . '/\\') : null;
    }

    public function listThreads(): array
    {
        $this->cleanupExpiredThreads();
        $this->bootstrapLegacyThreads();
        return $this->listThreadsInternal(null, 'user');
    }

    public function listThreadsForUser(int $userId): array
    {
        $this->cleanupExpiredThreads();
        $this->bootstrapLegacyThreads();
        return $this->listThreadsInternal($userId, 'admin');
    }

    public function findThread(int $threadId): ?array
    {
        $this->cleanupExpiredThreads();
        $stmt = $this->pdo->prepare('SELECT t.id, t.user_id, t.subject, t.entry_id, t.created_by_role, t.created_at, t.updated_at, t.closed_at,
            u.name, u.email
            FROM support_threads t
            JOIN users u ON u.id = t.user_id
            WHERE t.id = :id');
        $stmt->execute(['id' => $threadId]);
        $row = $stmt->fetch();
        if (!$row) {
            return null;
        }
        return [
            'id' => (int)$row['id'],
            'user_id' => (int)$row['user_id'],
            'user_name' => $row['name'] ?? '',
            'user_email' => $row['email'] ?? '',
            'subject' => $row['subject'] ?? '',
            'entry_id' => $row['entry_id'] !== null ? (int)$row['entry_id'] : null,
            'created_by_role' => $row['created_by_role'] ?? '',
            'created_at' => $row['created_at'] ?? '',
            'updated_at' => $row['updated_at'] ?? '',
            'closed_at' => $row['closed_at'] ?? null,
        ];
    }

    public function findThreadForEntry(int $userId, int $entryId): ?array
    {
        $stmt = $this->pdo->prepare('SELECT id, subject, entry_id, created_by_role, created_at, updated_at, closed_at
            FROM support_threads
            WHERE user_id = :uid AND entry_id = :entry_id
            ORDER BY created_at ASC, id ASC LIMIT 1');
        $stmt->execute([
            'uid' => $userId,
            'entry_id' => $entryId,
        ]);
        $row = $stmt->fetch();
        if (!$row) {
            return null;
        }
        return [
            'id' => (int)$row['id'],
            'user_id' => $userId,
            'subject' => $row['subject'] ?? '',
            'entry_id' => $row['entry_id'] !== null ? (int)$row['entry_id'] : null,
            'created_by_role' => $row['created_by_role'] ?? '',
            'created_at' => $row['created_at'] ?? '',
            'updated_at' => $row['updated_at'] ?? '',
            'closed_at' => $row['closed_at'] ?? null,
        ];
    }

    public function createThread(int $userId, string $subject, string $role, ?int $entryId = null): array
    {
        $this->cleanupExpiredThreads();
        $subject = trim($subject);
        if ($entryId) {
            $existing = $this->findThreadForEntry($userId, $entryId);
            if ($existing) {
                return $existing;
            }
        }
        $now = date('c');
        $stmt = $this->pdo->prepare('INSERT INTO support_threads (user_id, subject, entry_id, created_by_role, created_at, updated_at, closed_at)
            VALUES (:uid, :subject, :entry_id, :role, :created, :updated, NULL)');
        $stmt->execute([
            'uid' => $userId,
            'subject' => $subject,
            'entry_id' => $entryId,
            'role' => $role,
            'created' => $now,
            'updated' => $now,
        ]);
        $id = (int)$this->pdo->lastInsertId();
        return [
            'id' => $id,
            'user_id' => $userId,
            'subject' => $subject,
            'entry_id' => $entryId,
            'created_by_role' => $role,
            'created_at' => $now,
            'updated_at' => $now,
            'closed_at' => null,
        ];
    }

    public function listMessages(int $threadId, ?string $markReadRole = null): array
    {
        $this->cleanupExpiredThreads();
        if ($markReadRole) {
            $stmt = $this->pdo->prepare('UPDATE support_messages SET read_at = :read_at WHERE thread_id = :tid AND sender_role = :role AND read_at IS NULL');
            $stmt->execute([
                'read_at' => date('c'),
                'tid' => $threadId,
                'role' => $markReadRole,
            ]);
        }
        $stmt = $this->pdo->prepare('SELECT m.id, m.thread_id, m.user_id, m.sender_role, m.message, m.attachment_path, m.attachment_type, m.attachment_ref_type, m.attachment_ref_id, m.attachment_title, m.created_at, m.read_at, u.name, u.email
            FROM support_messages m
            LEFT JOIN users u ON u.id = m.user_id
            WHERE m.thread_id = :tid
            ORDER BY m.created_at ASC, m.id ASC');
        $stmt->execute(['tid' => $threadId]);
        $rows = $stmt->fetchAll();
        return array_map(fn($row) => [
            'id' => (int)$row['id'],
            'thread_id' => (int)$row['thread_id'],
            'user_id' => (int)$row['user_id'],
            'user_name' => $row['name'] ?? '',
            'user_email' => $row['email'] ?? '',
            'sender_role' => $row['sender_role'] ?? '',
            'message' => $row['message'] ?? '',
            'attachment_path' => $row['attachment_path'] ?? null,
            'attachment_type' => $row['attachment_type'] ?? null,
            'attachment_ref_type' => $row['attachment_ref_type'] ?? null,
            'attachment_ref_id' => isset($row['attachment_ref_id']) && $row['attachment_ref_id'] !== null ? (int)$row['attachment_ref_id'] : null,
            'attachment_title' => $row['attachment_title'] ?? null,
            'created_at' => $row['created_at'] ?? '',
            'read_at' => $row['read_at'] ?? null,
        ], $rows);
    }

    public function sendMessage(int $threadId, int $userId, string $role, string $message, ?string $attachmentPath = null, array $attachmentMeta = []): array
    {
        $this->cleanupExpiredThreads();
        $attachmentType = trim((string)($attachmentMeta['type'] ?? ''));
        $attachmentRefType = trim((string)($attachmentMeta['ref_type'] ?? ''));
        $attachmentRefId = isset($attachmentMeta['ref_id']) ? (int)$attachmentMeta['ref_id'] : null;
        if ($attachmentRefId !== null && $attachmentRefId <= 0) {
            $attachmentRefId = null;
        }
        $attachmentTitle = trim((string)($attachmentMeta['title'] ?? ''));

        $stmt = $this->pdo->prepare('INSERT INTO support_messages (
                thread_id, user_id, sender_role, message, attachment_path, attachment_type, attachment_ref_type, attachment_ref_id, attachment_title, created_at, read_at
            ) VALUES (
                :tid, :uid, :role, :message, :attachment, :attachment_type, :attachment_ref_type, :attachment_ref_id, :attachment_title, :created, NULL
            )');
        $now = date('c');
        $stmt->execute([
            'tid' => $threadId,
            'uid' => $userId,
            'role' => $role,
            'message' => $message,
            'attachment' => $attachmentPath,
            'attachment_type' => $attachmentType !== '' ? $attachmentType : null,
            'attachment_ref_type' => $attachmentRefType !== '' ? $attachmentRefType : null,
            'attachment_ref_id' => $attachmentRefId,
            'attachment_title' => $attachmentTitle !== '' ? $attachmentTitle : null,
            'created' => $now,
        ]);
        $this->pdo->prepare('UPDATE support_threads SET updated_at = :updated WHERE id = :id')
            ->execute([
                'updated' => $now,
                'id' => $threadId,
            ]);
        $id = (int)$this->pdo->lastInsertId();
        return [
            'id' => $id,
            'thread_id' => $threadId,
            'user_id' => $userId,
            'sender_role' => $role,
            'message' => $message,
            'attachment_path' => $attachmentPath,
            'attachment_type' => $attachmentType !== '' ? $attachmentType : null,
            'attachment_ref_type' => $attachmentRefType !== '' ? $attachmentRefType : null,
            'attachment_ref_id' => $attachmentRefId,
            'attachment_title' => $attachmentTitle !== '' ? $attachmentTitle : null,
            'created_at' => $now,
            'read_at' => null,
        ];
    }

    private function listThreadsInternal(?int $userId, string $unreadRole): array
    {
        $where = '';
        $params = ['unread_role' => $unreadRole];
        if ($userId) {
            $where = 'WHERE t.user_id = :uid';
            $params['uid'] = $userId;
        }
        $sql = 'SELECT t.id, t.user_id, t.subject, t.entry_id, t.created_by_role, t.created_at, t.updated_at, t.closed_at,
                u.name, u.email,
                MAX(m.created_at) AS last_at,
                SUM(CASE WHEN m.sender_role = :unread_role AND m.read_at IS NULL THEN 1 ELSE 0 END) AS unread_count,
                (SELECT message FROM support_messages sm WHERE sm.thread_id = t.id ORDER BY sm.created_at DESC, sm.id DESC LIMIT 1) AS last_message,
                (SELECT sender_role FROM support_messages sm WHERE sm.thread_id = t.id ORDER BY sm.created_at DESC, sm.id DESC LIMIT 1) AS last_sender_role,
                (SELECT attachment_path FROM support_messages sm WHERE sm.thread_id = t.id ORDER BY sm.created_at DESC, sm.id DESC LIMIT 1) AS last_attachment,
                (SELECT attachment_type FROM support_messages sm WHERE sm.thread_id = t.id ORDER BY sm.created_at DESC, sm.id DESC LIMIT 1) AS last_attachment_type,
                (SELECT attachment_ref_type FROM support_messages sm WHERE sm.thread_id = t.id ORDER BY sm.created_at DESC, sm.id DESC LIMIT 1) AS last_attachment_ref_type,
                (SELECT attachment_ref_id FROM support_messages sm WHERE sm.thread_id = t.id ORDER BY sm.created_at DESC, sm.id DESC LIMIT 1) AS last_attachment_ref_id,
                (SELECT attachment_title FROM support_messages sm WHERE sm.thread_id = t.id ORDER BY sm.created_at DESC, sm.id DESC LIMIT 1) AS last_attachment_title
            FROM support_threads t
            JOIN users u ON u.id = t.user_id
            LEFT JOIN support_messages m ON m.thread_id = t.id
            ' . $where . '
            GROUP BY t.id
            ORDER BY COALESCE(last_at, t.created_at) DESC, t.id DESC';
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        $rows = $stmt->fetchAll();
        return array_map(fn($row) => [
            'id' => (int)$row['id'],
            'user_id' => (int)$row['user_id'],
            'user_name' => $row['name'] ?? '',
            'user_email' => $row['email'] ?? '',
            'subject' => $row['subject'] ?? '',
            'entry_id' => $row['entry_id'] !== null ? (int)$row['entry_id'] : null,
            'created_by_role' => $row['created_by_role'] ?? '',
            'created_at' => $row['created_at'] ?? '',
            'updated_at' => $row['updated_at'] ?? '',
            'closed_at' => $row['closed_at'] ?? null,
            'last_at' => $row['last_at'] ?? '',
            'last_message' => $row['last_message'] ?? '',
            'last_sender_role' => $row['last_sender_role'] ?? '',
            'last_attachment' => $row['last_attachment'] ?? null,
            'last_attachment_type' => $row['last_attachment_type'] ?? null,
            'last_attachment_ref_type' => $row['last_attachment_ref_type'] ?? null,
            'last_attachment_ref_id' => isset($row['last_attachment_ref_id']) && $row['last_attachment_ref_id'] !== null ? (int)$row['last_attachment_ref_id'] : null,
            'last_attachment_title' => $row['last_attachment_title'] ?? null,
            'unread_count' => (int)($row['unread_count'] ?? 0),
        ], $rows);
    }

    private function bootstrapLegacyThreads(): void
    {
        $stmt = $this->pdo->query('SELECT DISTINCT user_id FROM support_messages WHERE thread_id IS NULL OR thread_id = 0');
        $rows = $stmt ? $stmt->fetchAll() : [];
        if (!$rows) {
            return;
        }
        $findThread = $this->pdo->prepare('SELECT id FROM support_threads WHERE user_id = :uid ORDER BY created_at ASC, id ASC LIMIT 1');
        $insertThread = $this->pdo->prepare('INSERT INTO support_threads (user_id, subject, entry_id, created_by_role, created_at, updated_at, closed_at)
            VALUES (:uid, :subject, NULL, :role, :created, :updated, NULL)');
        $updateMessages = $this->pdo->prepare('UPDATE support_messages SET thread_id = :tid WHERE user_id = :uid AND (thread_id IS NULL OR thread_id = 0)');
        foreach ($rows as $row) {
            $uid = (int)($row['user_id'] ?? 0);
            if ($uid <= 0) {
                continue;
            }
            $findThread->execute(['uid' => $uid]);
            $threadId = (int)($findThread->fetchColumn() ?: 0);
            if ($threadId <= 0) {
                $now = date('c');
                $insertThread->execute([
                    'uid' => $uid,
                    'subject' => 'Atendimento',
                    'role' => 'system',
                    'created' => $now,
                    'updated' => $now,
                ]);
                $threadId = (int)$this->pdo->lastInsertId();
            }
            if ($threadId > 0) {
                $updateMessages->execute([
                    'tid' => $threadId,
                    'uid' => $uid,
                ]);
            }
        }
    }

    private function cleanupExpiredThreads(): void
    {
        if ($this->retentionCleanupRan) {
            return;
        }
        $this->retentionCleanupRan = true;

        $cutoffIso = date('c', time() - (30 * 24 * 60 * 60));
        $stmt = $this->pdo->prepare(
            'SELECT id
               FROM support_threads
              WHERE COALESCE(updated_at, created_at) < :cutoff'
        );
        $stmt->execute(['cutoff' => $cutoffIso]);
        $threadIds = array_values(array_filter(array_map(
            static fn($row): int => (int)($row['id'] ?? 0),
            $stmt->fetchAll() ?: []
        ), static fn(int $id): bool => $id > 0));

        if (!$threadIds) {
            return;
        }

        $placeholders = implode(',', array_fill(0, count($threadIds), '?'));
        $attachmentsStmt = $this->pdo->prepare(
            "SELECT DISTINCT attachment_path
               FROM support_messages
              WHERE thread_id IN ({$placeholders})
                AND attachment_path IS NOT NULL
                AND trim(attachment_path) <> ''
                AND (
                    attachment_type IN ('file', 'screenshot', 'audio')
                    OR attachment_type IS NULL
                    OR trim(attachment_type) = ''
                )
                AND (attachment_ref_type IS NULL OR trim(attachment_ref_type) = '')
                AND (attachment_ref_id IS NULL OR attachment_ref_id = 0)"
        );
        $attachmentsStmt->execute($threadIds);
        $attachmentPaths = array_values(array_filter(array_map(
            static fn($row): string => trim((string)($row['attachment_path'] ?? '')),
            $attachmentsStmt->fetchAll() ?: []
        ), static fn(string $path): bool => $path !== ''));

        $this->pdo->beginTransaction();
        try {
            $deleteMessages = $this->pdo->prepare("DELETE FROM support_messages WHERE thread_id IN ({$placeholders})");
            $deleteMessages->execute($threadIds);
            $deleteThreads = $this->pdo->prepare("DELETE FROM support_threads WHERE id IN ({$placeholders})");
            $deleteThreads->execute($threadIds);
            $this->pdo->commit();
        } catch (\Throwable $e) {
            if ($this->pdo->inTransaction()) {
                $this->pdo->rollBack();
            }
            throw $e;
        }

        foreach ($attachmentPaths as $path) {
            if ($this->isAttachmentReferencedByEntries($path)) {
                continue;
            }
            $this->deleteAttachmentFile($path);
        }
    }

    private function isAttachmentReferencedByEntries(string $path): bool
    {
        $stmt = $this->pdo->prepare('SELECT COUNT(1) FROM entries WHERE attachment_path = :path');
        $stmt->execute(['path' => $path]);
        return (int)($stmt->fetchColumn() ?: 0) > 0;
    }

    private function deleteAttachmentFile(string $relativePath): void
    {
        $relative = trim(str_replace('\\', '/', $relativePath), '/');
        if ($relative === '') {
            return;
        }

        $candidates = [];
        $bases = array_values(array_filter([
            $this->uploadDir,
            sys_get_temp_dir() . DIRECTORY_SEPARATOR . 'caixa-uploads',
            dirname(__DIR__, 2) . DIRECTORY_SEPARATOR . 'public' . DIRECTORY_SEPARATOR . 'uploads',
        ]));

        foreach ($bases as $base) {
            $normalizedBase = rtrim($base, DIRECTORY_SEPARATOR . '/');
            $primary = $normalizedBase . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $relative);
            $candidates[] = $primary;
            if (!str_contains($relative, '/uploads/')) {
                $parts = explode('/', $relative, 2);
                if (count($parts) === 2) {
                    $candidates[] = $normalizedBase
                        . DIRECTORY_SEPARATOR . $parts[0]
                        . DIRECTORY_SEPARATOR . 'uploads'
                        . DIRECTORY_SEPARATOR . str_replace('/', DIRECTORY_SEPARATOR, $parts[1]);
                }
            }
        }

        foreach (array_unique($candidates) as $filePath) {
            if (!is_file($filePath)) {
                continue;
            }
            @unlink($filePath);
        }
    }
}
