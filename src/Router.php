<?php
declare(strict_types=1);

namespace App;

use App\Util\Response;

class Router
{
    private array $routes = [];

    public function add(string $method, string $pattern, callable|array $handler): void
    {
        $this->routes[] = [
            'method' => strtoupper($method),
            'pattern' => $this->compile($pattern),
            'raw' => $pattern,
            'handler' => $handler,
        ];
    }

    public function dispatch(string $method, string $path): void
    {
        $method = strtoupper($method);
        foreach ($this->routes as $route) {
            if ($route['method'] !== $method) {
                continue;
            }
            if (preg_match($route['pattern'], $path, $matches)) {
                $params = array_filter($matches, 'is_string', ARRAY_FILTER_USE_KEY);
                $handler = $route['handler'];
                if (is_array($handler)) {
                    [$class, $action] = $handler;
                    $instance = new $class();
                    $instance->$action($params);
                    return;
                }
                $handler($params);
                return;
            }
        }
        Response::json(['error' => 'Not found'], 404);
    }

    private function compile(string $pattern): string
    {
        $regex = preg_replace('#\{([a-zA-Z_][a-zA-Z0-9_]*)\}#', '(?P<$1>[^/]+)', $pattern);
        return '#^' . $regex . '$#';
    }
}
