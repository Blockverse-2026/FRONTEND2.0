import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import GlitchText from "../components/GlitchText";

const bombs = ["A", "B", "C"].map((id) => ({
  id,
  diffused: localStorage.getItem(`bomb_${id}_diffused`) === "true",
}));

const Round3 = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 p-12 flex flex-col items-center gap-16">
      <GlitchText
        text="BOMB DIFFUSION"
        className="text-red-500 text-2xl"
      />

      <div className="flex gap-24">
        {bombs.map((bomb) => (
          <motion.div
            key={bomb.id}
            whileHover={!bomb.diffused ? { scale: 1.05 } : {}}
            onClick={() =>
              !bomb.diffused && navigate(`/round3/bomb/${bomb.id}`)
            }
            className={`relative w-48 h-48 rounded-full border-4
              ${
                bomb.diffused
                  ? "border-green-500 opacity-60 cursor-not-allowed"
                  : "border-red-500 cursor-pointer shadow-[0_0_40px_rgba(255,0,0,0.6)]"
              }`}
          >
            <div className="absolute inset-4 rounded-full border border-current animate-pulse" />
            <div className="absolute inset-8 rounded-full bg-current/10" />

            <div className="absolute inset-0 flex flex-col items-center justify-center font-orbitron">
              <span className="text-xl text-red-400">
                 {bomb.id}
              </span>

              {bomb.diffused ? (
                <span className="mt-2 text-green-400 text-sm flex items-center gap-2">
                  ✔ DIFFUSED
                </span>
              ) : (
                <span className="mt-2 text-xs text-gray-400">
                  READY
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Round3;
