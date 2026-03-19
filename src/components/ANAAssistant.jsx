import React, { useEffect, useState, useRef } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';

const ANAAssistant = () => {
  const { anaDialogue, anaVisible, setAnaVisible } = useGame();
  const [localDialogue, setLocalDialogue] = useState("");
  const containerRef = useRef(null);

  useEffect(() => {
    setLocalDialogue(anaDialogue);
  }, [anaDialogue]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (anaVisible && containerRef.current && !containerRef.current.contains(event.target)) {
        setAnaVisible(false);
      }
    };

    if (anaVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [anaVisible, setAnaVisible]);

  const handleNext = () => {
    setLocalDialogue("Processing next data packet...");
    setTimeout(() => {
        setLocalDialogue("Awaiting further user input.");
    }, 1500);
  };
  
  const ANAButtonContent = ({ isVisible }) => (
    <div className="relative w-14 h-14 flex items-center justify-center">
      {/* Outer Rotating Ring */}
      <div className="absolute inset-0 border-2 border-dashed border-neon-sky/30 rounded-full animate-[spin_10s_linear_infinite]" />
      
      {/* Inner Rotating Ring (Counter-clockwise) */}
      <div className="absolute inset-1 border border-dotted border-neon-sky/50 rounded-full animate-[spin_15s_linear_infinite_reverse]" />

      {/* Main Button Body */}
      <div className={`w-12 h-12 rounded-full border-2 border-neon-sky bg-bg-black flex items-center justify-center shadow-[0_0_15px_#00d4ff] overflow-hidden relative group`}>
        {/* Pulsing Core */}
        <div className="absolute inset-0 bg-neon-sky/10 animate-pulse-fast" />
        
        {/* Scanning Line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-neon-sky/40 blur-[2px] animate-scanline" />

        {/* Tech Corner Decorations */}
        <div className="absolute top-1 left-1 w-1.5 h-1.5 border-t border-l border-neon-sky/60" />
        <div className="absolute top-1 right-1 w-1.5 h-1.5 border-t border-r border-neon-sky/60" />
        <div className="absolute bottom-1 left-1 w-1.5 h-1.5 border-b border-l border-neon-sky/60" />
        <div className="absolute bottom-1 right-1 w-1.5 h-1.5 border-b border-r border-neon-sky/60" />

        <span className="font-orbitron font-bold text-[10px] text-neon-sky z-10 tracking-tighter animate-glitch-fast group-hover:animate-none">ANA</span>
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {anaVisible && (
        <Motion.div 
          ref={containerRef}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-8 right-8 z-50 max-w-sm w-full md:w-auto"
        >
          <div className="relative flex flex-col items-end">
            <div className="bg-bg-black border border-neon-sky p-4 mb-4 rounded-tl-xl rounded-tr-xl rounded-bl-xl shadow-[0_0_10px_#00d4ff,0_0_20px_#00d4ff] relative max-w-xs">
              <div className="absolute -bottom-2 right-0 w-4 h-4 bg-bg-black border-r border-b border-neon-sky transform rotate-45 translate-y-1/2 -translate-x-4"></div>
              <h4 className="text-neon-sky font-orbitron text-xs mb-1">ANA // SYSTEM AI</h4>
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
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setAnaVisible(!anaVisible)}
                aria-expanded={anaVisible}
                className="relative"
              >
                <ANAButtonContent isVisible={true} />
              </Motion.button>
            </div>
          </div>
        </Motion.div>
      )}
      {!anaVisible && (
        <div className="fixed bottom-8 right-8 z-40">
          <Motion.button
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setAnaVisible(true)}
            aria-expanded={anaVisible}
            className="relative"
          >
            <ANAButtonContent isVisible={false} />
          </Motion.button>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ANAAssistant;
