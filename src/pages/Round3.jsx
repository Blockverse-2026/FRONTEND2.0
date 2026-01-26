import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import NeonButton from '../components/NeonButton';
import GlitchText from '../components/GlitchText';
import BombInterface from '../components/BombInterface';
import AnomalyCanister from '../components/AnomalyCanister';
import { useGame } from '../context/GameContext';

const Round3 = () => {
  const navigate = useNavigate();
  const { setAnaDialogue } = useGame();
  const [activeAnomaly, setActiveAnomaly] = useState(null);
  const [defusedAnomalies, setDefusedAnomalies] = useState([]);
  const [showFinalSequence, setShowFinalSequence] = useState(false);

  useEffect(() => {
    if (!activeAnomaly) {
      if (defusedAnomalies.length === 3) {
        setAnaDialogue("ALL ANOMALIES NEUTRALIZED. SYSTEM STABILIZED.");
        setTimeout(() => setShowFinalSequence(true), 1500);
      } else {
        setAnaDialogue("WARNING: ANOMALY CORE REACHED. EXTREME CAUTION ADVISED.");
      }
    } else {
      setAnaDialogue(`ENGAGING ANOMALY ${activeAnomaly}...`);
    }
  }, [setAnaDialogue, activeAnomaly, defusedAnomalies]);

  const handleDefuse = (id) => {
    setDefusedAnomalies(prev => [...prev, id]);
    setTimeout(() => setActiveAnomaly(null), 2000);
  };

  const anomalies = [
    { id: 'A', type: 'SEQUENCE' },
    { id: 'B', type: 'CIPHER' },
    { id: 'C', type: 'HASH' }
  ];

  if (showFinalSequence) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center overflow-hidden">
        {/* Cracked Glass Overlay Effect */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay"
          style={{
            backgroundImage: `url("https://t3.ftcdn.net/jpg/03/12/38/54/360_F_312385468_k1iV1D1v2f4v2f4v2f4v2f4v2f4v2f4.jpg")`, // Placeholder for cracked glass texture if unavailable, using noise instead
            background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255, 0, 0, 0.1) 10px, rgba(255, 0, 0, 0.1) 20px)'
          }}
        />
        
        {/* Red Overlay Flash */}
        <Motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0] }}
          transition={{ duration: 0.5, repeat: 3 }}
          className="absolute inset-0 bg-red-900/30 pointer-events-none"
        />

        <div className="relative z-10 text-center space-y-8">
          <Motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, type: "spring" }}
          >
            <GlitchText 
              text="SYSTEM OVERRIDE" 
              className="text-6xl md:text-8xl font-black text-red-600 tracking-tighter"
              size="large"
            />
          </Motion.div>

          <Motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="text-2xl md:text-3xl font-mono text-red-400 tracking-widest uppercase border-t border-b border-red-900 py-4"
          >
            REWRITE PROTOCOL COMPLETE
          </Motion.div>

          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3, duration: 1 }}
            className="pt-12"
          >
             <p className="text-xl md:text-2xl font-mono text-gray-500">
               YOU ARE <span className="text-red-500 font-bold glow-red">ZERO</span>
             </p>
          </Motion.div>
        </div>
        
        {/* Navigation back to dashboard after sequence */}
        <Motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 6 }}
           className="absolute bottom-12"
        >
            <NeonButton onClick={() => navigate('/dashboard')}>
                RETURN TO DASHBOARD
            </NeonButton>
        </Motion.div>
      </div>
    );
  }

  if (activeAnomaly) {
    return (
      <div className="flex-1 p-6 md:p-12 flex flex-col items-center justify-center min-h-[calc(100vh-100px)]">
        <BombInterface 
          bombId={activeAnomaly}
          onDefuse={() => handleDefuse(activeAnomaly)}
          onFail={() => {}} 
          onBack={() => setActiveAnomaly(null)}
        />
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 md:p-12 flex flex-col items-center">
      <div className="w-full max-w-6xl space-y-12">
        <div className="flex flex-col md:flex-row justify-start items-center border-b border-gray-800 pb-6">
          <div>
             <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 font-orbitron">
               ANOMALY CORE <span className="text-gray-600 mx-2">—</span> FINAL CHALLENGE
             </h2>
             <p className="text-gray-500 font-mono mt-2">Identify and neutralize system threats.</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-center gap-12 md:gap-24 mt-12 perspective-1000">
          {anomalies.map((anomaly) => {
            const isDefused = defusedAnomalies.includes(anomaly.id);
            
            return (
              <AnomalyCanister
                key={anomaly.id}
                id={anomaly.id}
                type={anomaly.type}
                status={isDefused ? 'defused' : 'locked'} // Using 'locked' as default active state here for visual consistency with screenshot red color
                onClick={() => !isDefused && setActiveAnomaly(anomaly.id)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Round3;
