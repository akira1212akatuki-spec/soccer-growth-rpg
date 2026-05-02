"use client";

import React, { useState } from "react";
import { JRPGWindow } from "./ui/JRPGWindow";
import { useGameStore } from "@/store/useGameStore";

export const InitialSetup = () => {
  const { setInitialSetup } = useGameStore();
  const [step, setStep] = useState(1);
  const [playerName, setPlayerName] = useState("");
  const [yearlyGoal, setYearlyGoal] = useState("");
  const [yearlyDeadline, setYearlyDeadline] = useState("");
  const [monthlyGoal, setMonthlyGoal] = useState("");
  const [monthlyDeadline, setMonthlyDeadline] = useState("");

  const handleNext = () => {
    if (step === 1 && playerName.trim() === "") {
      alert("名前を入力してください。");
      return;
    }
    if (step === 2 && (yearlyGoal.trim() === "" || monthlyGoal.trim() === "")) {
      alert("目標を入力してください。");
      return;
    }

    if (step < 3) {
      setStep(step + 1);
    } else {
      setInitialSetup(playerName, yearlyGoal, yearlyDeadline, monthlyGoal, monthlyDeadline);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black p-4 overflow-y-auto">
      <JRPGWindow title="新しい修練の書" className="w-full max-w-lg animate-fade-in my-auto">
        {step === 1 && (
          <div className="flex flex-col gap-4">
            <p className="leading-relaxed">サッカーを極めんとする若者よ、<br/>まずはそなたの名を教えてくれ。</p>
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
          <div className="flex flex-col gap-4 text-sm">
            <p className="text-base">{playerName}よ、<br/>そなたが掲げる「誓い」を刻むのだ。</p>
            <div className="bg-slate-800/50 p-3 border border-slate-600 rounded mb-2">
              <label className="block mb-1 text-yellow-400 font-bold">1年間の目標</label>
              <input 
                type="text" 
                className="w-full bg-slate-900 border border-white p-2 mb-2 text-white"
                value={yearlyGoal} 
                onChange={e => setYearlyGoal(e.target.value)} 
                placeholder="例：レギュラーを獲る、県大会優勝"
              />
              <label className="block mb-1 text-slate-300 text-xs font-bold">達成期限</label>
              <input 
                type="date" 
                className="w-full bg-slate-900 border border-white p-2 text-white"
                style={{ colorScheme: 'dark' }}
                value={yearlyDeadline} 
                onChange={e => setYearlyDeadline(e.target.value)} 
              />
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
              <label className="block mb-1 text-slate-300 text-xs font-bold">達成期限</label>
              <input 
                type="date" 
                className="w-full bg-slate-900 border border-white p-2 text-white"
                style={{ colorScheme: 'dark' }}
                value={monthlyDeadline} 
                onChange={e => setMonthlyDeadline(e.target.value)} 
              />
            </div>
            <button onClick={handleNext} className="mt-4 bg-blue-700 hover:bg-blue-600 border border-white p-2 text-center text-lg">次へ</button>
          </div>
        )}

        {step === 3 && (
          <div className="flex flex-col gap-6">
            <div className="flex justify-center gap-4 py-4 bg-slate-900/50 rounded-lg border border-slate-700">
              <div className="flex flex-col items-center">
                <img src="/assets/char/fire/form_1.png" alt="火" className="w-16 h-16 object-contain" />
                <span className="text-[10px] text-red-400">火の体</span>
              </div>
              <div className="flex flex-col items-center">
                <img src="/assets/char/water/form_1.png" alt="水" className="w-16 h-16 object-contain" />
                <span className="text-[10px] text-blue-400">水の技</span>
              </div>
              <div className="flex flex-col items-center">
                <img src="/assets/char/leaf/form_1.png" alt="草" className="w-16 h-16 object-contain" />
                <span className="text-[10px] text-green-400">草の知</span>
              </div>
            </div>
            
            <div className="text-sm leading-relaxed space-y-4 text-slate-200">
              <p className="text-yellow-400 font-bold text-base">「{playerName}よ、よくぞここへ至った。</p>
              <p>私はサッカーの神。君の努力の行く末を見守る者だ。</p>
              <p>ここに、君の分身となる3匹の霊獣を授けよう。<br/>
              力強き火の体（体力）、清らかな水の技（スキル）、そして賢明なる草の知（IQ）。</p>
              <p>彼らは君の汗を糧とし、君の成長と共にその姿を変えていく。日々の鍛錬を怠らぬことだ。</p>
              <p>3つの魂が重なり、『完全体』へと進化したとき、君はフィールドを支配する真の王となるだろう。</p>
              <p className="text-yellow-400 font-bold text-center pt-2">さあ、最初のボールを蹴り出すがよい！」</p>
            </div>
            
            <button 
              onClick={handleNext} 
              className="mt-2 bg-yellow-600 hover:bg-yellow-500 border-2 border-white p-3 text-center text-xl font-black text-white shadow-[0_0_15px_rgba(234,179,8,0.4)] transition-all"
            >
              冒険を始める
            </button>
          </div>
        )}
      </JRPGWindow>
    </div>
  );
};
