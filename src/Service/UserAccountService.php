<?php
declare(strict_types=1);

namespace App\Service;

use App\Repository\EntryRepositoryInterface;
use App\Repository\UserAccountRepositoryInterface;
use App\Util\Response;
use App\Util\Validator;

class UserAccountService
{
    private UserAccountRepositoryInterface $accounts;
    private EntryRepositoryInterface $entries;

    public function __construct(UserAccountRepositoryInterface $accounts, EntryRepositoryInterface $entries)
    {
        $this->accounts = $accounts;
        $this->entries = $entries;
    }

    public function listForUser(int $userId, bool $includeInactive = false): array
    {
        return array_map(fn($item) => $item->toArray(), $this->accounts->listByUser($userId, $includeInactive));
    }

    public function createForUser(int $userId, array $input): array
    {
        $name = trim((string)($input['name'] ?? ''));
        $type = trim((string)($input['type'] ?? ''));
        $icon = $this->normalizeIcon($input['icon'] ?? '');
        $initialBalance = $this->normalizeInitialBalance($input['initial_balance'] ?? 0);
        if (!Validator::nonEmpty($name) || !in_array($type, ['bank', 'card'], true)) {
            Response::json(['error' => 'Dados de conta/cartão inválidos'], 422);
        }
        $existing = $this->accounts->findByUserAndName($userId, $name);
        if ($existing) {
            Response::json(['error' => 'Nome já existe em suas contas/cartões'], 409);
        }
        $created = $this->accounts->create($userId, $name, $type, $icon, $initialBalance);
        return $created->toArray();
    }

    public function updateForUser(int $id, int $userId, array $input): array
    {
        $existing = $this->accounts->findForUser($id, $userId);
        if (!$existing) {
            Response::json(['error' => 'Conta/cartão não encontrado'], 404);
        }

        $name = array_key_exists('name', $input) ? trim((string)$input['name']) : $existing->name;
        $type = array_key_exists('type', $input) ? trim((string)$input['type']) : $existing->type;
        $icon = array_key_exists('icon', $input) ? $this->normalizeIcon($input['icon']) : $existing->icon;
        $initialBalance = array_key_exists('initial_balance', $input)
            ? $this->normalizeInitialBalance($input['initial_balance'])
            : (float)$existing->initialBalance;
        $active = array_key_exists('active', $input) ? (bool)$input['active'] : $existing->active;

        if (!Validator::nonEmpty($name) || !in_array($type, ['bank', 'card'], true)) {
            Response::json(['error' => 'Dados de conta/cartão inválidos'], 422);
        }

        $sameName = $this->accounts->findByUserAndName($userId, $name);
        if ($sameName && $sameName->id !== $id) {
            Response::json(['error' => 'Nome já existe em suas contas/cartões'], 409);
        }

        $updated = $this->accounts->updateForUser($id, $userId, [
            'name' => $name,
            'type' => $type,
            'icon' => $icon,
            'initial_balance' => $initialBalance,
            'active' => $active ? 1 : 0,
        ]);
        if (!$updated) {
            Response::json(['error' => 'Conta/cartão não encontrado'], 404);
        }
        return $updated->toArray();
    }

    public function deleteForUser(int $id, int $userId): array
    {
        $existing = $this->accounts->findForUser($id, $userId);
        if (!$existing) {
            Response::json(['error' => 'Conta/cartão não encontrado'], 404);
        }

        $entriesCount = $this->entries->countByUserAccount($userId, $id, true);
        if ($entriesCount > 0) {
            $this->accounts->setActiveForUser($id, $userId, false);
            return [
                'deleted' => false,
                'deactivated' => true,
                'reason' => 'has_entries',
            ];
        }

        $ok = $this->accounts->deleteForUser($id, $userId);
        if (!$ok) {
            Response::json(['error' => 'Conta/cartão não encontrado'], 404);
        }
        return [
            'deleted' => true,
            'deactivated' => false,
        ];
    }

    private function normalizeIcon($value): string
    {
        $icon = trim((string)$value);
        if ($icon === '') {
            return 'account_balance_wallet';
        }
        if (!preg_match('/^[a-z0-9_]{2,64}$/i', $icon)) {
            Response::json(['error' => 'Ícone inválido'], 422);
        }
        return strtolower($icon);
    }

    private function normalizeInitialBalance($value): float
    {
        if (is_string($value)) {
            $raw = trim($value);
            if ($raw === '') {
                return 0.0;
            }
            $normalized = str_replace(['R$', 'r$', ' '], '', $raw);
            $normalized = str_replace('.', '', $normalized);
            $normalized = str_replace(',', '.', $normalized);
            if (!is_numeric($normalized)) {
                Response::json(['error' => 'Saldo inicial inválido'], 422);
            }
            return (float)$normalized;
        }
        if (!is_numeric($value)) {
            Response::json(['error' => 'Saldo inicial inválido'], 422);
        }
        return (float)$value;
    }
}
