# Jera Capital - Investment Calculator

Full-stack investment calculator that simulates and compares **Fixed Income** vs **Variable Income** investments, with data persistence, authentication, Brazilian tax rules (IR + IOF), and comparative charting.

## Tech Stack

| Layer        | Technology                                      | Why                                              |
|-------------|------------------------------------------------|--------------------------------------------------|
| Frontend    | Next.js 16 (App Router), TypeScript, Tailwind CSS, shadcn/ui | Server components, App Router, built-in API routes |
| Backend     | Fastify 5, TypeScript                          | High performance, schema-based validation, Swagger auto-gen |
| Database    | SQLite via Drizzle ORM + @libsql/client        | Zero external deps, type-safe queries, pure JS driver |
| Auth        | NextAuth.js v5 (credentials provider) + JWT    | Session management + stateless API auth |
| Validation  | Zod                                            | Shared schemas between frontend forms and backend validation |
| Testing     | Vitest (69 tests: 44 backend + 25 frontend)    | Fast, ESM-native, compatible with TypeScript |
| API Docs    | Swagger (OpenAPI 3.0)                          | Auto-generated from Zod schemas via fastify-type-provider-zod |
| Charts      | Recharts (via shadcn/ui charts)                | Declarative, composable, React-native |
| Container   | Docker + Docker Compose                        | One-command deployment |

## Getting Started

### Prerequisites
- Node.js 24+
- npm 10+

### Local Development

```bash
# Backend
cd backend
cp .env.example .env
npm install
npm run dev          # http://localhost:3001

# Frontend (in another terminal)
cd frontend
cp .env.example .env.local
npm install
npm run dev          # http://localhost:3000
```

### Default Ports
- Frontend: 3000
- Backend: 3001
- Swagger UI: http://localhost:3001/documentation

### Seed User (for testing)
A default user is created on first startup:
- **Email**: admin@test.com
- **Password**: password123

### Docker

```bash
docker compose up --build
# Frontend: http://localhost:3000
# Backend:  http://localhost:3001
```

### Running Tests

```bash
# Backend tests (44 tests: engine unit + API integration)
cd backend && npm test

# Frontend tests (25 tests: schemas + utilities + chart helpers)
cd frontend && npm test
```

### Environment Variables

**Backend** (`backend/.env`):
| Variable       | Default                | Description                |
|---------------|------------------------|----------------------------|
| PORT          | 3001                   | Server port                |
| DATABASE_URL  | ./data/jera.db         | SQLite database path       |
| JWT_SECRET    | (required)             | JWT signing secret         |
| CORS_ORIGIN   | http://localhost:3000  | Allowed CORS origin        |

**Frontend** (`frontend/.env.local`):
| Variable          | Default                | Description                  |
|------------------|------------------------|------------------------------|
| BACKEND_URL      | http://localhost:3001  | Backend API URL (server-side) |
| NEXTAUTH_URL     | http://localhost:3000  | NextAuth base URL            |
| NEXTAUTH_SECRET  | (required)             | NextAuth encryption secret   |
| JWT_SECRET       | (required)             | Must match backend           |

## Architecture

```
Client (Browser)
  |
  v
Next.js Frontend (port 3000)
  |-- NextAuth.js (session + JWT storage)
  |-- API Proxy (/api/proxy/*) -- injects JWT into Authorization header
  |
  v
Fastify Backend (port 3001)
  |-- @fastify/jwt (JWT verification)
  |-- Controllers (thin: parse request, call service, return response)
  |-- Services (orchestration: engine + repository)
  |-- Engine (pure functions: compound interest, tax, comparison)
  |-- Repositories (Drizzle ORM, row-level auth via userId)
  |
  v
SQLite Database (users + simulations)
```

### Auth Flow
1. Backend `POST /api/auth/login` validates email/password with bcrypt, returns signed JWT
2. Frontend NextAuth CredentialsProvider calls backend login endpoint
3. JWT stored in NextAuth session via jwt + session callbacks
4. Client requests go through `/api/proxy/[...path]` which injects JWT into Authorization header
5. Backend validates JWT on all protected routes via @fastify/jwt plugin
6. Same `JWT_SECRET` shared between backend and NextAuth

### Key Design Decisions

