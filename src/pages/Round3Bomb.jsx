import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import GlitchText from "../components/GlitchText";
import NeonButton from "../components/NeonButton";

const QUESTIONS = [
  {
    q: "What does HTTPS add over HTTP?",
    options: [
      "Encryption via TLS",
      "Faster speed",
      "Server-side rendering",
      "Caching only",
    ],
    a: 0,
  },
  {
    q: "Which OSI layer does TCP belong to?",
    options: ["Application", "Transport", "Network", "Data Link"],
    a: 1,
  },
  {
    q: "Which HTTP status code means Unauthorized?",
    options: ["401", "403", "404", "500"],
    a: 0,
  },
  {
    q: "Which JavaScript feature handles async operations?",
    options: ["Promises", "Hoisting", "Prototypes", "Closures"],
    a: 0,
  },
  {
    q: "Which protocol secures data in transit?",
    options: ["TLS", "FTP", "SMTP", "ICMP"],
    a: 0,
  },
];

const TOTAL_TIME = 90; // seconds

const Round3Bomb = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [qIndex, setQIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [failed, setFailed] = useState(false);
  const [success, setSuccess] = useState(false);

  // TIMER
  useEffect(() => {
    if (failed || success) return;

    if (timeLeft <= 0) {
      setFailed(true);
      return;
    }

    const t = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(t);
  }, [timeLeft, failed, success]);

  const handleAnswer = (i) => {
    if (i !== QUESTIONS[qIndex].a) {
      setFailed(true);
      return;
    }

    if (qIndex === 4) {
        localStorage.setItem(`bomb_${id}_diffused`, "true");
        setSuccess(true);
    

    } else {
      setQIndex((q) => q + 1);
    }
  };

  return (
    <div className="flex-1 p-12 flex flex-col items-center gap-10">

      
      <div
        className={`font-mono text-xl tracking-widest ${
          timeLeft <= 15 ? "text-red-500 animate-pulse" : "text-cyan-400"
        }`}
      >
        ⏱ {Math.floor(timeLeft / 60)}:
        {(timeLeft % 60).toString().padStart(2, "0")}
      </div>

      
      {failed && (
        <>
          <GlitchText
            text="CORE MELTDOWN"
            className="text-red-600 text-3xl"
          />
          <NeonButton variant="danger" onClick={() => navigate("/round3")}>
            RETURN
          </NeonButton>
        </>
      )}

      {/* SUCCESS */}
      {success && (
        <>
          <GlitchText
            text={`BOMB ${id} DIFFUSED`}
            className="text-green-400 text-3xl"
          />
          <NeonButton variant="success" onClick={() => navigate("/round3")}>
            RETURN TO CORE
          </NeonButton>
        </>
      )}

      {/* QUESTION MODE */}
      {!failed && !success && (
        <>
          <GlitchText
            text={`BOMB ${id} —  ACCESS`}
            className="text-red-500 text-xl"
          />

          {/* CORE */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
            className="relative w-56 h-56 rounded-full border-4 border-red-500
                       shadow-[0_0_60px_rgba(255,0,0,0.7)]"
          >
            <div className="absolute inset-6 rounded-full border border-red-500/40" />
            <div className="absolute inset-12 rounded-full bg-red-500/10" />
          </motion.div>

          {/* QUESTION */}
          <div className="max-w-3xl text-center space-y-6">
            <div className="font-mono text-cyan-400">
              QUESTION {qIndex + 1} / 5
            </div>

            <h2 className="text-2xl font-orbitron text-white">
              {QUESTIONS[qIndex].q}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {QUESTIONS[qIndex].options.map((opt, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleAnswer(i)}
                  className="border border-cyan-500/50 p-4 font-mono text-cyan-300
                             hover:bg-cyan-500/10"
                >
                  {opt}
                </motion.button>
              ))}
            </div>
          </div>

          {/* STABILITY BAR */}
          <div className="w-96 h-2 bg-gray-800">
            <div
              className="h-2 bg-red-500 transition-all"
              style={{ width: `${(timeLeft / TOTAL_TIME) * 100}%` }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Round3Bomb;
