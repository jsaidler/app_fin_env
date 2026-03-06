<?php
declare(strict_types=1);

use App\Storage\SqliteConnection;

date_default_timezone_set('America/Sao_Paulo');

spl_autoload_register(function (string $class): void {
    $prefix = 'App\\';
    $baseDir = __DIR__ . '/';
    if (str_starts_with($class, $prefix)) {
        $relative = str_replace('\\', '/', substr($class, strlen($prefix)));
        $file = $baseDir . $relative . '.php';
        if (file_exists($file)) {
            require_once $file;
        }
    }
});

$config = require __DIR__ . '/../config/config.php';
$GLOBALS['config'] = $config;

// Ensure data directories exist
foreach ([$config['paths']['data'], $config['paths']['uploads']] as $dir) {
    if (!is_dir($dir)) {
        mkdir($dir, 0775, true);
    }
}

$env = (string)($config['env'] ?? 'dev');
$secret = trim((string)($config['secret'] ?? ''));

if ($secret === '' || $secret === 'change-this-secret' || strlen($secret) < 24) {
    if ($env !== 'dev') {
        throw new RuntimeException('APP_SECRET invalido para ambiente nao-dev.');
    }
    $runtimeSecretFile = rtrim((string)$config['paths']['data'], '/\\') . '/.app-secret';
    $runtimeSecret = is_file($runtimeSecretFile) ? trim((string)@file_get_contents($runtimeSecretFile)) : '';
    if ($runtimeSecret === '' || strlen($runtimeSecret) < 24) {
        try {
            $runtimeSecret = bin2hex(random_bytes(32));
        } catch (\Throwable) {
            $runtimeSecret = hash('sha256', uniqid('app-secret', true) . mt_rand());
        }
        @file_put_contents($runtimeSecretFile, $runtimeSecret);
        @chmod($runtimeSecretFile, 0600);
    }
    $config['secret'] = $runtimeSecret;
    $GLOBALS['config']['secret'] = $runtimeSecret;
}

// Prepare SQLite database (creates file/tables)
$dbPath = $config['db']['path'] ?? ($config['paths']['sqlite'] ?? (__DIR__ . '/../data/caixa.sqlite'));
try {
    SqliteConnection::make($dbPath);
} catch (\Throwable $e) {
    if (class_exists(\App\Util\Logger::class)) {
        \App\Util\Logger::error('Falha ao iniciar SQLite', ['error' => $e->getMessage()]);
    }
}
