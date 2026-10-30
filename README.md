# Maci for developers

[Maci](https://maci.energy) gives every refrigeration unit a passport behind a QR tag: its master data, components,
service history, the F-log the EU's F-gas regulation asks for, and alarms from Maci Intelligence. This repository has
what you need to build on it. There is no server code here: the services run at Maci.

| | What | Where it runs |
|---|---|---|
| [`mcp/`](mcp/) | Ask Claude, ChatGPT or another AI assistant about your units. Read only. | `https://mcp.maci.energy/mcp` |
| [`api/`](api/) | Webhook receivers and scripts for Maci's REST API. | `https://api.maci.energy/v1` |

The documentation is at [api.maci.energy/docs](https://api.maci.energy/docs), with the OpenAPI description at
[api.maci.energy/openapi.yaml](https://api.maci.energy/openapi.yaml) and everything for language models at
[api.maci.energy/llms.txt](https://api.maci.energy/llms.txt).

## Who can use it

An organisation's admin makes API keys and connects AI assistants in the app, under
[Konto → API-nøgler](https://app.maci.energy/organization/api-keys). An owner of units needs at least one unit with
Maci Service; a refrigeration company needs none of its own and reaches the customers' units it has a grant on.
Start with a sandbox key (`maci_sandbox_…`): it works on test data of your own.

## På dansk

Her er det, du skal bruge for at bygge på Maci: forbind en AI-assistent (`mcp/`), og eksempler på webhooks og scripts
til API'et (`api/`). Dokumentationen er på [api.maci.energy/docs](https://api.maci.energy/docs), og nøgler og
forbindelser laves i appen under Konto → API-nøgler.

## Help

Write to [hello@maci.energy](mailto:hello@maci.energy). Report a security issue to the same address with "Security"
in the subject; please do not open a public issue for it.

## License

MIT, see [LICENSE](LICENSE). The name "Maci" and the Maci logo are not covered.
