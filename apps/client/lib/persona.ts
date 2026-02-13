export type PersonaResult = {
  persona: {
    name: string
    tagline: string
    keywords: string[]
  }
  summary: [string, string, string]
  profile: {
    reading_style: {
      label: string
      value: string
      score: number
    }
    time_preference: {
      label: string
      value: string
      score: number
    }
    purpose: {
      label: string
      value: string
      score: number
    }
  }
  roadmap: Array<{
    week: 1 | 2 | 3 | 4
    theme: string
    recommendation: string
  }>
  social_proof: {
    similar_reader_keywords: string[]
  }
  share_card: {
    title: string
    subtitle: string
    keywords: string[]
    cta: string
  }
}

export const mockPersonaResult: PersonaResult = {
  persona: {
    name: "문학적 야행성 탐구가",
    tagline: "밤에 몰입하며 깊이 파고드는 감성 분석형 독자",
    keywords: ["몰입", "밤", "서사", "성찰"]
  },
  summary: [
    "당신은 밤에 가장 집중도가 올라가는 독자입니다.",
    "감정의 흐름과 의미를 곱씹는 성향이 강합니다.",
    "한 번 잡으면 끝까지 읽는 몰입형 스타일입니다."
  ],
  profile: {
    reading_style: { label: "읽는 방식", value: "몰아읽기", score: 72 },
    time_preference: { label: "읽는 시간대", value: "밤", score: 64 },
    purpose: { label: "독서 목적", value: "자기성찰", score: 58 }
  },
  roadmap: [
    { week: 1, theme: "서사의 깊이", recommendation: "긴 서사를 가진 문학 작품 1권" },
    { week: 2, theme: "감정의 결", recommendation: "감정 묘사가 뛰어난 에세이 1권" },
    { week: 3, theme: "사유 확장", recommendation: "철학/인문서 1권" },
    { week: 4, theme: "나만의 기록", recommendation: "독서 노트 작성 + 짧은 서평" }
  ],
  social_proof: {
    similar_reader_keywords: ["몰입", "성찰", "서사", "밤", "감정"]
  },
  share_card: {
    title: "문학적 야행성 탐구가",
    subtitle: "밤에 몰입하며 깊이 파고드는 감성 분석형 독자",
    keywords: ["몰입", "밤", "서사"],
    cta: "나만의 독서 페르소나 테스트"
  }
}
