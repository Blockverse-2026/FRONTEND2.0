import React, { useState, useEffect } from 'react';
import { motion as Motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import TerminalCard from '../components/TerminalCard';
import NeonButton from '../components/NeonButton';
import { useGame } from '../context/GameContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, setAnaDialogue } = useGame();
  const [formData, setFormData] = useState({ teamId: '', password: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [processMessage, setProcessMessage] = useState("Verifying Credentials");

  useEffect(() => {
    setAnaDialogue("Authentication required. Please enter Team ID.");
  }, [setAnaDialogue]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.teamId && formData.password) {
      setIsProcessing(true);
      setProcessMessage("Verifying Credentials");
      setTimeout(() => setProcessMessage("Accessing Genova Realm..."), 1200);
      setTimeout(() => {
        login(formData.teamId);
        navigate('/dashboard');
        setIsProcessing(false);
      }, 2500);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4">
      <div className="w-full max-w-md relative">
        <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full border border-neon-cyan/30 blur-[0.5px] animate-[spin_20s_linear_infinite] pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-neon-cyan rounded" />
        </div>
        <div className="absolute -bottom-28 -right-16 w-48 h-48 rounded-full border border-neon-gold/30 blur-[0.5px] animate-[spin_30s_linear_reverse_infinite] pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-[2px] bg-neon-gold rounded" />
        </div>
        <div className="absolute -inset-10 bg-neon-cyan/10 blur-2xl rounded-xl pointer-events-none" />
        <div className="absolute -top-8 left-0 h-px w-40 bg-neon-cyan/30 pointer-events-none" />
        <div className="absolute -top-8 left-0 h-10 w-px bg-neon-cyan/30 pointer-events-none" />
        <TerminalCard title="SYSTEM ACCESS">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-neon-cyan font-mono text-sm mb-2">TEAM ID</label>
              <input
                type="text"
                value={formData.teamId}
                onChange={(e) => setFormData({...formData, teamId: e.target.value})}
                className="w-full bg-black/50 border border-neon-cyan/30 text-neon-cyan p-3 font-mono focus:border-neon-cyan focus:outline-none focus:shadow-neon transition-all"
                placeholder="ENTER TEAM ID"
              />
            </div>
            
            <div>
              <label className="block text-neon-cyan font-mono text-sm mb-2">PASSWORD</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="w-full bg-black/50 border border-neon-cyan/30 text-neon-cyan p-3 font-mono focus:border-neon-cyan focus:outline-none focus:shadow-neon transition-all"
                placeholder="********"
              />
            </div>

            <NeonButton type="submit" className="w-full">
              LOGIN TO GENOVA REALM
            </NeonButton>
          </form>
        </TerminalCard>
        {isProcessing && (
          <Motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-[9999]"
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <div className="w-28 h-28 rounded-full border-4 border-white/20" />
                  <div className="absolute inset-0 rounded-full border-4 border-t-white/80 border-l-transparent border-b-transparent border-r-transparent animate-spin" />
                </div>
                <div className="flex gap-1 mt-6 items-end h-10">
                  {[...Array(18)].map((_, i) => (
                    <Motion.div 
                      key={i}
                      initial={{ height: 8, opacity: 0.6 }}
                      animate={{ height: [8, 32, 12, 26, 8] }}
                      transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.06, ease: "easeInOut" }}
                      className="w-1 bg-white/80"
                    />
                  ))}
                </div>
                <Motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-6 font-orbitron text-neon-cyan text-sm uppercase tracking-widest"
                >
                  {processMessage}
                </Motion.div>
              </div>
            </div>
          </Motion.div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
