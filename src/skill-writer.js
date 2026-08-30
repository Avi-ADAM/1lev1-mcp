import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';

const HOME = os.homedir();
const PKG_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SKILL_SRC = path.join(PKG_ROOT, 'skills', '1lev1-platform');

/**
 * Where each agent reads "skills" (standing instructions) from.
 *
 * The MCP server gives the agent hands; the skill gives it judgement. Without
 * it an agent sees ~20 tools with a one-line description each and no idea that
 * a rikma is a partnership, that logged hours are ownership, or that it must
 * never vote on somebody else's behalf. Installing the connection without the
 * skill is what produced most of the bad first impressions.
 *
 * Only targets whose parent directory already exists are written — same rule as
 * the MCP config writer: we never create a tool's home directory for a tool the
 * user has not installed.
 */
const SKILL_TARGETS = {
    'Claude Code': {
        dir: path.join(HOME, '.claude', 'skills', '1lev1-platform'),
        /** Copy the skill folder verbatim (SKILL.md + references/). */
        kind: 'folder',
    },
    'Cursor': {
        // Cursor reads project/user rules as .mdc files rather than skill folders.
        dir: path.join(HOME, '.cursor', 'rules'),
        file: '1lev1.mdc',
        kind: 'flat',
    },
};

/** Recursively copy a directory (Node 16.7+ has fs.cpSync, but keep it explicit). */
function copyDir(src, dest) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
        const s = path.join(src, entry.name);
        const d = path.join(dest, entry.name);
        if (entry.isDirectory()) copyDir(s, d);
        else fs.copyFileSync(s, d);
    }
}

/**
 * Flatten SKILL.md + references into a single document, for agents that take
 * one rules file rather than a skill folder.
 */
function flattenSkill() {
    let out = fs.readFileSync(path.join(SKILL_SRC, 'SKILL.md'), 'utf-8');
    const refDir = path.join(SKILL_SRC, 'references');
    if (fs.existsSync(refDir)) {
        for (const name of fs.readdirSync(refDir).sort()) {
            out += `\n\n---\n\n# reference: ${name}\n\n`;
            out += fs.readFileSync(path.join(refDir, name), 'utf-8');
        }
    }
    return out;
}

export async function writeAllSkills() {
    const results = {};

    if (!fs.existsSync(SKILL_SRC)) {
        return { skill: { success: false, reason: 'skill files missing from package' } };
    }

    for (const [agentName, target] of Object.entries(SKILL_TARGETS)) {
        try {
            // The agent's root config dir must already exist (.claude / .cursor).
            const agentRoot = target.kind === 'folder'
                ? path.dirname(path.dirname(target.dir))   // ~/.claude
                : path.dirname(target.dir);                // ~/.cursor
            if (!fs.existsSync(agentRoot)) {
                results[agentName] = { success: false, skipped: true, reason: 'not installed' };
                continue;
            }

            if (target.kind === 'folder') {
                copyDir(SKILL_SRC, target.dir);
                results[agentName] = { success: true, path: target.dir };
            } else {
                fs.mkdirSync(target.dir, { recursive: true });
                const dest = path.join(target.dir, target.file);
                fs.writeFileSync(dest, flattenSkill(), 'utf-8');
                results[agentName] = { success: true, path: dest };
            }
        } catch (err) {
            results[agentName] = { success: false, reason: err.message };
        }
    }

    return results;
}

export async function removeAllSkills() {
    const results = {};
    for (const [agentName, target] of Object.entries(SKILL_TARGETS)) {
        try {
            const dest = target.kind === 'folder' ? target.dir : path.join(target.dir, target.file);
            if (!fs.existsSync(dest)) {
                results[agentName] = { success: false, skipped: true, reason: 'nothing to remove' };
                continue;
            }
            fs.rmSync(dest, { recursive: true, force: true });
            results[agentName] = { success: true, path: dest };
        } catch (err) {
            results[agentName] = { success: false, reason: err.message };
        }
    }
    return results;
}
