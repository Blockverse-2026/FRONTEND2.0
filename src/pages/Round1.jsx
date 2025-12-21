import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Unlock, AlertTriangle, Clock, CheckCircle, Coins } from 'lucide-react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import TerminalCard from '../components/TerminalCard';
import NeonButton from '../components/NeonButton';
import Modal from '../components/Modal';
import { useGame } from '../context/GameContext';

const NODES = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  status: 'locked',
  type: 'encryption'
}));

const PUZZLE = {
  question: "DECRYPT SEQUENCE: 0x4A, 0x4B, 0x4C, ?",
  answer: "0x4D"
};

const INTRO_MESSAGES = [
  "Connection secured. Welcome to Round 1.",
  "Objective: Breach the Firewall Grid.",
  "Select encrypted nodes and solve the decryption cipher.",
  "Recover fragments to progress mission integrity.",
  "Prepare to initiate. Tap START to begin."
];

const Round1 = () => {
  const navigate = useNavigate();
  const { unlockFragment, setAnaDialogue, setAnaVisible, completeRound } = useGame();
  const [nodes, setNodes] = useState(NODES);
  const [selectedNode, setSelectedNode] = useState(null);
  const [puzzleInput, setPuzzleInput] = useState("");
  const [isShake, setIsShake] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [timerActive, setTimerActive] = useState(false);
  const [showCompletionPopup, setShowCompletionPopup] = useState(false);
  const [sessionPoints, setSessionPoints] = useState(0);
  const [introOpen, setIntroOpen] = useState(true);
  const [introStep, setIntroStep] = useState(0);

  useEffect(() => {
    setAnaVisible(false);
    setAnaDialogue(INTRO_MESSAGES[0]);
  }, [setAnaDialogue, setAnaVisible]);

  useEffect(() => {
    if (!timerActive) return;
    const interval = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timerActive]);

  useEffect(() => {
    if (timeLeft === 0 && timerActive) {
      queueMicrotask(() => {
        setTimerActive(false);
        setShowCompletionPopup(true);
      });
    }
  }, [timeLeft, timerActive]);

  const TOTAL_TIME = 60;
  const r = 9;
  const C = 2 * Math.PI * r;
  const dashOffset = C * (1 - timeLeft / TOTAL_TIME);
  const isDanger = timeLeft <= 600;
  const isCritical = timeLeft <= 60;
  const totalTimeLabel = `${String(Math.floor(TOTAL_TIME / 60)).padStart(2, '0')}:${String(TOTAL_TIME % 60).padStart(2, '0')}`;
  const totalNodes = NODES.length;
  const unlockedCount = nodes.filter(n => n.status === 'unlocked').length;

  const handleReturn = () => {
    if (unlockedCount > 0) {
      completeRound('round1');
    }
    navigate('/dashboard');
  };

  const handleNodeClick = (node) => {
    if (node.status === 'locked') {
      setSelectedNode(node);
      setPuzzleInput("");
    }
  };

  const handleDecrypt = () => {
    const input = puzzleInput.trim().toLowerCase();
    const target = PUZZLE.answer.toLowerCase();
    if (input === target) {
      const newNodes = [...nodes];
      newNodes[selectedNode.id].status = 'unlocked';
      setNodes(newNodes);
      setSelectedNode(null);
      unlockFragment('firewall-node-' + selectedNode.id);
      setSessionPoints(p => p + 500);
    } else {
      setIsShake(true);
      setTimeout(() => setIsShake(false), 500);
    }
  };

  return (
    <div className="flex-1 pt-12 md:pt-16 px-6 md:px-12 flex flex-col md:flex-row gap-8 overflow-hidden">
      
      <div className="flex-1 max-h-[88vh] overflow-y-auto overflow-x-hidden no-scrollbar pr-2 mb-4">
        <div className="grid grid-cols-5 grid-rows-9 gap-2 md:gap-3">
          {nodes.map((node) => (
            <Motion.button
              key={node.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleNodeClick(node)}
              className={`aspect-square border-2 flex items-center justify-center relative overflow-hidden group transition-all duration-300 ${
                node.status === 'unlocked' 
                  ? 'border-neon-green bg-neon-green/10 text-neon-green' 
                  : 'border-red-500 bg-red-500/10 text-red-500 animate-pulse'
              }`}
            >
              {node.status === 'unlocked' ? <Unlock size={32} /> : <Lock size={32} />}
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors" />
            </Motion.button>
          ))}
        </div>
      </div>

      <div className="w-full md:w-80 relative max-h-[88vh] overflow-y-auto overflow-x-hidden no-scrollbar">
        <Motion.div 
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="sticky top-0 z-30 pointer-events-none w-fit ml-auto"
        >
          <div className="flex items-center gap-3">
            <Motion.div
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="px-4 py-2 rounded-lg border-2 border-neon-cyan/50 bg-bg-black/60 backdrop-blur-sm shadow-[0_0_12px_rgba(0,246,255,0.25)] flex items-center justify-center gap-3 opacity-90"
            >
              <div className="relative w-6 h-6 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="absolute inset-0">
                  <circle cx="12" cy="12" r={r} stroke="rgba(255,255,255,0.15)" strokeWidth="3" fill="none" />
                  <circle
                    cx="12"
                    cy="12"
                    r={r}
                    stroke={isDanger ? '#ff3b3b' : '#00f6ff'}
                    strokeWidth="3"
                    fill="none"
                    strokeDasharray={C}
                    strokeDashoffset={dashOffset}
                    strokeOpacity={isDanger ? 0.8 : 0.6}
                    transform="rotate(-90 12 12)"
                  />
                </svg>
                <Clock size={12} className="text-neon-cyan opacity-60" />
              </div>
              <div className={`text-base md:text-lg font-mono font-semibold ${isDanger ? 'text-red-500' : 'text-neon-cyan/80'} ${isCritical ? 'animate-pulse' : ''}`}>
                {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:{String(timeLeft % 60).padStart(2, '0')}
              </div>
            </Motion.div>
            <Motion.div
              className="px-4 py-2 rounded-lg border-2 border-neon-green/60 bg-bg-black/60 backdrop-blur-sm shadow-[0_0_12px_rgba(16,255,120,0.35)] font-mono font-semibold text-neon-green text-sm md:text-base flex items-center justify-center gap-3"
            >
              <Unlock size={12} className="text-neon-green" />
              <span>UNLOCKED {unlockedCount}/{totalNodes}</span>
            </Motion.div>
          </div>
        </Motion.div>
        <TerminalCard title="MISSION LOG" headerColor="red">
          <div className="space-y-4 text-sm font-mono text-gray-300">
            <p>TARGET: FIREWALL GRID</p>
            <p>STATUS: ACTIVE</p>
            <p className="text-red-500">WARNING: ACTIVE COUNTERMEASURES DETECTED</p>
            <div className="h-[1px] bg-red-900 w-full my-4" />
            <p>INSTRUCTIONS:</p>
            <ul className="list-disc list-inside space-y-2 text-gray-400">
              <li>Select encrypted node</li>
              <li>Solve decryption cipher</li>
              <li>Inject payload</li>
            </ul>
          </div>
        </TerminalCard>
      </div>

      <Modal 
        isOpen={!!selectedNode} 
        onClose={() => setSelectedNode(null)} 
        title={`DECRYPT NODE ${(selectedNode?.id ?? 0) + 1}`}
        showClose={false}
      >
        <Motion.div 
          animate={isShake ? { x: [-10, 10, -10, 10, 0] } : {}}
          className="space-y-6"
        >
          <div className="p-4 border border-neon-cyan/30 bg-black/50 font-mono text-neon-cyan">
            {PUZZLE.question}
          </div>
          
          <input
            type="text"
            value={puzzleInput}
            onChange={(e) => setPuzzleInput(e.target.value)}
            className="w-full bg-black/50 border border-neon-gold/50 text-neon-gold p-3 font-mono focus:border-neon-gold focus:outline-none focus:shadow-neon-gold transition-all"
            placeholder="ENTER DECRYPTION KEY"
            autoFocus
          />

          <div className="flex gap-4">
            <NeonButton variant="danger" onClick={() => setSelectedNode(null)} className="flex-1">
              ABORT
            </NeonButton>
            <NeonButton onClick={handleDecrypt} className="flex-1">
              EXECUTE
            </NeonButton>
          </div>
        </Motion.div>
      </Modal>

      <Modal 
        isOpen={introOpen}
        onClose={() => {}}
        title="ANA // SYSTEM AI"
        showClose={false}
      >
        <div className="space-y-6">
          <div className="p-4 border border-neon-cyan/30 bg-black/50 font-mono text-neon-cyan">
            {INTRO_MESSAGES[introStep]}
          </div>
          <div className="flex justify-between items-center font-mono text-neon-cyan text-xs md:text-sm px-1">
            <span>TIME {totalTimeLabel}</span>
            <span>NODES {totalNodes}</span>
          </div>
          <div className="flex justify-end gap-3">
            {introStep < INTRO_MESSAGES.length - 1 ? (
              <NeonButton variant="secondary" onClick={() => {
                const next = introStep + 1;
                setIntroStep(next);
                setAnaDialogue(INTRO_MESSAGES[next]);
              }}>
                NEXT &gt;&gt;
              </NeonButton>
            ) : (
              <NeonButton onClick={() => {
                setIntroOpen(false);
                setTimerActive(true);
                setAnaVisible(true);
                setAnaDialogue("Mission start. Breach the grid.");
                setSessionPoints(0);
              }}>
                START
              </NeonButton>
            )}
          </div>
        </div>
      </Modal>

      <AnimatePresence>
        {showCompletionPopup && (
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          >
            <Motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="bg-gray-900 border border-neon-green/50 rounded-2xl p-8 max-w-md w-full mx-4 shadow-[0_0_30px_rgba(16,255,120,0.2)] text-center relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-neon-green/5 pointer-events-none" />
              <div className="relative z-10 flex flex-col items-center gap-6">
                <Motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring" }}
                >
                  <CheckCircle size={64} className="text-neon-green drop-shadow-[0_0_10px_rgba(16,255,120,0.5)]" />
                </Motion.div>
                
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-white font-orbitron tracking-wide">
                    ANA // SYSTEM AI
                  </h2>
                  <p className="text-neon-green font-mono text-lg">
                    Congratulations. Firewall breach confirmed.
                  </p>
                </div>

                <div className="w-full bg-black/40 rounded-lg p-4 border border-neon-green/20">
                  <p className="text-gray-400 font-mono text-sm mb-1">CURRENT PROGRESS</p>
                  <div className="flex items-center justify-center gap-2 text-xl font-bold text-white">
                    <Unlock size={20} className="text-neon-green" />
                    <span>Total Unlocked Nodes: <span className="text-neon-green">{unlockedCount}</span></span>
                  </div>
                </div>
                <div className="w-full bg-black/40 rounded-lg p-4 border border-neon-cyan/20">
                  <p className="text-gray-400 font-mono text-sm mb-1">SESSION REWARDS</p>
                  <div className="flex items-center justify-center gap-2 text-xl font-bold text-white">
                    <Coins size={20} className="text-neon-gold" />
                    <span>Points Earned: <span className="text-neon-gold">{sessionPoints}</span></span>
                  </div>
                </div>

                <NeonButton 
                  onClick={handleReturn}
                  className="w-full"
                  variant="primary"
                >
                  RETURN TO DASHBOARD
                </NeonButton>
              </div>
            </Motion.div>
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Round1;
