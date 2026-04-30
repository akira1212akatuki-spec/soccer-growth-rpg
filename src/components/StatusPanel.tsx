"use client";

import React, { useEffect, useState } from "react";
import { JRPGWindow } from "./ui/JRPGWindow";
import { useGameStore } from "@/store/useGameStore";
import { calculateLevelFromEXP, calculateNextEXP, calculateTotalLevel, getCharacterName, getEvolutionForm } from "@/lib/gameLogic";

export const StatusPanel = () => {
  const { playerName, charType, skillEXP, physicalEXP, iqEXP, yearlyGoal, yearlyDeadline, monthlyGoal, monthlyDeadline, overallAdvice } = useGameStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !charType) return null;

  const skillLv = calculateLevelFromEXP(skillEXP);
  const physicalLv = calculateLevelFromEXP(physicalEXP);
  const iqLv = calculateLevelFromEXP(iqEXP);
  const totalLv = calculateTotalLevel(skillEXP, physicalEXP, iqEXP);
  const form = getEvolutionForm(totalLv);
  const charName = getCharacterName(charType, totalLv);

  // プレースホルダーの画像パス
  const imagePath = `/assets/char/${charType.toLowerCase()}/form_${form}.png`;

  const renderBar = (label: string, lv: number, exp: number) => {
    const nextExp = calculateNextEXP(lv);
    const prevExp = lv > 1 ? calculateNextEXP(lv - 1) : 0;
    const currentLevelExp = exp - prevExp;
    const expNeededForLevel = nextExp - prevExp;
    const percentage = Math.min(100, Math.max(0, (currentLevelExp / expNeededForLevel) * 100));

    return (
      <div className="mb-2">
        <div className="flex justify-between text-sm mb-1">
          <span>{label} Lv.{lv}</span>
          <span>{exp} / {nextExp}</span>
        </div>
        <div className="w-full bg-slate-800 border border-white h-3">
          <div className="bg-yellow-400 h-full transition-all duration-500" style={{ width: `${percentage}%` }}></div>
        </div>
      </div>
    );
  };

  return (
    <JRPGWindow title="ステータス">
      <div className="flex flex-col md:flex-row gap-6">
        {/* キャラクター画像プレースホルダー */}
        <div className="flex-shrink-0 flex flex-col items-center gap-2">
          <div className="text-xl text-yellow-400 font-bold">{playerName}</div>
            <div className="w-32 h-32 md:w-48 md:h-48 border-2 border-white flex flex-col items-center justify-center relative overflow-hidden bg-slate-900">
              {/* 画像が存在する場合は表示、そうでない場合は絵文字を表示 */}
              <div className="w-full h-full flex items-center justify-center overflow-hidden">
                <img 
                  src={imagePath} 
                  alt={charName}
                  className="w-full h-full object-contain z-10 scale-150 transform transition-transform duration-500" // ズームして中心のキャラを強調
                  onError={(e) => {
                    // 画像が見つからない場合は非表示にして絵文字を出す
                    (e.target as HTMLImageElement).style.display = 'none';
                    const fallback = (e.target as HTMLImageElement).parentElement?.parentElement?.querySelector('.fallback-emoji') as HTMLElement;
                    if (fallback) fallback.style.display = 'block';
                  }}
                />
              </div>
              <div className="text-6xl hidden fallback-emoji z-0">
                {charType === "Fire" ? "🔥" : charType === "Water" ? "💧" : "🌿"}
              </div>
            </div>
          <p className="text-sm font-bold">{charName}</p>
          <div className="bg-slate-800 border border-white px-3 py-1 text-sm mt-1">
            Total Lv. <span className="text-yellow-400 text-lg">{totalLv}</span>
          </div>
        </div>

        {/* ステータスと目標 */}
        <div className="flex-1 w-full flex flex-col justify-between">
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2 text-xs">
              <div className="border border-dashed border-slate-500 p-2 rounded bg-slate-900/50">
                <div className="flex justify-between items-end mb-1">
                  <div className="text-yellow-400">1年間の目標</div>
                  {yearlyDeadline && <div className="text-[10px] text-slate-400">期日: {yearlyDeadline.replace(/-/g, "/")}</div>}
                </div>
                <div className="text-white">{yearlyGoal}</div>
              </div>
              <div className="border border-dashed border-slate-500 p-2 rounded bg-slate-900/50">
                <div className="flex justify-between items-end mb-1">
                  <div className="text-yellow-400">今月の目標</div>
                  {monthlyDeadline && <div className="text-[10px] text-slate-400">期日: {monthlyDeadline.replace(/-/g, "/")}</div>}
                </div>
                <div className="text-white">{monthlyGoal}</div>
              </div>
            </div>

            {/* AI総合アドバイス */}
            {overallAdvice && (
              <div className="mb-4 bg-slate-800/80 border-l-4 border-blue-500 p-3 rounded text-xs relative">
                <span className="text-blue-400 font-bold block mb-1">コーチからの総合評価</span>
                <p className="text-white">{overallAdvice}</p>
                <div className="absolute top-2 right-2 text-xl opacity-20">⚽</div>
              </div>
            )}
            
            {renderBar("Skill", skillLv, skillEXP)}
            {renderBar("Physical", physicalLv, physicalEXP)}
            {renderBar("IQ", iqLv, iqEXP)}
          </div>
        </div>
      </div>
    </JRPGWindow>
  );
};
