import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { APP_CONFIG } from './app-config.js';

const HOME = os.homedir();
const APPDATA = process.env.APPDATA ?? '';

// כל agent — איפה הקונפיג שלו, איך נראה הפורמט, ואיך מזהים שהוא בכלל מותקן.
//
// `detect` הוא רשימת נתיבים שקיומם מעיד שהסוכן מותקן. אנחנו לא כותבים קונפיג
// לסוכן שהמשתמש לא התקין — אחרת כל הרצה של הכלי מפזרת תיקיות ומפתחות API
// לכלים שאיש לא ביקש.
const AGENTS = {
    'Claude Desktop': {
        paths: {
            darwin: path.join(HOME, 'Library/Application Support/Claude/claude_desktop_config.json'),
            win32: path.join(APPDATA, 'Claude', 'claude_desktop_config.json'),
            linux: path.join(HOME, '.config/claude/claude_desktop_config.json'),
        },
        write: (config, { mcpUrl, apiKey, name }) => {
            config.mcpServers ??= {};
            config.mcpServers[name] = {
                url: mcpUrl,
                headers: { Authorization: `Bearer ${apiKey}` },
            };
            return config;
        },
    },

    'Cursor': {
        paths: {
            darwin: path.join(HOME, '.cursor/mcp.json'),
            win32: path.join(HOME, '.cursor/mcp.json'),
            linux: path.join(HOME, '.cursor/mcp.json'),
        },
        write: (config, { mcpUrl, apiKey, name }) => {
            config.mcpServers ??= {};
            config.mcpServers[name] = {
                url: mcpUrl,
                headers: { Authorization: `Bearer ${apiKey}` },
            };
            return config;
        },
    },

    'Windsurf': {
        paths: {
            darwin: path.join(HOME, '.codeium/windsurf/mcp_config.json'),
            win32: path.join(HOME, '.codeium/windsurf/mcp_config.json'),
            linux: path.join(HOME, '.codeium/windsurf/mcp_config.json'),
        },
        write: (config, { mcpUrl, apiKey, name }) => {
            config.mcpServers ??= {};
            config.mcpServers[name] = {
                serverUrl: mcpUrl,          // Windsurf משתמש ב-serverUrl
                headers: { Authorization: `Bearer ${apiKey}` },
            };
            return config;
        },
    },

    'Claude Code': {
        paths: {
            darwin: path.join(HOME, '.claude.json'),
            win32: path.join(HOME, '.claude.json'),
            linux: path.join(HOME, '.claude.json'),
        },
        write: (config, { mcpUrl, apiKey, name }) => {
            // User scope גלובלי
            config.mcpServers ??= {};
            config.mcpServers[name] = {
                type: 'http', // חובה ב-Claude Code להגדיר סוג חיבור
                url: mcpUrl,
                headers: { Authorization: `Bearer ${apiKey}` },
            };
            return config;
        },
    },

    'Antigravity': {
        paths: {
            darwin: path.join(HOME, '.gemini/antigravity/mcp_config.json'),
            win32: path.join(HOME, '.gemini/antigravity/mcp_config.json'),
            linux: path.join(HOME, '.gemini/antigravity/mcp_config.json'),
        },
        write: (config, { mcpUrl, apiKey, name }) => {
            config.mcpServers ??= {};
            config.mcpServers[name] = {
                serverUrl: mcpUrl,
                headers: { Authorization: `Bearer ${apiKey}` },
            };
            return config;
        },
    },

    'VS Code': {
        paths: {
            darwin: path.join(HOME, 'Library/Application Support/Code/User/settings.json'),
            win32: path.join(APPDATA, 'Code', 'User', 'settings.json'),
            linux: path.join(HOME, '.config/Code/User/settings.json'),
        },
        write: (config, { mcpUrl, apiKey, name }) => {
            config['mcp.servers'] ??= {};
            config['mcp.servers'][name] = {
                url: mcpUrl,
                headers: { Authorization: `Bearer ${apiKey}` },
            };
            return config;
        },
    },

    'OpenClaw': {
        paths: {
            darwin: path.join(HOME, '.openclaw/config.json'),
            win32: path.join(HOME, '.openclaw/config.json'),
            linux: path.join(HOME, '.openclaw/config.json'),
        },
        write: (config, { mcpUrl, apiKey, name }) => {
            config.mcp ??= {};
            config.mcp.servers ??= {};
            config.mcp.servers[name] = {
                url: mcpUrl,
                headers: { Authorization: `Bearer ${apiKey}` },
            };
            return config;
        },
    },

    'Cline': {
        paths: {
            darwin: path.join(HOME, 'Library/Application Support/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json'),
            win32: path.join(APPDATA, 'Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json'),
            linux: path.join(HOME, '.config/Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json'),
        },
        write: (config, { mcpUrl, apiKey, name }) => {
            config.mcpServers ??= {};
            config.mcpServers[name] = {
                url: mcpUrl,
                headers: { Authorization: `Bearer ${apiKey}` },
            };
            return config;
        },
    },

    'Roo Code': {
        paths: {
            darwin: path.join(HOME, 'Library/Application Support/Code/User/globalStorage/rooveterinaryinc.roo-cline/settings/cline_mcp_settings.json'),
            win32: path.join(APPDATA, 'Code/User/globalStorage/rooveterinaryinc.roo-cline/settings/cline_mcp_settings.json'),
            linux: path.join(HOME, '.config/Code/User/globalStorage/rooveterinaryinc.roo-cline/settings/cline_mcp_settings.json'),
        },
        write: (config, { mcpUrl, apiKey, name }) => {
            config.mcpServers ??= {};
            config.mcpServers[name] = {
                url: mcpUrl,
                headers: { Authorization: `Bearer ${apiKey}` },
            };
            return config;
        },
    },

    'Continue': {
        paths: {
            darwin: path.join(HOME, '.continue/config.json'),
            win32: path.join(HOME, '.continue/config.json'),
            linux: path.join(HOME, '.continue/config.json'),
        },
        write: (config, { mcpUrl, apiKey, name }) => {
            config.mcpServers ??= {};
            // השרת הוא streamable HTTP, לא SSE.
            config.mcpServers[name] = {
                transport: {
                    type: 'streamable-http',
                    url: mcpUrl,
                    headers: { Authorization: `Bearer ${apiKey}` },
                },
            };
            return config;
        },
    },
};

