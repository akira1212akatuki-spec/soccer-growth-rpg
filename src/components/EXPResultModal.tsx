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
      <div className="flex flex-col gap-1 border-b border-slate-700 pb-2">
        <div className="flex justify-between items-center">
          <span className="text-yellow-400 font-bold">{label}</span>
          <span className="text-white">+{gained} EXP</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Lv.{prevLv}</span>
          <span className="text-slate-500">→</span>
          <span className={`font-bold ${levelUp ? "text-yellow-400 animate-pulse" : "text-white"}`}>
            Lv.{newLv}
          </span>
          {levelUp && <span className="bg-yellow-600 text-[10px] px-1 rounded text-white animate-bounce">LEVEL UP!</span>}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4 animate-fade-in pointer-events-auto">
      <JRPGWindow title="修練結果" className="w-full max-w-sm">
        <div className="flex flex-col gap-4">
          {isLevelUp && (
            <div className="text-center py-2 bg-yellow-900/30 border border-yellow-500/50 rounded mb-2">
              <span className="text-xl font-bold text-yellow-400 animate-bounce block">LEVEL UP!!</span>
            </div>
          )}

          <div className="flex flex-col gap-3">
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
