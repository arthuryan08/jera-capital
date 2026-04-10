# Prompt 015 - Docker Client-Side Backend URL Fix

**Date**: 2026-04-10

---

In docker-compose.yml, the frontend references the backend as `http://backend:3001` (the Docker service name), which works for server-side calls (API proxy, NextAuth). However, if any call is made directly from the browser (client-side), it will fail because the browser cannot resolve `backend` as a hostname.

Confirm that all frontend calls go through the API proxy (`/api/proxy/[...path]`) and never call `http://backend:3001` directly from the client. If any client component is calling the backend directly (e.g., via `NEXT_PUBLIC_BACKEND_URL`), fix it by routing the call through a server-side Next.js route handler that forwards to the backend using the server-only `BACKEND_URL`.

Otherwise, the compose file is clean: persistent volume for SQLite, correct `depends_on`, variables with fallback to dev, mapped ports. The evaluator runs `docker-compose up --build` and it works.
