"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"

const genreOptions = [
  "소설",
  "에세이",
  "인문/철학",
  "과학/기술",
  "역사",
  "자기계발",
  "판타지/장르",
  "경제/비즈니스",
  "기타"
]

const timeOptions = ["아침", "낮", "저녁", "밤", "일정할 때만"]
const styleOptions = ["몰아읽기", "조금씩 꾸준히", "필요할 때만", "오디오/전자 위주", "종이책 위주"]
const purposeOptions = ["휴식", "지식/교양", "자기성찰", "업무/성장", "영감/창작"]
const selectionOptions = ["추천", "표지/디자인", "리뷰/평점", "작가", "주제/키워드"]
const placeOptions = ["집", "카페", "출퇴근/이동 중", "도서관", "어디서나"]
const frequencyOptions = ["주 1권 이상", "월 1~2권", "분기 1~2권", "가끔", "거의 안 읽음"]

export default function SurveyPage() {
  const router = useRouter()
  const [genres, setGenres] = useState<string[]>([])
  const [bookKeywords, setBookKeywords] = useState("")
  const [time, setTime] = useState("")
  const [style, setStyle] = useState("")
  const [purpose, setPurpose] = useState("")
  const [selection, setSelection] = useState("")
  const [place, setPlace] = useState("")
  const [frequency, setFrequency] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [streamingText, setStreamingText] = useState("")
  const [charCount, setCharCount] = useState(0)
  const [statusLabel, setStatusLabel] = useState("대기 중")
  const [error, setError] = useState<string | null>(null)
  const [canRetry, setCanRetry] = useState(false)

  function resetForm() {
    setGenres([])
    setBookKeywords("")
    setTime("")
    setStyle("")
    setPurpose("")
    setSelection("")
    setPlace("")
    setFrequency("")
    setStreamingText("")
    setCharCount(0)
    setStatusLabel("대기 중")
    setError(null)
    setCanRetry(false)
  }

  const canSubmit = useMemo(() => {
    return (
      genres.length > 0 &&
      bookKeywords.trim().length > 0 &&
      time &&
      style &&
      purpose &&
      selection &&
      place &&
      frequency
    )
  }, [genres, bookKeywords, time, style, purpose, selection, place, frequency])

  function toggleGenre(option: string) {
    setGenres((prev) => (prev.includes(option) ? prev.filter((g) => g !== option) : [...prev, option]))
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!canSubmit || isSubmitting) return

    setIsSubmitting(true)
    setError(null)
    setStreamingText("")
    setCharCount(0)
    setStatusLabel("분석 중")
    setCanRetry(false)

    const payload = {
      genres,
      book_keywords: bookKeywords.split(",").map((item) => item.trim()).filter(Boolean),
      time,
      style,
      purpose,
      selection,
      place,
      frequency
    }

    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      if (!res.ok || !res.body) {
        throw new Error("AI 분석 요청에 실패했습니다.")
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let resultText = ""

      while (true) {
        const { value, done } = await reader.read()
        if (done) break
        resultText += decoder.decode(value, { stream: true })
        setStreamingText(resultText)
        setCharCount(resultText.length)
      }

      let parsed: unknown
      try {
        parsed = JSON.parse(resultText)
      } catch {
        throw new Error("결과 파싱에 실패했습니다. 다시 시도해주세요.")
      }

      localStorage.setItem("personaResult", JSON.stringify(parsed))
      localStorage.setItem(
        "personaMeta",
        JSON.stringify({ genres, bookKeywords: payload.book_keywords })
      )
      setStatusLabel("완료")
      router.push("/result")
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.")
      setStatusLabel("오류")
      setCanRetry(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main>
      <div className="mx-auto max-w-5xl px-6 pb-24 pt-16">
        <div className="text-xs uppercase tracking-[0.35em] text-muted">Survey</div>
        <h1 className="mt-3 text-3xl font-semibold">나만의 독서 페르소나 테스트</h1>
        <p className="mt-3 max-w-xl text-sm text-muted">
          모든 항목을 선택하면 바로 AI 분석이 시작됩니다.
        </p>

        <form className="mt-10 space-y-8" onSubmit={handleSubmit}>
          <section className="rounded-3xl border border-line bg-card p-6 shadow-soft">
            <h2 className="text-lg font-semibold">1. 선호 장르</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {genreOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => toggleGenre(option)}
                  className={`rounded-full border px-4 py-2 text-sm ${
                    genres.includes(option)
                      ? "border-ink bg-ink text-white"
                      : "border-line bg-[#f6f1ea] text-ink"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-line bg-card p-6 shadow-soft">
            <h2 className="text-lg font-semibold">2. 최근 인상 깊었던 책 키워드</h2>
            <p className="mt-1 text-xs text-muted">쉼표로 구분해서 입력해주세요. 예: 고독, 성장, 데이터</p>
            <input
              value={bookKeywords}
              onChange={(event) => setBookKeywords(event.target.value)}
              className="mt-3 w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm"
              placeholder="고독, 성장, 데이터"
            />
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-line bg-card p-6 shadow-soft">
              <h2 className="text-lg font-semibold">3. 읽는 시간대</h2>
              <div className="mt-4 space-y-2">
                {timeOptions.map((option) => (
                  <label key={option} className="flex items-center gap-3 text-sm">
                    <input
                      type="radio"
                      name="time"
                      value={option}
                      checked={time === option}
                      onChange={() => setTime(option)}
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-line bg-card p-6 shadow-soft">
              <h2 className="text-lg font-semibold">4. 읽는 방식</h2>
              <div className="mt-4 space-y-2">
                {styleOptions.map((option) => (
                  <label key={option} className="flex items-center gap-3 text-sm">
                    <input
                      type="radio"
                      name="style"
                      value={option}
                      checked={style === option}
                      onChange={() => setStyle(option)}
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-line bg-card p-6 shadow-soft">
              <h2 className="text-lg font-semibold">5. 독서 목적</h2>
              <div className="mt-4 space-y-2">
                {purposeOptions.map((option) => (
                  <label key={option} className="flex items-center gap-3 text-sm">
                    <input
                      type="radio"
                      name="purpose"
                      value={option}
                      checked={purpose === option}
                      onChange={() => setPurpose(option)}
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-line bg-card p-6 shadow-soft">
              <h2 className="text-lg font-semibold">6. 책 선택 기준</h2>
              <div className="mt-4 space-y-2">
                {selectionOptions.map((option) => (
                  <label key={option} className="flex items-center gap-3 text-sm">
                    <input
                      type="radio"
                      name="selection"
                      value={option}
                      checked={selection === option}
                      onChange={() => setSelection(option)}
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-line bg-card p-6 shadow-soft">
              <h2 className="text-lg font-semibold">7. 독서 장소</h2>
              <div className="mt-4 space-y-2">
                {placeOptions.map((option) => (
                  <label key={option} className="flex items-center gap-3 text-sm">
                    <input
                      type="radio"
                      name="place"
                      value={option}
                      checked={place === option}
                      onChange={() => setPlace(option)}
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-line bg-card p-6 shadow-soft">
              <h2 className="text-lg font-semibold">8. 독서 빈도</h2>
              <div className="mt-4 space-y-2">
                {frequencyOptions.map((option) => (
                  <label key={option} className="flex items-center gap-3 text-sm">
                    <input
                      type="radio"
                      name="frequency"
                      value={option}
                      checked={frequency === option}
                      onChange={() => setFrequency(option)}
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>
          </section>

          <div className="rounded-3xl border border-line bg-card p-6 shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold">AI 분석 결과</div>
                <div className="text-xs text-muted">
                  제출하면 실시간으로 분석이 진행됩니다.
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className="rounded-full border border-ink px-5 py-3 text-sm font-semibold text-ink"
                  onClick={resetForm}
                  disabled={isSubmitting}
                >
                  설문 초기화
                </button>
                <button
                  type="submit"
                  className="rounded-full border border-ink bg-ink px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={!canSubmit || isSubmitting}
                >
                  {isSubmitting ? "분석 중..." : "분석 시작"}
                </button>
              </div>
            </div>
            <div className="mt-4">
              <div className="mb-3 flex items-center gap-3 text-xs text-muted">
                <div className="h-2 flex-1 rounded-full bg-[#efe8dd] shimmer-bar">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-accent to-accent2 transition-all"
                    style={{ width: `${Math.min(100, 20 + charCount / 8)}%` }}
                  />
                </div>
                <span>{statusLabel}</span>
              </div>
              <div className="min-h-[110px] rounded-2xl border border-line bg-white px-4 py-3 text-xs text-muted">
                {error ? (
                  error
                ) : streamingText ? (
                  <span>
                    {streamingText}
                    <span className="typing-cursor" />
                  </span>
                ) : (
                  "결과가 여기에 스트리밍됩니다."
                )}
              </div>
              {canRetry ? (
                <div className="mt-3">
                  <button
                    type="button"
                    className="rounded-full border border-ink px-5 py-2 text-xs font-semibold text-ink"
                    onClick={handleSubmit}
                  >
                    다시 시도
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </form>
      </div>
    </main>
  )
}
