# Testing Checklist

Manual QA checklist used to validate the project before submission.

## Setup (Evaluator Simulation)

- [ ] Clone repo to a fresh directory
- [ ] Run `docker-compose up --build`
- [ ] Frontend loads at http://localhost:3000
- [ ] Backend loads at http://localhost:3001
- [ ] Swagger UI loads at http://localhost:3001/docs

## Authentication

- [ ] Login page renders as the initial route
- [ ] Wrong password shows generic error ("Invalid credentials")
- [ ] Non-existent email shows the same generic error
- [ ] Login with admin@test.com / password123 redirects to dashboard
- [ ] Accessing /simulations without login redirects to login page
- [ ] Logout button works and redirects to login
- [ ] After logout, protected routes are inaccessible

## Dashboard

- [ ] Displays total simulations, average investment, latest simulation
- [ ] Empty state renders correctly with zero simulations
- [ ] "View all" link navigates to history page

## New Simulation

- [ ] Form loads with empty fields
- [ ] Submitting empty form shows validation errors
- [ ] Negative values are rejected
- [ ] "Calculate" shows results without saving to database
- [ ] "Save Simulation" persists and appears in history
- [ ] Chart renders with visible, colored lines
- [ ] Tooltip shows "Mês X" with BRL-formatted values
- [ ] Volatility band visible between RV Inferior and RV Superior
- [ ] "Best option" badge appears on the correct scenario
- [ ] Tax breakdown shows correct IOF and IR values

## Calculation Scenarios

- [ ] R$ 10,000 | no contribution | 60 months | RF 12% | RV 18% | vol 10% → gross RF ≈ R$ 17,623
- [ ] R$ 5,000 | R$ 500/month | 24 months | RF 10% | RV 12% | vol 8% → IR 17.5%
- [ ] R$ 1,000 | no contribution | 1 month | RF 10% → IOF 0%, IR 22.5%
- [ ] RF 20% vs RV 10% → "Best option" badge moves to fixed income

## History

- [ ] Lists all saved simulations
- [ ] Clicking a card opens detail view with chart and data
- [ ] Delete icon appears on card hover
- [ ] Deleting a simulation removes it from the list
- [ ] Confirmation dialog before deletion

## Simulation Detail

- [ ] All data matches what was saved
- [ ] Chart renders correctly
- [ ] Delete button present and functional
- [ ] Back button navigates to previous page

## UI/UX

- [ ] Sidebar is fixed, does not scroll with page content
- [ ] Correct accents throughout UI (Simulação, Histórico, Evolução, Tributário, Período, Mês, Médio)
- [ ] Dark mode toggle works
- [ ] Dark mode respects system preference
- [ ] Chart is readable in dark mode
- [ ] Layout adapts to smaller screens (if applicable)

## Automated Tests

- [ ] `cd backend && npm test` — all tests pass
- [ ] `cd frontend && npm test` — all tests pass
- [ ] No skipped or pending tests

## Required Files

- [ ] README.md with technical decisions, setup instructions, assumptions
- [ ] docs/prompts/ contains AI prompts used during development
- [ ] CLAUDE.md present with project specification
- [ ] .env.example in both backend/ and frontend/
- [ ] .gitignore includes node_modules, .env, *.db
- [ ] Semantic commits in git history (`git log --oneline`)

## Security

- [ ] Login error messages are generic (no user enumeration)
- [ ] Another user's simulation returns 404, not 403 or data leak
- [ ] Protected API routes return 401 without JWT
- [ ] Rate limiting active on auth routes
