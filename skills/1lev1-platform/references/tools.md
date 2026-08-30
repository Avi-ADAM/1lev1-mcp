# 1lev1 MCP tools

Names below are the tool names the server exposes. Always confirm against
`tools/list` - the set depends on the key's scopes.

## Read

| Tool | Input | Notes |
|---|---|---|
| `findUserProjectsTool` | `userId` (required), `query?` | Returns `{ id, idPr, name }[]`. `id` is the internal id; `idPr` is what site URLs use. See **Sharp edges**. |
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

| Tool | Input | Notes |
|---|---|---|
| `timerActionTool` | `action`: `start` / `stop` / `pause` / `resume`, `missionId?` | Without `missionId` it acts on the currently active timer. **Always pass `missionId` on `start`** - an omitted id on an ambiguous account is how hours land on the wrong mission. |
| `createMissionTool` | `projectId`, `missionName`, plus `descrip?`, `skills?`, `roles?`, `workways?`, `nhours?`, `valph?`, `iskvua?` (recurring monthly), `dateStart?`, `dateEnd?`, `assignedUserId?`, `checklist?` | Omit `assignedUserId` to leave the mission open for anyone in the rikma to take. |
| `createTaskTool` | `projectId`, `name`, `description?`, `link?`, `missionId?`, `hashivut` (`white`/`green`/`yellow`/`red`), `dateS?`, `dateF?`, and **either** `assignedUserId` **or** `tafkidims` (role ids) - never both | Resolve names to ids with `getProjectMembersTool` first. Assigning to a role means "whoever holds it sees it". |

## Agent and workflow tools

The server may also expose `ask_*` and `run_*` tools that proxy 1lev1's own
internal chat agents. **Do not use them.** They are the site's in-app assistant;
calling them from another agent produces a second, less-informed agent in the
loop. Use the concrete tools above.

## Sharp edges

- **`findUserProjectsTool` needs a `userId` you do not have.** The tool takes
  `userId` as a required input and does not fall back to the API key's owner, so
  an external client has nothing to pass. Until this is fixed server-side, reach
  a rikma through `findMissionTool` (which returns `projectId` and
  `projectName`) or ask the user for the rikma's id from its URL.
- **`id` vs `idPr`.** Site URLs use `idPr`. Tool inputs want `id`. Mixing them
  produces a 404 or an empty result rather than an error.
- **`createTaskTool` writes immediately** with a service token, not through the
  user's session. Treat it as a real write: confirm the target rikma, mission and
  assignee with the user before calling it.
- **Hebrew names may be stored pre-reversed** for canvas rendering on some
  surfaces. Echo what the tool returned; do not retype or "fix" it.
- **A timer left running accrues hours.** If `getActiveTimersTool` shows one from
  a previous day, surface it before doing anything else.
