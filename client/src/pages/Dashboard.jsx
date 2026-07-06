import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Heart, TrendingUp, FileText, Calculator, ArrowRight, Clock, Info } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './Dashboard.css';

const fmt = v => (v||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const statusLabels = { SIMULADA:'Simulada', CONFIRMADA:'Confirmada', PAGA:'Paga' };
const statusBadge = { SIMULADA:'accent', CONFIRMADA:'warning', PAGA:'success' };

export default function Dashboard() {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const data = await api.getDonations();
        setDonations(data.donations || []);
      } catch (err) {
        console.error('Erro ao buscar doações:', err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchDonations();
    else setLoading(false);
  }, [user]);

  const totalDonated = donations.filter(d => d.status === 'PAGA').reduce((s, d) => s + d.amount, 0);
  const fundosApoiados = new Set(donations.map(d => d.fund_id)).size;

  // "Meu impacto" — total simulado/destinado por ano fiscal, independente do status
  // (é o histórico pessoal do usuário, não uma alegação sobre pagamento confirmado)
  const impactByYear = useMemo(() => {
    const map = {};
    for (const d of donations) {
      const year = String(d.tax_year);
      map[year] = (map[year] || 0) + d.amount;
    }
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b)).map(([year, total]) => ({ year, total }));
  }, [donations]);

  if (loading) return <div className="container p-8">Carregando seu impacto...</div>;

  if (!user) {
    return (
      <div className="container p-8 text-center">
        <p>Você precisa estar logado para ver seu Dashboard.</p>
        <Link to="/login" className="btn btn--primary mt-4">Fazer login</Link>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <section className="section">
        <div className="container">
          <div className="dash-welcome">
            <h1>Boas-vindas, {user?.name || 'Contribuinte'} 🚀</h1>
            <p>Acompanhe suas destinações reais salvas no banco de dados.</p>
          </div>

          <div className="grid grid--4 mb-8">
            <div className="kpi-card card card--flat">
              <div className="kpi-card__icon" style={{background:'var(--color-secondary-100)',color:'var(--color-secondary)'}}><TrendingUp size={24}/></div>
              <div className="kpi-card__value">{fmt(totalDonated)}</div>
              <div className="kpi-card__label">Total destinado</div>
            </div>
            <div className="kpi-card card card--flat">
              <div className="kpi-card__icon" style={{background:'var(--color-primary-100)',color:'var(--color-primary)'}}><FileText size={24}/></div>
              <div className="kpi-card__value">{donations.length}</div>
              <div className="kpi-card__label">Registros no banco</div>
            </div>
            <div className="kpi-card card card--flat">
              <div className="kpi-card__icon" style={{background:'var(--color-accent-50)',color:'var(--color-accent)'}}><Heart size={24}/></div>
              <div className="kpi-card__value">{fundosApoiados}</div>
              <div className="kpi-card__label">Fundos apoiados</div>
            </div>
            <div className="kpi-card card card--flat">
              <div className="kpi-card__icon" style={{background:'#EDE9FE',color:'#7C3AED'}}><Calculator size={24}/></div>
              <div className="kpi-card__value">2026</div>
              <div className="kpi-card__label">Ano Fiscal Atual</div>
            </div>
          </div>

          {impactByYear.length > 0 && (
            <div className="dash-section">
              <div className="dash-section__header">
                <h2><TrendingUp size={20}/> Meu Impacto ao Longo do Tempo</h2>
              </div>
              <div className="card p-4">
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={impactByYear}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0"/>
                    <XAxis dataKey="year" tick={{fontSize:12}}/>
                    <YAxis tickFormatter={v=>'R$'+v} tick={{fontSize:11}}/>
                    <Tooltip formatter={v=>fmt(v)}/>
                    <Bar dataKey="total" name="Destinado por ano" fill="var(--color-primary-500, #0EA5E9)" radius={[4,4,0,0]}/>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          <div className="dash-section">
            <div className="dash-section__header">
              <h2><Clock size={20}/> Histórico de Simulações e Doações</h2>
              <Link to="/minhas-doacoes" className="btn btn--ghost">Gerenciar todos <ArrowRight size={16}/></Link>
            </div>
            <div className="dash-table card">
              {donations.length === 0 ? (
                <div className="p-8 text-center">Nenhum dado encontrado. <Link to="/simulador">Comece simulando aqui!</Link></div>
              ) : (
                <table>
                  <thead><tr><th>Fundo</th><th>Valor</th><th>Ano</th><th>Status</th><th>Data</th></tr></thead>
                  <tbody>
                    {donations.slice(0, 5).map(d => (
                      <tr key={d.id}>
                        <td className="dash-table__fund">{d.fund_name}</td>
                        <td><strong>{fmt(d.amount)}</strong></td>
                        <td>{d.tax_year}</td>
                        <td><span className={`badge badge--${statusBadge[d.status]}`}>{statusLabels[d.status]}</span></td>
                        <td className="dash-table__date">{new Date(d.created_at).toLocaleDateString('pt-BR')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            {donations.length > 0 && (
              <p style={{display:'flex', gap:'var(--space-2)', alignItems:'flex-start', fontSize:'var(--font-size-xs)', color:'var(--color-text-muted)', marginTop:'var(--space-3)'}}>
                <Info size={14} style={{flexShrink:0, marginTop:2}}/>
                O status "Paga" é um controle pessoal seu — você mesmo marca quando paga o DARF. Não é uma confirmação oficial da Receita Federal. Guarde o comprovante do pagamento em um local seguro; você pode salvar um link de referência em Minhas Doações.
              </p>
            )}
          </div>

          <div className="dash-actions grid grid--2">
            <Link to="/simulador" className="dash-action card">
              <Calculator size={32} style={{color:'var(--color-primary)'}}/>
              <h3>Simular nova destinação</h3>
              <p>Descubra quanto pode destinar este ano</p>
            </Link>
            <Link to="/fundos" className="dash-action card">
              <Heart size={32} style={{color:'var(--color-secondary)'}}/>
              <h3>Explorar fundos</h3>
              <p>Encontre novos fundos para apoiar</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
