#!/usr/bin/env node
/**
 * Find a free port (3030, 3031, ...) and start Next.js dev server.
 * Prints the URL so you always know which port to use.
 */
const { spawn } = require('child_process');
const net = require('net');
const path = require('path');

function portInUse(port) {
  return new Promise((resolve) => {
    const s = net.createConnection(port, '127.0.0.1', () => {
      s.destroy();
      resolve(true);
    });
    s.on('error', () => resolve(false));
    s.setTimeout(300, () => { s.destroy(); resolve(false); });
  });
}

async function findPort(start) {
  for (let p = start; p < start + 20; p++) {
    if (!(await portInUse(p))) return p;
  }
  return start;
}

(async () => {
  const port = await findPort(3030);
  console.log('\n========================================');
  console.log('  Peoples Print – use this URL:');
  console.log('  http://localhost:' + port);
  console.log('========================================\n');
  const cwd = path.resolve(__dirname, '..');
  const child = spawn('npx', ['prisma', 'generate'], { stdio: 'inherit', env: process.env, cwd });
  await new Promise((resolve) => child.on('exit', resolve));
  const next = spawn('npx', ['next', 'dev', '-p', String(port)], {
    stdio: 'inherit',
    env: { ...process.env, PORT: String(port) },
    cwd,
  });
  next.on('exit', (code) => process.exit(code ?? 0));
})();
