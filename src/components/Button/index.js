import React from "react";
import "./styles.css";

function Button({ text, onClick, blue }) {
  return (
    <div className={`btn ${blue ? 'btn-blue' : ''}`} onClick={onClick}>
      {text}
    </div>
  );
}

export default Button;
