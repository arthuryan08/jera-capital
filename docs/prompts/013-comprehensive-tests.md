# Prompt 013 - Comprehensive Test Coverage

**Date**: 2026-04-09

---

Expand test coverage significantly across the entire project. Read existing tests first, then add missing cases.

## Backend Tests

### Engine (unit tests - pure functions, critical)

**tax.ts**: IOF for every boundary day (1, 2, 10, 29, 30, 31), IOF with zero gross income, IOF with negative days, IR for every bracket boundary (180, 181, 360, 361, 720, 721), full calculation order (IOF first then IR on remainder), the spec example (R$50 gross income day 10 = net R$12.01), zero gross income, large values (R$1,000,000) for precision.

**fixed-income.ts**: Annual to monthly rate conversion (10% annual = 0.7974% monthly, NOT 0.8333%), compound interest without/with monthly contribution, zero initial amount, zero monthly contribution, periods of 1/12/60/120 months, zero interest rate, large values, series length verification, spot check months 1 and 2.

**variable-income.ts**: Expected line matches fixed income with same rate, upper band uses (rate + volatility), lower band uses (rate - volatility), zero volatility = all lines identical, high volatility divergence, with/without monthly contributions, series length.

**comparison.ts**: Positive/negative/zero difference, correct percentage formula.

### Modules (integration tests)

**simulation routes**: Create/save, validate required fields, reject invalid data, calculate preview without saving, list only authenticated user's simulations, empty list for new user, get by id, 404 for non-existent, 404 for another user's simulation, delete returns 204, delete non-existent returns 404, cannot delete another user's simulation, all routes require auth, invalid JWT rejected.

**auth routes**: Login with valid/invalid credentials, non-existent email, validate required fields, register creates user and returns JWT, reject duplicate email, validate email format, validate password minimum length.

## Frontend Tests

### Schemas
- Simulation form: valid data, zero/negative initial amount, zero/negative period, negative rates, boundary values (min/max)
- Auth schemas: valid email+password, invalid email, empty password, short password

### Utilities
- Currency formatter: BRL format, zero, negative, large values, rounding
- Percentage formatter: correct format
- Chart data helpers: merge fixed+variable, empty arrays, mismatched lengths both directions

## After tests pass, update CLAUDE.md with Testing Strategy section and commit.
