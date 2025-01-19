// src/pages/NotFound.js
import React from "react";
import "../../../assets/styles/NotFound.css"; // Add a cute style here

const NotFound = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1>Oops! Page Not Found</h1>
        <p>Looks like you've wandered off into the unknown!</p>
        <img src="https://via.placeholder.com/300" alt="Cute animal" className="not-found-image" />
        <button onClick={() => window.location.href = "/CrocodileMiniApp"} className="back-home-button">
          Go Back Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;
