import React, { useEffect, useState } from "react";

// BarGraph Component
const BarGraph = ({ limit = 3 }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Fetch data from the URL
    fetch("https://crocodile-leaderboard-generator-production.up.railway.app/leaderboard")
      .then((response) => response.json())
      .then((data) => {
        // Set the fetched data into state
        setData(data);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []); // Empty dependency array ensures this runs once on mount

  // Sorting data by count in descending order
  const sortedData = [...data].sort((a, b) => b.count - a.count);

  const topEntries = sortedData.slice(0, limit); // Get top N entries

  return (
    <div className="leaderboard-section">
      <ul className="leaderboard-list mx-auto max-w-3xl bg-white rounded-3xl shadow-lg p-8">
        {topEntries.map((item, index) => (
          <li
            key={index}
            className={`flex justify-between items-center px-6 py-4 mb-4 rounded-xl ${
              index === 0
                ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-md"
                : index === 1
                ? "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800 shadow"
                : index === 2
                ? "bg-gradient-to-r from-orange-300 to-orange-400 text-orange-900 shadow"
                : "bg-gray-100"
            }`}
          >
            <div className="flex items-center gap-4">
              <span
                className={`rank-badge text-lg font-bold rounded-full w-12 h-12 flex items-center justify-center ${
                  index === 0
                    ? "bg-yellow-500 text-white"
                    : index === 1
                    ? "bg-gray-400 text-white"
                    : index === 2
                    ? "bg-orange-400 text-white"
                    : "bg-gray-300 text-gray-800"
                }`}
              >
                {index + 1}
              </span>
              <span className="text-lg font-semibold">{item.Name}</span>
            </div>
            <span className="text-sm font-medium text-gray-700">
              {item.count} points
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BarGraph;
