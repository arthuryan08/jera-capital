# Prompt 016 - NextAuth Docker UntrustedHost Fix

**Date**: 2026-04-10

---

Docker Compose is failing with NextAuth error:
"UntrustedHost: Host must be trusted. URL was: http://localhost:3000/api/auth/session"

This happens because Auth.js v5 validates the request host and
inside the Docker container the internal hostname doesn't match
NEXTAUTH_URL.

Fix by adding AUTH_TRUST_HOST=true to the frontend environment
variables in docker-compose.yml:

```yaml
frontend:
  environment:
    - AUTH_TRUST_HOST=true
    - BACKEND_URL=http://backend:3001
    - NEXTAUTH_URL=http://localhost:3000
    - NEXTAUTH_SECRET=${NEXTAUTH_SECRET:-dev-secret-change-in-production}
    - JWT_SECRET=${JWT_SECRET:-dev-secret-change-in-production}
```

There is also a second error: "Cannot read properties of undefined
(reading 'name')" — this is likely a component trying to access
session.user.name when the session is null (user not logged in).
Check all components that access session and add optional chaining
(session?.user?.name) or null guards before rendering.

After fixing, rebuild with docker-compose up --build and confirm
there are no errors in the logs.
