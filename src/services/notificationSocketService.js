import { io } from "socket.io-client";

class NotificationSocketService {
  constructor() {
    this.socket = null;
    this.handlers = [];
  }

  connect(userId) {
    if (this.socket) {
      this.socket.disconnect();
    }
    this.socket = io("http://localhost:8000/notification", {
      transports: ["websocket"],
      autoConnect: true,
      withCredentials: true,
    });

    this.socket.on("connect", () => {
      console.log("Notification socket connected");
      // Nếu backend cần join room/userId thì emit ở đây
      this.socket.emit("join", userId);
    });

    this.socket.on("disconnect", () => {
      console.log("Notification socket disconnected");
    });

    this.socket.on("notification", (notification) => {
      console.log("notification", notification);
      this.handlers.forEach((handler) => handler(notification));
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  addHandler(handler) {
    this.handlers.push(handler);
  }

  removeHandler(handler) {
    this.handlers = this.handlers.filter((h) => h !== handler);
  }
}

export const notificationSocketService = new NotificationSocketService();
