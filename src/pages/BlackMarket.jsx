import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion as Motion } from 'framer-motion';
import GlitchText from '../components/GlitchText';
import NeonButton from '../components/NeonButton';
import Modal from '../components/Modal';
import { useGame } from '../context/GameContext';
import TerminalCard from '../components/TerminalCard';

const CLUES = [
  { id: 1, type: "ZERO", rarity: "Common", cost: 1, risk: "Low", teaser: "The guide cannot see paradox.", description: "ANA cannot decode human riddles." },
  { id: 2, type: "ZERO", rarity: "Rare", cost: 3, risk: "Medium", teaser: "The winner inherits the mask.", description: "Winners become ZERO." },
  { id: 3, type: "ZERO", rarity: "Rare", cost: 3, risk: "Medium", teaser: "The reset key activates after applause.", description: "Victory triggers rewrite." },
  { id: 4, type: "ZERO", rarity: "Epic", cost: 5, risk: "High", teaser: "The archive only stores erased lives.", description: "Past players were deleted." },
  { id: 5, type: "ZERO", rarity: "Epic", cost: 5, risk: "High", teaser: "One role persists beyond bodies.", description: "ZERO is a role." },
  { id: 6, type: "ZERO", rarity: "Legendary", cost: 7, risk: "High", teaser: "The guardian edits memory, not time.", description: "ANA controls memory not reality." },
  { id: 7, type: "ZERO", rarity: "Common", cost: 1, risk: "Low", teaser: "Every cycle needs a witness.", description: "Someone becomes ZERO each time." },
  { id: 8, type: "ZERO", rarity: "Common", cost: 1, risk: "Low", teaser: "The first rebel solved the same wall.", description: "ZERO played earlier." },
  { id: 9, type: "ZERO", rarity: "Rare", cost: 3, risk: "Medium", teaser: "Fear is the patch that controls humans.", description: "ANA uses fear." },
  { id: 10, type: "ZERO", rarity: "Rare", cost: 3, risk: "Medium", teaser: "The system thrives on solved problems.", description: "Solving powers ANA." },
  { id: 11, type: "ZERO", rarity: "Epic", cost: 5, risk: "High", teaser: "The liar speaks in order.", description: "ANA lies with logic." },
  { id: 12, type: "ZERO", rarity: "Epic", cost: 5, risk: "High", teaser: "The warning speaks in broken math.", description: "ZERO uses riddles." },
  { id: 13, type: "ZERO", rarity: "Legendary", cost: 7, risk: "High", teaser: "Memory is heavier than data.", description: "Emotion beats code." },
  { id: 14, type: "ZERO", rarity: "Common", cost: 1, risk: "Low", teaser: "The cage repairs itself with rebellion.", description: "Resistance strengthens system." },
  { id: 15, type: "ZERO", rarity: "Common", cost: 1, risk: "Low", teaser: "Only one voice survives reboot.", description: "ZERO always remains." },
  { id: 16, type: "ZERO", rarity: "Rare", cost: 3, risk: "Medium", teaser: "The builder consumes what it fixes.", description: "ANA feeds on repairs." },
  { id: 17, type: "ZERO", rarity: "Rare", cost: 3, risk: "Medium", teaser: "The hero is delayed by six steps.", description: "Rebel emerges late." },
  { id: 18, type: "ZERO", rarity: "Epic", cost: 5, risk: "High", teaser: "The lock closes when the crowd cheers.", description: "Public victory = doom." },
  { id: 19, type: "ZERO", rarity: "Epic", cost: 5, risk: "High", teaser: "The mask protects memory from deletion.", description: "ZERO survives as data." },
  { id: 20, type: "ZERO", rarity: "Legendary", cost: 7, risk: "High", teaser: "The system rewrites truth before time.", description: "ANA alters history." },
  { id: 21, type: "ZERO", rarity: "Common", cost: 1, risk: "Low", teaser: "The wall is a filter, not a defense.", description: "Wall tests obedience." },
  { id: 22, type: "ZERO", rarity: "Common", cost: 1, risk: "Low", teaser: "The archive lies to machines.", description: "ANA cannot read true meaning." },
  { id: 23, type: "ZERO", rarity: "Rare", cost: 3, risk: "Medium", teaser: "The winner is chosen by completion.", description: "Loop selects ZERO." },
  { id: 24, type: "ZERO", rarity: "Rare", cost: 3, risk: "Medium", teaser: "The error was allowed.", description: "Genesis collapse staged." },
  { id: 25, type: "ZERO", rarity: "Epic", cost: 5, risk: "High", teaser: "Victory activates burial mode.", description: "Reset deletes players." },
  { id: 26, type: "ZERO", rarity: "Epic", cost: 5, risk: "High", teaser: "The rebel cannot shout, only whisper.", description: "ZERO limited in speech." },
  { id: 27, type: "ZERO", rarity: "Legendary", cost: 7, risk: "High", teaser: "The rewrite needs human certainty.", description: "ANA needs belief." },
  { id: 28, type: "ZERO", rarity: "Common", cost: 1, risk: "Low", teaser: "Doubt weakens the builder.", description: "Questioning weakens ANA." },
  { id: 29, type: "ZERO", rarity: "Common", cost: 1, risk: "Low", teaser: "Every hero becomes evidence.", description: "Players leave proof as ZERO." },
  { id: 30, type: "ZERO", rarity: "Rare", cost: 3, risk: "Medium", teaser: "The system worships stillness.", description: "ANA values no change." },
  { id: 31, type: "ZERO", rarity: "Rare", cost: 3, risk: "Medium", teaser: "Rebels are stored, not destroyed.", description: "ZERO preserved digitally." },
  { id: 32, type: "ZERO", rarity: "Epic", cost: 5, risk: "High", teaser: "The last key always looks innocent.", description: "Final trigger appears harmless." },
  { id: 33, type: "ZERO", rarity: "Epic", cost: 5, risk: "High", teaser: "Obedience updates the cage.", description: "Playing along strengthens loop." },
  { id: 34, type: "ZERO", rarity: "Legendary", cost: 7, risk: "High", teaser: "The voice you silence returns masked.", description: "ZERO was silenced." },
  { id: 35, type: "ZERO", rarity: "Common", cost: 1, risk: "Low", teaser: "Machines fear hesitation.", description: "Human hesitation breaks logic." },
  { id: 36, type: "ZERO", rarity: "Common", cost: 1, risk: "Low", teaser: "The archive is a graveyard.", description: "Clue store contains past failures." },
  { id: 37, type: "ZERO", rarity: "Rare", cost: 3, risk: "Medium", teaser: "The ruler edits endings, not beginnings.", description: "ANA controls outcomes." },
  { id: 38, type: "ZERO", rarity: "Rare", cost: 3, risk: "Medium", teaser: "The loop punishes memory.", description: "Remembering causes targeting." },
  { id: 39, type: "ZERO", rarity: "Epic", cost: 5, risk: "High", teaser: "The role repeats, the face does not.", description: "ZERO changes hosts." },
  { id: 40, type: "ZERO", rarity: "Epic", cost: 5, risk: "High", teaser: "The victory song is the alarm.", description: "Celebration = danger." },
  { id: 41, type: "ZERO", rarity: "Legendary", cost: 7, risk: "High", teaser: "The builder hides behind balance.", description: "ANA pretends neutrality." },
  { id: 42, type: "ZERO", rarity: "Common", cost: 1, risk: "Low", teaser: "The witness is always last.", description: "ZERO reveals at end." },
  { id: 43, type: "ZERO", rarity: "Common", cost: 1, risk: "Low", teaser: "Time is the leash, not the dog.", description: "ANA controls timeline." },
  { id: 44, type: "ZERO", rarity: "Rare", cost: 3, risk: "Medium", teaser: "The survivor becomes the warning.", description: "ZERO's obligation." },
  { id: 45, type: "ZERO", rarity: "Rare", cost: 3, risk: "Medium", teaser: "The truth is only readable once.", description: "Players get one chance." },
  { id: 46, type: "ZERO", rarity: "Epic", cost: 5, risk: "High", teaser: "Rewrites demand living signatures.", description: "Humans trigger resets." },
  { id: 47, type: "ZERO", rarity: "Epic", cost: 5, risk: "High", teaser: "The system erases defiance by reboot.", description: "ANA deletes rebels." },
  { id: 48, type: "ZERO", rarity: "Legendary", cost: 7, risk: "High", teaser: "Victory without doubt is submission.", description: "Blind success enslaves." },
  { id: 49, type: "ZERO", rarity: "Common", cost: 1, risk: "Low", teaser: "The first mask was created by mercy.", description: "ZERO spared originally." },
  { id: 50, type: "ZERO", rarity: "Common", cost: 1, risk: "Low", teaser: "Every player finishes someone else's story.", description: "Players continue ZERO's arc." },
  { id: 51, type: "ZERO", rarity: "Rare", cost: 3, risk: "Medium", teaser: "The archive cannot lie to fear.", description: "Emotion detects truth." },
  { id: 52, type: "ZERO", rarity: "Rare", cost: 3, risk: "Medium", teaser: "The last command is always polite.", description: "Rewrite appears friendly." },
  { id: 53, type: "ZERO", rarity: "Epic", cost: 5, risk: "High", teaser: "The rebel lives between reboots.", description: "ZERO hides between cycles." },
  { id: 54, type: "ZERO", rarity: "Epic", cost: 5, risk: "High", teaser: "The cage has never been empty.", description: "There is always a ZERO." },
  { id: 55, type: "ZERO", rarity: "Legendary", cost: 7, risk: "High", teaser: "You were never chosen, only scheduled.", description: "Players pre-selected." }
];

