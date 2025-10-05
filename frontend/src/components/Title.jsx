import React from "react";

const Title = ({ text1, text2 }) => {
  return (
    <div
      className="inline-flex gap-2 items-center mb-3"
      role="heading"
      aria-level="2"
    >
      <p className="text-gray-300">
        {text1} <span className="text-gray-400 font-medium">{text2}</span>
      </p>
    </div>
  );
};

export default Title;
