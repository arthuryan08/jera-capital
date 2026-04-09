import { auth } from "@/auth"
import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001"

async function handler(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const session = await auth()

  if (!session?.backendToken) {
    return NextResponse.json({ message: "Não autorizado" }, { status: 401 })
  }

  const { path } = await params
  const backendPath = `/${path.join("/")}`
  const url = new URL(backendPath, BACKEND_URL)

  const headers: HeadersInit = {
    Authorization: `Bearer ${session.backendToken}`,
  }

  const fetchOptions: RequestInit = {
    method: req.method,
    headers,
  }

  if (req.method !== "GET" && req.method !== "HEAD" && req.method !== "DELETE") {
    const body = await req.text()
    if (body) {
      ;(headers as Record<string, string>)["Content-Type"] = "application/json"
      fetchOptions.body = body
    }
  }

  const res = await fetch(url.toString(), fetchOptions)

  if (res.status === 204) {
    return new NextResponse(null, { status: 204 })
  }

  const data = await res.json().catch(() => null)
  return NextResponse.json(data, { status: res.status })
}

export const GET = handler
export const POST = handler
export const DELETE = handler
