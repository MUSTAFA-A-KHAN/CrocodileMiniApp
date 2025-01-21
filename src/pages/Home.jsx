import React, { useState, useEffect } from "react";
import BarGraph from "./Dashboard/components/BarGraph"; // Import the BarGraph component
import "../assets/styles/home.css";
import welcome from "../assets/images/welcome.png";
import { FaEthereum, FaArrowRightLong } from "react-icons/fa6"; // Import FaArrowRightLong
import { PiBirdFill } from "react-icons/pi";
import { useAccount } from "../hooks/useAccount";
import axios from "axios";

function Home() {
  const [isHovered, setIsHovered] = useState(false);
  const [userData, setUserData] = useState([]);
  const { userName, userID, photo_url } = useAccount();


  

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      if (!userID) {
        console.warn("User ID is not available.");
        return; // Exit early if userID is not ready
      }
  
      console.log("Fetching data for user ID:", userID);
      try {
        const response = await axios.get(
          `https://crocodile-leaderboard-generator-production.up.railway.app/leaderboard?id=${userID}`
        );
        console.log("API response:", response.data);
        setUserData(response.data);
      } catch (err) {
        console.error("API Error:", err);
      }
    };
  

    fetchData();
  }, [userID]); // Empty dependency array ensures this runs only once

  return (
    <>
      <div className="app-container">
        <header className="header-title">
          <span className="header-highlight">Cr</span>ocodile Ga
          <span className="header-highlight">me</span> Engine
        </header>

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

        <div className="welcome-section">
          <div className="image-wrapper">
            <img src={welcome} alt="Welcome" className="welcome-image" />
          </div>
          <p className="welcome-text">
            Welcome to <strong>Crocodile Game</strong>! Start playing to lead the leaderboards.
          </p>

          {/* Add the top 3 leaderboard */}
          <BarGraph limit={3} />

          {/* Add the new button */}
          <a href="/">
            <button className="start-button">
              Under development <FaArrowRightLong color="#1b1b1b" size={22} />
            </button>
          </a>
        </div>
      </div>
    </>
  );
}

export default Home;
