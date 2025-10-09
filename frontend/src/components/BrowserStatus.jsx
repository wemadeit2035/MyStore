import React, { useState, useEffect } from "react";

const BrowserStatus = () => {
  const [status, setStatus] = useState("Checking...");
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/product/list`
      );
      if (response.ok) {
        setStatus("✅ Connected");
      } else {
        setStatus(`❌ HTTP ${response.status}`);
      }
    } catch (error) {
      setStatus("❌ Network Error");
    }
  };

  if (!isVisible) return null;

  const browser = navigator.userAgent.includes("Chrome")
    ? "Chrome"
    : navigator.userAgent.includes("Samsung")
    ? "Samsung"
    : "Other";

  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
        right: "10px",
        background: "rgba(0,0,0,0.8)",
        color: "white",
        padding: "8px 12px",
        borderRadius: "5px",
        fontSize: "12px",
        fontFamily: "Arial",
        zIndex: 9999,
        maxWidth: "200px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>
          <strong>{browser}</strong>: {status}
        </span>
        <button
          onClick={() => setIsVisible(false)}
          style={{
            background: "none",
            border: "none",
            color: "white",
            marginLeft: "10px",
            cursor: "pointer",
          }}
        >
          ×
        </button>
      </div>
      <button
        onClick={checkStatus}
        style={{
          marginTop: "5px",
          padding: "2px 8px",
          fontSize: "10px",
          background: "#555",
          color: "white",
          border: "none",
          borderRadius: "3px",
        }}
      >
        Retest
      </button>
    </div>
  );
};

export default BrowserStatus;
