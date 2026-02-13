import { GoogleGenAI } from "@google/genai"

export const runtime = "nodejs"

type BackgroundInput = {
  title?: string
  keywords?: string[]
  mood?: string
  genres?: string[]
  bookKeywords?: string[]
}

export async function POST(req: Request) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return new Response("Missing GEMINI_API_KEY", { status: 500 })
  }

  let input: BackgroundInput
  try {
    input = (await req.json()) as BackgroundInput
  } catch {
    return new Response("Invalid JSON body", { status: 400 })
  }

  const genreHints: Record<string, string> = {
    "소설": "moody literary atmosphere, soft grain, subtle shadows",
    "에세이": "warm minimalism, paper texture, calm daylight",
    "인문/철학": "architectural forms, high contrast, contemplative tone",
    "과학/기술": "futuristic geometry, cool neon glow, clean lines",
    "역사": "vintage palette, film grain, aged paper texture",
    "자기계발": "bright optimistic gradient, crisp light, uplifting mood",
    "판타지/장르": "dreamy haze, mystical colors, ethereal light",
    "경제/비즈니스": "sleek metallic tones, structured grids, professional polish",
    "기타": "experimental abstract collage, bold color blocks"
  }

  const paletteHints: Record<string, string> = {
    "소설": "deep navy, muted burgundy, warm amber highlights",
    "에세이": "soft beige, warm cream, gentle peach",
    "인문/철학": "charcoal, ivory, stone gray",
    "과학/기술": "electric blue, cyan, graphite black",
    "역사": "sepia, dusty olive, parchment gold",
    "자기계발": "sunlit yellow, coral, clean white",
    "판타지/장르": "violet haze, midnight blue, iridescent teal",
    "경제/비즈니스": "steel blue, slate, silver accents",
    "기타": "bold red, cobalt, off-white"
  }

  const genrePrompt = (input.genres ?? [])
    .map((genre) => genreHints[genre])
    .filter(Boolean)
    .join("; ")

  const palettePrompt = (input.genres ?? [])
    .map((genre) => paletteHints[genre])
    .filter(Boolean)
    .join("; ")

  const primaryPrompt = `Create an abstract, editorial-style background image for a reading persona card.
No text, no logos, no faces. Use cinematic lighting and soft gradients.
Style cues: ${genrePrompt || "balanced modern editorial aesthetic"}.
Color palette: ${palettePrompt || "balanced warm-neutral palette"}.
Vibe keywords: ${[input.title, ...(input.keywords ?? []), input.mood].filter(Boolean).join(", ")}.
Reading motifs: ${(input.bookKeywords ?? []).join(", ") || "literary texture, quiet rhythm, paper and ink mood"}`

  const ai = new GoogleGenAI({ apiKey })
  const primaryModel = process.env.GEMINI_IMAGE_MODEL ?? "gemini-2.5-flash-image"
  const fallbackModels = ["gemini-3-pro-image-preview"]

  async function generateImage(prompt: string, model: string) {
    const response = await ai.models.generateContent({
      model,
      contents: [{ role: "user", parts: [{ text: prompt }] }]
    })

    const parts = response.candidates?.[0]?.content?.parts ?? []
    const inline = parts.find((part) => part.inlineData?.data)

    if (!inline?.inlineData?.data || !inline.inlineData.mimeType) {
      return null
    }

    return {
      dataUrl: `data:${inline.inlineData.mimeType};base64,${inline.inlineData.data}`,
      mimeType: inline.inlineData.mimeType
    }
  }

  try {
    const primary = await generateImage(primaryPrompt, primaryModel)
    if (primary) {
      return Response.json(primary)
    }

    const fallbackPrompt = `Create a minimalist abstract background for a reading persona card.
No text, no logos, no faces. Soft gradients, subtle grain, gentle lighting.
Keep it calm and atmospheric, avoid busy details.`

    for (const model of fallbackModels) {
      const fallback = await generateImage(fallbackPrompt, model)
      if (fallback) {
        return Response.json(fallback)
      }
    }

    return new Response("No image returned", { status: 500 })
  } catch (error) {
    console.error("Background generation failed:", error)
    const message = error instanceof Error ? error.message : "Unknown error"
    return new Response(`Background generation failed: ${message}`, { status: 500 })
  }
}
