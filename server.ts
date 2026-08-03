import app from "./app";
import { PORT } from "./config/env.config";
import { server } from "./socket/socket";


const startServer = async () => {
    //server already have app and socket.io instance
    server.listen(PORT, () => {
        console.log(`Socket server is running on port ${PORT}`);
    })
};

startServer();