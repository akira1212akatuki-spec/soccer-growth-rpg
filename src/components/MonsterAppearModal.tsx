"use client";

import React, { useState } from "react";
import { MONSTERS, MonsterDefinition } from "@/lib/monsters";

interface MonsterAppearModalProps {
  monster: MonsterDefinition;
  onClose: () => void;
}

export const MonsterAppearModal = ({ monster, onClose }: MonsterAppearModalProps) => {
  const [imgError, setImgError] = useState(false);

  const categoryLabel =
    monster.category === "Physical"
      ? "Physical（フィジカル）"
      : monster.category === "IQ"
      ? "IQ（サッカーIQ）"
      : "Skill（ボールタッチ）";

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 overflow-y-auto">
      <div
        className={`w-full max-w-sm mx-auto border-4 ${monster.borderColor} rounded-lg shadow-2xl`}
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
        <div className="flex flex-col items-center py-4 gap-2">
          {!imgError ? (
            <img
              src={monster.imagePath}
              alt={monster.name}
              className="w-36 h-36 object-contain drop-shadow-[0_0_20px_rgba(255,100,100,0.7)]"
              onError={() => setImgError(true)}
            />
          ) : (
            <div
              className={`w-36 h-36 flex items-center justify-center rounded-full ${monster.bgColor} border-2 ${monster.borderColor}`}
            >
              <span className="text-5xl">👹</span>
            </div>
          )}

          {/* 魔物名 */}
          <h2
            className={`text-2xl font-black tracking-widest ${monster.color}`}
            style={{ textShadow: "2px 2px 0px #000, -1px -1px 0px #000" }}
          >
            {monster.name}
          </h2>
        </div>

        {/* 特徴 */}
        <div className="px-4 pb-3">
          <div className={`${monster.bgColor} border ${monster.borderColor} rounded p-3 mb-3`}>
            <p className="text-[10px] text-slate-400 font-bold mb-1">【特徴】</p>
            <p className="text-xs text-slate-100 leading-relaxed">{monster.description}</p>
          </div>

          {/* 撃退条件 */}
          <div className="bg-yellow-900/30 border border-yellow-500 rounded p-3 mb-4">
            <p className="text-[10px] text-yellow-400 font-bold mb-1">【撃退条件】</p>
            <p className="text-xs text-white leading-relaxed">
              カテゴリ「<span className={`font-bold ${monster.color}`}>{categoryLabel}</span>」の
              累計が <span className="text-yellow-300 font-black text-sm">{monster.requiredMinutes}分</span> を
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
