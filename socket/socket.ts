import http from "http";
import { Server } from "socket.io";
import app from "../app";
import registerHandlers from "./handlers";

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: true,
    }
});

io.on("connection", (socket) => {
    registerHandlers(io, socket);
});

export { server, io };