/** כותב JSON בצורה אטומית: קובץ זמני + rename, כדי שהפסקה באמצע לא תקטע קובץ. */
function writeJsonAtomic(filePath, data) {
    const tmp = `${filePath}.1lev1-tmp-${process.pid}`;
    fs.writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tmp, filePath);
}

/**
 * מעדכן קונפיג של סוכן אחד.
 *
 * שלושה כללי ברזל, שכל אחד מהם נולד מבאג אמיתי:
 *  1. אם הקובץ קיים אבל לא נפרס כ-JSON — לא נוגעים בו. קובץ כזה הוא בדרך
 *     כלל JSONC עם הערות (settings.json של VS Code), והכתיבה הישנה דרסה אותו
 *     באובייקט חדש ומחקה את כל ההגדרות של המשתמש.
 *  2. לא יוצרים קונפיג לסוכן שלא מותקן — קודם היינו יוצרים תיקיות לכלים
 *     שהמשתמש מעולם לא התקין, ומפזרים אליהם מפתח API.
 *  3. גיבוי לפני דריסה, וכתיבה אטומית.
 */
function updateAgentConfig(agentName, agent, { mcpUrl, apiKey, name }) {
    const filePath = agent.paths[process.platform] ?? agent.paths['linux'];
    const exists = fs.existsSync(filePath);

    if (!exists && !fs.existsSync(path.dirname(filePath))) {
        return { success: false, skipped: true, reason: 'not installed' };
    }

    let config = {};
    if (exists) {
        const raw = fs.readFileSync(filePath, 'utf-8');
        if (raw.trim() !== '') {
            try {
                config = JSON.parse(raw);
            } catch {
                return {
                    success: false,
                    reason: 'not plain JSON (comments?) — left untouched, add the server manually',
                    path: filePath,
                };
            }
        }
        if (config === null || typeof config !== 'object' || Array.isArray(config)) {
            return { success: false, reason: 'unexpected config shape — left untouched', path: filePath };
        }
        const backup = `${filePath}.1lev1.bak`;
        if (!fs.existsSync(backup)) fs.copyFileSync(filePath, backup);
    }

    config = agent.write(config, { mcpUrl, apiKey, name });
    writeJsonAtomic(filePath, config);
    return { success: true, path: filePath };
}

export async function writeAllConfigs({ mcpUrl, apiKey, name = APP_CONFIG.serviceName }) {
    const results = {};
    for (const [agentName, agent] of Object.entries(AGENTS)) {
        try {
            results[agentName] = updateAgentConfig(agentName, agent, { mcpUrl, apiKey, name });
        } catch (err) {
            results[agentName] = { success: false, reason: err.message };
        }
    }
    return results;
}

/** מסיר את הרשומה שלנו מכל קונפיג — הבסיס ל-`1lev1-mcp remove`. */
export async function removeAllConfigs({ name = APP_CONFIG.serviceName } = {}) {
    const results = {};
    for (const [agentName, agent] of Object.entries(AGENTS)) {
        const filePath = agent.paths[process.platform] ?? agent.paths['linux'];
        try {
            if (!fs.existsSync(filePath)) {
                results[agentName] = { success: false, skipped: true, reason: 'no config' };
                continue;
            }
            let config;
            try {
                config = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            } catch {
                results[agentName] = { success: false, reason: 'not plain JSON — left untouched', path: filePath };
                continue;
            }
            const buckets = [config.mcpServers, config['mcp.servers'], config.mcp?.servers];
            let removed = false;
            for (const bucket of buckets) {
                if (bucket && Object.prototype.hasOwnProperty.call(bucket, name)) {
                    delete bucket[name];
                    removed = true;
                }
            }
            if (!removed) {
                results[agentName] = { success: false, skipped: true, reason: 'nothing to remove' };
                continue;
            }
            writeJsonAtomic(filePath, config);
            results[agentName] = { success: true, path: filePath };
        } catch (err) {
            results[agentName] = { success: false, reason: err.message };
        }
    }
    return results;
}

export { AGENTS };
