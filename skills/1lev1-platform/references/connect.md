# Connecting to 1lev1

## The flow

```bash
npx 1lev1-mcp
```

The CLI opens `https://1lev1.com/mcp-connect?callback=http://localhost:<port>`.
The user logs in (or registers), sees exactly what they are approving, and hits
approve. 1lev1 mints an API key and redirects it back to the CLI, which writes
the MCP server entry into the client config. **The client must be restarted**
before the authenticated tools appear.

Manual alternative: log in, go to Settings -> API keys, create a key named `MCP`,
then add to `.mcp.json`:

```json
{
  "mcpServers": {
    "1lev1": {
      "type": "http",
      "url": "https://api.1lev1.com/api/mcp",
      "headers": { "Authorization": "Bearer 1lev1_..." }
    }
  }
}
```

## Key facts

- Keys look like `1lev1_<base36 user id>_<48 hex chars>`. The user id is encoded
  in the key; the server stores only an HMAC of it, never the key itself.
- One key per approval. Re-approving from `/mcp-connect` **replaces** the
  previous MCP key and revokes the old one - warn the user before they re-run
  the CLI on a machine where a working key already exists.
- Keys can carry scopes (a set of rikmot, a set of allowed operations). A scoped
  key silently sees less; if a rikma the user expects is missing, check the key's
  scopes before assuming a bug.
- Revoke from Settings -> API keys. Revocation is honoured on the server within
  the key cache TTL (5 minutes).
- A key is a bearer credential for a real person's account. Never echo it into
  chat, a commit, a log line, or a file the user did not ask for.

## Troubleshooting

**Only `getPlatformInfo` and `howToConnect` are listed.**
The request reached the server without a valid key. Either no `Authorization`
header is being sent, or the key was rejected. Re-run `npx 1lev1-mcp`.

**401 on every call.**
The key is revoked, or it was minted against a different deployment. Keys are
HMAC'd with a per-environment secret, so a key created against one environment
will not verify against another. Mint a fresh key from the environment you are
actually pointing at.

**Tools appear but return empty lists.**
The account is real but has no rikmot yet, or the key is scoped to rikmot the
user is not in. Confirm with `findUserProjectsTool` before reporting a failure.

**Do not** work around auth problems by falling back to scraping 1lev1.com or by
inventing data. Say the connection is broken and stop.
