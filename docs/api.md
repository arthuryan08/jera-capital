# API Reference

Base URL: `http://localhost:3001`
Swagger UI: `http://localhost:3001/docs`

All simulation endpoints require `Authorization: Bearer <token>` header.

---

## Auth

### POST /api/auth/register

Create a new user account.

**Request:**
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "minhasenha123"
}
```

**Response (201):**
```json
{
  "user": {
    "id": "uuid",
    "name": "João Silva",
    "email": "joao@example.com"
  },
  "token": "eyJhbGciOi..."
}
```

**Errors:**
- `409` - Email already registered
- `400` - Validation error (Zod)

---

### POST /api/auth/login

Authenticate and receive a JWT token.

**Request:**
```json
{
  "email": "joao@example.com",
  "password": "minhasenha123"
}
```

**Response (200):**
```json
{
  "user": {
    "id": "uuid",
    "name": "João Silva",
    "email": "joao@example.com"
  },
  "token": "eyJhbGciOi..."
}
```

**Errors:**
- `401` - Invalid credentials

---

## Simulations

### POST /api/simulations

Create a simulation, calculate results, and save to database.

**Request:**
```json
{
  "name": "Minha Simulacao",
  "initialAmount": 10000,
  "monthlyContribution": 500,
  "periodMonths": 24,
  "fixedAnnualRate": 0.12,
  "variableExpectedAnnualRate": 0.15,
  "variableVolatility": 0.05
}
```

**Validation rules:**
| Field | Type | Rules |
|-------|------|-------|
| `name` | string | min 1, max 200 |
| `initialAmount` | number | >= 0 |
| `monthlyContribution` | number | >= 0 |
| `periodMonths` | integer | 1-360 |
| `fixedAnnualRate` | number | > 0, <= 1 (decimal, e.g. 0.12 = 12%) |
| `variableExpectedAnnualRate` | number | > 0, <= 1 |
| `variableVolatility` | number | >= 0, <= 1 |

**Response (201):**
```json
{
  "id": "uuid",
  "userId": "uuid",
  "name": "Minha Simulacao",
  "initialAmount": 10000,
  "monthlyContribution": 500,
  "periodMonths": 24,
  "fixedAnnualRate": 0.12,
  "variableExpectedAnnualRate": 0.15,
  "variableVolatility": 0.05,
  "fixedIncomeResult": "{...json...}",
  "variableIncomeResult": "{...json...}",
  "taxSummary": "{...json...}",
  "comparisonPctDiff": -2.45,
  "createdAt": "2026-04-09T20:00:00.000Z",
  "updatedAt": "2026-04-09T20:00:00.000Z"
}
```

---

### POST /api/simulations/calculate

Preview calculation without saving. Same body as POST /api/simulations but without `name`.

**Request:**
```json
{
  "initialAmount": 10000,
  "monthlyContribution": 500,
  "periodMonths": 24,
  "fixedAnnualRate": 0.12,
  "variableExpectedAnnualRate": 0.15,
  "variableVolatility": 0.05
}
```

**Response (200):**
```json
{
  "fixed": {
    "monthlyEvolution": [
      { "month": 1, "totalInvested": 10500, "grossBalance": 10594.89, "monthlyInterest": 94.89 },
      ...
    ],
    "finalGrossBalance": 18432.12,
    "finalNetBalance": 17845.67,
    "totalInvested": 22000,
    "grossIncome": 2432.12,
    "taxResult": {
      "grossIncome": 2432.12,
      "iofRate": 0,
      "iofAmount": 0,
      "irRate": 0.175,
      "irAmount": 425.62,
      "netIncome": 2006.50
    }
  },
  "variable": {
    "monthlyEvolution": [
      { "month": 1, "expected": 10617.07, "upper": 10658.85, "lower": 10575.31, "totalInvested": 10500 },
      ...
    ],
    "finalExpected": 19123.45,
    "finalUpper": 20567.89,
    "finalLower": 17823.12,
    "totalInvested": 22000,
    "expectedTaxResult": { ... }
  },
  "pctDiff": -3.21
}
```

---

### GET /api/simulations

List all simulations for the authenticated user (paginated).

**Query parameters:**
| Param | Type | Default | Range |
|-------|------|---------|-------|
| `page` | integer | 1 | >= 1 |
| `limit` | integer | 20 | 1-100 |

**Response (200):**
```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Minha Simulacao",
      "initialAmount": 10000,
      "periodMonths": 24,
      "comparisonPctDiff": -2.45,
      "createdAt": "2026-04-09T20:00:00.000Z",
      ...
    }
  ],
  "total": 15,
  "page": 1,
  "limit": 20
}
```

---

### GET /api/simulations/:id

Get full details of a single simulation (with parsed JSON results).

**Response (200):**
```json
{
  "id": "uuid",
  "name": "Minha Simulacao",
  "initialAmount": 10000,
  "monthlyContribution": 500,
  "periodMonths": 24,
  "fixedAnnualRate": 0.12,
  "variableExpectedAnnualRate": 0.15,
  "variableVolatility": 0.05,
  "fixedIncomeResult": { "monthlyEvolution": [...], "finalGrossBalance": 18432.12, ... },
  "variableIncomeResult": { "monthlyEvolution": [...], "finalExpected": 19123.45, ... },
  "taxSummary": { "fixed": { ... }, "variable": { ... } },
  "comparisonPctDiff": -2.45,
  "createdAt": "2026-04-09T20:00:00.000Z",
  "updatedAt": "2026-04-09T20:00:00.000Z"
}
```

**Errors:**
- `404` - Simulation not found (or belongs to another user)

---

### DELETE /api/simulations/:id

Delete a simulation.

**Response:** `204 No Content`

**Errors:**
- `404` - Simulation not found (or belongs to another user)

---

## Error Format

All errors follow this structure:

```json
{
  "error": "Error message"
}
```

Validation errors (Zod):
```json
{
  "error": "Validation Error",
  "details": {
    "fieldName": ["Error message"]
  }
}
```

## Authentication

All `/api/simulations/*` endpoints require:

```
Authorization: Bearer <jwt-token>
```

JWT payload:
```json
{
  "sub": "user-uuid",
  "email": "user@example.com",
  "iat": 1712700000,
  "exp": 1713304800
}
```

Token expires in 7 days.
