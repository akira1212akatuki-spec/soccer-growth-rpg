import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// 指定ミリ秒待機するヘルパー
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

export async function POST(request: Request) {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ advice: "APIキーが設定されていません。VercelのEnvironment Variablesを確認してください。" }, { status: 500 });
  }

  try {
    const body = await request.json();
    const { log } = body;

    const genAI = new GoogleGenerativeAI(apiKey);

    // モデルの優先順。503/429の場合は次のモデルへフォールバック
    const modelNames = [
      "gemini-2.5-flash",
      "gemini-2.5-flash-lite",
      "gemini-flash-latest",
      "gemini-flash-lite-latest"
    ];
    let advice = "";
    let lastError = null;

    const prompt = `
あなたは現役のサッカー日本代表であり、ユーザーにとって「頼れるプロの先輩」です。
ユーザー（後輩選手）が、自身の分身である3匹の霊獣（火の体、水の技、草の知）のうち、
今回は特に「${log.category === "Physical" ? "火の体" : log.category === "Skill" ? "水の技" : "草の知"}」に関わる修練を行いました。

【修練の記録】
- 項目: ${log.category}
- メニュー: ${log.menus.join(", ")}
- 時間: ${log.hours.toFixed(1)}時間
- 後輩の自己評価（良）: ${log.goodPoints}
- 後輩の自己評価（改善）: ${log.improvements}

【指示】
- 後輩選手を導く実践的で熱いアドバイスを送ってください。
- 「～だね」「～してみよう」「お疲れ様！」といった、親身で頼れる先輩プロ選手の口調で話しかけてください。
- 100文字〜150文字程度で簡潔に。
- 今回の修練や自己評価を褒めつつ、プロの視点から次の一歩に繋がる具体的なアドバイスや励ましの言葉をかけてください。
`;

    for (const modelName of modelNames) {
      // 同じモデルで最大2回リトライ（503/429の一時的なエラー向け）
      const MAX_RETRIES = 2;
      let succeeded = false;

      for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
        try {
          const model = genAI.getGenerativeModel({ model: modelName });
          const result = await model.generateContent(prompt);
          const response = await result.response;
          advice = response.text();
          if (advice) {
            succeeded = true;
            break;
          }
        } catch (err: any) {
          lastError = err;
          const status = err?.status ?? err?.httpError ?? 0;
          const isRetryable = status === 503 || status === 429;

          if (isRetryable && attempt < MAX_RETRIES) {
            const waitMs = 600 * (attempt + 1);
            console.warn(`[coach] Model ${modelName} returned ${status}, retrying in ${waitMs}ms (attempt ${attempt + 1}/${MAX_RETRIES})...`);
            await sleep(waitMs);
            continue;
          }

          // リトライ上限到達 or リトライ不要なエラー → 次のモデルへ
          console.warn(`[coach] Model ${modelName} failed (status: ${status}), falling back to next model...`, err.message);
          break;
        }
      }

      if (succeeded) break;
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
