import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, Info, ArrowRight, TrendingUp, Heart, Users } from 'lucide-react';
import './Simulador.css';

/* Tabela IRPF 2024 (exercício 2025) — atualizar conforme vigente */
const TAX_BRACKETS = [
  { min: 0,       max: 2259.20,  rate: 0,     deduction: 0 },
  { min: 2259.21, max: 2826.65,  rate: 0.075, deduction: 169.44 },
  { min: 2826.66, max: 3751.05,  rate: 0.15,  deduction: 381.44 },
  { min: 3751.06, max: 4664.68,  rate: 0.225, deduction: 662.77 },
  { min: 4664.69, max: Infinity, rate: 0.275, deduction: 896.00 },
];

function calculateTax(monthlyIncome) {
  const annual = monthlyIncome * 12;
  let totalTax = 0;

  for (let i = 0; i < 12; i++) {
    for (const bracket of TAX_BRACKETS) {
      if (monthlyIncome >= bracket.min && monthlyIncome <= bracket.max) {
        totalTax += (monthlyIncome * bracket.rate) - bracket.deduction;
        break;
      }
      if (monthlyIncome > bracket.max && bracket.max === Infinity) {
        totalTax += (monthlyIncome * bracket.rate) - bracket.deduction;
        break;
      }
    }
  }

  return Math.max(0, totalTax);
}

function formatCurrency(val) {
  return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function Simulador() {
  const [income, setIncome] = useState('');
  const [deductions, setDeductions] = useState('');

  const results = useMemo(() => {
    const monthlyIncome = parseFloat(income.replace(/\D/g, '')) / 100 || 0;
    const totalDeductions = parseFloat(deductions.replace(/\D/g, '')) / 100 || 0;

    const adjustedMonthly = Math.max(0, monthlyIncome - totalDeductions / 12);
    const taxDue = calculateTax(adjustedMonthly);

    const maxFDCA = taxDue * 0.03;
    const maxFDI = taxDue * 0.03;
    const maxTotal = maxFDCA + maxFDI;

    return {
      annualIncome: monthlyIncome * 12,
      taxDue,
      maxFDCA,
      maxFDI,
      maxTotal,
      hasResults: monthlyIncome > 0,
    };
  }, [income, deductions]);

  function handleCurrencyInput(setter) {
    return (e) => {
      const raw = e.target.value.replace(/\D/g, '');
      if (!raw) { setter(''); return; }
      const val = (parseInt(raw) / 100).toLocaleString('pt-BR', { minimumFractionDigits: 2 });
      setter(val);
    };
  }

  return (
    <div className="simulador">
      <section className="cf-hero section--dark">
        <div className="container">
          <div className="section-header">
            <span className="section-header__tag" style={{ color: 'var(--color-accent-light)' }}>Simulador</span>
            <h1 className="section-header__title">Quanto você pode destinar?</h1>
            <p className="section-header__subtitle">
              Informe sua renda mensal e descubra em tempo real quanto do seu imposto pode
              ser direcionado para causas sociais — sem pagar nada a mais.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="sim-layout">
            {/* Form */}
            <div className="sim-form card">
              <h2 className="sim-form__title">
                <Calculator size={24} />
                Dados para simulação
              </h2>

              <div className="form-group">
                <label className="form-label">Renda mensal bruta (R$)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ex: 5.000,00"
                  value={income}
                  onChange={handleCurrencyInput(setIncome)}
                  id="sim-income"
                />
                <span className="form-hint">Salário bruto antes de descontos</span>
              </div>

              <div className="form-group">
                <label className="form-label">Deduções anuais aproximadas (R$)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ex: 12.000,00 (opcional)"
                  value={deductions}
                  onChange={handleCurrencyInput(setDeductions)}
                  id="sim-deductions"
                />
                <span className="form-hint">Saúde, educação, previdência, dependentes, etc.</span>
              </div>

              <div className="sim-form__info">
                <Info size={16} />
                <span>Esta simulação é uma estimativa educativa. Para valores exatos, consulte o programa da Receita Federal.</span>
              </div>
            </div>

            {/* Results */}
            <div className="sim-results">
              <div className="sim-result-card card">
                <div className="sim-result-card__header">
                  <TrendingUp size={20} />
                  <span>Imposto de Renda estimado</span>
                </div>
                <div className="sim-result-card__value">
                  {results.hasResults ? formatCurrency(results.taxDue) : '—'}
                </div>
                <div className="sim-result-card__sub">
                  Renda anual: {results.hasResults ? formatCurrency(results.annualIncome) : '—'}
                </div>
              </div>

              <div className="sim-result-card sim-result-card--fdca card">
                <div className="sim-result-card__header">
                  <Users size={20} />
                  <span>FDCA — Criança e Adolescente</span>
                </div>
                <div className="sim-result-card__value sim-result-card__value--highlight">
                  {results.hasResults ? formatCurrency(results.maxFDCA) : '—'}
                </div>
                <div className="sim-result-card__sub">Até 3% do imposto devido</div>
              </div>

              <div className="sim-result-card sim-result-card--fdi card">
                <div className="sim-result-card__header">
                  <Heart size={20} />
                  <span>FDI — Pessoa Idosa</span>
                </div>
                <div className="sim-result-card__value sim-result-card__value--highlight">
                  {results.hasResults ? formatCurrency(results.maxFDI) : '—'}
                </div>
                <div className="sim-result-card__sub">Até 3% do imposto devido</div>
              </div>

              <div className="sim-total">
                <div className="sim-total__label">Total que você pode destinar</div>
                <div className="sim-total__value">
                  {results.hasResults ? formatCurrency(results.maxTotal) : '—'}
                </div>
                <div className="sim-total__sub">6% do imposto devido — sem custo adicional</div>
              </div>

              {results.hasResults && results.maxTotal > 0 && (
                <div className="sim-cta">
                  <Link to="/fundos" className="btn btn--primary btn--lg btn--full">
                    Encontrar fundos para destinar <ArrowRight size={18} />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
