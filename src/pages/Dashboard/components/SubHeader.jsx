// Dashboard/components/SubHeader.js
import React, { useState } from "react";
import { FaEthereum } from "react-icons/fa6";
import { PiBirdFill } from "react-icons/pi";

const SubHeader = ({ userName, photo_url, userData }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="subheader-container">
      <span className="subheader-user">
        <PiBirdFill /> @{userName}
      </span>
      <span
        className="subheader-balance"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="balance-icon-container">
          <img
            src={photo_url}
            alt={`${userName}'s avatar`}
            className="balance-icon-container"
          />
          <FaEthereum color="#fff" />
        </div>
        ShowStats
        {/* Show stats on hover */}
        {isHovered && userData.length > 0 && (
          <div className="stats-popup">
            <h3>User Stats:</h3>
            <ul>
              {userData.map((user) => (
                <li key={user._id}>
                  <strong>Name:</strong> {user.Name} <br />
                  <strong>Count:</strong> {user.count}<br />
                  <strong>Rank:</strong> {user.rank}
                </li>
              ))}
            </ul>
          </div>
        )}
      </span>
    </div>
  );
};

export default SubHeader;