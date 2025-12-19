import React from 'react';
import { twMerge } from 'tailwind-merge';

const TerminalCard = ({ title, children, className, headerColor = 'cyan' }) => {
  const borderClass = headerColor === 'gold' ? 'border-neon-gold' : 'border-neon-cyan';
  const textClass = headerColor === 'gold' ? 'text-neon-gold' : 'text-neon-cyan';
  const bgClass = headerColor === 'gold' ? 'bg-neon-gold/10' : 'bg-neon-cyan/10';

  return (
    <div className={twMerge(`border ${borderClass} bg-bg-dark/80 backdrop-blur-sm w-full`, className)}>
      <div className={`flex items-center justify-between px-4 py-2 border-b ${borderClass} ${bgClass}`}>
        <span className={`font-orbitron font-bold text-sm uppercase ${textClass}`}>
          {title}
        </span>
        
      </div>
      
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

export default TerminalCard;
