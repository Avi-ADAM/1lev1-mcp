#!/usr/bin/env node
import { Command } from 'commander';
import { runSetup } from '../src/auth-flow.js';
import { APP_CONFIG } from '../src/app-config.js';

const program = new Command();

program
    .name(APP_CONFIG.serviceName)
    .description('Connect your MCP server to AI coding agents')
    .version('1.0.0');

program
    .command('setup', { isDefault: true })
    .description('Authenticate and configure all supported agents')
    .option('--url <url>', 'MCP server URL', APP_CONFIG.mcpUrl)
    .option('--port <port>', 'Local callback port', APP_CONFIG.defaultPort.toString())
    .action(runSetup);

program.parse();