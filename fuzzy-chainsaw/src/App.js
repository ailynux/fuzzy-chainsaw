import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Experiment from "./pages/Experiment";
import Randomizer from "./pages/Randomizer";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/experiment" element={<Experiment />} />
        <Route path="/randomizer" element={<Randomizer />} />
      </Routes>
    </Router>
  );
}

export default App;
