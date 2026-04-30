// src/lib/audio.ts

/**
 * Web Audio APIを使用してSFC風のレベルアップファンファーレを再生します。
 */
export const playFanfare = () => {
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContext) return;
  
  const ctx = new AudioContext();
  const masterGain = ctx.createGain();
  masterGain.gain.value = 0.15; // 音量控えめ
  masterGain.connect(ctx.destination);

  // 矩形波(square)を使ってレトロゲーム風の音色を作成
  const playTone = (freq: number, startTime: number, duration: number) => {
    const osc = ctx.createOscillator();
    osc.type = "square";
    osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);
    
    const env = ctx.createGain();
    env.gain.setValueAtTime(0, ctx.currentTime + startTime);
    env.gain.linearRampToValueAtTime(1, ctx.currentTime + startTime + 0.05);
    env.gain.setValueAtTime(1, ctx.currentTime + startTime + duration - 0.05);
    env.gain.linearRampToValueAtTime(0, ctx.currentTime + startTime + duration);

    osc.connect(env);
    env.connect(masterGain);

    osc.start(ctx.currentTime + startTime);
    osc.stop(ctx.currentTime + startTime + duration);
  };

  // ドラクエ/FF風のファンファーレメロディ (タ、タ、タ、ター・タ・ター)
  // C5(523.25), C5, C5, C5, G4(392.00), G#4(415.30), C5
  const notes = [
    { freq: 523.25, start: 0.0, dur: 0.15 },
    { freq: 523.25, start: 0.2, dur: 0.15 },
    { freq: 523.25, start: 0.4, dur: 0.15 },
    { freq: 523.25, start: 0.6, dur: 0.4 },
    { freq: 392.00, start: 1.0, dur: 0.25 },
    { freq: 415.30, start: 1.25, dur: 0.25 },
    { freq: 523.25, start: 1.5, dur: 0.6 },
  ];

  notes.forEach(note => {
    playTone(note.freq, note.start, note.dur);
  });
};
