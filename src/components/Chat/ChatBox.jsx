import React, { useState, useEffect, useRef } from "react";
import { Avatar, Input, Button, List, Typography } from "antd";
import { SendOutlined } from "@ant-design/icons";
import { useAuth } from "../../contexts/AccountContext";
import chatAPI from "../../api/chat";
import { getAvatarUrl } from "../../utils/avatarUtils";
import dayjs from "dayjs";
import "./ChatBox.scss";

const { Text } = Typography;

const ChatBox = ({ chatbox }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const { account } = useAuth();
  console.log("account:", account);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (chatbox) {
      loadMessages();
      const interval = setInterval(loadMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [chatbox]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadMessages = async () => {
    try {
      const response = await chatAPI.getChatHistory(chatbox.id);
      setMessages(response.data);
    } catch (error) {
      console.error("Error loading messages:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      await chatAPI.sendMessage(chatbox.id, newMessage);
      setNewMessage("");
      loadMessages();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getOtherUser = () => {
    if (!chatbox) return null;
    if (account.role === "Admin") {
      return chatbox.student;
    } else {
      return {
        id: chatbox.chatGroup?.id,
        name: "Admin Group",
        avatar: "", // Admin group avatar if needed
      };
    }
  };

  const otherUser = getOtherUser();

  const getMessageAvatar = (message) => {
    if (message.senderId === account.id) {
      return getAvatarUrl(account.avatar);
    } else {
      return getAvatarUrl(otherUser?.avatar);
    }
  };

  const messageList = messages;

  return (
    <div className="chatbox-container">
      <div className="message-list">
        {messageList.map((message, idx) => {
          const isSent = String(message.sender?.id) === String(account.id);
          console.log(
            "account.id:",
            account.id,
            "| message.sender.id:",
            message.sender?.id,
            "| isSent:",
            isSent
          );
          return (
            <div
              className={`message-item ${isSent ? "sent" : "received"}`}
              key={message.id || idx}
            >
              <div className={`sender-name ${isSent ? "sent" : "received"}`}>
                {message.sender?.name}
              </div>
              <div className={`message-row ${isSent ? "sent" : "received"}`}>
                {!isSent && (
                  <Avatar
                    src={getAvatarUrl(message.sender?.avatar)}
                    className="message-avatar"
                  />
                )}
                <div
                  className={`message-content ${isSent ? "sent" : "received"}`}
                >
                  <Text>{message.content}</Text>
                  <span className="message-time">
                    {dayjs(message.created_at).format("HH:mm DD/MM/YY")}
                  </span>
                </div>
                {isSent && (
                  <Avatar
                    src={getAvatarUrl(message.sender?.avatar)}
                    className="message-avatar"
                  />
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-container">
        <Input.TextArea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          autoSize={{ minRows: 1, maxRows: 4 }}
          style={{ marginBottom: 8 }}
        />
        <Button type="primary" onClick={handleSendMessage}>
          Send
        </Button>
      </div>
    </div>
  );
};

export default ChatBox;
