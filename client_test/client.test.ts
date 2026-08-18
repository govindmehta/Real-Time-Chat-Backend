import { io } from "socket.io-client";

console.log("Starting client...");

const socket = io("http://localhost:5000");

socket.on("connect", () => {
    console.log("Connected:", socket.id);
});

socket.on("connect_error", (error) => {
    console.log("Connection error:", error.message);
});