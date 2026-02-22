<?php
declare(strict_types=1);

return [
    'env' => getenv('APP_ENV') ?: 'dev',
    'app_name' => 'Caixa Simples',
    'app_url' => getenv('APP_URL') ?: '',
    'secret' => getenv('APP_SECRET') ?: 'change-this-secret',
    'token_ttl' => 60 * 60 * 8, // 8 horas
    'password_reset_ttl' => 60 * 30, // 30 minutos
    'password_reset_from' => getenv('PASSWORD_RESET_FROM') ?: 'no-reply@caixasimples.local',
    'backup_email' => getenv('BACKUP_EMAIL') ?: '',
    'paths' => [
        'data' => __DIR__ . '/../data',
        // uploads ficam em data/users/{id}/uploads
        'uploads' => __DIR__ . '/../data/users',
        'sqlite' => __DIR__ . '/../data/caixa.sqlite',
    ],
    'db' => [
        'driver' => 'sqlite',
        'path' => getenv('DB_PATH') ?: (__DIR__ . '/../data/caixa.sqlite'),
    ],
];
