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
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // INIT (POST)
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
      .catch((err) => console.error("Round3 init error:", err));
  };

  useEffect(() => {
    initRound();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex-1 flex items-center justify-center text-cyan-400 font-mono">
        Initializing core…
      </div>
    );
  }

  const bomb = data.bombs.find(
    (b) => String(b.bombNumber) === String(id)
  );

  if (!bomb) {
    return <div className="text-red-400">Bomb not found</div>;
  }

  const current = bomb.questions.find((q) => !q.solved);
  const diffused = !current;

  const submitAnswer = () => {
  if (!current || !answer.trim()) return;

  const token = localStorage.getItem("BLOCKVERSE_TOKEN");
  setSubmitting(true);

  fetch(`${API}/api/round3/submit`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      bombNumber: Number(id),                
      questionNumber: current.questionNumber,
      answer: answer.trim().toUpperCase(),  
    }),
  })
    .then((res) => res.json())
    .then(() => {
      setAnswer("");

      // 🔁 re-init after submit
      return fetch("https://blockverse-backend.onrender.com/api/round3/init", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
    })
    .then((res) => res.json())
    .then((res) => {
      setData(res.data);
      setSubmitting(false);
    })
    .catch((err) => {
      console.error("Submit error:", err);
      setSubmitting(false);
    });
};


  return (
    <div className="flex-1 p-12 flex flex-col items-center gap-10 text-white">
      <GlitchText
        text={`BOMB ${id} — CORE DIFFUSION`}
        className="text-red-500 text-xl"
      />

      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
        className="relative w-56 h-56 rounded-full border-4 border-red-500 shadow-[0_0_60px_rgba(255,0,0,0.7)]"
      >
        <div className="absolute inset-6 rounded-full border border-red-500/40" />
        <div className="absolute inset-12 rounded-full bg-red-500/10" />
      </motion.div>

      {diffused ? (
        <>
          <div className="text-green-400 text-2xl font-orbitron">
            ✔ BOMB DIFFUSED
          </div>
          <NeonButton onClick={() => navigate("/round3")}>
            RETURN TO HUB
          </NeonButton>
        </>
      ) : (
        <>
          <div className="text-center max-w-2xl font-mono text-cyan-300">
            Q{current.questionNumber} / {bomb.questions.length}
            <div className="mt-2 text-white">{current.questionText}</div>
          </div>

          <input
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="ENTER ANSWER"
            className="px-4 py-2 bg-black border border-cyan-500 text-cyan-300 font-mono text-center uppercase"
          />

          <NeonButton
            onClick={submitAnswer}
            disabled={submitting || !answer.trim()}
          >
            {submitting ? "VERIFYING…" : "SUBMIT"}
          </NeonButton>

          <div className="text-red-400 font-mono text-sm">
            Mistakes: {bomb.mistakes}
          </div>
        </>
      )}
    </div>
  );
};

export default Round3Bomb;
