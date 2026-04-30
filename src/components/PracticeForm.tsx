"use client";

import React, { useState } from "react";
import { useGameStore, PracticeLog } from "@/store/useGameStore";
import { calculateEXPMultiplier } from "@/lib/gameLogic";

interface PracticeFormProps {
  initialDate?: string;
  onClose?: () => void;
}

export const PracticeForm = ({ initialDate, onClose }: PracticeFormProps) => {
  const { addLog, addEXP, menuHistory, addMenuHistory, setOverallAdvice, yearlyGoal, monthlyGoal } = useGameStore();
  const [loading, setLoading] = useState(false);
  
  const [date, setDate] = useState(initialDate || new Date().toISOString().split("T")[0]);
  const [category, setCategory] = useState<"Skill" | "Physical" | "IQ">("Skill");
  const [selectedMenus, setSelectedMenus] = useState<string[]>([]);
  const [newMenu, setNewMenu] = useState("");
  
  const [inputHours, setInputHours] = useState(1);
  const [inputMinutes, setInputMinutes] = useState(30);
  
  const [goodPoints, setGoodPoints] = useState("");
  const [improvements, setImprovements] = useState("");

  const handleCategoryChange = (cat: "Skill" | "Physical" | "IQ") => {
    setCategory(cat);
    setSelectedMenus([]);
    setNewMenu("");
  };

  const handleMenuToggle = (menu: string) => {
    if (selectedMenus.includes(menu)) {
      setSelectedMenus(selectedMenus.filter(m => m !== menu));
    } else {
      setSelectedMenus([...selectedMenus, menu]);
    }
  };

  const handleAddNewMenu = () => {
    if (newMenu.trim() !== "" && !selectedMenus.includes(newMenu.trim())) {
      setSelectedMenus([...selectedMenus, newMenu.trim()]);
      setNewMenu("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    
    if (selectedMenus.length === 0) {
      alert("練習メニューを少なくとも1つ選択してください。");
      return;
    }

    setLoading(true);

    try {
      // 履歴の更新
      addMenuHistory(category, selectedMenus);

      // 時間を10進数に変換
      const totalHours = inputHours + (inputMinutes / 60);
      
      // EXP計算
      const multiplier = calculateEXPMultiplier(totalHours, category);
      const baseExp = 100;
      const gainedExp = Math.floor(baseExp * multiplier);

      // ログ保存
      const newLog: PracticeLog = {
        id: crypto.randomUUID(),
        date,
        category,
        menus: selectedMenus,
        hours: totalHours,
        goodPoints,
        improvements
      };

      addLog(newLog);
      addEXP(category, gainedExp);

      // Gemini APIの呼び出し（個別アドバイス）
      fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ log: newLog })
      }).then(res => res.json())
        .then(data => {
          if (data.advice) {
            useGameStore.getState().updateLogAdvice(newLog.id, data.advice);
          } else if (data.error) {
            useGameStore.getState().updateLogAdvice(newLog.id, `エラー: ${data.error}`);
          }
        })
        .catch(err => {
          console.error("Coach API error:", err);
          useGameStore.getState().updateLogAdvice(newLog.id, "コーチが席を外しているようです。後でもう一度試してください。");
        });

      // Gemini APIの呼び出し（総合アドバイス）
      fetch("/api/overall-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          logs: useGameStore.getState().logs, // 新しいログが含まれた状態
          yearlyGoal,
          monthlyGoal
        })
      }).then(res => res.json())
        .then(data => {
          if (data.advice) {
            setOverallAdvice(data.advice);
          }
        })
        .catch(err => console.error("Overall Coach API error:", err));

      // フォームリセット
      setSelectedMenus([]);
      setNewMenu("");
      setGoodPoints("");
      setImprovements("");
      
      alert(`練習記録を保存しました！ ${gainedExp} EXP 獲得！`);
      if (onClose) onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const currentHistory = menuHistory[category] || [];

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-sm w-full">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label className="block mb-1 text-yellow-400">日付</label>
          <input type="date" className="w-full bg-slate-800 border border-white p-2 text-white disabled:opacity-50" 
            value={date} onChange={e => setDate(e.target.value)} required disabled={!!initialDate} />
        </div>
        <div className="flex-1">
          <label className="block mb-1 text-yellow-400">カテゴリ</label>
          <select className="w-full bg-slate-800 border border-white p-2 text-white"
            value={category} onChange={e => handleCategoryChange(e.target.value as any)}>
            <option value="Skill">Skill (ボールタッチ)</option>
            <option value="Physical">Physical (フィジカル)</option>
            <option value="IQ">IQ (サッカーIQ)</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block mb-2 text-yellow-400">練習メニュー (複数選択可)</label>
        <div className="bg-slate-900/50 border border-dashed border-slate-500 p-3 flex flex-wrap gap-2 mb-2 h-32 overflow-y-auto w-full">
          {currentHistory.map(menu => (
            <button 
              key={menu}
              type="button"
              onClick={() => handleMenuToggle(menu)}
              className={`px-2 py-1 border rounded text-xs transition-colors whitespace-normal text-left ${
                selectedMenus.includes(menu) ? "bg-blue-600 border-white font-bold" : "bg-slate-800 border-slate-600 text-slate-300"
              }`}
            >
              {menu}
            </button>
          ))}
          {currentHistory.length === 0 && <span className="text-slate-500 text-xs">過去のメニューはありません。</span>}
        </div>
        <div className="flex gap-2">
          <input 
            type="text" 
            className="flex-1 bg-slate-800 border border-white p-2 text-xs text-white"
            value={newMenu} 
            onChange={e => setNewMenu(e.target.value)} 
            placeholder="新しい練習メニューを入力..." 
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddNewMenu();
              }
            }}
          />
          <button type="button" onClick={handleAddNewMenu} className="bg-slate-700 hover:bg-slate-600 border border-white px-3 text-xs">
            追加
          </button>
        </div>
      </div>

      <div>
        <label className="block mb-1 text-yellow-400">時間</label>
        <div className="flex items-center gap-2">
          <input type="number" min="0" max="24" className="w-20 bg-slate-800 border border-white p-2 text-center text-white"
            value={inputHours} onChange={e => setInputHours(Number(e.target.value))} required />
          <span>時間</span>
          <input type="number" min="0" max="59" step="5" className="w-20 bg-slate-800 border border-white p-2 text-center text-white"
            value={inputMinutes} onChange={e => setInputMinutes(Number(e.target.value))} required />
          <span>分</span>
        </div>
      </div>

      <div>
        <label className="block mb-1 text-yellow-400">良かった点</label>
        <textarea className="w-full bg-slate-800 border border-white p-2 h-20 text-white"
          value={goodPoints} onChange={e => setGoodPoints(e.target.value)} required></textarea>
      </div>

      <div>
        <label className="block mb-1 text-yellow-400">改善点</label>
        <textarea className="w-full bg-slate-800 border border-white p-2 h-20 text-white"
          value={improvements} onChange={e => setImprovements(e.target.value)} required></textarea>
      </div>

      <div className="flex gap-4 mt-4">
        {onClose && (
          <button type="button" onClick={onClose} className="flex-1 bg-slate-700 hover:bg-slate-600 border-2 border-white p-2 text-center text-lg">
            キャンセル
          </button>
        )}
        <button type="submit" disabled={loading} className="flex-1 bg-blue-700 hover:bg-blue-600 border-2 border-white p-2 text-center text-lg disabled:opacity-50">
          {loading ? "記録中..." : "記録する"}
        </button>
      </div>
    </form>
  );
};
