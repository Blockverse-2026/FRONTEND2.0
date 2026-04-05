import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import GlitchText from "../components/GlitchText";
import NeonButton from "../components/NeonButton";
import Modal from "../components/Modal";
import { useGame } from "../context/GameContext";

const ENCRYPTED_TEXT = "████ █████ ███ █████ █████ ████ █████";

const getRiskMeta = (cost) => {
  if (cost >= 5) return { label: "HIGH", text: "text-red-500" };
  if (cost >= 3) return { label: "MEDIUM", text: "text-yellow-400" };
  return { label: "LOW", text: "text-neon-green" };
};

const BlackMarket = () => {
  const navigate = useNavigate();
  const { gameState, addTokens, unlockFragment } = useGame();

  const [clues, setClues] = useState([]);
  const [ownedClues, setOwnedClues] = useState(new Set());

   const [selectedClue, setSelectedClue] = useState(null);
   const [clueModalOpen, setClueModalOpen] = useState(false);
   const [confirmOpen, setConfirmOpen] = useState(false);
   const [verifying, setVerifying] = useState(false);
   const [transactionError, setTransactionError] = useState(null);
   const [error, setError] = useState(null);

   // Initialize ownedClues from gameState
   useEffect(() => {
    if (gameState.fragments) {
      const ownedIds = gameState.fragments
        .filter(f => f.clueId)
        .map(f => f.clueId);
      setOwnedClues(new Set(ownedIds));
    }
  }, [gameState.fragments]);

  
  useEffect(() => {
    const fetchStore = async () => {
      try {
        const res = await fetch(
          "https://brl.akgec.ac.in/blockverse-26/api/round2/store",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("BLOCKVERSE_TOKEN")}`,
            },
          }
        );

        const json = await res.json();

        if (!res.ok || !json?.data?.availableClues) {
          throw new Error("Failed to load store");
        }

        setClues(json.data.availableClues);
        
        // Sync backend tokens with gameState
        if (typeof json.data.tokensAvailable === "number") {
          const diff = json.data.tokensAvailable - gameState.tokens;
          if (diff !== 0) addTokens(diff);
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchStore();
  }, []);

  /* ================= BUY CLUE ================= */
  const buyClue = async () => {
    if (!selectedClue || verifying) return;

    setVerifying(true);
    setTransactionError(null);

    try {
      const res = await fetch(
        "https://blockverse-backend.onrender.com/api/round2/store/buy",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("BLOCKVERSE_TOKEN")}`,
          },
          body: JSON.stringify({
            clueId: selectedClue.clueId,
          }),
        }
      );

      const json = await res.json();

      if (!res.ok) {
        setTransactionError(json.message || "Insufficient balance");
        return;
      }

      addTokens(-selectedClue.tokenCost);
      unlockFragment({
        clueId: selectedClue.clueId,
        title: selectedClue.title,
        data: selectedClue.description, // Round 3 expects 'data' field
      });
      setConfirmOpen(true);
    } catch {
      setTransactionError("Transaction failed");
    } finally {
      setVerifying(false);
    }
  };

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto p-6 md:p-10">
        <GlitchText text="BLACK MARKET" as="h2" size="large" />

        <div className="mt-6 flex justify-between">
          <div className="px-4 py-2 border border-neon-cyan/40">
            <div className="text-xs text-neon-cyan/70">TOKENS</div>
            <div className="text-2xl text-neon-cyan">{gameState.tokens}</div>
          </div>

          <NeonButton variant="secondary" onClick={() => navigate("/dashboard")}>
            EXIT MARKET
          </NeonButton>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {clues.map((clue) => {
            const owned = ownedClues.has(clue.clueId);
            const risk = getRiskMeta(clue.tokenCost);

            return (
              <Motion.div
                key={clue.clueId}
                whileHover={{ scale: 1.03 }}
                className="p-5 border border-neon-cyan/40 bg-black/50 cursor-pointer"
                onClick={() => {
                  setSelectedClue(clue);
                  setClueModalOpen(true);
                  setTransactionError(null);
                }}
              >
                <div className="flex justify-between">
                  <h3 className="text-white">{clue.title}</h3>
                  <span className={`text-xs ${risk.text}`}>{risk.label}</span>
                </div>

                <div
                  className={`mt-3 ${
                    owned ? "" : "blur-sm select-none"
                  } text-neon-cyan/60`}
                >
                  {clue.description.slice(0, 60)}...
                </div>

                <div className="mt-4 text-neon-gold">
                  🪙 {clue.tokenCost}
                </div>
              </Motion.div>
            );
          })}
        </div>
      </div>

      {/* CLUE MODAL */}
      <Modal
        isOpen={clueModalOpen}
        onClose={() => setClueModalOpen(false)}
        title={selectedClue?.title}
        showClose
      >
        {selectedClue && (
          <>
            <div
              className={`p-4 border border-neon-cyan/30 bg-black/50 ${
                ownedClues.has(selectedClue.clueId)
                  ? ""
                  : "blur-md select-none"
              }`}
            >
              {ownedClues.has(selectedClue.clueId)
                ? selectedClue.description
                : ENCRYPTED_TEXT}
            </div>

            {transactionError && (
              <div className="mt-3 text-red-500 font-mono text-sm">
                {transactionError}
              </div>
            )}

            <div className="flex justify-end gap-3 mt-6">
              <NeonButton
                variant="secondary"
                onClick={() => setClueModalOpen(false)}
              >
                CLOSE
              </NeonButton>

              {!ownedClues.has(selectedClue.clueId) && (
                <NeonButton
                  onClick={buyClue}
                  disabled={verifying}
                >
                  {verifying ? "VERIFYING..." : "BUY CLUE"}
                </NeonButton>
              )}
            </div>
          </>
        )}
      </Modal>

      {/* CONFIRM MODAL */}
      <Modal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="TRANSACTION CONFIRMED"
        showClose
      >
        <div className="text-center text-neon-cyan">
          Clue acquired.
        </div>
      </Modal>
    </div>
  );
};

export default BlackMarket;
