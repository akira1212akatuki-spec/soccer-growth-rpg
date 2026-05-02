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
    setLastFeedbackDate,
    updateGoals
  } = useGameStore();

  const [isOpen, setIsOpen] = useState(false);
  const [score, setScore] = useState<number>(50);
  const [reflection, setReflection] = useState("");
  const [nextGoal, setNextGoal] = useState("");
  const [nextDeadline, setNextDeadline] = useState("");
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
      // 次の期限のデフォルト値（1ヶ月後 or 1年後）
      const nextDate = new Date();
      if (isYearly) {
        nextDate.setFullYear(nextDate.getFullYear() + 1);
      } else {
        nextDate.setMonth(nextDate.getMonth() + 1);
      }
      setNextDeadline(format(nextDate, "yyyy-MM-dd"));
    }
  }, [lastFeedbackDate, monthlyDeadline, yearlyDeadline]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const todayStr = format(new Date(), "yyyy-MM-dd");
    
    // 目標の更新
    if (feedbackType === "yearly") {
      updateGoals(nextGoal, nextDeadline, monthlyGoal || "", monthlyDeadline || "");
    } else {
      updateGoals(yearlyGoal || "", yearlyDeadline || "", nextGoal, nextDeadline);
    }

    setLastFeedbackDate(todayStr);
    setIsOpen(false);
    alert(`${feedbackType === "yearly" ? "1年" : "1か月"}の試練を乗り越えたな！神は常にそなたを見守っておられるぞ。`);
  };

  const currentGoal = feedbackType === "yearly" ? yearlyGoal : monthlyGoal;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto bg-black/80 p-4 backdrop-blur-sm">
      <JRPGWindow title={feedbackType === "yearly" ? "★ 一年の大儀 ★" : "★ 一か月の節目 ★"} className="w-full max-w-lg animate-fade-in">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-sm">
          <div className="flex items-start gap-4 mb-2 bg-slate-900/50 p-3 border border-slate-700 rounded">
            <div className="w-16 h-16 bg-slate-800 rounded-lg flex-shrink-0 flex items-center justify-center border-2 border-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.3)] overflow-hidden">
              <span className="text-4xl">✨</span>
            </div>
            <div className="flex-1">
              <span className="text-yellow-400 font-black text-base">サッカーの神：</span><br/>
              <p className="text-slate-200 leading-relaxed italic">
                「{playerName}よ、よくぞここまで辿り着いた。{feedbackType === "yearly" ? "一年" : "一か月"}という月日は、そなたをどう変えたか？<br/>
                掲げた誓いを振り返り、次なる高みを目指す時が来たのだ。」
              </p>
            </div>
          </div>

          <div className="bg-slate-800/80 p-3 border-l-4 border-yellow-500 rounded">
            <p className="text-[10px] text-yellow-500 font-bold mb-1 uppercase tracking-tighter">Current Oracle (現在の誓い)</p>
            <p className="text-white text-base font-bold italic">「{currentGoal}」</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-yellow-400 font-bold">達成度 (0-100)</label>
              <input 
                type="number" 
                min="0" 
                max="100" 
                className="w-full bg-slate-900 border border-slate-600 p-2 text-white focus:border-yellow-400 outline-none"
                value={score} 
                onChange={e => setScore(Number(e.target.value))} 
                required 
              />
            </div>
            <div>
              <label className="block mb-1 text-yellow-400 font-bold">次なる誓いの期限</label>
              <input 
                type="date" 
                className="w-full bg-slate-900 border border-slate-600 p-2 text-white"
                style={{ colorScheme: 'dark' }}
                value={nextDeadline} 
                onChange={e => setNextDeadline(e.target.value)} 
                required 
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-yellow-400 font-bold">振り返りと次なる誓い</label>
            <textarea 
              className="w-full bg-slate-900 border border-slate-600 p-2 h-24 text-white focus:border-yellow-400 outline-none"
              placeholder="この期間の成果を神に伝え、次なる目標を記せ..."
              value={reflection} 
              onChange={e => setReflection(e.target.value)} 
              required 
            />
            <div className="mt-2">
              <label className="block mb-1 text-[10px] text-slate-400 font-bold">簡潔な「次なる目標」</label>
              <input 
                type="text"
                className="w-full bg-slate-900 border border-slate-600 p-2 text-white text-xs"
                placeholder="例：レギュラー定着、毎日1時間の個人技"
                value={nextGoal}
                onChange={e => setNextGoal(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="mt-2 bg-yellow-600 hover:bg-yellow-500 border-2 border-white p-3 text-center text-xl font-black text-white shadow-[0_0_15px_rgba(234,179,8,0.4)] transition-all">
            神に誓いを立てる
          </button>
        </form>
      </JRPGWindow>
    </div>
  );
};

