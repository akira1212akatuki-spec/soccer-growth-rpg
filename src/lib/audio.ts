// src/lib/audio.ts

/**
 * Web Audio APIを使用してSFC風のレベルアップファンファーレを再生します。
 */
export const playFanfare = () => {
  const audio = new Audio('/assets/levelup.mp3');
  audio.volume = 0.5;
  audio.play().catch(e => console.error("音声再生エラー:", e));
};
