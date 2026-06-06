"use client";

import React, { useEffect, useState } from "react";
import { JRPGWindow } from "./ui/JRPGWindow";
import { useGameStore } from "@/store/useGameStore";
import { getLevelProgress, getCharacterName, getEvolutionForm, getLocalDateString } from "@/lib/gameLogic";
import { MONSTERS, DEMON_KING } from "@/lib/monsters";

export const StatusPanel = () => {
  const {
    playerName, skillEXP, physicalEXP, iqEXP,
    yearlyGoal, yearlyDeadline, monthlyGoal, monthlyDeadline,
    overallAdvice, todayMonster, yesterdayMonster, monsterBonusDate,
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
      <div className="flex flex-row md:flex-col items-center bg-slate-900/40 p-3 md:p-2 border border-slate-700 rounded relative overflow-hidden group cursor-pointer w-full gap-3 md:gap-1">
        <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex-shrink-0 flex items-center justify-center relative overflow-hidden">
          <img 
            src={imagePath} 
            alt={charName}
            className="w-full h-full object-contain z-10"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
        <div className="flex-1 md:w-full flex flex-col justify-center">
          {/* 1. 名前 */}
          <div className="w-full text-left md:text-center select-none overflow-hidden">
            <span className={`text-[12px] sm:text-xs md:text-[10px] font-black ${colorClass} tracking-wide whitespace-nowrap`}>
              {charName}
            </span>
          </div>
          
          {/* 2 & 3. モバイル用縦積み（md未満） */}
          <div className="flex flex-col md:hidden gap-0.5 mt-0.5">
            <div className="text-[10px] font-bold text-slate-200">
              {label} <span className="text-white">Lv.{level}</span>
            </div>
            <div className="text-[9px] text-slate-400 font-mono">
              EXP: <span className="text-slate-300">{Math.floor(expInLevel)} / {expNeededInLevel}</span>
            </div>
          </div>

          {/* 2 & 3. PC用横並び（md以上） */}
          <div className="hidden md:flex justify-between text-[10px] mt-1 mb-0.5">
            <span className="font-bold text-white">{label} Lv.{level}</span>
            <span className="text-slate-400">{Math.floor(expInLevel)} / {expNeededInLevel} EXP</span>
          </div>

          {/* 4. 経験値（ゲージ） */}
          <div className="w-full bg-slate-800 border border-slate-600 h-1.5 mt-1 rounded-full overflow-hidden">
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
          monsterBonusDate={monsterBonusDate}
        />

        {/* 3匹の霊獣 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
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
  monsterBonusDate 
}: { 
  todayMonster: import("@/store/useGameStore").TodayMonsterState | null;
  yesterdayMonster: import("@/store/useGameStore").YesterdayMonsterState | null;
  monsterBonusDate: string | null;
}) => {
  const [imgError, setImgError] = useState(false);
  const { monsterDefeatStreak } = useGameStore();

  if (!todayMonster) return null;

  const today = getLocalDateString();
  const isBonusToday = monsterBonusDate === today;

  // 魔王戦判定
  if (todayMonster.isDemonKing) {
    return (
      <DemonKingSection 
        todayMonster={todayMonster}
        yesterdayMonster={yesterdayMonster}
        isBonusToday={isBonusToday}
      />
    );
  }

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

  const showBonusBanner = isBonusToday && yesterdayMonster && yesterdayMonster.defeated;

  const bonusBanner = showBonusBanner ? (
    <div className="bg-yellow-950/40 border-2 border-yellow-500 rounded p-3 flex items-center justify-between animate-pulse">
      <div className="flex items-center gap-3">
        <span className="text-2xl">✨</span>
        <div>
          <p className="text-yellow-400 font-black text-xs md:text-sm tracking-wide">
            昨日は見事、「{yesterdayMonster.monsterName}」を追い払った！
          </p>
          <p className="text-white text-[10px] md:text-xs font-bold mt-0.5">
            経験値２倍ボーナス中！
          </p>
        </div>
      </div>
      <span className="text-xl md:text-2xl">🔥</span>
    </div>
  ) : null;

  // 魔王降臨までのカウントダウン計算
  const daysUntilDemonKing = Math.max(0, 7 - monsterDefeatStreak);

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
          {/* 魔王降臨カウントダウン（連続撃退中のみ表示） */}
          {monsterDefeatStreak > 0 && daysUntilDemonKing > 0 && (
            <div className="bg-fuchsia-950/30 border border-fuchsia-500/50 rounded p-2 text-center">
              <p className="text-fuchsia-300 text-[11px] font-bold">
                👑 あと<span className="text-fuchsia-400 text-sm font-black mx-1">{daysUntilDemonKing}</span>日魔物を追い払ったら、魔王降臨
              </p>
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

// 魔王戦専用セクション
const DemonKingSection = ({
  todayMonster,
  yesterdayMonster,
  isBonusToday,
}: {
  todayMonster: import("@/store/useGameStore").TodayMonsterState;
  yesterdayMonster: import("@/store/useGameStore").YesterdayMonsterState | null;
  isBonusToday: boolean;
}) => {
  const [imgError, setImgError] = useState(false);

  const showBonusBanner = isBonusToday && yesterdayMonster && yesterdayMonster.defeated;

  const bonusBanner = showBonusBanner ? (
    <div className="bg-yellow-950/40 border-2 border-yellow-500 rounded p-3 flex items-center justify-between animate-pulse">
      <div className="flex items-center gap-3">
        <span className="text-2xl">✨</span>
        <div>
          <p className="text-yellow-400 font-black text-xs md:text-sm tracking-wide">
            昨日は見事、「{yesterdayMonster.monsterName}」を追い払った！
          </p>
          <p className="text-white text-[10px] md:text-xs font-bold mt-0.5">
            経験値２倍ボーナス中！
          </p>
        </div>
      </div>
      <span className="text-xl md:text-2xl">🔥</span>
    </div>
  ) : null;

  const map = todayMonster.accumulatedMinutesMap;

  const renderDemonGauge = (label: string, category: "Physical" | "IQ" | "Skill", color: string) => {
    const required = DEMON_KING.requiredMinutesMap[category];
    const current = map[category] || 0;
    const pct = Math.min(100, (current / required) * 100);
    const done = current >= required;
    return (
      <div className="mb-2">
        <div className="flex justify-between text-[10px] mb-0.5">
          <span className={`font-bold ${done ? "text-green-400" : "text-slate-300"}`}>
            {done ? "✅ " : ""}{label}
          </span>
          <span className="text-white font-bold">
            {current}分 / {required}分
          </span>
        </div>
        <div className="w-full bg-slate-900 border border-slate-600 h-2.5 rounded overflow-hidden">
          <div
            className={`h-full transition-all duration-700 ${done ? "bg-green-500" : color}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    );
  };

  if (todayMonster.defeated) {
    return (
      <div className="flex flex-col gap-3">
        {bonusBanner}
        <div className="bg-fuchsia-900/20 border-2 border-fuchsia-500 rounded p-3 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-fuchsia-400 font-black text-sm">👑 魔王撃退！伝説の勇者よ！</p>
              <p className="text-[10px] text-fuchsia-300 font-bold">{DEMON_KING.name} を追い払った</p>
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
      <div className={`${DEMON_KING.bgColor} border-2 ${DEMON_KING.borderColor} rounded p-3 flex flex-col gap-3`}>
        {/* 魔王画像 */}
        <div className="w-full flex justify-center">
          {!imgError ? (
            <img
              src={DEMON_KING.imagePath}
              alt={DEMON_KING.name}
              className="w-full max-h-56 object-contain drop-shadow-[0_0_30px_rgba(200,0,255,0.5)]"
              onError={() => setImgError(true)}
            />
          ) : (
            <span className="text-8xl">👑</span>
          )}
        </div>
        {/* 魔王名 */}
        <div>
          <p className={`font-black text-lg text-center ${DEMON_KING.color}`}>{DEMON_KING.name}</p>
          <p className="text-[10px] text-fuchsia-200 text-center mt-0.5 italic">
            3魔将すべての撃退条件を満たせ！
          </p>
        </div>
        {/* 3つのゲージ */}
        <div>
          {renderDemonGauge("Physical（フィジカル）", "Physical", "bg-blue-500")}
          {renderDemonGauge("IQ（サッカーIQ）", "IQ", "bg-purple-500")}
          {renderDemonGauge("Skill（ボールタッチ）", "Skill", "bg-red-500")}
        </div>
      </div>
    </div>
  );
};
