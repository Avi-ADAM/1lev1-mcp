import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { APP_CONFIG } from './app-config.js';

const HOME = os.homedir();

// כל agent — איפה הקונפיג שלו ואיך נראה הפורמט
const AGENTS = {
    'Claude Desktop': {
        paths: {
            darwin: path.join(HOME, 'Library/Application Support/Claude/claude_desktop_config.json'),
            win32: path.join(process.env.APPDATA ?? '', 'Claude', 'claude_desktop_config.json'),
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
        // על פי הדוקומנטציה הרשמית, ההגדרות נשמרות בקובץ .claude.json בתיקיית הבית
        paths: {
            darwin: path.join(HOME, '.claude.json'),
            win32: path.join(HOME, '.claude.json'),
            linux: path.join(HOME, '.claude.json'),
        },
        write: (config, { mcpUrl, apiKey, name }) => {
            // אנחנו שומרים תחת אובייקט mcpServers הראשי (User Scope - גלובלי)
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
                serverUrl: mcpUrl, // Antigravity משתמש ב-serverUrl לחיבור מרוחק
                headers: { Authorization: `Bearer ${apiKey}` },
            };
            return config;
        },
    },
    'VS Code': {
        // VS Code MCP כותב לworkspace — נכתוב ל-global settings
        paths: {
            darwin: path.join(HOME, 'Library/Application Support/Code/User/settings.json'),
            win32: path.join(process.env.APPDATA ?? '', 'Code', 'User', 'settings.json'),
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
            win32: path.join(HOME, '.openclaw/config.json'), // בחלונות זה לרוב גם בתיקיית הבית
            linux: path.join(HOME, '.openclaw/config.json'),
        },
        write: (config, { mcpUrl, apiKey, name }) => {
            // האובייקט של OpenClaw בנוי בצורה מקוננת: config.mcp.servers
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
            win32: path.join(process.env.APPDATA ?? '', 'Code/User/globalStorage/saoudrizwan.claude-dev/settings/cline_mcp_settings.json'),
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
            win32: path.join(process.env.APPDATA ?? '', 'Code/User/globalStorage/rooveterinaryinc.roo-cline/settings/cline_mcp_settings.json'),
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
            // Continue.dev משתמש במבנה מעט שונה המגדיר transport
            config.mcpServers[name] = {
                transport: {
                    type: "sse",
                    url: mcpUrl,
                    headers: { Authorization: `Bearer ${apiKey}` }
                }
            };
            return config;
        },
    },

};

export async function writeAllConfigs({ mcpUrl, apiKey, name = APP_CONFIG.serviceName }) {
    const platform = process.platform;
    const results = {};

    for (const [agentName, agent] of Object.entries(AGENTS)) {
        const filePath = agent.paths[platform] ?? agent.paths['linux'];

        try {
            // קורא קונפיג קיים (אם יש) או מתחיל ריק
            let config = {};
            if (fs.existsSync(filePath)) {
                const raw = fs.readFileSync(filePath, 'utf-8');
                try {
                    config = JSON.parse(raw);
                } catch (parseError) {
                    // טיפול למקרה שיש הערות בקובץ JSON (קורה הרבה ב-VS Code)
                    console.warn(`[Warning] Could not parse JSON for ${agentName}. Creating new config. Error: ${parseError.message}`);
                }
            }

            // מעדכן
            config = agent.write(config, { mcpUrl, apiKey, name });

            // כותב בחזרה
            fs.mkdirSync(path.dirname(filePath), { recursive: true });
            fs.writeFileSync(filePath, JSON.stringify(config, null, 2), 'utf-8');

            results[agentName] = { success: true, path: filePath };
        } catch (err) {
            results[agentName] = { success: false, reason: err.message };
        }
    }

    return results;
}