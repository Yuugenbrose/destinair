import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Calculator, Save, Info, CheckCircle, Search } from 'lucide-react';
import './Simulador.css';

const fmt = v => (v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

// Hook pequeno e reutilizável: busca fundos de UM tipo (FDCA ou FDI) no
// servidor conforme a pessoa digita, em vez de carregar os ~7 mil fundos do
// catálogo de uma vez só (o que nem é mais possível com a paginação da API,
// e não faria sentido num <select> mesmo que fosse).
function useFundSearch(type) {
  const [term, setTerm] = useState('');
  const [debounced, setDebounced] = useState('');
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(term), 300);
    return () => clearTimeout(t);
  }, [term]);

  useEffect(() => {
    setLoading(true);
    api.getFunds({ type, search: debounced, pageSize: 50 })
      .then(data => setOptions(data.funds || []))
      .finally(() => setLoading(false));
  }, [type, debounced]);

  return { term, setTerm, options, loading };
}

function FundPicker({ type, value, onChange }) {
  const { term, setTerm, options, loading } = useFundSearch(type);
  return (
    <div className="form-group mt-4">
      <div className="fund-picker__search">
        <Search size={16} />
        <input
          className="form-input"
          placeholder={`Digite o nome da cidade ou do fundo ${type}...`}
          value={term}
          onChange={e => setTerm(e.target.value)}
        />
      </div>
      <select className="form-input form-select mt-2" value={value} onChange={e => onChange(e.target.value)}>
        <option value="">{loading ? 'Buscando...' : `Selecione um fundo ${type} (${options.length} encontrados)`}</option>
        {options.map(f => <option key={f.id} value={f.id}>{f.name}</option>)}
      </select>
    </div>
  );
}

