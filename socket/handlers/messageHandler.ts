import { Server, Socket } from "socket.io";
import roomService from "../../services/roomService";
import messageService from "../../services/messageService";

export default function messageHandler(io: Server, socket: Socket) {
  // Send a message to a room
  socket.on("message:send", (data: { roomId: string; content: string }) => {
    const { roomId, content } = data;

    const room = roomService.getRoom(roomId);
    if (!room || !room.users.has(socket.id)) {
      socket.emit("message:error", {
        error: "You are not in this room",
      });
      return;
    }

    const username = roomService.getUsername(roomId, socket.id) || "Anonymous";
    const message = messageService.addMessage(room, socket.id, username, content);

    // Broadcast message to everyone in the room
    io.to(roomId).emit("message:new", message);

    console.log(`[${roomId}] ${username}: ${content}`);
  });

  // Get message history for a room
  socket.on("message:history", (data: { roomId: string }) => {
    const messages = messageService.getRoomMessages(data.roomId);
    socket.emit("message:history", {
      roomId: data.roomId,
      messages,
    });
  });
}
