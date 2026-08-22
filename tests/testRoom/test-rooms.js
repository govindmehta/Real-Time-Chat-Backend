const { spawn } = require('child_process');
const path = require('path');

const cwd = path.resolve(__dirname);

function createProc(name, script) {
  const p = spawn('node', ['node_modules/tsx/dist/cli.mjs', script], { cwd, stdio: 'pipe', shell: true });
  p.stdout.on('data', d => console.log(`[${name}] ${d.toString().trim()}`));
  p.stderr.on('data', d => {
    const msg = d.toString().trim();
    if (!msg.includes('DeprecationWarning')) console.log(`[${name}] ${msg}`);
  });
  return p;
}

async function main() {
  console.log("=== Starting Server ===\n");
  const server = createProc('SERVER', './server.ts');
  await new Promise(r => setTimeout(r, 3000));

  console.log("\n=== Starting Alice (joining room 'general') ===\n");
  const alice = createProc('ALICE', './client_test/room-test.ts');

  // Override process.argv for Alice
  alice.stdin.write = alice.stdin.write; // just to show it's interactive
  await new Promise(r => setTimeout(r, 2000));

  // Alice joins
  alice.stdin.write('general\n');
  alice.stdin.write('Alice\n');
  await new Promise(r => setTimeout(r, 1000));

  console.log("\n=== Starting Bob (joining room 'general') ===\n");
  const bob = createProc('BOB', './client_test/room-test.ts');
  await new Promise(r => setTimeout(r, 2000));

  bob.stdin.write('general\n');
  bob.stdin.write('Bob\n');
  await new Promise(r => setTimeout(r, 1000));

  // Alice sends a message
  console.log("\n=== Alice sends a message ===\n");
  alice.stdin.write('Hello everyone! I am Alice\n');
  await new Promise(r => setTimeout(r, 1000));

  // Bob sends a message
  console.log("\n=== Bob sends a message ===\n");
  bob.stdin.write('Hey Alice! Bob here!\n');
  await new Promise(r => setTimeout(r, 1000));

  console.log("\n=== Test Complete ===\n");

  await new Promise(r => setTimeout(r, 1000));
  server.kill();
  alice.kill();
  bob.kill();
  process.exit(0);
}

main();
