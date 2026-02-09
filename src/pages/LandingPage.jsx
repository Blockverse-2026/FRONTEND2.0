import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import GlitchText from "../components/GlitchText";
import NeonButton from "../components/NeonButton";
import CyberBackground from "../components/CyberBackground";
import { useGame } from "../context/GameContext";
import { glitchAudio } from "../utils/glitchAudio";

const LandingPage = () => {
  const navigate = useNavigate();
  const { setAnaDialogue } = useGame();
  const [glitchTrigger, setGlitchTrigger] = useState(0);

  useEffect(() => {
    setAnaDialogue("Connection detected. Identify yourself to proceed.");
    const initAudio = () => glitchAudio.init();
    window.addEventListener("click", initAudio, { once: true });
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setGlitchTrigger((prev) => prev + 1);
        if (Math.random() > 0.5) glitchAudio.playGlitch();
      }
    }, 2000);

    return () => {
      window.removeEventListener("click", initAudio);
      clearInterval(interval);
    };
  }, [setAnaDialogue]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
        delayChildren: 0.5,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0, scale: 0.9 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const heroGlitchVariants = {
    normal: { x: 0, filter: "hue-rotate(0deg)" },
    glitch: {
      x: [-5, 5, -5, 0],
      filter: [
        "hue-rotate(0deg)",
        "hue-rotate(90deg)",
        "hue-rotate(-90deg)",
        "hue-rotate(0deg)",
      ],
      transition: { duration: 0.2 },
    },
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 relative overflow-hidden min-h-screen">
      <CyberBackground />

      <Motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="z-10 text-center space-y-12 max-w-4xl w-full"
      >
        <Motion.div
          animate={glitchTrigger % 2 === 0 ? "normal" : "glitch"}
          variants={heroGlitchVariants}
          className="relative"
        >
          <Motion.div variants={itemVariants} className="relative inline-block">
            <div className="relative scale-125 md:scale-150">
              <GlitchText text="BLOCKVERSE" size="large" />
              <div className="absolute -inset-8 border-t border-b border-neon-cyan/20 animate-pulse-fast pointer-events-none" />
            </div>
          </Motion.div>
        </Motion.div>

        <Motion.div variants={itemVariants} className="space-y-4 relative">
          <h2 className="text-2xl md:text-3xl font-orbitron text-neon-gold tracking-[0.2em] uppercase drop-shadow-[0_0_10px_rgba(255,0,255,0.5)]">
            ENTER GENOVA REALM
          </h2>
        </Motion.div>

        <Motion.div variants={itemVariants} className="pt-8">
          <NeonButton
            onClick={() => {
              glitchAudio.playGlitch();
              navigate("/login");
            }}
            className="text-lg px-12 py-4"
            onMouseEnter={() => glitchAudio.playNoiseBurst(0)}
          >
            INITIALIZE CONNECTION &gt;&gt;
          </NeonButton>

          <Motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{
              delay: 2,
              duration: 1,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="mt-4 text-[10px] text-neon-green font-mono uppercase tracking-widest"
          >
            v2.0.4 // SYSTEM READY
          </Motion.p>
        </Motion.div>
      </Motion.div>

      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,#000_100%)] z-20 opacity-80" />
    </div>
  );
};

export default LandingPage;
