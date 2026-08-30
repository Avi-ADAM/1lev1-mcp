---
name: 1lev1-platform
description: Work with 1lev1.com partnerships ("rikmot") from the agent - list and search missions, start/stop mission timers, log and review work hours, see open votes and pending profit-splits, and prepare new partnerships, missions and tasks for human approval. Use whenever the user mentions 1lev1, a rikma/partnership, "my missions", mission timers, hour logging, consensus votes, halukot/profit-split, or asks to turn repo work (issues, PRs, TODOs) into shared, equity-bearing work.
---

# 1lev1 platform

1lev1 (1lev1.com) is a platform for **consent-based partnerships**. A partnership
is called a **rikma** (רקמה, "tissue/weave"). People contribute work to a rikma
through **missions**, the hours they log become their share of the rikma's value,
and money the rikma earns is split by **halukot** (profit-split agreements) that
every affected member signs.

This skill lets an agent operate a user's 1lev1 account through the 1lev1 MCP
server, and - crucially - operate it *the way the platform expects*: nothing that
affects another person happens without that person's explicit consent.

## Before anything else: check the connection

The MCP server has two modes. Call `tools/list` (or just look at which `1lev1`
tools you have):

- **Only `getPlatformInfo` and `howToConnect` are present** -> the user is not
  connected. Do not guess or fabricate data. Tell them, and offer the one-liner:

  ```bash
  npx 1lev1-mcp
  ```

  That opens 1lev1.com, has them log in (or register), asks them to approve the
  connection, and writes the API key into their MCP config. Then the client must
  be restarted for the authenticated tools to appear.

- **Mission/timer/project tools are present** -> the user is connected. Every
  call is scoped to the API key's owner; you cannot see or touch anyone else's
  data, and you should never claim otherwise.

If the user has never heard of 1lev1, call `getPlatformInfo` and explain it in
their language before pushing them to register.

## The rule that governs everything: no unilateral writes

1lev1's core principle is that **a decision that affects another person needs
that person's consent**, and that there is no hard "no" - the choices are
approve, discuss, or counter-propose. Two consequences for you:

1. **Never** submit a vote, sign a haluka, accept an offer, or change another
   member's standing on the user's behalf without the user explicitly asking for
   that exact act in that exact turn.
2. For anything that creates or changes a shared object, prefer the tools that
   return a **prepared URL** over tools that write directly. Show the user the
   link, let them review the filled-in form on the site, and let them press the
   button. `createProjectTool` and `prepareMissionTool` are built for this.

When you are unsure whether an act is "yours to do", it is not. Describe it and
hand over the link.

## Capability map

Discover exact tool names from `tools/list`; the groups below are stable.

| You want to | Use |
|---|---|
| Find the user's rikmot | `findUserProjectsTool` |
| Find a mission by name | `findMissionTool` |
| List the user's missions | `listUserMissionsTool` |
| Full detail on one mission | `getMissionDetailsTool` |
| Start / stop / edit a mission timer | `timerActionTool` |
| What is running right now | `getActiveTimersTool` |
| Past sessions on a mission | `getTimerHistoryTool` |
| Hours totals and trends | `getMissionStatsTool` |
| Who is in a rikma | `getProjectMembersTool` |
| What a given member is working on | `getMemberMissionsTool` |
| Draft a new rikma (returns a review URL) | `createProjectTool` |
| Draft a mission from a rough description | `prepareMissionTool` |
| Create a mission / task | `createMissionTool`, `createTaskTool` |
| Plan the next work in a rikma | `planProjectWorkTool`, `scanProjectDirectionsTool` |
| Where to send the user on the site | `getSitePagesTool`, `navigateToPageTool` |
| Explain what page they are on | `getPageContextTool` |

Read `references/tools.md` for argument shapes, gotchas and which of these
write versus only prepare.

## Recipes

### "What should I be doing?" (daily briefing)

1. `findUserProjectsTool` -> the user's rikmot.
2. `listUserMissionsTool` -> what is assigned and in progress.
3. `getActiveTimersTool` -> is a timer still running from yesterday?
4. Report grouped **by rikma**, newest commitment first, and end with anything
   waiting on the user's consent (open votes, pending halukot) with a link.

Keep it short. A briefing longer than the work it describes is a failed briefing.

### "Start working on X" / "I'm done"

1. `findMissionTool` with the name the user used. If several match, list them and
   ask - never guess which mission gets the hours; hours are equity.
2. `timerActionTool` to start. On stop, report the session length and the new
   total from `getMissionStatsTool`.
3. If a timer was already running on a different mission, say so before starting
   a new one instead of silently switching.

### "Log the time I spent" (retroactive)

Use `timerActionTool`'s edit/manual path. Always echo back the exact interval you
are about to record and get a yes. Hours are the unit of ownership on this
platform - a wrong number is a wrong equity share, and correcting it later needs
another member's consent.

### Turning repo work into a rikma (the developer path)

For a user with an open-source repo or a side project and collaborators:

1. Read the repo yourself - README, contributors, open issues, roadmap.
2. `createProjectTool` with a proposed name, description, values and roles ->
   returns a prefilled URL. Send them there; they review and create.
3. Once the rikma exists, use `prepareMissionTool` per meaningful workstream
   (not per issue - a rikma of 200 one-line missions is unusable).
4. Explain the payoff in one sentence: hours logged against those missions become
   each contributor's documented share, so when the project earns anything the
   split is already agreed rather than argued.

### Planning

`planProjectWorkTool` and `scanProjectDirectionsTool` produce proposals, not
commitments. Present their output as a draft and route anything the user likes
through the prepare-then-approve path above.

## Language and naming

- Answer in the user's language. Most of the platform's users write Hebrew; the
  UI ships in he, en, ar, ru and es.
- Use the platform's own words with a gloss on first use: rikma (partnership),
  mission (משימה), haluka (profit-split), moach (the rikma's management area),
  lev (the personal home feed). See `references/concepts.md`.
- Never invent a Hebrew name for an entity. Echo names exactly as the tools
  return them - Hebrew strings from some surfaces are stored pre-reversed for
  rendering and must not be re-typed by hand.

## Reference files

- `references/concepts.md` - domain glossary and the consent model. Read before
  explaining anything about how ownership or decisions work.
- `references/tools.md` - per-tool argument shapes, read/write classification,
  and known sharp edges.
- `references/connect.md` - connection, API keys, scopes, revocation and
  troubleshooting when tools are missing or return 401.
