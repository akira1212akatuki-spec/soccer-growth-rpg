// src/lib/gameLogic.ts

export const calculateNextEXP = (level: number): number => {
  // レベル(level + 1)に到達するために必要な累計経験値
  return Math.floor(100 * Math.pow(level, 1.5));
};

export const calculateLevelFromEXP = (exp: number): number => {
  let level = 1;
  const floorExp = Math.floor(exp);
  // 累計経験値がしきい値を超えている限りレベルアップ
  while (level < 999 && floorExp >= calculateNextEXP(level)) {
    level++;
  }
  return level;
};

export interface ProgressInfo {
  level: number;
  currentTotalExp: number;
  thisLevelStartExp: number;
  nextLevelThreshold: number;
  expInLevel: number;
  expNeededInLevel: number;
  percentage: number;
}

export const getLevelProgress = (totalExp: number): ProgressInfo => {
  const level = calculateLevelFromEXP(totalExp);
  const thisLevelStartExp = level > 1 ? calculateNextEXP(level - 1) : 0;
  const nextLevelThreshold = calculateNextEXP(level);
  
  const expInLevel = totalExp - thisLevelStartExp;
  const expNeededInLevel = nextLevelThreshold - thisLevelStartExp;
  const percentage = Math.min(100, Math.max(0, (expInLevel / expNeededInLevel) * 100));

  return {
    level,
    currentTotalExp: totalExp,
    thisLevelStartExp,
    nextLevelThreshold,
    expInLevel,
    expNeededInLevel,
    percentage
  };
};

export const calculateEXPMultiplier = (hours: number, category: "Skill" | "Physical" | "IQ"): number => {
  let baseHours = 1.5;
  if (category === "IQ") baseHours = 0.5;
  if (category === "Physical") baseHours = 0.75; 
  
  if (hours < baseHours) {
    const val = 0.3 + 0.7 * Math.pow(hours / baseHours, 2);
    return Math.max(0.3, Number(val.toFixed(2)));
  } else if (hours <= baseHours * 2) {
    const val = 1.0 + 1.5 * Math.pow((hours - baseHours) / baseHours, 2);
    return Math.min(2.5, Number(val.toFixed(2)));
  } else {
    return 2.5;
  }
};

const evolutionBoundaries = [
  5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 
  55, 60, 65, 70, 75, 81, 87, 93, 100
];

export const getEvolutionForm = (level: number): number => {
  for (let i = 0; i < evolutionBoundaries.length; i++) {
    if (level < evolutionBoundaries[i]) return i + 1;
  }
  return 20; // Lv100以上
};

export const isEvolutionLevel = (level: number): boolean => {
  return evolutionBoundaries.includes(level);
};

const namesFire = [
  "フレイムパピー", "アーリー・バーナー", "ライジング・イグニス", "バーンレックス", "ヒート・ドリブラー",
  "ブレイズ・ストライカー", "プロメテ・ラプトル", "マグマ・ウォール", "ボルカニック・シュート", "ヴォルガイザー",
  "ガン・フレイム", "ヘル・ファイア", "イフリート・キャノン", "バーニング・ハート", "ゴッド・フェニックス",
  "皇竜プロメテウス", "インフェルノ・ゾーン", "メテオ・ストライク", "アブソリュート・ゼロ", "極焔神ノヴァ・ドラグーン"
];

const namesWater = [
  "アクアプルプ", "ウェーブ・ランナー", "ストリーム・パサー", "アクアギル", "タイダル・ドリブラー",
  "クリスタル・ビジョン", "マーメイド・アサシン", "アイス・ウォール", "スプラッシュ・シュート", "ネプチュロス",
  "オーシャン・マスター", "アビス・アイ", "リヴァイアサン・コア", "ミラージュ・プレイ", "ヴォルテックス・シュート",
  "海皇神ポセイドル", "アンティグラビティ・シー", "ゴッド・ハーモニー", "クラッシュ・オブ・アビス", "蒼瀾神ポセイドン・ネオ"
];

const namesLeaf = [
  "シードタヌノ", "ルート・トラッパー", "リーフ・シールド", "フォレストル", "アイアン・ウッド",
  "ソーラー・チャージ", "グランド・ガーディアン", "ヴァイン・タックル", "サンド・ストーム", "エルドランサー",
  "ネイチャー・フレンド", "アース・クエイク", "トレント・フォートレス", "エナジー・ドレイン", "グランド・シュート",
  "聖樹獣ユグドラシル", "アンティグラビティ・フィールド", "ゴッド・ブレス", "ワールド・ツリー・エフェクト", "万物神ユグドラシル・ゼロ"
];

export const getCharacterName = (type: "Fire" | "Water" | "Leaf", level: number): string => {
  const stage = getEvolutionForm(level);
  const index = Math.min(stage - 1, 19);
  if (type === "Fire") return namesFire[index];
  if (type === "Water") return namesWater[index];
  return namesLeaf[index];
};
