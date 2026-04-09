import { auth } from "@/auth"

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:3001"

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message)
    this.name = "ApiError"
  }
}

export async function serverFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const session = await auth()

  const res = await fetch(`${BACKEND_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(session?.backendToken && {
        Authorization: `Bearer ${session.backendToken}`,
      }),
      ...options?.headers,
    },
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: "Erro desconhecido" }))
    throw new ApiError(res.status, body.message || "Erro desconhecido")
  }

  return res.json() as Promise<T>
}

export async function clientFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`/api/proxy${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: "Erro desconhecido" }))
    throw new ApiError(res.status, body.message || "Erro desconhecido")
  }

  return res.json() as Promise<T>
}
