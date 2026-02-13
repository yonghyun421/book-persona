"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { PersonaResult } from "@/lib/persona"
import { mockPersonaResult } from "@/lib/persona"
import { ShareCard } from "@/ui/index"

export default function ResultView() {
  const router = useRouter()
  const [data, setData] = useState<PersonaResult | null>(null)
  const [genres, setGenres] = useState<string[]>([])
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadError, setDownloadError] = useState<string | null>(null)
  const [downloadStatus, setDownloadStatus] = useState<"idle" | "background" | "card">("idle")
  const [shareStatus, setShareStatus] = useState<"idle" | "copied" | "error">("idle")
  const [backgroundCache, setBackgroundCache] = useState<string | null>(null)
  const [isBackgroundLoading, setIsBackgroundLoading] = useState(false)
  const [useBackground, setUseBackground] = useState(true)
  const [ratio, setRatio] = useState<"1:1" | "4:5" | "9:16">("1:1")

  useEffect(() => {
    const stored = localStorage.getItem("personaResult")
    const meta = localStorage.getItem("personaMeta")
    if (!stored) {
      setData(mockPersonaResult)
      return
    }

    try {
      setData(JSON.parse(stored) as PersonaResult)
      if (meta) {
        const parsed = JSON.parse(meta) as { genres?: string[] }
        setGenres(parsed.genres ?? [])
      }
      const cachedBackground = localStorage.getItem("personaBackground")
      if (cachedBackground) {
        setBackgroundCache(cachedBackground)
      }
      const storedRatio = localStorage.getItem("personaCardRatio")
      if (storedRatio === "1:1" || storedRatio === "4:5" || storedRatio === "9:16") {
        setRatio(storedRatio)
      }
      const storedUseBackground = localStorage.getItem("personaUseBackground")
      if (storedUseBackground === "true" || storedUseBackground === "false") {
        setUseBackground(storedUseBackground === "true")
      }
    } catch {
      setData(mockPersonaResult)
      setGenres([])
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("personaCardRatio", ratio)
  }, [ratio])

  useEffect(() => {
    localStorage.setItem("personaUseBackground", String(useBackground))
  }, [useBackground])

  useEffect(() => {
    if (!data || backgroundCache || isBackgroundLoading) return

    const fetchBackground = async () => {
      setIsBackgroundLoading(true)
      try {
        const bgRes = await fetch("/api/background", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: data.persona.name,
            keywords: data.persona.keywords,
            mood: data.persona.tagline,
            genres
          })
        })

        if (bgRes.ok) {
          const bgJson = (await bgRes.json()) as { dataUrl?: string }
          if (bgJson.dataUrl) {
            setBackgroundCache(bgJson.dataUrl)
            localStorage.setItem("personaBackground", bgJson.dataUrl)
          }
        }
      } finally {
        setIsBackgroundLoading(false)
      }
    }

    fetchBackground()
  }, [data, backgroundCache, genres, isBackgroundLoading])

  if (!data) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-24">
        <div className="rounded-3xl border border-line bg-card p-6 shadow-soft">
          <div className="text-sm text-muted">결과를 불러오는 중...</div>
        </div>
      </div>
    )
  }

  async function handleDownload() {
    if (!data || isDownloading) return
    setIsDownloading(true)
    setDownloadError(null)
    setDownloadStatus("background")

    try {
      let backgroundDataUrl: string | undefined

      const bgPayload = {
        title: data.persona.name,
        keywords: data.persona.keywords,
        mood: data.persona.tagline,
        genres
      }

      try {
        const bgRes = await fetch("/api/background", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bgPayload)
        })

        if (bgRes.ok) {
          const bgJson = (await bgRes.json()) as { dataUrl?: string }
          backgroundDataUrl = bgJson.dataUrl
          if (backgroundDataUrl) setBackgroundCache(backgroundDataUrl)
        } else {
          const retryRes = await fetch("/api/background", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(bgPayload)
          })

          if (retryRes.ok) {
            const retryJson = (await retryRes.json()) as { dataUrl?: string }
            backgroundDataUrl = retryJson.dataUrl
            if (backgroundDataUrl) setBackgroundCache(backgroundDataUrl)
          } else {
            setDownloadError("배경 생성에 실패했습니다. 기본 카드로 생성합니다.")
          }
        }
      } catch {
        setDownloadError("배경 생성에 실패했습니다. 기본 카드로 생성합니다.")
      }

      setDownloadStatus("card")
      const res = await fetch("/api/share-card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.share_card.title,
          subtitle: data.share_card.subtitle,
          keywords: data.share_card.keywords,
          cta: data.share_card.cta,
          brandLabel: "READING PERSONA",
          backgroundDataUrl,
          genres,
          ratio
        })
      })

      if (!res.ok) {
        throw new Error("이미지 생성에 실패했습니다.")
      }

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = "reading-persona-card.png"
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
    } catch (err) {
      setDownloadError(err instanceof Error ? err.message : "다운로드 오류가 발생했습니다.")
    } finally {
      setIsDownloading(false)
      setDownloadStatus("idle")
    }
  }

  function handleReset() {
    localStorage.removeItem("personaResult")
    localStorage.removeItem("personaMeta")
    router.push("/survey")
  }

  async function handleCopyLink() {
    if (!data) return
    try {
      const baseUrl = window.location.origin
      let backgroundDataUrl = backgroundCache

      if (!backgroundDataUrl) {
        const bgRes = await fetch("/api/background", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: data.persona.name,
            keywords: data.persona.keywords,
            mood: data.persona.tagline,
            genres
          })
        })

        if (bgRes.ok) {
          const bgJson = (await bgRes.json()) as { dataUrl?: string }
          backgroundDataUrl = bgJson.dataUrl ?? null
          if (backgroundDataUrl) {
            setBackgroundCache(backgroundDataUrl)
            localStorage.setItem("personaBackground", backgroundDataUrl)
          }
        }
      }

      const shareRes = await fetch("/api/share", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.share_card.title,
          subtitle: data.share_card.subtitle,
          keywords: data.share_card.keywords,
          genres,
          backgroundDataUrl,
          ratio
        })
      })

      if (!shareRes.ok) {
        throw new Error("공유 링크 생성에 실패했습니다.")
      }

      const json = (await shareRes.json()) as { id: string }
      const url = `${baseUrl}/share/${json.id}`
      await navigator.clipboard.writeText(url)
      setShareStatus("copied")
      setTimeout(() => setShareStatus("idle"), 2000)
    } catch {
      setShareStatus("error")
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-16">
      <section className="mb-12">
        <div className="text-xs uppercase tracking-[0.35em] text-muted">Your Reading Persona</div>
        <div className="relative mt-4 overflow-hidden rounded-[28px] bg-gradient-to-br from-[#0d0f15] to-[#1c2030] p-7 text-white shadow-hero">
          <div className="text-xs tracking-[0.3em]">READING PERSONA</div>
          <h1 className="mt-4 text-3xl font-semibold">{data.persona.name}</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-white/80">{data.persona.tagline}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {data.persona.keywords.map((keyword) => (
              <span
                key={keyword}
                className="rounded-full bg-white/20 px-3 py-1 text-xs"
              >
                {keyword}
              </span>
            ))}
          </div>
          <div className="pointer-events-none absolute -bottom-28 -right-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(255,92,56,0.35),transparent_70%)] blur-lg" />
        </div>
      </section>

      <section className="mb-12">
        <div className="text-xs uppercase tracking-[0.35em] text-muted">당신의 독서 성향 요약</div>
        <div className="mt-4 rounded-3xl border border-line bg-card p-6 shadow-soft">
          <ul className="list-disc space-y-2 pl-5">
            {data.summary.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mb-12">
        <div className="text-xs uppercase tracking-[0.35em] text-muted">독서 습관 프로필</div>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {Object.values(data.profile).map((item) => (
            <div key={item.label} className="rounded-3xl border border-line bg-[#fffdf9] p-5">
              <div className="text-xs text-muted">{item.label}</div>
              <div className="mt-2 text-xl font-semibold">{item.value}</div>
              <div className="mt-4 h-2 rounded-full bg-[#efe8dd]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-accent to-accent2"
                  style={{ width: `${item.score}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <div className="text-xs uppercase tracking-[0.35em] text-muted">4주 추천 로드맵</div>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {data.roadmap.map((item) => (
            <div key={item.week} className="rounded-3xl border border-line bg-card p-5 shadow-soft">
              <div className="text-xs text-muted">Week {item.week}</div>
              <div className="mt-2 text-lg font-semibold">{item.theme}</div>
              <div className="mt-2 text-sm text-muted">{item.recommendation}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <div className="text-xs uppercase tracking-[0.35em] text-muted">비슷한 독자들이 고른 키워드</div>
        <div className="mt-4 flex flex-wrap gap-2">
          {data.social_proof.similar_reader_keywords.map((keyword) => (
            <span key={keyword} className="rounded-full bg-[#f2eee8] px-4 py-2 text-xs">
              {keyword}
            </span>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <div className="text-xs uppercase tracking-[0.35em] text-muted">공유 카드</div>
        <div className="mt-4 rounded-3xl border border-line bg-card p-6 shadow-soft">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-sm font-semibold">실시간 카드 미리보기</div>
              <div className="text-xs text-muted">배경 생성 결과가 바로 반영됩니다.</div>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
              <div className="flex rounded-full border border-line bg-white p-1">
                {(["1:1", "4:5", "9:16"] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setRatio(option)}
                    className={`rounded-full px-3 py-1 text-[11px] ${
                      ratio === option ? "bg-ink text-white" : "text-muted"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={useBackground}
                  onChange={(event) => setUseBackground(event.target.checked)}
                />
                AI 배경 사용
              </label>
            </div>
          </div>
          <div className="mt-4">
            <div className="relative overflow-hidden rounded-3xl border border-line bg-[#0d0f15]">
              <div
                className={`origin-top-left ${
                  ratio === "1:1"
                    ? "scale-[0.6]"
                    : ratio === "4:5"
                      ? "scale-[0.55]"
                      : "scale-[0.5]"
                }`}
              >
                <ShareCard
                  title={data.share_card.title}
                  subtitle={data.share_card.subtitle}
                  keywords={data.share_card.keywords}
                  cta={data.share_card.cta}
                  backgroundImage={useBackground ? backgroundCache ?? undefined : undefined}
                  ratio={ratio}
                />
              </div>
              {isBackgroundLoading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-xs text-white">
                  배경 이미지 생성 중...
                </div>
              ) : null}
            </div>
            <div className="mt-3 flex items-center gap-3 text-xs text-muted">
              <div className="h-2 flex-1 rounded-full bg-[#efe8dd] shimmer-bar">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-accent to-accent2 transition-all"
                  style={{ width: `${backgroundCache ? 100 : isBackgroundLoading ? 60 : 10}%` }}
                />
              </div>
              <span>{isBackgroundLoading ? "이미지 생성 중" : "대기"}</span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-start gap-6">
          <div className="origin-top-left scale-[0.38]">
            <ShareCard
              title={data.share_card.title}
              subtitle={data.share_card.subtitle}
              keywords={data.share_card.keywords}
              cta={data.share_card.cta}
              backgroundImage={useBackground ? backgroundCache ?? undefined : undefined}
            />
          </div>
          <div>
            {genres.length ? (
              <div className="mb-2 flex flex-wrap gap-2">
                {genres.slice(0, 3).map((genre) => (
                  <span
                    key={genre}
                    className="rounded-full border border-line bg-white px-3 py-1 text-xs text-muted"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            ) : null}
            <div className="flex flex-wrap gap-2">
              <button
                className="inline-flex rounded-full border border-ink bg-ink px-6 py-3 text-sm font-semibold text-white disabled:opacity-50"
                onClick={handleDownload}
                disabled={isDownloading}
              >
                {isDownloading
                  ? downloadStatus === "background"
                    ? "배경 생성 중..."
                    : "카드 생성 중..."
                  : "카드 다운로드"}
              </button>
              <button
                className="inline-flex rounded-full border border-ink px-5 py-3 text-sm font-semibold text-ink"
                onClick={handleCopyLink}
              >
                {shareStatus === "copied"
                  ? "링크 복사됨"
                  : shareStatus === "error"
                    ? "복사 실패"
                    : "공유 링크 복사"}
              </button>
            </div>
            <div className="mt-2 text-sm text-muted">
              {isBackgroundLoading
                ? "배경 이미지를 준비 중입니다."
                : "인스타/트위터용 이미지를 생성합니다."}
            </div>
            {downloadError ? (
              <div className="mt-2 text-xs text-red-500">{downloadError}</div>
            ) : null}
            <button
              className="mt-4 inline-flex rounded-full border border-line px-5 py-2 text-xs font-semibold text-muted"
              onClick={handleReset}
            >
              설문 다시하기
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
