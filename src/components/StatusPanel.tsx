"use client";

import React, { useEffect, useState } from "react";
import { JRPGWindow } from "./ui/JRPGWindow";
import { useGameStore } from "@/store/useGameStore";
import { getLevelProgress, getCharacterName, getEvolutionForm } from "@/lib/gameLogic";
import { MONSTERS } from "@/lib/monsters";

export const StatusPanel = () => {
  const {
    playerName, skillEXP, physicalEXP, iqEXP,
    yearlyGoal, yearlyDeadline, monthlyGoal, monthlyDeadline,
    overallAdvice, todayMonster, yesterdayMonster, monsterBonusActive,
  } = useGameStore();
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
      <div className="flex flex-col items-center bg-slate-900/40 p-2 border border-slate-700 rounded relative overflow-hidden group cursor-pointer w-full">
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
        <div className="w-full overflow-hidden text-center mt-1 select-none">
          <div className="rpg-beast-name-container">
            <span className={`rpg-beast-name text-[10px] font-bold ${colorClass} whitespace-nowrap text-ellipsis overflow-hidden`}>
              {charName}
            </span>
          </div>
        </div>
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

        {/* 心の魔物セクション */}
        <MonsterSection 
          todayMonster={todayMonster} 
          yesterdayMonster={yesterdayMonster}
          monsterBonusActive={monsterBonusActive}
        />

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
      <style>{`
        @keyframes rpg-beast-marquee {
          0% { transform: translateX(0); }
          15% { transform: translateX(0); }
          85% { transform: translateX(min(0px, calc(-100% + 72px))); }
          100% { transform: translateX(min(0px, calc(-100% + 72px))); }
        }
        .rpg-beast-name-container {
          position: relative;
          width: 100%;
          overflow: hidden;
          height: 14px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .rpg-beast-name {
          display: inline-block;
          max-width: 100%;
          transition: transform 0.3s ease;
        }
        .group:hover .rpg-beast-name,
        .group:active .rpg-beast-name {
          max-width: none;
          overflow: visible;
          text-overflow: clip;
          animation: rpg-beast-marquee 3.5s ease-in-out infinite alternate;
        }
      `}</style>
    </JRPGWindow>
  );
};

// 魔物セクションを別コンポーネントに分離（useState を使用するため）
const MonsterSection = ({ 
  todayMonster, 
  yesterdayMonster, 
  monsterBonusActive 
}: { 
  todayMonster: import("@/store/useGameStore").TodayMonsterState | null;
  yesterdayMonster: import("@/store/useGameStore").YesterdayMonsterState | null;
  monsterBonusActive: boolean;
}) => {
  const [imgError, setImgError] = useState(false);

  if (!todayMonster) return null;
  const monster = MONSTERS.find((m) => m.id === todayMonster.monsterId);
  if (!monster) return null;

  const progress = Math.min(todayMonster.accumulatedMinutes, monster.requiredMinutes);
  const percentage = (progress / monster.requiredMinutes) * 100;
  const remaining = Math.max(0, monster.requiredMinutes - todayMonster.accumulatedMinutes);

  const categoryLabel =
    monster.category === "Physical" ? "Physical（フィジカル）" :
    monster.category === "IQ" ? "IQ（サッカーIQ）" : "Skill（ボールタッチ）";

  const gaugeColor =
    monster.category === "Physical" ? "bg-blue-500" :
    monster.category === "IQ" ? "bg-purple-500" : "bg-red-500";

  const showBonusBanner = monsterBonusActive && yesterdayMonster && yesterdayMonster.defeated;

  const bonusBanner = showBonusBanner ? (
    <div className="bg-yellow-950/40 border-2 border-yellow-500 rounded p-3 flex items-center justify-between animate-pulse">
      <div className="flex items-center gap-3">
        <span className="text-2xl">✨</span>
        <div>
          <p className="text-yellow-400 font-black text-xs md:text-sm tracking-wide">
            昨日は見事、「{yesterdayMonster.monsterName}」を追い払った！
          </p>
          <p className="text-white text-[10px] md:text-xs font-bold mt-0.5">
            経験値２倍ボーナス中！ (本日の最初の練習に適用されます)
          </p>
        </div>
      </div>
      <span className="text-xl md:text-2xl">🔥</span>
    </div>
  ) : null;

  if (todayMonster.defeated) {
    return (
      <div className="flex flex-col gap-3">
        {bonusBanner}
        <div className="bg-yellow-900/20 border border-yellow-500 rounded p-3 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-400 font-black text-sm">魔物撃退！頑張ったな！</p>
              <p className={`text-[10px] ${monster.color} font-bold`}>{monster.name} を追い払った</p>
            </div>
            <span className="text-3xl">🏆</span>
          </div>
          {todayMonster.defeatComment && (
            <div className="bg-slate-900/60 border border-slate-600 rounded p-2">
              <span className="text-[10px] text-yellow-400 font-bold block mb-1">⚽ プロからのコメント</span>
              <p className="text-[10px] text-slate-200 italic leading-relaxed">「{todayMonster.defeatComment}」</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {bonusBanner}
      <div className={`${monster.bgColor} border ${monster.borderColor} rounded p-3 flex flex-col gap-3`}>
        {/* 魔物画像（横幅フル） */}
        <div className="w-full flex justify-center">
          {!imgError ? (
            <img
              src={monster.imagePath}
              alt={monster.name}
              className="w-full max-h-48 object-contain"
              onError={() => setImgError(true)}
            />
          ) : (
            <span className="text-6xl">👹</span>
          )}
        </div>
        {/* 魔物名・条件 */}
        <div>
          <p className={`font-black text-base text-center ${monster.color}`}>{monster.name}</p>
          <p className="text-[11px] text-slate-300 text-center mt-0.5">
            撃退条件：<span className="font-bold text-white">{categoryLabel}</span> 累計 {monster.requiredMinutes}分超
          </p>
        </div>
        {/* ゲージ */}
        <div>
          <div className="flex justify-between text-[10px] mb-1">
            <span className="text-slate-300">修練ゲージ</span>
            <span className="text-white font-bold">
              {todayMonster.accumulatedMinutes}分 / {monster.requiredMinutes}分
              {remaining > 0 && <span className="text-slate-400">(あと {remaining}分)</span>}
            </span>
          </div>
          <div className="w-full bg-slate-900 border border-slate-600 h-3 rounded overflow-hidden">
            <div
              className={`h-full transition-all duration-700 ${gaugeColor}`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
