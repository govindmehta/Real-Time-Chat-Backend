import { io, Socket } from "socket.io-client";
import { PORT } from "../config/env.config";

const room = process.argv[2] || "general";
const username = process.argv[3] || `User-${Math.random().toString(36).slice(2, 6)}`;

console.log(`=== Room Test Client ===`);
console.log(`Username: ${username}`);
console.log(`Room: ${room}\n`);

const socket: Socket = io(`http://localhost:${PORT}`);

// Listen for events
socket.on("connect", () => {
  console.log("Connected:", socket.id);

  // Join the room
  socket.emit("room:join", { roomId: room, username });
});

socket.on("room:history", (data) => {
  console.log(`\n--- Message History (${data.messages.length} messages) ---`);
  data.messages.forEach((msg: any) => {
    console.log(`  [${msg.senderName}]: ${msg.content}`);
  });
  console.log("--- End History ---\n");
});

socket.on("room:user-joined", (data) => {
  console.log(`[${data.username}] joined the room`);
  console.log(`Users in room: ${data.users.join(", ")}`);
});

socket.on("room:user-left", (data) => {
  console.log(`[${data.username || "Someone"}] left the room`);
  console.log(`Users in room: ${data.users.join(", ")}`);
});

socket.on("message:new", (msg) => {
  console.log(`[${msg.senderName}]: ${msg.content}`);
});

socket.on("message:error", (err) => {
  console.log("Error:", err.error);
});

socket.on("connect_error", (error) => {
  console.log("Connection error:", error.message);
});

// Listen for user input
process.stdin.setEncoding("utf-8");
process.stdin.on("data", (data) => {
  const message = data.trim();
  if (message) {
    socket.emit("message:send", { roomId: room, content: message });
  }
});

console.log("Type a message and press Enter to send (Ctrl+C to exit):");
