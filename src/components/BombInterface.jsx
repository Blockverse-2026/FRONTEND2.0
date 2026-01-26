import React, { useState, useEffect } from 'react';
import { motion as Motion } from 'framer-motion';
import { ShieldAlert, Zap, Cpu, CheckCircle, XCircle, Timer } from 'lucide-react';
import GlitchText from './GlitchText';
import NeonButton from './NeonButton';

const QUESTIONS = {
  'A': [
    {
      id: 1,
      question: "What protocol secures web traffic?",
      options: ["HTTP", "FTP", "HTTPS", "SMTP"],
      correct: 2
    },
    {
      id: 2,
      question: "Which port is standard for SSH?",
      options: ["21", "22", "80", "443"],
      correct: 1
    },
    {
      id: 3,
      question: "What is a DDoS attack?",
      options: ["Direct Disk OS", "Distributed Denial of Service", "Data Defense System", "Digital Domain Service"],
      correct: 1
    },
    {
      id: 4,
      question: "Which is NOT a strong password practice?",
      options: ["Using special chars", "Using personal dates", "Length > 12", "Mixing case"],
      correct: 1
    },
    {
      id: 5,
      question: "What does VPN stand for?",
      options: ["Virtual Private Network", "Visual Processing Node", "Verified Public Network", "Virtual Personal Net"],
      correct: 0
    }
  ],
  'B': [
    {
      id: 1,
      question: "Who published the Bitcoin whitepaper?",
      options: ["Vitalik Buterin", "Satoshi Nakamoto", "Charlie Lee", "Hal Finney"],
      correct: 1
    },
    {
      id: 2,
      question: "What is the ledger of Bitcoin called?",
      options: ["The Database", "The Chain", "The Blockchain", "The Block"],
      correct: 2
    },
    {
      id: 3,
      question: "What is 'Gas' in Ethereum?",
      options: ["Fuel for servers", "Transaction fee unit", "Cooling system", "Mining reward"],
      correct: 1
    },
    {
      id: 4,
      question: "Which is a stablecoin?",
      options: ["BTC", "ETH", "USDT", "DOGE"],
      correct: 2
    },
    {
      id: 5,
      question: "What does 'DeFi' stand for?",
      options: ["Decentralized Finance", "Digital Fidelity", "Defense Field", "Designated File"],
      correct: 0
    }
  ],
  'C': [
    {
      id: 1,
      question: "Time complexity of accessing an array index?",
      options: ["O(n)", "O(1)", "O(log n)", "O(n^2)"],
      correct: 1
    },
    {
      id: 2,
      question: "Which is NOT a primitive type in JS?",
      options: ["Boolean", "String", "Object", "Undefined"],
      correct: 2
    },
    {
      id: 3,
      question: "What is the purpose of 'git commit'?",
      options: ["Upload files", "Save changes locally", "Download files", "Delete files"],
      correct: 1
    },
    {
      id: 4,
      question: "Which tag is used for the largest heading?",
      options: ["<head>", "<h6>", "<h1>", "<header>"],
      correct: 2
    },
    {
      id: 5,
      question: "What is a 'Bug'?",
      options: ["A feature", "An error in code", "A virus", "A slow computer"],
      correct: 1
    }
  ]
};

