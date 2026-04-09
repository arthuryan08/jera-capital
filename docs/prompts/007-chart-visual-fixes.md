# Prompt 007 - Chart Visual Fixes

**Date**: 2026-04-09

---

The Equity Evolution chart has serious visual issues. The lines are practically invisible because they are all in similar gray tones without adequate strokeWidth.

Fix:

1. Define distinct and visible colors for each line:
   - Fixed Income: blue (e.g., hsl(221, 83%, 53%))
   - Expected RV: green (e.g., hsl(142, 71%, 45%))
   - Upper RV: light green dashed (strokeDasharray="5 5")
   - Lower RV: light green dashed (strokeDasharray="5 5")
   - Total Invested: gray dashed (strokeDasharray="3 3")

2. strokeWidth={2} for Fixed Income and Expected RV, strokeWidth={1} for bands and total invested

3. The volatility range (Area between lower and upper) should have green fill with opacity 0.1

4. Remove the large black hover dots. Use activeDot={{ r: 4 }} and dot={false} on Lines

5. Update chartConfig with these same colors so the legend reflects the correct colors

The lines must be clearly distinguishable without hover.

---

The volatility range in the chart is not correctly aligned with the Lower RV line. The base of the shaded area should start exactly at the Lower RV line and end at the Upper RV line.

Use the correct Recharts solution for range areas: a single `<Area>` with dataKey pointing to an array [rvLower, rvUpper].

In the chart data array, add a field:

```
volatilityBand: [lowerRVvalue, upperRVvalue]
```

And in the component use:

```jsx
<Area
  type="monotone"
  dataKey="volatilityBand"
  fill="hsl(var(--chart-2))"
  fillOpacity={0.15}
  stroke="none"
  legendType="none"
  tooltipType="none"
  isRange={true}
/>
```

Remove the two current `<Area>` and replace with this single one.

Also fix the tooltip:
- "Month" should show the month number (e.g., "Month 54"), not "Upper RV Month"
- Values should be formatted as BRL currency
