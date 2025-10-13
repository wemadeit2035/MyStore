import React from "react";
import { createRoot } from "react-dom/client";
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

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <GlobalErrorHandler>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <GoogleOAuthProvider
          clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ""}
        >
          <ShopContextProvider>
            <App />
          </ShopContextProvider>
        </GoogleOAuthProvider>
      </BrowserRouter>
    </GlobalErrorHandler>
  </React.StrictMode>
);
