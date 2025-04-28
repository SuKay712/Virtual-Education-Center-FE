import React from "react";
import { BrowserRouter } from "react-router-dom";
import AllRoutes from "./views/routes/index";
import { AuthProvider } from "./contexts/AccountContext";
import AuthWrapper from "./AuthWrapper";
import { BubbleChat } from "flowise-embed-react";
import "@fortawesome/fontawesome-free/css/all.min.css";
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AuthWrapper>
          <AllRoutes />
          <BubbleChat
            chatflowid={process.env.CHAT_FLOWISE_ID}
            apiHost={process.env.BOT_CHAT_API_HOST}
          />
        </AuthWrapper>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
