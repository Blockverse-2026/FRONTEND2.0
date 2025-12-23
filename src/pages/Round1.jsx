import React, { useEffect, useState } from "react";
import { Lock, Unlock } from "lucide-react";
import { motion as Motion } from "framer-motion";
import TerminalCard from "../components/TerminalCard";
import NeonButton from "../components/NeonButton";
import Modal from "../components/Modal";
import { useGame } from "../context/GameContext";



const QUESTION_TIME = 60;

const INITIAL_NODES = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  status: "locked",
}));



const Round1 = () => {
  const { unlockFragment, completeRound } = useGame();

  const [nodes, setNodes] = useState(INITIAL_NODES);
  const [selectedNode, setSelectedNode] = useState(null);

  const [questionsCache, setQuestionsCache] = useState([]);
  const [usedQuestionIds, setUsedQuestionIds] = useState(new Set());
  const [puzzle, setPuzzle] = useState(null);

  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [error, setError] = useState(null);

  const [input, setInput] = useState("");
  const [shake, setShake] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [timerActive, setTimerActive] = useState(false);
  const [startTime, setStartTime] = useState(null);

 

  useEffect(() => {
    const fetchQuestions = async () => {
      const token = localStorage.getItem("BLOCKVERSE_TOKEN");

      if (!token) {
        setError("NO TOKEN FOUND. PLEASE LOGIN AGAIN.");
        setLoadingQuestions(false);
        return;
      }

      try {
        const res = await fetch(
          "https://blockverse-backend.onrender.com/api/round1/questions",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) throw new Error(`BACKEND ERROR ${res.status}`);

        const json = await res.json();
        const questions = json?.data?.questions;

        if (!Array.isArray(questions) || questions.length === 0) {
          console.error("INVALID RESPONSE:", json);
          throw new Error("NO QUESTIONS FOUND IN BACKEND");
        }

        console.log("✅ QUESTIONS LOADED:", questions);
        setQuestionsCache(questions);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoadingQuestions(false);
      }
    };

    fetchQuestions();
  }, []);

  

  useEffect(() => {
    if (!timerActive) return;

    const timer = setInterval(() => {
      setTimeLeft(t => (t > 0 ? t - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timerActive]);

  useEffect(() => {
    if (timeLeft === 0 && selectedNode) closeNode();
  }, [timeLeft, selectedNode]);

 

  const pickRandomQuestion = () => {
    const available = questionsCache.filter(
      q => !usedQuestionIds.has(q._id)
    );

    const pool = available.length > 0 ? available : questionsCache;
    const selected = pool[Math.floor(Math.random() * pool.length)];

    setUsedQuestionIds(prev => new Set(prev).add(selected._id));
    return selected;
  };

 

  const openNode = node => {
    if (node.status !== "locked") return;
    if (loadingQuestions || error) return;

    const q = pickRandomQuestion();

    setSelectedNode(node);
    setPuzzle(q);
    setInput("");
    setTimeLeft(QUESTION_TIME);
    setTimerActive(true);
    setStartTime(Date.now());
  };

  const closeNode = () => {
    setTimerActive(false);
    setSelectedNode(null);
    setPuzzle(null);
    setInput("");
    setSubmitting(false);
    setTimeLeft(QUESTION_TIME);
  };

  const handleSubmit = async () => {
    if (!puzzle || !selectedNode || submitting) return;

    const token = localStorage.getItem("BLOCKVERSE_TOKEN");
    if (!token) return;

    setSubmitting(true);
    setTimerActive(false);

    const payload = {
      round: "round1",
      nodeId: selectedNode.id,
      questionId: puzzle._id,
      answer: input.trim(), 
      timeTaken: Math.floor((Date.now() - startTime) / 1000),
    };

    console.log("📤 SUBMIT PAYLOAD:", payload);

    try {
      const res = await fetch(
        "https://blockverse-backend.onrender.com/api/round1/submit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      console.log("📥 SUBMIT RESPONSE:", data);

      if (!res.ok) throw new Error(data.message || "Submit failed");

      if (data.correct === true) {
        setNodes(prev => {
          const copy = [...prev];
          copy[selectedNode.id].status = "unlocked";
          return copy;
        });

        unlockFragment(`firewall-node-${selectedNode.id}`);
        closeNode();
      } else {
        setShake(true);
        setTimeout(() => setShake(false), 400);
        setSubmitting(false);
        setTimerActive(true);
      }
    } catch (err) {
      console.error("❌ SUBMIT ERROR:", err);
      setShake(true);
      setTimeout(() => setShake(false), 400);
      setSubmitting(false);
      setTimerActive(true);
    }
  };

  const unlockedCount = nodes.filter(n => n.status === "unlocked").length;

  

  return (
    <div className="flex gap-6 p-6 overflow-hidden">
      {/* GRID */}
      <div className="grid grid-cols-5 gap-2 flex-1">
        {nodes.map(node => (
          <Motion.button
            key={node.id}
            whileHover={{ scale: 1.05 }}
            disabled={loadingQuestions || error}
            onClick={() => openNode(node)}
            className={`aspect-square border-2 flex items-center justify-center
              ${
                node.status === "unlocked"
                  ? "border-neon-green text-neon-green"
                  : "border-red-500 text-red-500 animate-pulse"
              }
              ${loadingQuestions || error ? "opacity-40 cursor-not-allowed" : ""}
            `}
          >
            {node.status === "unlocked" ? <Unlock /> : <Lock />}
          </Motion.button>
        ))}
      </div>

      {/* SIDE PANEL */}
      <div className="w-80">
        <TerminalCard title="MISSION LOG" headerColor="red">
          <p>UNLOCKED: {unlockedCount}/50</p>

          {loadingQuestions && (
            <p className="text-yellow-400 mt-2">
              Loading questions from backend...
            </p>
          )}

          {error && <p className="text-red-500 mt-2">{error}</p>}
        </TerminalCard>
      </div>

      {/* QUESTION MODAL */}
      <Modal isOpen={!!selectedNode} onClose={closeNode}>
        <div>
          <div className="flex justify-between text-red-400 font-mono mb-2">
            <span>TIME LEFT</span>
            <span>{timeLeft}s</span>
          </div>

          {puzzle?.question && (
            <>
              <Motion.p
                animate={shake ? { x: [-10, 10, -10, 0] } : {}}
                className="font-mono text-neon-cyan mb-4"
              >
                {puzzle.question}
              </Motion.p>

              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                className="w-full p-2 bg-black border"
                placeholder="ENTER ANSWER"
              />

              <div className="flex gap-2 mt-4">
                <NeonButton variant="danger" onClick={closeNode}>
                  ABORT
                </NeonButton>
                <NeonButton onClick={handleSubmit} disabled={submitting}>
                  {submitting ? "VERIFYING..." : "EXECUTE"}
                </NeonButton>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default Round1;
