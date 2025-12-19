import React, { useState, useEffect } from 'react';
import { motion as Motion } from 'framer-motion';
import CyberBackground from './CyberBackground';

const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState([]);
  const bootLogs = React.useMemo(() => [
    "INITIALIZING CORE SYSTEMS...",
    "LOADING ASSETS...",
    "ESTABLISHING SECURE CONNECTION...",
    "DECRYPTING USER INTERFACE...",
    "SYSTEM CHECK COMPLETE."
  ], []);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + Math.floor(Math.random() * 5) + 1;
      });
    }, 50);

    let logIndex = 0;
    const logInterval = setInterval(() => {
      if (logIndex < bootLogs.length) {
        setLogs(prev => [...prev, bootLogs[logIndex]]);
        logIndex++;
      } else {
        clearInterval(logInterval);
      }
    }, 400);

    const timeout = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => {
      clearInterval(progressInterval);
      clearInterval(logInterval);
      clearTimeout(timeout);
    };
  }, [onComplete, bootLogs]);

  return (
    <Motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      className="fixed inset-0 z-[9999] bg-bg-black flex flex-col items-start justify-center p-8 md:p-20 font-mono text-neon-cyan overflow-hidden"
    >
      <div className="absolute inset-0 opacity-50 pointer-events-none">
        <CyberBackground />
      </div>

      <div className="relative z-10 w-full max-w-2xl space-y-4">
        <Motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl md:text-4xl font-bold tracking-widest border-b-2 border-neon-cyan pb-2 inline-block mb-8"
        >
          INITIALIZING...
        </Motion.div>

        <div className="text-xl md:text-2xl font-bold mb-8">
          SYSTEM_CHECK<span className="text-neon-gold">{Math.min(progress, 100)}%</span>
        </div>

        <div className="space-y-1 h-32 overflow-hidden">
          {logs.map((log, index) => (
            <Motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-sm md:text-base text-gray-400"
            >
              <span className="text-neon-gold mr-2">&gt;</span>
              {log}
            </Motion.div>
          ))}
        </div>

        <div className="w-full h-1 bg-gray-900 mt-8 rounded-full overflow-hidden">
          <Motion.div 
            className="h-full bg-neon-cyan"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>
    </Motion.div>
  );
};

export default LoadingScreen;
