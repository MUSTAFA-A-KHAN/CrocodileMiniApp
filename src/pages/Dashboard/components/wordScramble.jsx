import React, { useState, useEffect } from "react";

const WordScrambleGame = () => {
  const words = ["circle", "react", "puzzle", "design", "tailwind"];
  const [scrambledWord, setScrambledWord] = useState([]);
  const [originalWord, setOriginalWord] = useState("");
  const [selectedIndices, setSelectedIndices] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    startGame();
  }, []);

  const shuffleWord = (word) => {
    return word.split("").sort(() => Math.random() - 0.5);
  };

  const startGame = () => {
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

  // Function to get the position of each character
  const getPosition = (index) => {
    const angle = (360 / scrambledWord.length) * index;
    const x = 100 + 80 * Math.cos((angle * Math.PI) / 180);
    const y = 100 + 80 * Math.sin((angle * Math.PI) / 180);
    return { x, y };
  };

  // Create a line path based on selected indices
  const createLinePath = () => {
    if (selectedIndices.length < 2) return ""; // Only draw line if more than 1 character is selected

    let path = `M ${getPosition(selectedIndices[0]).x} ${getPosition(selectedIndices[0]).y}`;
    selectedIndices.forEach((index) => {
      const { x, y } = getPosition(index);
      path += ` L ${x} ${y}`;
    });

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
            className="absolute top-0 left-0"
            style={{
              pointerEvents: "none", // Don't interfere with mouse/touch events
            }}
          >
            <path
              d={createLinePath()}
              stroke="rgba(0, 0, 0, 0.5)"
              strokeWidth="2"
              fill="transparent"
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
            onClick={startGame}
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
