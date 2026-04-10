# Prompt 018 - Documentation Consistency Fixes

**Date**: 2026-04-10

---

Fix these documentation inconsistencies:

## 1. CLAUDE.md - Auth Flow item 6
Replace "The same JWT_SECRET must be shared between the backend
and NextAuth." with "Backend uses JWT_SECRET for signing API tokens.
Frontend uses NEXTAUTH_SECRET for encrypting session data. They are
independent and do not need to match."

## 2. README.md - Environment Variables table
Remove the JWT_SECRET row from the Frontend environment variables
table. The frontend does not use JWT_SECRET.

## 3. README.md - Auth Flow item 6
Replace "Same JWT_SECRET shared between backend and NextAuth" with
"Backend uses JWT_SECRET for API tokens; frontend uses NEXTAUTH_SECRET
for session encryption. They are independent."

## 4. docs/api.md - Validation rules table
The periodMonths range says 1-360. We just aligned it to 1-600
on both frontend and backend. Update the table to show 1-600.

## 5. Test count verification
Run `npx vitest run` in both backend/ and frontend/ and update
the test counts in:
- CLAUDE.md (Testing Strategy section, "Test counts" line)
- README.md (Tech Stack table, Testing row)
- README.md (Running Tests section comments)

Make sure all three places show the actual current numbers.

Do not change anything else in the docs.
