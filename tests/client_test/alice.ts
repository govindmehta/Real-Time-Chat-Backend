import { io } from "socket.io-client";

console.log("Alice connecting...");

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
  console.log("[Alice] Sending message...");
  socket.emit("message:send", { roomId: "general", content: "Hello from Alice!" });
}, 2000);

setTimeout(() => process.exit(0), 8000);
