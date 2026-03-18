import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
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
import BlackMarket from "./pages/BlackMarket";
import Round3 from "./pages/Round3";
import Round3Bomb from "./pages/Round3Bomb";
import GameOver from "./pages/GameOver";
import Leaderboard from "./pages/Leaderboard";

import PanelPlayer from "./components/PanelPlayer";
import { PANELS_DATA } from "./utils/panelsData";
import { PANELS } from "./utils/panelKeys";
import { markPanelSeen } from "./utils/panelProgress";

const PanelRoute = ({ panelKey, next }) => {
  const navigate = useNavigate();

  return (
    <PanelPlayer
      panels={PANELS_DATA[panelKey]}
      onComplete={() => {
        markPanelSeen(panelKey);
        navigate(next, { replace: true });
      }}
    />
  );
};

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <GameProvider>
      <AnimatePresence mode="wait">
        {loading && (
          <LoadingScreen
            key="loading"
            onComplete={() => setLoading(false)}
          />
        )}
      </AnimatePresence>

      {!loading && (
        <Router>
          <Routes>
            <Route element={<Layout />}>

              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/dashboard" element={<Dashboard />} />

              {/* ROUND 1 */}
              <Route
                path="/panel/round1-intro"
                element={
                  <PanelRoute
                    panelKey={PANELS.ROUND1_INTRO}
                    next="/round1"
                  />
                }
              />
              <Route path="/round1" element={<Round1 />} />

              {/* ROUND 2 */}
              <Route
                path="/panel/round2-intro"
                element={
                  <PanelRoute
                    panelKey={PANELS.ROUND2_INTRO}
                    next="/round2/phase1"
                  />
                }
              />
              <Route path="/round2/phase1" element={<Round2 />} />
              <Route path="/round2/phase2" element={<BlackMarket />} />

              {/* ROUND 3 */}
              <Route
                path="/panel/round3-intro"
                element={
                  <PanelRoute
                    panelKey={PANELS.ROUND3_INTRO}
                    next="/round3"
                  />
                }
              />
              <Route path="/round3" element={<Round3 />} />
              <Route path="/round3/bomb/:id" element={<Round3Bomb />} />

              {/* FINAL */}
              <Route
                path="/panel/final"
                element={
                  <PanelRoute
                    panelKey={PANELS.FINAL}
                    next="/game-over"
                  />
                }
              />

              <Route path="/game-over" element={<GameOver />} />
              <Route path="/leaderboard" element={<Leaderboard />} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </Router>
      )}
    </GameProvider>
  );
}

export default App;
