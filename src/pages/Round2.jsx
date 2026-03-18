import React, { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import TerminalCard from "../components/TerminalCard";
import NeonButton from "../components/NeonButton";
import Modal from "../components/Modal";
import { useGame } from "../context/GameContext";
import CyberBackground from "../components/CyberBackground";
import GlitchText from "../components/GlitchText";
import { useNavigate } from "react-router-dom";

const ROUND_TIME = 900;
const QUESTION_TIME = 15;

const Round2 = () => {
  const { gameState, completeRound, setAnaDialogue } = useGame();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const [roundTime, setRoundTime] = useState(ROUND_TIME);
  const [questionTime, setQuestionTime] = useState(QUESTION_TIME);

  const [tokens, setTokens] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [answerStatus, setAnswerStatus] = useState(null);

  const [streak, setStreak] = useState(0);
  const [comboMultiplier, setComboMultiplier] = useState(1);
  const [showBriefing, setShowBriefing] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const activeQuestion = questions[current];

  const isRoundComplete = isFinished || roundTime <= 0;

  useEffect(() => {
    if (isRoundComplete && !showBriefing) {
      completeRound("round2");
      setShowBriefing(true);
      setAnaDialogue("Rapid-fire sequence terminated. Excellent performance. Accessing Black Market data...");
    }
  }, [isRoundComplete, showBriefing, completeRound, setAnaDialogue]);
  useEffect(() => {
    const init = async () => {
      try {
        const res = await fetch(
          "https://blockverse-backend.onrender.com/api/round2/init",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("BLOCKVERSE_TOKEN")}`,
            },
          }
        );

        const json = await res.json();

        if (!res.ok) {
          console.error(json);
          return;
        }

        setQuestions(json.data.questions);
        setTokens(json.data.tokens);
        
        // Ensure the countdown is set to 15 minutes (900s) if the backend returns 0 or null
        const timeFromBackend = Math.floor(json.data.timeRemainingMs / 1000);
        setRoundTime(timeFromBackend > 0 ? timeFromBackend : ROUND_TIME);
      } catch (err) {
        console.error(err);
      }
    };

    init();
  }, []);

  // ================= ROUND TIMER =================
  useEffect(() => {
    const timer = setInterval(() => {
      setRoundTime((t) => (t > 0 ? t - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // ================= QUESTION TIMER =================
  useEffect(() => {
    // Stop the timer if no active question, round time is out, or it's the last question
    if (!activeQuestion || roundTime <= 0 || isFinished) return;

    // Optional: Stop question timer if on last question and round is basically complete
    // but usually we want to let them finish the last question unless time is up.

    setQuestionTime(QUESTION_TIME);

    const timer = setInterval(() => {
      setQuestionTime((t) => {
        if (t <= 1) {
          nextQuestion();
          return QUESTION_TIME;
        }
        return t - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [current, !!activeQuestion, roundTime <= 0, isFinished]);

  // ================= NEXT QUESTION =================
  const nextQuestion = () => {
    setSelectedIndex(null);
    setAnswerStatus(null);

    setCurrent((prev) => {
      if (prev + 1 >= questions.length) {
        setIsFinished(true);
        return prev;
      }
      return prev + 1;
    });
  };

  // ================= SUBMIT ANSWER =================
  const submitAnswer = async () => {
    if (selectedIndex === null || submitting || !activeQuestion) return;

    setSubmitting(true);
    setAnswerStatus(null);

    const payload = {
      questionId: activeQuestion.questionId,
      answer: activeQuestion.options[selectedIndex].trim(),
    };

    try {
      const res = await fetch(
        "https://blockverse-backend.onrender.com/api/round2/submit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("BLOCKVERSE_TOKEN")}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const json = await res.json();
      console.log("Backend Response:", json);

      if (!res.ok) {
        setAnswerStatus("incorrect");
        setTimeout(nextQuestion, 1000);
        return;
      }

      if (json.data.correct) {
        setAnswerStatus("correct");

        setTokens(json.data.totalRound2Score);

        setStreak((s) => s + 1);
        setComboMultiplier((m) => Math.min(m + 0.1, 3));
      } else {
        setAnswerStatus("incorrect");

        setStreak(0);
        setComboMultiplier(1);
      }

      setTimeout(nextQuestion, 1000);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const minutes = String(Math.floor(roundTime / 60)).padStart(2, "0");
  const seconds = String(roundTime % 60).padStart(2, "0");

  if (!activeQuestion) return <div className="p-6 text-white">Loading...</div>;

  return (
    <div className="flex-1 min-h-screen relative p-6 md:p-12 overflow-hidden flex items-center justify-center bg-black">
      <CyberBackground />
      
      {/* ATMOSPHERIC GLOWS */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-cyan/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-gold/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">

        {/* QUESTION AREA - Take 8 cols on large screens */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-8 flex flex-col gap-4"
        >
          <TerminalCard
            title={`ENCRYPTION NODE: ${current + 1}`}
            headerColor="cyan"
            className="h-full border-neon-cyan/40 shadow-[0_0_30px_rgba(0,246,255,0.05)] bg-black/40 backdrop-blur-md"
          >
            <div className="space-y-4 py-2">

              <div className="relative group">
                <div className="absolute -left-4 top-0 bottom-0 w-1 bg-neon-cyan/30 rounded-full group-hover:bg-neon-cyan transition-colors" />
                <p className="text-white font-orbitron text-base md:text-xl leading-relaxed tracking-tight pl-4 drop-shadow-[0_0_10px_rgba(255,255,255,0.1)]">
                  {activeQuestion?.questionText}
                </p>
              </div>

              {/* TIMER BAR */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-mono text-neon-cyan/60 uppercase tracking-widest px-1">
                  <span>Data Link Stability</span>
                  <span>{Math.round((questionTime / QUESTION_TIME) * 100)}%</span>
                </div>
                <div className="relative h-2.5 bg-black/60 border border-neon-cyan/20 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: "100%" }}
                    animate={{ 
                      width: `${(questionTime / QUESTION_TIME) * 100}%`,
                      backgroundColor: questionTime < 5 ? "#ff4444" : "#00f6ff"
                    }}
                    transition={{ duration: 1, ease: "linear" }}
                    className="absolute inset-y-0 left-0 shadow-[0_0_15px_rgba(0,246,255,0.5)]"
                  />
                </div>
              </div>

              {/* OPTIONS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeQuestion?.options?.map((opt, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedIndex(idx)}
                    className={`p-4 border text-left font-mono transition-all duration-300 rounded relative overflow-hidden group
                    ${
                      selectedIndex === idx
                        ? "border-neon-green bg-neon-green/10 text-white shadow-[0_0_25px_rgba(57,255,20,0.2)]"
                        : "border-white/10 hover:border-neon-cyan/60 bg-white/5 text-white/70 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3 relative z-10">
                      <span className={`w-7 h-7 rounded border flex items-center justify-center text-sm font-bold transition-colors
                        ${selectedIndex === idx 
                          ? "border-neon-green bg-neon-green text-black" 
                          : "border-white/20 group-hover:border-neon-cyan/60 text-white/40 group-hover:text-neon-cyan"}`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="text-sm leading-tight">{opt}</span>
                    </div>
                    
                    {/* HOVER GLOW EFFECT */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-neon-cyan/5 to-transparent pointer-events-none" />
                  </motion.button>
                ))}
              </div>

              <div className="relative mt-2">
                <NeonButton
                  onClick={submitAnswer}
                  disabled={selectedIndex === null || submitting || !!answerStatus}
                  className={`w-full py-4 text-lg font-orbitron tracking-[0.3em] shadow-[0_0_30px_rgba(0,246,255,0.15)] transition-all duration-500 ${
                    answerStatus ? "opacity-0 invisible pointer-events-none" : "opacity-100 visible hover:shadow-[0_0_40px_rgba(0,246,255,0.25)]"
                  }`}
                >
                  <span className={answerStatus ? "invisible" : "visible"}>
                    {submitting ? "UPLOADING DATA..." : "AUTHORIZE ACCESS"}
                  </span>
                </NeonButton>

                <AnimatePresence>
                  {answerStatus && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -10 }}
                      className={`absolute inset-0 flex items-center justify-center text-center font-orbitron text-sm md:text-xl tracking-[0.4em] px-4 rounded border-2 z-20 backdrop-blur-md
                        ${
                          answerStatus === "correct"
                            ? "text-neon-green border-neon-green/40 bg-neon-green/10 shadow-[0_0_40px_rgba(57,255,20,0.3)]"
                            : "text-red-500 border-red-500/40 bg-red-500/10 shadow-[0_0_40px_rgba(255,0,0,0.3)]"
                        }`}
                    >
                      <motion.span
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        {answerStatus === "correct"
                          ? "✔ ACCESS GRANTED // TOKEN RECOVERED"
                          : "✖ ACCESS DENIED // SYSTEM RESETTING..."}
                      </motion.span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* SYSTEM LOG PANEL */}
              <div className="mt-4 border-t border-white/5 pt-4">
                <div className="flex items-center justify-between mb-3 px-2">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan shadow-[0_0_5px_#00f6ff]" />
                    <span className="text-neon-cyan/60 text-[10px] tracking-[0.3em] uppercase font-mono">
                      Kernel Log Stream
                    </span>
                  </div>
                  <div className="flex gap-1.5">
                    <div className="w-1 h-1 rounded-full bg-neon-green/40 animate-pulse" />
                    <div className="w-1 h-1 rounded-full bg-neon-cyan/20" />
                    <div className="w-1 h-1 rounded-full bg-neon-cyan/20" />
                  </div>
                </div>
                
                <div className="bg-black/60 rounded border border-white/5 p-4 font-mono text-[10px] leading-relaxed overflow-hidden h-24 relative group">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60 pointer-events-none" />
                  <div className="space-y-1 opacity-60 group-hover:opacity-100 transition-opacity duration-500">
                    <motion.div
                      initial={{ x: -5, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ repeat: Infinity, duration: 3, repeatDelay: 1 }}
                      className="text-neon-cyan/70"
                    >
                      <span className="text-white/20">[09:24:12]</span> REQUESTING_ENCRYPTION_KEY... <span className="text-neon-green">SUCCESS</span>
                    </motion.div>
                    <motion.div
                      initial={{ x: -5, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ repeat: Infinity, duration: 4, delay: 0.5, repeatDelay: 2 }}
                      className="text-neon-cyan/50"
                    >
                      <span className="text-white/20">[09:24:15]</span> NEURAL_LINK_STABLE: LATENCY <span className="text-neon-gold">14ms</span>
                    </motion.div>
                    <motion.div
                      initial={{ x: -5, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ repeat: Infinity, duration: 5, delay: 1.2, repeatDelay: 1.5 }}
                      className="text-neon-green/60"
                    >
                      <span className="text-white/20">[09:24:18]</span> DECRYPTING_NODE_{current + 1}... <span className="animate-pulse">IN_PROGRESS</span>
                    </motion.div>
                    <motion.div
                      initial={{ x: -5, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ repeat: Infinity, duration: 6, delay: 2, repeatDelay: 3 }}
                      className="text-white/30 italic"
                    >
                      <span className="text-white/10">[09:24:22]</span> ANALYZING_TEAM_HEURISTICS_DATA_STREAM...
                    </motion.div>
                  </div>
                  
                  {/* SCANLINE EFFECT */}
                  <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] z-10 bg-[length:100%_4px,4px_100%]" />
                </div>
              </div>

            </div>
          </TerminalCard>

          <div className="flex justify-between items-center px-4 mt-2 font-mono text-white/20 uppercase text-[9px] tracking-[0.5em]">
            <span>Hardware: GEN-4 Neural Interface</span>
            <span className="animate-pulse text-neon-green/40">Link: Optimized</span>
          </div>
        </motion.div>

        {/* SIDEBAR - Take 4 cols on large screens */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-4 flex flex-col gap-6"
        >
          <TerminalCard
            title="SYSTEM STATUS"
            headerColor="gold"
            className="backdrop-blur-xl bg-black/60 border-neon-gold/30 shadow-[0_0_30px_rgba(255,170,0,0.05)]"
          >
            <div className="space-y-8 font-mono">

              <div className="space-y-3">
                <div className="text-neon-gold/40 text-[9px] tracking-[0.4em] uppercase font-bold">Active Protocol</div>
                <div className="flex items-center gap-4 bg-neon-gold/5 p-3 border border-neon-gold/10 rounded-sm">
                  <div className="w-2.5 h-2.5 rounded-full bg-neon-gold animate-pulse shadow-[0_0_15px_#ffaa00]" />
                  <GlitchText text="RAPID FIRE" as="span" size="small" className="text-neon-gold font-bold tracking-widest" />
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-neon-gold/40 text-[9px] tracking-[0.4em] uppercase font-bold">Sequence Progression</div>
                <div className="flex items-end gap-2 text-3xl text-white font-orbitron">
                  <span className="text-neon-gold">{current + 1}</span>
                  <span className="text-white/20 text-lg mb-1">/ {questions.length}</span>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    animate={{ width: `${((current + 1) / questions.length) * 100}%` }}
                    className="h-full bg-neon-gold shadow-[0_0_10px_#ffaa00]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 py-6 border-y border-white/5">
                <div className="space-y-2">
                  <div className="text-neon-gold/40 text-[9px] tracking-[0.3em] uppercase font-bold text-center">Tokens</div>
                  <div className="text-3xl text-neon-green font-orbitron text-center drop-shadow-[0_0_10px_rgba(57,255,20,0.3)]">{tokens}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-neon-gold/40 text-[9px] tracking-[0.3em] uppercase font-bold text-center">Multiplier</div>
                  <div className="text-3xl text-neon-gold font-orbitron text-center drop-shadow-[0_0_10px_rgba(255,170,0,0.3)]">x{comboMultiplier.toFixed(1)}</div>
                </div>
              </div>

              <div className="p-5 bg-neon-gold/5 border border-neon-gold/10 rounded-sm space-y-4">
                <div className="flex justify-between items-center">
                  <div className="text-neon-gold/60 text-[10px] tracking-[0.2em] uppercase font-bold">Streak Bonus</div>
                  <span className="text-neon-gold text-xs font-bold tracking-widest">{streak}/5</span>
                </div>
                <div className="flex gap-2">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="h-2 flex-1 rounded-sm relative overflow-hidden bg-white/5"
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: streak > i ? "100%" : "0%" }}
                        className="absolute inset-0 bg-neon-gold shadow-[0_0_10px_#ffaa00]"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <NeonButton
                className={`mt-4 w-full py-5 font-orbitron tracking-widest transition-all duration-500
                  ${isRoundComplete
                    ? "shadow-[0_0_40px_rgba(255,170,0,0.25)] opacity-100 scale-100"
                    : "opacity-30 grayscale pointer-events-none scale-95"}`}
                onClick={() => navigate("/round2/phase2")}
              >
                PROCEED TO MARKETPLACE →
              </NeonButton>

            </div>
          </TerminalCard>

          <div className="p-5 border border-neon-cyan/10 bg-neon-cyan/5 rounded backdrop-blur-sm text-[10px] font-mono text-neon-cyan/40 uppercase tracking-[0.2em] leading-relaxed">
            <span className="text-neon-cyan/60 font-bold">[!] ADVISORY:</span> Complete the sequence to unlock Phase 2. High streaks maximize token yield for the marketplace.
          </div>
        </motion.div>

      </div>

      <Modal
        isOpen={showBriefing}
        onClose={() => {}}
        title="ANA // SYSTEM AI"
        showClose={false}
        headerColor="cyan"
      >
        <div className="space-y-6">
          <div className="p-4 border border-neon-cyan/30 bg-black/50 font-mono text-neon-cyan">
            Rapid-fire sequence terminated. Excellent performance. 
            <br /><br />
            You have accumulated <span className="text-neon-gold font-bold">{tokens} TOKENS</span>.
            <br /><br />
            System logs indicate you've unlocked a portal to the <b>BLACK MARKET</b>. Here, you can exchange your hard-earned tokens for critical data fragments and system bypasses.
            <br /><br />
            Be cautious. The market is monitored, but it's the only way to gain the upper hand.
          </div>
          <div className="flex justify-end">
            <NeonButton
              onClick={() => {
                setShowBriefing(false);
                navigate("/round2/phase2");
              }}
            >
              ENTER BLACK MARKET &gt;&gt;
            </NeonButton>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default Round2;