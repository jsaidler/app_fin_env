<?php
declare(strict_types=1);

use App\Controller\AuthController;
use App\Controller\EntryController;
use App\Controller\ReportController;
use App\Controller\ExportController;
use App\Controller\UploadController;
use App\Controller\AccountController;
use App\Controller\FinancialAccountController;
use App\Controller\RecurrenceController;
use App\Controller\AdminController;
use App\Controller\SupportController;
use App\Controller\CategoryController;
use App\Repository\Sqlite\SqliteUserRepository;
use App\Router;
use App\Storage\SqliteConnection;
use App\Util\Response;
use App\Util\Token;
use App\Util\Logger;

$config = require __DIR__ . '/../config/config.php';
$GLOBALS['config'] = $config;

function denyPathTraversal(string $path): void
{
    if (str_contains($path, '..')) {
        Response::json(['error' => 'Bad request'], 400);
    }
}

function normalizeRelPath(string $rel): string
{
    $rel = str_replace('\\', '/', $rel);
    $rel = ltrim($rel, '/');
    $parts = [];
    foreach (explode('/', $rel) as $part) {
        if ($part === '' || $part === '.') {
            continue;
        }
        if ($part === '..') {
            continue;
        }
        $parts[] = $part;
    }
    return implode('/', $parts);
}

function userRepoForFront(array $config)
{
    $dbPath = $config['db']['path'] ?? ($config['paths']['sqlite'] ?? (__DIR__ . '/../data/caixa.sqlite'));
    try {
        $pdo = SqliteConnection::make($dbPath);
    } catch (\Throwable $e) {
        Response::json(['error' => 'Banco de dados indisponivel: ' . $e->getMessage()], 500);
    }
    return new SqliteUserRepository($pdo);
}

function resolveAuthenticatedUserId(array $config): int
{
    $token = $_COOKIE['auth_token'] ?? '';
    if ($token === '') {
        return 0;
    }
    $payload = Token::verify($token, $config['secret']);
    if (!$payload || empty($payload['uid'])) {
        return 0;
    }
    $uid = (int) $payload['uid'];
    if ($uid <= 0) {
        return 0;
    }
    $repo = userRepoForFront($config);
    $user = $repo->findById($uid);
    if (!$user) {
        return 0;
    }

    $tokenVersion = isset($payload['tv']) ? (int) $payload['tv'] : -1;
    if ($tokenVersion < 0 || $tokenVersion !== $user->tokenVersion) {
        return 0;
    }

    if (!empty($payload['imp_by'])) {
        $adminId = (int) $payload['imp_by'];
        if ($adminId <= 0) {
            return 0;
        }
        $admin = $repo->findById($adminId);
        if (!$admin || $admin->role !== 'admin') {
            return 0;
        }
        $adminTokenVersion = isset($payload['imp_tv']) ? (int) $payload['imp_tv'] : -1;
        if ($adminTokenVersion < 0 || $adminTokenVersion !== $admin->tokenVersion) {
            return 0;
        }
    }

    return $uid;
}

function requireUploadAccess(string $relPath, array $config): void
{
    $token = null;
    $header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (str_starts_with($header, 'Bearer ')) {
        $token = substr($header, 7);
    } elseif (!empty($_COOKIE['auth_token'])) {
        $token = $_COOKIE['auth_token'];
    }
    if (!$token) {
        Response::json(['error' => 'Unauthorized'], 401);
    }
    $payload = Token::verify($token, $config['secret']);
    if (!$payload || empty($payload['uid'])) {
        Response::json(['error' => 'Token invalido'], 401);
    }
    $uid = (int) $payload['uid'];
    $repo = userRepoForFront($config);
    $user = $repo->findById($uid);
    if (!$user) {
        Response::json(['error' => 'Usuario nao encontrado'], 401);
    }
    $role = $payload['role'] ?? $user->role ?? 'user';
    if ($role !== 'admin') {
        $prefix = $uid . '/';
        if (!str_starts_with($relPath, $prefix)) {
            Logger::warning('Tentativa de acesso a upload de outro usuario', [
                'uid' => $uid,
                'rel' => $relPath,
                'path' => $_SERVER['REQUEST_URI'] ?? '',
            ]);
            Response::json(['error' => 'Acesso negado'], 403);
        }
    }
}

