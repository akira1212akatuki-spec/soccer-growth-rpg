// src/lib/gameLogic.ts

export const calculateNextEXP = (level: number): number => {
  return Math.floor(100 * Math.pow(level, 1.5));
};

export const calculateLevelFromEXP = (exp: number): number => {
  let level = 1;
  let currentNeeded = calculateNextEXP(level);
  let remainingExp = exp;

  while (remainingExp >= currentNeeded) {
    remainingExp -= currentNeeded;
    level++;
    currentNeeded = calculateNextEXP(level);
  }

  return level;
};

export const calculateTotalLevel = (skillExp: number, physicalExp: number, iqExp: number): number => {
  const skillLv = calculateLevelFromEXP(skillExp);
  const physicalLv = calculateLevelFromEXP(physicalExp);
  const iqLv = calculateLevelFromEXP(iqExp);

  const total = Math.floor((skillLv + physicalLv + iqLv) / 3);
  return Math.min(total, 100); // Max Lv 100
};

export const calculateEXPMultiplier = (hours: number, category: "Skill" | "Physical" | "IQ"): number => {
  let baseHours = 1.5;
  if (category === "IQ") baseHours = 0.5;
  if (category === "Physical") baseHours = 0.75; // 45分
  
  if (hours < baseHours) {
    const val = 0.3 + 0.7 * Math.pow(hours / baseHours, 2);
    return Math.max(0.3, Number(val.toFixed(2)));
  } else if (hours <= baseHours * 2) {
    const val = 1.0 + 1.5 * Math.pow((hours - baseHours) / baseHours, 2);
    return Math.min(2.5, Number(val.toFixed(2)));
  } else {
    return 2.5; // Safety Cap
  }
};

const evolutionBoundaries = [
  5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 
  55, 60, 65, 70, 75, 81, 87, 93, 100
];

export const getEvolutionForm = (totalLevel: number): number => {
  for (let i = 0; i < evolutionBoundaries.length; i++) {
    if (totalLevel < evolutionBoundaries[i]) return i + 1;
  }
  return 20; // Lv100以上
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

export const getCharacterName = (type: "Fire" | "Water" | "Leaf", totalLevel: number): string => {
  const stage = getEvolutionForm(totalLevel);
  const index = stage - 1;
  if (type === "Fire") return namesFire[index];
  if (type === "Water") return namesWater[index];
  return namesLeaf[index];
};
