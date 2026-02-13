export default function SharePage({
  searchParams: _searchParams
}: {
  searchParams: Record<string, string | string[] | undefined>
}) {
  return (
    <main>
      <div className="mx-auto max-w-5xl px-6 pb-24 pt-16">
        <div className="text-xs uppercase tracking-[0.35em] text-muted">Shared Result</div>
        <h1 className="mt-3 text-3xl font-semibold">공유 링크가 필요합니다</h1>
        <p className="mt-3 max-w-xl text-sm text-muted">
          결과 공유는 고유 링크 형태로 제공됩니다. 테스트를 완료한 뒤 공유 링크를 복사해보세요.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="/survey"
            className="rounded-full border border-ink bg-ink px-6 py-3 text-sm font-semibold text-white"
          >
            나도 테스트하기
          </a>
          <a
            href="/"
            className="rounded-full border border-ink px-6 py-3 text-sm font-semibold text-ink"
          >
            서비스 소개
          </a>
        </div>
      </div>
    </main>
  )
}
