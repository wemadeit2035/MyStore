import React, { useState, useEffect } from "react";

const VisualDebug = () => {
  const [debugInfo, setDebugInfo] = useState({
    browser: "Detecting...",
    scriptLoaded: "No",
    reactLoaded: "No",
    fetchWorking: "Testing...",
    backendReachable: "Testing...",
  });

  useEffect(() => {
    // Test if scripts are loaded
    setDebugInfo((prev) => ({
      ...prev,
      scriptLoaded: "Yes",
      reactLoaded: typeof React !== "undefined" ? "Yes" : "No",
      browser: detectBrowser(),
    }));

    // Test backend connectivity
    testBackend();
  }, []);

  const detectBrowser = () => {
    const ua = navigator.userAgent;
    if (ua.includes("Chrome") && !ua.includes("Firefox")) return "Chrome";
    if (ua.includes("SamsungBrowser")) return "Samsung Internet";
    if (ua.includes("Firefox")) return "Firefox";
    return "Other";
  };

  const testBackend = async () => {
    try {
      const response = await fetch(
        "https://mystore-backend-ochre.vercel.app/api/mobile/health"
      );
      setDebugInfo((prev) => ({
        ...prev,
        backendReachable: response.ok ? "✅ Yes" : `❌ No (${response.status})`,
      }));
    } catch (error) {
      setDebugInfo((prev) => ({
        ...prev,
        backendReachable: `❌ Error: ${error.message}`,
      }));
    }

    // Test fetch
    try {
      await fetch("https://jsonplaceholder.typicode.com/posts/1");
      setDebugInfo((prev) => ({
        ...prev,
        fetchWorking: "✅ Yes",
      }));
    } catch (error) {
      setDebugInfo((prev) => ({
        ...prev,
        fetchWorking: `❌ No: ${error.message}`,
      }));
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        background: "rgba(0,0,0,0.95)",
        color: "white",
        padding: "10px",
        fontSize: "14px",
        fontFamily: "Arial, sans-serif",
        zIndex: 10000,
        borderBottom: "2px solid red",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <strong style={{ color: "red" }}>
          DEBUG MODE - Chrome/Samsung Detected
        </strong>
        <button
          onClick={() =>
            (document.getElementById("debug-details").style.display =
              document.getElementById("debug-details").style.display === "none"
                ? "block"
                : "none")
          }
          style={{
            background: "#555",
            color: "white",
            border: "none",
            padding: "5px 10px",
            borderRadius: "3px",
          }}
        >
          Toggle Details
        </button>
      </div>

      <div id="debug-details" style={{ marginTop: "10px", display: "block" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "10px",
          }}
        >
          <div>
            <strong>Browser:</strong> {debugInfo.browser}
          </div>
          <div>
            <strong>Script Loaded:</strong> {debugInfo.scriptLoaded}
          </div>
          <div>
            <strong>React Loaded:</strong> {debugInfo.reactLoaded}
          </div>
          <div>
            <strong>Fetch Working:</strong> {debugInfo.fetchWorking}
          </div>
          <div>
            <strong>Backend Reachable:</strong> {debugInfo.backendReachable}
          </div>
        </div>

        <div
          style={{
            marginTop: "10px",
            padding: "10px",
            background: "#333",
            borderRadius: "5px",
          }}
        >
          <strong>User Agent:</strong>
          <div style={{ fontSize: "12px", wordBreak: "break-all" }}>
            {navigator.userAgent}
          </div>
        </div>

        <button
          onClick={testBackend}
          style={{
            marginTop: "10px",
            padding: "8px 16px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
          }}
        >
          Retest Connection
        </button>
      </div>
    </div>
  );
};

export default VisualDebug;
