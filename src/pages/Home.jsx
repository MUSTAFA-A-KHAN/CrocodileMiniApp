import React from "react";
import BarGraph from "./Dashboard/components/BarGraph"; // Import the BarGraph component
import "../assets/styles/home.css";
import welcome from "../assets/images/welcome.png";
import { FaEthereum, FaArrowRightLong } from "react-icons/fa6";
import { PiBirdFill } from "react-icons/pi";
import { useAccount } from "../hooks/useAccount";

function Home() {
  const { userName, userID, photo_url } = useAccount();

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
          <span className="subheader-balance">
            <div className="balance-icon-container">
              <img
                src={photo_url}
                alt={`${userName}'s avatar`}
                className="balance-icon-container"
              />
              <FaEthereum color="#fff" />
            </div>
            ShowStats
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
          <a href="/CrocodileMiniApp/dashboard">
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
