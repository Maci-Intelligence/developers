# Clients

Every client below uses the same address and logs in with OAuth in the browser. There is no key to paste.

```
https://mcp.maci.energy/mcp
```

## Claude Code

```sh
claude mcp add --transport http maci https://mcp.maci.energy/mcp
```

Run `/mcp` and choose Maci to log in. Add `--scope project` to share it with the project through `.mcp.json`.

## Cursor

`~/.cursor/mcp.json` (or `.cursor/mcp.json` in a project):

```json
{
  "mcpServers": {
    "maci": {
      "url": "https://mcp.maci.energy/mcp"
    }
  }
}
```

## VS Code

`.vscode/mcp.json`:

```json
{
  "servers": {
    "maci": {
      "type": "http",
      "url": "https://mcp.maci.energy/mcp"
    }
  }
}
```

## Other clients

Any client that supports remote MCP servers over Streamable HTTP with OAuth works. If a client can only start a local
server, a bridge such as [`mcp-remote`](https://www.npmjs.com/package/mcp-remote) can stand between:

```json
{
  "mcpServers": {
    "maci": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://mcp.maci.energy/mcp"]
    }
  }
}
```

## Your own agent

An agent of your own logs in like any client: discover the authorization server from
`https://mcp.maci.energy/.well-known/oauth-protected-resource/mcp`, register (a Client ID Metadata Document or
`POST https://app.maci.energy/oauth/register`), and run the authorization code flow with PKCE. For an agent without a
person to say yes, use Maci's REST API with an API key instead: it gives the same data (see [`../api/`](../api/)).
