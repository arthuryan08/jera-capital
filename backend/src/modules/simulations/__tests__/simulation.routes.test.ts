import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { buildApp } from "../../../app.js";
import { runMigrations } from "../../../db/migrate.js";
import { createDb } from "../../../db/client.js";
import type { FastifyInstance } from "fastify";

let app: FastifyInstance;
let authToken: string;
let simulationId: string;

beforeAll(async () => {
  const db = createDb(":memory:");
  await runMigrations(db);

  app = await buildApp({
    logger: false,
    db,
    jwtSecret: "test-secret",
  });

  // Register a test user
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
});

afterAll(async () => {
  await app.close();
});

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

  it("rejects invalid credentials", async () => {
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
});

describe("POST /api/simulations", () => {
  it("requires authentication", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/api/simulations",
      payload: {
        name: "Test Sim",
        initialAmount: 10000,
        monthlyContribution: 500,
        periodMonths: 12,
        fixedAnnualRate: 0.12,
        variableExpectedAnnualRate: 0.15,
        variableVolatility: 0.05,
      },
    });
    expect(res.statusCode).toBe(401);
  });

  it("creates a simulation with valid data", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/api/simulations",
      headers: { authorization: `Bearer ${authToken}` },
      payload: {
        name: "My First Simulation",
        initialAmount: 10000,
        monthlyContribution: 500,
        periodMonths: 12,
        fixedAnnualRate: 0.12,
        variableExpectedAnnualRate: 0.15,
        variableVolatility: 0.05,
      },
    });
    expect(res.statusCode).toBe(201);
    const body = JSON.parse(res.body);
    expect(body.id).toBeDefined();
    expect(body.name).toBe("My First Simulation");
    simulationId = body.id;
  });

  it("rejects invalid data", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/api/simulations",
      headers: { authorization: `Bearer ${authToken}` },
      payload: {
        name: "",
        initialAmount: -100,
        periodMonths: 0,
        fixedAnnualRate: 2,
      },
    });
    expect(res.statusCode).toBe(400);
  });
});

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
});

describe("GET /api/simulations", () => {
  it("lists user simulations", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/api/simulations",
      headers: { authorization: `Bearer ${authToken}` },
    });
    expect(res.statusCode).toBe(200);
    const body = JSON.parse(res.body);
    expect(body.data).toHaveLength(1);
    expect(body.total).toBe(1);
  });
});

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
});

describe("DELETE /api/simulations/:id", () => {
  it("deletes a simulation", async () => {
    const res = await app.inject({
      method: "DELETE",
      url: `/api/simulations/${simulationId}`,
      headers: { authorization: `Bearer ${authToken}` },
    });
    expect(res.statusCode).toBe(204);
  });

  it("returns 404 when deleting non-existent simulation", async () => {
    const res = await app.inject({
      method: "DELETE",
      url: `/api/simulations/${simulationId}`,
      headers: { authorization: `Bearer ${authToken}` },
    });
    expect(res.statusCode).toBe(404);
  });
});
