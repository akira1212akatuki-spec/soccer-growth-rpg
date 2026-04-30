"use client";

import React, { useState } from "react";
import { JRPGWindow } from "./ui/JRPGWindow";
import { useGameStore } from "@/store/useGameStore";

export const InitialSetup = () => {
  const { setInitialSetup } = useGameStore();
  const [step, setStep] = useState(1);
  const [playerName, setPlayerName] = useState("");
  const [charType, setCharType] = useState<"Fire" | "Water" | "Leaf" | null>(null);
  const [yearlyGoal, setYearlyGoal] = useState("");
  const [yearlyDeadline, setYearlyDeadline] = useState("");
  const [monthlyGoal, setMonthlyGoal] = useState("");
  const [monthlyDeadline, setMonthlyDeadline] = useState("");

  const handleNext = () => {
    if (step === 1 && playerName.trim() === "") {
      alert("名前を入力してください。");
      return;
    }
    if (step === 2 && !charType) {
      alert("パートナーを選択してください。");
      return;
    }
    if (step === 3 && (yearlyGoal.trim() === "" || monthlyGoal.trim() === "")) {
      alert("目標を入力してください。");
      return;
    }

    if (step < 3) {
      setStep(step + 1);
    } else {
      setInitialSetup(playerName, charType!, yearlyGoal, yearlyDeadline, monthlyGoal, monthlyDeadline);
      alert("設定が完了しました！冒険をはじめましょう！");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black p-4 overflow-y-auto">
      <JRPGWindow title="新しい冒険の書" className="w-full max-w-lg animate-fade-in my-auto">
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <p className="leading-relaxed">サッカーを極めたい若者よ、<br/>まずはそなたの名を教えてくれ。</p>
            <input 
              type="text" 
              className="bg-slate-800 border border-white p-2 text-xl text-center"
              value={playerName} 
              onChange={e => setPlayerName(e.target.value)} 
              placeholder="プレイヤー名"
              autoFocus
            />
            <button onClick={handleNext} className="mt-4 bg-blue-700 hover:bg-blue-600 border border-white p-2 text-center text-lg">次へ</button>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-4">
            <p className="leading-relaxed">{playerName}よ、<br/>そなたの分身となる最初のパートナーを選んでくれ。</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { type: "Fire" as const, emoji: "🔥", name: "フレイムパピー" },
                { type: "Water" as const, emoji: "💧", name: "アクアプルプ" },
                { type: "Leaf" as const, emoji: "🌿", name: "シードタヌノ" }
              ].map((char) => (
                <button 
                  key={char.type}
                  className={`p-2 border-2 rounded flex flex-col items-center transition-all ${charType === char.type ? "border-yellow-400 bg-slate-700 shadow-[0_0_10px_rgba(251,189,36,0.5)]" : "border-white bg-slate-800"}`}
                  onClick={() => setCharType(char.type)}
                >
                  <div className="w-24 h-24 flex items-center justify-center relative mb-2 overflow-hidden">
                    <img 
                      src={`/assets/char/${char.type.toLowerCase()}/form_1.png`} 
                      alt={char.type}
                      className="w-full h-full object-contain z-10"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        const fallback = (e.target as HTMLImageElement).nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'block';
                      }}
                    />
                    <div className="text-4xl hidden">
                      {char.emoji}
                    </div>
                  </div>
                  <div className="text-xs font-bold">{char.name}</div>
                  <div className="text-[10px] text-slate-400">{char.type}</div>
                </button>
              ))}
            </div>
            <button onClick={handleNext} className="mt-4 bg-blue-700 hover:bg-blue-600 border border-white p-2 text-center text-lg">次へ</button>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-4 text-sm">
            <p>最後に、そなたの目標を刻み込むのだ。</p>
            <div className="bg-slate-800/50 p-3 border border-slate-600 rounded mb-2">
              <label className="block mb-1 text-yellow-400 font-bold">1年間の目標</label>
              <input 
                type="text" 
                className="w-full bg-slate-900 border border-white p-2 mb-2 text-white"
                value={yearlyGoal} 
                onChange={e => setYearlyGoal(e.target.value)} 
                placeholder="例：レギュラーを獲る、県大会優勝"
              />
              <label className="block mb-1 text-slate-300 text-xs font-bold">いつまでに達成するか（期日）</label>
              <div className="relative">
                <input 
                  type="date" 
                  className="w-full bg-slate-900 border border-white p-2 text-white appearance-none cursor-pointer focus:border-yellow-400 outline-none"
                  style={{ colorScheme: 'dark' }} // ブラウザ標準のカレンダーアイコンなどを白くする
                  value={yearlyDeadline} 
                  onChange={e => setYearlyDeadline(e.target.value)} 
                />
              </div>
            </div>
            
            <div className="bg-slate-800/50 p-3 border border-slate-600 rounded">
              <label className="block mb-1 text-yellow-400 font-bold">1ヶ月の目標</label>
              <input 
                type="text" 
                className="w-full bg-slate-900 border border-white p-2 mb-2 text-white"
                value={monthlyGoal} 
                onChange={e => setMonthlyGoal(e.target.value)} 
                placeholder="例：リフティング100回、ドリブルのキレを上げる"
              />
              <label className="block mb-1 text-slate-300 text-xs font-bold">いつまでに達成するか（期日）</label>
              <div className="relative">
                <input 
                  type="date" 
                  className="w-full bg-slate-900 border border-white p-2 text-white appearance-none cursor-pointer focus:border-yellow-400 outline-none"
                  style={{ colorScheme: 'dark' }}
                  value={monthlyDeadline} 
                  onChange={e => setMonthlyDeadline(e.target.value)} 
                />
              </div>
            </div>
            <button onClick={handleNext} className="mt-4 bg-blue-700 hover:bg-blue-600 border border-white p-2 text-center text-lg">決定</button>
          </div>
        )}
      </JRPGWindow>
    </div>
  );
};
