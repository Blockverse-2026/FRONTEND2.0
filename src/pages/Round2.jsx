import React, { useEffect, useState } from "react";
import TerminalCard from "../components/TerminalCard";
import NeonButton from "../components/NeonButton";
import { useNavigate } from "react-router-dom";

const Round2 = () => {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  /* ================= FETCH QUESTIONS ================= */

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem("BLOCKVERSE_TOKEN");
        if (!token) throw new Error("Unauthorized");

        const res = await fetch(
          "https://blockverse-backend.onrender.com/api/round2/phase1/questions",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const json = await res.json();

        if (!res.ok || !json?.data?.questions) {
          throw new Error("Invalid response");
        }

        setQuestions(json.data.questions);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  /* ================= HANDLE INPUT ================= */

  const handleChange = (qid, value) => {
    setAnswers(prev => ({
      ...prev,
      [qid]: value.replace(/[^0-9]/g, ""),
    }));
  };

  /* ================= FINAL SUBMIT (SEQUENTIAL) ================= */

  const submitAll = async () => {
    setSubmitting(true);
    const token = localStorage.getItem("BLOCKVERSE_TOKEN");

    try {
      for (const q of questions) {
        const ans = answers[q.questionId];
        if (!ans) continue; // skip unanswered

        const res = await fetch(
          "https://blockverse-backend.onrender.com/api/round2/phase1/submit",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              questionId: q.questionId,
              answer: Number(ans),
            }),
          }
        );

        if (!res.ok) {
          throw new Error("Submission failed");
        }
      }

      navigate("/round2/result");
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  /* ================= UI ================= */

  if (loading) {
    return <div className="p-6 text-neon-cyan">LOADING QUESTIONS...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <TerminalCard title="ROUND 2 — MARKETPLACE">
        <div className="space-y-6">
          {questions.map(q => (
            <div key={q.questionId} className="border border-neon-cyan p-4">
              <div className="text-xs text-gray-400">{q.questionId}</div>
              <div className="text-white mt-2">{q.question}</div>

              <input
                type="text"
                inputMode="numeric"
                placeholder="Enter numeric answer"
                value={answers[q.questionId] || ""}
                onChange={e => handleChange(q.questionId, e.target.value)}
                className="mt-3 w-full p-2 bg-black border border-neon-cyan text-white"
              />
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <NeonButton onClick={submitAll} disabled={submitting}>
            {submitting ? "SUBMITTING..." : "SUBMIT ROUND 2"}
          </NeonButton>
        </div>
      </TerminalCard>
    </div>
  );
};

export default Round2;
