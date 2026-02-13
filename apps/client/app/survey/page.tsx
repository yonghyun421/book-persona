"use client"

import { useMemo, useState, useEffect } from "react"
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

const steps = [
  {
    id: "genres",
    title: "선호 장르",
    description: "중복 선택 가능",
    render: (state: SurveyState, setState: (next: Partial<SurveyState>) => void) => (
      <div className="mt-6 flex flex-wrap gap-2">
        {genreOptions.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() =>
              setState({
                genres: state.genres.includes(option)
                  ? state.genres.filter((g) => g !== option)
                  : [...state.genres, option]
              })
            }
            className={`rounded-full border px-4 py-2 text-sm transition ${
              state.genres.includes(option)
                ? "border-ink bg-ink text-white"
                : "border-line bg-white/70 text-ink hover:border-ink"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    ),
    isValid: (state: SurveyState) => state.genres.length > 0
  },
  {
    id: "bookKeywords",
    title: "최근 인상 깊었던 책 키워드",
    description: "쉼표로 구분해서 입력해주세요.",
    render: (state: SurveyState, setState: (next: Partial<SurveyState>) => void) => (
      <div className="mt-6">
        <input
          value={state.bookKeywords}
          onChange={(event) => setState({ bookKeywords: event.target.value })}
          className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm focus:border-ink focus:outline-none"
          placeholder="고독, 성장, 데이터"
        />
      </div>
    ),
    isValid: (state: SurveyState) => state.bookKeywords.trim().length > 0
  },
  {
    id: "time",
    title: "읽는 시간대",
    description: "가장 몰입이 잘 되는 시간",
    options: timeOptions,
    isValid: (state: SurveyState) => Boolean(state.time)
  },
  {
    id: "style",
    title: "읽는 방식",
    description: "당신의 독서 리듬",
    options: styleOptions,
    isValid: (state: SurveyState) => Boolean(state.style)
  },
  {
    id: "purpose",
    title: "독서 목적",
    description: "현재 가장 중요한 목적",
    options: purposeOptions,
    isValid: (state: SurveyState) => Boolean(state.purpose)
  },
  {
    id: "selection",
    title: "책 선택 기준",
    description: "구매/선택 시 중요 요소",
    options: selectionOptions,
    isValid: (state: SurveyState) => Boolean(state.selection)
  },
  {
    id: "place",
    title: "독서 장소",
    description: "가장 자주 읽는 공간",
    options: placeOptions,
    isValid: (state: SurveyState) => Boolean(state.place)
  },
  {
    id: "frequency",
    title: "독서 빈도",
    description: "평균적인 읽기 빈도",
    options: frequencyOptions,
    isValid: (state: SurveyState) => Boolean(state.frequency)
  }
]

type SurveyState = {
  genres: string[]
  bookKeywords: string
  time: string
  style: string
  purpose: string
  selection: string
  place: string
  frequency: string
}

const defaultState: SurveyState = {
  genres: [],
  bookKeywords: "",
  time: "",
  style: "",
  purpose: "",
  selection: "",
  place: "",
  frequency: ""
}

export default function SurveyPage() {
  const router = useRouter()
  const [state, setState] = useState<SurveyState>(defaultState)
  const [stepIndex, setStepIndex] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [statusLabel, setStatusLabel] = useState("대기 중")
  const [error, setError] = useState<string | null>(null)
  const [canRetry, setCanRetry] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useEffect(() => {
    const draft = localStorage.getItem("personaSurveyDraft")
    if (!draft) return
    try {
      const parsed = JSON.parse(draft) as { state: SurveyState; stepIndex: number }
      if (parsed.state) setState(parsed.state)
      if (typeof parsed.stepIndex === "number") setStepIndex(parsed.stepIndex)
    } catch {
      localStorage.removeItem("personaSurveyDraft")
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("personaSurveyDraft", JSON.stringify({ state, stepIndex }))
  }, [state, stepIndex])

  const step = steps[stepIndex]
  const isLastStep = stepIndex === steps.length - 1
  const isStepValid = step.isValid(state)

  const setPartialState = (next: Partial<SurveyState>) => {
    setState((prev) => ({ ...prev, ...next }))
  }

  const payload = useMemo(() => {
    return {
      genres: state.genres,
      book_keywords: state.bookKeywords.split(",").map((item) => item.trim()).filter(Boolean),
      time: state.time,
      style: state.style,
      purpose: state.purpose,
      selection: state.selection,
      place: state.place,
      frequency: state.frequency
    }
  }, [state])

  function extractJson(text: string) {
    const cleaned = text.replace(/```json|```/g, "").trim()
    const start = cleaned.indexOf("{")
    const end = cleaned.lastIndexOf("}")
    if (start === -1 || end === -1 || end <= start) return null
    return cleaned.slice(start, end + 1)
  }

  async function handleSubmit() {
    if (isSubmitting) return
    setIsSubmitting(true)
    setError(null)
    setIsAnalyzing(true)
    setStatusLabel("분석 중")
    setCanRetry(false)

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
      }

      let parsed: unknown
      try {
        const jsonText = extractJson(resultText)
        if (!jsonText) {
          throw new Error("JSON 형식을 찾을 수 없습니다.")
        }
        parsed = JSON.parse(jsonText)
      } catch {
        throw new Error("결과 파싱에 실패했습니다. 다시 시도해주세요.")
      }

      localStorage.setItem("personaResult", JSON.stringify(parsed))
      localStorage.setItem(
        "personaMeta",
        JSON.stringify({ genres: state.genres, bookKeywords: payload.book_keywords })
      )
      localStorage.removeItem("personaSurveyDraft")
      setStatusLabel("완료")
      router.push("/result")
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.")
      setStatusLabel("오류")
      setCanRetry(true)
    } finally {
      setIsSubmitting(false)
      setIsAnalyzing(false)
    }
  }

  function handleNext() {
    if (!isStepValid) return
    if (isLastStep) {
      void handleSubmit()
      return
    }
    setStepIndex((prev) => Math.min(prev + 1, steps.length - 1))
  }

  function handlePrev() {
    setStepIndex((prev) => Math.max(prev - 1, 0))
  }

  function resetForm() {
    setState(defaultState)
    setStepIndex(0)
    setStatusLabel("대기 중")
    setError(null)
    setCanRetry(false)
    localStorage.removeItem("personaSurveyDraft")
  }

  const summaryChips = useMemo(() => {
    const keywordChips = payload.book_keywords.slice(0, 3).map((item) => `#${item}`)
    return [
      ...state.genres,
      state.time,
      state.style,
      state.purpose,
      state.selection,
      state.place,
      state.frequency,
      ...keywordChips
    ].filter(Boolean)
  }, [payload.book_keywords, state])

  return (
    <main>
      <div className="mx-auto max-w-5xl px-6 pb-24 pt-16 page-enter">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-[0.35em] text-muted">Survey</div>
            <h1 className="mt-3 text-3xl font-semibold">심심할 때 해보는 독서 페르소나</h1>
            <p className="mt-3 max-w-xl text-sm text-muted">
              가볍게 8문항만 고르면, 당신의 독서 캐릭터가 바로 등장합니다.
            </p>
          </div>
          <div className="rounded-full border border-line bg-white px-4 py-2 text-xs text-muted">
            {stepIndex + 1} / {steps.length}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          {summaryChips.length ? (
            summaryChips.map((chip) => (
              <span key={chip} className="rounded-full border border-line bg-white px-3 py-1 text-[11px] text-muted">
                {chip}
              </span>
            ))
          ) : (
            <span className="text-xs text-muted">선택하면 여기 요약이 쌓여요.</span>
          )}
        </div>

        <div className="mt-8 rounded-3xl border border-line bg-card p-6 shadow-soft fun-card">
          <div className="mb-6 flex items-center gap-2">
            {steps.map((_, idx) => (
              <span
                key={idx}
                className={`h-2 w-10 rounded-full transition ${
                  idx <= stepIndex ? "bg-ink" : "bg-[#efe8dd]"
                }`}
              />
            ))}
          </div>
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-muted">
                Step {stepIndex + 1}
              </div>
              <h2 className="mt-2 text-xl font-semibold">{step.title}</h2>
              <p className="mt-2 text-sm text-muted">{step.description}</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                className="rounded-full border border-line px-4 py-2 text-xs font-semibold text-muted"
                onClick={resetForm}
                disabled={isSubmitting}
              >
                초기화
              </button>
            </div>
          </div>

          <div key={step.id} className="step-enter">
            {step.render ? (
              step.render(state, setPartialState)
            ) : (
              <div className="mt-6 grid gap-2">
                {(step.options ?? []).map((option) => (
                  <label
                    key={option}
                    className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm transition ${
                      state[step.id as keyof SurveyState] === option
                        ? "border-ink bg-ink text-white"
                        : "border-line bg-white/70 text-ink hover:border-ink"
                    }`}
                  >
                    <input
                      type="radio"
                      name={step.id}
                      value={option}
                      checked={state[step.id as keyof SurveyState] === option}
                      onChange={() => setPartialState({ [step.id]: option } as Partial<SurveyState>)}
                      className="hidden"
                    />
                    {option}
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              className="rounded-full border border-line px-5 py-3 text-sm font-semibold text-muted disabled:opacity-50"
              onClick={handlePrev}
              disabled={stepIndex === 0 || isSubmitting}
            >
              이전
            </button>
            <button
              type="button"
              className="rounded-full border border-ink bg-ink px-6 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
              onClick={handleNext}
              disabled={!isStepValid || isSubmitting}
            >
              {isLastStep ? "분석 시작" : "다음"}
            </button>
          </div>
        </div>

        {error ? (
          <div className="mt-8 rounded-3xl border border-red-200 bg-red-50 p-5 text-sm text-red-600">
            {error}
            {canRetry ? (
              <div className="mt-3">
                <button
                  type="button"
                  className="rounded-full border border-red-300 px-5 py-2 text-xs font-semibold text-red-600"
                  onClick={handleSubmit}
                >
                  다시 시도
                </button>
              </div>
            ) : null}
          </div>
        ) : null}

        {isAnalyzing ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6">
            <div className="w-full max-w-sm rounded-3xl border border-line bg-white p-8 text-center shadow-soft">
              <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-line border-t-ink" />
              <h3 className="mt-4 text-lg font-semibold">페르소나 분석 중...</h3>
              <p className="mt-2 text-sm text-muted">
                귀여운 캐릭터가 곧 등장할 거예요.
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  )
}
