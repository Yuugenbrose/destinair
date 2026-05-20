import { Link } from 'react-router-dom';
import { Heart, Target, Eye, Users, Code, Github } from 'lucide-react';
import './Sobre.css';

const team = [
  { name: 'Integrante 1', role: 'Frontend — Landing & Educativo' },
  { name: 'Integrante 2', role: 'Frontend — Simulador & Fundos' },
  { name: 'Integrante 3', role: 'Frontend — Transparência & Gráficos' },
  { name: 'Integrante 4', role: 'Backend — Auth & CRUD Fundos' },
  { name: 'Integrante 5', role: 'Backend — Doações, Projetos & API' },
  { name: 'Integrante 6', role: 'Frontend — Auth, Dashboard & Admin' },
];

export default function Sobre() {
  return (
    <div className="sobre-page">
      <section className="cf-hero section--dark">
        <div className="container">
          <div className="section-header">
            <span className="section-header__tag" style={{color:'var(--color-secondary-light)'}}>Sobre</span>
            <h1 className="section-header__title">Sobre o DestinaIR</h1>
            <p className="section-header__subtitle">Projeto acadêmico desenvolvido na UTFPR — Campus Cornélio Procópio, com foco em cidadania fiscal e transparência social.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container container--narrow">
          <div className="sobre-cards grid grid--3 mb-8">
            <div className="card text-center" style={{padding:'var(--space-8)'}}>
              <Target size={32} style={{color:'var(--color-primary)',marginBottom:'var(--space-3)'}}/>
              <h3>Missão</h3>
              <p style={{fontSize:'var(--font-size-sm)',color:'var(--color-text-secondary)'}}>Democratizar o acesso à informação sobre destinação do IRPF e fortalecer a cidadania ativa.</p>
            </div>
            <div className="card text-center" style={{padding:'var(--space-8)'}}>
              <Eye size={32} style={{color:'var(--color-secondary)',marginBottom:'var(--space-3)'}}/>
              <h3>Visão</h3>
              <p style={{fontSize:'var(--font-size-sm)',color:'var(--color-text-secondary)'}}>Ser referência em transparência e engajamento social na destinação de recursos públicos.</p>
            </div>
            <div className="card text-center" style={{padding:'var(--space-8)'}}>
              <Heart size={32} style={{color:'var(--color-error)',marginBottom:'var(--space-3)'}}/>
              <h3>Valores</h3>
              <p style={{fontSize:'var(--font-size-sm)',color:'var(--color-text-secondary)'}}>Transparência, acessibilidade, impacto social e inovação tecnológica.</p>
            </div>
          </div>

          <div className="sobre-section mb-8">
            <h2><Code size={20}/> Tecnologias</h2>
            <div className="sobre-tech-grid">
              {['React 18','Vite','CSS Vanilla','React Router','Recharts','Lucide Icons','Hono (Workers)','Cloudflare D1','Cloudflare Pages','JWT Auth','Git / GitHub'].map(t=>(
                <span key={t} className="badge badge--primary">{t}</span>
              ))}
            </div>
          </div>

          <div className="sobre-section mb-8">
            <h2><Users size={20}/> Equipe</h2>
            <div className="grid grid--2">
              {team.map((m,i)=>(
                <div key={i} className="sobre-member card card--flat">
                  <div className="sobre-member__avatar">{m.name.split(' ').pop()?.charAt(0) || (i+1)}</div>
                  <div>
                    <div className="sobre-member__name">{m.name}</div>
                    <div className="sobre-member__role">{m.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
