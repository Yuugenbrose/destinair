import { Link } from 'react-router-dom';
import {
  Heart, ArrowRight, Calculator, Search, BarChart3,
  Shield, Users, TrendingUp, BookOpen, CheckCircle2,
  ChevronRight, Sparkles
} from 'lucide-react';
import useScrollReveal from '../hooks/useScrollReveal';
import './Home.css';

const stats = [
  { value: 'R$ 12 bi+', label: 'em potencial de destinação por ano', icon: TrendingUp },
  { value: '< 1%', label: 'dos declarantes usam essa possibilidade', icon: Users },
  { value: '5.570', label: 'municípios com fundos', icon: Search },
  { value: '6%', label: 'do IR pode ser destinado', icon: Calculator },
];

const features = [
  {
    icon: BookOpen,
    title: 'Aprenda',
    desc: 'Entenda a destinação do IRPF com explicações diretas, exemplos práticos e linguagem acessível.',
    color: 'primary',
  },
  {
    icon: Calculator,
    title: 'Simule',
    desc: 'Descubra quanto pode destinar sem pagar nada a mais e veja o impacto da sua decisão.',
    color: 'secondary',
  },
  {
    icon: Search,
    title: 'Encontre',
    desc: 'Localize fundos sociais do seu município ou estado e conheça os projetos apoiados.',
    color: 'accent',
  },
  {
    icon: BarChart3,
    title: 'Acompanhe',
    desc: 'Acompanhe dashboards de transparência com dados públicos sobre arrecadação e impacto social.',
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
    role: 'Contadora e consultora fiscal',
    text: 'A destinação deixa de parecer algo burocrático quando a orientação está clara. A plataforma organiza o passo a passo e dá segurança para quem quer contribuir.',
    rating: 5,
  },
  {
    name: 'Carlos Eduardo',
    role: 'Contribuinte pessoa física',
    text: 'Eu não sabia que podia destinar parte do imposto sem custo extra. Depois de entender o processo, passou a fazer parte da minha declaração.',
    rating: 5,
  },
  {
    name: 'Maria José',
    role: 'Gestora de fundo municipal',
    text: 'Quando o contribuinte entende onde o recurso chega, a adesão melhora. Essa clareza ajuda muito na arrecadação e no engajamento local.',
    rating: 5,
  },
];

export default function Home() {
  const rootRef = useScrollReveal();

  return (
    <div className="home" ref={rootRef}>
      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero__bg">
          <div className="hero__orb hero__orb--1"></div>
          <div className="hero__orb hero__orb--2"></div>
          <div className="hero__orb hero__orb--3"></div>
        </div>
        <div className="container hero__content">
          <div className="hero__badge" data-reveal style={{ '--reveal-delay': '0ms' }}>
            <Sparkles size={14} />
            Orientação gratuita para quem quer destinar o IR com segurança
          </div>
          <h1 className="hero__title" data-reveal style={{ '--reveal-delay': '120ms' }}>
            Destine seu imposto<br />
            para <span className="hero__title-highlight">quem precisa</span>
          </h1>
          <p className="hero__subtitle" data-reveal style={{ '--reveal-delay': '220ms' }}>
            Até 6% do seu Imposto de Renda pode ser direcionado para fundos de
            proteção à criança, adolescente e pessoa idosa — sem custo adicional.
            Nós explicamos como fazer isso na prática.
          </p>
          <div className="hero__actions" data-reveal style={{ '--reveal-delay': '320ms' }}>
            <Link to="/simulador" className="btn btn--primary btn--lg">
              <Calculator size={20} />
              Simular minha destinação
            </Link>
            <Link to="/como-funciona" className="btn btn--outline btn--lg">
              Entender como funciona
              <ArrowRight size={18} />
            </Link>
          </div>
          <div className="hero__trust" data-reveal style={{ '--reveal-delay': '420ms' }}>
            <Shield size={16} />
            <span>Baseado na legislação brasileira vigente, com foco em fundos públicos fiscalizados</span>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="section section--alt" data-reveal>
        <div className="container">
          <div className="grid grid--4">
            {stats.map((s, i) => (
              <div key={i} className="kpi-card card card--flat" data-reveal style={{ '--reveal-delay': `${i * 120}ms` }}>
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
      <section className="section" data-reveal>
        <div className="container">
          <div className="section-header">
            <span className="section-header__tag">Como ajudamos</span>
            <h2 className="section-header__title">Tudo o que você precisa em um só lugar</h2>
            <p className="section-header__subtitle">
              Da educação ao acompanhamento — uma jornada completa para transformar seu imposto em impacto social.
            </p>
          </div>
          <div className="grid grid--4">
            {features.map((f, i) => (
              <div key={i} className="feature-card card" data-reveal style={{ '--reveal-delay': `${i * 120}ms` }}>
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
      <section className="section section--dark" data-reveal>
        <div className="container">
          <div className="section-header">
            <span className="section-header__tag" style={{ color: 'var(--color-secondary-light)' }}>Passo a passo</span>
            <h2 className="section-header__title">Simples assim</h2>
            <p className="section-header__subtitle">
              Em 4 passos, você direciona parte do seu imposto para causas sociais — sem pagar nada a mais.
            </p>
          </div>
          <div className="steps-grid">
            {steps.map((s, i) => (
              <div key={i} className="step-card card--glass" data-reveal style={{ '--reveal-delay': `${i * 120}ms` }}>
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
      <section className="section" data-reveal>
        <div className="container">
          <div className="section-header">
            <span className="section-header__tag">Depoimentos</span>
            <h2 className="section-header__title">Quem já transforma imposto em impacto</h2>
          </div>
          <div className="grid grid--3">
            {testimonials.map((t, i) => (
              <div key={i} className="testimonial-card card" data-reveal style={{ '--reveal-delay': `${i * 120}ms` }}>
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
      <section className="cta-section" data-reveal>
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
