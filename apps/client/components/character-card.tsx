import type { ReactNode } from "react"

export type CharacterProfile = {
  id: string
  name: string
  vibe: string
  label: string
  colors: {
    bg: string
    accent: string
    cheeks: string
  }
  accessory: ReactNode
  pattern: "dots" | "stripes" | "spark" | "grid" | "waves"
}

type ThemeOverride = Partial<CharacterProfile["colors"]> & { bg?: string }

export const characters: CharacterProfile[] = [
  {
    id: "moonlit",
    name: "밤샘 책방 요정",
    label: "LATE NIGHT",
    vibe: "불 끄고도 책 읽는 야행성 수집가",
    colors: { bg: "#1f2438", accent: "#ffd166", cheeks: "#ff8fab" },
    accessory: (
      <div className="absolute right-8 top-8 rounded-full bg-white/15 px-3 py-1 text-xs">🌙</div>
    ),
    pattern: "spark"
  },
  {
    id: "cozy",
    name: "담요 뒤집어쓴 독서곰",
    label: "COZY MODE",
    vibe: "포근함이 가장 잘 읽히는 타입",
    colors: { bg: "#2d1e1a", accent: "#f4a261", cheeks: "#f28482" },
    accessory: (
      <div className="absolute left-8 top-8 rounded-full bg-white/15 px-3 py-1 text-xs">🧣</div>
    ),
    pattern: "waves"
  },
  {
    id: "spark",
    name: "번쩍 아이디어 스파크",
    label: "IDEA BOOST",
    vibe: "한 문장에 불붙는 영감러",
    colors: { bg: "#0f2b4c", accent: "#4cc9f0", cheeks: "#f7b267" },
    accessory: (
      <div className="absolute right-8 top-8 rounded-full bg-white/15 px-3 py-1 text-xs">⚡</div>
    ),
    pattern: "stripes"
  },
  {
    id: "leaf",
    name: "초록 느긋 새싹",
    label: "SLOW & STEADY",
    vibe: "천천히 읽고 깊게 기억하는 타입",
    colors: { bg: "#1d2f26", accent: "#94d2bd", cheeks: "#ffb4a2" },
    accessory: (
      <div className="absolute left-8 top-8 rounded-full bg-white/15 px-3 py-1 text-xs">🌿</div>
    ),
    pattern: "dots"
  },
  {
    id: "star",
    name: "별빛 표지 수집가",
    label: "COVER LOVER",
    vibe: "표지 보고 마음이 먼저 읽는 타입",
    colors: { bg: "#1b1930", accent: "#fcbf49", cheeks: "#f6bd60" },
    accessory: (
      <div className="absolute right-8 top-8 rounded-full bg-white/15 px-3 py-1 text-xs">✨</div>
    ),
    pattern: "grid"
  },
  {
    id: "blossom",
    name: "벚꽃 페이지 산책러",
    label: "LIGHT READ",
    vibe: "가볍게 걷듯 읽는 산책형",
    colors: { bg: "#3a2038", accent: "#ffb3c6", cheeks: "#ffd6ff" },
    accessory: (
      <div className="absolute left-8 top-8 rounded-full bg-white/15 px-3 py-1 text-xs">🌸</div>
    ),
    pattern: "waves"
  },
  {
    id: "bubble",
    name: "말랑 거품 독서러",
    label: "SOFT RESET",
    vibe: "기분 전환용 책을 사랑하는 타입",
    colors: { bg: "#16262e", accent: "#81f7ff", cheeks: "#ffd6a5" },
    accessory: (
      <div className="absolute right-8 top-8 rounded-full bg-white/15 px-3 py-1 text-xs">🫧</div>
    ),
    pattern: "dots"
  },
  {
    id: "comet",
    name: "혜성 돌격 독서대",
    label: "BINGE MODE",
    vibe: "짧고 강하게 끝까지 읽는 타입",
    colors: { bg: "#2b1b3f", accent: "#ffd166", cheeks: "#ff9b85" },
    accessory: (
      <div className="absolute left-8 top-8 rounded-full bg-white/15 px-3 py-1 text-xs">☄️</div>
    ),
    pattern: "spark"
  },
  {
    id: "citrus",
    name: "귤젤리 탐험대장",
    label: "GENRE HOPPER",
    vibe: "장르를 옮겨 다니는 탐험형",
    colors: { bg: "#2e1f12", accent: "#ff9f1c", cheeks: "#fcbf49" },
    accessory: (
      <div className="absolute right-8 top-8 rounded-full bg-white/15 px-3 py-1 text-xs">🍊</div>
    ),
    pattern: "stripes"
  },
  {
    id: "cloud",
    name: "구름 둥둥 쉬어가",
    label: "SLOW REST",
    vibe: "멍하니 읽고 쉬어가는 타입",
    colors: { bg: "#1b263b", accent: "#a0c4ff", cheeks: "#ffc6ff" },
    accessory: (
      <div className="absolute left-8 top-8 rounded-full bg-white/15 px-3 py-1 text-xs">☁️</div>
    ),
    pattern: "grid"
  },
  {
    id: "muse",
    name: "뮤즈 채집 상자",
    label: "IDEA PICKER",
    vibe: "영감을 모아두는 수집형",
    colors: { bg: "#2b2d42", accent: "#edf2f4", cheeks: "#ffcad4" },
    accessory: (
      <div className="absolute right-8 top-8 rounded-full bg-white/15 px-3 py-1 text-xs">🖋️</div>
    ),
    pattern: "dots"
  },
  {
    id: "pixel",
    name: "픽셀 메모봇",
    label: "SNAP NOTES",
    vibe: "짧게 메모하고 기억하는 타입",
    colors: { bg: "#1f1f1f", accent: "#4ecdc4", cheeks: "#f7b267" },
    accessory: (
      <div className="absolute left-8 top-8 rounded-full bg-white/15 px-3 py-1 text-xs">🧩</div>
    ),
    pattern: "grid"
  }
]

