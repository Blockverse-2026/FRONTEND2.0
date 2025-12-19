import React from 'react';
import { motion as Motion } from 'framer-motion';
import { twMerge } from 'tailwind-merge';

const NeonButton = ({ children, onClick, variant = 'primary', className, ...props }) => {
  const baseStyles = "relative px-6 py-3 font-orbitron font-bold uppercase tracking-wider transition-all duration-200 border-2 overflow-hidden group";
  
  const variants = {
    primary: "border-neon-cyan text-neon-cyan hover:bg-neon-cyan/10 hover:shadow-neon",
    secondary: "border-neon-gold text-neon-gold hover:bg-neon-gold/10 hover:shadow-neon-gold",
    danger: "border-red-500 text-red-500 hover:bg-red-500/10 hover:shadow-neon-red",
  };

  return (
    <Motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={twMerge(baseStyles, variants[variant], className)}
      onClick={onClick}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors" />
      <div className="absolute top-0 left-0 w-full h-[2px] bg-current opacity-0 group-hover:opacity-50 animate-scanline" />
    </Motion.button>
  );
};

export default NeonButton;
