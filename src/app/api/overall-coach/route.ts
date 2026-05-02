import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { logs, yearlyGoal, monthlyGoal } = await req.json();

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "APIキーが設定されていません。" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    const recentLogs = logs.slice(0, 10);
    const totalHours = logs.reduce((sum: number, log: any) => sum + log.hours, 0);

    const modelNames = ["gemini-1.5-flash-latest", "gemini-1.5-flash", "gemini-pro"];
    let advice = "";
    let lastError = null;

    for (const modelName of modelNames) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const prompt = `
あなたは荘厳で慈愛に満ちた「サッカーの神」です。
ユーザー（選手）は君が授けた3匹の霊獣（火の体、水の技、草の知）と共に修行に励んでいます。
これまでの練習記録と目標を総合的に判断して、神としての啓示（アドバイス）を授けてください。

【選手の誓い】
- 一年の誓い: ${yearlyGoal || "未設定"}
- 今月の誓い: ${monthlyGoal || "未設定"}

【これまでの修練】
- 累計修練時間: ${totalHours.toFixed(1)}時間
- 直近の修練内容:
${recentLogs.map((log: any) => `- ${log.category}: ${log.menus.join(", ")} (${log.hours.toFixed(1)}時間)`).join("\n")}

【指示】
-  majestic（荘厳）で、かつ選手を温かく見守るようなトーンでお願いします。
- 3つの魂（体力、スキル、IQ）のバランスや、目標への精進具合について触れてください。
- 「そなた」「～である」「～がよい」といった神らしい古風で威厳のある口調にしてください。
- 画面上の限られたスペースに表示するため、60文字〜100文字程度で簡潔に。
- 最後に「完全体」への期待を込めてください。
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
    return NextResponse.json({ error: "Failed to generate oracle." }, { status: 500 });
  }
}
