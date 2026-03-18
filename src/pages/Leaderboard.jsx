import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { io } from "socket.io-client";
import { Trophy, Shield, Cpu, Activity } from "lucide-react";
import CyberBackground from "../components/CyberBackground";
import GlitchText from "../components/GlitchText";

const SOCKET_URL = "https://backend-3-jpwf.onrender.com";

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const socket = io(SOCKET_URL);

    socket.on("connect", () => {
      console.log("Connected to leaderboard socket");
    });

    socket.on("leaderboard:update", (data) => {
      setLeaderboardData(data);
      setLoading(false);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const getRankStyle = (index) => {
    switch (index) {
      case 0: return "text-neon-gold drop-shadow-[0_0_8px_rgba(255,170,0,0.6)]";
      case 1: return "text-gray-300 drop-shadow-[0_0_8px_rgba(200,200,200,0.5)]";
      case 2: return "text-amber-600 drop-shadow-[0_0_8px_rgba(217,119,6,0.5)]";
      default: return "text-neon-cyan/60";
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden flex flex-col items-center p-6 md:p-12">
      <CyberBackground opacity={0.15} />
      <div className="scanline-overlay" />
      
      {/* ATMOSPHERIC GLOWS */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-cyan/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-gold/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="z-10 w-full max-w-5xl flex flex-col items-center"
      >
        <div className="w-full flex justify-center items-center mb-8">
          <div className="flex flex-col items-center">
            <GlitchText
              text="GLOBAL_RANKINGS"
              size="large"
              className="tracking-tighter"
            />
            <div className="h-[1px] w-48 bg-gradient-to-r from-transparent via-neon-cyan to-transparent opacity-50 mt-1" />
          </div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full bg-black/40 backdrop-blur-xl border border-neon-cyan/30 rounded-lg overflow-hidden relative shadow-[0_0_50px_rgba(0,246,255,0.05)]"
        >
          {/* TERMINAL HEADER DECORATION */}
          <div className="w-full h-10 bg-neon-cyan/10 border-b border-neon-cyan/30 flex items-center px-4 justify-between">
            <div className="flex gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500/50" />
              <div className="w-2 h-2 rounded-full bg-neon-gold/50" />
              <div className="w-2 h-2 rounded-full bg-neon-green/50" />
            </div>
            <div className="text-[10px] font-mono text-neon-cyan/40 tracking-[0.3em] uppercase">
              Neural_Link // Active_Stream
            </div>
          </div>

          <div className="p-4 md:p-8">
            <div className="grid grid-cols-12 gap-4 text-[10px] md:text-xs font-mono text-neon-cyan/40 mb-6 pb-2 border-b border-neon-cyan/10 uppercase tracking-[0.2em]">
              <div className="col-span-2 text-center">Pos</div>
              <div className="col-span-7">Operator_ID</div>
              <div className="col-span-3 text-right">Intel_Score</div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 space-y-4">
                <Cpu size={48} className="text-neon-cyan animate-spin opacity-20" />
                <div className="text-neon-cyan/50 font-mono text-xs animate-pulse tracking-widest uppercase">
                  Decrypting Leaderboard Data...
                </div>
              </div>
            ) : (
              <ul className="space-y-3">
                <AnimatePresence>
                  {leaderboardData.map((entry, index) => (
                    <motion.li
                      key={entry.teamId || index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`grid grid-cols-12 gap-4 items-center p-4 rounded border transition-all duration-300 group
                        ${index < 3 
                          ? "bg-white/5 border-white/10 hover:bg-white/10" 
                          : "border-white/5 hover:bg-white/5"}
                      `}
                    >
                      {/* POSITION */}
                      <div className={`col-span-2 flex justify-center items-center font-orbitron text-xl md:text-2xl font-bold ${getRankStyle(index)}`}>
                        {index === 0 ? <Trophy size={24} className="mr-2 hidden md:block" /> : null}
                        {String(index + 1).padStart(2, '0')}
                      </div>

                      {/* TEAM ID */}
                      <div className="col-span-7 flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-sm border flex items-center justify-center
                          ${index < 3 ? 'border-neon-gold/30 bg-neon-gold/5' : 'border-neon-cyan/20 bg-neon-cyan/5'}
                        `}>
                          {index < 3 ? <Shield size={14} className="text-neon-gold" /> : <Activity size={14} className="text-neon-cyan/60" />}
                        </div>
                        <div className="flex flex-col">
                          <span className={`font-mono text-sm md:text-base tracking-tight transition-colors
                            ${index < 3 ? 'text-white font-bold' : 'text-white/80 group-hover:text-white'}
                          `}>
                            {entry.teamId}
                          </span>
                          <span className="text-[8px] font-mono text-white/20 uppercase tracking-tighter">
                            Status: Verified // Neural_Link: Stable
                          </span>
                        </div>
                      </div>

                      {/* POINTS */}
                      <div className="col-span-3 text-right">
                        <div className={`font-orbitron text-lg md:text-xl font-bold tracking-tighter
                          ${index < 3 ? 'text-neon-gold' : 'text-neon-cyan'}
                        `}>
                          {entry.totalPoints.toLocaleString()}
                        </div>
                        <div className="text-[8px] font-mono text-white/20 uppercase">
                          Pts_Recovered
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </AnimatePresence>
              </ul>
            )}
          </div>
          
          {/* DECORATIVE CORNERS */}
          <div className="absolute top-0 left-0 w-8 h-8 border-l border-t border-neon-cyan/30" />
          <div className="absolute top-0 right-0 w-8 h-8 border-r border-t border-neon-cyan/30" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-l border-b border-neon-cyan/30" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-r border-b border-neon-cyan/30" />
        </motion.div>
        
        <div className="mt-8 flex gap-8 opacity-30 font-mono text-[9px] uppercase tracking-widest text-neon-cyan">
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 bg-neon-cyan rounded-full animate-ping" />
            Live_Update_Mode: ON
          </div>
          <div>Encryption: AES-256_ACTIVE</div>
          <div>Sector: LEADERBOARD_HUB</div>
        </div>
      </motion.div>
    </div>
  );
};

export default Leaderboard;
