const { spawn } = require('child_process');
const path = require('path');

const cwd = path.resolve(__dirname);
const tsx = path.join(cwd, 'node_modules', 'tsx', 'dist', 'cli.mjs');

console.log("Starting server...");
const server = spawn('node', [tsx, './server.ts'], { cwd, stdio: 'pipe', shell: true });
server.stdout.on('data', d => console.log('[SERVER]', d.toString().trim()));
server.stderr.on('data', d => {
  const msg = d.toString().trim();
  if (msg && !msg.includes('injected env') && !msg.includes('DeprecationWarning')) {
    console.log('[SERVER]', msg);
  }
});

setTimeout(() => {
  console.log("\n=== Alice and Bob joining concurrently ===\n");

  const alice = spawn('node', [tsx, './client_test/alice.ts'], { cwd, stdio: 'inherit', shell: true });
  const bob = spawn('node', [tsx, './client_test/bob.ts'], { cwd, stdio: 'inherit', shell: true });

  setTimeout(() => {
    console.log("\n=== Done ===\n");
    server.kill();
    alice.kill();
    bob.kill();
    process.exit(0);
  }, 10000);
}, 2000);
