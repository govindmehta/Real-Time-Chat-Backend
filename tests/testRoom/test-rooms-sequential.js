const { spawn, execSync } = require('child_process');
const path = require('path');

const cwd = path.resolve(__dirname);
const tsx = path.join(cwd, 'node_modules', 'tsx', 'dist', 'cli.mjs');

// Start server
console.log("Starting server...");
const server = spawn('node', [tsx, './server.ts'], { cwd, stdio: 'pipe', shell: true });
server.stdout.on('data', d => console.log('[SERVER]', d.toString().trim()));
server.stderr.on('data', d => {
  const msg = d.toString().trim();
  if (msg && !msg.includes('injected env') && !msg.includes('DeprecationWarning')) {
    console.log('[SERVER]', msg);
  }
});

// Wait for server to start
setTimeout(() => {
  console.log("\n=== Running Alice ===");
  const alice = spawn('node', [tsx, './client_test/alice.ts'], { cwd, stdio: 'inherit', shell: true });

  alice.on('close', () => {
    console.log("\n=== Running Bob ===");
    const bob = spawn('node', [tsx, './client_test/bob.ts'], { cwd, stdio: 'inherit', shell: true });

    bob.on('close', () => {
      console.log("\n=== All done ===");
      server.kill();
      process.exit(0);
    });
  });
}, 2000);
