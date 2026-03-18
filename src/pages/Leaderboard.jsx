import React from 'react';
import { motion } from 'framer-motion';

const dummyData = [
  { rank: 1, name: 'CyberNinjas', score: 9850 },
  { rank: 2, name: 'DataWizards', score: 9700 },
  { rank: 3, name: 'CodeBreakers', score: 9650 },
  { rank: 4, name: 'NetRunners', score: 9500 },
  { rank: 5, name: 'GhostHackers', score: 9400 },
  { rank: 6, name: 'QuantumLeapers', score: 9350 },
  { rank: 7, name: 'BinaryBandits', score: 9200 },
  { rank: 8, name: 'SynthStrikers', score: 9150 },
  { rank: 9, name: 'GlitchMob', score: 9050 },
  { rank: 10, name: 'DataDynamos', score: 9000 },
];

const Leaderboard = () => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-5xl font-bold text-neon-cyan mb-8"
      >
        Leaderboard
      </motion.h1>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="w-full max-w-4xl bg-gray-900/50 p-4 sm:p-8 rounded-lg shadow-lg border border-neon-cyan/20"
      >
        <div className="grid grid-cols-3 gap-4 text-lg font-semibold text-neon-cyan/80 mb-4 pb-2 border-b border-neon-cyan/20">
          <div className="text-center">Rank</div>
          <div>Team</div>
          <div className="text-right">Score</div>
        </div>
        <ul className="space-y-2">
          {dummyData.map((entry, index) => (
            <motion.li
              key={entry.rank}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
              className="grid grid-cols-3 gap-4 items-center p-2 rounded-md transition-colors hover:bg-neon-cyan/10"
            >
              <div className="text-center text-2xl font-bold text-neon-cyan">{entry.rank}</div>
              <div className="text-lg font-semibold">{entry.name}</div>
              <div className="text-right text-xl font-mono">{entry.score}</div>
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
};

export default Leaderboard;
