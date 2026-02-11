import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import GlitchText from "../components/GlitchText";
import NeonButton from "../components/NeonButton";

const API = "https://blockverse-backend.onrender.com";

const Round3Bomb = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [selected, setSelected] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // ---------------- INIT ----------------
  const initRound = () => {
    const token = localStorage.getItem("BLOCKVERSE_TOKEN");

    fetch(`${API}/api/round3/init`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Init error:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    initRound();
  }, []);

  // ---------------- LOADING ----------------
  if (loading || !data) {
    return (
      <div className="flex-1 flex items-center justify-center text-cyan-400 font-mono">
        Initializing core…
      </div>
    );
  }

  // ---------------- FIND BOMB ----------------
  const bomb = data.bombs.find(
    (b) => String(b.bombNumber) === String(id)
  );

  if (!bomb) {
    return (
      <div className="flex-1 flex items-center justify-center text-red-400">
        Bomb not found
      </div>
    );
  }

  const current = bomb.questions.find((q) => !q.solved);

  // ---------------- DIFFUSED ----------------
  if (!current) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-6 text-green-400">
        <h2 className="text-2xl font-orbitron">
          ✔ BOMB {id} DIFFUSED
        </h2>

        <NeonButton onClick={() => navigate("/round3")}>
          RETURN TO HUB
        </NeonButton>
      </div>
    );
  }

  // ---------------- PARSE QUESTION ----------------

  const letters = ["A", "B", "C", "D"];

  // Extract MCQ options from text
  const optionRegex = /[A-D]\.\s*(.*)/g;
  const matches = [
    ...current.questionText.matchAll(optionRegex),
  ];

  // Final options
  const options =
    matches.length === 4
      ? matches.map((m) => m[1])
      : current.options && current.options.length === 4
      ? current.options
      : [
          "Option A",
          "Option B",
          "Option C",
          "Option D",
        ];

  // Extract clean question line
  const questionLine = current.questionText
    .split("\n")
    .find((l) => l.toLowerCase().includes("q")) ||
    current.questionText;

  // ---------------- SUBMIT ----------------
  const submitAnswer = () => {
    if (!selected) return;

    setSubmitting(true);
    const token = localStorage.getItem("BLOCKVERSE_TOKEN");

    fetch(`${API}/api/round3/submit`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        bombNumber: Number(id),
        questionNumber: current.questionNumber,
        answer: selected,
      }),
    })
      .then(() => {
        setSelected("");
        initRound();
        setSubmitting(false);
      })
      .catch((err) => {
        console.error("Submit error:", err);
        setSubmitting(false);
      });
  };

  // ---------------- UI ----------------
  return (
    <div className="flex-1 p-12 flex flex-col items-center gap-10 text-white">

      <GlitchText
        text={`BOMB ${id} — CORE DIFFUSION`}
        className="text-red-500 text-xl"
      />

      {/* CORE ANIMATION */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
        className="relative w-56 h-56 rounded-full border-4 border-red-500 shadow-[0_0_60px_rgba(255,0,0,0.7)]"
      >
        <div className="absolute inset-6 rounded-full border border-red-500/40" />
        <div className="absolute inset-12 rounded-full bg-red-500/10" />
      </motion.div>

      {/* QUESTION */}
      <div className="max-w-3xl text-center font-mono text-cyan-300">
        Q{current.questionNumber} / {bomb.questions.length}

        <div className="mt-4 text-white whitespace-pre-line">
          {questionLine}
        </div>
      </div>

      {/* OPTIONS */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        {options.map((opt, i) => {
          const letter = letters[i];

          return (
            <button
              key={i}
              onClick={() => setSelected(letter)}
              className={`px-6 py-3 border font-mono transition-all
                ${
                  selected === letter
                    ? "border-green-400 bg-green-400/10 text-green-300"
                    : "border-cyan-500 text-cyan-300 hover:bg-cyan-500/10"
                }`}
            >
              <span className="mr-2">{letter}.</span>
              {opt}
            </button>
          );
        })}
      </div>

      {/* SUBMIT */}
      <NeonButton
        onClick={submitAnswer}
        disabled={!selected || submitting}
      >
        {submitting ? "VERIFYING…" : "SUBMIT"}
      </NeonButton>

      {/* STATUS */}
      <div className="text-red-400 font-mono text-sm">
        Mistakes: {bomb.mistakes}
      </div>
    </div>
  );
};

export default Round3Bomb;
