import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Unlock, AlertTriangle, Clock } from 'lucide-react';
import { motion as Motion } from 'framer-motion';
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

const Round1 = () => {
  const navigate = useNavigate();
  const { unlockFragment, setAnaDialogue } = useGame();
  const [nodes, setNodes] = useState(NODES);
  const [selectedNode, setSelectedNode] = useState(null);
  const [puzzleInput, setPuzzleInput] = useState("");
  const [isShake, setIsShake] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30 * 60);

  useEffect(() => {
    setAnaDialogue("Firewall detected. Nodes are encrypted. Breach them.");
  }, [setAnaDialogue]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const TOTAL_TIME = 30 * 60;
  const r = 9;
  const C = 2 * Math.PI * r;
  const dashOffset = C * (1 - timeLeft / TOTAL_TIME);
  const isDanger = timeLeft <= 600;
  const isCritical = timeLeft <= 60;

  const handleNodeClick = (node) => {
    if (node.status === 'locked') {
      setSelectedNode(node);
      setPuzzleInput("");
    }
  };

  const handleDecrypt = () => {
    if (puzzleInput.toUpperCase() === PUZZLE.answer) {
      const newNodes = [...nodes];
      newNodes[selectedNode.id].status = 'unlocked';
      setNodes(newNodes);
      setSelectedNode(null);
      unlockFragment('firewall-node-' + selectedNode.id);
    } else {
      setIsShake(true);
      setTimeout(() => setIsShake(false), 500);
    }
  };

  return (
    <div className="flex-1 pt-12 md:pt-16 px-6 md:px-12 flex flex-col md:flex-row gap-8">
      
      <div className="flex-1">
        <div className="grid grid-cols-5 md:grid-cols-10 gap-3 md:gap-4">
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

      <div className="w-full md:w-80 relative">
        <Motion.div 
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -top-12 right-0 z-30 pointer-events-none w-fit"
        >
          <Motion.div
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="px-3 py-2 rounded border border-neon-cyan/40 bg-bg-black/60 backdrop-blur-sm shadow-none flex items-center gap-2 opacity-90"
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
            <div className={`text-base md:text-lg font-mono ${isDanger ? 'text-red-500' : 'text-neon-gold'} ${isCritical ? 'animate-pulse' : ''}`}>
              {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:{String(timeLeft % 60).padStart(2, '0')}
            </div>
          </Motion.div>
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
            <div className="mt-8">
                <NeonButton variant="secondary" onClick={() => navigate('/dashboard')} className="w-full text-xs">
                    &lt;&lt; RETURN TO DASHBOARD
                </NeonButton>
            </div>
          </div>
        </TerminalCard>
      </div>

      <Modal 
        isOpen={!!selectedNode} 
        onClose={() => setSelectedNode(null)} 
        title={`DECRYPT NODE ${selectedNode?.id}`}
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
    </div>
  );
};

export default Round1;
