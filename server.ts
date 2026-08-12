import { Socket } from "socket.io";
import app from "./app";
import { PORT } from "./config/env.config";
import { io, server } from "./socket/socket";


const startServer = async () => {
    //server already have app and socket.io instance
    server.listen(PORT, () => {
        console.log(`Socket server is running on port ${PORT}`);
    })
    io.on("connection", (socket: Socket) => {

        console.log(`New client connected: ${socket.id}`);

        socket.on("disconnect", ()=>{
            console.log(`Client disconnected: ${socket.id}`);
        })
    })
};

startServer();