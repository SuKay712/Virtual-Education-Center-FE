import React from "react";
import { BrowserRouter } from "react-router-dom";
import AllRoutes from "./views/routes/index";
import { AuthProvider } from "./contexts/AccountContext";
import AuthWrapper from "./AuthWrapper";
import { BubbleChat } from "flowise-embed-react";
import { FullPageChat } from "flowise-embed-react";

import "@fortawesome/fontawesome-free/css/all.min.css";
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
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
