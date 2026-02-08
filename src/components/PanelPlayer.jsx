import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LOCK_TIME = 5000;    
const AUTO_TIME = 15000;   

const PanelPlayer = ({ panels = [], onComplete }) => {
  const [index, setIndex] = useState(0);
  const [canSkip, setCanSkip] = useState(false);

  const lockRef = useRef(null);
  const autoRef = useRef(null);

  const clearTimers = () => {
    clearTimeout(lockRef.current);
    clearTimeout(autoRef.current);
  };

  const next = () => {
    clearTimers();
    setCanSkip(false);

    setIndex((prev) => {
      if (prev + 1 >= panels.length) {
        onComplete?.();    
        return prev;        
      }
      return prev + 1;
    });
  };

  useEffect(() => {
    if (index >= panels.length) return;

    lockRef.current = setTimeout(() => {
      setCanSkip(true);
    }, LOCK_TIME);

    autoRef.current = setTimeout(() => {
      next();
    }, AUTO_TIME);

    return clearTimers;
  }, [index]);

  useEffect(() => {
    const handler = (e) => {
      if (!canSkip) return;
      if (e.key === " " || e.key === "Enter") next();
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [canSkip]);

  if (!panels.length) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black select-none"
      onClick={canSkip ? next : undefined}
      style={{ cursor: canSkip ? "pointer" : "not-allowed" }}
    >
      <AnimatePresence mode="wait">
        {panels[index] && (
          <motion.img
            key={panels[index].img}
            src={panels[index].img}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full h-full object-contain"
            draggable={false}
          />
        )}
      </AnimatePresence>

      <div className="absolute bottom-5 left-5 text-gray-400 text-xs font-mono">
        {canSkip ? "Click or Space to Skip" : "Auto playing..."}
      </div>
    </div>
  );
};

export default PanelPlayer;
