import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { GameProvider } from "./context/GameContext";
import Layout from "./components/Layout";
import LoadingScreen from "./components/LoadingScreen";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import Round1 from "./pages/Round1";
import Round2 from "./pages/Round2";
import Round3 from "./pages/Round3";
import BlackMarket from "./pages/BlackMarket";

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <GameProvider>
      <AnimatePresence mode="wait">
        {loading && (
          <LoadingScreen key="loading" onComplete={() => setLoading(false)} />
        )}
      </AnimatePresence>

      {!loading && (
        <Router>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/round1" element={<Round1 />} />
              <Route path="/round2/phase1" element={<Round2 />} />
              <Route path="/round3" element={<Round3 />} />
              <Route path="/round2/market" element={<BlackMarket />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </Router>
      )}
    </GameProvider>
  );
}

export default App;
