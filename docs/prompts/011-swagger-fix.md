# Prompt 011 - Swagger UI Fix

**Date**: 2026-04-09

---

The Swagger UI is not accessible at /docs, returning a 404 error.

Check if @fastify/swagger and @fastify/swagger-ui are installed and registered correctly in app.ts. The configuration should be:

1. Register @fastify/swagger with the following options:
   - openapi with info (title: "Jera Capital API", version: "1.0.0")
   - Include securityDefinitions for Bearer JWT

2. Register @fastify/swagger-ui with:
   - routePrefix: "/docs"
   - uiConfig: { docExpansion: "list" }

3. Ensure that both plugins are registered BEFORE the routes.

4. Confirm that the Zod schemas of the routes are being converted to JSON Schema via fastify-type-provider-zod (jsonSchemaTransform) to appear automatically in the documentation.

---

Follow-up: The Swagger UI loads at /docs but fails with "Failed to load API definition - Internal Server Error http://localhost:3001/docs/json".

Probable cause: @fastify/swagger is failing to generate the JSON schema because fastify-type-provider-zod's jsonSchemaTransform is not configured in the Swagger plugin. Add `transform: jsonSchemaTransform` to the swagger registration options.
