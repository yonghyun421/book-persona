import { ImageResponse } from "next/og"

export const runtime = "edge"

const defaultPayload = {
  title: "문학적 야행성 탐구가",
  subtitle: "밤에 몰입하며 깊이 파고드는 감성 분석형 독자",
  keywords: ["몰입", "밤", "서사"],
  cta: "나만의 독서 페르소나 테스트",
  brandLabel: "READING PERSONA"
}

type ShareCardPayload = {
  title: string
  subtitle: string
  keywords: string[]
  cta: string
  brandLabel?: string
  backgroundDataUrl?: string
  genres?: string[]
  ratio?: "1:1" | "4:5" | "9:16"
  format?: "png" | "jpeg"
  scale?: 1 | 2
}

export async function POST(req: Request) {
  let payload: ShareCardPayload = defaultPayload

  try {
    const body = (await req.json()) as Partial<ShareCardPayload>
    payload = {
      ...defaultPayload,
      ...body,
      keywords: body.keywords?.length ? body.keywords : defaultPayload.keywords
    }
  } catch {
    payload = defaultPayload
  }

  const ratio = payload.ratio ?? "1:1"
  const scale = payload.scale ?? 1
  const format = payload.format ?? "png"
  const size =
    ratio === "1:1"
      ? { width: 960, height: 960 }
      : ratio === "4:5"
        ? { width: 960, height: 1200 }
        : { width: 900, height: 1600 }

  const responseOptions: Record<string, unknown> = {
    width: size.width * scale,
    height: size.height * scale,
    headers: { "Content-Type": format === "jpeg" ? "image/jpeg" : "image/png" }
  }
  if (format === "jpeg") {
    responseOptions.format = "jpeg"
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: size.width,
          height: size.height,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          color: "white",
          background: "linear-gradient(135deg, #0b0d12, #1d2233)",
          borderRadius: 48,
          boxSizing: "border-box",
          position: "relative",
          overflow: "hidden"
        }}
      >
        {payload.backgroundDataUrl ? (
          <img
            src={payload.backgroundDataUrl}
            alt=""
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.9
            }}
          />
        ) : null}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(13,15,21,0.75) 0%, rgba(13,15,21,0.9) 60%)"
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 1,
            padding: 64,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%"
          }}
        >
          <div style={{ fontSize: 16, letterSpacing: 4 }}>{payload.brandLabel}</div>
          <div>
            <div style={{ fontSize: 64, fontWeight: 600, marginBottom: 16 }}>{payload.title}</div>
            <div style={{ fontSize: 26, lineHeight: 1.5, maxWidth: 720, opacity: 0.92 }}>
              {payload.subtitle}
            </div>
            {payload.genres?.length ? (
              <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
                {payload.genres.slice(0, 3).map((genre) => (
                  <span
                    key={genre}
                    style={{
                      padding: "6px 12px",
                      borderRadius: 999,
                      background: "rgba(255,255,255,0.15)",
                      fontSize: 14
                    }}
                  >
                    {genre}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
          <div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
              {payload.keywords.map((keyword) => (
                <span
                  key={keyword}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.15)",
                    fontSize: 18
                  }}
                >
                  {keyword}
                </span>
              ))}
            </div>
            <div style={{ fontSize: 18, opacity: 0.9 }}>{payload.cta}</div>
          </div>
        </div>
      </div>
    ),
    responseOptions as { width: number; height: number }
  )
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const id = url.searchParams.get("id")

  if (id) {
    const origin = url.origin
    const shareRes = await fetch(`${origin}/api/share?id=${id}`, { cache: "no-store" })
    if (shareRes.ok) {
      const share = (await shareRes.json()) as {
        title: string
        subtitle: string
        keywords: string[]
        genres?: string[]
        backgroundDataUrl?: string
        ratio?: "1:1" | "4:5" | "9:16"
      }

      const ratio = share.ratio ?? "1:1"
      const size =
        ratio === "1:1"
          ? { width: 960, height: 960 }
          : ratio === "4:5"
            ? { width: 960, height: 1200 }
            : { width: 900, height: 1600 }

      return new ImageResponse(
        (
          <div
            style={{
              width: size.width,
              height: size.height,
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              color: "white",
              background: "linear-gradient(135deg, #0b0d12, #1d2233)",
              borderRadius: 48,
              boxSizing: "border-box",
              position: "relative",
              overflow: "hidden"
            }}
          >
            {share.backgroundDataUrl ? (
              <img
                src={share.backgroundDataUrl}
                alt=""
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  opacity: 0.9
                }}
              />
            ) : null}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "linear-gradient(180deg, rgba(13,15,21,0.75) 0%, rgba(13,15,21,0.9) 60%)"
              }}
            />
            <div
              style={{
                position: "relative",
                zIndex: 1,
                padding: 64,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "100%"
              }}
            >
              <div style={{ fontSize: 16, letterSpacing: 4 }}>READING PERSONA</div>
              <div>
                <div style={{ fontSize: 64, fontWeight: 600, marginBottom: 16 }}>{share.title}</div>
                <div style={{ fontSize: 26, lineHeight: 1.5, maxWidth: 720, opacity: 0.92 }}>
                  {share.subtitle}
                </div>
                {share.genres?.length ? (
                  <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
                    {share.genres.slice(0, 3).map((genre) => (
                      <span
                        key={genre}
                        style={{
                          padding: "6px 12px",
                          borderRadius: 999,
                          background: "rgba(255,255,255,0.15)",
                          fontSize: 14
                        }}
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
              <div>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
                  {share.keywords.slice(0, 3).map((keyword) => (
                    <span
                      key={keyword}
                      style={{
                        padding: "8px 14px",
                        borderRadius: 999,
                        background: "rgba(255,255,255,0.15)",
                        fontSize: 18
                      }}
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
                <div style={{ fontSize: 18, opacity: 0.9 }}>나만의 독서 페르소나 테스트</div>
              </div>
            </div>
          </div>
        ),
        {
          width: size.width,
          height: size.height
        }
      )
    }
  }

  const title = url.searchParams.get("title") || defaultPayload.title
  const subtitle = url.searchParams.get("subtitle") || defaultPayload.subtitle
  const keywordsParam = url.searchParams.get("keywords")
  const keywords = keywordsParam
    ? keywordsParam.split(",").map((item) => item.trim()).filter(Boolean)
    : defaultPayload.keywords

  const ratio = (url.searchParams.get("ratio") as "1:1" | "4:5" | "9:16") || "1:1"
  const size =
    ratio === "1:1"
      ? { width: 960, height: 960 }
      : ratio === "4:5"
        ? { width: 960, height: 1200 }
        : { width: 900, height: 1600 }

  return new ImageResponse(
    (
      <div
        style={{
          width: size.width,
          height: size.height,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          color: "white",
          background: "linear-gradient(135deg, #0b0d12, #1d2233)",
          borderRadius: 48,
          boxSizing: "border-box",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(13,15,21,0.75) 0%, rgba(13,15,21,0.9) 60%)"
          }}
        />
        <div
          style={{
            position: "relative",
            zIndex: 1,
            padding: 64,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%"
          }}
        >
          <div style={{ fontSize: 16, letterSpacing: 4 }}>{defaultPayload.brandLabel}</div>
          <div>
            <div style={{ fontSize: 64, fontWeight: 600, marginBottom: 16 }}>{title}</div>
            <div style={{ fontSize: 26, lineHeight: 1.5, maxWidth: 720, opacity: 0.92 }}>
              {subtitle}
            </div>
            <div style={{ marginTop: 12, display: "flex", gap: 10, flexWrap: "wrap" }}>
              {keywords.slice(0, 3).map((keyword) => (
                <span
                  key={keyword}
                  style={{
                    padding: "6px 12px",
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.15)",
                    fontSize: 14
                  }}
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
          <div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
              {defaultPayload.keywords.map((keyword) => (
                <span
                  key={keyword}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.15)",
                    fontSize: 18
                  }}
                >
                  {keyword}
                </span>
              ))}
            </div>
            <div style={{ fontSize: 18, opacity: 0.9 }}>{defaultPayload.cta}</div>
          </div>
        </div>
      </div>
    ),
    {
      width: size.width,
      height: size.height
    }
  )
}
