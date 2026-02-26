<?php
declare(strict_types=1);

$pdo = new PDO('sqlite:data/caixa.sqlite');
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$sql = "SELECT e.user_id, substr(e.date,1,7) AS ym, COUNT(*) AS qty, ROUND(SUM(CASE WHEN e.type='out' THEN -e.amount ELSE e.amount END),2) AS bal
        FROM entries e
        WHERE e.deleted_at IS NULL
          AND (e.account_id IS NULL OR e.account_id <= 0)
        GROUP BY e.user_id, ym
        ORDER BY e.user_id, ym DESC";

$rows = $pdo->query($sql)->fetchAll(PDO::FETCH_ASSOC);
if (!$rows) {
    echo "no_rows\n";
    exit(0);
}
foreach ($rows as $row) {
    echo implode("\t", [
        (string)$row['user_id'],
        (string)$row['ym'],
        (string)$row['qty'],
        (string)$row['bal'],
    ]) . PHP_EOL;
}
