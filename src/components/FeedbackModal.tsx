"use client";

import React, { useEffect, useState } from "react";
import { JRPGWindow } from "./ui/JRPGWindow";
import { useGameStore } from "@/store/useGameStore";
import { format } from "date-fns";

export const FeedbackModal = () => {
  const { lastFeedbackDate, setLastFeedbackDate } = useGameStore();
  const [isOpen, setIsOpen] = useState(false);
  const [score, setScore] = useState<number>(50);
  const [reflection, setReflection] = useState("");

  useEffect(() => {
    const today = new Date();
    const todayStr = format(today, "yyyy-MM-dd");
    
    // 毎月1日、または4月1日
    const isFirstDayOfMonth = today.getDate() === 1;
    const isAprilFirst = today.getMonth() === 3 && today.getDate() === 1;

    if ((isFirstDayOfMonth || isAprilFirst) && lastFeedbackDate !== todayStr) {
      setIsOpen(true);
    }
  }, [lastFeedbackDate]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const todayStr = format(new Date(), "yyyy-MM-dd");
    setLastFeedbackDate(todayStr);
    setIsOpen(false);
    alert("振り返りを記録しました！今月も頑張りましょう！");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-auto bg-black/60 p-4">
      <JRPGWindow title="定期フィードバック" className="w-full max-w-md animate-fade-in">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-sm">
          <p className="mb-2 leading-relaxed">
            王様：「勇者よ、よくぞここまで修練を積んだ。今月の達成度を100点満点で申告せよ。そして、次なる目標を掲げるのだ。」
          </p>

          <div>
            <label className="block mb-1 text-yellow-400">達成度 (0 - 100)</label>
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
              placeholder="目標達成に向けてどうだったか、来月は何をするか..."
              value={reflection} 
              onChange={e => setReflection(e.target.value)} 
              required 
            />
          </div>

          <button type="submit" className="mt-4 bg-yellow-700 hover:bg-yellow-600 border-2 border-white p-2 text-center text-lg text-white">
            王様に報告する
          </button>
        </form>
      </JRPGWindow>
    </div>
  );
};
