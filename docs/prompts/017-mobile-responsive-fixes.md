# Prompt 017 - Mobile Responsive Fixes

**Date**: 2026-04-10

---

The app has several responsive issues on mobile. Fix all of these:

1. SIDEBAR: Has a white bar on the right side when open on mobile.
   The sidebar should take full width or have a proper overlay
   without gaps. Also, when clicking a menu item, the sidebar
   must close automatically.

2. RESULTS ON NEW SIMULATION PAGE: When viewing calculation results
   on mobile, the result cards (Renda Fixa, Renda Variável), the
   comparison percentage, the chart, and the tax breakdown table
   overflow the screen width. All of these need max-w-full and
   overflow-x-hidden or proper responsive layout. The two result
   cards should stack vertically on mobile (grid-cols-1 instead
   of grid-cols-2).

3. SIMULATION DETAIL PAGE (/simulations/:id): Same overflow issue.
   The result cards, chart, and tax table exceed screen width.
   Apply the same responsive fixes as the new simulation page.

4. DASHBOARD: Cards and table overflow on mobile. Summary cards
   should stack vertically. The recent simulations table should
   either scroll horizontally with overflow-x-auto or transform
   into a card layout on mobile.

General rules for the fix:
- Use Tailwind responsive breakpoints (sm:, md:, lg:)
- All containers must have max-w-full overflow-hidden
- Grid layouts: grid-cols-1 on mobile, grid-cols-2 on md+
- Tables: wrap in overflow-x-auto on mobile
- Chart: set min-w-0 on the chart container to prevent overflow
- Test at 375px width (iPhone SE) as the minimum

Do a global search for any fixed widths or min-widths that could
cause overflow on mobile and remove or adjust them.
