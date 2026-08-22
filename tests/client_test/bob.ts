import { io } from "socket.io-client";

console.log("Bob connecting...");

const socket = io("http://localhost:3000");

socket.on("connect", () => {
  console.log("Bob connected:", socket.id);
  socket.emit("room:join", { roomId: "general", username: "Bob" });
});

socket.on("room:history", (data) => {
  console.log("[Bob] History:", data.messages.length, "messages");
  data.messages.forEach((m: any) => console.log("[Bob]   " + m.senderName + ":", m.content));
});

socket.on("room:user-joined", (data) => {
  console.log("[Bob] User joined:", data.username, "| Users:", data.users.join(", "));
});

socket.on("message:new", (msg) => {
  console.log("[Bob] Received:", msg.senderName + ":", msg.content);
});

socket.on("connect_error", (err) => console.log("[Bob] Error:", err.message));

setTimeout(() => {
  console.log("[Bob] Sending message...");
  socket.emit("message:send", { roomId: "general", content: "Hey Alice! Bob here!" });
}, 3000);

setTimeout(() => process.exit(0), 8000);
