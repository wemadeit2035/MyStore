import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

console.log("🚀 main.jsx is executing");

// Direct import without dynamic loading
import App from "./App.jsx";

const container = document.getElementById("root");

if (!container) {
  document.body.innerHTML =
    '<div style="padding: 20px; text-align: center;">Root element not found</div>';
} else {
  const root = createRoot(container);

  console.log("🎯 Rendering App component...");

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );

  console.log("✅ Render complete");
}
