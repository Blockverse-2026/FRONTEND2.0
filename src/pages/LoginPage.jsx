import React, { useState, useEffect } from 'react';
import { motion as Motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

import TerminalCard from '../components/TerminalCard';
import NeonButton from '../components/NeonButton';
import { useGame } from '../context/GameContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, setAnaDialogue } = useGame();

  const [formData, setFormData] = useState({ teamId: '', password: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [processMessage, setProcessMessage] = useState("Verifying Credentials");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setAnaDialogue("Authentication required. Please enter Team ID.");
  }, [setAnaDialogue]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.teamId || !formData.password) return;

    setIsProcessing(true);
    setProcessMessage("Verifying Credentials...");

    try {
      const res = await fetch(
        "https://blockverse-backend.onrender.com/api/team/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setProcessMessage(data.message || "Access Denied");
        setTimeout(() => setIsProcessing(false), 2000);
        return;
      }

      const accessToken = data.data.accessToken;
      setProcessMessage("Accessing Genova Realm...");

      setTimeout(() => {
        login(formData.teamId, accessToken);
        navigate('/dashboard');
        setIsProcessing(false);
      }, 1200);

    } catch (err) {
      setProcessMessage("System Error");
      setTimeout(() => setIsProcessing(false), 2000);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-4 relative overflow-hidden">
      {/* animated overlay */}
      <Motion.div
        initial={{ backgroundPosition: '0% 0%', opacity: 0.45 }}
        animate={{ backgroundPosition: ['0% 0%', '0% 100%', '0% 0%'], opacity: [0.45, 0.6, 0.45] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.7) 100%)',
          backgroundSize: '100% 200%',
        }}
      />

      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.85)_100%)]" />

      <div className="w-full max-w-md relative">
        {/* decorative rings */}
        <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full border border-neon-cyan/30 blur-[0.5px] animate-[spin_20s_linear_infinite] pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-neon-cyan rounded" />
        </div>

        <div className="absolute -bottom-28 -right-16 w-48 h-48 rounded-full border border-neon-gold/30 blur-[0.5px] animate-[spin_30s_linear_reverse_infinite] pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-[2px] bg-neon-gold rounded" />
        </div>

        <div className="absolute -inset-10 bg-neon-cyan/10 blur-2xl rounded-xl pointer-events-none" />

        <TerminalCard title="SYSTEM ACCESS">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-neon-cyan font-mono text-sm mb-2">
                TEAM ID
              </label>
              <input
                value={formData.teamId}
                onChange={(e) =>
                  setFormData({ ...formData, teamId: e.target.value })
                }
                className="w-full bg-black/50 border border-neon-cyan/30 text-white p-3 font-mono focus:border-neon-cyan focus:outline-none"
                placeholder="ENTER TEAM ID"
              />
            </div>

            <div>
              <label className="block text-neon-cyan font-mono text-sm mb-2">
                PASSWORD
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full bg-black/50 border border-neon-cyan/30 text-white p-3 pr-12 font-mono focus:border-neon-cyan focus:outline-none"
                  placeholder="********"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neon-cyan/70 hover:text-neon-cyan"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <NeonButton type="submit" className="w-full">
              LOGIN TO GENOVA REALM
            </NeonButton>
          </form>
        </TerminalCard>

        {/* processing overlay */}
        {isProcessing && (
          <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[9999]">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex flex-col items-center">
                <div className="flex gap-1 mt-2 items-end h-10">
                  {[...Array(18)].map((_, i) => (
                    <Motion.div
                      key={i}
                      animate={{ height: [8, 32, 12, 26, 8] }}
                      transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.06 }}
                      className="w-1 bg-white/80"
                    />
                  ))}
                </div>

                <div className="mt-6 font-orbitron text-neon-cyan text-sm uppercase tracking-widest">
                  {processMessage}
                </div>
              </div>
            </div>
          </Motion.div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
