import React from "react";

const DesktopWrapper = ({ children }) => {
  return (
    <div
      className="desktop-container"
      style={{
        minWidth: "1200px",
        width: "100%",
        margin: "0 auto",
      }}
    >
      {children}
    </div>
  );
};

export default DesktopWrapper;
