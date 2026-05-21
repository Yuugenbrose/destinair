import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, TrendingUp, FileText, Calculator, ArrowRight, Clock } from 'lucide-react';
import useScrollReveal from '../hooks/useScrollReveal';
import './Dashboard.css';

const mockDonations = [
  { id: 'd1', fundName: 'FDCA — Cornélio Procópio', amount: 320, taxYear: 2024, status: 'PAGA', date: '2024-04-28' },
  { id: 'd2', fundName: 'FDI — Cornélio Procópio', amount: 280, taxYear: 2024, status: 'CONFIRMADA', date: '2024-04-28' },
  { id: 'd3', fundName: 'FDCA — Londrina', amount: 450, taxYear: 2023, status: 'PAGA', date: '2023-04-30' },
];

const fmt = v => (v||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const statusLabels = { SIMULADA:'Simulada', CONFIRMADA:'Confirmada', PAGA:'Paga' };
const statusBadge = { SIMULADA:'accent', CONFIRMADA:'warning', PAGA:'success' };

export default function Dashboard() {
  const rootRef = useScrollReveal();
  const { user } = useAuth();
  const totalDonated = mockDonations.filter(d=>d.status==='PAGA').reduce((s,d)=>s+d.amount,0);

  return (
    <div className="dashboard-page" ref={rootRef}>
      <section className="section" data-reveal>
        <div className="container">
          <div className="dash-welcome" data-reveal>
            <h1>Boas-vindas ao seu painel de impacto, {user?.name || 'Contribuinte'} 🚀</h1>
            <p>Acompanhe suas destinações e veja o impacto do seu imposto.</p>
          </div>

          <div className="grid grid--4 mb-8" data-reveal>
            <div className="kpi-card card card--flat" data-reveal style={{ '--reveal-delay': '80ms' }}>
              <div className="kpi-card__icon" style={{background:'var(--color-secondary-100)',color:'var(--color-secondary)'}}><TrendingUp size={24}/></div>
              <div className="kpi-card__value">{fmt(totalDonated)}</div>
              <div className="kpi-card__label">Total destinado</div>
            </div>
            <div className="kpi-card card card--flat" data-reveal style={{ '--reveal-delay': '200ms' }}>
              <div className="kpi-card__icon" style={{background:'var(--color-primary-100)',color:'var(--color-primary)'}}><FileText size={24}/></div>
              <div className="kpi-card__value">{mockDonations.length}</div>
              <div className="kpi-card__label">Doações registradas</div>
            </div>
            <div className="kpi-card card card--flat" data-reveal style={{ '--reveal-delay': '320ms' }}>
              <div className="kpi-card__icon" style={{background:'var(--color-accent-50)',color:'var(--color-accent)'}}><Heart size={24}/></div>
              <div className="kpi-card__value">2</div>
              <div className="kpi-card__label">Fundos apoiados</div>
            </div>
            <div className="kpi-card card card--flat" data-reveal style={{ '--reveal-delay': '440ms' }}>
              <div className="kpi-card__icon" style={{background:'#EDE9FE',color:'#7C3AED'}}><Calculator size={24}/></div>
              <div className="kpi-card__value">2024</div>
              <div className="kpi-card__label">Último ano fiscal</div>
            </div>
          </div>

          <div className="dash-section" data-reveal style={{ '--reveal-delay': '560ms' }}>
            <div className="dash-section__header">
              <h2><Clock size={20}/> Doações recentes</h2>
              <Link to="/minhas-doacoes" className="btn btn--ghost">Ver todas <ArrowRight size={16}/></Link>
            </div>
            <div className="dash-table card" data-reveal style={{ '--reveal-delay': '640ms' }}>
              <table>
                <thead><tr><th>Fundo</th><th>Valor</th><th>Ano</th><th>Status</th><th>Data</th></tr></thead>
                <tbody>
                  {mockDonations.map(d=>(
                    <tr key={d.id}>
                      <td className="dash-table__fund">{d.fundName}</td>
                      <td><strong>{fmt(d.amount)}</strong></td>
                      <td>{d.taxYear}</td>
                      <td><span className={`badge badge--${statusBadge[d.status]}`}>{statusLabels[d.status]}</span></td>
                      <td className="dash-table__date">{new Date(d.date).toLocaleDateString('pt-BR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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
