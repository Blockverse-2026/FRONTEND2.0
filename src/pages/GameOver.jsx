import React from "react";
import { motion } from "framer-motion";
import GlitchText from "../components/GlitchText";
import CyberBackground from "../components/CyberBackground";
import { useNavigate } from "react-router-dom";

const GameOver = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-black p-6">
      <CyberBackground color="#ff0000" opacity={0.1} />
      
      <div className="absolute inset-0 bg-red-950/10 pointer-events-none" />
      
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1 }}
        className="text-center z-10"
      >
        <GlitchText
          text="GAME OVER"
          className="text-red-600 text-6xl md:text-8xl font-bold tracking-tighter drop-shadow-[0_0_30px_rgba(255,0,0,0.6)]"
        />
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-8 space-y-4"
        >
          <div className="text-red-500/80 font-mono text-sm md:text-lg tracking-[0.5em] uppercase animate-pulse">
            Neural Link Terminated // System Offline
          </div>
          
          <div className="h-[1px] w-64 mx-auto bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-50" />
          
          <div className="text-red-700/40 font-mono text-[10px] md:text-xs tracking-widest uppercase">
            Data Extraction Complete. The Genova Realm is now inaccessible.
          </div>
        </motion.div>
        <motion.button
          onClick={() => navigate("/leaderboard")}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-8 px-6 py-2 text-lg font-mono uppercase tracking-widest border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-black transition-all duration-300"
        >
          Leaderboard
        </motion.button>
      </motion.div>

      {/* DECORATIVE CORNERS */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-30">
        <div className="absolute top-10 left-10 w-24 h-24 border-l-2 border-t-2 border-red-600" />
        <div className="absolute top-10 right-10 w-24 h-24 border-r-2 border-t-2 border-red-600" />
        <div className="absolute bottom-10 left-10 w-24 h-24 border-l-2 border-b-2 border-red-600" />
        <div className="absolute bottom-10 right-10 w-24 h-24 border-r-2 border-b-2 border-red-600" />
      </div>

      {/* SCANLINE OVERLAY */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-20 bg-[length:100%_2px,3px_100%]" />
    </div>
  );
};

export default GameOver;
