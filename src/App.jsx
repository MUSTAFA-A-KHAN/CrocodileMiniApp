import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard/Dashboard";
import AccountWrapper from "./hooks/useAccount";
import Animate from "./utils/Animate";
import BarGraph from "./pages/Dashboard/components/BarGraph";
import NotFound from "./pages/Dashboard/components/NotFound";  // Import the NotFound component

const App = () => {
  return (
    <BrowserRouter>
      <AccountWrapper>
        <Animate>
          <Routes>
            <Route path="/CrocodileMiniApp" element={<Home />} />
            <Route path="/CrocodileMiniApp/dashboard" element={<Dashboard />} />
            <Route path="/CrocodileMiniApp/Bargraph" element={<BarGraph />} />
            {/* Catch-all route for 404 page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Animate>
      </AccountWrapper>
    </BrowserRouter>
  );
};

export default App;
