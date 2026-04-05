import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GlitchText from "../components/GlitchText";
import NeonButton from "../components/NeonButton";
import CyberBackground from "../components/CyberBackground";
import { Lock, HelpCircle } from "lucide-react";
import { useGame } from "../context/GameContext";

const Round3Bomb = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { gameState } = useGame();

  const [data, setData] = useState(null);
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showClues, setShowClues] = useState(false);

  // ---------------- INIT ----------------
  const initRound = () => {
    const token = localStorage.getItem("BLOCKVERSE_TOKEN");

    fetch(`https://brl.akgec.ac.in/blockverse-26/api/round3/init`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Init error:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    initRound();
  }, []);

  // ---------------- LOADING ----------------
  if (loading || !data) {
    return (
      <div className="flex-1 flex items-center justify-center text-cyan-400 font-mono">
        Initializing core…
      </div>
    );
  }

  // ---------------- FIND BOMB ----------------
  const bomb = data.bombs.find(
    (b) => String(b.bombNumber) === String(id)
  );

  if (!bomb) {
    return (
      <div className="flex-1 flex items-center justify-center text-red-400">
        Bomb not found
      </div>
    );
  }

  // ---------------- LOCK LOGIC ----------------
  const bombId = Number(id);

  if (bombId > 1) {
    const previousBomb = data.bombs.find(
      (b) => b.bombNumber === bombId - 1
    );

    const previousIncomplete = previousBomb?.questions.some(
      (q) => !q.solved
    );

    if (previousIncomplete) {
      return (
        <div className="h-screen w-full flex flex-col items-center justify-center gap-8 relative overflow-hidden bg-black p-6">
          <CyberBackground />
          
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center z-10"
          >
            <GlitchText
              text={`BOMB ${bombId} LOCKED`}
              className="text-red-500 drop-shadow-[0_0_15px_rgba(255,0,0,0.5)]"
            />
            <div className="mt-4 text-red-500/60 font-mono text-sm tracking-[0.3em] uppercase">
              ACCESS DENIED // SECURITY PROTOCOL ACTIVE
            </div>
          </motion.div>

          <div className="text-cyan-300 font-mono text-center max-w-md z-10 bg-black/40 p-4 border border-cyan-500/20 backdrop-blur-sm">
            Multiple integrity breaches detected. 
            <br />
            You must diffuse <span className="text-white font-bold underline decoration-red-500/50 uppercase tracking-widest px-1">Bomb {bombId - 1}</span> before attempting to access this core.
          </div>

          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="relative w-48 h-48 rounded-full border-4 border-red-600 shadow-[0_0_60px_rgba(220,38,38,0.3)] flex items-center justify-center z-10"
          >
            <div className="absolute inset-4 rounded-full border-2 border-red-500/20 animate-pulse" />
            <div className="absolute inset-0 bg-red-600/5 rounded-full" />
            <Lock size={64} className="text-red-500 drop-shadow-[0_0_10px_rgba(255,0,0,0.5)]" />
          </motion.div>

          <NeonButton
            onClick={() => navigate(`/round3/bomb/${bombId - 1}`)}
            className="z-10 px-10 py-4 font-orbitron"
          >
            ACCESS BOMB {bombId - 1}
          </NeonButton>
        </div>
      );
    }
  }

  // ---------------- CURRENT QUESTION ----------------
  const current = bomb.questions.find((q) => !q.solved);

  // ---------------- DIFFUSED ----------------
  if (!current) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center gap-8 relative overflow-hidden bg-black p-6">
        <CyberBackground />
        
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center z-10"
        >
          <div className="text-neon-green text-6xl mb-4 flex justify-center">
            <motion.div
              animate={{ rotateY: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              ✔
            </motion.div>
          </div>
          <GlitchText
            text={`BOMB ${id} DIFFUSED`}
            className="text-neon-green drop-shadow-[0_0_15px_rgba(57,255,20,0.5)]"
          />
          <div className="mt-4 text-neon-green/60 font-mono text-sm tracking-[0.3em] uppercase">
            Threat neutralized // Sector Secured
          </div>
        </motion.div>

        <div className="text-cyan-300 font-mono text-center max-w-md z-10 bg-black/40 p-4 border border-neon-green/20 backdrop-blur-sm">
          Core stability restored. 
          <br />
          System logs updated. Proceed to the next objective.
        </div>

        <NeonButton 
          onClick={() => navigate("/round3")}
          className="z-10 px-10 py-4 font-orbitron shadow-[0_0_20px_rgba(57,255,20,0.2)]"
        >
          RETURN TO HUB
        </NeonButton>
      </div>
    );
  }

  // ---------------- PARSE OPTIONS ----------------
  const letters = ["A", "B", "C", "D"];

  const optionRegex = /[A-D]\.\s*(.*)/g;
  const matches = [...current.questionText.matchAll(optionRegex)];

  const options =
    matches.length === 4
      ? matches.map((m) => m[1])
      : current.options?.length === 4
      ? current.options
      : ["Option A", "Option B", "Option C", "Option D"];

  const questionLine =
    current.questionText
      .split("\n")
      .find((l) => l.toLowerCase().includes("q")) ||
    current.questionText;

  // ---------------- SUBMIT ----------------
  const submitAnswer = () => {
    if (!selected) return;

    setSubmitting(true);
    const token = localStorage.getItem("BLOCKVERSE_TOKEN");

    fetch(`https://brl.akgec.ac.in/blockverse-26/api/round3/submit`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bombNumber: bombId,
        questionNumber: current.questionNumber,
        answer: selected,
      }),
    })
      .then(() => {
        setSelected("");
        initRound();
        setSubmitting(false);
      })
      .catch((err) => {
        console.error("Submit error:", err);
        setSubmitting(false);
      });
  };

  // ---------------- UI ----------------
  return (
    <div className="h-screen w-full p-4 md:p-8 flex flex-col items-center justify-center gap-4 md:gap-6 text-white overflow-hidden relative">
      <GlitchText
        text={`BOMB ${id} — CORE DIFFUSION`}
        className="text-red-500 text-3xl md:text-5xl font-bold tracking-tighter"
      />

      {/* CLUES PANEL */}
      <div 
        className="absolute bottom-24 right-6 z-50"
        onMouseEnter={() => setShowClues(true)}
        onMouseLeave={() => setShowClues(false)}
      >
        <div className="flex items-center gap-3 text-cyan-400/80 hover:text-cyan-400 transition-colors cursor-pointer bg-black/50 p-3 rounded-lg border-2 border-cyan-400/30 hover:border-cyan-400/60 shadow-[0_0_20px_rgba(0,246,255,0.1)] hover:shadow-[0_0_30px_rgba(0,246,255,0.2)]">
          <HelpCircle size={20} />
          <span className="text-sm font-orbitron font-bold tracking-widest uppercase">VIEW CLUES</span>
        </div>

        <AnimatePresence>
          {showClues && (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute bottom-full mb-3 right-0 w-96 bg-black/90 border-2 border-neon-cyan/30 rounded-lg p-5 shadow-lg backdrop-blur-xl z-50"
            >
              <h3 className="font-orbitron text-neon-cyan text-lg border-b-2 border-neon-cyan/20 pb-3 mb-4">ACQUIRED INTEL</h3>
              {gameState.fragments.length > 0 ? (
                <ul className="space-y-4 text-sm font-mono text-white/80">
                  {gameState.fragments.map((fragment, i) => (
                    <li key={i} className="border-l-4 border-neon-cyan/40 pl-4 leading-relaxed">
                      <div className="text-neon-cyan text-[10px] uppercase mb-1">
                        {typeof fragment === 'string' ? 'System Data' : (fragment.title || 'Intel Fragment')}
                      </div>
                      {typeof fragment === 'string' ? fragment : fragment.data}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm font-mono text-white/50 italic">No data fragments acquired from the Black Market.</p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* CORE */}
      <motion.div
        animate={{ 
          rotate: 360,
          scale: [1, 1.05, 1]
        }}
        transition={{ 
          rotate: { repeat: Infinity, duration: 20, ease: "linear" },
          scale: { repeat: Infinity, duration: 2, ease: "easeInOut" }
        }}
        className="relative w-40 h-40 md:w-56 md:h-56 rounded-full border-4 border-red-500 shadow-[0_0_60px_rgba(255,0,0,0.7)] flex items-center justify-center"
      >
        <div className="absolute inset-4 rounded-full border-2 border-red-500/40 animate-pulse" />
        <div className="absolute inset-8 rounded-full border border-red-500/20" />
        <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-red-600 to-red-900 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)]" />
      </motion.div>

      {/* QUESTION */}
      <div className="max-w-4xl w-full text-center space-y-2">
        <div className="text-neon-cyan font-mono text-sm tracking-[0.3em] uppercase">
          Sequence: {current.questionNumber} / {bomb.questions.length}
        </div>

        <div className="text-white font-mono text-sm md:text-base leading-relaxed px-4 py-2 border border-white/10 bg-white/5 rounded backdrop-blur-sm min-h-[4rem] flex items-center justify-center">
          {questionLine}
        </div>
      </div>

      {/* OPTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 w-full max-w-4xl px-4">
        {options.map((opt, i) => {
          const letter = letters[i];

          return (
            <button
              key={i}
              onClick={() => setSelected(letter)}
              className={`px-4 py-3 md:px-6 md:py-4 border font-mono transition-all duration-300 rounded relative overflow-hidden group
                ${
                  selected === letter
                    ? "border-neon-green bg-neon-green/20 text-neon-green shadow-[0_0_20px_rgba(57,255,20,0.2)]"
                    : "border-neon-cyan/40 text-neon-cyan/70 hover:border-neon-cyan hover:bg-neon-cyan/10 hover:text-neon-cyan"
                }`}
            >
              <div className="flex items-center gap-4 relative z-10">
                <span className={`w-8 h-8 rounded border flex items-center justify-center text-xs font-bold
                  ${selected === letter ? "border-neon-green bg-neon-green text-black" : "border-current"}`}>
                  {letter}
                </span>
                <span className="text-xs md:text-sm">{opt}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* SUBMIT & STATUS */}
      <div className="flex flex-col items-center gap-4 w-full">
          <NeonButton
            onClick={submitAnswer}
            disabled={!selected || submitting}
            className="w-full max-w-xs py-4"
          >
            {submitting ? "VERIFYING DATA..." : "INITIATE DIFFUSION"}
          </NeonButton>

          <div className="flex items-center gap-4 text-[10px] font-mono tracking-widest uppercase">
            <span className="text-red-500/60">Integrity Breach:</span>
            <span className="text-red-500 font-bold px-2 py-0.5 border border-red-500/20 bg-red-500/10 rounded">
              {bomb.mistakes} MISTAKES
            </span>
          </div>
        </div>
    </div>
  );
};

export default Round3Bomb;