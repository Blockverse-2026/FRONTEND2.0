
import React, { useEffect, useState } from "react";
import { Lock, Unlock } from "lucide-react";
import { motion as Motion } from "framer-motion";
import TerminalCard from "../components/TerminalCard";
import NeonButton from "../components/NeonButton";
import Modal from "../components/Modal";
import { useNavigate } from "react-router-dom";

const TOTAL_NODES = 20;

const Round2Phase1 = () => {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [nodes, setNodes] = useState(
    Array.from({ length: TOTAL_NODES }, (_, i) => ({
      id: i,
      status: "locked", // locked | unlocked | blocked
    }))
  );

  const [tokens, setTokens] = useState(0);
  const [selectedNode, setSelectedNode] = useState(null);
  const [activeQuestion, setActiveQuestion] = useState(null);

  const [userAnswer, setUserAnswer] = useState(""); // ← FREE TEXT INPUT
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  /* RESTORE LOCAL STORAGE */
  useEffect(() => {
    const savedNodes = localStorage.getItem("round2_phase1_nodes");
    const savedTokens = localStorage.getItem("round2_phase1_tokens");

    if (savedNodes) setNodes(JSON.parse(savedNodes));
    if (savedTokens) setTokens(parseInt(savedTokens));
  }, []);

  /* SAVE LOCAL STORAGE */
  useEffect(() => {
    localStorage.setItem("round2_phase1_nodes", JSON.stringify(nodes));
  }, [nodes]);

  useEffect(() => {
    localStorage.setItem("round2_phase1_tokens", tokens.toString());
  }, [tokens]);

  /* FETCH QUESTIONS */
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

        const sorted = json.data.questions.sort((a, b) => a.order - b.order);

        setQuestions(sorted);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchQuestions();
  }, []);

  /* CLICK NODE */
  const handleNodeClick = (node) => {
    if (node.status === "unlocked" || node.status === "blocked") return;

    const q = questions.find((q) => q.order === node.id + 1);
    if (!q) return;

    setSelectedNode(node);
    setActiveQuestion(q);
    setUserAnswer(""); // reset input
  };

  /* SUBMIT ANSWER */
  const submitAnswer = async () => {
    if (!userAnswer.trim() || submitting || !activeQuestion) return;

    const nodeId = selectedNode.id;
    setSubmitting(true);

    const payload = {
      questionId: activeQuestion.questionId,
      answer: userAnswer.trim(),
    };

    try {
      const res = await fetch(
        "https://blockverse-backend.onrender.com/api/round2/phase1/submit",
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

      /* WRONG ANSWER */
      if (!res.ok) {
        alert("Incorrect Answer ❌");

        setNodes((prev) => {
          const copy = [...prev];
          copy[nodeId].status = "blocked"; // RED
          return copy;
        });

        return closeModal();
      }

      /* CORRECT ANSWER */
      alert("Correct Answer 🎉");

      setNodes((prev) => {
        const copy = [...prev];
        copy[nodeId].status = "unlocked"; // GREEN
        return copy;
      });

      if (json.data?.tokens !== undefined) {
        setTokens(json.data.tokens);
      }

      closeModal();
    } catch (error) {
      alert("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  /* CLOSE MODAL */
  const closeModal = () => {
    setSelectedNode(null);
    setActiveQuestion(null);
    setUserAnswer("");
    setSubmitting(false);
  };

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  const unlockedCount = nodes.filter((n) => n.status === "unlocked").length;

  return (
    <div className="flex-1 pt-12 px-6 flex gap-8 overflow-hidden">
      {/* GRID */}
      <div className="flex-1 max-h-[88vh] overflow-y-auto">
        <div className="grid grid-cols-5 grid-rows-4 gap-3">
          {nodes.map((node) => (
            <Motion.button
              key={node.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleNodeClick(node)}
              className={`aspect-square border-2 flex items-center justify-center transition-all
                ${
                  node.status === "unlocked"
                    ? "border-neon-green bg-neon-green/10 text-neon-green"
                    : node.status === "blocked"
                    ? "border-red-500 bg-red-500/20 text-red-400 cursor-not-allowed"
                    : "border-cyan-500 bg-cyan-500/10 text-cyan-500 animate-pulse"
                }`}
            >
              {node.status === "unlocked" ? (
                <Unlock size={28} />
              ) : node.status === "blocked" ? (
                "❌"
              ) : (
                <Lock size={28} />
              )}
            </Motion.button>
          ))}
        </div>
      </div>

      {/* SIDEBAR */}
      <div className="w-80">
        <TerminalCard title="ROUND 2 — PHASE 1" headerColor="cyan">
          <div className="space-y-3 font-mono text-sm">
            <p>STATUS: LOGIC GRID</p>

            <p>
              SOLVED:{" "}
              <span className="text-neon-green">
                {unlockedCount}/{TOTAL_NODES}
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

      {/* QUESTION MODAL */}
      <Modal
        isOpen={!!selectedNode}
        onClose={closeModal}
        title={`TASK ${(selectedNode?.id ?? 0) + 1}`}
      >
        {activeQuestion && (
          <>
            <p className="text-neon-cyan font-mono mb-4">
              {activeQuestion.question}
            </p>

            {/* FREE TEXT INPUT */}
            <input
              type="text"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Enter your answer..."
              className="w-full p-2 border border-neon-cyan bg-black text-white font-mono"
            />

            <div className="flex gap-3 mt-6">
              <NeonButton variant="danger" onClick={closeModal}>
                ABORT
              </NeonButton>

              <NeonButton
                onClick={submitAnswer}
                disabled={!userAnswer.trim() || submitting}
              >
                {submitting ? "SUBMITTING..." : "EXECUTE"}
              </NeonButton>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default Round2Phase1;
