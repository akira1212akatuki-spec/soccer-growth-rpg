"use client";

import React, { useEffect, useState, useRef } from "react";
import confetti from "canvas-confetti";
import { playFanfare } from "@/lib/audio";
import { useGameStore } from "@/store/useGameStore";
import { calculateLevelFromEXP } from "@/lib/gameLogic";

export const LevelUpEffect = () => {
  const { skillEXP, physicalEXP, iqEXP } = useGameStore();
  const prevLevelsSumRef = useRef<number>(0);
  const [showLevelUp, setShowLevelUp] = useState(false);

  useEffect(() => {
    const sLv = calculateLevelFromEXP(skillEXP);
    const pLv = calculateLevelFromEXP(physicalEXP);
    const iLv = calculateLevelFromEXP(iqEXP);
    prevLevelsSumRef.current = sLv + pLv + iLv;
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const sLv = calculateLevelFromEXP(skillEXP);
    const pLv = calculateLevelFromEXP(physicalEXP);
    const iLv = calculateLevelFromEXP(iqEXP);
    const currentLevelsSum = sLv + pLv + iLv;
    
    if (currentLevelsSum > prevLevelsSumRef.current && prevLevelsSumRef.current !== 0) {
      // レベルアップ発動！
      setShowLevelUp(true);
      playFanfare();

      // 紙吹雪エフェクト
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: Math.random(), y: Math.random() - 0.2 } }));
      }, 250);

      // 4秒後に表示を消す
      setTimeout(() => {
        setShowLevelUp(false);
      }, 4000);
    }
    
    prevLevelsSumRef.current = currentLevelsSum;
  }, [skillEXP, physicalEXP, iqEXP]);

  if (!showLevelUp) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none bg-black/40">
      <div className="text-center animate-bounce">
        <h1 className="text-6xl text-yellow-400 font-black" style={{ textShadow: "4px 4px 0px #000, -2px -2px 0px #000, 2px -2px 0px #000, -2px 2px 0px #000" }}>
          LEVEL UP!
        </h1>
      </div>
    </div>
  );
};
