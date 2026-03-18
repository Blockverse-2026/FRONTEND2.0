import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GlitchText from "../components/GlitchText";
import CyberBackground from "../components/CyberBackground";
import Modal from "../components/Modal";
import NeonButton from "../components/NeonButton";

const API = "https://blockverse-backend.onrender.com";

const Round3 = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [showBriefing, setShowBriefing] = useState(false);
  const [selectedBomb, setSelectedBomb] = useState(null);

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

  const totalMistakes = data.bombs.reduce((sum, b) => sum + (b.mistakes || 0), 0);
  const allDiffused = data.bombs.every(b => b.questions.every(q => q.solved));
  const isGameOver = totalMistakes >= 20;

  const handleBombClick = (bomb) => {
    const diffused = bomb.questions.every((q) => q.solved);
    if (diffused || isGameOver) return;

    if (bomb.bombNumber === 1 && !localStorage.getItem("round3_briefing_seen")) {
      setSelectedBomb(bomb);
      setShowBriefing(true);
    } else {
      navigate(`/round3/bomb/${bomb.bombNumber}`);
    }
  };

  const startBomb = () => {
    localStorage.setItem("round3_briefing_seen", "true");
    setShowBriefing(false);
    if (selectedBomb) {
      navigate(`/round3/bomb/${selectedBomb.bombNumber}`);
    }
  };

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
          text={isGameOver ? "SYSTEM TERMINATED" : allDiffused ? "MISSION ACCOMPLISHED" : "BOMB DIFFUSION"} 
          className={isGameOver ? "text-red-700" : allDiffused ? "text-neon-green" : "text-red-500"} 
        />
        <div className="mt-2 text-red-500/60 font-mono text-[10px] tracking-[0.8em] uppercase">
          {isGameOver ? "TOTAL INTEGRITY FAILURE" : allDiffused ? "CORE STABILITY SECURED" : "Sector 7 // Core Stability: Critical"}
        </div>
      </motion.div>

      {/* MISTAKE COUNTER */}
      <div className="absolute top-32 md:top-44 z-10 flex flex-col items-center">
        <div className="text-[10px] font-mono text-red-500/60 uppercase tracking-[0.4em] mb-2">Total Integrity Breaches</div>
        <div className="flex gap-2">
          {Array.from({ length: 20 }).map((_, i) => (
            <div 
              key={i} 
              className={`w-2 h-4 border ${i < totalMistakes ? 'bg-red-600 border-red-400' : 'bg-transparent border-red-900/30'}`}
            />
          ))}
        </div>
        <div className="mt-2 font-orbitron text-red-500 text-sm tracking-widest">
          {totalMistakes} / 20 MISTAKES
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-10 md:gap-24 relative z-10 mt-20">
        {data.bombs.map((bomb, idx) => {
          const diffused = bomb.questions.every((q) => q.solved);

          return (
            <motion.div
              key={bomb.bombNumber}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: idx * 0.15 }}
              whileHover={!diffused && !isGameOver ? { scale: 1.05 } : {}}
              onClick={() => handleBombClick(bomb)}
              className={`relative w-40 h-40 md:w-56 md:h-56 rounded-full border-4 transition-all duration-500 flex items-center justify-center
                ${
                  diffused
                    ? "border-neon-green/40 opacity-60 cursor-not-allowed shadow-[0_0_20px_rgba(57,255,20,0.1)]"
                    : isGameOver 
                    ? "border-gray-800 opacity-40 cursor-not-allowed"
                    : "border-red-600 cursor-pointer shadow-[0_0_40px_rgba(220,38,38,0.4)] hover:shadow-[0_0_60px_rgba(220,38,38,0.6)]"
                }`}
            >
              {/* INNER ANIMATED RINGS */}
              {!diffused && !isGameOver && (
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
              
              <div className={`absolute inset-4 rounded-full border-2 ${diffused ? 'border-neon-green/20' : isGameOver ? 'border-gray-800' : 'border-red-500/20 animate-pulse'}`} />

              <div className="relative z-10 flex flex-col items-center justify-center font-orbitron">
                <span className={`text-lg md:text-2xl font-bold tracking-tighter ${diffused ? 'text-neon-green/60' : isGameOver ? 'text-gray-600' : 'text-red-500'}`}>
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
                ) : isGameOver ? (
                  <span className="text-[10px] text-gray-600 tracking-[0.2em] font-mono uppercase">Offline</span>
                ) : (
                  <div className="mt-2 flex flex-col items-center">
                    <span className="text-[10px] text-red-500/60 tracking-[0.2em] font-mono animate-pulse uppercase">Active</span>
                  </div>
                )}
              </div>

              {/* EXTERNAL GLOW EFFECT */}
              {!diffused && !isGameOver && (
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
              animate={{ width: isGameOver ? "0%" : allDiffused ? "100%" : "84%" }}
              className="h-full bg-neon-cyan"
            />
          </div>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="text-[10px] font-mono text-red-500 uppercase tracking-widest">Sector Stability</div>
          <div className="w-32 h-1 bg-gray-900 rounded-full overflow-hidden border border-red-500/20">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: isGameOver ? "100%" : allDiffused ? "0%" : "23%" }}
              className="h-full bg-red-500"
            />
          </div>
        </div>
      </div>

      {/* BRIEFING MODAL */}
      <Modal
        isOpen={showBriefing}
        onClose={() => setShowBriefing(false)}
        title="ANA // MISSION BRIEFING"
        headerColor="cyan"
      >
        <div className="space-y-6">
          <div className="p-4 border border-neon-cyan/30 bg-black/50 font-mono text-neon-cyan text-sm leading-relaxed">
            <p className="mb-4 text-white font-bold tracking-widest border-b border-neon-cyan/20 pb-2">CRITICAL MISSION PARAMETERS:</p>
            <ul className="space-y-3">
              <li className="flex gap-2">
                <span className="text-neon-gold">&gt;</span>
                <span>There are <span className="text-white font-bold">3 BOMBS</span> detected in this sector.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-neon-gold">&gt;</span>
                <span>Each bomb requires <span className="text-white font-bold">5 DATA REPAIRS</span> (questions) to diffuse.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-neon-gold">&gt;</span>
                <span>System Integrity allows for a maximum of <span className="text-red-500 font-bold underline">20 TOTAL MISTAKES</span> across all bombs.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-neon-gold">&gt;</span>
                <span>Exceeding this threshold will trigger a <span className="text-red-500 font-bold uppercase">Total System Collapse</span>.</span>
              </li>
            </ul>
            <p className="mt-6 italic text-neon-cyan/60 border-t border-neon-cyan/10 pt-4 text-xs">
              "Diffuse all cores before the breaches become irreversible. The clock is ticking."
            </p>
          </div>
          <div className="flex justify-end">
            <NeonButton onClick={startBomb}>
              INITIALIZE DIFFUSION &gt;&gt;
            </NeonButton>
          </div>
        </div>
      </Modal>

      {/* GAME OVER MODAL */}
      <Modal
        isOpen={isGameOver}
        onClose={() => {}}
        title="SYSTEM TERMINATED"
        showClose={false}
        headerColor="gold"
      >
        <div className="space-y-6 text-center">
          <div className="p-6 border border-red-500/30 bg-red-950/20 font-mono text-red-500">
            <h3 className="text-2xl font-bold mb-4 animate-glitch">CRITICAL FAILURE</h3>
            <p className="mb-4">Total Integrity Breaches: <span className="text-white font-bold">{totalMistakes}</span></p>
            <p className="text-sm opacity-80">The system has collapsed. All data fragments lost. Access to Sector 7 is now permanently disabled.</p>
          </div>
          <NeonButton variant="danger" onClick={() => navigate("/dashboard")}>
            EXIT TO DASHBOARD
          </NeonButton>
        </div>
      </Modal>

      {/* WIN MODAL */}
      <Modal
        isOpen={allDiffused}
        onClose={() => {}}
        title="MISSION SUCCESS"
        showClose={false}
        headerColor="cyan"
      >
        <div className="space-y-6 text-center">
          <div className="p-6 border border-neon-green/30 bg-neon-green/10 font-mono text-neon-green">
            <h3 className="text-2xl font-bold mb-4">SECTOR SECURED</h3>
            <p className="mb-4">You successfully diffused all bombs with <span className="text-white font-bold">{20 - totalMistakes}</span> integrity points to spare.</p>
            <p className="text-sm opacity-80">You have saved the network. Proceed to the final extraction point.</p>
          </div>
          <NeonButton onClick={() => navigate("/panel/final")}>
            FINAL EXTRACTION &gt;&gt;
          </NeonButton>
        </div>
      </Modal>

    </div>
  );
};

export default Round3;

