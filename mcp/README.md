# Maci for AI assistants (MCP)

Connect Maci to an assistant that speaks the [Model Context Protocol](https://modelcontextprotocol.io) and ask about
your refrigeration units in your own words:

- Which of our units are due a leak check in November?
- Are there open alarms at the Vesterbro store, and has anyone taken them?
- When was MC-0482 last serviced, and what was done?

```
https://mcp.maci.energy/mcp
```

The server is read only. It reads through Maci's API, so the assistant sees what your organisation may see in Maci and
nothing more, and every tool call counts as an API call. The full guide is at
[api.maci.energy/docs/ai-assistants](https://api.maci.energy/docs/ai-assistants).

## Connect

**Claude** (claude.ai and the desktop app): Settings → Connectors → Add custom connector. Name it Maci, paste the
address above and choose Connect.

**ChatGPT:** Settings → Connectors, add a custom connector with the address above. (ChatGPT may ask you to turn on
developer mode for custom connectors.)

**Claude Code:**

```sh
claude mcp add --transport http maci https://mcp.maci.energy/mcp
```

Then run `/mcp` in Claude Code and choose Maci to log in.

**Cursor, VS Code and others:** see [clients.md](clients.md).

In each case the assistant sends you to Maci. Log in as always, choose the organisation and say yes with your passkey.
Only an organisation's admin can connect it.

## Tools

| Tool | What it gives | Scope |
|---|---|---|
| `list_sites` | The organisation's sites, and customers' sites it has units on through a grant | `units:read` |
| `list_units` | The units it works with, filtered by site, status or what changed since a time | `units:read` |
| `get_unit` | One unit's passport: master data, nameplate, refrigerant, charge, CO2 equivalent, components | `units:read` |
| `list_components` | A unit's components | `units:read` |
| `list_service_entries` | A unit's service history | `service:read` |
| `get_fgas_status` | A unit's leak check status: interval, last check, next due (needs Maci Service) | `fgas:read` |
| `list_fgas_entries` | A unit's F-log (needs Maci Service) | `fgas:read` |
| `list_alarms` | Alarms from Maci Intelligence, filtered by open, unit or since a time | `alarms:read` |
| `get_alarm` | One alarm with its values, who took it and how it was closed | `alarms:read` |
| `get_usage` | This month's calls and the limit | any |

Lists come in pages of up to 100; the assistant follows `next_cursor` by itself.

## Skills

Instructions that walk the assistant through a task, step by step. Give one to the assistant (in Claude: add it as a
skill, or paste it into the conversation) and ask for the task.

| Skill | What it does |
|---|---|
| [Leak check plan](skills/leak-check-plan/SKILL.md) | The units due a leak check in a period, by site, with the overdue ones first |
| [F-gas overview](skills/fgas-overview/SKILL.md) | Refrigerant, charge and CO2 equivalent by site, and the units without a leak check status |
| [Alarm report](skills/alarm-report/SKILL.md) | A period's alarms: how many, how fast they were taken, how many were false |
| [Before a visit](skills/before-a-visit/SKILL.md) | What a technician should know before going to a unit |

More examples of questions: [prompts.md](prompts.md).

## Your data

The assistant reads only, and only what your organisation may see. What it reads goes to the assistant you chose and
its provider, so connect only an assistant your organisation is allowed to use. Each connection is listed in the app
under Konto → API-nøgler, "Forbundne AI-assistenter", with who made it and when it was last used. Removing it stops it
at once, and a connection that is not used for 30 days ends by itself.

## For developers

The server follows the MCP specification of 2026-07-28: Streamable HTTP, OAuth 2.1 with PKCE (`S256`), Client ID
Metadata Documents and dynamic client registration, with `app.maci.energy` as the authorization server. Details in the
[guide](https://api.maci.energy/docs/ai-assistants#oauth).
