"use client";

import React, { useEffect, useState } from "react";
import { StatusPanel } from "@/components/StatusPanel";
import { Calendar } from "@/components/Calendar";
import { AICoach } from "@/components/AICoach";
import { LevelUpEffect } from "@/components/LevelUpEffect";
import { FeedbackModal } from "@/components/FeedbackModal";
import { InitialSetup } from "@/components/InitialSetup";
import { EXPResultModal } from "@/components/EXPResultModal";
import { useGameStore } from "@/store/useGameStore";

export default function Home() {
  const { playerName, yearlyGoal } = useGameStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // 初期設定が完了していない場合はウィザードを表示
  if (!playerName || !yearlyGoal) {
    return (
      <main className="min-h-screen p-4 md:p-8 max-w-6xl mx-auto flex items-center justify-center">
        <InitialSetup />
      </main>
    );
  }

  return (
    <main className="min-h-screen p-4 md:p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl md:text-5xl text-center mb-8 text-yellow-400 font-bold" style={{ textShadow: "3px 3px 0px #000" }}>
        SOCCER GROWTH RPG
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 上段: ステータスパネル (全体幅を使う) */}
        <div className="lg:col-span-3">
          <StatusPanel />
        </div>

        {/* 下段: カレンダー (2カラム) */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <Calendar />
        </div>

        {/* 下段右: 最新のAIアドバイス (1カラム) */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <AICoach />
        </div>
      </div>

      <LevelUpEffect />
      <FeedbackModal />
      <EXPResultModal />
    </main>
  );
}
