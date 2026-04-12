import http from 'node:http';
import open from 'open';
import chalk from 'chalk';
import ora from 'ora';
import { writeAllConfigs } from './config-writers.js';
import { APP_CONFIG } from './app-config.js';

export async function runSetup({ url, port }) {
    console.log(chalk.bold('\n  MCP Setup ' + url + ' ' + port + '\n'));

    // 1. מפעיל שרת — מחזיר promise בלי לחכות עליו עדיין
    const { promise: apiKeyPromise } = startCallbackServer(Number(port));

    // 2. רק עכשיו פותח דפדפן
    const authUrl = new URL(APP_CONFIG.authUrlBase);
    authUrl.searchParams.set('callback', `http://localhost:${port}/callback`);

    const spinner = ora('Opening browser...').start();
    await open(authUrl.toString());
    spinner.text = 'Waiting for authentication in browser...';

    // 3. עכשיו מחכה
    const key = await apiKeyPromise;
    spinner.succeed(chalk.green('Authenticated!'));

    const writeSpinner = ora('Writing agent configs...').start();
    const results = await writeAllConfigs({ mcpUrl: url, apiKey: key });
    writeSpinner.stop();

    for (const [agent, status] of Object.entries(results)) {
        const icon = status.success ? chalk.green('✓') : chalk.yellow('–');
        const msg = status.success ? chalk.dim(status.path) : chalk.dim(status.reason);
        console.log(`  ${icon}  ${agent.padEnd(18)} ${msg}`);
    }

    console.log('\n' + chalk.bold('  Done!') + ' Restart your agent to pick up the new config.\n');
}

// נפרד מ-waitForCallback — מחזיר { promise } בלי await
function startCallbackServer(port) {
    const promise = new Promise((resolve, reject) => {
        const server = http.createServer((req, res) => {
            const url = new URL(req.url, `http://localhost:${port}`);
            if (url.pathname !== '/callback') { res.writeHead(404); res.end(); return; }

            const apiKey = url.searchParams.get('api_key');
            if (!apiKey) { res.writeHead(400); res.end('Missing api_key'); return; }

            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(`<!DOCTYPE html><html><head><meta charset="utf-8">
        <style>body{font-family:system-ui;display:flex;align-items:center;
        justify-content:center;height:100vh;margin:0;background:#f9f9f7}
        .card{text-align:center;padding:2rem 3rem;border-radius:16px;
        background:#fff;box-shadow:0 2px 16px #0001}</style>
        </head><body><div class="card">
        <h2>✓ Connected!</h2>
         <b>1💗1 - we can together</b>
        <p>You can close this tab and return to your terminal.</p>
        </div></body></html>`);

            server.close();
            resolve(apiKey);
        });

        server.listen(port, '127.0.0.1', () => {
            console.log(chalk.dim(`  Listening on http://localhost:${port}/callback`));
        });
        server.on('error', reject);
        setTimeout(() => { server.close(); reject(new Error('Timed out')); }, 5 * 60 * 1000);
    });

    return { promise };
}
