import React, { useEffect, useState } from "react";
import { Lock, Unlock, Clock, Ban, User, Zap } from "lucide-react";
import { motion as Motion } from "framer-motion";
import TerminalCard from "../components/TerminalCard";
import NeonButton from "../components/NeonButton";
import Modal from "../components/Modal";
import { useNavigate } from "react-router-dom";
import GlitchText from "../components/GlitchText";
import CyberBackground from "../components/CyberBackground";
import { useGame } from "../context/GameContext";

const TOTAL_NODES = 50;
const ROUND_TIME = 300; // Testing: 5 minutes (300s). For 30 mins, use 1800.

const Round1 = () => {
  const navigate = useNavigate();
  const { gameState } = useGame();

  const [questions, setQuestions] = useState([]);
  const [nodes, setNodes] = useState(
    Array.from({ length: TOTAL_NODES }, (_, i) => ({
      id: i,
      status: "locked",
    })),
  );

  const [score, setScore] = useState(0);
  const [selectedNode, setSelectedNode] = useState(null);
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [answerStatus, setAnswerStatus] = useState(null);
  const [shakeId, setShakeId] = useState(null);
  const [rippleId, setRippleId] = useState(null);
  const [displayedScore, setDisplayedScore] = useState(0);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [comboMultiplier, setComboMultiplier] = useState(1);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
  const [questionOrder, setQuestionOrder] = useState([]);

  useEffect(() => {
    const savedNodes = localStorage.getItem("round1_nodes");
    const savedScore = localStorage.getItem("round1_score");

    if (savedNodes) setNodes(JSON.parse(savedNodes));
    if (savedScore) setScore(parseInt(savedScore));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("BLOCKVERSE_TOKEN");
    fetch("https://blockverse-backend.onrender.com/api/round1/progress", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.data?.solved || data.data.solved.length === 0) {
          localStorage.removeItem("round1_nodes");
          localStorage.removeItem("round1_score");
          setNodes(
            Array.from({ length: TOTAL_NODES }, (_, i) => ({
              id: i,
              status: "locked",
            })),
          );
          setScore(0);
        }
      });
  }, []);

  useEffect(() => {
    localStorage.setItem("round1_nodes", JSON.stringify(nodes));
  }, [nodes]);

  useEffect(() => {
    localStorage.setItem("round1_score", score.toString());
  }, [score]);

  useEffect(() => {
    const diff = score - displayedScore;
    if (diff === 0) return;
    const step = diff / 20;
    const id = setInterval(() => {
      setDisplayedScore((s) => {
        const next = s + step;
        if ((step > 0 && next >= score) || (step < 0 && next <= score)) {
          clearInterval(id);
          return score;
        }
        return next;
      });
    }, 16);
    return () => clearInterval(id);
  }, [score, displayedScore]);

  useEffect(() => {
    const tick = setInterval(() => {
      setTimeLeft((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    const initRound = async () => {
      try {
        const token = localStorage.getItem("BLOCKVERSE_TOKEN");

        const res = await fetch(
          "https://blockverse-backend.onrender.com/api/round1/init",
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        const json = await res.json();

        if (!res.ok) throw new Error("Failed to init round");

        setQuestions(json.data.questions);
        // setTimeLeft(Math.floor(json.data.timeRemainingMs / 1000));
        setTimeLeft(ROUND_TIME);
      } catch (err) {
        setError(err.message);
      }
    };

    initRound();
  }, []);

  useEffect(() => {
    if (!questions.length) return;
    const seedFromString = (s) => {
      let h = 2166136261 >>> 0;
      for (let i = 0; i < s.length; i++) {
        h ^= s.charCodeAt(i);
        h = Math.imul(h, 16777619);
      }
      return h >>> 0;
    };
    const rng = (a) => {
      return function () {
        a |= 0;
        a = (a + 0x6d2b79f5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    };
    const makeOrder = (n, r) => {
      const arr = Array.from({ length: n }, (_, i) => i);
      for (let i = n - 1; i > 0; i--) {
        const j = Math.floor(r() * (i + 1));
        const tmp = arr[i];
        arr[i] = arr[j];
        arr[j] = tmp;
      }
      return arr;
    };
    const teamKey = gameState?.teamId ? String(gameState.teamId) : "default";
    const storageKey = `round1_order_${teamKey}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === questions.length) {
          setQuestionOrder(parsed);
          return;
        }
      } catch (e) {
        void e;
      }
    }
    const seed = seedFromString(teamKey);
    const order = makeOrder(questions.length, rng(seed));
    setQuestionOrder(order);
    localStorage.setItem(storageKey, JSON.stringify(order));
  }, [questions, gameState?.teamId]);

  const handleNodeClick = (node) => {
    if (node.status === "unlocked" || node.status === "blocked") return;

    const idx =
      questionOrder && questionOrder.length === questions.length
        ? questionOrder[node.id]
        : node.id;
    const q = questions[idx];
    if (!q) return;

    setSelectedNode(node);
    setActiveQuestion(q);
    setSelectedIndex(null);
    setAnswerStatus(null);
  };

  const blockNode = (id) => {
    setNodes((prev) => {
      const copy = [...prev];
      copy[id].status = "blocked";
      return copy;
    });
  };

  const submitAnswer = async () => {
    if (selectedIndex === null || !activeQuestion || submitting) return;

    if (
      nodes[selectedNode.id].status === "unlocked" ||
      nodes[selectedNode.id].status === "blocked"
    )
      return;

    setSubmitting(true);

    const payload = {
      questionId: activeQuestion.questionId,
      answer: activeQuestion.options[selectedIndex],
    };

    try {
      const res = await fetch(
        "https://blockverse-backend.onrender.com/api/round1/submit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("BLOCKVERSE_TOKEN")}`,
          },
          body: JSON.stringify(payload),
        },
      );

      const json = await res.json();

      // ✅ WRONG ANSWER HANDLING
      if (!res.ok) {
        setAnswerStatus("incorrect");
        setShakeId(selectedNode.id);

        // reset streak
        setStreak(0);
        setComboMultiplier(1);

        setTimeout(() => {
          setShakeId(null);
          blockNode(selectedNode.id);
          closeModal();
        }, 800);

        return;
      }

      // ✅ CORRECT ANSWER HANDLING
      if (json.data?.correct === true) {
        setAnswerStatus("correct");
        setRippleId(selectedNode.id);

        setNodes((prev) => {
          const copy = [...prev];
          copy[selectedNode.id].status = "unlocked";
          return copy;
        });

        if (json.data?.pointsAwarded) {
          setScore((prev) => prev + json.data.pointsAwarded);
          setXp((prev) => prev + json.data.pointsAwarded);
          setStreak((s) => s + 1);
          setComboMultiplier((m) => Math.min(m + 0.1, 3));
        }

        setTimeout(() => {
          setRippleId(null);
          closeModal();
        }, 800);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const closeModal = () => {
    setSelectedNode(null);
    setActiveQuestion(null);
    setSelectedIndex(null);
    setSubmitting(false);
    setAnswerStatus(null);
  };

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  const unlockedCount = nodes.filter((n) => n.status === "unlocked").length;
  const remainingCount = nodes.filter((n) => n.status === "locked").length;
  const unlockedPct = Math.round((unlockedCount / TOTAL_NODES) * 100);
  const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const seconds = String(timeLeft % 60).padStart(2, "0");
  const level = Math.floor(xp / 100) + 1;
  const xpInLevel = xp % 100;
  const xpPct = Math.min(100, Math.round((xpInLevel / 100) * 100));

  return (
    <Motion.div
      initial={{ opacity: 0, y: 10, scale: 1 }}
      animate={{
        opacity: 1,
        y: 0,
        scale: rippleId !== null ? [1, 1.02, 1] : 1,
        filter:
          shakeId !== null
            ? ["none", "contrast(1.4) hue-rotate(20deg)", "none"]
            : "none",
      }}
      className="flex-1 pt-6 px-6 flex flex-col gap-6 overflow-hidden relative"
    >
      <CyberBackground />
      <div className="scanline-overlay" />

      {/* TOP NAV */}
      <div className="relative flex items-center justify-between px-6 py-4 border border-neon-cyan/70 bg-gradient-to-b from-black/60 to-black/30 backdrop-blur-md shadow-[0_0_12px_rgba(0,246,255,.15)] glow-pulse">
        <div className="flex items-center gap-3">
          <Zap size={18} className="text-neon-cyan" />
          <span className="font-orbitron tracking-[0.35em] text-neon-cyan">
            BLOCKVERSE
          </span>
          <div className="hidden md:flex items-center gap-3 text-neon-cyan/80 ml-6">
            <span className="h-3 w-[1px] bg-neon-cyan/40" />
            <span>Round 1</span>
            <span className="opacity-70">• Firewall Grid</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <User size={16} className="text-neon-gold" />
            <span className="text-neon-gold">
              Team {gameState.teamName ?? "N/A"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-[1fr_auto] gap-8 items-start">
        {/* GRID */}
        <div className="flex-1 max-h-[80vh] overflow-y-auto">
          <div className="mx-auto grid grid-cols-5 sm:grid-cols-4 xs:grid-cols-3 gap-5">
            {nodes.map((node) => (
              <Motion.button
                key={node.id}
                whileHover={node.status === "blocked" ? {} : { scale: 1.05 }}
                whileTap={node.status === "blocked" ? {} : { scale: 0.95 }}
                onClick={() => handleNodeClick(node)}
                animate={node.id === shakeId ? { x: [0, -6, 6, -4, 4, 0] } : {}}
                transition={{ duration: 0.3 }}
                className={`group aspect-square border-2 flex items-center justify-center transition-all relative rounded-md overflow-visible
                ${
                  node.status === "unlocked"
                    ? "border-neon-green bg-black/40 backdrop-blur-sm text-neon-green ring-1 ring-neon-green/30"
                    : node.status === "blocked"
                      ? "border-red-700 border-dashed bg-red-900/20 backdrop-blur-sm text-red-400 cursor-not-allowed"
                      : "border-red-500 bg-black/40 backdrop-blur-sm text-red-500"
                }`}
              >
                {/* label kept inside tile to avoid clipping */}
                <span className="absolute top-1 left-1 text-[10px] px-1 py-[2px] border border-current bg-black/60">
                  NODE {String(node.id + 1).padStart(2, "0")}
                </span>

                {node.status === "unlocked" ? (
                  <Unlock size={28} />
                ) : node.status === "blocked" ? (
                  <Ban size={28} />
                ) : (
                  <Lock size={28} />
                )}
                {node.status === "blocked" && (
                  <span className="absolute inset-0 pointer-events-none rounded-md bg-[repeating-linear-gradient(45deg,rgba(255,0,0,0.06)_0px,rgba(255,0,0,0.06)_8px,transparent_8px,transparent_16px)]" />
                )}
                {/* hover label */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] opacity-0 group-hover:opacity-100 transition">
                  {node.status === "locked"
                    ? "Locked Node"
                    : node.status === "blocked"
                      ? "Firewall Detected"
                      : "Access Granted"}
                </div>
                {/* unlocked progress ring */}

                {/* success ripple */}
                {rippleId === node.id && (
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border border-neon-green animate-ping pointer-events-none" />
                )}
              </Motion.button>
            ))}
          </div>
        </div>

        {/* SIDE PANEL */}
        <div className="w-80">
          <TerminalCard
            title="ROUND 1 STATUS"
            headerColor="gold"
            className="backdrop-blur-md bg-black/40 border-neon-cyan/60"
          >
            <div className="space-y-4 font-mono text-sm">
              <div className="text-neon-cyan flex items-center gap-2">
                <span>MISSION:</span>
                <GlitchText text="FIREWALL GRID" as="span" size="small" />
              </div>

              <p>
                UNLOCKED:{" "}
                <span className="text-neon-green">
                  {unlockedCount}/{TOTAL_NODES}
                </span>
              </p>
              <div className="h-2 bg-black/40 border border-neon-cyan/40 overflow-hidden">
                <div
                  className="h-full bg-neon-green"
                  style={{ width: unlockedPct + "%" }}
                />
              </div>

              <p>
                REMAINING QUESTIONS:{" "}
                <span className="text-neon-cyan">
                  {remainingCount}
                </span>
              </p>

              <div className="flex items-center gap-2 text-neon-cyan">
                <Clock size={14} />
                <span>
                  TIME LIMITED ROUND • {minutes}:{seconds}
                </span>
              </div>
              <div className="h-2 bg-black/40 border border-neon-cyan/40 overflow-hidden">
                <div
                  className="h-full bg-neon-cyan"
                  style={{ width: (timeLeft / 300) * 100 + "%" }}
                />
              </div>

              <p className="text-neon-green text-xl">
                SCORE: {Math.round(displayedScore)}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-neon-gold">XP</span>
                <span className="text-neon-gold">Lvl {level}</span>
              </div>
              <div className="h-2 bg-black/40 border border-neon-gold/40">
                <div
                  className="h-full bg-neon-gold"
                  style={{ width: xpPct + "%" }}
                />
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-neon-green">Streak: {streak}</span>
                <span className="text-neon-cyan">
                  Combo x{comboMultiplier.toFixed(1)}
                </span>
              </div>

              <NeonButton
                className="mt-4 w-full opacity-50 cursor-not-allowed"
                onClick={() => navigate("/panel/round2-intro")}
                disabled={true}
              >
                PROCEED TO ROUND 2 →
              </NeonButton>
            </div>
          </TerminalCard>
        </div>
      </div>

      <Modal
        isOpen={!!selectedNode}
        onClose={closeModal}
        title={`NODE ${(selectedNode?.id ?? 0) + 1}`}
      >
        {activeQuestion && (
          <>
            <p className="text-neon-cyan font-mono mb-4">
              {activeQuestion.questionText}
            </p>

            <div className="space-y-2">
              {activeQuestion.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedIndex(idx)}
                  className={`w-full p-2 border text-left font-mono transition-all
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
                className={`mt-4 text-center font-mono text-sm ${
                  answerStatus === "correct"
                    ? "text-neon-green"
                    : "text-red-500"
                }`}
              >
                {answerStatus === "correct"
                  ? "✔ ACCESS GRANTED"
                  : "✖ ACCESS DENIED"}
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <NeonButton variant="danger" onClick={closeModal}>
                ABORT
              </NeonButton>

              <NeonButton
                onClick={submitAnswer}
                disabled={selectedIndex === null || submitting}
              >
                {submitting ? "SUBMITTING..." : "EXECUTE"}
              </NeonButton>
            </div>
          </>
        )}
      </Modal>
    </Motion.div>
  );
};

export default Round1;
