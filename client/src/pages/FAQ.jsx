import { useEffect, useMemo, useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { api } from '../services/api';
import './FAQ.css';

export default function FAQ() {
  const [open, setOpen] = useState(null);
  const [search, setSearch] = useState('');
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const data = await api.getFaqs();
        setFaqs(data.faqs || []);
      } catch (err) {
        console.error('Erro ao buscar FAQs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFaqs();
  }, []);

  const toggle = key => setOpen(open === key ? null : key);
  const normalizedSearch = search.trim().toLowerCase();

  // Agrupa a lista plana vinda da API em categorias, na ordem em que aparecem
  const faqData = useMemo(() => {
    const catOrder = [];
    const byCat = {};
    for (const item of faqs) {
      const cat = item.category || 'Geral';
      if (!byCat[cat]) { byCat[cat] = []; catOrder.push(cat); }
      byCat[cat].push({ q: item.question, a: item.answer });
    }
    return catOrder.map(cat => ({ cat, items: byCat[cat] }));
  }, [faqs]);

  const filteredFaqData = useMemo(() => {
    if (!normalizedSearch) return faqData;
    return faqData
      .map(cat => ({
        ...cat,
        items: cat.items.filter(item => {
          const question = item.q.toLowerCase();
          const answer = item.a.toLowerCase();
          return question.includes(normalizedSearch) || answer.includes(normalizedSearch) || cat.cat.toLowerCase().includes(normalizedSearch);
        }),
      }))
      .filter(cat => cat.items.length > 0);
  }, [normalizedSearch, faqData]);

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
          <div className="faq-search card">
            <label className="faq-search__label" htmlFor="faq-search-input">Buscar no FAQ</label>
            <input
              id="faq-search-input"
              className="faq-search__input"
              type="search"
              placeholder="Digite uma palavra-chave, como DARF, fundo ou restituição"
              value={search}
              onChange={event => setSearch(event.target.value)}
            />
          </div>

          {loading ? (
            <div className="p-8 text-center">Carregando perguntas...</div>
          ) : filteredFaqData.length > 0 ? (
            filteredFaqData.map((cat, ci) => (
              <div key={cat.cat} className="faq-category">
                <h2 className="faq-category__title"><HelpCircle size={20}/> {cat.cat}</h2>
                {cat.items.map((item, ii) => {
                  const key = `${cat.cat}-${ii}`;
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
            ))
          ) : (
            <div className="faq-empty card">
              <h2 className="faq-empty__title">Nenhum resultado encontrado</h2>
              <p className="faq-empty__text">Tente pesquisar por termos mais simples, como “DARF”, “fundos” ou “restituição”.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
