import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Users, Heart, BarChart3, FileText, ExternalLink, CheckCircle2 } from 'lucide-react';
import './FundoDetalhe.css';

const MOCK_FUND = {
  id: '1', name: 'Fundo Municipal dos Direitos da Criança e do Adolescente',
  type: 'FDCA', level: 'MUNICIPAL', state: 'PR', city: 'Cornélio Procópio',
  cnpj: '00.000.000/0001-01', bankInfo: 'Banco do Brasil — Ag. 0001 — CC 12345-6',
  description: 'Fundo gerido pelo CMDCA. Recursos aplicados em proteção integral, educação, esporte, cultura e saúde de crianças e adolescentes.',
  contactEmail: 'cmdca@cornelioprocopio.pr.gov.br', contactPhone: '(43) 3520-0000',
  totalRaised: 245000, projectCount: 8, beneficiariesCount: 1200,
  projects: [
    { id: 'p1', title: 'Escola de Esportes Comunitária', status: 'EM_ANDAMENTO', budget: 45000, spent: 32000, category: 'Esporte', beneficiariesCount: 150 },
    { id: 'p2', title: 'Reforço Escolar para Adolescentes', status: 'EM_ANDAMENTO', budget: 30000, spent: 18000, category: 'Educação', beneficiariesCount: 80 },
    { id: 'p3', title: 'Campanha de Vacinação Infantil', status: 'CONCLUIDO', budget: 25000, spent: 25000, category: 'Saúde', beneficiariesCount: 500 },
  ],
  reports: [
    { id: 'r1', title: 'Prestação de Contas 2024', referenceYear: 2024, publishedAt: '2025-03-15' },
    { id: 'r2', title: 'Prestação de Contas 2023', referenceYear: 2023, publishedAt: '2024-03-20' },
  ],
};

const statusLabels = { PLANEJADO: 'Planejado', EM_ANDAMENTO: 'Em Andamento', CONCLUIDO: 'Concluído' };
const statusColors = { PLANEJADO: 'accent', EM_ANDAMENTO: 'primary', CONCLUIDO: 'success' };
const fmt = v => (v||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});

export default function FundoDetalhe() {
  const { id } = useParams();
  const fund = MOCK_FUND;

  return (
    <div className="fundo-detalhe">
      <section className="fd-hero section--dark">
        <div className="container">
          <Link to="/fundos" className="fd-back"><ArrowLeft size={18}/> Voltar</Link>
          <div className="fd-hero__badges">
            <span className={`badge badge--${fund.type==='FDCA'?'primary':'secondary'}`}>{fund.type}</span>
            <span className="badge badge--accent">{fund.level}</span>
          </div>
          <h1 className="fd-hero__title">{fund.name}</h1>
          <div className="fd-hero__location"><MapPin size={16}/> {[fund.city,fund.state].filter(Boolean).join(' — ')}</div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="fd-layout">
            <div className="fd-main">
              <div className="grid grid--3 mb-8">
                <div className="kpi-card card card--flat"><div className="kpi-card__value">{fmt(fund.totalRaised)}</div><div className="kpi-card__label">Total arrecadado</div></div>
                <div className="kpi-card card card--flat"><div className="kpi-card__value">{fund.projectCount}</div><div className="kpi-card__label">Projetos</div></div>
                <div className="kpi-card card card--flat"><div className="kpi-card__value">{fund.beneficiariesCount?.toLocaleString('pt-BR')}</div><div className="kpi-card__label">Beneficiados</div></div>
              </div>
              <div className="fd-section"><h2>Sobre</h2><p>{fund.description}</p></div>
              <div className="fd-section">
                <h2><BarChart3 size={20}/> Projetos</h2>
                {fund.projects.map(p=>(
                  <div key={p.id} className="fd-project card card--flat">
                    <div className="fd-project__header"><h3>{p.title}</h3><span className={`badge badge--${statusColors[p.status]}`}>{statusLabels[p.status]}</span></div>
                    <div className="fd-project__meta"><span>{p.category}</span><span>{p.beneficiariesCount} beneficiários</span></div>
                    <div className="fd-project__progress">
                      <div className="fd-project__progress-bar"><div className="fd-project__progress-fill" style={{width:`${(p.spent/p.budget)*100}%`}}></div></div>
                      <div className="fd-project__progress-labels"><span>{fmt(p.spent)}</span><span>{fmt(p.budget)}</span></div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="fd-section">
                <h2><FileText size={20}/> Prestações de Contas</h2>
                {fund.reports.map(r=>(
                  <div key={r.id} className="fd-report card card--flat">
                    <div><h4>{r.title}</h4><span className="fd-report__date">{new Date(r.publishedAt).toLocaleDateString('pt-BR')}</span></div>
                    <button className="btn btn--secondary btn--sm"><ExternalLink size={14}/> Ver</button>
                  </div>
                ))}
              </div>
            </div>
            <aside className="fd-sidebar">
              <div className="fd-sidebar__card card">
                <h3>Informações</h3>
                <div className="fd-info-row"><span className="fd-info-label">CNPJ</span><span>{fund.cnpj}</span></div>
                <div className="fd-info-row"><span className="fd-info-label">Banco</span><span>{fund.bankInfo}</span></div>
                <div className="fd-info-row"><span className="fd-info-label">E-mail</span><span>{fund.contactEmail}</span></div>
                <div className="fd-info-row"><span className="fd-info-label">Telefone</span><span>{fund.contactPhone}</span></div>
              </div>
              <Link to="/simulador" className="btn btn--primary btn--lg btn--full">Simular destinação</Link>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
