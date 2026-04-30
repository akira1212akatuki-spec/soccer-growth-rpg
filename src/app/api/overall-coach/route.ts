import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { logs, yearlyGoal, monthlyGoal } = await req.json();

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "APIキーが設定されていません。VercelのEnvironment Variablesを確認してください。" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // ログが多い場合は直近の10件などに絞る（トークン節約のため）
    const recentLogs = logs.slice(0, 10);
    const totalHours = logs.reduce((sum: number, log: any) => sum + log.hours, 0);

    const modelNames = ["gemini-1.5-flash-latest", "gemini-1.5-flash", "gemini-pro"];
    let advice = "";
    let lastError = null;

    for (const modelName of modelNames) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const prompt = `
あなたは熱血で頼りがいのある、元サッカー日本代表選手のAIコーチです。
ユーザー（選手）のこれまでの練習記録と目標を総合的に判断して、モチベーションが上がる一言アドバイスを送ってください。

【選手の目標】
- 1年間の目標: ${yearlyGoal || "未設定"}
- 今月の目標: ${monthlyGoal || "未設定"}

【これまでの実績】
- 累計練習時間: ${totalHours.toFixed(1)}時間
- 直近の練習カテゴリとメニュー:
${recentLogs.map((log: any) => `- ${log.category}: ${log.menus.join(", ")} (${log.hours.toFixed(1)}時間)`).join("\n")}

【指示】
- 目標と直近の取り組みのバランスを見て、良かった点や次に意識すべき点を短く熱く伝えてください。
- 画面上の限られたスペース（1〜2行程度）に表示するため、長文は避けてください。文字数は50文字〜100文字程度が目安です。
- 「よっしゃ！」「いいぞ！」のような熱血なトーンでお願いします。
`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        advice = response.text();
        if (advice) break;
      } catch (err: any) {
        lastError = err;
        continue;
      }
    }

    if (!advice && lastError) {
      throw lastError;
    }

    return NextResponse.json({ advice });
  } catch (error) {
    console.error("Overall Coach API error:", error);
    return NextResponse.json({ error: "Failed to generate overall advice." }, { status: 500 });
  }
}
