import { randomUUID } from "crypto"
import { supabase } from "./supabase"

export const runtime = "nodejs"

type ShareInput = {
  title: string
  subtitle: string
  keywords: string[]
  genres?: string[]
  backgroundDataUrl?: string
}

export async function POST(req: Request) {
  const input = (await req.json()) as ShareInput
  const id = randomUUID()

  const record = {
    id,
    title: input.title,
    subtitle: input.subtitle,
    keywords: input.keywords ?? [],
    genres: input.genres ?? [],
    background_data_url: input.backgroundDataUrl ?? null,
    created_at: new Date().toISOString(),
    expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString()
  }

  if (record.background_data_url && record.background_data_url.length > 4_000_000) {
    record.background_data_url = null
  }

  const { error } = await supabase.from("book_persona_share").insert(record)
  if (error) {
    return new Response("Failed to store share", { status: 500 })
  }

  return Response.json({ id })
}

export async function GET(req: Request) {
  const url = new URL(req.url)
  const id = url.searchParams.get("id")
  if (!id) return new Response("Missing id", { status: 400 })

  const { data, error } = await supabase
    .from("book_persona_share")
    .select("id,title,subtitle,keywords,genres,background_data_url,expires_at")
    .eq("id", id)
    .maybeSingle()

  if (error || !data) return new Response("Not found", { status: 404 })
  if (data.expires_at && new Date(data.expires_at) < new Date()) {
    await supabase.from("book_persona_share").delete().eq("id", id)
    return new Response("Not found", { status: 404 })
  }

  return Response.json({
    id: data.id,
    title: data.title,
    subtitle: data.subtitle,
    keywords: data.keywords ?? [],
    genres: data.genres ?? [],
    backgroundDataUrl: data.background_data_url ?? undefined
  })
}
