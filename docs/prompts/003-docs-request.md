# Prompt 003 - Documentation Request

**Date**: 2026-04-09

---

Create a folder called docs/
docs/prompts/
Save all the prompts I send you in this folder.

docs/tax-rules.md
The IR and IOF rules extracted from the PDF, clearly formatted. Use as a reference. Includes the IR table, the IOF formula, the calculation order...

docs/architecture.md
A simple diagram (can be text/mermaid) showing the flow: Frontend → API Routes → Controllers → Services → Repositories → SQLite. Justify the choices (Fastify, Drizzle, Vitest, deterministic model).

docs/api.md
Quick reference to the endpoints, even if you have Swagger. Something like: POST /simulations, GET /simulations, GET /simulations/:id, DELETE /simulations/:id, POST /auth/login. With the expected payloads. Use this as context to maintain consistency.
