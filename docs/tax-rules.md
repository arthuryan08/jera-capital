# Tax Rules - Brazilian Fixed Income

## Income Tax (IR - Imposto de Renda)

Regressive tax applied to **gross income** (after IOF deduction) based on holding period.

| Holding Period     | IR Rate |
|--------------------|---------|
| Up to 180 days     | 22.5%   |
| 181 to 360 days    | 20.0%   |
| 361 to 720 days    | 17.5%   |
| Above 720 days     | 15.0%   |

**Notes:**
- Applied only to income (profit), not the principal
- Rate is determined by the total holding period at redemption
- IR is calculated AFTER IOF deduction

## IOF (Imposto sobre Operacoes Financeiras)

Regressive tax on income during the **first 30 days** of investment.

### Formula

```
IOF_rate(%) = 96 - ((days - 1) * 3)
```

Clamped to `[0, 96]`. After day 30, rate is 0%.

### IOF Table

| Day | Rate (%) | Day | Rate (%) | Day | Rate (%) |
|-----|----------|-----|----------|-----|----------|
| 1   | 96       | 11  | 66       | 21  | 36       |
| 2   | 93       | 12  | 63       | 22  | 33       |
| 3   | 90       | 13  | 60       | 23  | 30       |
| 4   | 87       | 14  | 57       | 24  | 27       |
| 5   | 84       | 15  | 54       | 25  | 24       |
| 6   | 81       | 16  | 51       | 26  | 21       |
| 7   | 78       | 17  | 48       | 27  | 18       |
| 8   | 75       | 18  | 45       | 28  | 15       |
| 9   | 72       | 19  | 42       | 29  | 12       |
| 10  | 69       | 20  | 39       | 30+ | 0        |

## Calculation Order

**IOF is applied first, then IR on the remainder.**

1. Calculate gross income: `grossIncome = finalBalance - totalInvested`
2. Calculate IOF: `iofAmount = grossIncome * iofRate`
3. Subtract IOF: `incomeAfterIOF = grossIncome - iofAmount`
4. Calculate IR: `irAmount = incomeAfterIOF * irRate`
5. Net income: `netIncome = incomeAfterIOF - irAmount`
6. Final net balance: `totalInvested + netIncome`

## Worked Example

**Scenario:** Invested R$ 1,000.00, redeemed on day 10 with gross income of R$ 50.00

| Step | Calculation | Result |
|------|-------------|--------|
| 1. IOF rate (day 10) | `96 - ((10 - 1) * 3) = 69%` | 69% |
| 2. IOF amount | `R$ 50.00 * 69%` | R$ 34.50 |
| 3. Income after IOF | `R$ 50.00 - R$ 34.50` | R$ 15.50 |
| 4. IR rate (<=180 days) | Bracket lookup | 22.5% |
| 5. IR amount | `R$ 15.50 * 22.5%` | R$ 3.49 |
| 6. **Net income** | `R$ 15.50 - R$ 3.49` | **R$ 12.01** |

## Implementation Reference

- `backend/src/engine/tax.ts` - Pure functions: `calculateIOFRate()`, `calculateIRRate()`, `calculateTax()`
- `backend/src/engine/tax.test.ts` - 14 unit tests covering all brackets and edge cases
- Holding days approximation: `periodMonths * 30`
