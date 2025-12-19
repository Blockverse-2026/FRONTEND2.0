import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const GlitchText = ({ text, as = 'h1', className, size = 'large' }) => {
  const isLarge = size === 'large';
  const Tag = as;
  
  return (
    <div className={twMerge("relative inline-block group", className)}>
      <Tag className={clsx(
        "relative z-10 font-orbitron font-bold tracking-widest uppercase animate-glitch bg-gradient-to-r from-white via-white/90 to-[#00f6ff] text-transparent bg-clip-text drop-shadow-[0_0_8px_rgba(255,255,255,0.35),_0_0_10px_rgba(0,246,255,0.3)]",
        isLarge ? "text-5xl md:text-7xl" : "text-xl md:text-2xl"
      )}>
        {text}
      </Tag>
      
      <Tag 
        aria-hidden="true"
        className={clsx(
          "absolute top-0 left-0 z-0 animate-glitch text-neon-gold transition-opacity duration-300 will-change-transform",
          isLarge ? "text-5xl md:text-7xl" : "text-xl md:text-2xl",
          "opacity-40 group-hover:opacity-100"
        )}
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)', transform: 'translate(-2px)' }}
      >
        {text}
      </Tag>
      <Tag 
        aria-hidden="true"
        className={clsx(
          "absolute top-0 left-0 z-0 animate-glitch text-neon-cyan transition-opacity duration-300 will-change-transform",
          isLarge ? "text-5xl md:text-7xl" : "text-xl md:text-2xl",
          "opacity-40 group-hover:opacity-100"
        )}
        style={{ clipPath: 'polygon(0 80%, 100% 20%, 100% 100%, 0 100%)', transform: 'translate(2px)', animationDirection: 'reverse' }}
      >
        {text}
      </Tag>
      
      <Tag 
        aria-hidden="true"
        className={clsx(
          "absolute top-0 left-0 z-0 animate-pulse text-neon-magenta transition-opacity duration-100 will-change-transform",
          isLarge ? "text-5xl md:text-7xl" : "text-xl md:text-2xl",
          "opacity-0 group-hover:opacity-60 blur-[1px]"
        )}
        style={{ clipPath: 'inset(10% 0 40% 0)', transform: 'translate(4px, 0)' }}
      >
        {text}
      </Tag>
    </div>
  );
};

export default GlitchText;
