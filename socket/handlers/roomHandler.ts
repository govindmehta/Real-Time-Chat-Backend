import { Server, Socket } from "socket.io";
import roomService from "../../services/roomService";

export default function roomHandler(io: Server, socket: Socket) {
  // Join a room
  socket.on("room:join", (data: { roomId: string; username: string }) => {
    const { roomId, username } = data;
    const room = roomService.joinRoom(roomId, socket.id, username);

    // Join the Socket.IO room
    socket.join(roomId);

    // Notify everyone in the room
    io.to(roomId).emit("room:user-joined", {
      roomId,
      username,
      users: Array.from(room.users.values()),
    });

    // Send message history to the joining user
    socket.emit("room:history", {
      roomId,
      messages: room.messages.slice(-50),
    });

    console.log(`[${username}] joined room [${roomId}]`);
  });

  // Leave a room
  socket.on("room:leave", (data: { roomId: string }) => {
    const { roomId } = data;
    const username = roomService.getUsername(roomId, socket.id);
    const room = roomService.leaveRoom(roomId, socket.id);

    socket.leave(roomId);

    if (room && username) {
      io.to(roomId).emit("room:user-left", {
        roomId,
        username,
        users: Array.from(room.users.values()),
      });
      console.log(`[${username}] left room [${roomId}]`);
    }
  });

  // Get list of available rooms
  socket.on("room:list", () => {
    const rooms = roomService.getRooms();
    socket.emit("room:list", rooms);
  });

  // Get users in a room
  socket.on("room:users", (data: { roomId: string }) => {
    const room = roomService.getRoom(data.roomId);
    if (room) {
      socket.emit("room:users", {
        roomId: data.roomId,
        users: Array.from(room.users.values()),
      });
    }
  });
}
