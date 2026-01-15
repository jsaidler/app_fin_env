<?php
declare(strict_types=1);

namespace App\Service;

use App\Util\Image;

class UploadService
{
    private string $uploadDir;

    public function __construct(string $uploadDir)
    {
        $this->uploadDir = $uploadDir;
    }

    public function handle(array $file, int $userId): ?string
    {
        return Image::saveUploaded($file, $this->uploadDir, $userId);
    }
}
