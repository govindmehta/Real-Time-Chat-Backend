import { io } from "socket.io-client";
import { PORT } from "../../config/env.config";

console.log("=== Client 1 (Sender) ===\n");

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
    console.log("\n--- Sending messages in 2 seconds... ---\n");

    setTimeout(() => {
        // 1. personal - only this client will receive it
        console.log("Sending: personal -> 'Hello me!' (only I receive)");
        socket.emit("personal", "Hello me!");
    }, 2000);

    setTimeout(() => {
        // 2. broadcast - everyone EXCEPT this client will receive it
        console.log("Sending: broadcast -> 'Hello others!' (others receive)");
        socket.emit("broadcast", "Hello others!");
    }, 4000);

    setTimeout(() => {
        // 3. global - EVERYONE receives it including this client
        console.log("Sending: global -> 'Hello everyone!' (all receive)");
        socket.emit("global", "Hello everyone!");
    }, 6000);

    setTimeout(() => {
        console.log("\n--- Done. Waiting for messages... (Ctrl+C to exit) ---");
    }, 7000);
});

socket.on("connect_error", (error) => {
    console.log("Connection error:", error.message);
});
