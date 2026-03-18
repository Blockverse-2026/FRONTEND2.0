import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { io } from "socket.io-client";

const SOCKET_URL = "https://backend-3-jpwf.onrender.com";

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const socket = io(SOCKET_URL);

    socket.on("connect", () => {
      console.log("Connected to leaderboard socket");
    });

    socket.on("leaderboard:update", (data) => {
      console.log("Leaderboard update received:", data);
      setLeaderboardData(data);
      setLoading(false);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from leaderboard socket");
    });

    return () => {
      socket.disconnect();
    };
  }, []);

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
        className="w-full max-w-4xl bg-gray-900/50 p-4 sm:p-8 rounded-lg shadow-lg border border-neon-cyan/20 backdrop-blur-md"
      >
        <div className="grid grid-cols-3 gap-4 text-lg font-semibold text-neon-cyan/80 mb-4 pb-2 border-b border-neon-cyan/20">
          <div className="text-center">Rank</div>
          <div>Team ID</div>
          <div className="text-right">Total Points</div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-neon-cyan/50 font-mono animate-pulse">
            CONNECTING TO NEURAL NETWORK...
          </div>
        ) : (
          <ul className="space-y-2">
            {leaderboardData.map((entry, index) => (
              <motion.li
                key={entry.teamId || index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                className="grid grid-cols-3 gap-4 items-center p-3 rounded-md transition-colors hover:bg-neon-cyan/10 border-l-2 border-transparent hover:border-neon-cyan"
              >
                <div className="text-center text-2xl font-bold text-neon-cyan">
                  {index + 1}
                </div>
                <div className="text-lg font-semibold truncate">
                  {entry.teamId}
                </div>
                <div className="text-right text-xl font-mono text-neon-gold">
                  {entry.totalPoints.toLocaleString()}
                </div>
              </motion.li>
            ))}
          </ul>
        )}
      </motion.div>
    </div>
  );
};

export default Leaderboard;
