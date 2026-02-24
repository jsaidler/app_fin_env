<?php
declare(strict_types=1);

use App\Controller\AuthController;
use App\Controller\EntryController;
use App\Controller\ReportController;
use App\Controller\ExportController;
use App\Controller\UploadController;
use App\Controller\AccountController;
use App\Controller\AdminController;
use App\Controller\SupportController;
use App\Controller\CategoryController;
use App\Repository\Sqlite\SqliteUserRepository;
use App\Router;
use App\Storage\SqliteConnection;
use App\Util\Response;
use App\Util\Token;
use App\Util\Logger;

require __DIR__ . '/../src/bootstrap.php';
// Backup diário (executa no primeiro acesso do dia)
if (!empty($config['backup_email'])) {
    try {
        (new \App\Service\BackupService($config['paths']['data'], $config['backup_email']))->maybeSend();
    } catch (\Throwable $e) {
        // Ignora falha de backup para não bloquear requisições
    }
}

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

$requestPath = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?: '/';
$requestPath = rawurldecode($requestPath);
denyPathTraversal($requestPath);

// Security headers
header('X-Frame-Options: DENY');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: strict-origin-when-cross-origin');
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
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');
header('Expires: 0');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

if (preg_match('#^/data(/|$)#', $requestPath)) {
    http_response_code(404);
    exit;
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
            ][$ext] ?? 'application/octet-stream';
            header('Content-Type: ' . $mime);
            readfile($file);
            exit;
        }
    }
    http_response_code(404);
    exit;
}
// Serve static assets even se o servidor estiver com docroot fora de /public
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
    readfile($staticFile);
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
$router->add('GET', '/api/categories', [CategoryController::class, 'list']);
$router->add('GET', '/api/reports/summary', [ReportController::class, 'summary']);
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
$router->add('GET', '/api/admin/categories', [AdminController::class, 'categories']);
$router->add('POST', '/api/admin/categories', [AdminController::class, 'createCategory']);
$router->add('PUT', '/api/admin/categories/{id}', [AdminController::class, 'updateCategory']);
$router->add('DELETE', '/api/admin/categories/{id}', [AdminController::class, 'deleteCategory']);
$router->add('GET', '/api/admin/entries', [AdminController::class, 'adminEntries']);
$router->add('POST', '/api/admin/entries', [AdminController::class, 'createAdminEntry']);
$router->add('PUT', '/api/admin/entries/{id}', [AdminController::class, 'updateAdminEntry']);
$router->add('DELETE', '/api/admin/entries/{id}', [AdminController::class, 'deleteAdminEntry']);
$router->add('PUT', '/api/admin/entries/{id}/approve', [AdminController::class, 'approveAdminEntry']);
$router->add('PUT', '/api/admin/entries/{id}/reject', [AdminController::class, 'rejectAdminEntry']);
$router->add('POST', '/api/admin/close-month', [AdminController::class, 'closeMonth']);
$router->add('GET', '/api/admin/closed-months', [AdminController::class, 'closedMonths']);
$router->add('GET', '/api/admin/notifications', [AdminController::class, 'notifications']);
$router->add('PUT', '/api/admin/notifications/{id}/read', [AdminController::class, 'markNotificationRead']);
$router->add('GET', '/api/admin/reports/closure', [AdminController::class, 'closureReport']);
$router->add('GET', '/api/admin/support/threads', [AdminController::class, 'supportThreads']);
$router->add('POST', '/api/admin/support/threads', [AdminController::class, 'createSupportThread']);
$router->add('GET', '/api/admin/support/messages', [AdminController::class, 'supportMessages']);
$router->add('POST', '/api/admin/support/messages', [AdminController::class, 'sendSupportMessage']);
$router->add('GET', '/api/admin/export/alterdata', [ExportController::class, 'alterdata']);
$router->add('GET', '/', function () {
    header('Content-Type: text/html; charset=utf-8');
    readfile(__DIR__ . '/index.html');
    exit;
});
$router->add('GET', '/dashboard', function () {
    header('Content-Type: text/html; charset=utf-8');
    readfile(__DIR__ . '/dashboard.html');
    exit;
});
$router->add('GET', '/admin', function () {
    header('Content-Type: text/html; charset=utf-8');
    readfile(__DIR__ . '/index.html');
    exit;
});
$router->add('GET', '/ui-kit', function () {
    header('Content-Type: text/html; charset=utf-8');
    readfile(__DIR__ . '/ui-kit.html');
    exit;
});
$router->add('GET', '/index.php', function () {
    header('Content-Type: text/html; charset=utf-8');
    readfile(__DIR__ . '/index.html');
    exit;
});
$router->add('GET', '/public/index.php', function () {
    header('Content-Type: text/html; charset=utf-8');
    readfile(__DIR__ . '/index.html');
    exit;
});

$router->dispatch($_SERVER['REQUEST_METHOD'], parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH));
