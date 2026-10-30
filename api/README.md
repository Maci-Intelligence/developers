# Maci's API

Examples for [Maci's REST API](https://api.maci.energy/docs) at `https://api.maci.energy/v1`. The API is described in
[openapi.yaml](https://api.maci.energy/openapi.yaml) (also [as JSON](https://api.maci.energy/openapi.json)), which is the
source: the files here follow it and do not copy it.

## Get a key

An admin of your organisation makes keys in the app under
[Konto → API-nøgler](https://app.maci.energy/organization/api-keys). Start with a sandbox key (`maci_sandbox_…`): it
works on test data of your own, a site and two units. Give a key only the scopes it needs, and keep it out of code and
repositories.

```sh
export MACI_API_KEY="maci_sandbox_..."
curl https://api.maci.energy/v1/units -H "Authorization: Bearer $MACI_API_KEY"
```

## Webhooks

Maci posts alarms (`alarm.raised`, `alarm.cleared`, `alarm.acknowledged`, `alarm.closed`) and approved invoice bases
(`invoice_draft.approved`) to an address of yours, signed in `X-Maci-Signature`. A receiver in each language, with the
signature checked, the answer sent at once and repeats recognised:

| | Run it |
|---|---|
| [Node](webhooks/node/server.mjs) | `MACI_WEBHOOK_SECRET=whsec_... node server.mjs` |
| [Python](webhooks/python/server.py) | `MACI_WEBHOOK_SECRET=whsec_... python3 server.py` |
| [PHP](webhooks/php/index.php) | `MACI_WEBHOOK_SECRET=whsec_... php -S localhost:3000 index.php` |

The address must be https and on the public internet; to try it locally, put a tunnel in front (for example
`cloudflared tunnel --url http://localhost:3000`). Set the address and get the secret in the app under API-nøgler. The
rules, the retries and every field are in the [webhook guide](https://api.maci.energy/docs/webhooks).

## Scripts

Node 18 or later, no packages. [`maci.mjs`](examples/maci.mjs) is the small client they share: the key from
`MACI_API_KEY`, every page of a list, and a wait when the limit a minute is reached.

| Script | What it does | Scopes |
|---|---|---|
| [`export-units.mjs`](examples/export-units.mjs) | Every unit with its site as CSV, for an asset register | `units:read` |
| [`leak-checks-due.mjs`](examples/leak-checks-due.mjs) | The leak checks due in the next days, overdue first, as CSV | `units:read`, `fgas:read` |

```sh
cd examples
node export-units.mjs > units.csv
node leak-checks-due.mjs 90 > leak-checks.csv
```

## Postman and generated clients

Postman, Insomnia and Bruno import the OpenAPI description directly: import
`https://api.maci.energy/openapi.json` and set the bearer token to your key. Client generators (openapi-generator,
oapi-codegen, openapi-typescript) take the same file.

## Limits

60 calls a minute per key (`429` with `Retry-After` past that) and a fair usage limit a month per organisation. Sandbox
calls do not count towards the month. See [Lists, limits and versions](https://api.maci.energy/docs/conventions).
