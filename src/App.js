import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import AllRoutes from "./views/routes/index";
import { AuthProvider, useAuth } from "./contexts/AccountContext";
import AuthWrapper from "./AuthWrapper";
import { BubbleChat } from "flowise-embed-react";
import { FullPageChat } from "flowise-embed-react";
import { socketService } from "./services/socketService";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { notificationSocketService } from "./services/notificationSocketService";

function SocketConnector() {
  const { account } = useAuth();
  useEffect(() => {
    if (account?.id) {
      socketService.connect(account.id);
      notificationSocketService.connect(account.id);
    }
    // Không disconnect ở đây, chỉ disconnect khi logou t hoặc app unmount nếu cần
    // return () => socketService.disconnect();
  }, [account?.id]);
  return null;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketConnector />
        <AuthWrapper>
          <AllRoutes />
          <BubbleChat
            chatflowid="8e8b3bca-8bf7-48dc-9fb0-8885713aa26a"
            apiHost="https://flowiseai-railway-production-eaba.up.railway.app"
          />
        </AuthWrapper>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
