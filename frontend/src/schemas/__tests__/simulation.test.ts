import { describe, it, expect } from "vitest"
import { createSimulationSchema } from "../simulation"

describe("createSimulationSchema", () => {
  const validInput = {
    name: "Test Simulation",
    initialAmount: 10000,
    monthlyContribution: 500,
    periodMonths: 12,
    fixedAnnualRate: 10,
    variableExpectedAnnualRate: 15,
    variableVolatility: 5,
  }

  it("accepts valid input", () => {
    const result = createSimulationSchema.safeParse(validInput)
    expect(result.success).toBe(true)
  })

  it("rejects empty name", () => {
    const result = createSimulationSchema.safeParse({
      ...validInput,
      name: "",
    })
    expect(result.success).toBe(false)
  })

  it("rejects negative initial amount", () => {
    const result = createSimulationSchema.safeParse({
      ...validInput,
      initialAmount: -100,
    })
    expect(result.success).toBe(false)
  })

  it("accepts zero initial amount", () => {
    const result = createSimulationSchema.safeParse({
      ...validInput,
      initialAmount: 0,
    })
    expect(result.success).toBe(true)
  })

  it("rejects zero period months", () => {
    const result = createSimulationSchema.safeParse({
      ...validInput,
      periodMonths: 0,
    })
    expect(result.success).toBe(false)
  })

  it("rejects negative period months", () => {
    const result = createSimulationSchema.safeParse({
      ...validInput,
      periodMonths: -5,
    })
    expect(result.success).toBe(false)
  })

  it("rejects period above 600 months", () => {
    const result = createSimulationSchema.safeParse({
      ...validInput,
      periodMonths: 601,
    })
    expect(result.success).toBe(false)
  })

  it("rejects non-integer period months", () => {
    const result = createSimulationSchema.safeParse({
      ...validInput,
      periodMonths: 12.5,
    })
    expect(result.success).toBe(false)
  })

  it("rejects fixed rate above 100", () => {
    const result = createSimulationSchema.safeParse({
      ...validInput,
      fixedAnnualRate: 101,
    })
    expect(result.success).toBe(false)
  })

  it("rejects negative fixed rate", () => {
    const result = createSimulationSchema.safeParse({
      ...validInput,
      fixedAnnualRate: -1,
    })
    expect(result.success).toBe(false)
  })

  it("rejects negative variable expected rate", () => {
    const result = createSimulationSchema.safeParse({
      ...validInput,
      variableExpectedAnnualRate: -0.01,
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      const issue = result.error.issues.find(
        (i) => i.path[0] === "variableExpectedAnnualRate"
      )
      expect(issue?.message).toBe(
        "Retorno esperado deve ser maior ou igual a zero"
      )
    }
  })

  it("accepts zero variable expected rate (boundary)", () => {
    const result = createSimulationSchema.safeParse({
      ...validInput,
      variableExpectedAnnualRate: 0,
    })
    expect(result.success).toBe(true)
  })

  it("rejects negative volatility", () => {
    const result = createSimulationSchema.safeParse({
      ...validInput,
      variableVolatility: -1,
    })
    expect(result.success).toBe(false)
  })

  it("accepts zero volatility", () => {
    const result = createSimulationSchema.safeParse({
      ...validInput,
      variableVolatility: 0,
    })
    expect(result.success).toBe(true)
  })

  it("rejects volatility above 100", () => {
    const result = createSimulationSchema.safeParse({
      ...validInput,
      variableVolatility: 101,
    })
    expect(result.success).toBe(false)
  })

  it("accepts boundary values", () => {
    const result = createSimulationSchema.safeParse({
      ...validInput,
      initialAmount: 0,
      monthlyContribution: 0,
      periodMonths: 1,
      fixedAnnualRate: 0,
      variableExpectedAnnualRate: 0,
      variableVolatility: 0,
    })
    expect(result.success).toBe(true)
  })

  it("accepts max boundary values", () => {
    const result = createSimulationSchema.safeParse({
      ...validInput,
      periodMonths: 600,
      fixedAnnualRate: 100,
      variableExpectedAnnualRate: 200,
      variableVolatility: 100,
    })
    expect(result.success).toBe(true)
  })

  it("optional monthly contribution defaults behavior", () => {
    const result = createSimulationSchema.safeParse({
      ...validInput,
      monthlyContribution: 0,
    })
    expect(result.success).toBe(true)
  })
})
