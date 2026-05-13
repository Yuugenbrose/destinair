import { Link } from 'react-router-dom';
import {
  Heart, ArrowRight, Calculator, Search, BarChart3,
  Shield, Users, TrendingUp, BookOpen, CheckCircle2,
  ChevronRight, Sparkles
} from 'lucide-react';
import './Home.css';

const stats = [
  { value: 'R$ 4,2 bi', label: 'Potencial não destinado/ano', icon: TrendingUp },
  { value: '< 3%', label: 'dos contribuintes destinam', icon: Users },
  { value: '5.570', label: 'municípios com fundos', icon: Search },
  { value: '6%', label: 'do IR pode ser destinado', icon: Calculator },
];

const features = [
  {
    icon: BookOpen,
    title: 'Aprenda',
    desc: 'Entenda como funciona a destinação do IRPF com guias visuais e linguagem acessível.',
    color: 'primary',
  },
  {
    icon: Calculator,
    title: 'Simule',
    desc: 'Descubra quanto você pode destinar sem custo adicional com nosso simulador em tempo real.',
    color: 'secondary',
  },
  {
    icon: Search,
    title: 'Encontre',
    desc: 'Localize fundos sociais do seu município ou estado e conheça os projetos que executam.',
    color: 'accent',
  },
  {
    icon: BarChart3,
    title: 'Acompanhe',
    desc: 'Veja dashboards de transparência com dados reais sobre arrecadação e impacto social.',
    color: 'primary',
  },
];

const steps = [
  { num: '01', title: 'Declare pelo modelo completo', desc: 'Escolha "Deduções Legais" no programa do IRPF.' },
  { num: '02', title: 'Acesse "Doações na Declaração"', desc: 'Na ficha específica, selecione FDCA ou FDI.' },
  { num: '03', title: 'Escolha o fundo', desc: 'Nacional, estadual ou municipal — você decide para onde vai.' },
  { num: '04', title: 'Pague o DARF', desc: 'Emita e pague o boleto até o prazo da declaração.' },
];

const testimonials = [
  {
    name: 'Ana Beatriz',
    role: 'Contadora, São Paulo',
    text: 'Recomendo o DestinaIR para todos os meus clientes. A plataforma simplifica algo que antes era confuso e pouco conhecido.',
    rating: 5,
  },
  {
    name: 'Carlos Eduardo',
    role: 'Contribuinte, Curitiba',
    text: 'Nunca imaginei que pudesse direcionar meu imposto para causas locais sem pagar nada a mais. Agora faço todo ano!',
    rating: 5,
  },
  {
    name: 'Maria José',
    role: 'Gestora de Fundo, Cornélio Procópio',
    text: 'Desde que começamos a usar a plataforma, a arrecadação do nosso fundo municipal aumentou significativamente.',
    rating: 5,
  },
];

export default function Home() {
  return (
    <div className="home">
      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero__bg">
          <div className="hero__orb hero__orb--1"></div>
          <div className="hero__orb hero__orb--2"></div>
          <div className="hero__orb hero__orb--3"></div>
        </div>
        <div className="container hero__content">
          <div className="hero__badge animate-fade-in-up">
            <Sparkles size={14} />
            100% gratuito — sem custo adicional para o contribuinte
          </div>
          <h1 className="hero__title animate-fade-in-up animate-delay-1">
            Destine seu imposto<br />
            para <span className="hero__title-highlight">quem precisa</span>
          </h1>
          <p className="hero__subtitle animate-fade-in-up animate-delay-2">
            Até 6% do seu Imposto de Renda pode ir para fundos de proteção à
            criança, adolescente e pessoa idosa — sem pagar nada a mais.
            Nós te mostramos como.
          </p>
          <div className="hero__actions animate-fade-in-up animate-delay-3">
            <Link to="/simulador" className="btn btn--primary btn--lg">
              <Calculator size={20} />
              Simular minha destinação
            </Link>
            <Link to="/como-funciona" className="btn btn--outline btn--lg">
              Entender como funciona
              <ArrowRight size={18} />
            </Link>
          </div>
          <div className="hero__trust animate-fade-in-up animate-delay-4">
            <Shield size={16} />
            <span>Baseado na legislação brasileira vigente (ECA e Estatuto da Pessoa Idosa)</span>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="section section--alt">
        <div className="container">
          <div className="grid grid--4">
            {stats.map((s, i) => (
              <div key={i} className={`kpi-card card card--flat animate-fade-in-up animate-delay-${i + 1}`}>
                <div className="kpi-card__icon">
                  <s.icon size={24} />
                </div>
                <div className="kpi-card__value">{s.value}</div>
                <div className="kpi-card__label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-header__tag">Como ajudamos</span>
            <h2 className="section-header__title">Tudo que você precisa em um só lugar</h2>
            <p className="section-header__subtitle">
              Da educação ao acompanhamento — uma jornada completa para transformar seu imposto em impacto social.
            </p>
          </div>
          <div className="grid grid--4">
            {features.map((f, i) => (
              <div key={i} className={`feature-card card animate-fade-in-up animate-delay-${i + 1}`}>
                <div className={`feature-card__icon feature-card__icon--${f.color}`}>
                  <f.icon size={24} />
                </div>
                <h3 className="feature-card__title">{f.title}</h3>
                <p className="feature-card__desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="section section--dark">
        <div className="container">
          <div className="section-header">
            <span className="section-header__tag" style={{ color: 'var(--color-secondary-light)' }}>Passo a passo</span>
            <h2 className="section-header__title">Simples assim</h2>
            <p className="section-header__subtitle">
              Em 4 passos, você destina parte do seu imposto para causas sociais — sem pagar nada a mais.
            </p>
          </div>
          <div className="steps-grid">
            {steps.map((s, i) => (
              <div key={i} className="step-card card--glass animate-fade-in-up animate-delay-${i + 1}">
                <div className="step-card__num">{s.num}</div>
                <h3 className="step-card__title">{s.title}</h3>
                <p className="step-card__desc">{s.desc}</p>
                {i < steps.length - 1 && <ChevronRight className="step-card__arrow" size={24} />}
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/como-funciona" className="btn btn--outline btn--lg">
              Ver guia completo <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-header__tag">Depoimentos</span>
            <h2 className="section-header__title">Quem já transforma imposto em impacto</h2>
          </div>
          <div className="grid grid--3">
            {testimonials.map((t, i) => (
              <div key={i} className="testimonial-card card animate-fade-in-up animate-delay-${i + 1}">
                <div className="testimonial-card__stars">
                  {Array(t.rating).fill(0).map((_, j) => (
                    <span key={j} className="testimonial-card__star">★</span>
                  ))}
                </div>
                <p className="testimonial-card__text">"{t.text}"</p>
                <div className="testimonial-card__author">
                  <div className="testimonial-card__avatar">
                    {t.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="testimonial-card__name">{t.name}</div>
                    <div className="testimonial-card__role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="container text-center">
          <h2 className="cta-section__title">Pronto para fazer a diferença?</h2>
          <p className="cta-section__subtitle">
            Descubra agora quanto do seu imposto pode virar impacto social — em menos de 1 minuto.
          </p>
          <div className="cta-section__actions">
            <Link to="/simulador" className="btn btn--primary btn--lg">
              <Calculator size={20} />
              Simular agora
            </Link>
            <Link to="/fundos" className="btn btn--secondary btn--lg">
              <Search size={20} />
              Explorar fundos
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
