import { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import './FAQ.css';

const faqData = [
  { cat: 'Geral', items: [
    { q: 'O que é a destinação do Imposto de Renda?', a: 'É um mecanismo legal que permite ao contribuinte direcionar até 6% do imposto devido para fundos sociais de proteção à criança/adolescente (FDCA) e pessoa idosa (FDI), sem custo adicional.' },
    { q: 'Eu pago algo a mais ao destinar?', a: 'Não! O valor destinado é abatido do imposto que você já pagaria ou somado à sua restituição. É o mesmo valor que iria para a União, mas agora vai para causas sociais.' },
    { q: 'Quem pode fazer a destinação?', a: 'Qualquer contribuinte que declare o Imposto de Renda pelo modelo completo (deduções legais). O modelo simplificado não permite a destinação.' },
  ]},
  { cat: 'Como Fazer', items: [
    { q: 'Posso destinar pelo modelo simplificado?', a: 'Não. A destinação só é possível pelo modelo de declaração por deduções legais (completa).' },
    { q: 'Qual o limite de destinação?', a: 'Até 3% do imposto devido para o FDCA e mais 3% para o FDI, totalizando 6%. O programa da Receita calcula automaticamente o limite.' },
    { q: 'O que é o DARF?', a: 'É o Documento de Arrecadação de Receitas Federais — um boleto gerado pelo programa do IRPF para que você efetue o pagamento da destinação.' },
    { q: 'Até quando posso pagar o DARF?', a: 'O DARF deve ser pago até o último dia do prazo de entrega da declaração do IRPF.' },
  ]},
  { cat: 'Fundos', items: [
    { q: 'Posso escolher para qual fundo destinar?', a: 'Sim. Você pode escolher fundos no nível nacional, estadual ou municipal, de acordo com sua preferência.' },
    { q: 'Para onde vai o dinheiro?', a: 'Os recursos são geridos por Conselhos de Direitos (compostos por representantes do governo e da sociedade civil) que aprovam e fiscalizam projetos sociais.' },
    { q: 'Como sei se o fundo é confiável?', a: 'Todos os fundos cadastrados são regulamentados por lei. Na nossa plataforma, você pode consultar prestações de contas e projetos executados por cada fundo.' },
  ]},
];

export default function FAQ() {
  const [open, setOpen] = useState(null);
  const toggle = key => setOpen(open === key ? null : key);

  return (
    <div className="faq-page">
      <section className="cf-hero section--dark">
        <div className="container">
          <div className="section-header">
            <span className="section-header__tag" style={{color:'var(--color-secondary-light)'}}>FAQ</span>
            <h1 className="section-header__title">Perguntas Frequentes</h1>
            <p className="section-header__subtitle">Tire suas dúvidas sobre a destinação do IRPF para fundos sociais.</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container container--narrow">
          {faqData.map((cat, ci) => (
            <div key={ci} className="faq-category">
              <h2 className="faq-category__title"><HelpCircle size={20}/> {cat.cat}</h2>
              {cat.items.map((item, ii) => {
                const key = `${ci}-${ii}`;
                const isOpen = open === key;
                return (
                  <div key={key} className={`faq-item card ${isOpen?'faq-item--open':''}`}>
                    <button className="faq-item__q" onClick={()=>toggle(key)}>
                      <span>{item.q}</span>
                      {isOpen ? <ChevronUp size={20}/> : <ChevronDown size={20}/>}
                    </button>
                    {isOpen && <div className="faq-item__a"><p>{item.a}</p></div>}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
