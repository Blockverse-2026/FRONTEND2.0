import React, { useEffect, useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { Activity, ChevronLeft, ChevronRight } from "lucide-react";
import TerminalCard from "../components/TerminalCard";
import NeonButton from "../components/NeonButton";
import { useNavigate } from "react-router-dom";

const TOTAL_NODES = 20;

const Round2Phase1 = () => {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [nodes, setNodes] = useState(
    Array.from({ length: TOTAL_NODES }, (_, i) => ({
      id: i,
      status: "locked", 
    }))
  );

  const [tokens, setTokens] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const savedNodes = localStorage.getItem("round2_phase1_nodes");
    const savedTokens = localStorage.getItem("round2_phase1_tokens");

    if (savedNodes) setNodes(JSON.parse(savedNodes));
    if (savedTokens) setTokens(parseInt(savedTokens));
  }, []);

  useEffect(() => {
    localStorage.setItem("round2_phase1_nodes", JSON.stringify(nodes));
  }, [nodes]);

  useEffect(() => {
    localStorage.setItem("round2_phase1_tokens", tokens.toString());
  }, [tokens]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem("BLOCKVERSE_TOKEN");
        const res = await fetch(
          "https://blockverse-backend.onrender.com/api/round2/phase1/questions",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const json = await res.json();
        if (!res.ok || !json?.data?.questions)
          throw new Error("Failed to load questions");

        setQuestions(json.data.questions.sort((a, b) => a.order - b.order));
      } catch (err) {
        setError(err.message);
      }
    };

    fetchQuestions();
  }, []);

  const submitAnswer = async () => {
    if (
      !userAnswer.trim() ||
      submitting ||
      nodes[currentIndex].status !== "locked"
    )
      return;

    setSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch(
        "https://blockverse-backend.onrender.com/api/round2/phase1/submit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("BLOCKVERSE_TOKEN")}`,
          },
          body: JSON.stringify({
            questionId: questions[currentIndex].questionId,
            answer: userAnswer.trim(),
          }),
        }
      );

      const json = await res.json();

      const isCorrect =
        res.ok &&
        (json.message === "Correct answer" ||
          json.message === "Already solved" ||
          json.success === true);

      setNodes((prev) => {
        const copy = [...prev];
        copy[currentIndex].status = isCorrect ? "unlocked" : "blocked";
        return copy;
      });

      if (isCorrect) {
        setFeedback("correct");
        setTokens((prev) => prev + 1); 
      } else {
        setFeedback("incorrect");
      }

      setTimeout(() => {
        if (currentIndex < TOTAL_NODES - 1) {
          setCurrentIndex((i) => i + 1);
          setUserAnswer("");
          setFeedback(null);
        }
      }, 700);
    } catch {
      setFeedback("error");
    } finally {
      setSubmitting(false);
    }
  };
  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setUserAnswer("");
      setFeedback(null);
    }
  };

  const goNext = () => {
    if (currentIndex < TOTAL_NODES - 1) {
      setCurrentIndex((i) => i + 1);
      setUserAnswer("");
      setFeedback(null);
    }
  };

  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!questions.length) return null;

  const solved = nodes.filter((n) => n.status === "unlocked").length;
  const progress = ((currentIndex + 1) / TOTAL_NODES) * 100;
  const isLocked = nodes[currentIndex].status !== "locked";

  return (
    <div className="flex-1 pt-12 px-6 flex gap-8">
      {/* QUESTION AREA */}
      <div className="flex-1 flex justify-center">
        <AnimatePresence mode="wait">
          <Motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-4xl"
          >
            <TerminalCard title="TECH KNOWLEDGE BASE">
              {/* PROGRESS */}
              <div className="flex items-center gap-4 mb-6 font-mono text-sm text-neon-cyan/70">
                <span>
                  Q {currentIndex + 1}/{TOTAL_NODES}
                </span>
                <div className="flex-1 h-1 bg-gray-800 rounded">
                  <Motion.div
                    className="h-full bg-neon-cyan"
                    animate={{ width: `${progress}%` }}
                  />
                </div>
                <Activity size={16} />
              </div>

              {/* QUESTION */}
              <h3 className="text-2xl font-orbitron text-white text-center mb-8">
                {questions[currentIndex].question}
              </h3>

              {/* INPUT */}
              <input
                type="text"
                value={userAnswer}
                disabled={isLocked}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Enter your answer..."
                className={`w-full p-4 bg-black border-2 font-mono text-white
                  ${
                    isLocked
                      ? "border-gray-700 opacity-50"
                      : "border-neon-cyan/40"
                  }`}
              />

              {/* FEEDBACK */}
              <div className="mt-4 font-mono text-sm h-5">
                {feedback === "correct" && (
                  <span className="text-neon-green">✔ Correct (+1 TOKEN)</span>
                )}
                {feedback === "incorrect" && (
                  <span className="text-red-500">✖ Incorrect</span>
                )}
              </div>

              {/* CONTROLS */}
              <div className="mt-10 flex justify-between items-center">
                <NeonButton
                  className="w-40"
                  variant="secondary"
                  onClick={goPrev}
                  disabled={currentIndex === 0}
                >
                  <ChevronLeft size={16} /> PREVIOUS
                </NeonButton>

                <NeonButton
                  className="w-40"
                  onClick={submitAnswer}
                  disabled={isLocked || submitting || !userAnswer.trim()}
                >
                  EXECUTE
                </NeonButton>

                <NeonButton
                  className="w-40"
                  variant="secondary"
                  onClick={goNext}
                  disabled={currentIndex === TOTAL_NODES - 1}
                >
                  NEXT <ChevronRight size={16} />
                </NeonButton>
              </div>
            </TerminalCard>
          </Motion.div>
        </AnimatePresence>
      </div>

      {/* SIDEBAR */}
      <div className="w-80">
        <TerminalCard title="ROUND 2 — PHASE 1" headerColor="cyan">
          <div className="space-y-3 font-mono text-sm">
            <p>
              SOLVED:{" "}
              <span className="text-neon-green">
                {solved}/{TOTAL_NODES}
              </span>
            </p>
            <p className="text-yellow-300 text-xl">TOKENS: {tokens}</p>

            <NeonButton
              className="mt-4 w-full"
              onClick={() => navigate("/round2/phase2")}
            >
              PROCEED TO PHASE 2 →
            </NeonButton>
          </div>
        </TerminalCard>
      </div>
    </div>
  );
};

export default Round2Phase1;
