# Prompt 002 - Architecture & Quality Feedback

**Date**: 2026-04-09

---

Before you continue
In the financial calculations:

Create a standalone service with pure functions for each calculation: compound interest, conversion from annual to monthly rate, IOF (tax on financial transactions) per day, IR (income tax) by bracket, and the complete calculation following this order (IOF first, then IR on the remainder).

I want tests for each function:
Example:
- Invested R$ 1,000, redeemed on the 10th with a gross return of R$ 50:
1. IOF (day 10 = 69%): R$ 50 × 69% = R$ 34.50
2. Return after IOF: R$ 50 - R$ 34.50 = R$ 15.50
3. IR (up to 180 days = 22.5%): R$ 15.50 × 22.5% = R$ 3.49
4. Net return: R$ 12.01

In the code structure:
Clear separation: routes → controllers → services → repositories. The calculation service should not know about the database, the repository should not know about business rules. I want separation of responsibilities. I want Zod validation on route inputs, both in Fastify and in Next.js forms.

In the README:
Generate a robust README with justified technical decisions (why Fastify, why Drizzle, why a deterministic model), calculation assumptions (how you interpret volatility, how you convert annual rates to monthly rates), clear setup instructions (docker-compose up and ready), and the mandatory AI tools section with prompts.

In the frontend:
I want state handling: loading on buttons, empty state in the simulation list, visual error feedback during validation, confirmation toast when saving/deleting. Maturity in usability criteria.

Docker Compose:
A docker-compose.yml that deploys everything with one command. The evaluator clones, runs docker-compose up, and tests. No friction.

Commits:
Conventional semantic commits throughout development: feat: add financial calculation service, test: add IR and IOF calculation tests, feat: add simulation CRUD endpoints. Not just one big commit at the end.
