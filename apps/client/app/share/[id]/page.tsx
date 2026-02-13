import type { Metadata } from "next"

async function getShare(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/api/share?id=${id}`, {
    cache: "no-store"
  })
  if (!res.ok) return null
  return (await res.json()) as {
    id: string
    title: string
    subtitle: string
    keywords: string[]
    genres: string[]
    ratio?: "1:1" | "4:5" | "9:16"
  }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const data = await getShare(params.id)
  const title = data?.title ?? "나만의 독서 페르소나"
  const subtitle = data?.subtitle ?? "당신만의 독서 페르소나를 확인해보세요."
  const ogImageUrl = `/api/share-card?id=${params.id}`

  return {
    title,
    description: subtitle,
    openGraph: {
      title,
      description: subtitle,
      images: [ogImageUrl]
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: subtitle,
      images: [ogImageUrl]
    }
  }
}

export default async function ShareByIdPage({ params }: { params: { id: string } }) {
  const data = await getShare(params.id)

  if (!data) {
    return (
      <main>
        <div className="mx-auto max-w-4xl px-6 py-24">
          <div className="rounded-3xl border border-line bg-card p-6 shadow-soft">
            <div className="text-sm text-muted">공유 데이터를 찾을 수 없습니다.</div>
          </div>
        </div>
      </main>
    )
  }

  const ogImageUrl = `/api/share-card?id=${data.id}&ratio=${data.ratio ?? "1:1"}`
  const ratio = data.ratio ?? "1:1"
  const ratioClass =
    ratio === "1:1" ? "aspect-square" : ratio === "4:5" ? "aspect-[4/5]" : "aspect-[9/16]"

  return (
    <main>
      <div className="mx-auto max-w-5xl px-6 pb-24 pt-16">
        <div className="text-xs uppercase tracking-[0.35em] text-muted">Shared Persona</div>
        <h1 className="mt-3 text-3xl font-semibold">{data.title}</h1>
        <p className="mt-3 max-w-2xl text-sm text-muted">{data.subtitle}</p>

        <div className={`mt-8 overflow-hidden rounded-3xl border border-line bg-card shadow-soft ${ratioClass}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ogImageUrl} alt="" className="h-full w-full object-cover" />
        </div>

        <div className="mt-8 rounded-3xl border border-line bg-card p-6 shadow-soft">
          <div className="text-xs uppercase tracking-[0.3em] text-muted">GENRES</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {data.genres.length ? (
              data.genres.map((genre) => (
                <span key={genre} className="rounded-full bg-[#f2eee8] px-4 py-2 text-xs">
                  {genre}
                </span>
              ))
            ) : (
              <span className="text-xs text-muted">장르 정보가 없습니다.</span>
            )}
          </div>
        </div>

        <div className="mt-6 rounded-3xl border border-line bg-card p-6 shadow-soft">
          <div className="text-xs uppercase tracking-[0.3em] text-muted">KEYWORDS</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {data.keywords.length ? (
              data.keywords.map((keyword) => (
                <span key={keyword} className="rounded-full bg-[#f2eee8] px-4 py-2 text-xs">
                  {keyword}
                </span>
              ))
            ) : (
              <span className="text-xs text-muted">키워드 정보가 없습니다.</span>
            )}
          </div>
        </div>

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
