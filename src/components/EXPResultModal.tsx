"use client";

import React from "react";
import { JRPGWindow } from "./ui/JRPGWindow";
import { useGameStore } from "@/store/useGameStore";

export const EXPResultModal = () => {
  const { lastEXPResult, clearLastEXPResult } = useGameStore();

  if (!lastEXPResult) return null;

  const {
    gainedSkill,
    gainedPhysical,
    gainedIQ,
    prevSkillLv,
    newSkillLv,
    prevPhysicalLv,
    newPhysicalLv,
    prevIQLv,
    newIQLv,
    isLevelUp,
  } = lastEXPResult;

  const renderRow = (label: string, gained: number, prevLv: number, newLv: number) => {
    const levelUp = newLv > prevLv;
    return (
      <div className="flex flex-col gap-1 border-b border-slate-700/50 pb-2">
        <div className="flex justify-between items-center">
          <span className="text-yellow-400 font-bold tracking-wider">{label}</span>
          <span className="text-white font-mono">+{gained} EXP</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center gap-1">
            <span className="text-slate-400 text-xs">Lv.</span>
            <span className="text-white font-bold">{prevLv}</span>
          </div>
          <span className="text-yellow-500 font-bold">▶</span>
          <div className="flex items-center gap-1">
            <span className="text-slate-400 text-xs">Lv.</span>
            <span className={`text-xl font-black ${levelUp ? "text-yellow-400 animate-pulse scale-110 inline-block" : "text-white"}`}>
              {newLv}
            </span>
          </div>
          {levelUp && (
            <span className="ml-auto bg-yellow-500 text-[10px] px-2 py-0.5 rounded-full text-black font-black animate-bounce shadow-[0_0_10px_rgba(234,179,8,0.5)]">
              LEVEL UP!
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in pointer-events-auto">
      <JRPGWindow title="修練結果 - PRACTICE RESULT" className="w-full max-w-sm border-2 border-yellow-500 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
        <div className="flex flex-col gap-4">
          {isLevelUp && (
            <div className="text-center py-3 bg-gradient-to-r from-yellow-900/40 via-yellow-600/40 to-yellow-900/40 border-y border-yellow-500/50 my-2 relative overflow-hidden">
              <div className="absolute inset-0 bg-yellow-400/10 animate-pulse"></div>
              <span className="text-2xl font-black text-yellow-400 animate-bounce block drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                LEVEL UP!!
              </span>
            </div>
          )}

          <div className="flex flex-col gap-4 py-2">
            {renderRow("Skill", gainedSkill, prevSkillLv, newSkillLv)}
            {renderRow("Physical", gainedPhysical, prevPhysicalLv, newPhysicalLv)}
            {renderRow("IQ", gainedIQ, prevIQLv, newIQLv)}
          </div>

          <p className="text-[10px] text-slate-400 text-center italic mt-2">
            日々の積み重ねが、君を最強の選手へと導く。
          </p>

          <button 
            onClick={clearLastEXPResult}
            className="mt-4 bg-blue-700 hover:bg-blue-600 border-2 border-white p-2 text-center text-lg text-white transition-colors"
          >
            次へ
          </button>
        </div>
      </JRPGWindow>
    </div>
  );
};
