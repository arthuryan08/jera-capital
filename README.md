# Jera Capital - Investment Calculator

Full-stack investment calculator that simulates and compares **Fixed Income** vs **Variable Income** investments, with data persistence, authentication, Brazilian tax rules (IR + IOF), and comparative charting.

## Tech Stack

| Layer        | Technology                                      |
|-------------|------------------------------------------------|
| Frontend    | Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui |
| Backend     | Fastify 5, TypeScript                          |
| Database    | SQLite via Drizzle ORM                         |
| Auth        | NextAuth.js v5 (credentials provider)          |
| Validation  | Zod                                            |
| Testing     | Vitest                                         |
| API Docs    | Swagger (OpenAPI 3.0)                          |
| Container   | Docker + Docker Compose                        |

## Getting Started

### Prerequisites
- Node.js 20+
- npm 10+

### Local Development

```bash
# Backend
cd backend
cp .env.example .env
npm install
npm run db:generate
npm run dev          # http://localhost:3001

# Frontend (in another terminal)
cd frontend
cp .env.example .env.local
npm install
npm run dev          # http://localhost:3000
```

### Docker

```bash
docker compose up --build
# Frontend: http://localhost:3000
# Backend:  http://localhost:3001
# Swagger:  http://localhost:3001/documentation
```

### Running Tests

```bash
# Backend tests (engine + integration)
cd backend && npm test

# Frontend tests (schemas + utilities)
cd frontend && npm test
```

## Architecture

```
Client (Browser)
  |
  v
Next.js Frontend (port 3000)
  |-- NextAuth.js (session + JWT)
  |-- API Proxy (/api/proxy/*)
  |
  v
Fastify Backend (port 3001)
  |-- Auth Plugin (JWT verification)
  |-- Route Handlers (thin)
  |-- Service Layer (orchestration)
  |-- Calculation Engine (pure functions)
  |-- Repository Layer (Drizzle ORM)
  |
  v
SQLite Database
```

### Key Design Decisions

1. **Pure calculation engine** -- All financial math (compound interest, tax, IOF) lives in pure functions with zero side effects, making them trivially testable.

2. **Constructor injection** -- Services receive repositories via constructor, enabling easy mocking in tests.

3. **API proxy pattern** -- Frontend proxies API calls through Next.js route handlers to keep the backend URL private and attach JWT tokens server-side.

4. **Deterministic variable income model** -- Uses expected return +/- volatility bands instead of Monte Carlo simulation for simplicity and deterministic results.

5. **SQLite with Drizzle** -- Runs locally without external database setup. Drizzle provides type-safe queries and migration management.

## AI Tools Used

This project was developed with assistance from **Claude Code** (Anthropic's CLI for Claude), which helped with:
- Architecture design and planning
- Code generation following TDD practices
- Financial calculation implementation
- Test writing and verification
