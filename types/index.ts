export interface Message {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: number;
}

export interface Room {
  id: string;
  name: string;
  users: Map<string, string>; // socketId -> username
  messages: Message[];
  createdAt: number;
}
