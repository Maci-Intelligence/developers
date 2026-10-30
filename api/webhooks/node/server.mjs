// A receiver for Maci's webhooks (https://api.maci.energy/docs/webhooks), with Node's own http module.
//
//   MACI_WEBHOOK_SECRET=whsec_... node server.mjs
//
// Maci posts each event with X-Maci-Event and X-Maci-Signature: "sha256=" and the HMAC-SHA256 of the raw body with
// the webhook's secret, in hex. Check it on the body exactly as it arrived, answer 2xx within 10 seconds, and do the
// work after: anything else is tried again.
import { createHmac, timingSafeEqual } from 'node:crypto';
import { createServer } from 'node:http';

const secret = process.env.MACI_WEBHOOK_SECRET;
if (!secret) throw new Error('Set MACI_WEBHOOK_SECRET to the secret shown in the app.');

export function signatureIsValid(rawBody, header) {
  const expected = Buffer.from('sha256=' + createHmac('sha256', secret).update(rawBody).digest('hex'));
  const given = Buffer.from(header ?? '');
  return given.length === expected.length && timingSafeEqual(given, expected);
}

// An event can come more than once (a late answer is tried again): remember what was handled.
const handled = new Set();

async function handle({ event, data }) {
  switch (event) {
    case 'alarm.raised':
      console.log(`Alarm: ${data.name} on ${data.unit} (${data.unit_public_id}) at ${data.site}`, data.values);
      break;
    case 'alarm.acknowledged':
      console.log(`Taken by ${data.acknowledged_by}: ${data.name} on ${data.unit}`);
      break;
    case 'alarm.cleared':
    case 'alarm.closed':
      console.log(`${event}: ${data.name} on ${data.unit}`, data.result ?? '');
      break;
    case 'invoice_draft.approved':
      console.log(`Invoice basis approved: ${data.id}`);
      break;
    default:
      console.log(`Not handled: ${event}`);
  }
}

createServer((req, res) => {
  if (req.method !== 'POST') return res.writeHead(405).end();
  const chunks = [];
  req.on('data', (chunk) => chunks.push(chunk));
  req.on('end', () => {
    const raw = Buffer.concat(chunks);
    if (!signatureIsValid(raw, req.headers['x-maci-signature'])) return res.writeHead(401).end();
    res.writeHead(200).end();

    const body = JSON.parse(raw.toString('utf8'));
    const key = `${body.event}:${body.data?.id}`;
    if (handled.has(key)) return;
    handled.add(key);
    handle(body).catch((error) => console.error(error));
  });
}).listen(process.env.PORT ?? 3000, () => console.log(`Listening on :${process.env.PORT ?? 3000}`));
