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
    
    // モデル名の候補をリスト化して、成功するまで試す
    const modelNames = ["gemini-1.5-flash-latest", "gemini-1.5-flash", "gemini-pro"];
    let advice = "";
    let lastError = null;

    for (const modelName of modelNames) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const prompt = `あなたはプロのサッカーコーチです。以下の練習記録を見て、選手に具体的で熱いアドバイスを日本語で送ってください。
カテゴリ: ${log.category}
練習メニュー: ${log.menus.join(", ")}
時間: ${log.hours.toFixed(1)}時間
良かった点: ${log.goodPoints}
改善点: ${log.improvements}

アドバイスは短く150文字程度で、モチベーションが上がるような言葉をかけてください。`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        advice = response.text();
        if (advice) break; // 成功したらループを抜ける
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${modelName} failed, trying next...`, err.message);
        continue;
      }
    }

    if (!advice && lastError) {
      throw lastError;
    }

    return NextResponse.json({ advice });
  } catch (error: any) {
    console.error("Gemini API error details:", error);
    return NextResponse.json({ 
      error: "コーチへの相談中にエラーが発生しました。",
      details: error.message 
    }, { status: 500 });
  }
}
