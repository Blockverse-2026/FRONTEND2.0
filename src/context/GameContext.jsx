import React, { createContext, useContext, useState } from "react";

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  // 🔐 TOKEN (rehydrated from localStorage)
  const [token, setToken] = useState(
    () => localStorage.getItem("BLOCKVERSE_TOKEN")
  );

  const [gameState, setGameState] = useState({
    teamId: null,
    points: 0,
    tokens: 0,
    fragments: [],
    securityLevel: "HIGH",
    completedRounds: [],
    seenIntro: false,
  });

  const [anaDialogue, setAnaDialogue] = useState(
    "System initialized. Waiting for input..."
  );
  const [anaVisible, setAnaVisible] = useState(false);

  const login = (teamId, accessToken) => {
    // ✅ STORE TOKEN CORRECTLY
    localStorage.setItem("BLOCKVERSE_TOKEN", accessToken);
    setToken(accessToken);

    setGameState(prev => ({ ...prev, teamId }));
    setAnaDialogue(`Welcome back, Team ${teamId}. Accessing dashboard...`);
  };

  const logout = () => {
    localStorage.removeItem("BLOCKVERSE_TOKEN");
    setToken(null);
    setGameState({
      teamId: null,
      points: 0,
      tokens: 0,
      fragments: [],
      securityLevel: "HIGH",
      completedRounds: [],
      seenIntro: false,
    });
  };



  const unlockFragment = (fragmentId) => {
    if (!gameState.fragments.includes(fragmentId)) {
      setGameState(prev => ({
        ...prev,
        fragments: [...prev.fragments, fragmentId],
        points: prev.points + 500,
      }));
      setAnaDialogue("Data fragment recovered.");
    }
  };

  const completeRound = (roundId) => {
    setGameState(prev => ({
      ...prev,
      completedRounds: [...new Set([...prev.completedRounds, roundId])],
    }));
  };

  const markIntroSeen = () => {
    setGameState(prev => ({ ...prev, seenIntro: true }));
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        token,
        login,
        logout,
        unlockFragment,
        completeRound,
        markIntroSeen,
        anaDialogue,
        setAnaDialogue,
        anaVisible,
        setAnaVisible,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
