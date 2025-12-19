import React, { createContext, useContext, useState } from 'react';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  const [gameState, setGameState] = useState({
    teamId: null,
    points: 1250,
    tokens: 5,
    fragments: [],
    securityLevel: 'HIGH',
  });

  const [anaDialogue, setAnaDialogue] = useState("System initialized. Waiting for input...");

  const login = (teamId) => {
    setGameState(prev => ({ ...prev, teamId }));
    setAnaDialogue(`Welcome back, Team ${teamId}. Accessing dashboard...`);
  };

  const addPoints = (amount) => {
    setGameState(prev => ({ ...prev, points: prev.points + amount }));
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
      unlockFragment,
      anaDialogue,
      setAnaDialogue 
    }}>
      {children}
    </GameContext.Provider>
  );
};
