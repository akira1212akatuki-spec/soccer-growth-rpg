"use client";

import React from "react";
import { JRPGWindow } from "./ui/JRPGWindow";
import { useGameStore } from "@/store/useGameStore";
import { getCharacterName, getEvolutionForm } from "@/lib/gameLogic";

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
    evolutions,
  } = lastEXPResult;

  const renderRow = (type: "Fire" | "Water" | "Leaf", label: string, gained: number, prevLv: number, newLv: number) => {
    const levelUp = newLv > prevLv;
    const isEvolved = evolutions.includes(type);
    const currentName = getCharacterName(type, newLv);
    const imagePath = `/assets/char/${type.toLowerCase()}/form_${getEvolutionForm(newLv)}.png`;

    return (
      <div className="flex gap-3 items-center border-b border-slate-700/50 pb-3">
        <div className="w-16 h-16 bg-slate-800 border border-slate-700 rounded flex items-center justify-center relative overflow-hidden flex-shrink-0">
          <img src={imagePath} alt={currentName} className="w-full h-full object-contain z-10" />
          {isEvolved && (
            <div className="absolute inset-0 bg-yellow-400/20 animate-pulse z-0"></div>
          )}
        </div>
        
        <div className="flex-1 flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <span className={`font-bold tracking-wider text-xs ${type === "Fire" ? "text-red-400" : type === "Water" ? "text-blue-400" : "text-green-400"}`}>
              {label} <span className="text-white">+{gained} EXP</span>
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="text-[10px] text-slate-400">Lv.{prevLv}</div>
            <div className="text-yellow-500">▶</div>
            <div className={`text-lg font-black ${levelUp ? "text-yellow-400 animate-pulse" : "text-white"}`}>
              {newLv}
            </div>
            {levelUp && (
              <span className="text-[8px] bg-yellow-500 px-1 rounded text-black font-bold">UP!</span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <span className="text-[10px] text-slate-200 font-bold">{currentName}</span>
            {isEvolved && (
              <span className="text-[10px] text-yellow-400 font-black animate-bounce ml-auto">
                ★進化！SHINKA★
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in pointer-events-auto">
      <JRPGWindow title="★ 霊獣たちの成長 ★" className="w-full max-w-sm border-2 border-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.3)]">
        <div className="flex flex-col gap-4">
          <div className="text-center py-2 border-b border-slate-700">
            <span className="text-xs text-yellow-500 font-bold tracking-widest uppercase">Practice Result</span>
          </div>

          <div className="flex flex-col gap-4 py-2">
            {renderRow("Fire", "火の体", gainedPhysical, prevPhysicalLv, newPhysicalLv)}
            {renderRow("Water", "水の技", gainedSkill, prevSkillLv, newSkillLv)}
            {renderRow("Leaf", "草の知", gainedIQ, prevIQLv, newIQLv)}
          </div>

          {evolutions.length > 0 && (
            <div className="bg-yellow-900/30 border border-yellow-600 p-2 rounded text-center animate-bounce">
              <p className="text-yellow-400 font-black text-sm">
                霊獣が新たな姿へと進化した！
              </p>
            </div>
          )}

          <p className="text-[10px] text-slate-400 text-center italic mt-2">
            「そなたの汗が、霊獣たちの糧となる。」
          </p>

          <button 
            onClick={clearLastEXPResult}
            className="mt-2 bg-blue-800 hover:bg-blue-700 border-2 border-white p-2 text-center text-lg text-white font-bold transition-all shadow-[0_4px_0_rgb(30,58,138)] active:translate-y-1 active:shadow-none"
          >
            次へ進む
          </button>
        </div>
      </JRPGWindow>
    </div>
  );
};
