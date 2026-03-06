<?php
declare(strict_types=1);

return [
    'data_path' => getenv('DATA_PATH') ?: (__DIR__ . '/../data'),
    'env' => getenv('APP_ENV') ?: 'dev',
    'app_name' => 'Caixa Simples',
    'app_url' => getenv('APP_URL') ?: '',
    'secret' => getenv('APP_SECRET') ?: '',
    'token_ttl' => 60 * 60 * 8, // 8 horas
    'password_reset_ttl' => 60 * 30, // 30 minutos
    'password_reset_from' => getenv('PASSWORD_RESET_FROM') ?: 'no-reply@caixasimples.local',
    'backup_email' => getenv('BACKUP_EMAIL') ?: '',
    'report_diagnostics' => in_array(strtolower((string)getenv('REPORT_DIAGNOSTICS')), ['1', 'true', 'yes', 'on'], true),
    'log_level' => strtoupper((string)(getenv('LOG_LEVEL') ?: ((getenv('APP_ENV') ?: 'dev') === 'prod' ? 'WARNING' : 'INFO'))),
    'log_api_requests' => in_array(
        strtolower((string)getenv('LOG_API_REQUESTS')),
        ['1', 'true', 'yes', 'on'],
        true
    ) || ((getenv('APP_ENV') ?: 'dev') !== 'prod' && getenv('LOG_API_REQUESTS') === false),
    'log_max_bytes' => (int)(getenv('LOG_MAX_BYTES') ?: (5 * 1024 * 1024)),
    'log_max_files' => (int)(getenv('LOG_MAX_FILES') ?: 5),
    'paths' => [
        'data' => getenv('DATA_PATH') ?: (__DIR__ . '/../data'),
        // uploads ficam em data/users/{id}/uploads
        'uploads' => getenv('UPLOADS_PATH') ?: ((getenv('DATA_PATH') ?: (__DIR__ . '/../data')) . '/users'),
        'sqlite' => getenv('SQLITE_PATH') ?: ((getenv('DATA_PATH') ?: (__DIR__ . '/../data')) . '/caixa.sqlite'),
    ],
    'db' => [
        'driver' => 'sqlite',
        'path' => getenv('DB_PATH') ?: (__DIR__ . '/../data/caixa.sqlite'),
    ],
];
