import { Link } from 'react-router-dom';
import { ArrowLeft, Filter } from 'lucide-react';
import useScrollReveal from '../hooks/useScrollReveal';
import './Dashboard.css';

const mockDonations = [
  { id:'d1', fundName:'FDCA — Cornélio Procópio', type:'FDCA', amount:320, taxYear:2024, status:'PAGA', date:'2024-04-28' },
  { id:'d2', fundName:'FDI — Cornélio Procópio', type:'FDI', amount:280, taxYear:2024, status:'CONFIRMADA', date:'2024-04-28' },
  { id:'d3', fundName:'FDCA — Londrina', type:'FDCA', amount:450, taxYear:2023, status:'PAGA', date:'2023-04-30' },
  { id:'d4', fundName:'FDI — Curitiba', type:'FDI', amount:600, taxYear:2023, status:'PAGA', date:'2023-04-29' },
  { id:'d5', fundName:'FDCA — Cornélio Procópio', type:'FDCA', amount:200, taxYear:2022, status:'PAGA', date:'2022-04-29' },
];

const fmt = v => (v||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const statusLabels = { SIMULADA:'Simulada', CONFIRMADA:'Confirmada', PAGA:'Paga' };
const statusBadge = { SIMULADA:'accent', CONFIRMADA:'warning', PAGA:'success' };

export default function MinhasDoacoes() {
  const rootRef = useScrollReveal();
  return (
    <div className="dashboard-page" ref={rootRef}>
      <section className="section" data-reveal>
        <div className="container">
          <div className="dash-welcome" data-reveal>
            <Link to="/dashboard" style={{fontSize:'var(--font-size-sm)',display:'inline-flex',alignItems:'center',gap:'4px',marginBottom:'var(--space-4)'}}><ArrowLeft size={16}/> Dashboard</Link>
            <h1>Minhas Doações</h1>
            <p>Histórico completo de todas as suas destinações.</p>
          </div>

          <div className="dash-table card" data-reveal style={{ '--reveal-delay': '120ms' }}>
            <table>
              <thead><tr><th>Fundo</th><th>Tipo</th><th>Valor</th><th>Ano</th><th>Status</th><th>Data</th></tr></thead>
              <tbody>
                {mockDonations.map(d=>(
                  <tr key={d.id}>
                    <td className="dash-table__fund">{d.fundName}</td>
                    <td><span className={`badge badge--${d.type==='FDCA'?'primary':'secondary'}`}>{d.type}</span></td>
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
      </section>
    </div>
  );
}
