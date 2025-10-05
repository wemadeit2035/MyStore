import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import ShopContextProvider from "./context/ShopContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

// Error boundary for the entire app
const GlobalErrorHandler = ({ children }) => {
  React.useEffect(() => {
    // Global error handler for uncaught errors
    const handleGlobalError = (event) => {
      // Error handling without console logging
      if (import.meta.env.PROD) {
        // Send to error monitoring service (e.g., Sentry, LogRocket)
        // errorReporting.captureException(event.error);
      }
    };

    // Global promise rejection handler
    const handleUnhandledRejection = (event) => {
      event.preventDefault();
    };

    window.addEventListener("error", handleGlobalError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("error", handleGlobalError);
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection
      );
    };
  }, []);

  return children;
};

// Strict Mode wrapper (development only)
const DevelopmentWrapper = ({ children }) => {
  if (import.meta.env.DEV) {
    return <React.StrictMode>{children}</React.StrictMode>;
  }
  return children;
};

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <DevelopmentWrapper>
    <GlobalErrorHandler>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <GoogleOAuthProvider
          clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
          onScriptLoadError={() => {}}
          onScriptLoadSuccess={() => {}}
        >
          <ShopContextProvider>
            <App />
          </ShopContextProvider>
        </GoogleOAuthProvider>
      </BrowserRouter>
    </GlobalErrorHandler>
  </DevelopmentWrapper>
);
