const { spawn } = require('child_process');
const path = require('path');

const cwd = path.resolve(__dirname);

function run(name, cmd, args) {
  return new Promise((resolve) => {
    const p = spawn(cmd, args, { cwd, stdio: 'pipe', shell: true });
    p.stdout.on('data', d => console.log(`[${name}] ${d.toString().trim()}`));
    p.stderr.on('data', d => console.log(`[${name}] ${d.toString().trim()}`));
    p.on('close', () => resolve());
    return p;
  });
}

async function main() {
  console.log("=== Starting Server ===\n");
  const server = spawn('node', ['node_modules/tsx/dist/cli.mjs', './server.ts'], { cwd, stdio: 'pipe', shell: true });
  server.stdout.on('data', d => console.log(`[SERVER] ${d.toString().trim()}`));
  server.stderr.on('data', d => console.log(`[SERVER] ${d.toString().trim()}`));

  await new Promise(r => setTimeout(r, 3000));

  console.log("\n=== Starting Client 2 (Receiver) ===\n");
  const client2 = spawn('node', ['node_modules/tsx/dist/cli.mjs', './client_test/client2.test.ts'], { cwd, stdio: 'pipe', shell: true });
  client2.stdout.on('data', d => console.log(`[CLIENT2] ${d.toString().trim()}`));
  client2.stderr.on('data', d => console.log(`[CLIENT2] ${d.toString().trim()}`));

  await new Promise(r => setTimeout(r, 2000));

  console.log("\n=== Starting Client 1 (Sender) ===\n");
  const client1 = spawn('node', ['node_modules/tsx/dist/cli.mjs', './client_test/client1.test.ts'], { cwd, stdio: 'pipe', shell: true });
  client1.stdout.on('data', d => console.log(`[CLIENT1] ${d.toString().trim()}`));
  client1.stderr.on('data', d => console.log(`[CLIENT1] ${d.toString().trim()}`));

  // Wait for all messages to complete
  await new Promise(r => setTimeout(r, 15000));

  console.log("\n=== Test Complete ===");
  server.kill();
  client1.kill();
  client2.kill();
  process.exit(0);
}

main();
