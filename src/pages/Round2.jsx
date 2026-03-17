import React, { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { motion as Motion } from "framer-motion";
import TerminalCard from "../components/TerminalCard";
import NeonButton from "../components/NeonButton";
import { useGame } from "../context/GameContext";
import CyberBackground from "../components/CyberBackground";
import GlitchText from "../components/GlitchText";
import { useNavigate } from "react-router-dom";

const ROUND_TIME = 900;
const QUESTION_TIME = 15;

const Round2 = () => {
  const { gameState } = useGame();
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

  const activeQuestion = questions[current];

  // ================= INIT ROUND =================
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
    if (!activeQuestion) return;

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
  }, [current]);

  // ================= NEXT QUESTION =================
  const nextQuestion = () => {
    setSelectedIndex(null);
    setAnswerStatus(null);

    setCurrent((prev) => {
      if (prev + 1 >= questions.length) return prev;
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

  const isRoundComplete = current + 1 >= questions.length || roundTime <= 0;

  if (!activeQuestion) return <div className="p-6 text-white">Loading...</div>;

  return (
    <Motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 min-h-screen relative p-6 md:p-12 overflow-hidden flex items-center justify-center"
    >
      <CyberBackground />

      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">

        {/* QUESTION AREA - Take 8 cols on large screens */}
        <Motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-8 flex flex-col gap-4"
        >
          <TerminalCard
            title={`QUESTION ${current + 1}`}
            headerColor="cyan"
            className="h-full border-neon-cyan/40 shadow-[0_0_20px_rgba(0,246,255,0.1)]"
          >
            <div className="space-y-8">

              <p className="text-neon-cyan font-orbitron text-xl md:text-2xl leading-relaxed">
                {activeQuestion.questionText}
              </p>

              {/* TIMER BAR */}
              <div className="relative h-3 bg-black/60 border border-neon-cyan/30 rounded-full overflow-hidden">
                <Motion.div
                  initial={{ width: "100%" }}
                  animate={{ width: `${(questionTime / QUESTION_TIME) * 100}%` }}
                  transition={{ duration: 1, ease: "linear" }}
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-neon-cyan/50 to-neon-cyan shadow-[0_0_15px_rgba(0,246,255,0.5)]"
                />
              </div>

              {/* OPTIONS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeQuestion.options.map((opt, idx) => (
                  <Motion.button
                    key={idx}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedIndex(idx)}
                    className={`p-4 border text-left font-mono transition-all duration-300 rounded-lg group relative overflow-hidden
                    ${
                      selectedIndex === idx
                        ? "border-neon-green bg-neon-green/20 text-white shadow-[0_0_15px_rgba(57,255,20,0.3)]"
                        : "border-neon-cyan/40 hover:border-neon-cyan hover:bg-neon-cyan/5 text-neon-cyan/80 hover:text-neon-cyan"
                    }`}
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs
                        ${selectedIndex === idx ? "border-white bg-white text-black" : "border-current"}`}>
                        {String.fromCharCode(65 + idx)}
                      </span>
                      {opt}
                    </span>
                    {selectedIndex === idx && (
                      <Motion.div
                        layoutId="activeOption"
                        className="absolute inset-0 bg-neon-green/10"
                      />
                    )}
                  </Motion.button>
                ))}
              </div>

              {answerStatus && (
                <Motion.div
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className={`text-center font-orbitron text-lg tracking-widest p-4 rounded border
                    ${
                      answerStatus === "correct"
                        ? "text-neon-green border-neon-green/30 bg-neon-green/5 shadow-[0_0_20px_rgba(57,255,20,0.1)]"
                        : "text-red-500 border-red-500/30 bg-red-500/5 shadow-[0_0_20px_rgba(255,0,0,0.1)]"
                    }`}
                >
                  {answerStatus === "correct"
                    ? "✔ ACCESS GRANTED - TOKEN RECOVERED"
                    : "✖ ACCESS DENIED - SYSTEM STABILIZING..."}
                </Motion.div>
              )}

              <NeonButton
                onClick={submitAnswer}
                disabled={selectedIndex === null || submitting}
                className="w-full py-4 text-lg font-orbitron tracking-[0.2em] shadow-[0_0_20px_rgba(0,246,255,0.2)]"
              >
                {submitting ? "UPLOADING DATA..." : "LOCK ANSWER"}
              </NeonButton>

              {/* SYSTEM LOG PANEL */}
              <div className="mt-8 border-t border-neon-cyan/20 pt-6">
                <div className="flex items-center justify-between mb-3 px-2">
                  <span className="text-neon-cyan/60 text-[10px] tracking-[0.2em] uppercase font-mono">
                    System Log Stream
                  </span>
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
                    <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan/40" />
                    <div className="w-1.5 h-1.5 rounded-full bg-neon-cyan/40" />
                  </div>
                </div>
                
                <div className="bg-black/40 rounded border border-neon-cyan/10 p-4 font-mono text-[11px] leading-relaxed overflow-hidden h-32 relative group">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40 pointer-events-none" />
                  <div className="space-y-1.5">
                    <Motion.div
                      initial={{ x: -5, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ repeat: Infinity, duration: 3, repeatDelay: 1 }}
                      className="text-neon-cyan/70"
                    >
                      <span className="text-neon-cyan/40">[09:24:12]</span> REQUESTING_ENCRYPTION_KEY... SUCCESS
                    </Motion.div>
                    <Motion.div
                      initial={{ x: -5, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ repeat: Infinity, duration: 4, delay: 0.5, repeatDelay: 2 }}
                      className="text-neon-cyan/50"
                    >
                      <span className="text-neon-cyan/30">[09:24:15]</span> NEURAL_LINK_STABLE: LATENCY 14ms
                    </Motion.div>
                    <Motion.div
                      initial={{ x: -5, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ repeat: Infinity, duration: 5, delay: 1.2, repeatDelay: 1.5 }}
                      className="text-neon-green/60"
                    >
                      <span className="text-neon-green/30">[09:24:18]</span> DECRYPTING_SEQUENCE_NODE_{current + 1}... IN_PROGRESS
                    </Motion.div>
                    <Motion.div
                      initial={{ x: -5, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ repeat: Infinity, duration: 6, delay: 2, repeatDelay: 3 }}
                      className="text-neon-cyan/40 italic"
                    >
                      <span className="text-neon-cyan/20">[09:24:22]</span> ANALYZING_TEAM_HEURISTICS...
                    </Motion.div>
                  </div>
                  
                  {/* SCANLINE EFFECT */}
                  <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%]" />
                </div>
              </div>

            </div>
          </TerminalCard>

          <div className="flex justify-between items-center px-4 font-mono text-neon-cyan/60 uppercase text-xs tracking-widest">
            <span>SEQUENCE {current + 1} / {questions.length}</span>
            <span className="animate-pulse">SYSTEM STABLE // PHASE 1</span>
          </div>
        </Motion.div>

        {/* SIDEBAR - Take 4 cols on large screens */}
        <Motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-4"
        >
          <TerminalCard
            title="SYSTEM STATUS"
            headerColor="gold"
            className="backdrop-blur-xl bg-black/60 border-neon-gold/40 shadow-[0_0_20px_rgba(255,170,0,0.1)]"
          >
            <div className="space-y-6 font-mono">

              <div className="space-y-2">
                <div className="text-neon-gold/60 text-[10px] tracking-[0.3em] uppercase">Protocol</div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-neon-gold animate-pulse shadow-[0_0_10px_#ffaa00]" />
                  <GlitchText text="RAPID FIRE" as="span" size="small" className="text-neon-gold font-bold" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-neon-gold/60 text-[10px] tracking-[0.3em] uppercase">Time Remaining</div>
                <div className="flex items-center gap-3 text-2xl text-neon-gold font-orbitron">
                  <Clock size={20} className="text-neon-gold" />
                  <span>{minutes}:{seconds}</span>
                </div>
                {/* ROUND PROGRESS BAR */}
                <div className="h-1.5 bg-black/60 border border-neon-gold/20 rounded-full overflow-hidden mt-2">
                  <Motion.div
                    animate={{ width: `${(roundTime / ROUND_TIME) * 100}%` }}
                    className="h-full bg-neon-gold/80"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-y border-neon-gold/20">
                <div className="space-y-1">
                  <div className="text-neon-gold/60 text-[10px] tracking-[0.1em] uppercase">Tokens</div>
                  <div className="text-xl text-neon-green font-orbitron">{tokens}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-neon-gold/60 text-[10px] tracking-[0.1em] uppercase">Streak</div>
                  <div className="text-xl text-neon-gold font-orbitron">x{comboMultiplier.toFixed(1)}</div>
                </div>
              </div>

              <div className="p-4 bg-neon-gold/5 border border-neon-gold/10 rounded space-y-2">
                <div className="text-neon-gold/60 text-[10px] tracking-[0.1em] uppercase">Combo Multiplier</div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-1.5 flex-1 rounded-full transition-colors duration-500
                        ${streak > i ? "bg-neon-gold shadow-[0_0_5px_#ffaa00]" : "bg-white/5"}`}
                    />
                  ))}
                </div>
              </div>

              <NeonButton
                className={`mt-4 w-full py-4 font-orbitron transition-all duration-500
                  ${isRoundComplete
                    ? "shadow-[0_0_30px_rgba(255,170,0,0.3)] opacity-100"
                    : "opacity-40 grayscale pointer-events-none"}`}
                onClick={() => navigate("/round3")}
              >
                PROCEED TO PHASE 2 →
              </NeonButton>

            </div>
          </TerminalCard>

          <div className="mt-6 p-4 border border-neon-cyan/20 bg-neon-cyan/5 rounded-lg text-[10px] font-mono text-neon-cyan/40 uppercase tracking-widest leading-relaxed">
            [SYS_LOG]: Questions must be completed before phase transition. Maintain high streak for maximum token generation.
          </div>
        </Motion.div>

      </div>
    </Motion.div>
  );
};

export default Round2;