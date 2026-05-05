"use client";

import React, { useEffect, useState } from "react";
import { JRPGWindow } from "./ui/JRPGWindow";
import { useGameStore } from "@/store/useGameStore";
import { getLevelProgress, getCharacterName, getEvolutionForm } from "@/lib/gameLogic";

export const StatusPanel = () => {
  const { playerName, skillEXP, physicalEXP, iqEXP, yearlyGoal, yearlyDeadline, monthlyGoal, monthlyDeadline, overallAdvice } = useGameStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const renderBeast = (type: "Fire" | "Water" | "Leaf", exp: number, label: string) => {
    const { level, expInLevel, expNeededInLevel, percentage } = getLevelProgress(exp);
    const form = getEvolutionForm(level);
    const charName = getCharacterName(type, level);
    const imagePath = `/assets/char/${type.toLowerCase()}/form_${form}.png`;
    
    const colorClass = type === "Fire" ? "text-red-400" : type === "Water" ? "text-blue-400" : "text-green-400";
    const barColor = type === "Fire" ? "bg-red-500" : type === "Water" ? "bg-blue-500" : "bg-green-500";

    return (
      <div className="flex flex-col items-center bg-slate-900/40 p-2 border border-slate-700 rounded relative">
        <div className="w-20 h-20 md:w-24 md:h-24 flex items-center justify-center relative overflow-hidden mb-1">
          <img 
            src={imagePath} 
            alt={charName}
            className="w-full h-full object-contain z-10"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
        <div className={`text-[10px] font-bold ${colorClass}`}>{charName}</div>
        <div className="w-full mt-1">
          <div className="flex justify-between text-[10px] mb-0.5">
            <span className="font-bold text-white">{label} Lv.{level}</span>
            <span className="text-slate-400">{Math.floor(expInLevel)} / {expNeededInLevel} EXP</span>
          </div>
          <div className="w-full bg-slate-800 border border-slate-600 h-1.5">
            <div className={`${barColor} h-full transition-all duration-500`} style={{ width: `${percentage}%` }}></div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <JRPGWindow title="修練ステータス">
      <div className="flex flex-col gap-4">
        {/* プレイヤー情報と目標 */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-700 pb-3">
          <div className="text-2xl text-yellow-400 font-black tracking-widest">{playerName}</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1 w-full max-w-2xl">
            <div className="bg-slate-900/60 p-2 border border-dashed border-slate-600 rounded text-[10px]">
              <div className="flex justify-between items-center mb-1">
                <span className="text-yellow-500 font-bold">【一年の誓い】</span>
                {yearlyDeadline && <span className="text-slate-500">至: {yearlyDeadline.replace(/-/g, "/")}</span>}
              </div>
              <div className="text-slate-200 italic">「{yearlyGoal}」</div>
            </div>
            <div className="bg-slate-900/60 p-2 border border-dashed border-slate-600 rounded text-[10px]">
              <div className="flex justify-between items-center mb-1">
                <span className="text-yellow-500 font-bold">【今月の誓い】</span>
                {monthlyDeadline && <span className="text-slate-500">至: {monthlyDeadline.replace(/-/g, "/")}</span>}
              </div>
              <div className="text-slate-200 italic">「{monthlyGoal}」</div>
            </div>
          </div>
        </div>

        {/* 3匹の霊獣 */}
        <div className="grid grid-cols-3 gap-2">
          {renderBeast("Fire", physicalEXP, "体力")}
          {renderBeast("Water", skillEXP, "技")}
          {renderBeast("Leaf", iqEXP, "知")}
        </div>

        {/* プロからのアドバイス */}
        {overallAdvice && (
          <div className="bg-slate-800/80 border-l-4 border-yellow-500 p-3 rounded text-xs relative animate-fade-in">
            <span className="text-yellow-400 font-bold block mb-1">日本代表プロからのアドバイス</span>
            <p className="text-slate-200 leading-relaxed italic">「{overallAdvice}」</p>
            <div className="absolute top-2 right-2 text-xl opacity-10">⚽</div>
          </div>
        )}
      </div>
    </JRPGWindow>
  );
};
