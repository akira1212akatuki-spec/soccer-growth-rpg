"use client";

import React, { useEffect, useState } from "react";
import { JRPGWindow } from "./ui/JRPGWindow";
import { useGameStore } from "@/store/useGameStore";
import { format } from "date-fns";

export const FeedbackModal = () => {
  const { 
    playerName,
    monthlyGoal,
    monthlyDeadline,
    yearlyGoal,
    yearlyDeadline,
    lastFeedbackDate, 
    setLastFeedbackDate 
  } = useGameStore();

  const [isOpen, setIsOpen] = useState(false);
  const [score, setScore] = useState<number>(50);
  const [reflection, setReflection] = useState("");
  const [feedbackType, setFeedbackType] = useState<"monthly" | "yearly">("monthly");

  useEffect(() => {
    const today = new Date();
    const todayStr = format(today, "yyyy-MM-dd");
    
    // 期限に達しているかチェック
    const isMonthly = monthlyDeadline === todayStr;
    const isYearly = yearlyDeadline === todayStr;

    if ((isMonthly || isYearly) && lastFeedbackDate !== todayStr) {
      setFeedbackType(isYearly ? "yearly" : "monthly");
      setIsOpen(true);
    }
  }, [lastFeedbackDate, monthlyDeadline, yearlyDeadline]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const todayStr = format(new Date(), "yyyy-MM-dd");
    setLastFeedbackDate(todayStr);
    setIsOpen(false);
    alert(`${feedbackType === "yearly" ? "1年" : "1か月"}の振り返りを記録しました！次なる目標に向かって進みましょう！`);
  };

  const currentGoal = feedbackType === "yearly" ? yearlyGoal : monthlyGoal;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto bg-black/60 p-4">
      <JRPGWindow title={feedbackType === "yearly" ? "1年間の定期フィードバック" : "1か月の定期フィードバック"} className="w-full max-w-md animate-fade-in">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-sm">
          <div className="flex items-start gap-3 mb-2">
            <div className="w-12 h-12 bg-slate-700 rounded-full flex-shrink-0 flex items-center justify-center border border-white overflow-hidden">
              <span className="text-2xl">⚽</span>
            </div>
            <div className="flex-1 text-xs">
              <span className="text-yellow-400 font-bold">プロコーチ：</span><br/>
              「{playerName}、よく頑張っているな。{feedbackType === "yearly" ? "1年" : "1か月"}の期限が来たぞ。これまでの修練を振り返ってみよう。」
            </div>
          </div>

          <div className="bg-slate-800/80 p-3 border border-yellow-500/50 rounded-lg">
            <p className="text-[10px] text-yellow-400 font-bold mb-1">設定していた目標</p>
            <p className="text-white text-base italic">「{currentGoal}」</p>
          </div>

          <p className="text-[11px] text-slate-300">
            この目標に対して、自分自身の達成度を100点満点で評価し、具体的な振り返りと次のアクションを記録するんだ。
          </p>

          <div>
            <label className="block mb-1 text-yellow-400">自己評価 (0 - 100)</label>
            <input 
              type="number" 
              min="0" 
              max="100" 
              className="w-full bg-slate-800 border border-white p-2"
              value={score} 
              onChange={e => setScore(Number(e.target.value))} 
              required 
            />
          </div>

          <div>
            <label className="block mb-1 text-yellow-400">振り返りと次の目標</label>
            <textarea 
              className="w-full bg-slate-800 border border-white p-2 h-24"
              placeholder="目標達成に向けてどうだったか、次は具体的に何を改善するか..."
              value={reflection} 
              onChange={e => setReflection(e.target.value)} 
              required 
            />
          </div>

          <button type="submit" className="mt-4 bg-blue-700 hover:bg-blue-600 border-2 border-white p-2 text-center text-lg text-white transition-colors">
            コーチに報告する
          </button>
        </form>
      </JRPGWindow>
    </div>
  );
};

