import { io } from "socket.io-client";
import { PORT } from "../config/env.config";

console.log("Starting client...");

const socket = io(`http://localhost:${PORT}`);

socket.on("connect", () => {
    console.log("Connected:", socket.id);
});

socket.on("connect_error", (error) => {
    console.log("Connection error:", error.message);
});