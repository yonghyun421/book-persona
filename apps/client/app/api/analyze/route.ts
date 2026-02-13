import { GoogleGenAI } from "@google/genai"

export const runtime = "nodejs"

const systemPrompt = `너는 독서 페르소나 분석 전문가다.
입력된 설문 데이터를 바탕으로 다음 JSON 스키마를 정확히 만족하는 결과만 출력한다.
JSON 외 텍스트는 절대 포함하지 않는다.

스키마:
{
  "persona": { "name": string, "tagline": string, "keywords": string[] },
  "summary": [string, string, string],
  "profile": {
    "reading_style": { "label": string, "value": string, "score": number },
    "time_preference": { "label": string, "value": string, "score": number },
    "purpose": { "label": string, "value": string, "score": number }
  },
  "roadmap": [
    { "week": 1|2|3|4, "theme": string, "recommendation": string }
  ],
  "social_proof": { "similar_reader_keywords": string[] },
  "share_card": { "title": string, "subtitle": string, "keywords": string[], "cta": string }
}
`

type AnalyzeInput = {
  genres: string[]
  book_keywords: string[]
  time: string
  style: string
  purpose: string
  selection: string
  place: string
  frequency: string
}

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return new Response("Missing GEMINI_API_KEY", { status: 500 })
  }

  const input = (await req.json()) as AnalyzeInput

  const userPrompt = `설문 응답 데이터:\n- 선호 장르: ${input.genres.join(", ")}\n- 인상 깊은 책 키워드: ${input.book_keywords.join(", ")}\n- 읽는 시간대: ${input.time}\n- 읽는 방식: ${input.style}\n- 독서 목적: ${input.purpose}\n- 선택 기준: ${input.selection}\n- 독서 장소: ${input.place}\n- 독서 빈도: ${input.frequency}`

  const ai = new GoogleGenAI({ apiKey })

  const response = await ai.models.generateContentStream({
    model: "gemini-2.5-flash",
    contents: [
      {
        role: "user",
        parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }]
      }
    ],
    config: {
      temperature: 0.8
    }
  })

  const encoder = new TextEncoder()

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const chunk of response) {
          const text = chunk.text ?? ""
          if (text) controller.enqueue(encoder.encode(text))
        }
      } catch (error) {
        controller.error(error)
      } finally {
        controller.close()
      }
    }
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store"
    }
  })
}
