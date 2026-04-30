"use client";

import React from "react";
import { JRPGWindow } from "./ui/JRPGWindow";
import { useGameStore } from "@/store/useGameStore";

export const AICoach = () => {
  const { logs } = useGameStore();
  const recentLog = logs.length > 0 ? logs[0] : null;

  return (
    <JRPGWindow title="コーチからのアドバイス" className="h-full">
      {recentLog ? (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 mb-2 border-b border-dashed border-white pb-2">
            <div className="w-10 h-10 bg-slate-800 border border-white flex items-center justify-center text-xl">
              ⚽
            </div>
            <div>
              <p className="text-sm">日本代表選手</p>
              <p className="text-xs text-slate-400">プロを目指す君へ</p>
            </div>
          </div>
          {recentLog.aiAdvice ? (
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{recentLog.aiAdvice}</p>
          ) : (
            <p className="text-sm text-slate-400 animate-pulse">コーチが練習ログを分析中だ...待ってくれ。</p>
          )}
        </div>
      ) : (
        <div className="h-full flex items-center justify-center text-slate-400 text-sm">
          練習を記録すると、日本代表選手からのアドバイスがもらえるぞ！
        </div>
      )}
    </JRPGWindow>
  );
};
