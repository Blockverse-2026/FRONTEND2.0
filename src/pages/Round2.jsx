import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, CheckCircle, Coins, ArrowLeft, ChevronRight, Activity } from 'lucide-react';
import TerminalCard from '../components/TerminalCard';
import NeonButton from '../components/NeonButton';
import { useGame } from '../context/GameContext';
import GlitchText from '../components/GlitchText';
import Modal from '../components/Modal';

const INTRO_MESSAGES = [
  "Welcome to Round 2: Knowledge Acquisition.",
  "Objective: Answer technical queries to mine tokens.",
  "Access the Marketplace to trade tokens for upgrades.",
  "Every correct answer yields 100 Points + 1 Token.",
  "Prepare for data injection. Tap START."
];

const Round2 = () => {
  const navigate = useNavigate();
  const { setAnaDialogue, completeRound, addPoints, addTokens, setAnaVisible } = useGame();
  
  const QUESTIONS = [
    { q: "What does HTTP stand for?", options: ["HyperText Transfer Protocol", "High Transfer Text Protocol", "Hyperlink Transmission Process", "Host Transfer Type Protocol"], a: 0 },
    { q: "Which HTML tag defines a hyperlink?", options: ["<link>", "<a>", "<href>", "<url>"], a: 1 },
    { q: "CSS property to change text color?", options: ["font-color", "text-color", "color", "foreground"], a: 2 },
    { q: "JavaScript array method to add item at end?", options: ["push", "add", "append", "concat"], a: 0 },
    { q: "Git command to create a new branch?", options: ["git branch new", "git checkout -b", "git make branch", "git new"], a: 1 },
    { q: "React hook for state?", options: ["useStore", "useState", "useData", "useVar"], a: 1 },
    { q: "Node.js runtime is built on?", options: ["Ruby", "Python", "V8", "JVM"], a: 2 },
    { q: "HTTP status 404 means?", options: ["Unauthorized", "Not Found", "Server Error", "OK"], a: 1 },
    { q: "Primary key in databases is?", options: ["Unique row identifier", "Table name", "Foreign key", "Index only"], a: 0 },
    { q: "Which CSS unit scales with viewport width?", options: ["em", "rem", "vh", "vw"], a: 3 },
    { q: "Which is a NoSQL database?", options: ["MySQL", "PostgreSQL", "MongoDB", "SQLite"], a: 2 },
    { q: "What does API stand for?", options: ["Application Public Interface", "Application Programming Interface", "Advanced Protocol Integration", "Automated Process Instruction"], a: 1 },
    { q: "Package manager for Node.js?", options: ["pip", "cargo", "npm", "maven"], a: 2 },
    { q: "HTTP method to update a resource completely?", options: ["GET", "POST", "PUT", "DELETE"], a: 2 },
    { q: "What is CSS Flexbox used for?", options: ["Image editing", "Audio mixing", "Layout alignment", "Database queries"], a: 2 },
    { q: "Which element displays code blocks in HTML?", options: ["<code>", "<pre>", "<script>", "<block>"], a: 1 },
    { q: "Which protocol secures HTTP?", options: ["FTP", "TLS", "SMTP", "SSH"], a: 1 },
    { q: "What does JSON stand for?", options: ["Java Source Object Notation", "JavaScript Object Notation", "Joined Simple Object Names", "Java Serialized Object Network"], a: 1 },
    { q: "Which git command stages changes?", options: ["git push", "git add", "git commit", "git stash"], a: 1 },
    { q: "React components must return?", options: ["String", "Number", "JSX", "Class"], a: 2 },
  ];

  const [idx, setIdx] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  const [marketOpen, setMarketOpen] = useState(false);
  const [sessionPoints, setSessionPoints] = useState(0);
  const [sessionTokens, setSessionTokens] = useState(0);
  
  const [introOpen, setIntroOpen] = useState(true);
  const [introStep, setIntroStep] = useState(0);

  useEffect(() => {
    setAnaVisible(false);
    setAnaDialogue(INTRO_MESSAGES[0]);
  }, [setAnaDialogue, setAnaVisible]);

  useEffect(() => {
    if (marketOpen || introOpen) {
      setAnaVisible(false);
    }
  }, [marketOpen, introOpen, setAnaVisible]);

  const handleReturn = () => {
    completeRound('round2');
    navigate('/dashboard');
  };

  const handleOptionClick = (i) => {
    if (answered) return;
    
    setSelectedOption(i);
    const isRight = i === QUESTIONS[idx].a;
    setIsCorrect(isRight);
    setAnswered(true);

    if (isRight) {
      addPoints(100);
      addTokens(1);
      setSessionPoints(p => p + 100);
      setSessionTokens(t => t + 1);
    }
  };

  const handleNext = () => {
    if (!answered) return;
    const next = idx + 1;
    if (next < QUESTIONS.length) {
      setIdx(next);
      setAnswered(false);
      setSelectedOption(null);
      setIsCorrect(null);
    } else {
      setMarketOpen(true);
    }
  };

  const progress = ((idx + 1) / QUESTIONS.length) * 100;

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-black font-sans">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/60 to-black opacity-80" /> {/* Vignette */}
      </div>

      <div className="relative z-20 flex justify-between items-center p-6 md:px-12 md:py-8">
        <GlitchText text="MARKETPLACE & QUIZ" as="h2" size="large" className="hidden md:block" />
        <GlitchText text="QUIZ" as="h2" size="medium" className="md:hidden" />
        
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleReturn}
            className="flex items-center gap-2 px-4 py-2 border border-neon-cyan/50 bg-black/40 text-neon-cyan font-orbitron text-sm hover:bg-neon-cyan/10 hover:border-neon-cyan transition-all rounded-sm"
          >
            <ArrowLeft size={16} />
            <span>RETURN</span>
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMarketOpen(true)}
            className="flex items-center gap-2 px-4 py-2 border border-neon-gold/50 bg-black/40 text-neon-gold font-orbitron text-sm hover:bg-neon-gold/10 hover:border-neon-gold transition-all rounded-sm"
          >
            <ShoppingBag size={16} />
            <span>MARKET</span>
          </motion.button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-8 relative z-10 w-full max-w-5xl mx-auto">
        
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full"
          >
            <TerminalCard title="TECH KNOWLEDGE BASE" className="w-full relative overflow-hidden backdrop-blur-xl bg-black/60 border-neon-cyan/30 shadow-[0_0_30px_rgba(0,255,255,0.1)]">
              
              <div className="flex items-center gap-4 mb-8 font-mono text-sm text-neon-cyan/70">
                <span className="whitespace-nowrap">Q {idx + 1} <span className="text-gray-500">/</span> {QUESTIONS.length}</span>
                <div className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden relative">
                  <motion.div 
                    className="absolute top-0 left-0 h-full bg-neon-cyan shadow-[0_0_10px_rgba(0,255,255,0.8)]"
                    initial={{ width: `${((idx) / QUESTIONS.length) * 100}%` }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                  />
                </div>
                <Activity size={16} className="text-neon-cyan animate-pulse" />
              </div>

              <div className="min-h-[120px] flex items-center justify-center mb-8">
                <h3 className="text-2xl md:text-3xl font-orbitron font-bold text-white text-center leading-relaxed tracking-wide drop-shadow-md">
                  {QUESTIONS[idx].q}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-4xl mx-auto">
                {QUESTIONS[idx].options.map((opt, i) => {
                  const isSelected = selectedOption === i;
                  const isCorrectOption = i === QUESTIONS[idx].a;
                  
                  let borderColor = "border-neon-cyan/30";
                  let textColor = "text-gray-300";
                  let glowClass = "hover:border-neon-cyan hover:shadow-[0_0_15px_rgba(0,255,255,0.3)] hover:text-white";
                  let bgClass = "bg-black/40";
                  
                  if (answered) {
                    if (isCorrectOption) {
                      borderColor = "border-neon-green";
                      textColor = "text-white";
                      bgClass = "bg-neon-green/10";
                      glowClass = "shadow-[0_0_20px_rgba(16,255,120,0.4)]";
                    } else if (isSelected && !isCorrectOption) {
                      borderColor = "border-red-500";
                      textColor = "text-red-400";
                      bgClass = "bg-red-500/10";
                      glowClass = "shadow-[0_0_20px_rgba(239,68,68,0.4)]";
                    } else {
                      borderColor = "border-gray-800";
                      textColor = "text-gray-600";
                      glowClass = "opacity-50";
                    }
                  } else {
                     if (isSelected) {
                     }
                  }

                  return (
                    <motion.button
                      key={i}
                      onClick={() => handleOptionClick(i)}
                      disabled={answered}
                      className={`relative group w-full p-6 text-left border-2 rounded-sm transition-all duration-300 ${borderColor} ${textColor} ${bgClass} ${glowClass}`}
                      whileHover={!answered ? { scale: 1.02, backgroundColor: "rgba(0,255,255,0.05)" } : {}}
                      whileTap={!answered ? { scale: 0.98 } : {}}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-sm md:text-base font-semibold tracking-wide">{opt}</span>
                        
                        {answered && isCorrectOption && (
                          <CheckCircle className="text-neon-green drop-shadow-[0_0_5px_rgba(16,255,120,0.8)]" size={20} />
                        )}
                        {answered && isSelected && !isCorrectOption && (
                          <div className="text-red-500 font-bold">✖</div>
                        )}
                      </div>
                      
                      <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-current opacity-50" />
                      <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-current opacity-50" />
                    </motion.button>
                  );
                })}
              </div>

              <div className="mt-10 flex justify-between items-center h-12">
                <div className="font-mono text-sm text-gray-400">
                  {answered ? (
                    isCorrect ? 
                      <span className="text-neon-green flex items-center gap-2 animate-pulse">
                        <CheckCircle size={14} /> CORRECT ANSWER (+100 PTS)
                      </span> : 
                      <span className="text-red-500 flex items-center gap-2 animate-pulse">
                        <Activity size={14} /> SYSTEM ERROR: INCORRECT
                      </span>
                  ) : (
                    <span className="animate-pulse">Awaiting input...</span>
                  )}
                </div>

                <NeonButton
                  variant="primary"
                  onClick={handleNext}
                  disabled={!answered}
                  className={`px-8 py-3 flex items-center gap-2 transition-all duration-300 ${!answered ? 'opacity-50 grayscale cursor-not-allowed pointer-events-none' : 'opacity-100 hover:scale-105'}`}
                >
                  {idx + 1 < QUESTIONS.length ? 'NEXT SEQUENCE' : 'COMPLETE'} <ChevronRight size={16} />
                </NeonButton>
              </div>

            </TerminalCard>
          </motion.div>
        </AnimatePresence>
      </div>

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
            <span>SEQUENCE: QUIZ</span>
            <span>QUESTIONS: {QUESTIONS.length}</span>
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
                setAnaVisible(false);
                setAnaDialogue("Knowledge acquisition protocol engaged.");
              }}>
                START
              </NeonButton>
            )}
          </div>
        </div>
      </Modal>

      <Modal 
        isOpen={marketOpen}
        onClose={() => setMarketOpen(false)}
        title="ANA // SYSTEM AI"
        showClose={true}
        fullScreen={true}
      >
        <div className="h-[70vh] flex items-center justify-center">
          <div className="max-w-xl w-full mx-auto text-center space-y-8">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", duration: 0.8 }}
            >
              <CheckCircle size={80} className="mx-auto text-neon-green drop-shadow-[0_0_20px_rgba(16,255,120,0.6)]" />
            </motion.div>
            
            <div className="space-y-4">
              <h2 className="text-3xl font-orbitron text-white tracking-widest">PROTOCOL COMPLETE</h2>
              <p className="font-mono text-neon-green text-lg">Knowledge acquisition successful. Database updated.</p>
            </div>
            
            <div className="grid grid-cols-2 gap-6 mt-8">
              <motion.div 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-black/60 rounded-xl p-6 border border-neon-green/30 shadow-[0_0_15px_rgba(16,255,120,0.1)]"
              >
                <div className="flex flex-col items-center gap-2 text-white">
                  <Coins size={32} className="text-neon-gold mb-2" />
                  <span className="text-gray-400 text-xs font-mono uppercase">Points Acquired</span>
                  <span className="text-3xl font-bold font-orbitron text-neon-green">{sessionPoints}</span>
                </div>
              </motion.div>
              
              <motion.div 
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-black/60 rounded-xl p-6 border border-neon-cyan/30 shadow-[0_0_15px_rgba(0,255,255,0.1)]"
              >
                <div className="flex flex-col items-center gap-2 text-white">
                  <Coins size={32} className="text-neon-cyan mb-2" />
                  <span className="text-gray-400 text-xs font-mono uppercase">Tokens Mined</span>
                  <span className="text-3xl font-bold font-orbitron text-neon-cyan">{sessionTokens}</span>
                </div>
              </motion.div>
            </div>

            <div className="pt-8">
               <NeonButton onClick={handleReturn} className="w-full max-w-xs mx-auto">
                 RETURN TO DASHBOARD
               </NeonButton>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Round2;
