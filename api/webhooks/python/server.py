"""A receiver for Maci's webhooks (https://api.maci.energy/docs/webhooks), with Python's standard library only.

    MACI_WEBHOOK_SECRET=whsec_... python3 server.py

Maci posts each event with X-Maci-Event and X-Maci-Signature: "sha256=" and the HMAC-SHA256 of the raw body with the
webhook's secret, in hex. Check it on the body exactly as it arrived, answer 2xx within 10 seconds, and do the work
after: anything else is tried again.
"""

from __future__ import annotations

import hashlib
import hmac
import json
import os
import threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

SECRET = os.environ["MACI_WEBHOOK_SECRET"].encode()
handled = set()  # An event can come more than once: remember what was handled.


def signature_is_valid(raw_body: bytes, header: str | None) -> bool:
    expected = "sha256=" + hmac.new(SECRET, raw_body, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, header or "")


def handle(body: dict) -> None:
    event, data = body["event"], body["data"]
    if event == "alarm.raised":
        print(f"Alarm: {data['name']} on {data['unit']} ({data['unit_public_id']}) at {data['site']}", data["values"])
    elif event == "alarm.acknowledged":
        print(f"Taken by {data['acknowledged_by']}: {data['name']} on {data['unit']}")
    elif event in ("alarm.cleared", "alarm.closed"):
        print(f"{event}: {data['name']} on {data['unit']}", data.get("result") or "")
    elif event == "invoice_draft.approved":
        print(f"Invoice basis approved: {data['id']}")
    else:
        print(f"Not handled: {event}")


class Receiver(BaseHTTPRequestHandler):
    def do_POST(self):
        raw = self.rfile.read(int(self.headers.get("Content-Length", 0)))
        if not signature_is_valid(raw, self.headers.get("X-Maci-Signature")):
            self.send_response(401)
            self.end_headers()
            return
        self.send_response(200)
        self.end_headers()

        body = json.loads(raw)
        key = f"{body['event']}:{body['data'].get('id')}"
        if key in handled:
            return
        handled.add(key)
        threading.Thread(target=handle, args=(body,)).start()


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 3000))
    print(f"Listening on :{port}")
    ThreadingHTTPServer(("", port), Receiver).serve_forever()
