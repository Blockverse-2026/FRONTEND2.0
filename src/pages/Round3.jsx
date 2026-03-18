import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GlitchText from "../components/GlitchText";
import CyberBackground from "../components/CyberBackground";

const API = "https://blockverse-backend.onrender.com";

const Round3 = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("BLOCKVERSE_TOKEN");

    fetch(`${API}/api/round3/init`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => setData(res.data))
      .catch((err) => console.error("Round3 hub init error:", err));
  }, []);

  if (!data) {
    return (
      <div className="h-screen w-full flex items-center justify-center text-neon-cyan font-mono bg-black">
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="tracking-[0.5em] uppercase text-xl"
        >
          Initializing bombs…
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-black p-4 md:p-12">
      <CyberBackground />
      
      {/* DECORATIVE ELEMENTS */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 border-l border-t border-red-500/50" />
        <div className="absolute top-10 right-10 w-32 h-32 border-r border-t border-red-500/50" />
        <div className="absolute bottom-10 left-10 w-32 h-32 border-l border-b border-red-500/50" />
        <div className="absolute bottom-10 right-10 w-32 h-32 border-r border-b border-red-500/50" />
      </div>

      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute top-12 md:top-20 text-center z-10"
      >
        <GlitchText 
          text="BOMB DIFFUSION" 
          className="drop-shadow-[0_0_15px_rgba(255,0,0,0.5)]" 
        />
        <div className="mt-2 text-red-500/60 font-mono text-[10px] tracking-[0.8em] uppercase">
          Sector 7 // Core Stability: Critical
        </div>
      </motion.div>

      <div className="flex flex-wrap justify-center gap-10 md:gap-24 relative z-10 mt-20">
        {data.bombs.map((bomb, idx) => {
          const diffused = bomb.questions.every((q) => q.solved);

          return (
            <motion.div
              key={bomb.bombNumber}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: idx * 0.15 }}
              whileHover={!diffused ? { scale: 1.05 } : {}}
              onClick={() =>
                !diffused && navigate(`/round3/bomb/${bomb.bombNumber}`)
              }
              className={`relative w-40 h-40 md:w-56 md:h-56 rounded-full border-4 transition-all duration-500 flex items-center justify-center
                ${
                  diffused
                    ? "border-neon-green/40 opacity-60 cursor-not-allowed shadow-[0_0_20px_rgba(57,255,20,0.1)]"
                    : "border-red-600 cursor-pointer shadow-[0_0_40px_rgba(220,38,38,0.4)] hover:shadow-[0_0_60px_rgba(220,38,38,0.6)]"
                }`}
            >
              {/* INNER ANIMATED RINGS */}
              {!diffused && (
                <>
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-2 rounded-full border border-dashed border-red-500/30"
                  />
                  <motion.div 
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-6 rounded-full border border-red-500/10"
                  />
                </>
              )}
              
              <div className={`absolute inset-4 rounded-full border-2 ${diffused ? 'border-neon-green/20' : 'border-red-500/20 animate-pulse'}`} />

              <div className="relative z-10 flex flex-col items-center justify-center font-orbitron">
                <span className={`text-lg md:text-2xl font-bold tracking-tighter ${diffused ? 'text-neon-green/60' : 'text-red-500'}`}>
                  BOMB {bomb.bombNumber}
                </span>

                {diffused ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2 flex flex-col items-center"
                  >
                    <span className="text-neon-green text-[10px] tracking-widest font-mono font-bold">✔ SECURED</span>
                  </motion.div>
                ) : (
                  <div className="mt-2 flex flex-col items-center">
                    <span className="text-[10px] text-red-500/60 tracking-[0.2em] font-mono animate-pulse uppercase">Active</span>
                  </div>
                )}
              </div>

              {/* EXTERNAL GLOW EFFECT */}
              {!diffused && (
                <div className="absolute -inset-1 bg-red-600/10 rounded-full blur-xl animate-pulse" />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* FOOTER STATUS */}
      <div className="absolute bottom-8 w-full flex justify-center gap-12 px-12 pointer-events-none opacity-40">
        <div className="flex flex-col items-center gap-1">
          <div className="text-[10px] font-mono text-neon-cyan uppercase tracking-widest">Global Integrity</div>
          <div className="w-32 h-1 bg-gray-900 rounded-full overflow-hidden border border-neon-cyan/20">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "84%" }}
              className="h-full bg-neon-cyan"
            />
          </div>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="text-[10px] font-mono text-red-500 uppercase tracking-widest">Sector Stability</div>
          <div className="w-32 h-1 bg-gray-900 rounded-full overflow-hidden border border-red-500/20">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "23%" }}
              className="h-full bg-red-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Round3;

