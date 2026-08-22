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

  console.log("\n=== Alice joins 'general' room ===\n");
  const aliceProc = spawn('node', ['node_modules/tsx/dist/cli.mjs', '-e', `
    import { io } from "socket.io-client";

    const socket = io("http://localhost:3000");

    socket.on("connect", () => {
      console.log("Alice connected:", socket.id);
      socket.emit("room:join", { roomId: "general", username: "Alice" });
    });

    socket.on("room:history", (data) => {
      console.log("[Alice] History:", data.messages.length, "messages");
    });

    socket.on("room:user-joined", (data) => {
      console.log("[Alice] User joined:", data.username, "| Users:", data.users.join(", "));
    });

    socket.on("message:new", (msg) => {
      console.log("[Alice] Received:", msg.senderName + ":", msg.content);
    });

    socket.on("connect_error", (err) => console.log("[Alice] Error:", err.message));

    setTimeout(() => {
      socket.emit("message:send", { roomId: "general", content: "Hello from Alice!" });
    }, 2000);
  `], { cwd, stdio: 'pipe', shell: true });
  aliceProc.stdout.on('data', d => console.log(`[ALICE] ${d.toString().trim()}`));
  aliceProc.stderr.on('data', d => {
    const msg = d.toString().trim();
    if (!msg.includes('DeprecationWarning') && msg) console.log(`[ALICE] ${msg}`);
  });

  await new Promise(r => setTimeout(r, 2000));

  console.log("\n=== Bob joins 'general' room ===\n");
  const bobProc = spawn('node', ['node_modules/tsx/dist/cli.mjs', '-e', `
    import { io } from "socket.io-client";

    const socket = io("http://localhost:3000");

    socket.on("connect", () => {
      console.log("Bob connected:", socket.id);
      socket.emit("room:join", { roomId: "general", username: "Bob" });
    });

    socket.on("room:history", (data) => {
      console.log("[Bob] History:", data.messages.length, "messages");
      data.messages.forEach(m => console.log("[Bob]   " + m.senderName + ":", m.content));
    });

    socket.on("room:user-joined", (data) => {
      console.log("[Bob] User joined:", data.username, "| Users:", data.users.join(", "));
    });

    socket.on("message:new", (msg) => {
      console.log("[Bob] Received:", msg.senderName + ":", msg.content);
    });

    socket.on("connect_error", (err) => console.log("[Bob] Error:", err.message));

    setTimeout(() => {
      socket.emit("message:send", { roomId: "general", content: "Hey Alice! Bob here!" });
    }, 3000);
  `], { cwd, stdio: 'pipe', shell: true });
  bobProc.stdout.on('data', d => console.log(`[BOB] ${d.toString().trim()}`));
  bobProc.stderr.on('data', d => {
    const msg = d.toString().trim();
    if (!msg.includes('DeprecationWarning') && msg) console.log(`[BOB] ${msg}`);
  });

  await new Promise(r => setTimeout(r, 7000));

  console.log("\n=== Test Complete ===");
  server.kill();
  aliceProc.kill();
  bobProc.kill();
  process.exit(0);
}

main();
