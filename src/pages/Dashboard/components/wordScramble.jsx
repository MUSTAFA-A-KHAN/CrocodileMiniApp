import React, { useState, useEffect } from "react";
import "../../../assets/styles/wordScramble.css"; // Import the CSS file
import SubHeader from "./SubHeader"
import { useAccount } from "../../../hooks/useAccount"; // Import useAccount
import axios from "axios"; // Import axios for API calls
import Header from "./Header"; 
import Paper from "../../../assets/images/icegif-210.gif";

const WordScrambleGame = () => {
  const [words, setWords] = useState([]);
  const [scrambledWord, setScrambledWord] = useState([]);
  const [originalWord, setOriginalWord] = useState("");
  const [selectedIndices, setSelectedIndices] = useState([]);
  const [message, setMessage] = useState("");
  const [hint, setHint] = useState("");
  const [audioUrl, setAudioUrl] = useState(""); // To store pronunciation audio URL
  const [audioPlayed, setAudioPlayed] = useState(false);

  const { userName, userID, photo_url } = useAccount(); // Fetch user data
  const [userData, setUserData] = useState([]);
  const [showGif, setShowGif] = useState(false);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userID) {
        console.warn("User ID is not available.");
        return;
      }
      try {
        const response = await axios.get(
          `https://crocodile-leaderboard-generator-production.up.railway.app/leaderboard?id=${userID}`
        );
        setUserData(response.data);
      } catch (err) {
        console.error("API Error:", err);
      }
    };

    fetchUserData();
  }, [userID]);

  // Fetch words
  useEffect(() => {
    fetchWords();
  }, []);

  const fetchWords = async () => {
    try {
      const response = await fetch(
        "https://raw.githubusercontent.com/MUSTAFA-A-KHAN/json-data-hub/refs/heads/main/words.json"
      );
      const data = await response.json();
      setWords(data.commonWords);
      startGame(data.commonWords);
    } catch (error) {
      console.error("Error fetching words:", error);
    }
  };

  const shuffleWord = (word) => {
    return word.split("").sort(() => Math.random() - 0.5);
  };

  const startGame = (words) => {
    const word = words[Math.floor(Math.random() * words.length)];
    setOriginalWord(word);
    setScrambledWord(shuffleWord(word));
    setSelectedIndices([]);
    setMessage("");
    setHint("");
    setAudioUrl(""); // Reset audio URL when a new word is loaded
    setAudioPlayed(false); // Prevent audio from playing on reshuffle
    setShowGif(false);
  };

  const reshuffleWord = () => {
    setScrambledWord(shuffleWord(originalWord));
    setSelectedIndices([]);
    setMessage("");
    setHint("");
    setAudioUrl(""); // Reset audio URL
    setAudioPlayed(false); // Prevent audio from playing on reshuffle
    setShowGif(false);
  };

  const fetchHint = async () => {
    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${originalWord}`
      );
      const data = await response.json();
      if (data && data[0]) {
        const phonetic = data[0].phonetic || "No phonetic available";
        const meanings =
          data[0].meanings.length > 0
            ? data[0].meanings.map((m) => m.definitions[0].definition).join(", ")
            : "No definitions available";
        setHint(`Phonetic: ${phonetic}, Meaning: ${meanings}`);
      } else {
        setHint("No hint available.");
      }
      const audio = data[0]?.phonetics?.find((phonetic) => phonetic.audio)?.audio || "";
      setAudioUrl(audio); // Set audio URL for pronunciation
    } catch (error) {
      console.error("Error fetching hint:", error);
    }
  };

  const playAudio = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  const playSuccessAudio = (containedaudio) => {
    const audio = new Audio(containedaudio);
    audio.play();
  };

  const handleTouchMove = (event) => {
    const touch = event.touches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);

    if (element && element.dataset.index) {
      const index = parseInt(element.dataset.index, 10);
      if (!selectedIndices.includes(index)) {
        setSelectedIndices((prev) => [...prev, index]);
      }
    }
  };

  const handleMouseDown = (index) => {
    if (!selectedIndices.includes(index)) {
      setSelectedIndices([index]); // Start fresh selection
    }
  };

  const handleMouseOver = (index) => {
    if (!selectedIndices.includes(index)) {
      setSelectedIndices((prev) => [...prev, index]);
    }
  };

  const handleMouseUp = () => {
    if (selectedIndices.length === 0) {
      return;
    }
    const formedWord = selectedIndices.map((i) => scrambledWord[i]).join("");
    if (formedWord === originalWord) {
      if (!audioPlayed) {
        playSuccessAudio(
          "https://cdn.pixabay.com/download/audio/2024/10/31/audio_9f88ea50ad.mp3?filename=coin-257878.mp3"
        );
        setMessage("🎉 Correct!");
        setAudioPlayed(true); // Mark audio as played
        setShowGif(true);
      }
    } else {
      if (!audioPlayed) {
        playSuccessAudio(
          "https://cdn.pixabay.com/download/audio/2022/11/21/audio_136661e554.mp3?filename=error-126627.mp3"
        );
        setMessage("❌ UH OH! Again?");
        setAudioPlayed(true); // Mark audio as played
      }
    }
  };

  const getPosition = (index) => {
    const angle = (360 / scrambledWord.length) * index;
    const x = 100 + 80 * Math.cos((angle * Math.PI) / 180);
    const y = 100 + 80 * Math.sin((angle * Math.PI) / 180);
    return { x, y };
  };

  // Function to create a smooth curved line connecting the circles
  const createLinePath = () => {
    if (selectedIndices.length < 2) return ""; // Only draw line if more than 1 character is selected

    // Start the path from the first point
    let path = `M ${getPosition(selectedIndices[0]).x} ${getPosition(selectedIndices[0]).y}`;

    // Loop through selected indices and add smooth Bezier curve commands
    for (let i = 0; i < selectedIndices.length - 1; i++) {
      const { x: x1, y: y1 } = getPosition(selectedIndices[i]);
      const { x: x2, y: y2 } = getPosition(selectedIndices[i + 1]);

      // Control points for Bezier curve
      const cx1 = x1 + (x2 - x1) / 2;
      const cy1 = y1 + (y2 - y1) / 2;

      path += ` C ${cx1} ${cy1}, ${cx1} ${cy1}, ${x2} ${y2}`;
    }

    return path;
  };

  return (
    <div className="app-container">
      <Header /> {/* Reusable Header */}
      <SubHeader userName={userName} photo_url={photo_url} userData={userData} /> {/* Add SubHeader here */}
      <div
        className="welcome-section"
        onTouchMove={handleTouchMove}
        onMouseUp={handleMouseUp}
        onTouchEnd={handleMouseUp}
      >
        <h1 className="text-4xl font-bold mb-6 text-white">Swipe Scramble Game</h1>
        <div
          className="relative w-64 h-64 flex items-center justify-center"
          style={{ touchAction: "none" }} // Prevent scrolling inside this div
        >
          {/* SVG for drawing the line */}
          <svg
            width="200"
            height="200"
            style={{
              pointerEvents: "none", // Don't interfere with mouse/touch events
            }}
          >
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: "#ff7e5f", stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: "#feb47b", stopOpacity: 1 }} />
              </linearGradient>
            </defs>
            <path
              d={createLinePath()}
              stroke="url(#gradient)"
              strokeWidth="3"
              fill="transparent"
              filter="drop-shadow(0 0 10px rgba(0, 0, 0, 0.5))"
            />
          </svg>
  
          {scrambledWord.map((char, index) => {
            const { x, y } = getPosition(index);
  
            return (
              <div
                key={index}
                data-index={index}
                className={`circle ${selectedIndices.includes(index) ? "selected" : ""}`}
                style={{
                  left: `${x}px`,
                  top: `${y}px`,
                }}
                onMouseDown={() => handleMouseDown(index)}
                onMouseOver={() => handleMouseOver(index)}
                onTouchStart={() => handleMouseDown(index)}
              >
                {char}
              </div>
            );
          })}
        </div>
        <div className="mt-6 flex gap-4">
          <button onClick={reshuffleWord} className="button retry">
            🔄 Retry
          </button>
          <button onClick={() => startGame(words)} className="button next">
            ⏭️ Next/Skip
          </button>
          <button onClick={fetchHint} className="button hint">
            💡 Hint
          </button>
          {audioUrl && (
            <button onClick={playAudio} className="button pronunciation">
              🔊 Pronunciation
            </button>
          )}
        </div>
        {message && <p className="message">{message}</p>}
        {hint && <p className="hint">{hint}</p>}
        <div className="selected-word">
          Selected Word: {selectedIndices.map((i) => scrambledWord[i]).join("") || "None"}
        </div>
      </div>
  
      {/* Full-screen transparent GIF overlay */}
      {showGif && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 1000, // Ensure it's above everything else
            pointerEvents: "none", // Allow clicks to pass through
          }}
        >
          <img
            src={Paper} // Path to your transparent GIF
            alt="Success Animation"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover", // Ensure the GIF covers the entire screen
            }}
          />
        </div>
      )}
    </div>
  );
};

export default WordScrambleGame;