export function pickCharacter(seed: string) {
  let hash = 0
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) % 99991
  }
  return characters[hash % characters.length]
}

function seedNumber(seed: string) {
  let hash = 0
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 37 + seed.charCodeAt(i)) % 99991
  }
  return hash
}

const propIcons = ["📖", "☕", "🛋️", "💡", "🕯️", "🪴", "🍪", "🧦"]

export function pickProps(seed: string, count = 3) {
  const hash = seedNumber(seed)
  const picks = new Set<string>()
  for (let i = 0; i < propIcons.length && picks.size < count; i += 1) {
    const index = (hash + i * 7) % propIcons.length
    picks.add(propIcons[index])
  }
  return Array.from(picks)
}

export function pickSimilarCharacters(seed: string, count = 3) {
  const primaryIndex = characters.indexOf(pickCharacter(seed))
  const list: CharacterProfile[] = []
  for (let i = 1; i <= count; i += 1) {
    list.push(characters[(primaryIndex + i) % characters.length])
  }
  return list
}

function Pattern({ type }: { type: CharacterProfile["pattern"] }) {
  switch (type) {
    case "dots":
      return (
        <svg viewBox="0 0 320 320" className="absolute inset-0 h-full w-full opacity-20">
          <defs>
            <pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="6" cy="6" r="3" fill="white" />
            </pattern>
          </defs>
          <rect width="320" height="320" fill="url(#dots)" />
        </svg>
      )
    case "stripes":
      return (
        <svg viewBox="0 0 320 320" className="absolute inset-0 h-full w-full opacity-15">
          <defs>
            <pattern id="stripes" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <rect width="6" height="14" fill="white" />
            </pattern>
          </defs>
          <rect width="320" height="320" fill="url(#stripes)" />
        </svg>
      )
    case "spark":
      return (
        <svg viewBox="0 0 320 320" className="absolute inset-0 h-full w-full opacity-20">
          <circle cx="50" cy="60" r="4" fill="white" />
          <circle cx="260" cy="80" r="6" fill="white" />
          <circle cx="230" cy="220" r="4" fill="white" />
          <circle cx="80" cy="240" r="5" fill="white" />
          <circle cx="160" cy="40" r="3" fill="white" />
        </svg>
      )
    case "grid":
      return (
        <svg viewBox="0 0 320 320" className="absolute inset-0 h-full w-full opacity-15">
          <path
            d="M40 0V320 M80 0V320 M120 0V320 M160 0V320 M200 0V320 M240 0V320 M280 0V320 M0 40H320 M0 80H320 M0 120H320 M0 160H320 M0 200H320 M0 240H320 M0 280H320"
            stroke="white"
            strokeWidth="2"
          />
        </svg>
      )
    case "waves":
      return (
        <svg viewBox="0 0 320 320" className="absolute inset-0 h-full w-full opacity-20">
          <path d="M0 60 C40 40 80 40 120 60 C160 80 200 80 240 60 C280 40 320 40 360 60" stroke="white" strokeWidth="6" fill="none" />
          <path d="M0 140 C40 120 80 120 120 140 C160 160 200 160 240 140 C280 120 320 120 360 140" stroke="white" strokeWidth="6" fill="none" />
          <path d="M0 220 C40 200 80 200 120 220 C160 240 200 240 240 220 C280 200 320 200 360 220" stroke="white" strokeWidth="6" fill="none" />
        </svg>
      )
  }
}

