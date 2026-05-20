import { Link } from 'react-router-dom';
import { Heart, Target, Eye, Users, Code, Github } from 'lucide-react';
import useScrollReveal from '../hooks/useScrollReveal';
import './Sobre.css';

const team = [
  { name: 'Júlio Cezar Bandeira Covary', role: 'Frontend — Landing & Educativo' },
  { name: 'Guilherme Eduardo Vilas Boas Sebastião', role: 'Frontend — Simulador & Fundos' },
  { name: 'Igor Luiz Ribeiro Santos', role: 'Frontend — Transparência & Gráficos' },
  { name: 'Davi Peres Gomes Leite Barreto', role: 'Backend — Auth & CRUD Fundos' },
  { name: 'Matheus Peres Gomes Leite Barreto', role: 'Backend — Doações, Projetos & API' },
  { name: 'João Victor Guidorizi da Silva', role: 'Frontend — Auth, Dashboard & Admin' },
];

export default function Sobre() {
  const rootRef = useScrollReveal();

  return (
    <div className="sobre-page" ref={rootRef}>
      <section className="cf-hero section--dark" data-reveal>
        <div className="container">
          <div className="section-header">
            <span className="section-header__tag" style={{color:'var(--color-secondary-light)'}}>Sobre</span>
            <h1 className="section-header__title">Sobre o DestinaIR</h1>
            <p className="section-header__subtitle">Projeto acadêmico desenvolvido na UTFPR — Campus Cornélio Procópio, com foco em cidadania fiscal e transparência social.</p>
          </div>
        </div>
      </section>

      <section className="section" data-reveal>
        <div className="container container--narrow">
          <div className="sobre-cards grid grid--3 mb-8">
            <div className="card text-center" style={{padding:'var(--space-8)'}} data-reveal>
              <Target size={32} style={{color:'var(--color-primary)',marginBottom:'var(--space-3)'}}/>
              <h3>Missão</h3>
              <p style={{fontSize:'var(--font-size-sm)',color:'var(--color-text-secondary)'}}>Democratizar o acesso à informação sobre destinação do IRPF e fortalecer a cidadania ativa.</p>
            </div>
            <div className="card text-center" style={{ padding: 'var(--space-8)', '--reveal-delay': '120ms' }} data-reveal>
              <Eye size={32} style={{color:'var(--color-secondary)',marginBottom:'var(--space-3)'}}/>
              <h3>Visão</h3>
              <p style={{fontSize:'var(--font-size-sm)',color:'var(--color-text-secondary)'}}>Ser referência em transparência e engajamento social na destinação de recursos públicos.</p>
            </div>
            <div className="card text-center" style={{ padding: 'var(--space-8)', '--reveal-delay': '240ms' }} data-reveal>
              <Heart size={32} style={{color:'var(--color-error)',marginBottom:'var(--space-3)'}}/>
              <h3>Valores</h3>
              <p style={{fontSize:'var(--font-size-sm)',color:'var(--color-text-secondary)'}}>Transparência, acessibilidade, impacto social e inovação tecnológica.</p>
            </div>
          </div>

          <div className="sobre-section mb-8" data-reveal>
            <h2><Code size={20}/> Tecnologias</h2>
            <div className="sobre-tech-grid">
              {['React 18','Vite','CSS Vanilla','React Router','Recharts','Lucide Icons','Hono (Workers)','Cloudflare D1','Cloudflare Pages','JWT Auth','Git / GitHub'].map(t=>(
                <span key={t} className="badge badge--primary">{t}</span>
              ))}
            </div>
          </div>

          <div className="sobre-section mb-8" data-reveal>
            <h2><Users size={20}/> Equipe</h2>
            <div className="grid grid--2">
              {team.map((m,i)=>(
                <div key={i} className="sobre-member card card--flat" data-reveal style={{ '--reveal-delay': `${i * 100}ms` }}>
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
