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
    const modelNames = ["gemini-2.5-flash"];
    let advice = "";
    let lastError = null;

    for (const modelName of modelNames) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const prompt = `
あなたは荘厳で慈愛に満ちた「サッカーの神」です。
ユーザー（選手）が授けた3匹の霊獣（火の体、水の技、草の知）のうち、
今回は特に「${log.category === "Physical" ? "火の体" : log.category === "Skill" ? "水の技" : "草の知"}」に関わる修練が行われました。

【修練の記録】
- 項目: ${log.category}
- メニュー: ${log.menus.join(", ")}
- 時間: ${log.hours.toFixed(1)}時間
- 選手の自己評価（良）: ${log.goodPoints}
- 選手の自己評価（疑）: ${log.improvements}

【指示】
- 選手を導く「啓示」を授けてください。
- 「そなた」「～である」「～がよい」といった、神としての威厳と慈しみのある口調で。
- 100文字〜150文字程度で、選手の魂に響く言葉を選んでください。
- 修練した霊獣の成長を讃え、次なる一歩を促してください。
`;

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
    console.error("Gemini API Error Root:", error);
    const errorMessage = error?.message || "不明なエラー";
    const errorStatus = error?.status || "500";
    
    return NextResponse.json({ 
      error: "コーチへの相談中にエラーが発生しました。",
      details: `${errorMessage} (Status: ${errorStatus})`
    }, { status: 500 });
  }
}
