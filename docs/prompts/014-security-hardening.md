# Prompt 014 - Security Hardening

**Date**: 2026-04-10

---

Quick security hardening pass. Do not refactor existing code, just add these specific protections:

1. **Auth error messages**: ensure login returns a generic "Invalid credentials" message for both wrong password and non-existent email, so attackers cannot enumerate valid accounts.

2. **Helmet**: register @fastify/helmet globally in app.ts to add standard security headers (X-Content-Type-Options: nosniff, X-Frame-Options, etc.).

3. **Rate limiting**: register @fastify/rate-limit with `global: false` and apply per-route on auth endpoints only (POST /api/auth/login and POST /api/auth/register): max 5 attempts per minute per IP. Make the max configurable via AppOptions so integration tests can use a high limit (e.g., 1000) to avoid flaky 429s.

4. **IDOR protection**: verify that ALL repository queries filter by userId (findById, delete, update, list). A user must never be able to access or modify another user's simulation. Cross-user access should return 404 (not 403) to avoid leaking resource existence.

5. **Security integration tests**: add to simulation.routes.test.ts:
   - Login with wrong password returns generic "Invalid credentials"
   - Login with non-existent email returns the same generic message
   - GET /api/simulations/:id of another user's simulation returns 404
   - DELETE /api/simulations/:id of another user's simulation returns 404 and the resource still exists for the owner
   - All protected routes return 401 without a JWT (even with a valid payload)
   - Responses include helmet security headers

Do not mock the database — use the same in-memory SQLite pattern as the existing integration tests.
