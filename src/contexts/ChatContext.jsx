import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { socketService } from "../services/socketService";
import chatAPI from "../api/chat";

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState({});
  const [currentChatbox, setCurrentChatbox] = useState(null);

  // Load chat history when chatbox changes
  const loadChatHistory = async (chatboxId) => {
    if (!chatboxId) return;
    try {
      const response = await chatAPI.getChatHistory(chatboxId);
      console.log("Loaded chat history:", response.data);
      setMessages((prev) => ({
        ...prev,
        [chatboxId]: response.data,
      }));
    } catch (error) {
      console.error("Error loading chat history:", error);
    }
  };

  // Stable handler reference for socket
  const handleNewMessage = useCallback(
    (message) => {
      console.log(
        "[CONTEXT] Handler called for chatbox:",
        message.chatbox?.id,
        message
      );
      const chatboxId = String(message.chatbox?.id);
      if (!chatboxId) {
        console.error("[CONTEXT] No chatbox ID in message:", message);
        return;
      }
      if (!currentChatbox?.id || chatboxId !== String(currentChatbox.id)) {
        console.log(
          "[CONTEXT] Message is for different chatbox, skipping",
          chatboxId,
          currentChatbox?.id
        );
        return;
      }
      setMessages((prevMessages) => {
        const currentMessages = prevMessages[chatboxId] || [];
        if (currentMessages.some((m) => m.id === message.id)) {
          console.log("[CONTEXT] Message already exists, skipping");
          return prevMessages;
        }
        const updatedMessages = {
          ...prevMessages,
          [chatboxId]: [...currentMessages, message],
        };
        console.log("[CONTEXT] Updated messages:", updatedMessages);
        return updatedMessages;
      });
    },
    [currentChatbox?.id]
  );

  // Register handler for current chatbox
  useEffect(() => {
    if (!currentChatbox?.id) return;
    const id = String(currentChatbox.id);
    console.log("[CONTEXT] Register handler for chatboxId:", id);
    socketService.addMessageHandler(id, handleNewMessage);
    return () => {
      console.log("[CONTEXT] Remove handler for chatboxId:", id);
      socketService.removeMessageHandler(id, handleNewMessage);
    };
  }, [currentChatbox?.id, handleNewMessage]);

  // Change current chatbox and load its history
  const changeChatbox = async (chatbox) => {
    console.log("[CONTEXT] Changing chatbox to:", chatbox);
    setCurrentChatbox(chatbox);
    if (chatbox?.id) {
      await loadChatHistory(chatbox.id);
    }
  };

  // Send a new message
  const sendMessage = async (chatboxId, content) => {
    if (!content.trim()) return;
    try {
      await chatAPI.sendMessage(chatboxId, content);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Get messages for a specific chatbox
  const getMessages = (chatboxId) => {
    if (!chatboxId) return [];
    const chatMessages = messages[chatboxId] || [];
    // console.log('Getting messages for chatbox', chatboxId, ':', chatMessages);
    return chatMessages;
  };

  const value = {
    messages,
    currentChatbox,
    changeChatbox,
    sendMessage,
    getMessages,
    loadChatHistory,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export default ChatContext;
