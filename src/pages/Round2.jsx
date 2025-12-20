import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TerminalCard from '../components/TerminalCard';
import NeonButton from '../components/NeonButton';
import { useGame } from '../context/GameContext';
import GlitchText from '../components/GlitchText';
import Modal from '../components/Modal';
import { ShoppingBag } from 'lucide-react';

const Round2 = () => {
  const navigate = useNavigate();
  const { setAnaDialogue, completeRound, addPoints, addTokens } = useGame();
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
  const [correct, setCorrect] = useState(null);

  useEffect(() => {
    setAnaDialogue("Entering Marketplace. tread carefully. Dark web signatures detected.");
  }, [setAnaDialogue]);

  const handleReturn = () => {
    completeRound('round2');
    navigate('/dashboard');
  };

  const [marketOpen, setMarketOpen] = useState(false);

  return (
    <div className="flex-1 p-6 md:p-12 space-y-8">
      <div className="flex justify-between items-center">
        <GlitchText text="MARKETPLACE & QUIZ" as="h2" size="large" />
        <div className="flex items-center gap-3">
          <NeonButton variant="secondary" onClick={handleReturn}>
              RETURN
          </NeonButton>
          <NeonButton variant="secondary" onClick={() => setMarketOpen(true)} aria-label="Open Black Market" className="px-3 py-2">
            <ShoppingBag size={18} />
          </NeonButton>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
        <TerminalCard title="TECH KNOWLEDGE BASE" className="h-96 flex flex-col">
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-xl space-y-6">
              <div className="flex justify-between items-center font-mono text-xs text-gray-400">
                <span>Q {idx + 1}/{QUESTIONS.length}</span>
              </div>
              <div className="font-orbitron text-lg text-white">{QUESTIONS[idx].q}</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {QUESTIONS[idx].options.map((opt, i) => (
                  <NeonButton
                    key={i}
                    variant={answered ? (i === QUESTIONS[idx].a ? "primary" : "secondary") : "primary"}
                    className={`w-full ${answered ? 'opacity-90' : ''}`}
                    onClick={() => {
                      if (answered) return;
                      const isRight = i === QUESTIONS[idx].a;
                      setCorrect(isRight);
                      setAnswered(true);
                      if (isRight) {
                        addPoints(100);
                        addTokens(1);
                      }
                    }}
                  >
                    {opt}
                  </NeonButton>
                ))}
              </div>
              <div className={`font-mono ${answered ? (correct ? 'text-neon-green' : 'text-red-500') : 'text-gray-500'} text-sm`}>
                {answered ? (correct ? 'CORRECT' : 'INCORRECT') : 'Select an option'}
              </div>
              <div className="flex justify-end">
                <NeonButton
                  variant="secondary"
                  onClick={() => {
                    if (!answered) return;
                    const next = idx + 1;
                    setIdx(next < QUESTIONS.length ? next : 0);
                    setAnswered(false);
                    setCorrect(null);
                  }}
                >
                  {idx + 1 < QUESTIONS.length ? 'NEXT' : 'RESTART'}
                </NeonButton>
              </div>
            </div>
          </div>
        </TerminalCard>
      </div>

      <Modal 
        isOpen={marketOpen}
        onClose={() => setMarketOpen(false)}
        title="BLACK MARKET"
        showClose={true}
        fullScreen={true}
      >
        <div className="space-y-6">
          <div className="flex items-center justify-center flex-col gap-4 text-gray-500 h-[60vh]">
            <div className="w-16 h-16 border-2 border-dashed border-gray-700 rounded-full flex items-center justify-center animate-spin-slow">
              <span className="font-mono text-xs">OFFLINE</span>
            </div>
            <p className="font-mono text-sm">MARKETPLACE CONNECTION SEVERED</p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Round2;
