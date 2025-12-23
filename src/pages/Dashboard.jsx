import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ShoppingBag, Database, Activity, Lock, Check } from 'lucide-react';
import TerminalCard from '../components/TerminalCard';
import NeonButton from '../components/NeonButton';
import GlitchText from '../components/GlitchText';
import { useGame } from '../context/GameContext';
import { motion as Motion, animate, useMotionValue } from 'framer-motion';
import MeteorShower from '../components/MeteorShower';
import Modal from '../components/Modal';

const DASHBOARD_INTRO = [
  "Welcome to BlockVerse. I'm ANA, your system AI.",
  "Story: A fractured network hides critical data fragments.",
  "Rounds: FIREWALL, MARKETPLACE, ANOMALY. Navigate, solve, progress."
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { gameState, setAnaDialogue, setAnaVisible, markIntroSeen } = useGame();
  const pointsMV = useMotionValue(0);
  const tokensMV = useMotionValue(0);
  const [pointsDisplay, setPointsDisplay] = useState(0);
  const [tokensDisplay, setTokensDisplay] = useState(0);
  const [introOpen, setIntroOpen] = useState(false);
  const [introStep, setIntroStep] = useState(0);
  const boxRef = useRef(null);
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const [reveal, setReveal] = useState(0);
  const starsRef = useRef([]);

  // const isRound2Locked = !gameState.completedRounds.includes('round1');
  const isRound2Locked = false; // 🔓 TEMP UNLOCK FOR TESTING

  const isRound3Locked = !gameState.completedRounds.includes('round2');

  const isRound1Complete = gameState.completedRounds.includes('round1');
  const isRound2Complete = gameState.completedRounds.includes('round2');
  const isRound3Complete = gameState.completedRounds.includes('round3');

  useEffect(() => {
    queueMicrotask(() => {
      if (!gameState.seenIntro) {
        setIntroOpen(true);
        setAnaDialogue(DASHBOARD_INTRO[0]);
      } else {
        setIntroOpen(false);
      }
      setAnaVisible(false);
    });
  }, [setAnaDialogue, setAnaVisible, gameState.seenIntro]);

  useEffect(() => {
    const stopPoints = animate(pointsMV, gameState.points ?? 0, { duration: 0.6, ease: 'easeOut' });
    const stopTokens = animate(tokensMV, gameState.tokens ?? 0, { duration: 0.6, ease: 'easeOut' });
    const unsubPoints = pointsMV.on('change', v => setPointsDisplay(Math.round(v)));
    const unsubTokens = tokensMV.on('change', v => setTokensDisplay(Math.round(v)));
    return () => {
      stopPoints.stop();
      stopTokens.stop();
      unsubPoints();
      unsubTokens();
    };
  }, [gameState.points, gameState.tokens, pointsMV, tokensMV]);

  useEffect(() => {
    if (starsRef.current.length === 0) {
      starsRef.current = Array.from({ length: 28 }, () => ({
        x: Math.random(),
        y: Math.random(),
        size: Math.random() * 1.2 + 0.4,
        vx: (Math.random() * 0.08 + 0.02) * (Math.random() < 0.5 ? -1 : 1),
        vy: (Math.random() * 0.08 + 0.02)
      }));
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const resize = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };
    resize();
    let raf;
    const loop = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      const px = mouseRef.current.x * 0.02;
      const py = mouseRef.current.y * 0.02;
      starsRef.current.forEach(s => {
        s.x += s.vx * 0.0006;
        s.y += s.vy * 0.0006;
        if (s.x < 0) s.x = 1;
        if (s.x > 1) s.x = 0;
        if (s.y < 0) s.y = 1;
        if (s.y > 1) s.y = 0;
        const x = s.x * w + px;
        const y = s.y * h + py;
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.beginPath();
        ctx.arc(x, y, s.size, 0, Math.PI * 2);
        ctx.fill();
      });
      raf = requestAnimationFrame(loop);
    };
    const onResize = () => resize();
    window.addEventListener('resize', onResize);
    loop();
    return () => {
      window.removeEventListener('resize', onResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      mouseRef.current = { x: Math.max(0, Math.min(rect.width, x)), y: Math.max(0, Math.min(rect.height, y)) };
      const pct = Math.min(1, Math.max(0, x / rect.width));
      setReveal(pct);
    };
    const onLeave = () => {
      setReveal(0);
    };
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    el.addEventListener('touchmove', onMove, { passive: false });
    el.addEventListener('touchend', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      el.removeEventListener('touchmove', onMove);
      el.removeEventListener('touchend', onLeave);
    };
  }, []);
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 140, damping: 16 } }
  };

  return (
    <>
      <MeteorShower />
      <Motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 p-6 md:p-12 space-y-8"
      >
      <Motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-gray-400 font-mono text-sm">CURRENT SESSION</h2>
          <GlitchText text={gameState.teamId ? `TEAM ${gameState.teamId}` : "UNKNOWN TEAM"} size="small" />
        </div>
        <div className="flex gap-6 text-right">
          <div>
            <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-neon-cyan font-bold text-xl">
              {pointsDisplay}
            </Motion.div>
            <div className="text-xs text-gray-400">POINTS</div>
          </div>
          <div>
            <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-neon-gold font-bold text-xl">
              {tokensDisplay}
            </Motion.div>
            <div className="text-xs text-gray-400">TOKENS</div>
          </div>
        </div>
      </Motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Motion.div variants={itemVariants} className="md:col-span-1 md:row-span-2">
          <Motion.div whileHover={{ scale: 1.01 }}>
            <TerminalCard title="DATA FRAGMENTS" className="h-full">
              <div className="space-y-4">
                {gameState.fragments.length === 0 ? (
                  <Motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8 text-gray-500 font-mono text-sm border border-dashed border-gray-700 p-4"
                  >
                    NO FRAGMENTS ACQUIRED
                  </Motion.div>
                ) : (
                  gameState.fragments.map((frag, idx) => (
                    <Motion.div 
                      key={idx} 
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-center gap-2 text-neon-green text-sm font-mono"
                    >
                      <Database size={16} />
                      <span>{frag.toUpperCase()} FRAGMENT</span>
                    </Motion.div>
                  ))
                )}
              </div>
            </TerminalCard>
          </Motion.div>
        </Motion.div>

        <Motion.div variants={itemVariants} className="md:col-span-1 space-y-4">
          <Motion.div variants={itemVariants}>
            <NeonButton 
              className="w-full flex items-center justify-between group"
              onClick={() => navigate('/round1')}
            >
              <div className="flex flex-col items-start">
                <span>ROUND 1: FIREWALL</span>
                {isRound1Complete && (
                  <div className="flex items-center gap-1 text-neon-green text-xs mt-1">
                    <Check size={12} />
                    <span>COMPLETED</span>
                  </div>
                )}
              </div>
              <Shield className="group-hover:text-white transition-colors" size={20} />
            </NeonButton>
          </Motion.div>
          
          <Motion.div variants={itemVariants}>
            <NeonButton 
              className={`w-full flex items-center justify-between group ${isRound2Locked ? 'opacity-50 cursor-not-allowed' : ''}`}
              variant="secondary"
              onClick={() => !isRound2Locked && navigate('/round2')}
            >
              <div className="flex flex-col items-start">
                <span>ROUND 2: MARKETPLACE</span>
                {isRound2Locked && <Lock size={16} className="mt-1" />}
                {isRound2Complete && (
                  <div className="flex items-center gap-1 text-neon-green text-xs mt-1">
                    <Check size={12} />
                    <span>COMPLETED</span>
                  </div>
                )}
              </div>
              {!isRound2Locked && <ShoppingBag className="group-hover:text-white transition-colors" size={20} />}
            </NeonButton>
          </Motion.div>

          <Motion.div variants={itemVariants}>
            <NeonButton 
              className={`w-full flex items-center justify-between group ${isRound3Locked ? 'opacity-50 cursor-not-allowed' : ''}`}
              variant="danger"
              onClick={() => !isRound3Locked && navigate('/round3')}
            >
              <div className="flex flex-col items-start">
                <span>ROUND 3: ANOMALY</span>
                {isRound3Locked && <Lock size={16} className="mt-1" />}
                {isRound3Complete && (
                  <div className="flex items-center gap-1 text-neon-green text-xs mt-1">
                    <Check size={12} />
                    <span>COMPLETED</span>
                  </div>
                )}
              </div>
              {!isRound3Locked && <Activity className="group-hover:text-white transition-colors" size={20} />}
            </NeonButton>
          </Motion.div>
          
          
        </Motion.div>

        <Motion.div variants={itemVariants} className="md:col-span-1">
          <Motion.div whileHover={{ scale: 1.01 }}>
            <TerminalCard title="SYSTEM STATUS" headerColor="gold">
              <div className="space-y-4 font-mono text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">CONNECTION</span>
                  <span className="text-neon-green">STABLE</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">SECURITY</span>
                  <span className="text-neon-cyan">{gameState.securityLevel}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">LATENCY</span>
                  <span className="text-neon-gold">12ms</span>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-800">
                  <div className="w-full bg-gray-900 h-2 rounded-full overflow-hidden">
                    <Motion.div 
                      initial={{ width: "0%" }}
                      animate={{ width: "75%" }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="bg-neon-cyan h-full"
                    />
                  </div>
                  <div className="flex justify-between text-xs mt-1 text-gray-500">
                    <span>SYSTEM LOAD</span>
                    <span>75%</span>
                  </div>
                </div>
              </div>
            </TerminalCard>
          </Motion.div>
        </Motion.div>
        
        <Motion.div variants={itemVariants} className="hidden md:block md:col-span-2 md:col-start-2 md:row-start-2">
          <div ref={boxRef} className="relative w-full h-56 bg-black overflow-hidden">
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative text-center">
                  <div className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white/20 via-white/10 to-transparent blur-[0.6px] whitespace-nowrap leading-tight">
                    ANA IS GUIDING YOU
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span
                      className="text-3xl md:text-5xl font-bold text-white whitespace-nowrap leading-tight inline-block"
                      style={{ clipPath: `inset(0 calc(${(1 - reveal) * 100}% - 1px) 0 0)`, willChange: 'clip-path' }}
                    >
                      ZERO TRIED TO WARN YOU
                    </span>
                  </div>
                </div>
              </div>
            </div>
        </Motion.div>
      </div>
      </Motion.div>
      <Modal 
        isOpen={introOpen}
        onClose={() => {}}
        title="ANA // SYSTEM AI"
        showClose={false}
      >
        <div className="space-y-6">
          <div className="p-4 border border-neon-cyan/30 bg-black/50 font-mono text-neon-cyan">
            {DASHBOARD_INTRO[introStep]}
          </div>
          <div className="flex justify-end gap-3">
            {introStep < DASHBOARD_INTRO.length - 1 ? (
              <NeonButton variant="secondary" onClick={() => {
                const next = introStep + 1;
                setIntroStep(next);
                setAnaDialogue(DASHBOARD_INTRO[next]);
              }}>
                NEXT &gt;&gt;
              </NeonButton>
            ) : (
              <NeonButton onClick={() => {
                setIntroOpen(false);
                markIntroSeen();
                setAnaVisible(false);
              }}>
                CONTINUE
              </NeonButton>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Dashboard;
