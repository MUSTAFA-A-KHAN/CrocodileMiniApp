import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard/Dashboard";
import AccountWrapper from "./hooks/useAccount";
import Animate from "./utils/Animate";
import BarGraph from "./pages/Dashboard/components/BarGraph";
import NotFound from "./pages/Dashboard/components/NotFound"; // Import the NotFound component
import WordScrambleGame from "./pages/Dashboard/components/wordScramble";

const App = () => {
  return (
    <BrowserRouter basename="/CrocodileMiniApp">
      {/* Set the basename for GitHub Pages */}
      <AccountWrapper>
        <Animate>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/Bargraph" element={<BarGraph />} />
            <Route path="/wordScramble" element={<WordScrambleGame />} />
            {/* Catch-all route for 404 page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Animate>
      </AccountWrapper>
    </BrowserRouter>
  );
};

export default App;
