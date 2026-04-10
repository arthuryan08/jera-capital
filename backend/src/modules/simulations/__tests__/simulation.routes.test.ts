import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { buildApp } from "../../../app.js";
import { runMigrations } from "../../../db/migrate.js";
import { createDb } from "../../../db/client.js";
import type { FastifyInstance } from "fastify";

let app: FastifyInstance;
let authToken: string;
let secondUserToken: string;
let simulationId: string;

const validSimulationPayload = {
  name: "My First Simulation",
  initialAmount: 10000,
  monthlyContribution: 500,
  periodMonths: 12,
  fixedAnnualRate: 0.12,
  variableExpectedAnnualRate: 0.15,
  variableVolatility: 0.05,
};

beforeAll(async () => {
  const db = createDb(":memory:");
  await runMigrations(db);

  app = await buildApp({
    logger: false,
    db,
    jwtSecret: "test-secret",
  });

  // Register first test user
  const registerRes = await app.inject({
    method: "POST",
    url: "/api/auth/register",
    payload: {
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    },
  });
  const registerBody = JSON.parse(registerRes.body);
  authToken = registerBody.token;

  // Register second test user for cross-user isolation tests
  const register2Res = await app.inject({
    method: "POST",
    url: "/api/auth/register",
    payload: {
      name: "Second User",
      email: "second@example.com",
      password: "password456",
    },
  });
  const register2Body = JSON.parse(register2Res.body);
  secondUserToken = register2Body.token;
});

afterAll(async () => {
  await app.close();
});

// ===========================================
// AUTH ROUTES
// ===========================================

describe("POST /api/auth/register", () => {
  it("rejects duplicate email", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/api/auth/register",
      payload: {
        name: "Another User",
        email: "test@example.com",
        password: "password123",
      },
    });
    expect(res.statusCode).toBe(409);
  });

  it("creates user and returns JWT + user info", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/api/auth/register",
      payload: {
        name: "New User",
        email: "new@example.com",
        password: "password123",
      },
    });
    expect(res.statusCode).toBe(201);
    const body = JSON.parse(res.body);
    expect(body.token).toBeDefined();
    expect(body.user.email).toBe("new@example.com");
    expect(body.user.name).toBe("New User");
    expect(body.user.id).toBeDefined();
  });

  it("validates email format", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/api/auth/register",
      payload: {
        name: "Bad Email",
        email: "not-an-email",
        password: "password123",
      },
    });
    expect(res.statusCode).toBe(400);
  });

  it("validates password minimum length", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/api/auth/register",
      payload: {
        name: "Short Pass",
        email: "short@example.com",
        password: "12345",
      },
    });
    expect(res.statusCode).toBe(400);
  });

  it("validates required fields", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/api/auth/register",
      payload: {},
    });
    expect(res.statusCode).toBe(400);
  });
});

describe("POST /api/auth/login", () => {
  it("returns token on valid credentials", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/api/auth/login",
      payload: {
        email: "test@example.com",
        password: "password123",
      },
    });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.token).toBeDefined();
    expect(body.user.email).toBe("test@example.com");
  });

  it("rejects wrong password", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/api/auth/login",
      payload: {
        email: "test@example.com",
        password: "wrongpassword",
      },
    });
    expect(res.statusCode).toBe(401);
  });

  it("rejects non-existent email", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/api/auth/login",
      payload: {
        email: "nobody@example.com",
        password: "password123",
      },
    });
    expect(res.statusCode).toBe(401);
  });

  it("validates required fields", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/api/auth/login",
      payload: {},
    });
    expect(res.statusCode).toBe(400);
  });
});

// ===========================================
// SIMULATION ROUTES - AUTH PROTECTION
// ===========================================

