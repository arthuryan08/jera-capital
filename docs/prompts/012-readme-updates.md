# Prompt 012 - README Updates

**Date**: 2026-04-09

---

Update README.md with the following changes:

1. Add "Assumptions & Limitations" section after "Business Rules":
   - Form uses whole month periods (minimum 1 month), IOF not applicable via form (unit tests cover IOF for any day count including the spec example)
   - Variable income uses deterministic model with volatility bands, not Monte Carlo (deliberate choice for clarity, reproducibility, testability)
   - Taxes (IR and IOF) applied only to fixed income as specified
   - Compound interest formula: (1 + annual)^(1/12) - 1, not simple division
   - "Best option" badge compares fixed income net vs expected variable income return

2. Expand "AI Tools Used" section with Claude Code + Claude.ai, detailed usage categories (architecture planning, TDD workflow, code generation, debugging, documentation), and link to docs/prompts/

3. Fix Prerequisites: verify actual minimum Node.js version (likely 20+, not 24+), update accordingly

4. Confirm proxy.ts filename is correct (Next.js 16 convention, not middleware.ts)

5. Add prompts/ directory to docs/ in the Project Structure tree
