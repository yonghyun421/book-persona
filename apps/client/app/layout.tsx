import type { ReactNode } from "react"
import { Climate_Crisis, IBM_Plex_Sans, Space_Grotesk } from "next/font/google"
import "./globals.css"

const titleFont = Climate_Crisis({ subsets: ["latin"], weight: ["400"] })
const bodyFont = Space_Grotesk({ subsets: ["latin"], weight: ["400", "500", "600", "700"] })
const altFont = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "500", "600"] })

export const metadata = {
  title: "Book Persona",
  description: "AI 기반 나만의 독서 페르소나 테스트",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000")
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body className={`${bodyFont.className} ${altFont.className} text-ink`}>
        <div className={titleFont.className} style={{ display: "none" }} aria-hidden />
        {children}
      </body>
    </html>
  )
}
