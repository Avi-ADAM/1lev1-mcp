# 1lev1 MCP tools

Names below are the tool names the server exposes. Always confirm against
`tools/list` - the set depends on the key's scopes.

## Read

| Tool | Input | Notes |
|---|---|---|
| `findUserProjectsTool` | `query?` (and `userId?`, which you should omit) | Returns `{ id, idPr, name }[]`. `id` is the internal id; `idPr` is what site URLs use. Omit `userId` — it defaults to the key's owner, and naming anyone else is refused. |
| `findMissionTool` | `missionName` | Substring match across the user's missions. Returns `projectId` and `projectName` too - use it to disambiguate. |
| `listUserMissionsTool` | - | The caller's missions. |
| `getMissionDetailsTool` | mission id | Full record incl. skills, roles, hours. |
| `getActiveTimersTool` | - | Currently running timers. Check this before starting a new one. |
| `getTimerHistoryTool` | mission id | Past sessions. |
| `getMissionStatsTool` | mission id | Totals and trends. |
| `getProjectMembersTool` | `projectId`, `query?` | Returns `people[{id,username}]` **and** `roles[{id,roleDescription}]`. This is the only way to turn a name into an id. |
| `getMemberMissionsTool` | `projectId`, `userId` | Another member's in-progress missions in that rikma. |
| `getSitePagesTool` | - | The site's URL map. |
| `getPageContextTool` | path | What a given page is for. |
| `getPlatformInfo` | - | Public. Available even unauthenticated. |
| `howToConnect` | - | Public. The connect instructions. |

## Prepare (safe - returns a URL, writes nothing)

| Tool | Input | Returns |
|---|---|---|
| `createProjectTool` | `name`, `desc?`, `details?` (HTML), `url?`, `vals?` (value names), `res?` (`feh` 48h / `sth` 72h / `nsh` 96h / `sevend` 1 week), `profit?`, `ont?` (continuous vs one-off) | A prefilled rikma-creation URL. **This is the preferred way to create a rikma.** |
| `prepareMissionTool` | `projectId`, `name`, `descrip?`, `skills?`, `roles?`, `workways?`, `nhours?`, `valph?` | A prefilled mission-creation URL. Prefer over `createMissionTool` unless the user asked for direct creation. |
| `navigateToPageTool` | page | A link to send the user to. |
| `planProjectWorkTool`, `scanProjectDirectionsTool` | project context | Drafts. Proposals, never commitments. |

## Write (changes state - require an explicit ask)

`timerActionTool` is available to every key: it only ever touches the caller's
own timers and hours.

| Tool | Input | Notes |
|---|---|---|
| `timerActionTool` | `action`: `start` / `stop` / `pause` / `resume`, `missionId?` | Without `missionId` it acts on the currently active timer. **Always pass `missionId` on `start`** - an omitted id on an ambiguous account is how hours land on the wrong mission. |

## Shared write (needs the `mcp:write` scope)

These create work and obligations for **other** members, so a default key does
not get them - they appear in `tools/list` only when the key was granted
`mcp:write`. If a user asks for one and you do not have the tool, say the key
needs that scope rather than improvising a workaround.

| Tool | Input | Notes |
|---|---|---|
| `createMissionTool` | `projectId`, `missionName`, plus `descrip?`, `skills?`, `roles?`, `workways?`, `nhours?`, `valph?`, `iskvua?` (recurring monthly), `dateStart?`, `dateEnd?`, `assignedUserId?`, `checklist?` | Omit `assignedUserId` to leave the mission open for anyone in the rikma to take. |
| `createTaskTool` | `projectId`, `name`, `description?`, `link?`, `missionId?`, `hashivut` (`white`/`green`/`yellow`/`red`), `dateS?`, `dateF?`, and **either** `assignedUserId` **or** `tafkidims` (role ids) - never both | Resolve names to ids with `getProjectMembersTool` first. Assigning to a role means "whoever holds it sees it". |

Prefer `prepareMissionTool` even when you do hold `mcp:write`: a prefilled form
the human approves is the platform's own pattern, and it costs one click.

## Agent and workflow tools

Older deployments also exposed `ask_*` and `run_*` tools proxying 1lev1's own
in-app assistant. They are no longer served, and if you ever see one, do not use
it: calling it puts a second, less-informed agent inside your own loop. Use the
concrete tools above.

## Sharp edges

- **`id` vs `idPr`.** Site URLs use `idPr`. Tool inputs want `id`. Mixing them
  produces a 404 or an empty result rather than an error.
- **`createTaskTool` writes immediately** with a service token, not through the
  user's session. Treat it as a real write: confirm the target rikma, mission and
  assignee with the user before calling it.
- **Hebrew names may be stored pre-reversed** for canvas rendering on some
  surfaces. Echo what the tool returned; do not retype or "fix" it.
- **A timer left running accrues hours.** If `getActiveTimersTool` shows one from
  a previous day, surface it before doing anything else.
- **You cannot read another user's data.** Tools that take a `userId` refuse one
  that is not the key's owner. If the user wants a teammate's status, use
  `getProjectMembersTool` + `getMemberMissionsTool` within a shared rikma.