1. **Pure calculation engine** -- All financial math (compound interest, tax, IOF) lives in pure functions with zero side effects, making them trivially testable with 32 unit tests.

2. **Constructor injection** -- Services receive repositories via constructor, enabling easy testing with `buildApp()` + `app.inject()` and in-memory SQLite.

3. **API proxy pattern** -- Frontend proxies API calls through Next.js route handlers to keep the backend URL private and attach JWT tokens server-side.

4. **Deterministic variable income model** -- Uses expected return +/- volatility bands (each as independent compound interest series) instead of Monte Carlo for simplicity and reproducibility.

5. **SQLite with @libsql/client** -- Pure JS driver (no native compilation), runs anywhere without build tools. Drizzle provides type-safe queries and programmatic migrations.

6. **Correct compound interest** -- Monthly rate = `(1 + annualRate)^(1/12) - 1`, NOT simple division by 12.

## API Endpoints

| Method | Path                        | Description              | Auth |
|--------|-----------------------------|--------------------------|------|
| POST   | /api/auth/login             | Login, returns JWT       | No   |
| POST   | /api/auth/register          | Create user account      | No   |
| POST   | /api/simulations            | Create & save simulation | Yes  |
| GET    | /api/simulations            | List simulations (paged) | Yes  |
| GET    | /api/simulations/:id        | Get simulation detail    | Yes  |
| DELETE | /api/simulations/:id        | Delete simulation        | Yes  |
| POST   | /api/simulations/calculate  | Preview (no save)        | Yes  |

Full API documentation available at Swagger UI: http://localhost:3001/documentation

## Business Rules

### Tax Rules (Fixed Income)

**Income Tax (IR)**: 22.5% (<=180d), 20% (181-360d), 17.5% (361-720d), 15% (>720d)

**IOF**: `rate = max(0, 96 - (days-1) * 3)` — only first 30 days

**Order**: IOF on gross income first, then IR on remainder

### Example
R$ 1,000 invested, redeemed day 10, R$ 50 gross income:
- IOF (69%): R$ 34.50
- IR (22.5% on R$ 15.50): R$ 3.49
- **Net income: R$ 12.01**

## Project Structure

```
jeracapital/
├── backend/src/
│   ├── app.ts                 # Fastify app factory
│   ├── server.ts              # Entry point
│   ├── config/env.ts          # Zod env validation
│   ├── db/                    # Drizzle client, migrations, seed
│   ├── engine/                # Pure calculation functions + tests
│   │   ├── tax.ts             # IR + IOF calculations
│   │   ├── fixed-income.ts    # Compound interest series
│   │   ├── variable-income.ts # 3-band volatility model
│   │   └── comparison.ts      # Percentage difference
│   ├── modules/
│   │   ├── auth/              # JWT auth (controller, service, routes)
│   │   └── simulations/       # CRUD (controller, service, repo, routes)
│   └── plugins/               # Swagger, CORS, error handler
├── frontend/src/
│   ├── app/
│   │   ├── (auth)/            # Login, register pages
│   │   ├── (dashboard)/       # Dashboard, simulations, results
│   │   └── api/proxy/         # Backend API proxy
│   ├── auth.ts                # NextAuth v5 config
│   ├── proxy.ts               # Route protection middleware
│   ├── components/
│   │   ├── ui/                # shadcn/ui (auto-managed)
│   │   ├── auth/              # Login/register forms
│   │   ├── dashboard/         # Summary cards, recent simulations
│   │   ├── simulations/       # Form, list, cards, delete dialog
│   │   ├── results/           # Chart, tax breakdown, scenario summary
│   │   └── layout/            # Sidebar, header, mobile nav
│   ├── lib/                   # api-client, format, chart-helpers
│   ├── schemas/               # Zod validation schemas
│   └── types/                 # TypeScript interfaces
├── docs/                      # Tax rules, architecture, API docs, prompts
├── docker-compose.yml
└── CLAUDE.md                  # Project specification
```

## AI Tools Used

This project was developed with assistance from **Claude Code** (Anthropic's CLI for Claude), which helped with:
- Architecture design and step-by-step implementation planning
- TDD workflow for financial calculation engine
- Code generation following layered architecture patterns
- Test writing and verification (69 tests total)
- Documentation and Docker configuration