export default function Simulador() {
  const { user } = useAuth();
  const [income, setIncome] = useState('');
  const [deductions, setDeductions] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Duas alocações independentes — uma para um fundo FDCA, outra para um fundo FDI.
  // Cada uma tem seu próprio teto de até 3% e seu próprio fundo escolhido, porque
  // por lei são dois limites separados (nunca um fundo único recebendo os 6%).
  const [selectedFundFDCA, setSelectedFundFDCA] = useState('');
  const [selectedFundFDI, setSelectedFundFDI] = useState('');
  const [saving, setSaving] = useState(null); // null | 'FDCA' | 'FDI'
  const [savedFDCA, setSavedFDCA] = useState(false);
  const [savedFDI, setSavedFDI] = useState(false);

  const handleSimulate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await api.simulate({ monthlyIncome: parseFloat(income), annualDeductions: parseFloat(deductions) || 0 });
      setResult(data);
      setSavedFDCA(false);
      setSavedFDI(false);
    } catch (err) { alert('Erro no cálculo'); }
    finally { setLoading(false); }
  };

  const handleSave = async (type) => {
    if (!user) return alert('Faça login para salvar sua simulação!');
    const fundId = type === 'FDCA' ? selectedFundFDCA : selectedFundFDI;
    if (!fundId) return alert(`Selecione um fundo ${type} para destinar!`);
    // Valor legalmente correto para ESTE tipo de fundo — nunca o total combinado (maxTotal),
    // já que um fundo FDCA só pode receber o teto de até 3% do FDCA, nunca o de FDI junto.
    const amount = type === 'FDCA' ? result.maxFDCA : result.maxFDI;

    setSaving(type);
    try {
      await api.createDonation({ fundId, amount, taxYear: 2026, status: 'SIMULADA' });
      if (type === 'FDCA') setSavedFDCA(true); else setSavedFDI(true);
    } catch (err) { alert('Erro ao salvar no banco.'); }
    finally { setSaving(null); }
  };

  return (
    <div className="simulador-page container section">
      <div className="sim-layout">
        <div className="card sim-form">
          <h1 className="sim-form__title"><Calculator /> Simulador IRPF 2026</h1>
          <form onSubmit={handleSimulate}>
            <div className="form-group">
              <label className="form-label">Renda Mensal Bruta (R$)</label>
              <input type="number" className="form-input" value={income} onChange={e => setIncome(e.target.value)} required placeholder="Ex: 5000" />
            </div>
            <div className="form-group">
              <label className="form-label">Deduções Anuais (INSS + Saúde + Educação + Dependentes — some tudo)</label>
              <input type="number" className="form-input" value={deductions} onChange={e => setDeductions(e.target.value)} placeholder="Ex: 8500" />
            </div>
            <button type="submit" className="btn btn--primary btn--lg btn--full" disabled={loading}>
              {loading ? 'Calculando...' : 'Calcular Destinação'}
            </button>
          </form>

          {result && (
            <div className="sim-form__info">
              <Info size={16} />
              <span>{result.note}</span>
            </div>
          )}
        </div>

        {result && (
          <div className="sim-results">
            <div className="card sim-total">
              <div className="sim-total__label">Potencial de destinação (até 6%)</div>
              <div className="sim-total__value">{fmt(result.maxTotal)}</div>
              <div className="sim-total__sub">sobre um imposto devido anual estimado de {fmt(result.estimatedTax)}</div>
            </div>
            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)', textAlign: 'center', marginTop: 'calc(var(--space-3) * -1)' }}>
              São dois limites de até 3% separados — um fundo não pode receber os 6% sozinho. Escolha abaixo, em cada bloco, um fundo do tipo correspondente.
            </p>

            <div className="grid grid--2">
              <div className="card sim-result-card sim-result-card--fdca">
                <div className="sim-result-card__header">até 3% Fundo Criança/Adolescente (FDCA)</div>
                <div className="sim-result-card__value">{fmt(result.maxFDCA)}</div>
                <div className="sim-result-card__sub">DARF código 3351</div>
              </div>
              <div className="card sim-result-card sim-result-card--fdi">
                <div className="sim-result-card__header">até 3% Fundo do Idoso (FDI)</div>
                <div className="sim-result-card__value">{fmt(result.maxFDI)}</div>
                <div className="sim-result-card__sub">DARF código 9090</div>
              </div>
            </div>

            {result.monthlyReduction > 0 && (
              <div className="card sim-result-card">
                <div className="sim-result-card__header">Redutor da Lei nº 15.270/2025 aplicado</div>
                <div className="sim-result-card__sub">
                  Até {fmt(result.monthlyReduction)}/mês de redução considerada — isenção efetiva para quem ganha
                  até R$ 5.000/mês, com redução parcial até R$ 7.350/mês.
                </div>
              </div>
            )}

            {/* Alocação FDCA — independente da FDI */}
            <div className="card">
              <label className="form-label">Destinar {fmt(result.maxFDCA)} para um fundo FDCA</label>
              {savedFDCA ? (
                <p style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', color: 'var(--color-success)', marginTop: 'var(--space-3)' }}>
                  <CheckCircle size={18} /> Salvo no seu Dashboard.
                </p>
              ) : (
                <>
                  <FundPicker type="FDCA" value={selectedFundFDCA} onChange={setSelectedFundFDCA} />
                  <button onClick={() => handleSave('FDCA')} className="btn btn--secondary btn--full sim-cta" disabled={saving === 'FDCA'}>
                    <Save size={18} /> {saving === 'FDCA' ? 'Salvando...' : 'Salvar destinação FDCA'}
                  </button>
                </>
              )}
            </div>

            {/* Alocação FDI — independente da FDCA */}
            <div className="card">
              <label className="form-label">Destinar {fmt(result.maxFDI)} para um fundo FDI</label>
              {savedFDI ? (
                <p style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center', color: 'var(--color-success)', marginTop: 'var(--space-3)' }}>
                  <CheckCircle size={18} /> Salvo no seu Dashboard.
                </p>
              ) : (
                <>
                  <FundPicker type="FDI" value={selectedFundFDI} onChange={setSelectedFundFDI} />
                  <button onClick={() => handleSave('FDI')} className="btn btn--secondary btn--full sim-cta" disabled={saving === 'FDI'}>
                    <Save size={18} /> {saving === 'FDI' ? 'Salvando...' : 'Salvar destinação FDI'}
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
