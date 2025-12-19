import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TerminalCard from '../components/TerminalCard';
import NeonButton from '../components/NeonButton';
import { useGame } from '../context/GameContext';

const Round2 = () => {
  const navigate = useNavigate();
  const { setAnaDialogue } = useGame();

  useEffect(() => {
    setAnaDialogue("Entering Marketplace. tread carefully. Dark web signatures detected.");
  }, [setAnaDialogue]);

  return (
    <div className="flex-1 p-6 md:p-12 space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-orbitron text-neon-gold">MARKETPLACE & QUIZ</h2>
        <NeonButton variant="secondary" onClick={() => navigate('/dashboard')}>
            RETURN
        </NeonButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <TerminalCard title="BLACK MARKET" headerColor="gold" className="h-96 flex flex-col">
          <div className="flex-1 flex items-center justify-center flex-col gap-4 text-gray-500">
            <div className="w-16 h-16 border-2 border-dashed border-gray-700 rounded-full flex items-center justify-center animate-spin-slow">
              <span className="font-mono text-xs">OFFLINE</span>
            </div>
            <p className="font-mono text-sm">MARKETPLACE CONNECTION SEVERED</p>
          </div>
        </TerminalCard>

        <TerminalCard title="TECH KNOWLEDGE BASE" className="h-96 flex flex-col">
          <div className="flex-1 flex items-center justify-center flex-col gap-4 text-gray-500">
            <div className="text-neon-cyan font-mono animate-pulse">LOADING QUIZ MODULE...</div>
            <div className="w-48 h-1 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-neon-cyan w-1/3 animate-[shimmer_2s_infinite]" />
            </div>
          </div>
        </TerminalCard>
      </div>
    </div>
  );
};

export default Round2;