function ReadingMascot({ accent, cheeks }: { accent: string; cheeks: string }) {
  return (
    <svg viewBox="0 0 360 360" className="h-full max-h-[300px] w-full">
      <defs>
        <linearGradient id="page" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#e9ecef" />
        </linearGradient>
      </defs>
      <rect x="80" y="200" width="200" height="90" rx="18" fill="url(#page)" />
      <rect x="92" y="210" width="86" height="70" rx="12" fill="#f8f9fa" />
      <rect x="182" y="210" width="86" height="70" rx="12" fill="#f1f3f5" />
      <path d="M180 210 V280" stroke="#d1d5db" strokeWidth="4" />

      <circle cx="180" cy="140" r="95" fill={accent} />
      <ellipse cx="135" cy="140" rx="24" ry="20" fill="#1f1f1f" />
      <ellipse cx="225" cy="140" rx="24" ry="20" fill="#1f1f1f" />
      <circle cx="135" cy="140" r="8" fill="#ffffff" />
      <circle cx="225" cy="140" r="8" fill="#ffffff" />
      <circle cx="125" cy="170" r="18" fill={cheeks} opacity="0.8" />
      <circle cx="235" cy="170" r="18" fill={cheeks} opacity="0.8" />
      <path d="M145 190 Q180 215 215 190" stroke="#1f1f1f" strokeWidth="8" fill="none" strokeLinecap="round" />

      <rect x="108" y="98" width="144" height="16" rx="8" fill="#1f1f1f" opacity="0.35" />
      <rect x="96" y="90" width="168" height="32" rx="16" stroke="#1f1f1f" strokeWidth="6" fill="transparent" />
    </svg>
  )
}

export function CharacterCard({
  profile,
  themeOverride,
  propsList
}: {
  profile: CharacterProfile
  themeOverride?: ThemeOverride
  propsList?: string[]
}) {
  const colors = {
    ...profile.colors,
    ...(themeOverride ?? {})
  }

  return (
    <div
      className="relative flex h-full w-full flex-col justify-between overflow-hidden rounded-[28px] p-8 text-white"
      style={{ background: themeOverride?.bg ?? colors.bg }}
    >
      <Pattern type={profile.pattern} />
      {profile.accessory}
      <div className="relative">
        <div className="text-xs uppercase tracking-[0.3em] text-white/70">PERSONA MASCOT</div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <h2 className="text-2xl font-semibold">{profile.name}</h2>
          <span className="rounded-full bg-white/15 px-2 py-1 text-[10px] tracking-[0.2em]">
            {profile.label}
          </span>
        </div>
        <p className="mt-2 text-sm text-white/80">{profile.vibe}</p>
      </div>
      <div className="relative mt-6 flex flex-1 items-center justify-center">
        <ReadingMascot accent={colors.accent} cheeks={colors.cheeks} />
      </div>
      {propsList && propsList.length ? (
        <div className="absolute bottom-6 right-6 flex gap-2 text-lg">
          {propsList.slice(0, 3).map((item) => (
            <span key={item} className="rounded-full bg-white/15 px-2 py-1">
              {item}
            </span>
          ))}
        </div>
      ) : null}
    </div>
  )
}
