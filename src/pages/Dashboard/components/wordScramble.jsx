import React, { useState, useEffect } from "react";

const WordScrambleGame = () => {
  const [words, setWords] = useState([]);
  const [scrambledWord, setScrambledWord] = useState([]);
  const [originalWord, setOriginalWord] = useState("");
  const [selectedIndices, setSelectedIndices] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchWords();
  }, []);

  const fetchWords = async () => {
    try {
      const response = await fetch("https://raw.githubusercontent.com/MUSTAFA-A-KHAN/json-data-hub/refs/heads/main/words.json");
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
    const formedWord = selectedIndices.map((i) => scrambledWord[i]).join("");
    if (formedWord === originalWord) {
      setMessage("🎉 Correct!");
    } else {
      setMessage("❌ Try Again!");
    }
  };

  // Function to get position of each character (circle) on the screen
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
      <header className="header-title">
        <span className="header-highlight">Cr</span>ocodile Ga
        <span className="header-highlight">me</span> Engine
      </header>
      <div
        className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-pink-300 to-indigo-300 subheader-container"
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
                className="absolute transform transition-all duration-300 ease-in-out"
                style={{
                  left: `${x}px`,
                  top: `${y}px`,
                  width: "50px",
                  height: "50px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: selectedIndices.includes(index)
                    ? "#4CAF50"
                    : "#FFC107",
                  color: "white",
                  borderRadius: "50%",
                  cursor: "pointer",
                  userSelect: "none",
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
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
        <div className="mt-6">
          <button
            onClick={() => startGame(words)}
            className="bg-pink-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-pink-600 transform transition-all duration-300 ease-in-out"
          >
            🌟 Restart 🌟
          </button>
        </div>
        {message && (
          <p className="mt-4 text-2xl font-semibold text-white">{message}</p>
        )}
        <div className="mt-4 text-gray-200 text-lg">
          Selected Word:{" "}
          {selectedIndices.map((i) => scrambledWord[i]).join("") || "None"}
        </div>
      </div>
    </div>
  );
};

export default WordScrambleGame;
