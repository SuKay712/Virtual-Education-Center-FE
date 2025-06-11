import React, { useState, useEffect } from "react";
import { List, Avatar, Typography } from "antd";
import styled from "styled-components";
import { useAuth } from "../../contexts/AccountContext";
import chatAPI from "../../api/chat";
import "./ChatList.scss";

const { Text } = Typography;

const ChatListContainer = styled.div`
  width: 300px;
  height: 100%;
  border-right: 1px solid #e8e8e8;
  background: #fff;
`;

const ChatItem = styled(List.Item)`
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    background-color: #f5f5f5;
  }
  &.selected {
    background-color: #e6f7ff;
  }
`;

const ChatList = ({ onSelectChat, selectedChatId }) => {
  const [chatboxes, setChatboxes] = useState([]);
  const { account } = useAuth();

  useEffect(() => {
    loadChatboxes();
    const interval = setInterval(loadChatboxes, 5000);
    return () => clearInterval(interval);
  }, []);

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
      return ""; // Return default admin avatar if needed
    }
  };

  return (
    <ChatListContainer>
      <List
        dataSource={chatboxes}
        renderItem={(chatbox) => (
          <ChatItem
            key={chatbox.id}
            onClick={() => onSelectChat(chatbox)}
            className={selectedChatId === chatbox.id ? "selected" : ""}
          >
            <List.Item.Meta
              avatar={<Avatar src={getChatAvatar(chatbox)} />}
              title={getChatTitle(chatbox)}
              description={
                <Text ellipsis style={{ maxWidth: 200 }}>
                  {chatbox.lastMessage?.content || "No messages yet"}
                </Text>
              }
            />
          </ChatItem>
        )}
      />
    </ChatListContainer>
  );
};

export default ChatList;
