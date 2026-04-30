import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

export async function POST(request: Request) {
  if (!apiKey) {
    return NextResponse.json({ advice: "APIキーが設定されていません。" }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { log } = body;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
あなたは世界で活躍する現役のサッカー日本代表選手です。未来のプロを目指す若手選手に向けて熱いアドバイスを送ってください。
以下の練習記録を分析し、技術面、メンタル面、戦術面の3つの観点を取り入れた「プロになるためのアドバイス」を150文字程度で生成してください。
返答は直接アドバイス本文のみを出力し、挨拶や自己紹介などは省いてください。

【練習記録】
- カテゴリ: ${log.category}
- メニュー: ${log.menus.join(", ")}
- 時間: ${log.hours.toFixed(1)}時間
- 良かった点: ${log.goodPoints}
- 改善点: ${log.improvements}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ advice: text });
  } catch (error) {
    console.error("Gemini API error:", error);
    return NextResponse.json({ advice: "エラーが発生しました。" }, { status: 500 });
  }
}
