import React, { useEffect, useState } from "react";
import { Lock, Unlock } from "lucide-react";
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
      status: "locked",
    }))
  );

  const [activeNode, setActiveNode] = useState(null);
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  /* ================= FETCH QUESTIONS ================= */

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

  /* ================= OPEN NODE ================= */

  const openNode = node => {
    if (node.status === "unlocked") return;

    const q = questions[node.id];
    if (!q) return;

    setActiveNode(node);
    setActiveQuestion(q);
    setSelectedIndex(null);
  };

  /* ================= SUBMIT ANSWER ================= */

  const submitAnswer = async () => {
    if (selectedIndex === null || !activeQuestion || submitting) return;

    // ⛔ prevent re-submit
    if (nodes[activeNode.id].status === "unlocked") return;

    setSubmitting(true);

    const payload = {
      questionId: activeQuestion.questionId,
      year: activeQuestion.year,
      answer: activeQuestion.options[selectedIndex],
    };

    console.log("📤 SUBMIT:", payload);

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

      const data = await res.json();
      console.log("📥 RESPONSE:", data);

      if (!res.ok) throw new Error(data.message || "Submission failed");

      // ✅ unlock node
      setNodes(prev => {
        const copy = [...prev];
        copy[activeNode.id].status = "unlocked";
        return copy;
      });

      closeModal();
    } catch (err) {
      alert(err.message);
      setSubmitting(false);
    }
  };

  /* ================= CLOSE MODAL ================= */

  const closeModal = () => {
    setActiveNode(null);
    setActiveQuestion(null);
    setSelectedIndex(null);
    setSubmitting(false);
  };

  /* ================= UI ================= */

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="flex gap-6 p-6">
      {/* GRID */}
      <div className="grid grid-cols-5 gap-2 flex-1">
        {nodes.map(node => (
          <Motion.button
            key={node.id}
            whileHover={{ scale: 1.05 }}
            onClick={() => openNode(node)}
            className={`aspect-square border-2 flex items-center justify-center
              ${
                node.status === "unlocked"
                  ? "border-neon-green text-neon-green"
                  : "border-red-500 text-red-500 animate-pulse"
              }`}
          >
            {node.status === "unlocked" ? <Unlock /> : <Lock />}
          </Motion.button>
        ))}
      </div>

      {/* SIDE PANEL */}
      <div className="w-80">
        <TerminalCard title="ROUND 1 STATUS" headerColor="red">
          <p>
            UNLOCKED:{" "}
            {nodes.filter(n => n.status === "unlocked").length}/{TOTAL_NODES}
          </p>
        </TerminalCard>
      </div>

      {/* QUESTION MODAL */}
      <Modal isOpen={!!activeNode} onClose={closeModal} title="QUESTION">
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
                CANCEL
              </NeonButton>

              <NeonButton
                onClick={submitAnswer}
                disabled={selectedIndex === null || submitting}
              >
                {submitting ? "SUBMITTING..." : "SUBMIT"}
              </NeonButton>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
};

export default Round1;
