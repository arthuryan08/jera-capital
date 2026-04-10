# Jera Capital - Investment Calculator

## Project Overview
Full-stack investment calculator that simulates and compares Fixed Income vs Variable Income investments with data persistence, authentication, Brazilian tax rules (IR + IOF), and comparative charting.

## Tech Stack
- **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS, shadcn/ui, shadcn charts (Recharts)
- **Backend**: Fastify 5, TypeScript
- **Database**: SQLite via Drizzle ORM + @libsql/client
- **Auth**: NextAuth.js v5 (Auth.js) with credentials provider (email/password)
- **Validation**: Zod (shared schemas between frontend and backend)
- **Testing**: Vitest (unit + integration)
- **API Docs**: @fastify/swagger + @fastify/swagger-ui
- **Containerization**: Docker + Docker Compose

### Default Ports
- Frontend: 3000
- Backend: 3001
- Swagger UI: http://localhost:3001/docs

## Project Structure
```
jeracapital/
├── frontend/                  # Next.js App Router
│   └── src/
│       ├── app/               # Routes (App Router)
│       │   ├── (auth)/        # Login, register (unauthenticated)
│       │   ├── (dashboard)/   # Dashboard, simulations, results (authenticated)
│       │   └── api/auth/      # NextAuth route handlers
│       ├── auth.ts            # NextAuth v5 config
│       ├── proxy.ts           # Route protection (Next.js 16)
│       ├── components/        # React components
│       │   ├── ui/            # shadcn/ui (auto-managed, do not edit)
│       │   ├── auth/          # Login/register forms, user menu
│       │   ├── dashboard/     # Summary cards, recent simulations
│       │   ├── simulations/   # Form, list, filters, cards
│       │   ├── results/       # Chart, tax breakdown, scenario summary
│       │   └── layout/        # Sidebar, header, mobile nav
│       ├── lib/               # Utilities (api-client, format, chart-helpers)
│       ├── schemas/           # Zod validation schemas
│       ├── types/             # TypeScript type definitions
│       └── hooks/             # Custom React hooks
├── backend/                   # Fastify API
│   └── src/
│       ├── app.ts             # App factory (creates Fastify instance)
│       ├── server.ts          # Entry point (starts server)
│       ├── config/env.ts      # Env validation with Zod
│       ├── db/                # Drizzle client, schema re-exports, migrate
│       ├── engine/            # Pure calculation functions (ZERO side effects)
│       │   ├── fixed-income.ts
│       │   ├── variable-income.ts
│       │   ├── tax.ts
│       │   └── comparison.ts
│       ├── modules/
│       │   ├── simulations/   # Routes, service, repository, schemas, model
│       │   └── auth/          # JWT verification plugin, user model
│       └── plugins/           # Swagger, CORS, error handler
├── docker-compose.yml
├── CLAUDE.md
└── README.md
```

## Architecture Principles

### Backend
- **Route handlers are thin**: parse request -> call service -> return response
- **Service layer orchestrates**: calls engine functions + repository, never accesses DB directly
- **Engine is pure functions**: zero side effects, no DB, no HTTP -- trivially testable
- **Repository handles persistence**: Drizzle queries, always filters by userId for authorization
- **Constructor injection**: Service receives Repository via constructor for testability

### Frontend
- **Server Components by default**: only add "use client" when interactivity is needed
- **Client components**: forms, charts, dropdowns, anything with event handlers or browser APIs
- **API proxy pattern**: client-side requests go through `/api/proxy/[...path]` to keep backend URL secret and attach JWT server-side
- **react-hook-form + Zod**: all forms use zodResolver for validation

### Testing Strategy
- **Engine tests (unit)**: Every pure calculation function is tested with boundary values, zero values, large values, and the spec example. These are the most critical tests as financial calculations must be exact.
- **Integration tests**: API routes tested via `app.inject()` with in-memory SQLite. Cover CRUD operations, auth protection, input validation, and cross-user isolation.
- **Frontend tests**: Zod schema validation, formatting utilities, and chart data transformation.
- **TDD approach**: Engine tests written first, implementation follows. Tests run before commit.
- **Test counts**: 106 backend (72 engine unit + 34 integration) + 56 frontend = 162 total.

