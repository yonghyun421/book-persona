import type { ReactNode } from "react"

export const metadata = {
  title: "Book Persona Admin",
  description: "통계 및 로그 대시보드"
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
