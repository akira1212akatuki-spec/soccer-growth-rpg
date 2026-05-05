"use client";

import React, { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";
import { JRPGWindow } from "./ui/JRPGWindow";
import { useGameStore, Schedule, PracticeLog } from "@/store/useGameStore";
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { PracticeForm } from "./PracticeForm";

export const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { schedules, addSchedule, removeSchedule, logs, menuHistory, addMenuHistory } = useGameStore();

  // 日付クリック用モーダル
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isPastDate, setIsPastDate] = useState(false);
  const [isRecordingMode, setIsRecordingMode] = useState(false);
  
  // 未来日スケジュール追加用の状態
  const [selectedCategory, setSelectedCategory] = useState<"Skill" | "Physical" | "IQ">("Skill");
  const [selectedMenus, setSelectedMenus] = useState<string[]>([]);
  const [newMenu, setNewMenu] = useState("");

  // アドバイス再読み込み用の状態
  const [loadingAdviceId, setLoadingAdviceId] = useState<string | null>(null);

  // スケジュール詳細用ポップアップ
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getSchedulesForDay = (day: Date) => {
    return schedules.filter(s => s.date === format(day, "yyyy-MM-dd"));
  };

  const getLogsForDay = (day: Date) => {
    return logs.filter(log => log.date === format(day, "yyyy-MM-dd"));
  };

  const handleDayClick = (day: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const clickedDay = new Date(day);
    clickedDay.setHours(0, 0, 0, 0);

    setSelectedDate(day);
    setIsPastDate(clickedDay <= today);
    setIsRecordingMode(false);
    
    setSelectedCategory("Skill");
    setSelectedMenus([]);
    setNewMenu("");
    
    setIsModalOpen(true);
  };

  // スケジュールクリック時
  const handleScheduleClick = (e: React.MouseEvent, schedule: Schedule) => {
    e.stopPropagation();
    setSelectedSchedule(schedule);
  };

  // 予定の追加処理
  const handleAddSchedule = () => {
    if (selectedDate && selectedMenus.length > 0) {
      addMenuHistory(selectedCategory, selectedMenus);
      addSchedule({
        id: crypto.randomUUID(),
        date: format(selectedDate, "yyyy-MM-dd"),
        category: selectedCategory,
        menus: selectedMenus
      });
      setIsModalOpen(false);
    } else if (selectedDate && selectedMenus.length === 0) {
      alert("練習メニューを少なくとも1つ選択してください。");
    }
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

  const handleDeleteSchedule = () => {
    if (selectedSchedule) {
      removeSchedule(selectedSchedule.id);
      setSelectedSchedule(null);
    }
  };

  const handleReloadAdvice = async (log: PracticeLog) => {
    if (loadingAdviceId) return;
    setLoadingAdviceId(log.id);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000);

      const response = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ log }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const data = await response.json();

      if (response.ok) {
        useGameStore.getState().updateLogAdvice(log.id, data.advice);
      } else {
        const errorMsg = data.details || data.error || "通信エラーが発生しました";
        useGameStore.getState().updateLogAdvice(log.id, `エラー: ${errorMsg}`);
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        useGameStore.getState().updateLogAdvice(log.id, "エラー: コーチが考え込んでしまい、時間切れになりました。もう一度試してください。");
      } else {
        useGameStore.getState().updateLogAdvice(log.id, `エラー: 接続に失敗しました (${err.message})`);
      }
    } finally {
      setLoadingAdviceId(null);
    }
  };

  const currentHistory = menuHistory[selectedCategory] || [];

  return (
    <>
      <JRPGWindow title="カレンダー">
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="p-1 hover:bg-slate-800 border border-transparent hover:border-white rounded"><ChevronLeft size={20}/></button>
          <span className="font-bold text-lg">{format(currentDate, "yyyy年 MM月")}</span>
          <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="p-1 hover:bg-slate-800 border border-transparent hover:border-white rounded"><ChevronRight size={20}/></button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-2 text-center text-xs text-yellow-400">
          {["日", "月", "火", "水", "木", "金", "土"].map(day => <div key={day}>{day}</div>)}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: monthStart.getDay() }).map((_, i) => (
            <div key={`empty-${i}`} className="h-16 bg-slate-900/50 border border-slate-700"></div>
          ))}
          
          {daysInMonth.map((day) => {
            const daySchedules = getSchedulesForDay(day);
            const isToday = isSameDay(day, new Date());
            const dayLogs = getLogsForDay(day);
            const hasLog = dayLogs.length > 0;

            return (
              <div 
                key={day.toISOString()} 
                onClick={() => handleDayClick(day)}
                className={`h-16 border p-1 flex flex-col text-xs cursor-pointer hover:bg-slate-800 ${isToday ? "border-yellow-400 bg-slate-800/50" : "border-slate-600 bg-slate-900/50"}`}
              >
                <div className="flex justify-between">
                  <span className={isToday ? "text-yellow-400 font-bold" : ""}>{format(day, "d")}</span>
                  {hasLog && <span className="text-[10px] text-green-400">✓</span>}
                </div>
                <div className="flex flex-wrap gap-1 mt-1 overflow-hidden">
                  {daySchedules.map(schedule => (
                    <span 
                      key={schedule.id} 
                      onClick={(e) => handleScheduleClick(e, schedule)}
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] text-white ${
                        schedule.category === "Skill" ? "bg-red-500" :
                        schedule.category === "Physical" ? "bg-blue-500" : "bg-green-500"
                      }`}
                    >
                      {schedule.category[0]}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </JRPGWindow>

      {/* スケジュール詳細ポップアップ */}
      {selectedSchedule && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pointer-events-auto bg-black/60 p-4 pt-12 overflow-y-auto">
          <JRPGWindow title="予定の詳細" className="w-full max-w-sm mb-12">
            <div className="flex flex-col gap-4 text-sm relative">
              <p className="text-yellow-400 font-bold border-b border-slate-500 pb-2">
                {format(new Date(selectedSchedule.date), "yyyy年MM月dd日")}
              </p>
              <div>
                <span className="text-yellow-400 text-xs block mb-1">カテゴリ:</span>
                <span className={`font-bold ${
                  selectedSchedule.category === "Skill" ? "text-red-400" :
                  selectedSchedule.category === "Physical" ? "text-blue-400" : "text-green-400"
                }`}>{selectedSchedule.category}</span>
              </div>
              <div>
                <span className="text-yellow-400 text-xs block mb-1">予定メニュー:</span>
                <span className="text-white">{selectedSchedule.menus?.join(", ") || "なし"}</span>
              </div>
              
              <div className="flex justify-between items-end mt-4">
                <button onClick={() => setSelectedSchedule(null)} className="bg-slate-700 hover:bg-slate-600 border border-white px-4 py-2">閉じる</button>
                <button onClick={handleDeleteSchedule} className="text-red-400 hover:text-red-300 p-2 border border-red-500 hover:bg-red-500/20 rounded" title="予定を削除">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </JRPGWindow>
        </div>
      )}

      {/* 日付クリック時（予定追加・記録表示）のモーダル */}
      {isModalOpen && selectedDate && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pointer-events-auto bg-black/60 p-4 pt-12 overflow-y-auto">
          <JRPGWindow title={isPastDate ? "練習の記録" : "予定の追加"} className="w-full max-w-md mb-12">
            <div className="flex flex-col gap-4 text-sm">
              <div className="flex justify-between items-center border-b border-slate-500 pb-2">
                <p className="text-yellow-400 font-bold">
                  {format(selectedDate, "yyyy年MM月dd日")}
                </p>
                {!isRecordingMode && (
                  <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
                )}
              </div>
              
              {isPastDate ? (
                // 過去・今日のクリック時
                isRecordingMode ? (
                  // 入力フォームを表示
                  <PracticeForm initialDate={format(selectedDate, "yyyy-MM-dd")} onClose={() => { setIsRecordingMode(false); setIsModalOpen(false); }} />
                ) : (
                  // 記録一覧と追加ボタンを表示
                  <div className="flex flex-col gap-4">
                    <button 
                      onClick={() => setIsRecordingMode(true)}
                      className="bg-blue-700 hover:bg-blue-600 border border-white py-3 font-bold text-center w-full shadow-lg"
                    >
                      ✏️ この日の練習を記録する
                    </button>
                    
                    {getLogsForDay(selectedDate).length > 0 && (
                      <div className="flex flex-col gap-4 mt-2">
                        <p className="text-slate-400 text-xs">登録済みの記録：</p>
                        {getLogsForDay(selectedDate).map((log, index) => (
                          <div key={log.id} className="bg-slate-800/80 border border-white p-3 rounded flex flex-col gap-2">
                            <div className="flex justify-between border-b border-slate-600 pb-1">
                              <span className={`font-bold ${
                                log.category === "Skill" ? "text-red-400" :
                                log.category === "Physical" ? "text-blue-400" : "text-green-400"
                              }`}>{log.category}</span>
                              <span>{log.hours.toFixed(1)} 時間</span>
                            </div>
                            <div>
                              <span className="text-yellow-400 text-xs block mb-1">実施メニュー:</span>
                              <span className="text-xs">{log.menus.join(", ")}</span>
                            </div>
                            <div>
                              <span className="text-yellow-400 text-xs block mb-1">良かった点:</span>
                              <p className="text-xs whitespace-pre-wrap">{log.goodPoints}</p>
                            </div>
                            <div>
                              <span className="text-yellow-400 text-xs block mb-1">改善点:</span>
                              <p className="text-xs whitespace-pre-wrap">{log.improvements}</p>
                            </div>
                            {log.aiAdvice ? (
                              <div className="mt-2 bg-slate-900 border border-blue-500 p-2 rounded relative">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="text-blue-400 text-xs font-bold block">コーチからのアドバイス:</span>
                                  <button 
                                    onClick={() => handleReloadAdvice(log)}
                                    disabled={loadingAdviceId === log.id}
                                    className="text-[10px] bg-slate-800 hover:bg-slate-700 border border-blue-500 text-blue-300 px-2 py-0.5 rounded disabled:opacity-50"
                                  >
                                    {loadingAdviceId === log.id ? "再読込中..." : "🔄 再読込"}
                                  </button>
                                </div>
                                <p className="text-xs whitespace-pre-wrap">{log.aiAdvice}</p>
                              </div>
                            ) : (
                              <div className="mt-2 flex justify-end">
                                <button 
                                  onClick={() => handleReloadAdvice(log)}
                                  disabled={loadingAdviceId === log.id}
                                  className="text-[10px] bg-blue-900/50 hover:bg-blue-800/50 border border-blue-500 text-blue-300 px-3 py-1.5 rounded disabled:opacity-50"
                                >
                                  {loadingAdviceId === log.id ? "考え中..." : "コーチにアドバイスをもらう"}
                                </button>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              ) : (
                // 明日以降の予定追加
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block mb-2 text-yellow-400">カテゴリを選択してください</label>
                    <select 
                      className="w-full bg-slate-800 border border-white p-2 text-white"
                      value={selectedCategory} 
                      onChange={e => {
                        setSelectedCategory(e.target.value as any);
                        setSelectedMenus([]);
                        setNewMenu("");
                      }}
                    >
                      <option value="Skill">Skill (ボールタッチ等)</option>
                      <option value="Physical">Physical (フィジカル等)</option>
                      <option value="IQ">IQ (サッカーIQ等)</option>
                    </select>
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

                  <div className="flex justify-end gap-2 mt-2">
                    <button 
                      onClick={() => setIsModalOpen(false)} 
                      className="bg-slate-700 hover:bg-slate-600 border border-white px-4 py-2"
                    >
                      キャンセル
                    </button>
                    <button 
                      onClick={handleAddSchedule}
                      disabled={selectedMenus.length === 0}
                      className="bg-blue-700 hover:bg-blue-600 border border-white px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      追加する
                    </button>
                  </div>
                </div>
              )}
            </div>
          </JRPGWindow>
        </div>
      )}
    </>
  );
};
