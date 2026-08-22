import { Room } from "../types";

const rooms = new Map<string, Room>();

const roomService = {
  createRoom(id: string, name: string): Room {
    if (rooms.has(id)) {
      return rooms.get(id)!;
    }
    const room: Room = {
      id,
      name,
      users: new Map(),
      messages: [],
      createdAt: Date.now(),
    };
    rooms.set(id, room);
    return room;
  },

  getRoom(id: string): Room | undefined {
    return rooms.get(id);
  },

  getRooms(): { id: string; name: string; userCount: number }[] {
    return Array.from(rooms.values()).map((r) => ({
      id: r.id,
      name: r.name,
      userCount: r.users.size,
    }));
  },

  joinRoom(roomId: string, socketId: string, username: string): Room {
    let room = rooms.get(roomId);
    if (!room) {
      room = this.createRoom(roomId, roomId);
    }
    room.users.set(socketId, username);
    return room;
  },

  leaveRoom(roomId: string, socketId: string): Room | undefined {
    const room = rooms.get(roomId);
    if (!room) return undefined;
    room.users.delete(socketId);
    // Clean up empty rooms
    if (room.users.size === 0) {
      rooms.delete(roomId);
    }
    return room;
  },

  getUserRooms(socketId: string): Room[] {
    return Array.from(rooms.values()).filter((r) => r.users.has(socketId));
  },

  getUsername(roomId: string, socketId: string): string | undefined {
    return rooms.get(roomId)?.users.get(socketId);
  },

  removeUserFromAllRooms(socketId: string): string[] {
    const leftRooms: string[] = [];
    for (const room of rooms.values()) {
      if (room.users.has(socketId)) {
        room.users.delete(socketId);
        leftRooms.push(room.id);
        if (room.users.size === 0) {
          rooms.delete(room.id);
        }
      }
    }
    return leftRooms;
  },
};

export default roomService;
