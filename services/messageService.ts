import { Message, Room } from "../types";
import roomService from "./roomService";

const messageService = {
  addMessage(room: Room, senderId: string, senderName: string, content: string): Message {
    const message: Message = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      roomId: room.id,
      senderId,
      senderName,
      content,
      timestamp: Date.now(),
    };
    room.messages.push(message);
    return message;
  },

  getRoomMessages(roomId: string, limit = 50): Message[] {
    const room = roomService.getRoom(roomId);
    if (!room) return [];
    return room.messages.slice(-limit);
  },
};

export default messageService;
