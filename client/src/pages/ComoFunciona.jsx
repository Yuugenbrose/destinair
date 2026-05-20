import { Link } from 'react-router-dom';
import {
  FileText, Calculator, Search, CreditCard, CheckCircle2,
  ArrowRight, AlertCircle, Info, ExternalLink
} from 'lucide-react';
import useScrollReveal from '../hooks/useScrollReveal';
import './ComoFunciona.css';

const steps = [
  {
    icon: FileText,
    title: 'Opte pela declaração completa',
    desc: 'No programa da Receita Federal, escolha o modelo de tributação "Por Deduções Legais". O modelo simplificado NÃO permite a destinação.',
    tip: 'Se suas deduções (saúde, educação, dependentes) superam 20% da renda tributável, o modelo completo já é mais vantajoso.',
    color: 'primary',
  },
  {
    icon: Search,
    title: 'Acesse "Doações Diretamente na Declaração"',
    desc: 'Dentro do programa do IRPF, navegue até a ficha "Doações Diretamente na Declaração". Você verá as abas: Criança e Adolescente (FDCA) e Pessoa Idosa (FDI).',
    tip: 'Essa ficha só aparece DEPOIS de você preencher toda sua declaração. Faça isso por último.',
    color: 'secondary',
  },
  {
    icon: Calculator,
    title: 'Escolha o fundo e o valor',
    desc: 'Clique em "Novo", selecione o nível (Nacional, Estadual ou Municipal) e informe o valor. O sistema mostra automaticamente o máximo que você pode destinar: até 3% para FDCA e 3% para FDI.',
    tip: 'Prefira fundos municipais para que o recurso beneficie diretamente sua comunidade.',
    color: 'accent',
  },
  {
    icon: CreditCard,
    title: 'Emita e pague o DARF',
    desc: 'Após enviar a declaração, o programa gera automaticamente um DARF (Documento de Arrecadação) para cada doação. Pague até o último dia do prazo de entrega da declaração.',
    tip: 'O valor do DARF é descontado do seu imposto a pagar ou somado à sua restituição. Você NÃO paga nada a mais.',
    color: 'primary',
  },
];

const myths = [
  { myth: 'Destinar o IR custa dinheiro extra.', truth: 'Não! O valor é abatido do imposto que você já pagaria.' },
  { myth: 'Só rico pode destinar.', truth: 'Qualquer pessoa que declare pelo modelo completo pode fazer.' },
  { myth: 'O dinheiro vai para o governo.', truth: 'O recurso vai direto para os fundos sociais, geridos por conselhos com participação da sociedade civil.' },
  { myth: 'É muito complicado.', truth: 'São apenas 4 passos dentro do próprio programa da Receita Federal.' },
];

export default function ComoFunciona() {
  const rootRef = useScrollReveal();

  return (
    <div className="como-funciona" ref={rootRef}>
      {/* Hero */}
      <section className="cf-hero section--dark" data-reveal>
        <div className="container">
          <div className="section-header">
            <span className="section-header__tag" style={{ color: 'var(--color-secondary-light)' }}>Guia completo</span>
            <h1 className="section-header__title">Como funciona a destinação do IRPF?</h1>
            <p className="section-header__subtitle">
              Entenda passo a passo como direcionar parte do seu Imposto de Renda
              para fundos sociais — sem custo adicional e com total segurança.
            </p>
          </div>
        </div>
      </section>

      {/* Explainer */}
      <section className="section" data-reveal>
        <div className="container container--narrow">
          <div className="cf-explainer card" data-reveal>
            <div className="cf-explainer__icon">
              <Info size={24} />
            </div>
            <h2 className="cf-explainer__title">O que é a destinação do IRPF?</h2>
            <p className="cf-explainer__text">
              A legislação brasileira permite que contribuintes destinem até <strong>6% do imposto de renda devido</strong> para
              dois tipos de fundos sociais:
            </p>
            <div className="cf-funds-grid">
              <div className="cf-fund-type cf-fund-type--fdca" data-reveal style={{ '--reveal-delay': '80ms' }}>
                <h3>FDCA</h3>
                <p>Fundo dos Direitos da Criança e do Adolescente</p>
                <span className="badge badge--primary">Até 3% do IR</span>
                <small>Base legal: ECA — Lei nº 8.069/1990</small>
              </div>
              <div className="cf-fund-type cf-fund-type--fdi" data-reveal style={{ '--reveal-delay': '160ms' }}>
                <h3>FDI</h3>
                <p>Fundo dos Direitos da Pessoa Idosa</p>
                <span className="badge badge--secondary">Até 3% do IR</span>
                <small>Base legal: Lei nº 12.213/2010</small>
              </div>
            </div>
            <div className="cf-explainer__highlight">
              <AlertCircle size={20} />
              <span>O valor destinado é <strong>subtraído do imposto a pagar</strong> ou <strong>somado à restituição</strong>. Você não gasta nada a mais!</span>
            </div>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="section section--alt" data-reveal>
        <div className="container">
          <div className="section-header">
            <span className="section-header__tag">Passo a passo</span>
            <h2 className="section-header__title">Como fazer na prática</h2>
          </div>
          <div className="cf-steps">
            {steps.map((step, i) => (
              <div key={i} className="cf-step" data-reveal style={{ '--reveal-delay': `${i * 120}ms` }}>
                <div className="cf-step__line">
                  <div className={`cf-step__dot cf-step__dot--${step.color}`}>
                    <step.icon size={20} />
                  </div>
                  {i < steps.length - 1 && <div className="cf-step__connector"></div>}
                </div>
                <div className="cf-step__content card">
                  <div className="cf-step__number">Passo {i + 1}</div>
                  <h3 className="cf-step__title">{step.title}</h3>
                  <p className="cf-step__desc">{step.desc}</p>
                  <div className="cf-step__tip">
                    <CheckCircle2 size={16} />
                    <span>{step.tip}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Myths */}
      <section className="section" data-reveal>
        <div className="container">
          <div className="section-header">
            <span className="section-header__tag">Mitos e Verdades</span>
            <h2 className="section-header__title">Desmistificando a destinação</h2>
          </div>
          <div className="grid grid--2">
            {myths.map((m, i) => (
              <div key={i} className="myth-card card" data-reveal style={{ '--reveal-delay': `${i * 120}ms` }}>
                <div className="myth-card__myth">
                  <span className="myth-card__label myth-card__label--myth">✕ Mito</span>
                  <p>{m.myth}</p>
                </div>
                <div className="myth-card__truth">
                  <span className="myth-card__label myth-card__label--truth">✓ Verdade</span>
                  <p>{m.truth}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section" data-reveal>
        <div className="container text-center">
          <h2 className="cta-section__title">Pronto para simular?</h2>
          <p className="cta-section__subtitle">Descubra em segundos quanto do seu imposto pode se tornar impacto social.</p>
          <div className="cta-section__actions">
            <Link to="/simulador" className="btn btn--primary btn--lg">
              <Calculator size={20} /> Ir para o simulador
            </Link>
            <a href="https://www.gov.br/receitafederal" target="_blank" rel="noopener noreferrer" className="btn btn--secondary btn--lg">
              Site da Receita Federal <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
