import type { ReactNode } from "react"

export { ShareCard } from "./share-card"

type SectionProps = {
  title: string
  children: ReactNode
}

export function Section({ title, children }: SectionProps) {
  return (
    <section style={{ marginBottom: "32px" }}>
      <h2 style={{ fontSize: "20px", marginBottom: "8px" }}>{title}</h2>
      <div>{children}</div>
    </section>
  )
}