### Auth Flow
1. Backend exposes `POST /api/auth/login` which validates email/password with bcrypt and returns a signed JWT with the `JWT_SECRET` envelope.
2. Frontend uses NextAuth v5 with CredentialsProvider which calls the backend login endpoint.
3. The JWT returned by the backend is stored in the NextAuth session via callbacks (jwt + session).
4. Requests from the frontend to the backend pass through the API proxy (`/api/proxy/[...path]`) which injects the JWT into the Authorization header.
5. Backend validates the JWT on all protected routes via the @fastify/jwt plugin.
6. The same `JWT_SECRET` must be shared between the backend and NextAuth.

## Business Rules

### Fixed Income Calculation
- Compound interest: `balance = balance * (1 + monthlyRate) + monthlyContribution`
- Annual to monthly rate: `monthlyRate = (1 + annualRate)^(1/12) - 1`
- NOT simple division by 12

### Variable Income Calculation
- Deterministic model with volatility bands
- Expected line: same compound interest as fixed income but with expected annual return
- Upper band: `expectedAnnualRate + volatility`
- Lower band: `expectedAnnualRate - volatility`
- Each band computed independently as compound interest series

### Tax Rules (Applied to Fixed Income)

#### Income Tax (IR)
| Period          | Rate   |
|----------------|--------|
| <= 180 days    | 22.5%  |
| 181-360 days   | 20.0%  |
| 361-720 days   | 17.5%  |
| > 720 days     | 15.0%  |

#### IOF (Financial Operations Tax)
- Only applies in first 30 days
- Formula: `IOF_rate = max(0, 96 - ((days - 1) * 3))`
- Day 1 = 96%, Day 2 = 93%, ..., Day 30+ = 0%

#### Calculation Order
1. Calculate IOF on gross income: `iof = grossIncome * iofRate`
2. Subtract IOF: `incomeAfterIOF = grossIncome - iof`
3. Calculate IR on remaining: `ir = incomeAfterIOF * irRate`
4. Net income: `incomeAfterIOF - ir`

### Example (must pass as test case)
- Invested R$ 1,000, redeemed day 10, gross income R$ 50
- IOF (day 10 = 69%): R$ 50 x 69% = R$ 34.50
- Income after IOF: R$ 15.50
- IR (<=180d = 22.5%): R$ 15.50 x 22.5% = R$ 3.49 (rounded)
- Net income: R$ 12.01

## API Endpoints
| Method | Path                        | Description              | Auth |
|--------|-----------------------------|--------------------------|------|
| POST   | /api/auth/register          | Create user account      | No   |
| POST   | /api/auth/login             | Login, returns JWT       | No   |
| POST   | /api/simulations            | Create & save simulation | Yes  |
| GET    | /api/simulations            | List simulations (paged) | Yes  |
| GET    | /api/simulations/:id        | Get simulation detail    | Yes  |
| DELETE | /api/simulations/:id        | Delete simulation        | Yes  |
| POST   | /api/simulations/calculate  | Preview (no save)        | Yes  |

## Database Schema (Drizzle)

### simulations table
- `id` (text, UUID, PK)
- `user_id` (text, NOT NULL) -- from JWT
- `name` (text, NOT NULL)
- `initial_amount` (real), `monthly_contribution` (real), `period_months` (integer)
- `fixed_annual_rate` (real), `variable_expected_annual_rate` (real), `variable_volatility` (real)
- `fixed_income_result` (text, JSON), `variable_income_result` (text, JSON)
- `tax_summary` (text, JSON), `comparison_pct_diff` (real)
- `created_at` (text, ISO 8601), `updated_at` (text, ISO 8601)

### users table
- `id` (text, UUID, PK)
- `name` (text), `email` (text, UNIQUE), `password_hash` (text)
- `created_at` (text, ISO 8601)

### Seed Data
In the initial migration, create a default user for the evaluator to test without needing to register:
- Email: admin@test.com
- Password: password123
- Name: Admin

## Claude Code Behavior Instructions

### Project-Specific Rules
- Engine functions (`engine/`) must be pure -- zero imports from `db/`, `modules/`, or external services
- The tax example from business rules (R$1000, day 10, R$50 gross -> R$12.01 net) MUST be a test case
- UI labels and user-facing text in Brazilian Portuguese; code (variables, functions, commits) in English
- Currency formatting: `Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" })`
- Percentages: `Intl.NumberFormat("pt-BR", { style: "percent", minimumFractionDigits: 2 })`
- Components in `ui/` are auto-generated by shadcn -- never edit them manually
- Conventional commits: `feat:`, `fix:`, `test:`, `docs:`, `refactor:`, `chore:`
