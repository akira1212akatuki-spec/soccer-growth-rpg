"use client";

import React, { useState, useEffect } from "react";
import { MONSTERS, DEMON_KING } from "@/lib/monsters";
import { useGameStore } from "@/store/useGameStore";

export const MonsterDefeatModal = () => {
  const {
    showMonsterDefeatModal,
    closeMonsterDefeatModal,
    todayMonster,
    setMonsterDefeatComment,
    logs,
    yearlyGoal,
    monthlyGoal,
  } = useGameStore();

  const [loadingComment, setLoadingComment] = useState(false);

  const isDemonKing = todayMonster?.isDemonKing ?? false;

  const monsterName = isDemonKing
    ? DEMON_KING.name
    : MONSTERS.find((m) => m.id === todayMonster?.monsterId)?.name ?? null;

  // モーダルが開いたらAIコメントを取得
  useEffect(() => {
    if (!showMonsterDefeatModal || !monsterName || todayMonster?.defeatComment) return;

    const fetchDefeatComment = async () => {
      setLoadingComment(true);
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000);

        const systemHint = isDemonKing
          ? `プレイヤーが本日、魔界の絶対的な王「${DEMON_KING.name}」を撃退した！3つのカテゴリ全ての条件を一日で達成するという偉業だ！この伝説的な快挙を熱く称え、次の修練への究極のモチベーションを与える短いコメントをしてください。`
          : `プレイヤーが本日「${monsterName}」という心の魔物を撃退した！フィジカル・スキル・サッカーIQのどれかカテゴリでの修練量で魔物を追い払った。この快挙を称え、次の修練への熱いモチベーションを与える短いコメントをしてください。`;

        const response = await fetch("/api/overall-coach", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            logs,
            yearlyGoal,
            monthlyGoal,
            systemHint,
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        const data = await response.json();
        if (data.advice) {
          setMonsterDefeatComment(data.advice);
        }
      } catch {
        const fallback = isDemonKing
          ? "信じられない！魔王をも打ち倒す精神力と努力、それこそが真の勇者の証だ。君はもう何にも負けない！"
          : "素晴らしい！諦めない君の心が魔物を打ち負かした。その調子で明日も突き進め！";
        setMonsterDefeatComment(fallback);
      } finally {
        setLoadingComment(false);
      }
    };

    fetchDefeatComment();
  }, [showMonsterDefeatModal]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!showMonsterDefeatModal || !monsterName || !todayMonster) return null;

  // ── 魔王撃退モーダル ──
  if (isDemonKing) {
    return (
      <div className="fixed inset-0 z-[95] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 overflow-y-auto">
        <div
          className="w-full max-w-sm mx-auto border-4 border-fuchsia-400 rounded-lg shadow-2xl"
          style={{ background: "linear-gradient(to bottom, #1a001a, #0a0020)" }}
        >
          {/* ヘッダー */}
          <div className="px-4 pt-5 pb-3 text-center border-b border-fuchsia-500/40">
            <div className="text-4xl mb-2 animate-bounce">👑</div>
            <h2
              className="text-2xl font-black text-fuchsia-400 tracking-widest"
              style={{ textShadow: "3px 3px 0px #000, -1px -1px 0px #000" }}
            >
              魔王撃退！！
            </h2>
            <p className="text-xs text-fuchsia-200 mt-1 font-bold">
              「{DEMON_KING.name}」を追い払った！
            </p>
          </div>

          {/* ボーナス表示 */}
          <div className="mx-4 my-3 bg-fuchsia-900/40 border-2 border-fuchsia-400 rounded p-3 text-center">
            <p className="text-fuchsia-300 font-black text-sm leading-relaxed">
              ✨ 翌日の修練による経験値が
            </p>
            <p
              className="text-fuchsia-400 font-black text-3xl my-1"
              style={{ textShadow: "2px 2px 0px #000" }}
            >
              2倍ボーナス！
            </p>
            <p className="text-[10px] text-fuchsia-200/70">明日の練習記録時に自動適用されます</p>
          </div>

          {/* AIコメント */}
          <div className="mx-4 mb-4 bg-slate-900/60 border border-slate-600 rounded p-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">⚽</span>
              <span className="text-xs font-bold text-fuchsia-400">日本代表プロからのコメント</span>
            </div>
            {loadingComment ? (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 border-2 border-fuchsia-400 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                <p className="text-xs text-slate-400">分析中...</p>
              </div>
            ) : (
              <p className="text-xs text-slate-200 leading-relaxed italic">
                「{todayMonster.defeatComment || "信じられない！魔王をも打ち倒す精神力と努力、それこそが真の勇者の証だ。"}」
              </p>
            )}
          </div>

          <div className="px-4 pb-5">
            <button
              onClick={closeMonsterDefeatModal}
              className="w-full bg-fuchsia-600 hover:bg-fuchsia-500 border-2 border-white py-3 text-center text-lg font-black text-white transition-all shadow-[0_4px_0_rgb(112,26,117)] active:translate-y-1 active:shadow-none"
              style={{ textShadow: "2px 2px 0px #000" }}
            >
              伝説の勇者として、さらに前へ！
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── 通常魔物撃退モーダル ──
  return (
    <div className="fixed inset-0 z-[95] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 overflow-y-auto">
      <div
        className="w-full max-w-sm mx-auto border-4 border-yellow-400 rounded-lg shadow-2xl"
        style={{ background: "linear-gradient(to bottom, #1a0a00, #000033)" }}
      >
        {/* ヘッダー */}
        <div className="px-4 pt-5 pb-3 text-center border-b border-yellow-500/40">
          <div className="text-4xl mb-2 animate-bounce">🏆</div>
          <h2
            className="text-2xl font-black text-yellow-400 tracking-widest"
            style={{ textShadow: "3px 3px 0px #000, -1px -1px 0px #000" }}
          >
            魔物撃退！
          </h2>
          <p className="text-xs text-yellow-200 mt-1 font-bold">
            「{monsterName}」を追い払った！
          </p>
        </div>

        {/* ボーナス表示 */}
        <div className="mx-4 my-3 bg-yellow-900/40 border-2 border-yellow-400 rounded p-3 text-center">
          <p className="text-yellow-300 font-black text-sm leading-relaxed">
            ✨ 翌日の修練による経験値が
          </p>
          <p
            className="text-yellow-400 font-black text-3xl my-1"
            style={{ textShadow: "2px 2px 0px #000" }}
          >
            2倍ボーナス！
          </p>
          <p className="text-[10px] text-yellow-200/70">明日の練習記録時に自動適用されます</p>
        </div>

        {/* AIコメント */}
        <div className="mx-4 mb-4 bg-slate-900/60 border border-slate-600 rounded p-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">⚽</span>
            <span className="text-xs font-bold text-yellow-400">日本代表プロからのコメント</span>
          </div>
          {loadingComment ? (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin flex-shrink-0" />
              <p className="text-xs text-slate-400">分析中...</p>
            </div>
          ) : (
            <p className="text-xs text-slate-200 leading-relaxed italic">
              「{todayMonster.defeatComment || "素晴らしい！諦めない君の心が魔物を打ち負かした。"}」
            </p>
          )}
        </div>

        <div className="px-4 pb-5">
          <button
            onClick={closeMonsterDefeatModal}
            className="w-full bg-yellow-600 hover:bg-yellow-500 border-2 border-white py-3 text-center text-lg font-black text-white transition-all shadow-[0_4px_0_rgb(133,77,14)] active:translate-y-1 active:shadow-none"
            style={{ textShadow: "2px 2px 0px #000" }}
          >
            頑張るぞ！
          </button>
        </div>
      </div>
    </div>
  );
};
