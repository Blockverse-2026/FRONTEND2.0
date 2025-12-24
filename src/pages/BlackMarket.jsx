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
              Authorization: `Bearer ${localStorage.getItem(
                "BLOCKVERSE_TOKEN"
              )}`,
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
            Authorization: `Bearer ${localStorage.getItem(
              "BLOCKVERSE_TOKEN"
            )}`,
          },
          body: JSON.stringify({
            clueId: selectedClue._id,
          }),
        }
      );

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.message || "Purchase failed");
      }

      
      setTokens(json.data.tokensAvailable);
      addTokens(json.data.tokensAvailable);

      setOwnedClues((prev) => new Set(prev).add(selectedClue._id));
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
      {/* BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/60 to-black opacity-80" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6 md:p-10">
        {/* HEADER */}
        <div className="mb-8">
          <GlitchText text="BLACK MARKET" as="h2" size="large" />
          <div className="mt-2 font-mono text-neon-cyan/80">
            Knowledge has a price.
          </div>

          <div className="mt-4 flex justify-between items-center">
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

        {/* CLUES GRID */}
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
                <div className="font-orbitron text-white">
                  {clue.title}
                </div>

                <div className="mt-3 font-mono text-neon-cyan/70">
                  {clue.description.slice(0, 60)}...
                </div>

                <div className="mt-4 flex justify-between">
                  <span className="text-neon-cyan font-orbitron">
                    🪙 {clue.tokenCost}
                  </span>
                </div>

                {owned && (
                  <div className="absolute top-2 right-2 text-xs text-neon-green font-mono">
                    OWNED
                  </div>
                )}
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
            {ownedClues.has(selectedClue._id) ? (
              <div className="p-4 border border-neon-cyan/30 bg-black/50 font-mono text-neon-cyan">
                {selectedClue.description}
              </div>
            ) : (
              <div className="p-4 border border-neon-cyan/30 bg-black/50 font-mono text-neon-cyan/60">
                Encrypted clue. Purchase to reveal.
              </div>
            )}

            <div className="flex justify-end gap-3">
              <NeonButton
                variant="secondary"
                onClick={() => setClueModalOpen(false)}
              >
                CLOSE
              </NeonButton>

              <NeonButton
                onClick={buyClue}
                disabled={
                  tokens < selectedClue.tokenCost ||
                  ownedClues.has(selectedClue._id)
                }
              >
                BUY CLUE
              </NeonButton>
            </div>
          </div>
        )}
      </Modal>

      {/* CONFIRM MODAL */}
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
