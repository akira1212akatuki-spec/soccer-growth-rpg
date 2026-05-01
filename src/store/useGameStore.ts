import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { calculateLevelFromEXP } from '@/lib/gameLogic';

export type PracticeLog = {
  id: string;
  date: string;
  menus: string[];
  hours: number;
  goodPoints: string;
  improvements: string;
  aiAdvice?: string;
  category: "Skill" | "Physical" | "IQ";
};

export type Schedule = {
  id: string;
  date: string;
  category: "Skill" | "Physical" | "IQ";
  menus?: string[];
};

export type EXPResult = {
  gainedSkill: number;
  gainedPhysical: number;
  gainedIQ: number;
  prevSkillLv: number;
  newSkillLv: number;
  prevPhysicalLv: number;
  newPhysicalLv: number;
  prevIQLv: number;
  newIQLv: number;
  isLevelUp: boolean;
};

type GameState = {
  playerName: string | null;
  yearlyGoal: string | null;
  yearlyDeadline: string | null;
  monthlyGoal: string | null;
  monthlyDeadline: string | null;
  charType: "Fire" | "Water" | "Leaf" | null;
  skillEXP: number;
  physicalEXP: number;
  iqEXP: number;
  logs: PracticeLog[];
  schedules: Schedule[];
  lastFeedbackDate: string | null; // 振り返りモーダル用
  overallAdvice: string | null; // 総合アドバイス用
  lastEXPResult: EXPResult | null; // 直近の獲得経験値リザルト
  menuHistory: Record<"Skill" | "Physical" | "IQ", string[]>; // メニュー履歴
  setInitialSetup: (name: string, char: "Fire" | "Water" | "Leaf", yearly: string, yearlyDead: string, monthly: string, monthlyDead: string) => void;
  addEXP: (category: "Skill" | "Physical" | "IQ", amount: number) => void;
  clearLastEXPResult: () => void;
  addLog: (log: PracticeLog) => void;
  updateLogAdvice: (id: string, advice: string) => void;
  addSchedule: (schedule: Schedule) => void;
  removeSchedule: (id: string) => void;
  setLastFeedbackDate: (date: string) => void;
  setOverallAdvice: (advice: string) => void;
  addMenuHistory: (category: "Skill" | "Physical" | "IQ", menus: string[]) => void;
};

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      playerName: null,
      yearlyGoal: null,
      yearlyDeadline: null,
      monthlyGoal: null,
      monthlyDeadline: null,
      charType: null,
      skillEXP: 0,
      physicalEXP: 0,
      iqEXP: 0,
      logs: [],
      schedules: [],
      lastFeedbackDate: null,
      overallAdvice: null,
      lastEXPResult: null,
      menuHistory: {
        Skill: ["フリードリブル", "各種リフティング", "コーン・ドリブル", "ターン練習", "シュート練習", "パス練習"],
        Physical: ["走り込み", "ダッシュ", "筋トレ", "体幹トレーニング"],
        IQ: ["試合動画の分析", "戦術本を読む", "イメージトレーニング", "youtube動画の視聴"]
      },
      setInitialSetup: (name, char, yearly, yearlyDead, monthly, monthlyDead) => set({ 
        playerName: name, charType: char, yearlyGoal: yearly, yearlyDeadline: yearlyDead, monthlyGoal: monthly, monthlyDeadline: monthlyDead 
      }),
      addEXP: (category, amount) => set((state) => {
        let addedSkill = 0;
        let addedPhysical = 0;
        let addedIQ = 0;
        
        if (category === "Skill") {
          addedSkill = amount;
          addedPhysical = Math.floor(amount * 0.3);
          addedIQ = Math.floor(amount * 0.15);
        } else if (category === "Physical") {
          addedSkill = Math.floor(amount * 0.25);
          addedPhysical = amount;
          addedIQ = 0;
        } else {
          addedSkill = Math.floor(amount * 0.5);
          addedPhysical = 0;
          addedIQ = amount;
        }

        const prevSkillLv = calculateLevelFromEXP(state.skillEXP);
        const prevPhysicalLv = calculateLevelFromEXP(state.physicalEXP);
        const prevIQLv = calculateLevelFromEXP(state.iqEXP);

        const newSkillEXP = state.skillEXP + addedSkill;
        const newPhysicalEXP = state.physicalEXP + addedPhysical;
        const newIQEXP = state.iqEXP + addedIQ;

        const newSkillLv = calculateLevelFromEXP(newSkillEXP);
        const newPhysicalLv = calculateLevelFromEXP(newPhysicalEXP);
        const newIQLv = calculateLevelFromEXP(newIQEXP);

        const isLevelUp = newSkillLv > prevSkillLv || newPhysicalLv > prevPhysicalLv || newIQLv > prevIQLv;

        return { 
          skillEXP: newSkillEXP,
          physicalEXP: newPhysicalEXP,
          iqEXP: newIQEXP,
          lastEXPResult: {
            gainedSkill: addedSkill,
            gainedPhysical: addedPhysical,
            gainedIQ: addedIQ,
            prevSkillLv,
            newSkillLv,
            prevPhysicalLv,
            newPhysicalLv,
            prevIQLv,
            newIQLv,
            isLevelUp
          }
        };
      }),
      clearLastEXPResult: () => set({ lastEXPResult: null }),
      addLog: (log) => set((state) => ({ logs: [log, ...state.logs] })),
      updateLogAdvice: (id, advice) => set((state) => ({
        logs: state.logs.map(log => log.id === id ? { ...log, aiAdvice: advice } : log)
      })),
      addSchedule: (schedule) => set((state) => ({ schedules: [...state.schedules, schedule] })),
      removeSchedule: (id) => set((state) => ({ schedules: state.schedules.filter(s => s.id !== id) })),
      setLastFeedbackDate: (date) => set({ lastFeedbackDate: date }),
      setOverallAdvice: (advice) => set({ overallAdvice: advice }),
      addMenuHistory: (category, menus) => set((state) => {
        const currentHistory = state.menuHistory[category];
        const newHistory = [...currentHistory];
        let changed = false;
        menus.forEach(menu => {
          if (!newHistory.includes(menu)) {
            newHistory.push(menu);
            changed = true;
          }
        });
        if (!changed) return state;
        return {
          menuHistory: {
            ...state.menuHistory,
            [category]: newHistory
          }
        };
      }),
    }),
    {
      name: 'soccer-rpg-storage',
      partialize: (state) => {
        // lastEXPResultは永続化しない
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { lastEXPResult, ...rest } = state;
        return rest;
      },
    }
  )
);
