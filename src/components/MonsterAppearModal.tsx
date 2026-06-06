"use client";

import React, { useState } from "react";
import { MONSTERS, DEMON_KING, MonsterDefinition, DemonKingDefinition } from "@/lib/monsters";

interface MonsterAppearModalProps {
  monster: MonsterDefinition | "demon_king";
  onClose: () => void;
}

export const MonsterAppearModal = ({ monster, onClose }: MonsterAppearModalProps) => {
  const [imgError, setImgError] = useState(false);

  // 魔王判定
  const isDemonKing = monster === "demon_king";
  const dk = DEMON_KING;

  if (isDemonKing) {
    return (
      <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 overflow-y-auto">
        <div
          className={`w-full max-w-sm mx-auto border-4 ${dk.borderColor} rounded-lg shadow-2xl`}
          style={{ background: "linear-gradient(to bottom, #1a001a, #0a0020)" }}
        >
          {/* ヘッダー */}
          <div className="px-4 pt-4 pb-2 border-b border-fuchsia-500/30 text-center">
            <p className="text-[11px] text-fuchsia-300 italic mb-1">⚠ 魔界の絶対的な王が降臨した ⚠</p>
            <p className="text-xs text-white font-bold leading-relaxed">
              7日間の連続撃退を成し遂げた勇者よ、最後の試練に立ち向かえ！
            </p>
          </div>

          {/* 魔王画像 */}
          <div className="flex flex-col items-center py-4 gap-2 px-4">
            {!imgError ? (
              <img
                src={dk.imagePath}
                alt={dk.name}
                className="w-full max-h-72 object-contain drop-shadow-[0_0_30px_rgba(200,0,255,0.7)]"
                onError={() => setImgError(true)}
              />
            ) : (
              <div
                className={`w-full h-48 flex items-center justify-center rounded-xl ${dk.bgColor} border-2 ${dk.borderColor}`}
              >
                <span className="text-8xl">👑</span>
              </div>
            )}

            {/* 魔王名 */}
            <h2
              className={`text-xl font-black tracking-widest ${dk.color}`}
              style={{ textShadow: "2px 2px 0px #000, -1px -1px 0px #000" }}
            >
              {dk.name}
            </h2>
          </div>

          {/* 特徴 */}
          <div className="px-4 pb-3">
            <div className={`${dk.bgColor} border ${dk.borderColor} rounded p-3 mb-3`}>
              <p className="text-[10px] text-fuchsia-300 font-bold mb-1">【特徴】</p>
              <p className="text-xs text-slate-100 leading-relaxed">{dk.description}</p>
            </div>

            {/* 撃退条件（3つすべて表示） */}
            <div className="bg-yellow-900/30 border border-yellow-500 rounded p-3 mb-4">
              <p className="text-[10px] text-yellow-400 font-bold mb-2">【撃退条件】3つすべてを達成せよ！</p>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-blue-400 text-[10px] font-bold w-28">Physical（フィジカル）</span>
                  <span className="text-yellow-300 font-black text-sm">{dk.requiredMinutesMap.Physical}分</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-purple-400 text-[10px] font-bold w-28">IQ（サッカーIQ）</span>
                  <span className="text-yellow-300 font-black text-sm">{dk.requiredMinutesMap.IQ}分</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-400 text-[10px] font-bold w-28">Skill（ボールタッチ）</span>
                  <span className="text-yellow-300 font-black text-sm">{dk.requiredMinutesMap.Skill}分</span>
                </div>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full bg-fuchsia-800 hover:bg-fuchsia-700 border-2 border-white py-3 text-center text-lg font-black text-white transition-all shadow-[0_4px_0_rgb(112,26,117)] active:translate-y-1 active:shadow-none"
              style={{ textShadow: "2px 2px 0px #000" }}
            >
              👑 立ち向かう！
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 通常の魔物
  const monsterDef = monster as MonsterDefinition;

  const categoryLabel =
    monsterDef.category === "Physical"
      ? "Physical（フィジカル）"
      : monsterDef.category === "IQ"
      ? "IQ（サッカーIQ）"
      : "Skill（ボールタッチ）";

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 overflow-y-auto">
      <div
        className={`w-full max-w-sm mx-auto border-4 ${monsterDef.borderColor} rounded-lg shadow-2xl`}
        style={{ background: "linear-gradient(to bottom, #000080, #000033)" }}
      >
        {/* ヘッダー */}
        <div className="px-4 pt-4 pb-2 border-b border-white/20 text-center">
          <p className="text-[11px] text-slate-400 italic mb-1">⚠ 心の中に棲む魔物が現れた ⚠</p>
          <p className="text-xs text-white font-bold leading-relaxed">
            君のトレーニング量で魔物を追い払え！
          </p>
        </div>

        {/* 魔物画像 */}
        <div className="flex flex-col items-center py-4 gap-2 px-4">
          {!imgError ? (
            <img
              src={monsterDef.imagePath}
              alt={monsterDef.name}
              className="w-full max-h-64 object-contain drop-shadow-[0_0_20px_rgba(255,100,100,0.7)]"
              onError={() => setImgError(true)}
            />
          ) : (
            <div
              className={`w-full h-48 flex items-center justify-center rounded-xl ${monsterDef.bgColor} border-2 ${monsterDef.borderColor}`}
            >
              <span className="text-8xl">👹</span>
            </div>
          )}

          {/* 魔物名 */}
          <h2
            className={`text-2xl font-black tracking-widest ${monsterDef.color}`}
            style={{ textShadow: "2px 2px 0px #000, -1px -1px 0px #000" }}
          >
            {monsterDef.name}
          </h2>
        </div>

        {/* 特徴 */}
        <div className="px-4 pb-3">
          <div className={`${monsterDef.bgColor} border ${monsterDef.borderColor} rounded p-3 mb-3`}>
            <p className="text-[10px] text-slate-400 font-bold mb-1">【特徴】</p>
            <p className="text-xs text-slate-100 leading-relaxed">{monsterDef.description}</p>
          </div>

          {/* 撃退条件 */}
          <div className="bg-yellow-900/30 border border-yellow-500 rounded p-3 mb-4">
            <p className="text-[10px] text-yellow-400 font-bold mb-1">【撃退条件】</p>
            <p className="text-xs text-white leading-relaxed">
              カテゴリ「<span className={`font-bold ${monsterDef.color}`}>{categoryLabel}</span>」の
              累計が <span className="text-yellow-300 font-black text-sm">{monsterDef.requiredMinutes}分</span> を
              超えると追い払える！
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-red-800 hover:bg-red-700 border-2 border-white py-3 text-center text-lg font-black text-white transition-all shadow-[0_4px_0_rgb(127,29,29)] active:translate-y-1 active:shadow-none"
            style={{ textShadow: "2px 2px 0px #000" }}
          >
            ⚔ 立ち向かう！
          </button>
        </div>
      </div>
    </div>
  );
};
