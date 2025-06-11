import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useAuth } from "../../../contexts/AccountContext";
import ChatList from "../../../components/Chat/ChatList";
import ChatBox from "../../../components/Chat/ChatBox";
import chatAPI from "../../../api/chat";

const ChatContainer = styled.div`
  display: flex;
  height: calc(100vh - 64px);
  background: #fff;
`;

const NoChatSelected = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  color: #999;
  font-size: 16px;
`;

const AdminChat = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const { account } = useAuth();

  useEffect(() => {
    loadInitialChat();
  }, []);

  const loadInitialChat = async () => {
    try {
      const response = await chatAPI.getOrCreateChatbox();
      setSelectedChat(response.data);
    } catch (error) {
      console.error("Error loading initial chat:", error);
    }
  };

  const handleSelectChat = (chatbox) => {
    setSelectedChat(chatbox);
  };

  return (
    <ChatContainer>
      <ChatList
        onSelectChat={handleSelectChat}
        selectedChatId={selectedChat?.id}
      />
      {selectedChat ? (
        <ChatBox chatbox={selectedChat} />
      ) : (
        <NoChatSelected>Select a chat to start messaging</NoChatSelected>
      )}
    </ChatContainer>
  );
};

export default AdminChat;