describe("Auth protection", () => {
  it("POST /api/simulations requires authentication", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/api/simulations",
      payload: validSimulationPayload,
    });
    expect(res.statusCode).toBe(401);
  });

  it("POST /api/simulations/calculate requires authentication", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/api/simulations/calculate",
      payload: {
        initialAmount: 5000,
        monthlyContribution: 200,
        periodMonths: 24,
        fixedAnnualRate: 0.10,
        variableExpectedAnnualRate: 0.12,
        variableVolatility: 0.03,
      },
    });
    expect(res.statusCode).toBe(401);
  });

  it("GET /api/simulations requires authentication", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/api/simulations",
    });
    expect(res.statusCode).toBe(401);
  });

  it("GET /api/simulations/:id requires authentication", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/api/simulations/00000000-0000-0000-0000-000000000000",
    });
    expect(res.statusCode).toBe(401);
  });

  it("DELETE /api/simulations/:id requires authentication", async () => {
    const res = await app.inject({
      method: "DELETE",
      url: "/api/simulations/00000000-0000-0000-0000-000000000000",
    });
    expect(res.statusCode).toBe(401);
  });

  it("rejects invalid JWT token", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/api/simulations",
      headers: { authorization: "Bearer invalid-token-here" },
    });
    expect(res.statusCode).toBe(401);
  });
});

// ===========================================
// POST /api/simulations
// ===========================================

describe("POST /api/simulations", () => {
  it("creates a simulation with valid data", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/api/simulations",
      headers: { authorization: `Bearer ${authToken}` },
      payload: validSimulationPayload,
    });
    expect(res.statusCode).toBe(201);
    const body = JSON.parse(res.body);
    expect(body.id).toBeDefined();
    expect(body.name).toBe("My First Simulation");
    simulationId = body.id;
  });

  it("returns simulation with calculation results", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/api/simulations",
      headers: { authorization: `Bearer ${authToken}` },
      payload: { ...validSimulationPayload, name: "With Results" },
    });
    expect(res.statusCode).toBe(201);
    const body = JSON.parse(res.body);
    expect(body.fixedIncomeResult).toBeDefined();
    expect(body.variableIncomeResult).toBeDefined();
    expect(body.taxSummary).toBeDefined();
  });

  it("rejects missing name", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/api/simulations",
      headers: { authorization: `Bearer ${authToken}` },
      payload: {
        initialAmount: 10000,
        monthlyContribution: 500,
        periodMonths: 12,
        fixedAnnualRate: 0.12,
        variableExpectedAnnualRate: 0.15,
        variableVolatility: 0.05,
      },
    });
    expect(res.statusCode).toBe(400);
  });

  it("rejects empty name", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/api/simulations",
      headers: { authorization: `Bearer ${authToken}` },
      payload: { ...validSimulationPayload, name: "" },
    });
    expect(res.statusCode).toBe(400);
  });

  it("rejects negative initial amount", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/api/simulations",
      headers: { authorization: `Bearer ${authToken}` },
      payload: { ...validSimulationPayload, initialAmount: -100 },
    });
    expect(res.statusCode).toBe(400);
  });

  it("rejects zero period months", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/api/simulations",
      headers: { authorization: `Bearer ${authToken}` },
      payload: { ...validSimulationPayload, periodMonths: 0 },
    });
    expect(res.statusCode).toBe(400);
  });

  it("rejects non-numeric values", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/api/simulations",
      headers: { authorization: `Bearer ${authToken}` },
      payload: { ...validSimulationPayload, initialAmount: "abc" },
    });
    expect(res.statusCode).toBe(400);
  });
});

// ===========================================
// POST /api/simulations/calculate
// ===========================================

describe("POST /api/simulations/calculate", () => {
  it("returns calculation preview without saving", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/api/simulations/calculate",
      headers: { authorization: `Bearer ${authToken}` },
      payload: {
        initialAmount: 5000,
        monthlyContribution: 200,
        periodMonths: 24,
        fixedAnnualRate: 0.10,
        variableExpectedAnnualRate: 0.12,
        variableVolatility: 0.03,
      },
    });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.fixed).toBeDefined();
    expect(body.variable).toBeDefined();
    expect(body.pctDiff).toBeDefined();
    expect(body.fixed.monthlyEvolution).toHaveLength(24);
  });

  it("does not persist the calculation to database", async () => {
    // Get list before
    const listBefore = await app.inject({
      method: "GET",
      url: "/api/simulations",
      headers: { authorization: `Bearer ${authToken}` },
    });
    const countBefore = JSON.parse(listBefore.body).total;

    // Calculate preview
    await app.inject({
      method: "POST",
      url: "/api/simulations/calculate",
      headers: { authorization: `Bearer ${authToken}` },
      payload: {
        initialAmount: 5000,
        monthlyContribution: 200,
        periodMonths: 24,
        fixedAnnualRate: 0.10,
        variableExpectedAnnualRate: 0.12,
        variableVolatility: 0.03,
      },
    });

    // Get list after
    const listAfter = await app.inject({
      method: "GET",
      url: "/api/simulations",
      headers: { authorization: `Bearer ${authToken}` },
    });
    const countAfter = JSON.parse(listAfter.body).total;

    expect(countAfter).toBe(countBefore);
  });
});

