import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import ShopContextProvider from "./context/ShopContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import axios from "axios";
import VisualDebug from "./components/VisualDebug";

axios.defaults.withCredentials = true;
axios.defaults.baseURL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

// Detect problematic browsers for debugging
const isProblematicBrowser = () => {
  const ua = navigator.userAgent;
  return (ua.includes('Chrome') && !ua.includes('Firefox')) || ua.includes('SamsungBrowser');
};

// Error boundary for the entire app
const GlobalErrorHandler = ({ children }) => {
  React.useEffect(() => {
    // Global error handler for uncaught errors
    const handleGlobalError = (event) => {
      console.error('Global error caught:', event.error);
      if (import.meta.env.PROD) {
        // Send to error monitoring service
      }
    };

    // Global promise rejection handler
    const handleUnhandledRejection = (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      event.preventDefault();
    };

    window.addEventListener("error", handleGlobalError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("error", handleGlobalError);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
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

// Simple rendering with error handling
try {
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
              {/* Show debug header for Chrome/Samsung browsers */}
              {isProblematicBrowser() && <VisualDebug />}
              <App />
            </ShopContextProvider>
          </GoogleOAuthProvider>
        </BrowserRouter>
      </GlobalErrorHandler>
    </DevelopmentWrapper>
  );
  console.log("✅ React app rendered successfully");
} catch (error) {
  console.error("❌ React app failed to render:", error);
  
  // Fallback display
  const rootElement = document.getElementById("root");
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="padding: 20px; font-family: Arial; text-align: center;">
        <h2>Application Loading Error</h2>
        <p>We encountered an issue loading the store.</p>
        <p><strong>Details:</strong> ${error.message}</p>
        <div style="margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 5px;">
          <strong>Browser:</strong> ${navigator.userAgent.includes('Chrome') ? 'Chrome' : navigator.userAgent.includes('Samsung') ? 'Samsung Internet' : 'Other'}<br>
          <strong>Script Loaded:</strong> Yes<br>
          <strong>React Failed:</strong> Yes
        </div>
        <button onclick="window.location.reload()" style="padding: 10px 20px; background: #000; color: white; border: none; border-radius: 5px; margin: 5px;">
          Reload Page
        </button>
      </div>
    `;
  }
}