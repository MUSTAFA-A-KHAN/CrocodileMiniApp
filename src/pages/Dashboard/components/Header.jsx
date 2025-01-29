// components/Header.js
import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Header = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  // Function to handle click and redirect to home
  const handleClick = () => {
    navigate("/"); // Redirect to the home route
  };

  return (
    <header className="header-title" onClick={handleClick} style={{ cursor: "pointer" }}>
      <span className="header-highlight">Cr</span>ocodile Ga
      <span className="header-highlight">me</span> Engine
    </header>
  );
};

export default Header;