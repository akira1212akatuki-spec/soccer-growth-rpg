"use client";

import React from "react";
import { JRPGWindow } from "./ui/JRPGWindow";
import { useGameStore } from "@/store/useGameStore";

export const AICoach = () => {
  const { logs } = useGameStore();
  const recentLog = logs.length > 0 ? logs[0] : null;

  return (
    <JRPGWindow title="神からの啓示" className="h-full">
      {recentLog ? (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-2 border-b border-dashed border-slate-600 pb-2">
            <div className="w-10 h-10 bg-slate-900 border-2 border-yellow-500 rounded flex items-center justify-center text-xl shadow-[0_0_10px_rgba(234,179,8,0.3)]">
              ✨
            </div>
            <div>
              <p className="text-sm font-bold text-yellow-400">サッカーの神</p>
              <p className="text-[10px] text-slate-400">万物の成長を見守る者</p>
            </div>
          </div>
          {recentLog.aiAdvice ? (
            <p className="text-sm leading-relaxed whitespace-pre-wrap italic text-slate-200">「{recentLog.aiAdvice}」</p>
          ) : (
            <p className="text-sm text-slate-400 animate-pulse">神がそなたの修練を精査しておられる...</p>
          )}
        </div>
      ) : (
        <div className="h-full flex items-center justify-center text-slate-400 text-sm text-center px-4">
          修練を記録せよ。<br/>さらば神の言葉が授けられん。
        </div>
      )}
    </JRPGWindow>
  );
};