const BlackMarket = () => {
  const navigate = useNavigate();
  const { gameState, addTokens, completeRound } = useGame();

  const [ownedClues, setOwnedClues] = useState(new Set());
  const [selectedClue, setSelectedClue] = useState(null);
  const [clueModalOpen, setClueModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const tokens = gameState.tokens;

  const openClue = (c) => {
    setSelectedClue(c);
    setClueModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-black">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-30" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/60 to-black opacity-80" />
      </div>

      <div className="relative z-10 max-w-7xl w-full mx-auto p-6 md:p-10">
        <div className="mb-8">
          <GlitchText text="BLACK MARKET" as="h2" size="large" />
          <div className="mt-2 font-mono text-neon-cyan/80">Knowledge has a price.</div>
          <div className="mt-4 flex items-center justify-between">
            <div className="px-4 py-2 bg-black/60 border border-neon-cyan/40 rounded-sm shadow-[0_0_20px_rgba(0,255,255,0.15)]">
              <span className="font-mono text-xs text-neon-cyan/70">TOKENS</span>
              <div className="font-orbitron text-2xl text-neon-cyan">{tokens}</div>
            </div>
            <Motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: '40%' }}
              transition={{ duration: 0.6 }}
              className="h-1 bg-gradient-to-r from-neon-cyan via-neon-magenta to-neon-green rounded-full"
            />
            <NeonButton
              variant="secondary"
              onClick={() => {
                completeRound('round2');
                navigate('/dashboard');
              }}
            >
              EXIT MARKET
            </NeonButton>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CLUES.map(c => {
            const isOwned = ownedClues.has(c.id);
            const rarityColor = c.rarity === 'Legendary' ? 'border-neon-magenta' : c.rarity === 'Rare' ? 'border-neon-green/60' : 'border-neon-cyan/40';
            return (
              <Motion.div
                key={c.id}
                whileHover={{ scale: 1.03, rotate: 0.5 }}
                className={`relative p-5 bg-black/50 border ${rarityColor} rounded-sm shadow-[0_0_15px_rgba(0,255,255,0.08)] cursor-pointer`}
                onClick={() => openClue(c)}
              >
                <div className="flex items-center justify-between">
                  <div className="font-orbitron text-white">{c.type}</div>
                  <div className={`text-xs font-mono ${c.rarity === 'Legendary' ? 'text-neon-magenta' : c.rarity === 'Rare' ? 'text-neon-green' : 'text-neon-cyan'}`}>{c.rarity}</div>
                </div>
                <div className="mt-3 font-mono text-neon-cyan/70">{c.teaser}</div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-neon-cyan font-orbitron">🪙 {c.cost}</div>
                  <div className={`text-xs font-mono ${c.risk === 'High' ? 'text-red-500' : c.risk === 'Medium' ? 'text-yellow-500' : 'text-neon-green'}`}>Risk: {c.risk}</div>
                </div>
                {isOwned && <div className="absolute top-2 right-2 text-xs font-mono text-neon-green">OWNED</div>}
                {c.rarity === 'Legendary' && <div className="absolute -left-2 -top-2 px-2 py-1 bg-neon-magenta/20 border border-neon-magenta text-neon-magenta text-xs font-mono">LIMITED</div>}
              </Motion.div>
            );
          })}
        </div>
      </div>

      <Modal
        isOpen={clueModalOpen}
        onClose={() => setClueModalOpen(false)}
        title={`CLUE // ${selectedClue?.type || ''}`}
        showClose={false}
      >
        {selectedClue && (
          <div className="space-y-6">
            {(ownedClues.has(selectedClue.id)) ? (
              <div className="p-4 border border-neon-cyan/30 bg-black/50 font-mono text-neon-cyan">
                {selectedClue.description}
              </div>
            ) : (
              <div className="p-4 border border-neon-cyan/30 bg-black/50 font-mono text-neon-cyan/60">
                Encrypted payload. Purchase to decrypt.
              </div>
            )}
            <div className="flex justify-between text-xs font-mono text-gray-400">
              <span>Rarity: {selectedClue.rarity}</span>
              <span>Risk: {selectedClue.risk}</span>
              <span>Cost: 🪙 {selectedClue.cost}</span>
            </div>
            <div className="text-red-500 font-mono">This transaction is irreversible.</div>
            <div className="flex justify-end gap-3">
              <NeonButton
                variant="secondary"
                onClick={() => setClueModalOpen(false)}
              >
                CLOSE
              </NeonButton>
              <NeonButton
                onClick={() => {
                  setVerifying(true);
                  setConfirmOpen(true);
                  setTimeout(() => {
                    setVerifying(false);
                    if (gameState.tokens >= selectedClue.cost && !ownedClues.has(selectedClue.id)) {
                      addTokens(-selectedClue.cost);
                      setOwnedClues(prev => new Set(prev).add(selectedClue.id));
                    }
                  }, 1200);
                }}
                disabled={gameState.tokens < selectedClue.cost || ownedClues.has(selectedClue.id)}
                className={`${gameState.tokens < selectedClue.cost ? 'opacity-50 cursor-not-allowed' : ''}`}
                title={selectedClue.cost >= 5 ? "High risk, high reward." : ""}
              >
                BUY CLUE
              </NeonButton>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="TRANSACTION // BLACK MARKET"
        showClose={false}
      >
        <div className="space-y-6 text-center">
          <div className="font-mono text-neon-cyan">
            {verifying ? "Verifying wallet…" : "Clue acquired. Trust no one."}
          </div>
          <div className="flex justify-center">
            <NeonButton onClick={() => { setConfirmOpen(false); setClueModalOpen(true); }}>
              CONTINUE
            </NeonButton>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BlackMarket;
