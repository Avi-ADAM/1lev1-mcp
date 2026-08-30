# 1lev1 MCP Setup 💗 (English)

A CLI tool to quickly connect the **1lev1** system to your favorite AI agents (Claude Desktop, Cursor, Windsurf, VS Code, etc.) using the MCP (Model Context Protocol).

## Features

By connecting, your AI agent gains "superpowers" within the 1lev1 system:

- 🕒 **Timer Control**: Start, stop, and manage timers in real-time.
- 🤝 **Partnerships**: Manage and connect different entities in the system.
- ✅ **Task Management**: Automatically create and track tasks.
- 📊 **Voting & Sales Data**: Get real-time updates on audience voting and sales reports.

## Installation & Usage

No prior installation is needed. Simply run:

```bash
npx 1lev1-mcp
```

This does two things:

1. **Connects** — opens 1lev1.com, you log in and approve, and the API key is
   written into every AI agent you actually have installed.
2. **Installs the skill** — the standing instructions that teach the agent what
   a rikma is, that logged hours are ownership, and that it must never vote or
   sign a profit-split on somebody else's behalf. The connection gives the agent
   hands; the skill gives it judgement.

Restart your agent afterwards to pick up the new config.

To undo everything:

```bash
npx 1lev1-mcp remove
```

That removes the server entry and the skill from every agent config. The API key
itself stays valid until you revoke it at **1lev1.com → Settings → API keys**.

### What it will not touch

- Config files that are not plain JSON (VS Code `settings.json` with comments,
  for example) are **left alone** and reported, never rewritten.
- Agents you have not installed are skipped — no directories are created and no
  API key is written for a tool you do not use.
- Every file it does modify is backed up once to `<file>.1lev1.bak` first, and
  written atomically.

## Customization (for Developers)

To use this tool for your own MCP project, follow these two simple steps:

1. **Edit Config**: Change the values in `src/app-config.js` to match your service name and server URLs.
2. **Server-Side Implementation**: Ensure your website has the following routes:
   - `authUrlBase`: A page for authentication that returns the user to the callback URL with the API Key.
   - `mcpUrl`: The MCP server endpoint (supporting SSE or Stdio).

---

**1lev1 - we can together 💗**

---

# 1lev1 MCP Setup (Hebrew) 💗

כלי CLI לחיבור מהיר של מערכת **1lev1** לסוכני ה-AI האהובים עליך (Claude Desktop, Cursor, Windsurf, VS Code ועוד) באמצעות פרוטוקול MCP (Model Context Protocol).

## מה זה מאפשר?

באמצעות החיבור, סוכן ה-AI שלך מקבל יכולות "על" בתוך המערכת של 1lev1:

- 🕒 **שליטה בטיימרים**: הפעלה, עצירה וניהול זמן בזמן אמת.
- 🤝 **יצירת שותפויות**: ניהול וחיבור גורמים שוני במערכת.
- ✅ **ניהול משימות**: יצירה ומעקב אחר משימות בצורה אוטובטית.
- 📊 **נתוני הצבעות ומכירות**: קבלת מידע מעודכן על הצבעות קהל ודו"חות מכירה.

## התקנה ושימוש

ברגע שהחבילה מפורסמת ב-NPM, אין צורך בהתקנה מוקדמת. פשוט הריצו:

```bash
npx 1lev1-mcp
```

## התאמה אישית (למפתחים)

אם ברצונך להשתמש בכלי זה עבור פרויקט MCP משלך, עליך לבצע שני פעולות פשוטות:

1. **עריכת הקונפיג**: שנה את הערכים ב-`src/app-config.js` כדי שיתאימו לשם השירות ולכתובות ה-URL של השרת שלך.
2. **מימוש בצד השרת**: עליך לוודא שבאתר שלך קיימים הראוטים (Routes) הבאים:
   - `authUrlBase`: דף שמבצע אימות ומחזיר את המשתמש לכתובת ה-callback עם ה-API Key.
   - `mcpUrl`: נקודת הקצה (Endpoint) של שרת ה-MCP שתומכת ב-SSE או ב-Stdio.

---
