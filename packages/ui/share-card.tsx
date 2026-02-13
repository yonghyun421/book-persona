import type { ReactNode } from "react"

type ShareCardProps = {
  title: string
  subtitle: string
  keywords: string[]
  cta: string
  brandLabel?: string
  backgroundClassName?: string
  backgroundImage?: string
  ratio?: "1:1" | "4:5" | "9:16"
  footer?: ReactNode
}

export function ShareCard({
  title,
  subtitle,
  keywords,
  cta,
  brandLabel = "READING PERSONA",
  backgroundClassName = "bg-gradient-to-br from-[#0b0d12] to-[#1d2233]",
  backgroundImage,
  ratio = "1:1",
  footer
}: ShareCardProps) {
  const size =
    ratio === "1:1"
      ? { width: 960, height: 960 }
      : ratio === "4:5"
        ? { width: 960, height: 1200 }
        : { width: 900, height: 1600 }

  return (
    <div
      className={`relative flex h-[960px] w-[960px] flex-col justify-between overflow-hidden rounded-[48px] p-16 text-white ${backgroundClassName}`}
      style={{
        ...(backgroundImage
          ? { backgroundImage: `url(${backgroundImage})`, backgroundSize: "cover" }
          : undefined),
        width: size.width,
        height: size.height
      }}
    >
      {backgroundImage ? (
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black/90" />
      ) : null}
      <div className="relative z-10 flex h-full flex-col justify-between">
      <div className="text-sm tracking-[0.3em]">{brandLabel}</div>
      <div>
        <h1 className="mb-4 text-6xl font-semibold">{title}</h1>
        <p className="max-w-[720px] text-2xl leading-relaxed text-white/90">{subtitle}</p>
      </div>
      <div>
        <div className="mb-4 flex flex-wrap gap-3">
          {keywords.map((keyword) => (
            <span
              key={keyword}
              className="rounded-full bg-white/15 px-4 py-2 text-lg"
            >
              {keyword}
            </span>
          ))}
        </div>
        <div className="text-lg text-white/90">{cta}</div>
        {footer ? <div className="mt-3">{footer}</div> : null}
      </div>
      </div>
    </div>
  )
}
