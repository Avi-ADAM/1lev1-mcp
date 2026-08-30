#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Command } from 'commander';
import { runSetup, runRemove } from '../src/auth-flow.js';
import { APP_CONFIG } from '../src/app-config.js';

// Read the real version from package.json rather than repeating it here — the
// hardcoded '1.0.0' had drifted two releases behind what npm was serving.
const pkg = JSON.parse(
    fs.readFileSync(
        path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'package.json'),
        'utf-8'
    )
);

const program = new Command();

program
    .name(APP_CONFIG.serviceName)
    .description('Connect 1lev1 to your AI coding agents')
    .version(pkg.version);

program
    .command('setup', { isDefault: true })
    .description('Authenticate and configure all supported agents')
    .option('--url <url>', 'MCP server URL', APP_CONFIG.mcpUrl)
    .option('--port <port>', 'Local callback port', APP_CONFIG.defaultPort.toString())
    .action(runSetup);

program
    .command('remove')
    .description('Remove the 1lev1 server and skill from every agent config')
    .action(runRemove);

program.parse();
