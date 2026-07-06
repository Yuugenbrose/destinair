import { useEffect, useMemo, useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users } from 'lucide-react';
import { api } from '../services/api';
import './Transparencia.css';

const fmtFull = v => (v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
const fmtCompact = v => 'R$ ' + ((v || 0) / 1000000).toFixed(1) + 'M';

export default function Transparencia() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.getNationalStats();
        setStats(data.stats || []);
      } catch (err) {
        console.error('Erro ao buscar estatísticas nacionais:', err);
        setError('Não foi possível carregar os dados agora.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const nationalRow = useMemo(() => {
    const rows = stats.filter(s => s.scope === 'NACIONAL');
    return rows.sort((a, b) => b.reference_year - a.reference_year)[0] || null;
  }, [stats]);

  const stateRows = useMemo(() => {
    return stats
      .filter(s => s.scope === 'ESTADUAL' && (!nationalRow || s.reference_year === nationalRow.reference_year))
      .sort((a, b) => (b.total_amount || 0) - (a.total_amount || 0));
  }, [stats, nationalRow]);

  const pieData = useMemo(() => {
    if (!nationalRow) return [];
    let fdca = nationalRow.fdca_total;
    let fdi = nationalRow.fdi_total;
    if ((fdca == null || fdi == null) && nationalRow.fdca_pct != null && nationalRow.fdi_pct != null && nationalRow.total_amount != null) {
      fdca = nationalRow.total_amount * (nationalRow.fdca_pct / 100);
      fdi = nationalRow.total_amount * (nationalRow.fdi_pct / 100);
    }
    if (fdca == null || fdi == null) return [];
    return [
      { name: 'FDCA — Criança/Adolescente', value: fdca, color: '#0EA5E9' },
      { name: 'FDI — Pessoa Idosa', value: fdi, color: '#10B981' },
    ];
  }, [nationalRow]);

  const stateBarData = useMemo(() => stateRows.map(s => ({ state: s.state, total: s.total_amount || 0 })), [stateRows]);

  // Consolida as notas por estado num único parágrafo corrido, em vez de vários cards pequenos
  const stateNotesText = useMemo(() => {
    const withNotes = stateRows.filter(s => s.note);
    if (withNotes.length === 0) return null;
    return withNotes.map(s => s.note).join(' ');
  }, [stateRows]);

  if (loading) return <div className="container p-8 text-center">Carregando dados nacionais...</div>;

  return (
    <div className="transparencia">
      <section className="cf-hero section--dark">
        <div className="container">
          <div className="section-header">
            <span className="section-header__tag" style={{ color: 'var(--color-accent-light)' }}>Transparência</span>
            <h1 className="section-header__title">A destinação do IR no Brasil{nationalRow ? ` em ${nationalRow.reference_year}` : ''}</h1>
            <p className="section-header__subtitle">
              Dados nacionais reais, curados manualmente pela nossa equipe a partir de fontes públicas — sem nenhum
              dado individual de usuários da plataforma. Suas próprias simulações e destinações ficam disponíveis
              só no seu Dashboard, como controle pessoal.
            </p>
          </div>

          {nationalRow && (
            <div className="trans-hero-stats">
              <div className="trans-hero-stat trans-hero-stat--primary">
                <TrendingUp size={28} />
                <div className="trans-hero-stat__value">{fmtFull(nationalRow.total_amount)}</div>
                <div className="trans-hero-stat__label">destinados no Brasil em {nationalRow.reference_year}</div>
              </div>
              {nationalRow.total_destinations != null && (
                <div className="trans-hero-stat">
                  <Users size={28} />
                  <div className="trans-hero-stat__value">{nationalRow.total_destinations.toLocaleString('pt-BR')}</div>
                  <div className="trans-hero-stat__label">destinações realizadas por contribuintes</div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="section">
        <div className="container">
          {error && <div className="fundos-empty card text-center mb-8"><p>{error}</p></div>}

          {!nationalRow && stateRows.length === 0 && !error && (
            <div className="fundos-empty card text-center">
              <p>Ainda não há estatísticas nacionais cadastradas. O Admin pode adicionar em Admin → Estatísticas.</p>
            </div>
          )}

          {nationalRow?.note && <p className="trans-context-note">{nationalRow.note}</p>}
          {nationalRow && (nationalRow.source_label || nationalRow.source_url) && (
            <p className="trans-source">
              Fonte: {nationalRow.source_url
                ? <a href={nationalRow.source_url} target="_blank" rel="noopener noreferrer">{nationalRow.source_label}</a>
                : nationalRow.source_label}
            </p>
          )}

          <div className="trans-charts">
            {pieData.length > 0 && (
              <div className="trans-chart trans-chart--small card">
                <h3>Qual tipo de fundo recebeu mais</h3>
                <div className="pie-block">
                  <div className="pie-legend">
                    <ul>
                      {pieData.map((d, i) => (
                        <li key={i}>
                          <span className="pie-swatch" style={{ background: d.color }}></span>
                          <span className="pie-label">
                            {d.name}
                            <strong> — {fmtFull(d.value)}</strong>
                            {' '}({Math.round((d.value / (pieData[0].value + pieData[1].value)) * 100)}%)
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="pie-chart">
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" label={({ value }) => fmtCompact(value)} labelLine={false}>
                          {pieData.map((e, i) => (<Cell key={i} fill={e.color} />))}
                        </Pie>
                        <Tooltip formatter={v => fmtFull(v)} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {stateBarData.length > 0 && (
              <div className="trans-chart card">
                <h3>Estados que mais destinaram{stateRows[0] ? ` em ${stateRows[0].reference_year}` : ''}</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={stateBarData} layout="vertical" margin={{ left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis type="number" tickFormatter={v => fmtCompact(v)} tick={{ fontSize: 11 }} />
                    <YAxis type="category" dataKey="state" tick={{ fontSize: 12 }} width={40} />
                    <Tooltip formatter={v => fmtFull(v)} />
                    <Bar dataKey="total" name="Total destinado" fill="#0EA5E9" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                {stateNotesText && <p className="trans-chart__footnote">{stateNotesText}</p>}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
