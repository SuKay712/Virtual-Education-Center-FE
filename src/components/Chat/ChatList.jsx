import React, { useState, useEffect } from "react";
import { List, Avatar, Typography } from "antd";
import styled from "styled-components";
import { useAuth } from "../../contexts/AccountContext";
import chatAPI from "../../api/chat";
import { socketService } from "../../services/socketService";
import "./ChatList.scss";
import dayjs from "dayjs";

const getLastMessage = (chatbox) => {
  if (!chatbox || !chatbox.chats || chatbox.chats.length === 0) return null;
  return chatbox.chats.reduce(
    (latest, msg) =>
      !latest ||
      dayjs(msg.created_at, "HH:mm DD/MM/YYYY").isAfter(
        dayjs(latest.created_at, "HH:mm DD/MM/YYYY")
      )
        ? msg
        : latest,
    null
  );
};

const ChatList = ({ onSelectChat, selectedChatId }) => {
  const [chatboxes, setChatboxes] = useState([]);
  const { account } = useAuth();

  useEffect(() => {
    loadChatboxes();
    socketService.connect(account.id);
    const handleNewMessage = (message) => {
      setChatboxes((prevChatboxes) => {
        const updatedChatboxes = prevChatboxes.map((chatbox) => {
          if (chatbox.id === message.chatboxId) {
            return {
              ...chatbox,
              lastMessage: message,
            };
          }
          return chatbox;
        });
        return updatedChatboxes;
      });
    };
    socketService.addMessageHandler("chatList", handleNewMessage);
    return () => {
      socketService.removeMessageHandler("chatList", handleNewMessage);
      socketService.disconnect();
    };
  }, [account.id]);

  const loadChatboxes = async () => {
    try {
      let response;
      if (account.role === "Admin") {
        response = await chatAPI.getAdminChatboxes();
      } else {
        response = await chatAPI.getStudentChatboxes();
      }
      setChatboxes(response.data);
    } catch (error) {
      console.error("Error loading chatboxes:", error);
    }
  };

  const getChatTitle = (chatbox) => {
    if (!chatbox) return "";
    if (account.role === "Admin") {
      return chatbox.student?.name || "Unknown Student";
    } else {
      return "Admin Group";
    }
  };

  const getChatAvatar = (chatbox) => {
    if (!chatbox) return "";
    if (account.role === "Admin") {
      return chatbox.student?.avatar || "";
    } else {
      return "";
    }
  };

  const sortedChatboxes = [...chatboxes].sort((a, b) => {
    const lastA = getLastMessage(a);
    const lastB = getLastMessage(b);
    if (!lastA && !lastB) return 0;
    if (!lastA) return 1;
    if (!lastB) return -1;
    return (
      dayjs(lastB.created_at, "HH:mm DD/MM/YYYY").valueOf() -
      dayjs(lastA.created_at, "HH:mm DD/MM/YYYY").valueOf()
    );
  });

  return (
    <div className="chat-list">
      <div className="chat-items">
        {sortedChatboxes.map((chatbox) => {
          const lastMsg = getLastMessage(chatbox);
          const isMine =
            lastMsg && String(lastMsg.sender?.id) === String(account.id);
          return (
            <div
              key={chatbox.id}
              className={
                "chat-item" +
                (selectedChatId === chatbox.id ? " selected" : "") +
                (isMine ? " mine-item" : "")
              }
              onClick={() => onSelectChat(chatbox)}
            >
              <Avatar
                src={getChatAvatar(chatbox)}
                size={52}
                className="chat-avatar"
              />
              <div className="chat-content">
                <div className="chat-title-row">
                  <span className="chat-title">{getChatTitle(chatbox)}</span>
                  {lastMsg && (
                    <span className="chat-time">
                      {dayjs(lastMsg.created_at, "HH:mm DD/MM/YYYY").format(
                        "HH:mm"
                      )}
                    </span>
                  )}
                </div>
                <span
                  className={
                    "chat-last-message" +
                    (isMine ? " mine" : "") +
                    (!lastMsg ? " empty" : "")
                  }
                >
                  {lastMsg
                    ? `${isMine ? "Bạn: " : ""}${lastMsg.content}`
                    : "Chưa có tin nhắn"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ChatList;
