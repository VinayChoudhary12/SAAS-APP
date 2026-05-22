import React from "react";

const Button = ({ text, onClick, type = "primary" }) => {
  const baseStyle =
    "px-6 py-3 rounded-xl font-semibold transition duration-300";

  const styles = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700",
    secondary: "border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white",
  };

  return (
    <button onClick={onClick} className={`${baseStyle} ${styles[type]}`}>
      {text}
    </button>
  );
};

export default Button;