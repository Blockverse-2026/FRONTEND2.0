import React, { useState, useEffect } from "react";
import NeonButton from "./NeonButton";

export function TabGuardPopups({ warning, tabReset, onDismiss, onRestart, resetLabel = "CONTINUE" }) {
  const [freezeTimer, setFreezeTimer] = useState(60);

  useEffect(() => {
    let interval;
    if (tabReset && freezeTimer > 0) {
      interval = setInterval(() => {
        setFreezeTimer((t) => t - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [tabReset, freezeTimer]);

  useEffect(() => {
    if (!tabReset) {
      setFreezeTimer(60);
    }
  }, [tabReset]);

  if (!warning && !tabReset) return null;

  return (
    <>
      {warning && !tabReset && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[999] backdrop-blur-sm">
          <div className="border border-neon-gold/50 bg-black/90 p-6 max-w-sm w-full mx-4 font-mono shadow-[0_0_40px_rgba(255,170,0,0.15)]">
            <div className="text-neon-gold text-xs tracking-[0.4em] uppercase mb-4 border-b border-neon-gold/20 pb-2">
              ⚠ SECURITY VIOLATION DETECTED
            </div>
            <p className="text-white/80 text-sm leading-relaxed mb-3">
              WARNING! STAY ON THE MAIN CHAIN OTHERWISE YOU WILL BE ELIMINATED!🚫
            </p>
            <div className="bg-neon-gold/10 border border-neon-gold/20 px-3 py-2 text-neon-gold text-sm mb-4">
              Attempt <span className="font-bold text-white">{warning.attempt}</span> of 3 —{" "}
              <span className="text-red-400 font-bold">{warning.remaining} more</span> will CREATE VULNERABILITY FOR ELIMINATION⚠️
            </div>
            <div className="flex gap-2 mb-5">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-sm ${
                    i <= warning.attempt ? "bg-red-500" : "bg-white/10"
                  }`}
                />
              ))}
            </div>
            <NeonButton className="w-full" onClick={onDismiss}>
              ACKNOWLEDGED — RESUME
            </NeonButton>
          </div>
        </div>
      )}

      {tabReset && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[999] backdrop-blur-sm">
          <div className="border-2 border-red-500/60 bg-black/95 p-6 max-w-sm w-full mx-4 font-mono shadow-[0_0_60px_rgba(220,38,38,0.2)] text-center">
            <div className="text-red-500 text-4xl mb-4">✖</div>
            <div className="text-red-500 text-xs tracking-[0.4em] uppercase mb-3">
              FAIR PLAY VIOLATION
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-6">
              SUSPICIOUS ACTIVITY DETECTED. ANA HAS CUT YOU OFF FROM THE MAIN CHAIN.
            </p>

            <div className="mb-6">
              <div className="text-red-500/60 text-[10px] uppercase tracking-[0.2em] mb-2 font-mono">
                System Restoration in Progress
              </div>
              <div className="text-3xl font-orbitron text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                {String(Math.floor(freezeTimer / 60)).padStart(2, '0')}:
                {String(freezeTimer % 60).padStart(2, '0')}
              </div>
              <div className="mt-4 w-full bg-white/5 h-1 rounded-full overflow-hidden border border-white/10">
                <div 
                  className="h-full bg-red-600 transition-all duration-1000 ease-linear shadow-[0_0_10px_#dc2626]"
                  style={{ width: `${(freezeTimer / 60) * 100}%` }}
                />
              </div>
            </div>

            <NeonButton 
              variant="danger" 
              className="w-full" 
              onClick={onRestart}
              disabled={freezeTimer > 0}
            >
              {freezeTimer > 0 ? "CORE LOCKED" : resetLabel}
            </NeonButton>
          </div>
        </div>
      )}
    </>
  );
}