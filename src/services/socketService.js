import { io } from "socket.io-client";

class SocketService {
  constructor() {
    this.socket = null;
    this.messageHandlers = new Map();
  }

  connect(userId) {
    if (this.socket) {
      this.socket.disconnect();
    }
    this.socket = io(`http://localhost:8000/chat`, {
      transports: ["websocket"],
      autoConnect: true,
      withCredentials: true,
    });

    this.socket.on("connect", () => {
      console.log("Socket connected");
      console.log(userId);
      this.socket.emit("join", userId);
    });

    this.socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    this.socket.on("newMessage", (message) => {
      const chatboxId = String(message.chatbox?.id);
      const handlers = this.messageHandlers.get(chatboxId) || [];
      handlers.forEach((handler) => handler(message));
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  addMessageHandler(chatboxId, handler) {
    const id = String(chatboxId);
    if (!this.messageHandlers.has(id)) {
      this.messageHandlers.set(id, []);
    }
    this.messageHandlers.get(id).push(handler);
  }

  removeMessageHandler(chatboxId, handler) {
    const id = String(chatboxId);
    if (this.messageHandlers.has(id)) {
      const handlers = this.messageHandlers.get(id);
      const index = handlers.indexOf(handler);
      if (index !== -1) {
        handlers.splice(index, 1);
      }
    }
  }
}

export const socketService = new SocketService();
