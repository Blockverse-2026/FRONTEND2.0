import React, { createContext, useContext, useState } from 'react';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  const [gameState, setGameState] = useState({
    teamId: null,
    points: 0,
    tokens: 0,
    fragments: [],
    securityLevel: 'HIGH',
    completedRounds: [],
    seenIntro: false,
  });

  const [anaDialogue, setAnaDialogue] = useState("System initialized. Waiting for input...");
  const [anaVisible, setAnaVisible] = useState(false);

  const completeRound = (roundId) => {
    setGameState(prev => {
      if (prev.completedRounds.includes(roundId)) return prev;
      return {
        ...prev,
        completedRounds: [...prev.completedRounds, roundId]
      };
    });
  };

  const login = (teamId) => {
    setGameState(prev => ({ ...prev, teamId }));
    setAnaDialogue(`Welcome back, Team ${teamId}. Accessing dashboard...`);
  };

  const markIntroSeen = () => {
    setGameState(prev => ({ ...prev, seenIntro: true }));
  };

  const addPoints = (amount) => {
    setGameState(prev => ({ ...prev, points: prev.points + amount }));
  };

  const addTokens = (amount) => {
    setGameState(prev => ({ ...prev, tokens: prev.tokens + amount }));
  };

  const unlockFragment = (fragmentId) => {
    if (!gameState.fragments.includes(fragmentId)) {
      setGameState(prev => ({ 
        ...prev, 
        fragments: [...prev.fragments, fragmentId],
        points: prev.points + 500
      }));
      setAnaDialogue("Data fragment recovered. Decryption protocol advancing.");
    }
  };

  return (
    <GameContext.Provider value={{ 
      gameState, 
      setGameState, 
      login, 
      addPoints, 
      addTokens,
      unlockFragment,
      completeRound,
      markIntroSeen,
      anaDialogue,
      setAnaDialogue,
      anaVisible,
      setAnaVisible
    }}>
      {children}
    </GameContext.Provider>
  );
};
