import React from "react";
import { BrowserRouter } from "react-router-dom";
import AllRoutes from "./views/routes/index";
import { AuthProvider } from "./contexts/AccountContext";
import AuthWrapper from "./AuthWrapper";
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AuthWrapper>
          <AllRoutes />
        </AuthWrapper>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
