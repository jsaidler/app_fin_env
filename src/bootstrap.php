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

$env = (string)($config['env'] ?? 'dev');
$secret = (string)($config['secret'] ?? '');
if ($env !== 'dev') {
    if ($secret === '' || $secret === 'change-this-secret' || strlen($secret) < 24) {
        throw new RuntimeException('APP_SECRET invalido para ambiente nao-dev.');
    }
}

// Ensure data directories exist
foreach ([$config['paths']['data'], $config['paths']['uploads']] as $dir) {
    if (!is_dir($dir)) {
        mkdir($dir, 0775, true);
    }
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