function setNoStoreHeaders(): void
{
    header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
    header('Pragma: no-cache');
    header('Expires: 0');
}

function setStaticCacheHeaders(string $path): void
{
    global $config;
    $env = strtolower((string)($config['env'] ?? 'dev'));
    // Service worker/manifest must stay revalidating to propagate updates quickly.
    if ($path === '/service-worker.js' || $path === '/manifest.json') {
        header('Cache-Control: no-cache, must-revalidate, max-age=0');
        header('Pragma: no-cache');
        header('Expires: 0');
        return;
    }

    if ($env === 'dev') {
        if (str_starts_with($path, '/assets/')) {
            header('Cache-Control: public, max-age=600');
            return;
        }
        header('Cache-Control: no-cache, must-revalidate, max-age=0');
        header('Pragma: no-cache');
        header('Expires: 0');
        return;
    }

    // Versioned frontend assets can be cached aggressively.
    if (str_starts_with($path, '/assets/')) {
        header('Cache-Control: public, max-age=31536000, immutable');
        return;
    }

    // Default for static files outside /assets.
    header('Cache-Control: public, max-age=3600');
}

$requestPath = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?: '/';
$requestPath = rawurldecode($requestPath);
denyPathTraversal($requestPath);
$requestStartedAt = microtime(true);
try {
    $requestId = bin2hex(random_bytes(8));
} catch (\Throwable $e) {
    $requestId = str_replace('.', '', uniqid('', true));
}
$GLOBALS['request_id'] = $requestId;
header('X-Request-Id: ' . $requestId);
header('X-App-Env: ' . strtolower((string)($config['env'] ?? 'dev')));