const BombInterface = ({ bombId, onDefuse, onFail, onBack }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds per bomb
  const [selectedOption, setSelectedOption] = useState(null);
  const [isDefused, setIsDefused] = useState(false);
  const [isExploded, setIsExploded] = useState(false);
  // answers omitted

  const questions = QUESTIONS[bombId] || [];

  useEffect(() => {
    if (isDefused || isExploded) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsExploded(true);
          onFail && onFail();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isDefused, isExploded, onFail]);

  const handleOptionSelect = (index) => {
    if (selectedOption !== null) return; // Prevent changing answer
    
    setSelectedOption(index);
    const correct = questions[currentQuestion].correct;
    
    if (index === correct) {
      // Correct answer
      setTimeout(() => {
        if (currentQuestion < questions.length - 1) {
          setCurrentQuestion(curr => curr + 1);
          setSelectedOption(null);
        } else {
          setIsDefused(true);
          onDefuse && onDefuse();
        }
      }, 1000);
    } else {
      // Wrong answer - Penalty or Immediate Fail? Let's reduce time as penalty
      setTimeLeft(prev => Math.max(0, prev - 10));
      setTimeout(() => {
        setSelectedOption(null); // Allow retry but with time penalty
      }, 1000);
    }
  };

  if (isExploded) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-red-500 space-y-6">
        <Motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1.5 }}
          className="text-9xl"
        >
          💥
        </Motion.div>
        <GlitchText text="CRITICAL FAILURE" className="text-4xl font-bold" />
        <p className="text-xl">SYSTEM LOCKDOWN INITIATED</p>
        <NeonButton onClick={onBack} variant="danger">RETURN TO SAFETY</NeonButton>
      </div>
    );
  }

  if (isDefused) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-green-400 space-y-6">
        <Motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1.2, rotate: 360 }}
          className="bg-green-500/20 p-8 rounded-full border-4 border-green-500"
        >
          <CheckCircle size={64} />
        </Motion.div>
        <GlitchText text="ANOMALY NEUTRALIZED" className="text-4xl font-bold" />
        <p className="text-xl font-mono">CORE STABILIZED</p>
        <NeonButton onClick={onBack} variant="primary">CONTINUE</NeonButton>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto w-full bg-black/80 border border-gray-800 rounded-xl overflow-hidden shadow-2xl relative p-8">
      {/* Background Grid Animation */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
      
      {/* Header Stats */}
      <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
        <div className="flex items-center gap-4">
          <div className="bg-red-900/30 p-2 rounded border border-red-500/50">
            <ShieldAlert className="text-red-500 animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-200">ANOMALY {bombId}</h2>
            <span className="text-xs text-red-400 font-mono tracking-widest">DEFUSAL SEQUENCE ACTIVE</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4 font-mono text-2xl">
            <Timer className={`w-6 h-6 ${timeLeft < 10 ? 'text-red-500 animate-bounce' : 'text-blue-400'}`} />
            <span className={timeLeft < 10 ? 'text-red-500' : 'text-blue-400'}>
              00:{timeLeft.toString().padStart(2, '0')}
            </span>
        </div>
      </div>

      {/* Bomb Core Visual */}
      <div className="flex flex-col md:flex-row gap-8 items-center">
        <div className="w-full md:w-1/3 flex justify-center">
            <div className="relative w-48 h-48">
                {/* Rotating Rings */}
                <Motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 border-4 border-dashed border-gray-700 rounded-full"
                />
                <Motion.div 
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-4 border-2 border-gray-600 rounded-full"
                />
                
                {/* Central Pulse */}
                <Motion.div 
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className={`absolute inset-0 m-auto w-24 h-24 rounded-full flex items-center justify-center
                        ${timeLeft < 10 ? 'bg-red-500/20 shadow-[0_0_50px_rgba(239,68,68,0.5)]' : 'bg-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.3)]'}
                    `}
                >
                    <Cpu size={40} className={timeLeft < 10 ? 'text-red-400' : 'text-blue-400'} />
                </Motion.div>

                {/* Progress Indicators */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex gap-1">
                    {questions.map((_, idx) => (
                        <div key={idx} className={`w-2 h-2 rounded-full ${idx < currentQuestion ? 'bg-green-500' : idx === currentQuestion ? 'bg-yellow-500 animate-pulse' : 'bg-gray-700'}`} />
                    ))}
                </div>
            </div>
        </div>

        {/* Question Interface */}
        <div className="w-full md:w-2/3 bg-gray-900/50 p-6 rounded-lg border border-gray-700">
            <div className="mb-6">
                <span className="text-xs font-mono text-gray-500">QUERY {currentQuestion + 1}/{questions.length}</span>
                <h3 className="text-xl text-gray-100 mt-2 font-medium">{questions[currentQuestion].question}</h3>
            </div>

            <div className="grid grid-cols-1 gap-3">
                {questions[currentQuestion].options.map((opt, idx) => {
                    let stateColor = "border-gray-700 hover:border-blue-500/50 bg-gray-800/50";
                    if (selectedOption !== null) {
                        if (idx === questions[currentQuestion].correct) {
                            stateColor = "border-green-500 bg-green-900/20";
                        } else if (idx === selectedOption) {
                            stateColor = "border-red-500 bg-red-900/20";
                        } else {
                            stateColor = "border-gray-800 opacity-50";
                        }
                    }

                    return (
                        <Motion.button
                            key={idx}
                            whileHover={selectedOption === null ? { x: 5 } : {}}
                            onClick={() => handleOptionSelect(idx)}
                            disabled={selectedOption !== null}
                            className={`w-full text-left p-4 rounded border transition-all flex items-center justify-between ${stateColor}`}
                        >
                            <span className="font-mono text-sm text-gray-300">
                                <span className="text-gray-500 mr-4">0{idx + 1}</span>
                                {opt}
                            </span>
                            {selectedOption !== null && idx === questions[currentQuestion].correct && (
                                <CheckCircle size={16} className="text-green-500" />
                            )}
                            {selectedOption === idx && idx !== questions[currentQuestion].correct && (
                                <XCircle size={16} className="text-red-500" />
                            )}
                        </Motion.button>
                    );
                })}
            </div>
        </div>
      </div>
    </div>
  );
};

export default BombInterface;
