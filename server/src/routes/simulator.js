import { Hono } from 'hono';
import { parseBody, INVALID_BODY_ERROR } from '../utils/http.js';

export const simulatorRoutes = new Hono();

// ============================================================================
// Simulador IRPF — regras vigentes em 2026
// ============================================================================
// Fontes: Receita Federal (orientação de 01/2026 sobre a Lei 15.270/2025) e
// Lei nº 8.069/1990 (art. 260, ECA) + Lei nº 12.213/2010 (Fundo do Idoso).
//
// 1) TABELA PROGRESSIVA MENSAL — as faixas e alíquotas nominais NÃO mudaram
//    em 2026 (a última atualização de faixas foi em 2015/2023). O que mudou
//    foi a criação de um REDUTOR adicional (item 2).
// 2) REDUTOR DA LEI 15.270/2025 — zera o imposto para quem tem rendimento
//    tributável mensal até R$ 5.000,00 e reduz parcialmente até R$ 7.350,00.
//    Fórmula oficial: redutor = 978,62 - (0,133145 × rendimento_mensal_bruto)
//    Acima de R$ 7.350,00/mês, não há redutor (tabela tradicional pura).
// 3) DESTINAÇÃO (ECA / Fundo do Idoso) — o percentual NÃO mudou: até 3% do
//    imposto devido para fundos FDCA + até 3% para fundos FDI, limitado a
//    6% no total. DARFs: código 3351 (FDCA) e 9090 (FDI).
// ============================================================================

// Tabela progressiva mensal vigente (parcela a deduzir oficial da Receita Federal)
const BRACKETS = [
  { min: 0,       max: 2428.80,  rate: 0,     deduction: 0 },
  { min: 2428.81, max: 2826.65,  rate: 0.075, deduction: 182.16 },
  { min: 2826.66, max: 3751.05,  rate: 0.15,  deduction: 394.16 },
  { min: 3751.06, max: 4664.68,  rate: 0.225, deduction: 675.49 },
  { min: 4664.69, max: Infinity, rate: 0.275, deduction: 908.73 },
];

const REDUTOR_TETO_RENDA = 7350.00; // acima disso, redutor da Lei 15.270/2025 não se aplica
const REDUTOR_A = 978.62;
const REDUTOR_B = 0.133145;

// Desconto simplificado mensal = 25% do teto da 1ª faixa da tabela (2.428,80 × 0.25 = 607,20).
// A Receita Federal SEMPRE aplica o maior entre este valor e as deduções legais informadas
// pelo contribuinte (INSS, dependentes, saúde, educação...) — nunca soma os dois nem ignora
// o desconto simplificado quando o contribuinte não informa nenhuma dedução própria. Sem
// isso, a isenção "até R$5.000/mês" da Lei 15.270/2025 nunca se completa no cálculo, mesmo
// para quem realmente está isento na prática.
const DESCONTO_SIMPLIFICADO_MENSAL = 607.20;

function calcularImpostoMensal(baseCalculo) {
  for (const bracket of BRACKETS) {
    if (baseCalculo >= bracket.min && (baseCalculo <= bracket.max || bracket.max === Infinity)) {
      return Math.max(0, baseCalculo * bracket.rate - bracket.deduction);
    }
  }
  return 0;
}

// POST /api/simulator/calculate
simulatorRoutes.post('/calculate', async (c) => {
  const body = await parseBody(c);
  if (!body) return c.json({ error: INVALID_BODY_ERROR }, 400);
  const { monthlyIncome, annualDeductions = 0 } = body;
  if (!monthlyIncome || monthlyIncome <= 0) return c.json({ error: 'Renda mensal é obrigatória' }, 400);

  // Base de cálculo mensal: renda bruta menos o MAIOR entre o desconto simplificado
  // mensal (R$ 607,20) e as deduções anuais informadas (pro-rata mensal) — nunca os dois
  // somados, e nunca zero quando o contribuinte não informa dedução própria.
  const deducaoMensalPropria = annualDeductions / 12;
  const deducaoMensalEfetiva = Math.max(DESCONTO_SIMPLIFICADO_MENSAL, deducaoMensalPropria);
  const baseMensal = Math.max(0, monthlyIncome - deducaoMensalEfetiva);

  // 1) Imposto pela tabela progressiva tradicional
  const impostoTabela = calcularImpostoMensal(baseMensal);

  // 2) Redutor da Lei 15.270/2025 (usa a renda BRUTA mensal, não a base já deduzida,
  //    conforme a metodologia da Receita Federal para o cálculo do redutor)
  let redutor = 0;
  if (monthlyIncome <= REDUTOR_TETO_RENDA) {
    redutor = Math.max(0, REDUTOR_A - (REDUTOR_B * monthlyIncome));
    redutor = Math.min(redutor, impostoTabela); // nunca gera crédito, só zera no limite do imposto apurado
  }

  const impostoMensalDevido = Math.max(0, impostoTabela - redutor);
  const annualTax = impostoMensalDevido * 12;

  // 3) Destinação: até 3% para FDCA + até 3% para FDI = até 6% do imposto devido
  const maxFDCA = annualTax * 0.03;
  const maxFDI = annualTax * 0.03;

  return c.json({
    annualIncome: monthlyIncome * 12,
    annualDeductions,
    adjustedAnnualIncome: baseMensal * 12,
    monthlyDeductionUsed: Math.round(deducaoMensalEfetiva * 100) / 100,
    monthlyTaxBeforeReduction: Math.round(impostoTabela * 100) / 100,
    monthlyReduction: Math.round(redutor * 100) / 100,
    estimatedTax: Math.round(annualTax * 100) / 100,
    maxFDCA: Math.round(maxFDCA * 100) / 100,
    maxFDI: Math.round(maxFDI * 100) / 100,
    maxTotal: Math.round((maxFDCA + maxFDI) * 100) / 100,
    darfCodes: { FDCA: '3351', FDI: '9090' },
    note: 'Estimativa educativa com base na tabela progressiva vigente, no desconto simplificado mensal (ou nas deduções informadas, o que for maior) e no redutor da Lei nº 15.270/2025. Para valores exatos, consulte o programa da Receita Federal ou um contador.',
  });
});
