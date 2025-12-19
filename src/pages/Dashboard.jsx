import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ShoppingBag, Database, Activity } from 'lucide-react';
import TerminalCard from '../components/TerminalCard';
import NeonButton from '../components/NeonButton';
import GlitchText from '../components/GlitchText';
import { useGame } from '../context/GameContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { gameState, setAnaDialogue } = useGame();

  useEffect(() => {
    setAnaDialogue("Dashboard accessed. Choose your mission protocol.");
  }, [setAnaDialogue]);

  return (
    <div className="flex-1 p-6 md:p-12 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-gray-400 font-mono text-sm">CURRENT SESSION</h2>
          <GlitchText text={gameState.teamId ? `TEAM ${gameState.teamId}` : "UNKNOWN TEAM"} size="small" />
        </div>
        <div className="flex gap-6 text-right">
          <div>
            <div className="text-neon-cyan font-bold text-xl">{gameState.points}</div>
            <div className="text-xs text-gray-400">POINTS</div>
          </div>
          <div>
            <div className="text-neon-gold font-bold text-xl">{gameState.tokens}</div>
            <div className="text-xs text-gray-400">TOKENS</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <TerminalCard title="DATA FRAGMENTS" className="h-full">
            <div className="space-y-4">
              {gameState.fragments.length === 0 ? (
                <div className="text-center py-8 text-gray-500 font-mono text-sm border border-dashed border-gray-700 p-4">
                  NO FRAGMENTS ACQUIRED
                </div>
              ) : (
                gameState.fragments.map((frag, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-neon-green text-sm font-mono">
                    <Database size={16} />
                    <span>{frag.toUpperCase()} FRAGMENT</span>
                  </div>
                ))
              )}
            </div>
          </TerminalCard>
        </div>

        <div className="md:col-span-1 space-y-4">
          <NeonButton 
            className="w-full flex items-center justify-between group"
            onClick={() => navigate('/round1')}
          >
            <span>ROUND 1: FIREWALL</span>
            <Shield className="group-hover:text-white transition-colors" size={20} />
          </NeonButton>
          
          <NeonButton 
            className="w-full flex items-center justify-between group"
            variant="secondary"
            onClick={() => navigate('/round2')}
          >
            <span>ROUND 2: MARKETPLACE</span>
            <ShoppingBag className="group-hover:text-white transition-colors" size={20} />
          </NeonButton>

          <NeonButton 
            className="w-full flex items-center justify-between group"
            variant="danger"
            onClick={() => navigate('/round3')}
          >
            <span>ROUND 3: ANOMALY</span>
            <Activity className="group-hover:text-white transition-colors" size={20} />
          </NeonButton>
        </div>

        <div className="md:col-span-1">
          <TerminalCard title="SYSTEM STATUS" headerColor="gold">
            <div className="space-y-4 font-mono text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">CONNECTION</span>
                <span className="text-neon-green">STABLE</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">SECURITY</span>
                <span className="text-neon-cyan">{gameState.securityLevel}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">LATENCY</span>
                <span className="text-neon-gold">12ms</span>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-800">
                <div className="w-full bg-gray-900 h-2 rounded-full overflow-hidden">
                  <div className="bg-neon-cyan h-full w-[75%] animate-pulse" />
                </div>
                <div className="flex justify-between text-xs mt-1 text-gray-500">
                  <span>SYSTEM LOAD</span>
                  <span>75%</span>
                </div>
              </div>
            </div>
          </TerminalCard>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
