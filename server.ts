import { PORT } from "./config/env.config";
import { server } from "./socket/socket";

const startServer = async () => {
    server.listen(PORT, () => {
        console.log(`Socket server is running on port ${PORT}`);
    });
};

startServer();