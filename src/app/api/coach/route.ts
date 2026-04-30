import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request: Request) {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ advice: "APIキーが設定されていません。VercelのEnvironment Variablesを確認してください。" }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { log } = body;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `あなたはプロのサッカーコーチです。以下の練習記録を見て、選手に具体的で熱いアドバイスを日本語で送ってください。
カテゴリ: ${log.category}
練習メニュー: ${log.menus.join(", ")}
時間: ${log.hours.toFixed(1)}時間
良かった点: ${log.goodPoints}
改善点: ${log.improvements}

アドバイスは短く150文字程度で、モチベーションが上がるような言葉をかけてください。`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const advice = response.text();

    return NextResponse.json({ advice });
  } catch (error: any) {
    console.error("Gemini API error details:", error);
    return NextResponse.json({ 
      error: "コーチへの相談中にエラーが発生しました。",
      details: error.message 
    }, { status: 500 });
  }
}
