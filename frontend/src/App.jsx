import React from "react";

function App() {
  return (
    <div
      style={{
        padding: "50px",
        textAlign: "center",
        backgroundColor: "lightblue",
        minHeight: "100vh",
      }}
    >
      <h1>✅ MyStore is Working!</h1>
      <p>React is successfully rendering.</p>
      <button
        onClick={() => alert("It works!")}
        style={{ padding: "10px 20px", margin: "10px" }}
      >
        Test Button
      </button>
    </div>
  );
}

export default App;
