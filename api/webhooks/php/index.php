<?php

// A receiver for Maci's webhooks (https://api.maci.energy/docs/webhooks), in plain PHP.
//
//   MACI_WEBHOOK_SECRET=whsec_... php -S localhost:3000 index.php
//
// Maci posts each event with X-Maci-Event and X-Maci-Signature: "sha256=" and the HMAC-SHA256 of the raw body with
// the webhook's secret, in hex. Check it on the body exactly as it arrived, answer 2xx within 10 seconds, and do the
// work after: anything else is tried again. An event can come more than once, so recognise it by event and data.id.

$secret = getenv('MACI_WEBHOOK_SECRET') ?: throw new RuntimeException('Set MACI_WEBHOOK_SECRET to the secret shown in the app.');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit;
}

$raw = file_get_contents('php://input');
$expected = 'sha256='.hash_hmac('sha256', $raw, $secret);
if (! hash_equals($expected, $_SERVER['HTTP_X_MACI_SIGNATURE'] ?? '')) {
    http_response_code(401);
    exit;
}

// Answer first, then do the work.
http_response_code(200);
if (function_exists('fastcgi_finish_request')) {
    fastcgi_finish_request();
}

$body = json_decode($raw, true);
$data = $body['data'];

match ($body['event']) {
    'alarm.raised' => error_log("Alarm: {$data['name']} on {$data['unit']} ({$data['unit_public_id']}) at {$data['site']}"),
    'alarm.acknowledged' => error_log("Taken by {$data['acknowledged_by']}: {$data['name']} on {$data['unit']}"),
    'alarm.cleared', 'alarm.closed' => error_log("{$body['event']}: {$data['name']} on {$data['unit']}"),
    'invoice_draft.approved' => error_log("Invoice basis approved: {$data['id']}"),
    default => error_log("Not handled: {$body['event']}"),
};
