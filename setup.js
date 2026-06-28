/**
 * setup.js — Interactive Gmail App Password configurator
 * Run with:  node setup.js
 */

const fs    = require('fs');
const path  = require('path');
const readline = require('readline');

const ENV_PATH = path.join(__dirname, '.env');

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise(resolve => rl.question(q, resolve));

function readEnv() {
    if (!fs.existsSync(ENV_PATH)) return {};
    return Object.fromEntries(
        fs.readFileSync(ENV_PATH, 'utf8')
            .split('\n')
            .filter(l => l.includes('='))
            .map(l => { const [k, ...v] = l.split('='); return [k.trim(), v.join('=').trim()]; })
    );
}

function writeEnv(vars) {
    const content = Object.entries(vars).map(([k, v]) => `${k}=${v}`).join('\n') + '\n';
    fs.writeFileSync(ENV_PATH, content, 'utf8');
}

async function main() {
    console.log('\n╔══════════════════════════════════════════════════╗');
    console.log('║   Kaustobh Portfolio — Email Setup Wizard        ║');
    console.log('╚══════════════════════════════════════════════════╝\n');

    console.log('To send booking emails you need a Gmail App Password.');
    console.log('This is a 16-character code that lets the server send');
    console.log('email on behalf of your Gmail account safely.\n');

    console.log('STEP 1 — Enable 2-Factor Authentication on your Google Account');
    console.log('         (skip if already enabled)\n');

    console.log('STEP 2 — Go to this URL in your browser:');
    console.log('         https://myaccount.google.com/apppasswords\n');

    console.log('STEP 3 — Click "Create", type a name like "Portfolio Server"');
    console.log('         and copy the 16-character password shown.\n');

    const appPass = await ask('Paste your 16-character App Password here: ');

    if (!appPass || appPass.replace(/\s/g,'').length < 16) {
        console.error('\n❌  That does not look like a valid App Password (should be 16 chars).');
        console.error('    Please try again.\n');
        rl.close();
        process.exit(1);
    }

    const env = readEnv();
    env.PORT           = env.PORT           || '5000';
    env.SMTP_HOST      = 'smtp.gmail.com';
    env.SMTP_PORT      = '465';
    env.SMTP_SECURE    = 'true';
    env.SMTP_USER      = env.SMTP_USER      || 'kaustobh1920@gmail.com';
    env.SMTP_PASS      = appPass.replace(/\s/g, ''); // strip spaces if user pasted spaced version
    env.RECEIVER_EMAIL = env.RECEIVER_EMAIL || 'kaustobh1920@gmail.com';

    writeEnv(env);

    console.log('\n✅  .env updated successfully!\n');
    console.log('Now restart the server:');
    console.log('    1. Stop the current server (Ctrl+C in its terminal)');
    console.log('    2. Run:  node server.js');
    console.log('    3. Then visit:  http://localhost:5000/api/test-email');
    console.log('       to confirm emails are working.\n');

    rl.close();
}

main().catch(err => {
    console.error('Setup error:', err.message);
    rl.close();
    process.exit(1);
});
