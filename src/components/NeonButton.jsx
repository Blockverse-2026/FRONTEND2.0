import React from 'react';
import { motion as Motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

const NeonButton = ({ children, onClick, variant = 'primary', className, ...props }) => {
  const baseStyles = "relative px-6 py-3 font-orbitron font-bold uppercase tracking-wider transition-all duration-200 border-2 overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10 hover:shadow-neon",
    blue: "border-neon-blue text-neon-blue hover:bg-neon-blue/10 shadow-[0_0_10px_#0070ff,0_0_20px_#0070ff]",
    indigo: "border-neon-indigo text-neon-indigo hover:bg-neon-indigo/10 shadow-[0_0_10px_#4b00ff,0_0_20px_#4b00ff]",
    secondary: "border-neon-gold text-neon-gold hover:bg-neon-gold/10 hover:shadow-neon-gold",
    danger: "border-red-500 text-red-500 hover:bg-red-500/10 hover:shadow-neon-red",
  };

  return (
    <Motion.button
      whileHover={{ scale: 1.02, x: 5 }}
      whileTap={{ scale: 0.98 }}
      className={twMerge(baseStyles, variants[variant], className)}
      onClick={onClick}
      {...props}
    >
      {/* Background Tech Pattern */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-10 pointer-events-none bg-[linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:10px_10px] transition-opacity duration-300" />

      {/* Scanning Line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-current opacity-0 group-hover:opacity-100 group-hover:animate-scanline blur-[1px] transition-opacity" />

      {/* Tech Corners */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-current opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:top-1 group-hover:left-1" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-current opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:bottom-1 group-hover:right-1" />

      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>

      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors" />
    </Motion.button>
  );
};

export default NeonButton;
