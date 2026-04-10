import { describe, it, expect } from "vitest"
import { signInSchema, registerSchema } from "../auth"

describe("signInSchema", () => {
  it("accepts valid email and password", () => {
    const result = signInSchema.safeParse({
      email: "user@example.com",
      password: "password123",
    })
    expect(result.success).toBe(true)
  })

  it("rejects invalid email format", () => {
    const result = signInSchema.safeParse({
      email: "not-an-email",
      password: "password123",
    })
    expect(result.success).toBe(false)
  })

  it("rejects empty email", () => {
    const result = signInSchema.safeParse({
      email: "",
      password: "password123",
    })
    expect(result.success).toBe(false)
  })

  it("rejects password shorter than 6 characters", () => {
    const result = signInSchema.safeParse({
      email: "user@example.com",
      password: "12345",
    })
    expect(result.success).toBe(false)
  })

  it("accepts password with exactly 6 characters", () => {
    const result = signInSchema.safeParse({
      email: "user@example.com",
      password: "123456",
    })
    expect(result.success).toBe(true)
  })

  it("rejects empty password", () => {
    const result = signInSchema.safeParse({
      email: "user@example.com",
      password: "",
    })
    expect(result.success).toBe(false)
  })

  it("rejects missing fields", () => {
    const result = signInSchema.safeParse({})
    expect(result.success).toBe(false)
  })
})

describe("registerSchema", () => {
  it("accepts valid registration data", () => {
    const result = registerSchema.safeParse({
      name: "John Doe",
      email: "john@example.com",
      password: "password123",
    })
    expect(result.success).toBe(true)
  })

  it("rejects empty name", () => {
    const result = registerSchema.safeParse({
      name: "",
      email: "john@example.com",
      password: "password123",
    })
    expect(result.success).toBe(false)
  })

  it("rejects invalid email", () => {
    const result = registerSchema.safeParse({
      name: "John",
      email: "bad-email",
      password: "password123",
    })
    expect(result.success).toBe(false)
  })

  it("rejects short password", () => {
    const result = registerSchema.safeParse({
      name: "John",
      email: "john@example.com",
      password: "123",
    })
    expect(result.success).toBe(false)
  })

  it("rejects missing fields", () => {
    const result = registerSchema.safeParse({})
    expect(result.success).toBe(false)
  })
})
