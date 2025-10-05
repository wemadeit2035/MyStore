import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import ShopContextProvider from "./context/ShopContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import axios from "axios";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = "http://localhost:4000/api";

// Error boundary for the entire app
const GlobalErrorHandler = ({ children }) => {
  React.useEffect(() => {
    // Global error handler for uncaught errors
    const handleGlobalError = (event) => {
      console.error("Global error caught:", event.error);
      // In production, you would send this to your error reporting service
      if (import.meta.env.PROD) {
        // Send to error monitoring service (e.g., Sentry, LogRocket)
        // errorReporting.captureException(event.error);
      }
    };

    // Global promise rejection handler
    const handleUnhandledRejection = (event) => {
      console.error("Unhandled promise rejection:", event.reason);
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
          onScriptLoadError={() =>
            console.error("Google OAuth script failed to load")
          }
          onScriptLoadSuccess={() =>
            console.log("Google OAuth script loaded successfully")
          }
        >
          <ShopContextProvider>
            <App />
          </ShopContextProvider>
        </GoogleOAuthProvider>
      </BrowserRouter>
    </GlobalErrorHandler>
  </DevelopmentWrapper>
);

// Development-only warnings
if (import.meta.env.DEV) {
  console.log("🚀 Development mode active");

  // Warn about missing environment variables
  const requiredEnvVars = ["VITE_GOOGLE_CLIENT_ID", "VITE_API_URL"];
  const missingVars = requiredEnvVars.filter(
    (varName) => !import.meta.env[varName]
  );

  if (missingVars.length > 0) {
    console.warn("⚠️ Missing environment variables:", missingVars);
  }
}
