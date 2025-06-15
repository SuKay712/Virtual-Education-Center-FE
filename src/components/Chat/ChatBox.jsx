import React, { useState, useEffect, useRef } from "react";
import { Avatar, Input, Button, Typography } from "antd";
import { useAuth } from "../../contexts/AccountContext";
import chatAPI from "../../api/chat";
import { getAvatarUrl } from "../../utils/avatarUtils";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import { socketService } from "../../services/socketService";
import "./ChatBox.scss";

const { Text } = Typography;
dayjs.extend(isSameOrAfter);

const ChatBox = ({ chatbox }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const { account } = useAuth();

  useEffect(() => {
    if (!chatbox || !chatbox.id) return;
    const loadMessages = async () => {
      const response = await chatAPI.getChatHistory(chatbox.id);
      setMessages(response.data);
    };
    loadMessages();
  }, [chatbox]);

  useEffect(() => {
    if (!chatbox || !chatbox.id) return;
    const handleNewMessage = (message) => {
      const msgChatboxId = String(message.chatbox?.id || message.chatboxId);
      if (chatbox && msgChatboxId === String(chatbox.id)) {
        setMessages((prevMessages) => {
          if (prevMessages.some((m) => m.id === message.id))
            return prevMessages;
          return [...prevMessages, message];
        });
      }
    };
    socketService.addMessageHandler(chatbox.id, handleNewMessage);
    return () => {
      socketService.removeMessageHandler(chatbox.id, handleNewMessage);
    };
  }, [chatbox]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    await chatAPI.sendMessage(chatbox.id, newMessage);
    setNewMessage("");
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
        avatar: "",
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

  return (
    <div className="chatbox-container">
      <div className="message-list">
        {(() => {
          let lastDate = null;
          return messages.map((message) => {
            const isSent = String(message.sender?.id) === String(account.id);
            const dateObj = dayjs(message.created_at, "HH:mm DD/MM/YYYY", true);
            const validDate = dateObj.isValid()
              ? dateObj
              : dayjs(message.created_at);
            const msgDate = validDate.format("DD/MM/YYYY");
            const showDateDivider = msgDate !== lastDate;
            lastDate = msgDate;
            return (
              <React.Fragment key={message.id}>
                {showDateDivider && (
                  <div className="date-divider">
                    <span>{msgDate}</span>
                  </div>
                )}
                <div className={`message-item ${isSent ? "sent" : "received"}`}>
                  <div
                    className={`sender-name ${isSent ? "sent" : "received"}`}
                  >
                    {message.sender?.name}
                  </div>
                  <div
                    className={`message-row ${isSent ? "sent" : "received"}`}
                  >
                    {!isSent && (
                      <Avatar
                        src={getAvatarUrl(message.sender?.avatar)}
                        className="message-avatar"
                      />
                    )}
                    <div className="message-bubble-group">
                      {isSent && (
                        <span className="message-time">
                          {validDate.format("HH:mm")}
                        </span>
                      )}
                      <div
                        className={`message-content ${isSent ? "sent" : "received"}`}
                      >
                        <Text>{message.content}</Text>
                      </div>
                      {!isSent && (
                        <span className="message-time">
                          {validDate.format("HH:mm")}
                        </span>
                      )}
                    </div>
                    {isSent && (
                      <Avatar
                        src={getAvatarUrl(message.sender?.avatar)}
                        className="message-avatar"
                      />
                    )}
                  </div>
                </div>
              </React.Fragment>
            );
          });
        })()}
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
