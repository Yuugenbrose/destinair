import { Hono } from 'hono';

export const simulatorRoutes = new Hono();

// IRPF 2024 brackets (monthly)
const BRACKETS = [
  { min: 0,       max: 2259.20,  rate: 0,     deduction: 0 },
  { min: 2259.21, max: 2826.65,  rate: 0.075, deduction: 169.44 },
  { min: 2826.66, max: 3751.05,  rate: 0.15,  deduction: 381.44 },
  { min: 3751.06, max: 4664.68,  rate: 0.225, deduction: 662.77 },
  { min: 4664.69, max: Infinity, rate: 0.275, deduction: 896.00 },
];

// POST /api/simulator/calculate
simulatorRoutes.post('/calculate', async (c) => {
  const { monthlyIncome, annualDeductions = 0 } = await c.req.json();
  if (!monthlyIncome || monthlyIncome <= 0) return c.json({ error: 'Renda mensal é obrigatória' }, 400);

  const adjustedMonthly = Math.max(0, monthlyIncome - (annualDeductions / 12));
  let annualTax = 0;

  for (let i = 0; i < 12; i++) {
    for (const bracket of BRACKETS) {
      if (adjustedMonthly >= bracket.min && (adjustedMonthly <= bracket.max || bracket.max === Infinity)) {
        annualTax += Math.max(0, (adjustedMonthly * bracket.rate) - bracket.deduction);
        break;
      }
    }
  }

  const maxFDCA = annualTax * 0.03;
  const maxFDI = annualTax * 0.03;

  return c.json({
    annualIncome: monthlyIncome * 12,
    annualDeductions,
    adjustedAnnualIncome: adjustedMonthly * 12,
    estimatedTax: Math.round(annualTax * 100) / 100,
    maxFDCA: Math.round(maxFDCA * 100) / 100,
    maxFDI: Math.round(maxFDI * 100) / 100,
    maxTotal: Math.round((maxFDCA + maxFDI) * 100) / 100,
    note: 'Estimativa educativa. Para valores exatos, consulte o programa da Receita Federal.',
  });
});
