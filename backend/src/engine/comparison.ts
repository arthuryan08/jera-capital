export function calculatePercentageDiff(
  fixedFinalNet: number,
  variableFinalExpectedNet: number
): number {
  if (variableFinalExpectedNet === 0) return Infinity;
  return Math.round(
    ((fixedFinalNet - variableFinalExpectedNet) / variableFinalExpectedNet) * 10000
  ) / 100;
}
