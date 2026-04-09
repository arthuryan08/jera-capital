# Prompt 001 - Initial Project Specification

**Date**: 2026-04-09

---

Okay, let's begin. I need you to use the Superpowers Brainstorm tool to create a complete CLAUDE.md document about the project we're going to develop. This document will have a complete overview of the project and behavior patterns for Claude Code.

First, this CLAUDE.md document needs to be extremely complete with absolutely everything we're going to develop, the project in general, as well as instructions on how you should create each task for this project.

About the project:
Investment calculator with data persistence
What the system should be able to do:

- Simulate and compare investments in Fixed Income and Variable Income
- Save simulations for later consultation
- View simulation history

Functional Requirements
(Simulation)

The user should be able to enter:
- Simulation name
- Initial investment value
- Monthly contribution (optional)
- Period in months
- Annual interest rate (fixed income)
- Expected annual return + volatility (variable income)
The application should calculate and display:
- Projected final value for each scenario
- Comparative graph of month-by-month evolution
- Percentage difference between scenarios
- Applicable Income Tax and IOF (Financial Operations Tax)
Persistence
- Save each simulation in the database
- List history of saved simulations
- View details of a saved simulation
- Delete simulation

Tax Rules (Fixed Income)
Income Tax Table
Term - Rate
Up to 180 days - 22.5%
181 to 360 days - 20%
361 to 720 days - 17.5%
Above 720 days - 15%

IOF Table
IOF is levied on income in the first 30 days, with a regressive rate.

IOF = 96 - ((days - 1) × 3)

Day - Rate
1 - 96%
2 - 93%
10 - 69%
29 - 12%
30+ - 0% (exempt)

Calculation Order
1. First IOF (on gross income)
2. Then IR (on the income remaining after IOF)

Complete Example:
Invested R$ 1,000, redeemed on day 10 with gross income of R$ 50:
1. IOF (day 10 = 69%): R$ 50 × 69% = R$ 34.50
2. Income after IOF: R$ 50 - R$ 34.50 = R$ 15.50
3. IR (up to 180 days = 22.5%): R$ 15.50 × 22.5% = R$ 3.49
4. Net income: R$ 12.01

Required Stack
Frontend
Next.js, TypeScript, Tailwind CSS (to speed things up, we'll use shadcn components)

Backend
Node.js (Express, Fastify, NestJS...)

Database
SQLite or in-memory database
The project must run locally without needing to install an external database.

Technical Requirements
Required
- Architecture: Organize the code with a clear separation of responsibilities. Choose the architecture you prefer and be prepared to justify it.

- Calculations: Compound interest, correct conversion of annual to monthly rates, correct application of income tax and IOF.

- Database: Use migrations to create the tables.

- Tests: Unit tests for financial calculations (interest, income tax, IOF).

Key Differentiators (LET'S DO IT)
- Simple authentication (can be basic, without registration, but we'll make it complete, possibly with next auth)
- Integration tests
- Data validation (Zod, Yup, FluentValidation)
- API documentation (Swagger)
- Docker / Docker Compose
- Organized and semantic commits

What I want in terms of organization and architecture:
Architecture - Separation of responsibilities, decoupled and testable code
Modeling - Table structure, correct migrations
Business rules - Correct calculations (interest, income tax, IOF)
Testing - Calculation coverage, readable tests
Code - Typing, naming conventions, clarity
Frontend - Structured components, usability, state handling
README - Technical decisions, assumptions, setup instructions, AI tools used
