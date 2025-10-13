import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

console.log("🚀 main.jsx is executing");

const container = document.getElementById("root");

if (!container) {
  document.body.innerHTML =
    '<div style="padding: 20px; text-align: center;">Root element not found</div>';
} else {
  const root = createRoot(container);

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
