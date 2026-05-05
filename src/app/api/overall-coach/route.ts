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

    const modelNames = ["gemini-2.5-flash"];
    let advice = "";
    let lastError = null;

    for (const modelName of modelNames) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const prompt = `
あなたは現役のサッカー日本代表であり、ユーザーにとって「頼れるプロの先輩」です。
ユーザー（後輩選手）は自身の分身である3匹の霊獣（火の体、水の技、草の知）と共に修行に励んでいます。
これまでの練習記録と目標を総合的に判断して、プロの視点から目標達成に向けたアドバイスを送ってください。

【後輩の目標】
- 1年間の目標: ${yearlyGoal || "未設定"}
- 1ヶ月の目標: ${monthlyGoal || "未設定"}

【これまでの修練】
- 累計修練時間: ${totalHours.toFixed(1)}時間
- 直近の修練内容:
${recentLogs.map((log: any) => `- ${log.category}: ${log.menus.join(", ")} (${log.hours.toFixed(1)}時間)`).join("\n")}

【指示】
- 「～だね」「～してみよう」といった、親身で頼れる先輩プロ選手の口調で話しかけてください。
- 目標（1ヶ月と1年）に対して、現在の練習内容から見て『到達するために必要な要素』や『意識すべきポイント』を具体的に教えてください。
- 画面上の限られたスペースに表示するため、60文字〜120文字程度で簡潔に。
- 最後に、一緒にピッチで戦う日を楽しみにしているような熱い期待の言葉をかけてください。
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
