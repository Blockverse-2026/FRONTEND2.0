import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import GlitchText from "../components/GlitchText";

const API = "https://blockverse-backend.onrender.com";

const Round3 = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("BLOCKVERSE_TOKEN");

    fetch(`${API}/api/round3/init`, {
      method: "POST", // ✅ POST
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => setData(res.data))
      .catch((err) => console.error("Round3 hub init error:", err));
  }, []);

  if (!data) {
    return (
      <div className="flex-1 flex items-center justify-center text-cyan-400 font-mono">
        Initializing bombs…
      </div>
    );
  }

  return (
    <div className="flex-1 p-12 flex flex-col items-center gap-16">
      <GlitchText text="BOMB DIFFUSION" className="text-red-500 text-2xl" />

      <div className="flex gap-24">
        {data.bombs.map((bomb) => {
          const diffused = bomb.questions.every((q) => q.solved);

          return (
            <motion.div
              key={bomb.bombNumber}
              whileHover={!diffused ? { scale: 1.05 } : {}}
              onClick={() =>
                !diffused && navigate(`/round3/bomb/${bomb.bombNumber}`)
              }
              className={`relative w-48 h-48 rounded-full border-4
                ${
                  diffused
                    ? "border-green-500 opacity-60 cursor-not-allowed"
                    : "border-red-500 cursor-pointer shadow-[0_0_40px_rgba(255,0,0,0.6)]"
                }`}
            >
              <div className="absolute inset-4 rounded-full border border-current animate-pulse" />
              <div className="absolute inset-8 rounded-full bg-current/10" />

              <div className="absolute inset-0 flex flex-col items-center justify-center font-orbitron">
                <span className="text-xl text-red-400">
                  BOMB {bomb.bombNumber}
                </span>

                {diffused ? (
                  <span className="mt-2 text-green-400 text-sm">✔ DIFFUSED</span>
                ) : (
                  <span className="mt-2 text-xs text-gray-400">READY</span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Round3;
