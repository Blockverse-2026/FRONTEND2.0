import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import GlitchText from "../components/GlitchText";
import NeonButton from "../components/NeonButton";
import Modal from "../components/Modal";
import { useGame } from "../context/GameContext";

const BlackMarket = () => {
  const navigate = useNavigate();
  const { addTokens, completeRound } = useGame();

  const [clues, setClues] = useState([]);
  const [tokens, setTokens] = useState(0);

  const [ownedClues, setOwnedClues] = useState(new Set());

  const [selectedClue, setSelectedClue] = useState(null);
  const [clueModalOpen, setClueModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const res = await fetch(
          "https://blockverse-backend.onrender.com/api/round2/phase2/store",
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
        setTokens(json.data.tokensAvailable);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchStore();
  }, []);


  const buyClue = async () => {
    if (!selectedClue) return;

    setVerifying(true);
    setConfirmOpen(true);

    try {
      const res = await fetch(
        "https://blockverse-backend.onrender.com/api/round2/phase2/store/buy",
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
        throw new Error(json.message || "Purchase failed");
      }

      setTokens(json.data.tokensAvailable);
      addTokens(-selectedClue.tokenCost);

      setOwnedClues((prev) => new Set(prev).add(selectedClue.clueId));
    } catch (err) {
      alert(err.message);
    } finally {
      setVerifying(false);
    }
  };

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      <div className="relative z-10 max-w-7xl mx-auto p-6 md:p-10">
        {/* HEADER */}
        <div className="mb-10">
          <GlitchText text="BLACK MARKET" as="h2" size="large" />
          <p className="mt-2 font-mono text-neon-cyan/80">
            Knowledge has a price.
          </p>

          <div className="mt-6 flex justify-between items-center">
            <div className="px-4 py-2 border border-neon-cyan/40 bg-black/60">
              <span className="text-xs font-mono text-neon-cyan/70">
                TOKENS
              </span>
              <div className="font-orbitron text-2xl text-neon-cyan">
                {tokens}
              </div>
            </div>

            <NeonButton
              variant="secondary"
              onClick={() => {
                completeRound("round2");
                navigate("/dashboard");
              }}
            >
              EXIT MARKET
            </NeonButton>
          </div>
        </div>

        {/* CLUE GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {clues.map((clue) => {
            const owned = ownedClues.has(clue._id);

            return (
              <Motion.div
                key={clue._id}
                whileHover={{ scale: 1.03 }}
                className="p-5 bg-black/50 border border-neon-cyan/40 rounded-sm cursor-pointer relative"
                onClick={() => {
                  setSelectedClue(clue);
                  setClueModalOpen(true);
                }}
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-orbitron text-lg text-white">
                    {clue.title}
                  </h3>
                  <span className={`text-xs font-mono ${risk.text}`}>
                    {risk.label} RISK
                  </span>
                </div>

                <div className="mt-3 font-mono text-neon-cyan/70">
                  {clue.description.slice(0, 60)}...
                </div>

                <div className="mt-6 flex justify-between items-center">
                  <span className="font-orbitron text-neon-gold">
                    🪙 {clue.tokenCost}
                  </span>

                  {owned && (
                    <span className="text-xs font-mono text-neon-green">
                      OWNED
                    </span>
                  )}
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
        showClose={false}
      >
        {selectedClue && (
          <div className="space-y-6">
            <div
              className={`p-4 min-h-[120px] border border-neon-cyan/30 bg-black/50 font-mono whitespace-pre-wrap transition-all duration-300
                ${
                  ownedClues.has(selectedClue.clueId)
                    ? "text-neon-cyan"
                    : "text-neon-cyan/60 blur-md select-none"
                }`}
            >
              {ownedClues.has(selectedClue.clueId)
                ? selectedClue.description
                : ENCRYPTED_TEXT}
            </div>

            <div className="flex justify-end gap-3">
              <NeonButton
                variant="secondary"
                onClick={() => setClueModalOpen(false)}
              >
                CLOSE
              </NeonButton>

              
              {!ownedClues.has(selectedClue.clueId) && (
                <NeonButton
                  onClick={buyClue}
                  disabled={verifying || tokens < selectedClue.tokenCost}
                >
                  {verifying ? "VERIFYING..." : "BUY CLUE"}
                </NeonButton>
              )}
            </div>
          </div>
        )}
      </Modal>

      
      <Modal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="TRANSACTION CONFIRMED"
        showClose={false}
      >
        <div className="text-center space-y-6">
          <div className="font-mono text-neon-cyan">
            {verifying ? "Verifying wallet…" : "Clue acquired."}
          </div>

          <NeonButton
            onClick={() => {
              setConfirmOpen(false);
              setClueModalOpen(true);
            }}
          >
            CONTINUE
          </NeonButton>
        </div>
      </Modal>
    </div>
  );
};

export default BlackMarket;
