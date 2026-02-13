"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { PersonaResult } from "@/lib/persona"
import { mockPersonaResult } from "@/lib/persona"
import {
  CharacterCard,
  pickCharacter,
  pickSimilarCharacters,
  pickProps
} from "@/components/character-card"

export default function ResultView() {
  const router = useRouter()
  const [data, setData] = useState<PersonaResult | null>(null)
  const [genres, setGenres] = useState<string[]>([])
  const [bookKeywords, setBookKeywords] = useState<string[]>([])

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
        const parsed = JSON.parse(meta) as { genres?: string[]; bookKeywords?: string[] }
        setGenres(parsed.genres ?? [])
        setBookKeywords(parsed.bookKeywords ?? [])
      }
    } catch {
      setData(mockPersonaResult)
      setGenres([])
      setBookKeywords([])
    }
  }, [])

  if (!data) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-24">
        <div className="rounded-3xl border border-line bg-card p-6 shadow-soft">
          <div className="text-sm text-muted">결과를 불러오는 중...</div>
        </div>
      </div>
    )
  }

  function handleReset() {
    localStorage.removeItem("personaResult")
    localStorage.removeItem("personaMeta")
    router.push("/survey")
  }

  const character = pickCharacter(data.persona.name)
  const similarCharacters = pickSimilarCharacters(data.persona.name, 3)
  const propList = pickProps(`${data.persona.name}:${data.profile.reading_style.value}`)

  const theme = (() => {
    const topGenre = genres[0] ?? ""
    const time = data.profile.time_preference.value
    if (topGenre.includes("판타지") || topGenre.includes("소설")) {
      return { bg: "#1b1f3b", accent: "#f4d35e", cheeks: "#ff9b85" }
    }
    if (topGenre.includes("에세이") || topGenre.includes("인문")) {
      return { bg: "#2d1f1a", accent: "#f2c57c", cheeks: "#f3a6a6" }
    }
    if (topGenre.includes("과학") || topGenre.includes("기술")) {
      return { bg: "#12233b", accent: "#4cc9f0", cheeks: "#f7b267" }
    }
    if (time.includes("밤")) {
      return { bg: "#141626", accent: "#ffd166", cheeks: "#ff9f9f" }
    }
    return { bg: "#1f2b24", accent: "#94d2bd", cheeks: "#ffb4a2" }
  })()

  return (
    <div className="mx-auto max-w-6xl px-6 pb-24 pt-16 page-enter">
      <section className="mb-12">
        <div className="text-xs uppercase tracking-[0.35em] text-muted">Your Reading Persona</div>
        <div className="mt-4 grid gap-6 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#0d0f15] to-[#1c2030] p-7 text-white shadow-hero">
            <div className="text-xs tracking-[0.3em]">READING PERSONA</div>
            <h1 className="mt-4 text-3xl font-semibold">{data.persona.name}</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-white/80">{data.persona.tagline}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="rounded-full bg-white/15 px-3 py-1 text-xs">📚 독서 타입</span>
              <span className="rounded-full bg-white/15 px-3 py-1 text-xs">✨ 몰입 점수 {data.profile.reading_style.score}</span>
              <span className="rounded-full bg-white/15 px-3 py-1 text-xs">🌙 선호 시간 {data.profile.time_preference.value}</span>
            </div>
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
          <div className="rounded-[28px] border border-line bg-white p-4 shadow-soft">
            <CharacterCard profile={character} themeOverride={theme} propsList={propList} />
          </div>
        </div>
        <div className="mt-6">
          <div className="text-xs uppercase tracking-[0.35em] text-muted">Similar Mascots</div>
          <div className="mt-3 grid gap-3 md:grid-cols-3">
            {similarCharacters.map((profile) => (
              <div key={profile.id} className="rounded-2xl border border-line bg-white p-3 text-sm">
                <div className="text-xs uppercase tracking-[0.2em] text-muted">#{profile.label}</div>
                <div className="mt-2 font-semibold">{profile.name}</div>
                <div className="mt-1 text-xs text-muted">{profile.vibe}</div>
              </div>
            ))}
          </div>
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
        <div className="text-xs uppercase tracking-[0.35em] text-muted">Next Step</div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            className="inline-flex rounded-full border border-ink bg-ink px-6 py-3 text-sm font-semibold text-white"
            onClick={handleReset}
          >
            다른 페르소나 테스트하기
          </button>
          <span className="text-sm text-muted">가볍게 다시 돌려도 재밌어요.</span>
        </div>
      </section>
    </div>
  )
}
