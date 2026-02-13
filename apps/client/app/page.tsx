export default function HomePage() {
  return (
    <main>
      <div className="mx-auto max-w-6xl px-6 pb-24 pt-16">
        <section className="grid gap-10 md:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-center">
          <div>
            <div className="text-xs uppercase tracking-[0.4em] text-muted">Reading Persona Test</div>
            <h1 className="mt-3 text-[clamp(2.25rem,6vw,4.5rem)] font-semibold leading-[0.95] -tracking-[0.02em]">
              나만의 독서 페르소나
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-muted">
              질문 8개로 독서 습관과 취향을 분석해 나만의 캐릭터 카드와
              4주 로드맵을 생성합니다.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href="/survey"
                className="rounded-full border border-ink bg-ink px-6 py-3 text-sm font-semibold text-white"
              >
                테스트 시작
              </a>
              <a
                href="/result"
                className="rounded-full border border-ink px-6 py-3 text-sm font-semibold text-ink"
              >
                샘플 결과 보기
              </a>
            </div>
          </div>
          <div className="rounded-3xl border border-line bg-card p-8 shadow-soft">
            <div className="text-xs uppercase tracking-[0.3em] text-muted">Live Insight</div>
            <h3 className="mt-3 text-xl font-semibold">
              지금까지 3,452명이 참여했습니다
            </h3>
            <p className="mt-4 text-sm text-muted">
              결과는 카드 형태로 즉시 공유 가능합니다.
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
