import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
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
import { useGame } from "./context/GameContext";

const ProtectedRoute = ({ children, requiredRound }) => {
  const { token, gameState } = useGame();
  const location = useLocation();

  if (!token && location.pathname !== "/login" && location.pathname !== "/") {
    return <Navigate to="/login" replace />;
  }

  if (requiredRound) {
    const isUnlocked =
      requiredRound === "round1" ||
      requiredRound === "round3" ||
      gameState.completedRounds.includes(
        requiredRound === "round2" ? "round1" : "round2"
      );

    if (!isUnlocked) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

const NavigationGuard = () => {
  const location = useLocation();

  useEffect(() => {
    // Prevent back/forward by pushing state back on popstate
    const handlePopState = (e) => {
      window.history.pushState(null, "", window.location.href);
    };

    // Initial push to ensure there is something to pop
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handlePopState);

    // Warn on refresh/close
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [location.pathname]);

  return null;
};

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
        <Router basename="/blockverse-26">
          <NavigationGuard />
          <Routes>
            <Route element={<Layout />}>

              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />

              {/* ROUND 1 */}
              <Route
                path="/panel/round1-intro"
                element={
                  <ProtectedRoute>
                    <PanelRoute
                      panelKey={PANELS.ROUND1_INTRO}
                      next="/round1"
                    />
                  </ProtectedRoute>
                }
              />
              <Route path="/round1" element={
                <ProtectedRoute requiredRound="round1">
                  <Round1 />
                </ProtectedRoute>
              } />

              {/* ROUND 2 */}
              <Route
                path="/panel/round2-intro"
                element={
                  <ProtectedRoute requiredRound="round2">
                    <PanelRoute
                      panelKey={PANELS.ROUND2_INTRO}
                      next="/round2/phase1"
                    />
                  </ProtectedRoute>
                }
              />
              <Route path="/round2/phase1" element={
                <ProtectedRoute requiredRound="round2">
                  <Round2 />
                </ProtectedRoute>
              } />
              <Route path="/round2/phase2" element={
                <ProtectedRoute requiredRound="round2">
                  <BlackMarket />
                </ProtectedRoute>
              } />

              {/* ROUND 3 */}
              <Route
                path="/panel/round3-intro"
                element={
                  <ProtectedRoute requiredRound="round3">
                    <PanelRoute
                      panelKey={PANELS.ROUND3_INTRO}
                      next="/round3"
                    />
                  </ProtectedRoute>
                }
              />
              <Route path="/round3" element={
                <ProtectedRoute requiredRound="round3">
                  <Round3 />
                </ProtectedRoute>
              } />
              <Route path="/round3/bomb/:id" element={
                <ProtectedRoute requiredRound="round3">
                  <Round3Bomb />
                </ProtectedRoute>
              } />

              {/* FINAL */}
              <Route
                path="/panel/final"
                element={
                  <ProtectedRoute requiredRound="round3">
                    <PanelRoute
                      panelKey={PANELS.FINAL}
                      next="/game-over"
                    />
                  </ProtectedRoute>
                }
              />

              <Route path="/game-over" element={
                <ProtectedRoute>
                  <GameOver />
                </ProtectedRoute>
              } />
              <Route path="/leaderboard" element={
                <ProtectedRoute>
                  <Leaderboard />
                </ProtectedRoute>
              } />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </Router>
      )}
    </GameProvider>
  );
}

export default App;
