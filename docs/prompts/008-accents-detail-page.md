# Prompt 008 - Accents, Detail Page Improvements

**Date**: 2026-04-09

---

Adjustments to the simulation detail page:

1. Fix accents across the entire UI: "Simulacao" -> "Simulação", "Historico" -> "Histórico", "Evolucao Patrimonial" -> "Evolução Patrimonial", "Detalhamento Tributario" -> "Detalhamento Tributário", "Mes" -> "Mês". Do a global search in the frontend for unaccented words.

2. Add a delete simulation button in the detail page header (trash icon, discreet red color, with confirmation Dialog before deleting). After deletion, redirect to the history page.

3. The subtitle with parameters is too long on a single line. Separate "Created on" on the first line and the parameters as badges or chips on the second line.
