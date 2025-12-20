import React from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import TerminalCard from './TerminalCard';
import NeonButton from './NeonButton';

const Modal = ({ isOpen, onClose, title, children, showClose = true, fullScreen = false }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <Motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className={`relative w-full ${fullScreen ? 'max-w-none' : 'max-w-lg'} z-10`}
          >
            <TerminalCard title={title} headerColor="gold" className={`border-neon-gold shadow-neon-gold ${fullScreen ? 'h-[85vh]' : ''}`}>
              {children}
              {showClose && (
                <div className="mt-6 flex justify-end">
                  <NeonButton variant="secondary" onClick={onClose} className="text-sm py-2">
                    Close
                  </NeonButton>
                </div>
              )}
            </TerminalCard>
          </Motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