if (str_starts_with($requestPath, '/api/') && !empty($config['log_api_requests'])) {
    register_shutdown_function(static function () use ($requestStartedAt, $requestPath): void {
        $durationMs = (int)round((microtime(true) - $requestStartedAt) * 1000);
        $status = (int)(http_response_code() ?: 200);
        $level = $status >= 500 ? 'error' : (($status >= 400) ? 'warning' : 'info');
        $message = 'api_request';
        $lastError = error_get_last();
        if (is_array($lastError) && in_array((int)$lastError['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR], true)) {
            $level = 'error';
            $message = 'api_request_fatal';
        }
        Logger::$level($message, [
            'request_id' => (string)($GLOBALS['request_id'] ?? ''),
            'method' => $_SERVER['REQUEST_METHOD'] ?? 'GET',
            'path' => $requestPath,
            'status' => $status,
            'duration_ms' => $durationMs,
            'memory_peak_bytes' => memory_get_peak_usage(true),
            'fatal' => $lastError,
        ]);
    });
}

// Security headers
header('X-Frame-Options: DENY');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: strict-origin-when-cross-origin');
header('Permissions-Policy: geolocation=(), microphone=(), camera=(), payment=(), usb=()');
$isHttps = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
    || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');
if ($isHttps) {
    header('Strict-Transport-Security: max-age=31536000; includeSubDomains');
}
$csp = "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self'; frame-src 'self' blob: data:; frame-ancestors 'none'; base-uri 'self'; form-action 'self'";
if ($requestPath === '/ui-kit' || $requestPath === '/ui-kit.html') {
    $csp = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self'; frame-src 'self' blob: data:; frame-ancestors 'none'; base-uri 'self'; form-action 'self'";
}
header('Content-Security-Policy: ' . $csp);

// CORS restrito ao mesmo host
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$host = $_SERVER['HTTP_HOST'] ?? '';
if ($origin !== '' && $host !== '' && parse_url($origin, PHP_URL_HOST) === $host) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
    header('Access-Control-Allow-Credentials: true');
}
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-CSRF-Token');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}
if (str_starts_with($requestPath, '/api/')) {
    setNoStoreHeaders();
}

if (preg_match('#^/data(/|$)#', $requestPath)) {
    http_response_code(404);
    exit;
}

// Serve static assets first, without full app bootstrap.
// In PHP dev server (single process), bootstrapping each .css/.js request serializes the waterfall.
$staticFile = __DIR__ . $requestPath;
if ($_SERVER['REQUEST_METHOD'] === 'GET' && is_file($staticFile)) {
    $ext = pathinfo($staticFile, PATHINFO_EXTENSION);
    $mime = [
        'css' => 'text/css',
        'js' => 'application/javascript',
        'json' => 'application/json',
        'html' => 'text/html; charset=utf-8',
        'png' => 'image/png',
        'jpg' => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'webp' => 'image/webp',
        'svg' => 'image/svg+xml',
        'ico' => 'image/x-icon',
        'pdf' => 'application/pdf',
    ][$ext] ?? 'application/octet-stream';
    header('Content-Type: ' . $mime);
    setStaticCacheHeaders($requestPath);
    readfile($staticFile);
    exit;
}

require __DIR__ . '/../src/bootstrap.php';
$config = $GLOBALS['config'] ?? $config;
// Backup diario (executa no primeiro acesso do dia)
if (!empty($config['backup_email'])) {
    try {
        (new \App\Service\BackupService($config['paths']['data'], $config['backup_email']))->maybeSend();
    } catch (\Throwable $e) {
        // Ignora falha de backup para nao bloquear requisicoes
    }
}

// Serve uploads armazenados em data/users/{id}/uploads
if (str_starts_with($requestPath, '/uploads/')) {
    $rel = normalizeRelPath(substr($requestPath, strlen('/uploads/')));
    if ($rel === '') {
        Response::json(['error' => 'Arquivo invalido'], 400);
    }
    requireUploadAccess($rel, $config);
    $paths = [];
    $baseNew = rtrim($config['paths']['uploads'], '/\\');
    $paths[] = $baseNew . '/' . $rel;
    // Se veio sem "/uploads/" no meio, tente dentro da pasta uploads do usuario
    if (!str_contains($rel, '/uploads/')) {
        $parts = explode('/', $rel, 2);
        if (count($parts) === 2) {
            $paths[] = $baseNew . '/' . $parts[0] . '/uploads/' . $parts[1];
        }
    }
    foreach ($paths as $file) {
        if (is_file($file)) {
            $ext = strtolower(pathinfo($file, PATHINFO_EXTENSION));
            $mime = [
                'jpg' => 'image/jpeg',
                'jpeg' => 'image/jpeg',
                'png' => 'image/png',
                'webp' => 'image/webp',
                'gif' => 'image/gif',
                'pdf' => 'application/pdf',
                'mp3' => 'audio/mpeg',
                'm4a' => 'audio/mp4',
                'webm' => 'audio/webm',
                'ogg' => 'audio/ogg',
                'wav' => 'audio/wav',
                'aac' => 'audio/aac',
                '3gp' => 'audio/3gpp',
            ][$ext] ?? 'application/octet-stream';
            header('Content-Type: ' . $mime);
            readfile($file);
            exit;
        }
    }
    http_response_code(404);
    exit;
}
$router = new Router();
$router->add('POST', '/api/auth/login', [AuthController::class, 'login']);
$router->add('POST', '/api/auth/logout', [AuthController::class, 'logout']);
$router->add('POST', '/api/auth/password/forgot', [AuthController::class, 'forgotPassword']);
$router->add('POST', '/api/auth/password/reset', [AuthController::class, 'resetPassword']);
$router->add('GET', '/api/account/profile', [AccountController::class, 'profile']);
$router->add('PUT', '/api/account/password', [AccountController::class, 'updatePassword']);
$router->add('PUT', '/api/account/preferences', [AccountController::class, 'preferences']);
$router->add('GET', '/api/entries', [EntryController::class, 'list']);
$router->add('GET', '/api/entries/summary', [EntryController::class, 'summary']);
$router->add('POST', '/api/entries', [EntryController::class, 'create']);
$router->add('PUT', '/api/entries/{id}', [EntryController::class, 'update']);
$router->add('DELETE', '/api/entries/{id}', [EntryController::class, 'delete']);
$router->add('GET', '/api/entries/trash', [EntryController::class, 'trash']);
$router->add('PUT', '/api/entries/{id}/restore', [EntryController::class, 'restore']);
$router->add('DELETE', '/api/entries/{id}/purge', [EntryController::class, 'purge']);
$router->add('GET', '/api/recurrences', [RecurrenceController::class, 'list']);
$router->add('GET', '/api/recurrences/{id}', [RecurrenceController::class, 'detail']);
$router->add('POST', '/api/recurrences', [RecurrenceController::class, 'create']);
$router->add('PUT', '/api/recurrences/{id}', [RecurrenceController::class, 'update']);
$router->add('DELETE', '/api/recurrences/{id}', [RecurrenceController::class, 'delete']);
$router->add('POST', '/api/recurrences/{id}/runs/{runId}/confirm', [RecurrenceController::class, 'confirmRun']);
$router->add('POST', '/api/recurrences/{id}/runs/{runId}/skip', [RecurrenceController::class, 'skipRun']);
$router->add('GET', '/api/categories', [CategoryController::class, 'list']);
$router->add('GET', '/api/categories/tree', [CategoryController::class, 'tree']);
$router->add('GET', '/api/user-categories', [CategoryController::class, 'listUserCategories']);
$router->add('POST', '/api/user-categories', [CategoryController::class, 'createUserCategory']);
$router->add('PUT', '/api/user-categories/{id}', [CategoryController::class, 'updateUserCategory']);
$router->add('DELETE', '/api/user-categories/{id}', [CategoryController::class, 'deleteUserCategory']);
$router->add('GET', '/api/accounts', [FinancialAccountController::class, 'list']);
$router->add('POST', '/api/accounts', [FinancialAccountController::class, 'create']);
$router->add('PUT', '/api/accounts/{id}', [FinancialAccountController::class, 'update']);
$router->add('DELETE', '/api/accounts/{id}', [FinancialAccountController::class, 'delete']);
$router->add('GET', '/api/tags', [FinancialAccountController::class, 'listTags']);
$router->add('POST', '/api/tags', [FinancialAccountController::class, 'createTag']);
$router->add('PUT', '/api/tags/{id}', [FinancialAccountController::class, 'updateTag']);
$router->add('DELETE', '/api/tags/{id}', [FinancialAccountController::class, 'deleteTag']);
$router->add('GET', '/api/reports/summary', [ReportController::class, 'summary']);
$router->add('GET', '/api/reports/dashboard', [ReportController::class, 'dashboard']);
$router->add('GET', '/api/reports/aggregate', [ReportController::class, 'aggregate']);
$router->add('GET', '/api/reports/entries-groups', [ReportController::class, 'entriesGroups']);
$router->add('GET', '/api/reports/closure', [ReportController::class, 'closure']);
$router->add('GET', '/api/export/pdf', [ExportController::class, 'pdf']);
$router->add('POST', '/api/upload', [UploadController::class, 'upload']);
$router->add('GET', '/api/support/threads', [SupportController::class, 'threads']);
$router->add('POST', '/api/support/threads', [SupportController::class, 'createThread']);
$router->add('GET', '/api/support/messages', [SupportController::class, 'messages']);
$router->add('POST', '/api/support/messages', [SupportController::class, 'createMessage']);
$router->add('GET', '/api/admin/users', [AdminController::class, 'users']);
$router->add('POST', '/api/admin/users', [AdminController::class, 'createUser']);
$router->add('PUT', '/api/admin/users/{id}', [AdminController::class, 'updateUser']);
$router->add('DELETE', '/api/admin/users/{id}', [AdminController::class, 'deleteUser']);
$router->add('GET', '/api/admin/users/{id}/categories', [AdminController::class, 'userCategories']);
$router->add('GET', '/api/admin/users/{id}/accounts', [AdminController::class, 'userAccounts']);
$router->add('GET', '/api/admin/users/{id}/recurrences', [AdminController::class, 'userRecurrences']);
$router->add('GET', '/api/admin/categories', [AdminController::class, 'categories']);
$router->add('GET', '/api/admin/categories/tree', [AdminController::class, 'categoriesTree']);
$router->add('POST', '/api/admin/categories', [AdminController::class, 'createCategory']);
$router->add('PUT', '/api/admin/categories/{id}', [AdminController::class, 'updateCategory']);
$router->add('DELETE', '/api/admin/categories/{id}', [AdminController::class, 'deleteCategory']);
$router->add('GET', '/api/admin/categories/{id}/stats', [AdminController::class, 'categoryStats']);
$router->add('GET', '/api/admin/entries', [AdminController::class, 'adminEntries']);
$router->add('POST', '/api/admin/entries', [AdminController::class, 'createAdminEntry']);
$router->add('PUT', '/api/admin/entries/{id}', [AdminController::class, 'updateAdminEntry']);
$router->add('DELETE', '/api/admin/entries/{id}', [AdminController::class, 'deleteAdminEntry']);
$router->add('PUT', '/api/admin/entries/{id}/approve', [AdminController::class, 'approveAdminEntry']);
$router->add('PUT', '/api/admin/entries/{id}/reject', [AdminController::class, 'rejectAdminEntry']);
$router->add('POST', '/api/admin/close-month', [AdminController::class, 'closeMonth']);
$router->add('GET', '/api/admin/close-month/history', [AdminController::class, 'closeMonthHistory']);
$router->add('GET', '/api/admin/closed-months', [AdminController::class, 'closedMonths']);
$router->add('GET', '/api/admin/notifications', [AdminController::class, 'notifications']);
$router->add('PUT', '/api/admin/notifications/{id}/read', [AdminController::class, 'markNotificationRead']);
$router->add('GET', '/api/admin/reports/closure', [AdminController::class, 'closureReport']);
$router->add('GET', '/api/admin/support/threads', [AdminController::class, 'supportThreads']);
$router->add('POST', '/api/admin/support/threads', [AdminController::class, 'createSupportThread']);
$router->add('GET', '/api/admin/support/messages', [AdminController::class, 'supportMessages']);
$router->add('POST', '/api/admin/support/messages', [AdminController::class, 'sendSupportMessage']);
$router->add('GET', '/api/admin/users/{id}/stats', [AdminController::class, 'userStats']);
$router->add('POST', '/api/admin/users/{id}/impersonate', [AdminController::class, 'impersonate']);
$router->add('POST', '/api/admin/impersonation/stop', [AdminController::class, 'stopImpersonation']);
$router->add('GET', '/api/admin/export/alterdata', [ExportController::class, 'alterdata']);
$router->add('GET', '/api/admin/export/alterdata/history', [AdminController::class, 'exportAlterdataHistory']);
$router->add('GET', '/api/admin/export/alterdata/config', [AdminController::class, 'getAlterdataExportConfig']);
$router->add('PUT', '/api/admin/export/alterdata/config/{column}', [AdminController::class, 'updateAlterdataExportConfig']);
$router->add('GET', '/', function () {
    global $config;
    if (resolveAuthenticatedUserId($config) > 0) {
        header('Location: /dashboard', true, 302);
        exit;
    }
    header('Content-Type: text/html; charset=utf-8');
    setNoStoreHeaders();
    readfile(__DIR__ . '/index.html');
    exit;
});
$router->add('GET', '/dashboard', function () {
    header('Content-Type: text/html; charset=utf-8');
    setNoStoreHeaders();
    readfile(__DIR__ . '/dashboard.html');
    exit;
});
$router->add('GET', '/ui-kit', function () {
    header('Content-Type: text/html; charset=utf-8');
    setNoStoreHeaders();
    readfile(__DIR__ . '/ui-kit.html');
    exit;
});
$router->add('GET', '/index.php', function () {
    global $config;
    if (resolveAuthenticatedUserId($config) > 0) {
        header('Location: /dashboard', true, 302);
        exit;
    }
    header('Content-Type: text/html; charset=utf-8');
    setNoStoreHeaders();
    readfile(__DIR__ . '/index.html');
    exit;
});
$router->add('GET', '/public/index.php', function () {
    global $config;
    if (resolveAuthenticatedUserId($config) > 0) {
        header('Location: /dashboard', true, 302);
        exit;
    }
    header('Content-Type: text/html; charset=utf-8');
    setNoStoreHeaders();
    readfile(__DIR__ . '/index.html');
    exit;
});

$router->dispatch($_SERVER['REQUEST_METHOD'], parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));

