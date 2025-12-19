import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertOctagon, Lock } from 'lucide-react';
import TerminalCard from '../components/TerminalCard';
import NeonButton from '../components/NeonButton';
import GlitchText from '../components/GlitchText';
import { useGame } from '../context/GameContext';

const Round3 = () => {
  const navigate = useNavigate();
  const { setAnaDialogue } = useGame();

  useEffect(() => {
    setAnaDialogue("WARNING: ANOMALY CORE REACHED. EXTREME CAUTION ADVISED.");
  }, [setAnaDialogue]);

  const anomalies = ['A', 'B', 'C'];

  return (
    <div className="flex-1 p-6 md:p-12 space-y-8">
      <div className="flex justify-between items-center">
        <GlitchText text="ANOMALY CORE" className="text-red-500" />
        <NeonButton variant="danger" onClick={() => navigate('/dashboard')}>
            EMERGENCY EXIT
        </NeonButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        {anomalies.map((id) => (
          <div key={id} className="relative group cursor-not-allowed">
            <TerminalCard 
              title={`ANOMALY ${id}`} 
              headerColor="gold" 
              className="h-80 border-red-500/50 bg-red-900/10 flex flex-col items-center justify-center gap-6 group-hover:border-red-500 transition-colors"
            >
              <AlertOctagon size={48} className="text-red-500 animate-pulse" />
              <div className="flex flex-col items-center gap-2">
                <Lock size={20} className="text-gray-400" />
                <span className="font-mono text-red-400 text-sm text-center">
                    LOCKED UNTIL FRAGMENTS ACQUIRED
                </span>
              </div>
          </TerminalCard>
          
            <div className="absolute inset-0 bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none mix-blend-overlay" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Round3;
