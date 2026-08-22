import { io } from "socket.io-client";
import { PORT } from "../config/env.config";

console.log("=== Client 2 (Receiver) ===\n");

const socket = io(`http://localhost:${PORT}`);

// Listen for incoming messages
socket.on("personal", (data) => {
    console.log(`[RECEIVED personal] from ${data.from}: ${data.message}`);
});

socket.on("broadcast", (data) => {
    console.log(`[RECEIVED broadcast] from ${data.from}: ${data.message}`);
});

socket.on("global", (data) => {
    console.log(`[RECEIVED global] from ${data.from}: ${data.message}`);
});

socket.on("connect", () => {
    console.log("Connected:", socket.id);
    console.log("\n--- Waiting for messages from Client 1... (Ctrl+C to exit) ---\n");
});

socket.on("connect_error", (error) => {
    console.log("Connection error:", error.message);
});
