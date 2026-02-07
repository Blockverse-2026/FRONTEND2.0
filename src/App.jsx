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

import PanelPlayer from "./components/PanelPlayer";
import { panelsData } from "./utils/panelsData";
import { PANELS } from "./utils/panelKeys";
import { markPanelSeen } from "./utils/panelProgress";

const PanelRoute = ({ panelKey, next }) => {
  const navigate = useNavigate();

  return (
    <PanelPlayer
      panels={panelsData[panelKey] || []}
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

              <Route
                path="/panel/login-success"
                element={
                  <PanelRoute
                    panelKey={PANELS.LOGIN_SUCCESS}
                    next="/dashboard"
                  />
                }
              />

              <Route
                path="/panel/dashboard-intro"
                element={
                  <PanelRoute
                    panelKey={PANELS.DASHBOARD_INTRO}
                    next="/round1"
                  />
                }
              />

              <Route
                path="/panel/round1-intro"
                element={
                  <PanelRoute
                    panelKey={PANELS.ROUND1_INTRO}
                    next="/panel/round2-intro"
                  />
                }
              />

              <Route
                path="/panel/round2-intro"
                element={
                  <PanelRoute
                    panelKey={PANELS.ROUND2_INTRO}
                    next="/round2/phase1"
                  />
                }
              />

              <Route
                path="/panel/round2-outro"
                element={
                  <PanelRoute
                    panelKey={PANELS.ROUND2_OUTRO}
                    next="/panel/round3-intro"
                  />
                }
              />
              <Route
                path="/panel/round3-intro"
                element={
                  <PanelRoute
                    panelKey={PANELS.ROUND3_INTRO}
                    next="/round3"
                  />
                }
              />

              <Route
                path="/panel/final"
                element={
                  <PanelRoute
                    panelKey={PANELS.FINAL}
                    next="/"
                  />
                }
              />

              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/round1" element={<Round1 />} />
              <Route path="/round2/phase1" element={<Round2 />} />
              <Route path="/round2/phase2" element={<BlackMarket />} />
              <Route path="/round3" element={<Round3 />} />
              <Route path="/round3/bomb/:id" element={<Round3Bomb />} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </Router>
      )}
    </GameProvider>
  );
}

export default App;
