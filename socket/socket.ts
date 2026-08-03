import http, { Server } from "http";
import app from "../app";

const server = http.createServer(app);

const io = new Server(server);

export { server, io };