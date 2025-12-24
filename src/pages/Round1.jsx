import React, { useEffect, useState } from "react";
import { Lock, Unlock, Clock } from "lucide-react";
import { motion as Motion } from "framer-motion";
import TerminalCard from "../components/TerminalCard";
import NeonButton from "../components/NeonButton";
import Modal from "../components/Modal";

const TOTAL_NODES = 50;

const Round1 = () => {
  const [questions, setQuestions] = useState([]);
  const [nodes, setNodes] = useState(
    Array.from({ length: TOTAL_NODES }, (_, i) => ({
      id: i,
      status: "locked", // locked | unlocked | blocked
    }))
  );

  const [score, setScore] = useState(0);
  const [selectedNode, setSelectedNode] = useState(null);
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem("BLOCKVERSE_TOKEN");
        if (!token) throw new Error("No token found");

        const res = await fetch(
          "https://blockverse-backend.onrender.com/api/round1/questions",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const json = await res.json();
        if (!res.ok || !json?.data?.questions)
          throw new Error("Failed to load questions");

        setQuestions(json.data.questions);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchQuestions();
  }, []);

  const handleNodeClick = (node) => {
    if (node.status === "unlocked" || node.status === "blocked") return;

    const q = questions[node.id];
    if (!q) return;

    setSelectedNode(node);
    setActiveQuestion(q);
    setSelectedIndex(null);
  };

  // ---------- BLOCK NODE ----------
  const blockNode = (id) => {
    setNodes((prev) => {
      const copy = [...prev];
      copy[id].status = "blocked";
      return copy;
    });
  };

  // ---------- SUBMIT ANSWER ----------
  const submitAnswer = async () => {
    if (selectedIndex === null || !activeQuestion || submitting) return;

    // prevent answering again
    if (
      nodes[selectedNode.id].status === "unlocked" ||
      nodes[selectedNode.id].status === "blocked"
    )
      return;

    setSubmitting(true);

    const payload = {
      questionId: activeQuestion.questionId,
      selectedOption: activeQuestion.options[selectedIndex],
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
        }
      );

      const json = await res.json();
      console.log("Response:", json);

      // ---- WRONG ANSWER (backend sends correct:false) ----
      if (json.data?.correct === false) {
        alert("Incorrect Answer ❌");
        blockNode(selectedNode.id);
        return closeModal();
      }

      // ---- CORRECT ANSWER ----
      if (json.data?.correct === true || json.data?.points > 0) {
        alert("Correct Answer 🎉");

        setNodes((prev) => {
          const copy = [...prev];
          copy[selectedNode.id].status = "unlocked";
          return copy;
        });

        if (json.data?.points) {
          setScore((prev) => prev + json.data.points);
        }
      }

      closeModal();
    } catch (err) {
      alert("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const closeModal = () => {
    setSelectedNode(null);
    setActiveQuestion(null);
    setSelectedIndex(null);
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
        <div className="grid grid-cols-5 grid-rows-10 gap-3">
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
                    ? "border-gray-500 bg-gray-800 text-gray-500 cursor-not-allowed"
                    : "border-red-500 bg-red-500/10 text-red-500 animate-pulse"
                }`}
            >
              {node.status === "unlocked" ? (
                <Unlock size={28} />
              ) : node.status === "blocked" ? (
                "🚫"
              ) : (
                <Lock size={28} />
              )}
            </Motion.button>
          ))}
        </div>
      </div>

      {/* SIDE PANEL */}
      <div className="w-80">
        <TerminalCard title="ROUND 1 STATUS" headerColor="red">
          <div className="space-y-3 font-mono text-sm">
            <p>MISSION: FIREWALL GRID</p>
            <p>
              UNLOCKED:{" "}
              <span className="text-neon-green">
                {unlockedCount}/{TOTAL_NODES}
              </span>
            </p>
            <div className="flex items-center gap-2 text-neon-cyan">
              <Clock size={14} />
              <span>TIME LIMITED ROUND</span>
            </div>
            <p className="text-neon-green text-xl">SCORE: {score}</p>
          </div>
        </TerminalCard>
      </div>

      {/* QUESTION MODAL */}
      <Modal
        isOpen={!!selectedNode}
        onClose={closeModal}
        title={`NODE ${(selectedNode?.id ?? 0) + 1}`}
      >
        {activeQuestion && (
          <>
            <p className="text-neon-cyan font-mono mb-4">
              {activeQuestion.question}
            </p>

            <div className="space-y-2">
              {activeQuestion.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedIndex(idx)}
                  className={`w-full p-2 border text-left font-mono
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
    </div>
  );
};

export default Round1;
