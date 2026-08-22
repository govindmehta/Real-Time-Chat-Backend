const { spawn } = require('child_process');
const path = require('path');

const cwd = path.resolve(__dirname);
const tsx = path.join(cwd, 'node_modules', 'tsx', 'dist', 'cli.mjs');

function run(name, script) {
  return new Promise((resolve) => {
    const p = spawn('node', [tsx, script], { cwd, stdio: 'inherit', shell: true });
    p.on('close', () => resolve());
  });
}

function runTimeout(name, script, ms) {
  return new Promise((resolve) => {
    const p = spawn('node', [tsx, script], { cwd, stdio: 'inherit', shell: true });
    setTimeout(() => { p.kill(); resolve(); }, ms);
  });
}

async function main() {
  console.log("========== Starting Server ==========\n");
  const server = spawn('node', [tsx, './server.ts'], { cwd, stdio: 'inherit', shell: true });
  await new Promise(r => setTimeout(r, 3000));

  console.log("\n========== Alice Joins ==========\n");
  const alice = spawn('node', [tsx, './client_test/alice.ts'], { cwd, stdio: 'inherit', shell: true });
  await new Promise(r => setTimeout(r, 3000));

  console.log("\n========== Bob Joins ==========\n");
  const bob = spawn('node', [tsx, './client_test/bob.ts'], { cwd, stdio: 'inherit', shell: true });

  await new Promise(r => setTimeout(r, 8000));

  console.log("\n========== Test Complete ==========\n");
  server.kill();
  alice.kill();
  bob.kill();
  process.exit(0);
}

main();
