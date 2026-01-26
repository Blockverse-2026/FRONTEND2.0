import React, { useState } from 'react';
import { motion as Motion } from 'framer-motion';

const AnomalyCanister = ({ id, status, onClick, type }) => {
  
  const getColor = () => {
    switch (status) {
      case 'defused': return 'rgb(34, 197, 94)';
      case 'active': return 'rgb(234, 179, 8)';
      default: return 'rgb(239, 68, 68)';
    }
  };

  const color = getColor();
  const isDefused = status === 'defused';
  const [particleConfigs] = useState(() =>
    Array.from({ length: 5 }, () => ({
      duration: 2 + Math.random() * 2,
      delay: Math.random() * 2
    }))
  );

  return (
    <div 
      onClick={onClick}
      className={`relative group flex flex-col items-center gap-6 cursor-pointer transition-transform duration-300 ${status === 'locked' ? 'hover:scale-105' : ''}`}
    >
      {/* Canister Structure */}
      <div className="relative w-40 h-72 md:w-48 md:h-80">
        
        {/* Top Cap */}
        <div className="absolute top-0 left-0 right-0 h-12 bg-gray-900 border-2 border-gray-700 rounded-t-3xl z-20 flex items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.8)]">
          <div className="w-20 h-2 bg-gray-800 rounded-full overflow-hidden">
             <Motion.div 
               animate={{ opacity: [0.5, 1, 0.5] }}
               transition={{ duration: 2, repeat: Infinity }}
               className="h-full w-full"
               style={{ backgroundColor: color }}
             />
          </div>
        </div>

        {/* Glass Cylinder Body */}
        <div className="absolute top-10 bottom-10 left-2 right-2 bg-gradient-to-r from-white/5 via-white/10 to-white/5 border-x border-white/20 z-10 overflow-hidden backdrop-blur-sm">
          
          {/* Inner Energy Core */}
          <Motion.div 
            initial={{ height: "20%" }}
            animate={{ 
              height: isDefused ? "100%" : ["40%", "60%", "40%"],
              opacity: isDefused ? 0.8 : 0.6
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-0 left-0 right-0 mx-auto w-3/4 blur-xl"
            style={{ 
              background: `linear-gradient(to top, ${color}, transparent)`,
              boxShadow: `0 0 40px ${color}`
            }}
          />

          {/* Data Particles */}
          {!isDefused && (
            <>
              {particleConfigs.map((cfg, i) => (
                <Motion.div
                  key={i}
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: "-100%", opacity: [0, 1, 0] }}
                  transition={{ 
                    duration: cfg.duration, 
                    repeat: Infinity,
                    delay: cfg.delay,
                    ease: "linear"
                  }}
                  className="absolute left-0 right-0 h-px bg-white/50 mx-4"
                />
              ))}
            </>
          )}

          {/* Heartbeat/Pulse Line */}
          <div className="absolute inset-0 flex items-center justify-center opacity-80">
             <svg width="100%" height="100%" viewBox="0 0 200 100" preserveAspectRatio="none">
               <Motion.path
                 d="M0,50 L80,50 L90,20 L110,80 L120,50 L200,50"
                 fill="none"
                 stroke={color}
                 strokeWidth="2"
                 strokeLinecap="round"
                 initial={{ pathLength: 0, opacity: 0 }}
                 animate={{ 
                   pathLength: [0, 1, 0], 
                   opacity: [0, 1, 0],
                   x: [-100, 100] 
                 }}
                 transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
               />
             </svg>
          </div>
        </div>

        {/* Bottom Cap */}
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gray-900 border-2 border-gray-700 rounded-b-3xl z-20 flex items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.8)]">
           <div className="w-8 h-8 rounded-full border-2 border-gray-600 flex items-center justify-center">
             <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color }} />
           </div>
        </div>

        {/* Outer Glow */}
        <div 
          className="absolute inset-0 rounded-3xl opacity-20 transition-opacity duration-300 group-hover:opacity-40"
          style={{ boxShadow: `0 0 50px ${color}` }}
        />
      </div>

      {/* Label */}
      <div className="relative">
        <div 
          className="px-6 py-2 border rounded bg-black/80 backdrop-blur text-sm font-mono tracking-wider uppercase whitespace-nowrap"
          style={{ 
            borderColor: color, 
            color: color,
            boxShadow: `0 0 10px ${color}40`
          }}
        >
          ANOMALY {id} — {type}
        </div>
      </div>
    </div>
  );
};

export default AnomalyCanister;