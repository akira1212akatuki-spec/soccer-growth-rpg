// src/lib/monsters.ts

export type MonsterCategory = "Skill" | "Physical" | "IQ";

export interface MonsterDefinition {
  id: "men_dukuse" | "tsuka_retta" | "gemu_yameraaren";
  name: string;
  category: MonsterCategory;
  requiredMinutes: number; // 撃退に必要な累計分数
  description: string;     // 特徴テキスト
  imagePath: string;
  color: string;           // テーマカラー (Tailwind テキストクラス)
  bgColor: string;         // 背景カラー
  borderColor: string;     // ボーダーカラー
}

export const MONSTERS: MonsterDefinition[] = [
  {
    id: "men_dukuse",
    name: "メン・ドゥクセ",
    category: "Physical",
    requiredMinutes: 60,
    description:
      "面倒くさいことが大嫌いな小鬼。しかし「他人を面倒くさがらせる」ための格闘センスは超一流。攻撃をくらった者のやる気を根こそぎ奪い去っていく。",
    imagePath: "/assets/monsters/men_dukuse.png",
    color: "text-blue-400",
    bgColor: "bg-blue-900/30",
    borderColor: "border-blue-500",
  },
  {
    id: "tsuka_retta",
    name: "ツカ・レッタ",
    category: "IQ",
    requiredMinutes: 45,
    description:
      "泥のように体が重くなる呪いをかけてくる妖艶な魔女。彼女が唱える暗黒魔法「ヒロウ・コン・パイン（疲労困憊）」にかかると、全身が鉛のようになり、通常の5倍の疲労感が襲いかかる。",
    imagePath: "/assets/monsters/tsuka_retta.png",
    color: "text-purple-400",
    bgColor: "bg-purple-900/30",
    borderColor: "border-purple-500",
  },
  {
    id: "gemu_yameraaren",
    name: "ゲム・ヤメラーレン",
    category: "Skill",
    requiredMinutes: 90,
    description:
      "人々をゲーム依存の沼に引きずり込む大剣を振るう骸骨騎士。その刃に一太刀でもかすめると、現実の時計の進みが5倍速に感じられ、気づけば朝を迎えてしまう。",
    imagePath: "/assets/monsters/gemu_yameraaren.png",
    color: "text-red-400",
    bgColor: "bg-red-900/30",
    borderColor: "border-red-500",
  },
];

/** カテゴリに対応する魔物を返す */
export const getMonsterByCategory = (category: MonsterCategory): MonsterDefinition => {
  return MONSTERS.find((m) => m.category === category)!;
};

/**
 * 今日の魔物をランダムで選出する。
 * todayScheduleCategories: 今日予約しているカテゴリの配列（重複可）
 *   - 空の場合 → 3体全体からランダム
 *   - 1種以上ある場合 → その中のどれかにマッチする魔物からランダム
 */
export const selectTodayMonster = (
  todayScheduleCategories: MonsterCategory[]
): MonsterDefinition => {
  if (todayScheduleCategories.length > 0) {
    // 予約カテゴリに対応する魔物候補を抽出（重複除去）
    const uniqueCategories = [...new Set(todayScheduleCategories)];
    const candidates = MONSTERS.filter((m) =>
      uniqueCategories.includes(m.category)
    );
    if (candidates.length > 0) {
      return candidates[Math.floor(Math.random() * candidates.length)];
    }
  }
  // 予約なし or 候補なし → 全体からランダム
  return MONSTERS[Math.floor(Math.random() * MONSTERS.length)];
};
