<?php
declare(strict_types=1);

use App\Storage\SqliteConnection;

require __DIR__ . '/../src/Storage/SqliteConnection.php';

$config = require __DIR__ . '/../config/config.php';
$dbPath = (string)($config['db']['path'] ?? (__DIR__ . '/../data/caixa.sqlite'));
$dbDir = dirname($dbPath);

if (!is_dir($dbDir)) {
    mkdir($dbDir, 0775, true);
}
if (is_file($dbPath)) {
    unlink($dbPath);
}
$dataDir = (string)($config['paths']['data'] ?? (__DIR__ . '/../data'));
foreach (['login-throttle.json', 'forgot-password-throttle.json', 'reset-password-throttle.json'] as $throttleFile) {
    $throttlePath = rtrim($dataDir, '/\\') . DIRECTORY_SEPARATOR . $throttleFile;
    if (is_file($throttlePath)) {
        unlink($throttlePath);
    }
}

$pdo = SqliteConnection::make($dbPath);
$pdo->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);

$now = date('c');
$currentMonthDate = date('Y-m-10');
$previousMonthDate = date('Y-m-d', strtotime('first day of last month'));

$insertUser = $pdo->prepare(
    'INSERT INTO users (name, email, password_hash, role, theme, alterdata_code, created_at)
     VALUES (:name, :email, :password_hash, :role, :theme, :alterdata_code, :created_at)'
);

$insertUser->execute([
    'name' => 'Suite Admin',
    'email' => 'admin.suite@local',
    'password_hash' => password_hash('Admin#12345', PASSWORD_DEFAULT),
    'role' => 'admin',
    'theme' => 'dark',
    'alterdata_code' => '',
    'created_at' => $now,
]);

$insertUser->execute([
    'name' => 'Suite User',
    'email' => 'user.suite@local',
    'password_hash' => password_hash('User#67890', PASSWORD_DEFAULT),
    'role' => 'user',
    'theme' => 'dark',
    'alterdata_code' => '',
    'created_at' => $now,
]);
$userId = (int)$pdo->lastInsertId();

$insertCategory = $pdo->prepare(
    'INSERT INTO categories (name, type, alterdata_auto, created_at, updated_at)
     VALUES (:name, :type, :alterdata_auto, :created_at, :updated_at)'
);
$insertCategory->execute([
    'name' => 'Salario',
    'type' => 'in',
    'alterdata_auto' => 'AUTO_IN',
    'created_at' => $now,
    'updated_at' => $now,
]);
$salaryCategoryId = (int)$pdo->lastInsertId();

$insertCategory->execute([
    'name' => 'Gastos',
    'type' => 'out',
    'alterdata_auto' => 'AUTO_OUT',
    'created_at' => $now,
    'updated_at' => $now,
]);

$insertUserCategory = $pdo->prepare(
    'INSERT INTO user_categories (user_id, name, icon, global_category_id, created_at, updated_at)
     VALUES (:user_id, :name, :icon, :global_category_id, :created_at, :updated_at)'
);
$insertUserCategory->execute([
    'user_id' => $userId,
    'name' => 'Dizimo',
    'icon' => 'savings',
    'global_category_id' => $salaryCategoryId,
    'created_at' => $now,
    'updated_at' => $now,
]);

$insertAccount = $pdo->prepare(
    'INSERT INTO user_accounts (user_id, name, type, icon, initial_balance, active, created_at, updated_at)
     VALUES (:user_id, :name, :type, :icon, :initial_balance, :active, :created_at, :updated_at)'
);
$insertAccount->execute([
    'user_id' => $userId,
    'name' => 'Conta Principal',
    'type' => 'bank',
    'icon' => 'account_balance',
    'initial_balance' => 0,
    'active' => 1,
    'created_at' => $now,
    'updated_at' => $now,
]);
$accountId = (int)$pdo->lastInsertId();

$insertEntry = $pdo->prepare(
    'INSERT INTO entries (user_id, type, amount, category, description, date, created_at, updated_at, account_id)
     VALUES (:user_id, :type, :amount, :category, :description, :date, :created_at, :updated_at, :account_id)'
);

$entries = [
    ['in', 1200.00, 'Salario', 'salario atual', $currentMonthDate, $accountId],
    ['out', 200.00, 'Gastos', 'mercado atual', $currentMonthDate, $accountId],
    ['in', 300.00, 'Dizimo', 'dizimo atual', $currentMonthDate, null],
    ['in', 900.00, 'Salario', 'salario anterior', $previousMonthDate, $accountId],
];

foreach ($entries as [$type, $amount, $category, $description, $date, $accountIdValue]) {
    $insertEntry->execute([
        'user_id' => $userId,
        'type' => $type,
        'amount' => $amount,
        'category' => $category,
        'description' => $description,
        'date' => $date,
        'created_at' => $now,
        'updated_at' => $now,
        'account_id' => $accountIdValue,
    ]);
}

echo "E2E database seeded: {$dbPath}\n";
