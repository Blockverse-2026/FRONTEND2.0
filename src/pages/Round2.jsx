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
        setRoundTime(Math.floor(json.data.timeRemainingMs / 1000));
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
      className="flex-1 pt-6 px-6 flex gap-6 relative"
    >
      <CyberBackground />

      <div className="flex-1 grid grid-cols-[1fr_auto] gap-8 items-start">

        {/* QUESTION AREA */}
        <div className="flex-1 max-w-3xl mx-auto">
          <TerminalCard
            title={`QUESTION ${current + 1}`}
            headerColor="cyan"
            className="w-full"
          >
            <div className="space-y-6">

              <p className="text-neon-cyan font-mono text-lg">
                {activeQuestion.questionText}
              </p>

              {/* TIMER BAR */}
              <div className="h-2 bg-black border border-neon-cyan">
                <div
                  className="h-full bg-neon-cyan"
                  style={{ width: `${(questionTime / QUESTION_TIME) * 100}%` }}
                />
              </div>

              {/* OPTIONS */}
              <div className="space-y-3">
                {activeQuestion.options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedIndex(idx)}
                    className={`w-full p-3 border text-left font-mono transition
                    ${
                      selectedIndex === idx
                        ? "border-neon-green bg-neon-green/10"
                        : "border-neon-cyan"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              {answerStatus && (
                <div
                  className={`text-center font-mono mt-2 ${
                    answerStatus === "correct"
                      ? "text-neon-green"
                      : "text-red-500"
                  }`}
                >
                  {answerStatus === "correct"
                    ? "✔ CORRECT - TOKEN AWARDED"
                    : "✖ INCORRECT"}
                </div>
              )}

              <NeonButton
                onClick={submitAnswer}
                disabled={selectedIndex === null || submitting}
                className="w-full"
              >
                {submitting ? "SUBMITTING..." : "LOCK ANSWER"}
              </NeonButton>

            </div>
          </TerminalCard>

          <div className="text-center text-neon-cyan font-mono mt-2">
            Question {current + 1} / {questions.length}
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="w-80">
          <TerminalCard
            title="ROUND 2 STATUS"
            headerColor="gold"
            className="backdrop-blur-md bg-black/40 border-neon-cyan/60"
          >
            <div className="space-y-4 font-mono text-sm">

              <div className="text-neon-cyan flex items-center gap-2">
                <span>ROUND:</span>
                <GlitchText text="RAPID FIRE" as="span" size="small" />
              </div>

              <div className="flex items-center gap-2 text-neon-cyan">
                <Clock size={14} />
                <span>
                  TIME LEFT: {minutes}:{seconds}
                </span>
              </div>

              <div className="h-2 bg-black/40 border border-neon-cyan/40">
                <div
                  className="h-full bg-neon-cyan"
                  style={{ width: (roundTime / ROUND_TIME) * 100 + "%" }}
                />
              </div>

              <div className="text-neon-green">
                TOKENS: {tokens} • Streak: {streak} • Combo x
                {comboMultiplier.toFixed(1)}
              </div>

              <NeonButton
                className="mt-4 w-full"
                onClick={() => navigate("/panel/round3")}
                disabled={!isRoundComplete}
              >
                PROCEED TO ROUND 3 →
              </NeonButton>

            </div>
          </TerminalCard>
        </div>

      </div>
    </Motion.div>
  );
};

export default Round2;