// ===========================================
// GET /api/simulations
// ===========================================

describe("GET /api/simulations", () => {
  it("lists user simulations", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/api/simulations",
      headers: { authorization: `Bearer ${authToken}` },
    });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.data).toBeDefined();
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.total).toBeGreaterThanOrEqual(1);
  });

  it("returns empty list for new user with no simulations", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/api/simulations",
      headers: { authorization: `Bearer ${secondUserToken}` },
    });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.data).toHaveLength(0);
    expect(body.total).toBe(0);
  });

  it("only returns simulations for the authenticated user", async () => {
    // Create a simulation for second user
    await app.inject({
      method: "POST",
      url: "/api/simulations",
      headers: { authorization: `Bearer ${secondUserToken}` },
      payload: { ...validSimulationPayload, name: "Second User Sim" },
    });

    // First user should not see second user's simulation
    const res = await app.inject({
      method: "GET",
      url: "/api/simulations",
      headers: { authorization: `Bearer ${authToken}` },
    });
    const body = JSON.parse(res.body);
    const names = body.data.map((s: any) => s.name);
    expect(names).not.toContain("Second User Sim");
  });
});

// ===========================================
// GET /api/simulations/:id
// ===========================================

describe("GET /api/simulations/:id", () => {
  it("returns simulation detail", async () => {
    const res = await app.inject({
      method: "GET",
      url: `/api/simulations/${simulationId}`,
      headers: { authorization: `Bearer ${authToken}` },
    });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.name).toBe("My First Simulation");
    expect(body.fixedIncomeResult).toBeDefined();
    expect(body.variableIncomeResult).toBeDefined();
  });

  it("returns 404 for non-existent simulation", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/api/simulations/00000000-0000-0000-0000-000000000000",
      headers: { authorization: `Bearer ${authToken}` },
    });
    expect(res.statusCode).toBe(404);
  });

  it("returns 404 when accessing another user's simulation", async () => {
    // simulationId belongs to first user, try with second user token
    const res = await app.inject({
      method: "GET",
      url: `/api/simulations/${simulationId}`,
      headers: { authorization: `Bearer ${secondUserToken}` },
    });
    expect(res.statusCode).toBe(404);
  });
});

// ===========================================
// DELETE /api/simulations/:id
// ===========================================

describe("DELETE /api/simulations/:id", () => {
  it("cannot delete another user's simulation", async () => {
    const res = await app.inject({
      method: "DELETE",
      url: `/api/simulations/${simulationId}`,
      headers: { authorization: `Bearer ${secondUserToken}` },
    });
    expect(res.statusCode).toBe(404);
  });

  it("deletes a simulation and returns 204", async () => {
    const res = await app.inject({
      method: "DELETE",
      url: `/api/simulations/${simulationId}`,
      headers: { authorization: `Bearer ${authToken}` },
    });
    expect(res.statusCode).toBe(204);
  });

  it("returns 404 when deleting already-deleted simulation", async () => {
    const res = await app.inject({
      method: "DELETE",
      url: `/api/simulations/${simulationId}`,
      headers: { authorization: `Bearer ${authToken}` },
    });
    expect(res.statusCode).toBe(404);
  });

  it("returns 404 for non-existent id", async () => {
    const res = await app.inject({
      method: "DELETE",
      url: "/api/simulations/00000000-0000-0000-0000-000000000000",
      headers: { authorization: `Bearer ${authToken}` },
    });
    expect(res.statusCode).toBe(404);
  });
});
