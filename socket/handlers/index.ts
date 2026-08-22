import { Server, Socket } from "socket.io";
import roomHandler from "./roomHandler";
import messageHandler from "./messageHandler";
import roomService from "../../services/roomService";

export default function registerHandlers(io: Server, socket: Socket) {
  console.log(`New client connected: ${socket.id}`);

  // Register all handlers
  roomHandler(io, socket);
  messageHandler(io, socket);

  // Disconnect - clean up user from all rooms
  socket.on("disconnect", () => {
    const leftRooms = roomService.removeUserFromAllRooms(socket.id);

    leftRooms.forEach((roomId) => {
      const room = roomService.getRoom(roomId);
      io.to(roomId).emit("room:user-left", {
        roomId,
        users: room ? Array.from(room.users.values()) : [],
      });
    });

    console.log(`Client disconnected: ${socket.id}`);
  });
}
