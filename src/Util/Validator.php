<?php
declare(strict_types=1);

namespace App\Util;

class Validator
{
    public static function email(string $email): bool
    {
        // Permite e-mails sem TLD (ex: admin@local) para ambientes internos
        return filter_var($email, FILTER_VALIDATE_EMAIL) !== false
            || preg_match('/^[^\\s@]+@[^\\s@]+$/', $email) === 1;
    }

    public static function nonEmpty(string $value): bool
    {
        return trim($value) !== '';
    }

    public static function positiveNumber($value): bool
    {
        return is_numeric($value) && (float)$value > 0;
    }

    public static function date(string $value): bool
    {
        return (bool) strtotime($value);
    }
}
