import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { Clock, Coins, CheckCircle, Activity } from "lucide-react";

import TerminalCard from "../components/TerminalCard";
import NeonButton from "../components/NeonButton";
import Modal from "../components/Modal";
import GlitchText from "../components/GlitchText";
import { useGame } from "../context/GameContext";


const TOTAL_TIME = 120; 

const INTRO_MESSAGES = [
  "Welcome to Round 2: Numerical Ability.",
  "Solve all numerical questions within given time.",
  "You may switch questions anytime.",
  "Each correct submission yields rewards.",
  "Tap START to begin."
];

const POST_ANA_MESSAGES = [
  "Marketplace unlocked.",
  "Use earned tokens wisely.",
  "Upgrades impact upcoming rounds.",
  "Proceed to marketplace."
];


const Round2 = () => {
  const navigate = useNavigate();
  const { setAnaDialogue, setAnaVisible, addPoints, addTokens } = useGame();

  const [questions, setQuestions] = useState([]);
  const [idx, setIdx] = useState(0);
  const [answer, setAnswer] = useState("");
  const [answered, setAnswered] = useState(false);

  const [visited, setVisited] = useState({});
  const [submittedMap, setSubmittedMap] = useState({});

  const [timer, setTimer] = useState(TOTAL_TIME);
  const [roundFinished, setRoundFinished] = useState(false);

  const [introOpen, setIntroOpen] = useState(true);
  const [introStep, setIntroStep] = useState(0);

  const [marketOpen, setMarketOpen] = useState(false);
  const [postAnaOpen, setPostAnaOpen] = useState(false);
  const [postAnaStep, setPostAnaStep] = useState(0);

  const [sessionPoints, setSessionPoints] = useState(0);
  const [sessionTokens, setSessionTokens] = useState(0);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem("BLOCKVERSE_TOKEN");
        const res = await fetch(
          "https://blockverse-backend.onrender.com/api/round2/phase1/questions",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const json = await res.json();
        if (!res.ok || !json?.data?.questions) {
          throw new Error("Failed to load questions");
        }
        setQuestions(json.data.questions);
      } catch (err) {
        console.error(err);
      }
    };
    fetchQuestions();
  }, []);


  useEffect(() => {
    if (introOpen || marketOpen) return;

    if (timer > 0) {
      const i = setInterval(() => setTimer(t => t - 1), 1000);
      return () => clearInterval(i);
    } else if (!roundFinished) {
      setMarketOpen(true);
      setRoundFinished(true);
    }
  }, [timer, introOpen, marketOpen, roundFinished]);


  useEffect(() => {
    setAnaVisible(false);
    setAnaDialogue(INTRO_MESSAGES[0]);
  }, [setAnaDialogue, setAnaVisible]);

  useEffect(() => {
    setVisited(prev => ({ ...prev, [idx]: true }));
    setAnswered(!!submittedMap[idx]);
  }, [idx, submittedMap]);


  const submitAnswer = async () => {
    if (!answer.trim() || submittedMap[idx]) return;

    try {
      const token = localStorage.getItem("BLOCKVERSE_TOKEN");

      const res = await fetch(
        "https://blockverse-backend.onrender.com/api/round2/phase1/submit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            questionId: questions[idx].questionId,
            answer: Number(answer),
          }),
        }
      );

      if (res.ok) {
        addPoints(100);
        addTokens(1);
        setSessionPoints(p => p + 100);
        setSessionTokens(t => t + 1);
        setSubmittedMap(prev => ({ ...prev, [idx]: true }));
      }
    } catch {
      console.warn("Submission failed");
    }

    setAnswered(true);
  };


  const goToQuestion = (i) => {
    setIdx(i);
    setAnswer("");
  };

  if (!questions.length) {
    return <div className="p-6 text-neon-cyan">LOADING ROUND 2…</div>;
  }
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      
      {/* HEADER */}
      <div className="flex justify-between items-center p-6">
        <GlitchText text="ROUND 2 // NUMERICAL CORE" as="h2" />
        <div className={`flex items-center gap-2 px-4 py-2 border ${
          timer <= 10 ? "border-red-500 text-red-500 animate-pulse" : "border-neon-cyan text-neon-cyan"
        }`}>
          <Clock size={16} />
          {String(Math.floor(timer / 60)).padStart(2,"0")}:
          {String(timer % 60).padStart(2,"0")}
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 md:grid-cols-[1fr_280px] gap-6">

        {/* QUESTION PANEL */}
        <TerminalCard title={`QUESTION ${idx + 1}/${questions.length}`}>
          <div className="space-y-6">
            <p className="text-white text-xl font-mono">
              {questions[idx].question}
            </p>

            <input
              type="text"
              inputMode="numeric"
              value={answer}
              disabled={submittedMap[idx]}
              onChange={e => setAnswer(e.target.value.replace(/[^0-9]/g, ""))}
              placeholder="ENTER NUMERIC ANSWER"
              className="w-full p-3 bg-black border border-neon-cyan text-white font-mono disabled:opacity-50"
            />

            <div className="flex justify-between">
              <NeonButton onClick={submitAnswer} disabled={submittedMap[idx]}>
                SUBMIT
              </NeonButton>
            </div>
          </div>
        </TerminalCard>

        {/* QUESTION PALETTE */}
        <TerminalCard title="QUESTION PALETTE">
          <div className="grid grid-cols-5 gap-3">
            {questions.map((_, i) => {
              let bg = "bg-gray-700";
              if (submittedMap[i]) bg = "bg-green-600";
              else if (visited[i]) bg = "bg-yellow-500";

              return (
                <button
                  key={i}
                  onClick={() => goToQuestion(i)}
                  className={`h-10 w-10 font-mono text-black flex items-center justify-center
                    ${bg} ${i === idx ? "ring-2 ring-neon-cyan" : ""}
                    hover:scale-105 transition`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>

          {/* LEGEND */}
          <div className="mt-6 space-y-2 text-xs font-mono">
            <div className="flex gap-2"><span className="w-3 h-3 bg-gray-700" /> Unvisited</div>
            <div className="flex gap-2"><span className="w-3 h-3 bg-yellow-500" /> Visited</div>
            <div className="flex gap-2"><span className="w-3 h-3 bg-green-600" /> Submitted</div>
          </div>
        </TerminalCard>
      </div>

      {/* INTRO MODAL */}
      <Modal isOpen={introOpen} showClose={false} title="ANA // SYSTEM AI">
        <div className="space-y-4">
          <div className="p-4 border border-neon-cyan bg-black font-mono text-neon-cyan">
            {INTRO_MESSAGES[introStep]}
          </div>
          <div className="flex justify-end gap-3">
            {introStep < INTRO_MESSAGES.length - 1 ? (
              <NeonButton onClick={() => {
                const n = introStep + 1;
                setIntroStep(n);
                setAnaDialogue(INTRO_MESSAGES[n]);
              }}>
                NEXT
              </NeonButton>
            ) : (
              <NeonButton onClick={() => {
                setIntroOpen(false);
                setAnaVisible(true);
                setAnaDialogue("Numerical protocol engaged.");
              }}>
                START
              </NeonButton>
            )}
          </div>
        </div>
      </Modal>

      {/* MARKET MODAL */}
      <Modal isOpen={marketOpen} fullScreen title="ANA // SYSTEM AI">
        <div className="h-full flex items-center justify-center">
          <div className="text-center space-y-6">
            <CheckCircle size={72} className="text-neon-green mx-auto" />
            <h2 className="text-3xl text-white font-orbitron">MARKET UNLOCKED</h2>

            <div className="flex gap-6 justify-center">
              <div className="text-neon-green font-mono"><Coins /> {sessionPoints}</div>
              <div className="text-neon-cyan font-mono">Tokens {sessionTokens}</div>
            </div>

            <NeonButton onClick={() => {
              setMarketOpen(false);
              setPostAnaOpen(true);
            }}>
              CONTINUE
            </NeonButton>
          </div>
        </div>
      </Modal>

      {/* POST ANA */}
      <Modal isOpen={postAnaOpen} showClose={false} title="ANA // SYSTEM AI">
        <div className="space-y-4">
          <div className="p-4 border border-neon-cyan bg-black font-mono text-neon-cyan">
            {POST_ANA_MESSAGES[postAnaStep]}
          </div>
          <div className="flex justify-end gap-3">
            {postAnaStep < POST_ANA_MESSAGES.length - 1 ? (
              <NeonButton onClick={() => setPostAnaStep(s => s + 1)}>
                NEXT
              </NeonButton>
            ) : (
              <NeonButton onClick={() => navigate("/market")}>
                OPEN MARKET
              </NeonButton>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Round2;
