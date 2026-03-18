import React, { createContext, useContext, useState, useEffect } from "react";

/* ======================================================
   CONTEXT
====================================================== */
const GameContext = createContext();

export const useGame = () => useContext(GameContext);

/* ======================================================
   PROVIDER
====================================================== */
export const GameProvider = ({ children }) => {
  /* ================= TOKEN ================= */
  const [token, setToken] = useState(() =>
    localStorage.getItem("BLOCKVERSE_TOKEN"),
  );

  /* ================= GAME STATE ================= */
  const defaultState = {
    teamId: null,
    teamName: null,
    points: 0,
    tokens: 0,
    fragments: [],
    securityLevel: "HIGH",
    completedRounds: [],
    seenIntro: false,
  };

  const [gameState, setGameState] = useState(() => {
    const saved = localStorage.getItem("BLOCKVERSE_GAME_STATE");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
          // Merge with default state to ensure all properties exist
          return { ...defaultState, ...parsed, completedRounds: [], seenIntro: false };
        }
      } catch (e) {
        console.error("Failed to parse game state", e);
      }
    }
    return defaultState;
  });

  // Persist game state whenever it changes
  useEffect(() => {
    localStorage.setItem("BLOCKVERSE_GAME_STATE", JSON.stringify(gameState));
  }, [gameState]);

  /* ================= ANA ================= */
  const [anaDialogue, setAnaDialogue] = useState(
    "System initialized. Waiting for input...",
  );
  const [anaVisible, setAnaVisible] = useState(false);

  /* ================= AUTH ================= */
  const login = (teamId, teamName, accessToken) => {
    localStorage.setItem("BLOCKVERSE_TOKEN", accessToken);
    setToken(accessToken);

    setGameState((prev) => ({
      ...prev,
      teamId,
      teamName,
    }));

    setAnaDialogue(`Welcome back, Team ${teamName}. Access granted.`);
  };

  const logout = () => {
    localStorage.removeItem("BLOCKVERSE_TOKEN");
    localStorage.removeItem("BLOCKVERSE_GAME_STATE");
    setToken(null);

    setGameState({
      teamId: null,
      teamName: null,
      points: 0,
      tokens: 0,
      fragments: [],
      securityLevel: "HIGH",
      completedRounds: [],
      seenIntro: false,
    });
  };

  /* ================= SCORING ================= */
  const addPoints = (amount) => {
    setGameState((prev) => ({
      ...prev,
      points: prev.points + Number(amount),
    }));
  };

  const addTokens = (amount) => {
    setGameState((prev) => ({
      ...prev,
      tokens: prev.tokens + Number(amount),
    }));
  };

  /* ================= PROGRESSION ================= */
  const unlockFragment = (fragmentId) => {
    setGameState((prev) => {
      if (prev.fragments.includes(fragmentId)) return prev;

      return {
        ...prev,
        fragments: [...prev.fragments, fragmentId],
        points: prev.points + 500,
      };
    });

    setAnaDialogue("Data fragment recovered.");
  };

  const completeRound = (roundId) => {
    setGameState((prev) => ({
      ...prev,
      completedRounds: Array.from(new Set([...prev.completedRounds, roundId])),
    }));
  };

  const markIntroSeen = () => {
    setGameState((prev) => ({
      ...prev,
      seenIntro: true,
    }));
  };

  /* ================= PROVIDER ================= */
  return (
    <GameContext.Provider
      value={{
        /* state */
        gameState,
        token,

        /* auth */
        login,
        logout,

        /* scoring */
        addPoints,
        addTokens,

        /* progression */
        unlockFragment,
        completeRound,
        markIntroSeen,

        /* ana */
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
