import React, { useEffect, useState } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';

const ANAAssistant = () => {
  const { anaDialogue } = useGame();
  const [isVisible] = useState(true);
  const [localDialogue, setLocalDialogue] = useState("");

  useEffect(() => {
    setLocalDialogue(anaDialogue);
  }, [anaDialogue]);

  const handleNext = () => {
    setLocalDialogue("Processing next data packet...");
    setTimeout(() => {
        setLocalDialogue("Awaiting further user input.");
    }, 1500);
  };
  
  return (
    <AnimatePresence>
      {isVisible && (
        <Motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-8 right-8 z-50 max-w-sm w-full md:w-auto"
        >
          <div className="relative flex flex-col items-end">
            <div className="bg-bg-black border border-neon-cyan p-4 mb-4 rounded-tl-xl rounded-tr-xl rounded-bl-xl shadow-neon relative max-w-xs">
              <div className="absolute -bottom-2 right-0 w-4 h-4 bg-bg-black border-r border-b border-neon-cyan transform rotate-45 translate-y-1/2 -translate-x-4"></div>
              <h4 className="text-neon-cyan font-orbitron text-xs mb-1">ANA // SYSTEM AI</h4>
              <p className="text-sm font-mono text-gray-300 typing-effect min-h-[3em]">
                {localDialogue}
              </p>
              <div className="mt-2 flex justify-end">
                <button 
                    onClick={handleNext}
                    className="text-xs text-neon-gold hover:text-white font-bold tracking-wider hover:underline"
                >
                    NEXT &gt;&gt;
                </button>
              </div>
            </div>

            <div className="flex justify-end items-center gap-3">
              <Motion.button
                whileHover={{ scale: 1.1 }}
                className="w-12 h-12 rounded-full border-2 border-neon-cyan bg-bg-black flex items-center justify-center shadow-neon overflow-hidden"
              >
                <div className="w-full h-full bg-neon-cyan/20 animate-pulse-fast flex items-center justify-center">
                  <span className="font-orbitron font-bold text-xs text-neon-cyan">ANA</span>
                </div>
              </Motion.button>
            </div>
          </div>
        </Motion.div>
      )}
    </AnimatePresence>
  );
};

export default ANAAssistant;
