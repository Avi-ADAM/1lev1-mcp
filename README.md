# 1lev1 MCP Setup 💗 (English)

**Your AI agent, as a partner in your rikma.** One command connects
[1lev1](https://1lev1.com) - the platform where shared work turns into shared
ownership, by consent - to Claude Code, Claude Desktop, Cursor, Windsurf and
VS Code over MCP, and teaches the agent how the platform works.

On claude.ai or the Claude app you don't need this CLI at all: add a custom
connector with the URL `https://api.1lev1.com/api/mcp` and sign in when Claude
asks.

## What your agent can do

- 📬 **"What's waiting for me?"** - a ready briefing in your language of every
  vote, proposal and profit split across your rikmas, including which ones
  silence will approve, and when.
- ⏱️ **Hours that become ownership** - start, stop, pause and resume mission
  timers by just saying so. Every logged hour is your documented share.
- 🧬 **A whole rikma from a repo or a business plan** - the agent reads your
  README or plan and drafts the missions, resources and products; you review
  and create. Share a preview link with future partners, or prepare a rikma for
  a friend or a client.
- 🗺️ **Planning and processes** - plan the next work, scan directions, and open
  a *process* when you want to approach a partner, an organisation or a funder,
  with the open missions it needs attached.
- 💬 **Conversations** - read and post in the threads of missions, decisions and
  profit splits, or open the rikma-wide thread.
- 🛎️ **Concierge and catalog** - find who already offers what you need, follow
  your wishes and the proposals on them, and see what others asked of you.
- 🛍️ **A full storefront** - products, options and variants, stock, orders and
  their status, shipping zones and live quotes.
- 🤝 **Consent built in** - the agent never votes, signs or accepts for you.
  Anything that touches another member is prepared as a link that member
  approves. That is the platform's core rule, and the skill teaches it.

Every tool is documented at [1lev1.com/mcp](https://1lev1.com/mcp).

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

**סוכן ה-AI שלך, כשותף ברקמה שלך.** פקודה אחת מחברת את
[1lev1](https://1lev1.com) - הפלטפורמה שבה עבודה משותפת הופכת לבעלות משותפת,
בהסכמה - ל-Claude Code, Claude Desktop, Cursor, Windsurf ו-VS Code דרך MCP,
ומלמדת את הסוכן איך הפלטפורמה עובדת.

ב-claude.ai או באפליקציית Claude לא צריך את הכלי הזה בכלל: מוסיפים connector
מותאם אישית עם הכתובת `https://api.1lev1.com/api/mcp` ומתחברים כש-Claude מבקש.

## מה הסוכן שלך יכול לעשות

- 📬 **"מה מחכה לי?"** - תדריך מוכן בשפה שלך של כל הצבעה, הצעה וחלוקת רווח בכל
  הרקמות שלך, כולל אילו מהן יאושרו מעצמן בשתיקה, ומתי.
- ⏱️ **שעות שהופכות לבעלות** - הפעלה, עצירה, השהיה וחידוש של טיימרים למשימות
  פשוט במילים. כל שעה שנרשמת היא החלק המתועד שלך.
- 🧬 **רקמה שלמה מתוך ריפו או תוכנית עסקית** - הסוכן קורא את ה-README או
  התוכנית ומכין טיוטה של המשימות, המשאבים והמוצרים; אתם בודקים ויוצרים. אפשר
  לשתף קישור תצוגה מקדימה עם שותפים עתידיים, או להכין רקמה עבור חבר או לקוח.
- 🗺️ **תכנון ותהליכים** - תכנון העבודה הבאה, סריקת כיוונים, ופתיחת *תהליך*
  כשרוצים לפנות לשותף, לארגון או לגורם מממן, עם המשימות הפתוחות שהוא צריך.
- 💬 **שיחות** - קריאה וכתיבה בשיחות של משימות, החלטות וחלוקות, או פתיחת השיחה
  של כל הרקמה.
- 🛎️ **קונסיירז' וקטלוג** - מי כבר מציע את מה שאתם צריכים, מעקב אחרי הרצונות
  שלכם וההצעות עליהם, ומה אחרים ביקשו מכם.
- 🛍️ **חנות מלאה** - מוצרים, אפשרויות ווריאציות, מלאי, הזמנות והסטטוס שלהן,
  אזורי משלוח והצעות מחיר בזמן אמת.
- 🤝 **הסכמה מובנית** - הסוכן אף פעם לא מצביע, חותם או מאשר במקומכם. כל דבר
  שנוגע בחבר אחר מוכן כקישור שאותו חבר מאשר. זה הכלל המרכזי של הפלטפורמה,
  והסקיל מלמד אותו.

כל כלי מתועד ב-[1lev1.com/mcp](https://1lev1.com/mcp).

## התקנה ושימוש

אין צורך בהתקנה מוקדמת. פשוט הריצו:

```bash
npx 1lev1-mcp
```

הפקודה מחברת (פותחת את 1lev1.com, מתחברים ומאשרים, והמפתח נכתב לכל סוכן
שמותקן אצלכם) ומתקינה את הסקיל - ההנחיות שמלמדות את הסוכן מה זו רקמה, ששעות
הן בעלות, ושאסור לו להצביע או לחתום על חלוקה בשם אף אחד. אחר כך מפעילים מחדש
את הסוכן. להסרה: `npx 1lev1-mcp remove`.

## התאמה אישית (למפתחים)

אם ברצונך להשתמש בכלי זה עבור פרויקט MCP משלך, עליך לבצע שתי פעולות פשוטות:

1. **עריכת הקונפיג**: שנה את הערכים ב-`src/app-config.js` כדי שיתאימו לשם השירות ולכתובות ה-URL של השרת שלך.
2. **מימוש בצד השרת**: עליך לוודא שבאתר שלך קיימים הראוטים (Routes) הבאים:
   - `authUrlBase`: דף שמבצע אימות ומחזיר את המשתמש לכתובת ה-callback עם ה-API Key.
   - `mcpUrl`: נקודת הקצה (Endpoint) של שרת ה-MCP שתומכת ב-SSE או ב-Stdio.

---
