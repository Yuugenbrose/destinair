import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, FileCheck } from 'lucide-react';
import { api } from '../services/api';
import './FundoDetalhe.css';

const LEVEL_LABEL = { MUNICIPAL: 'municipal', ESTADUAL: 'estadual', NACIONAL: 'nacional' };
const TYPE_LABEL = { FDCA: 'da Criança e do Adolescente (FDCA)', FDI: 'da Pessoa Idosa (FDI)' };

export default function FundoDetalhe() {
  const { id } = useParams();
  const [fund, setFund] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFund = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.getFund(id);
        setFund(data.fund);
      } catch (err) {
        console.error('Erro ao buscar fundo:', err);
        setError('Fundo não encontrado.');
      } finally {
        setLoading(false);
      }
    };
    fetchFund();
  }, [id]);

  if (loading) return <div className="container p-8 text-center">Carregando fundo...</div>;

  if (error || !fund) {
    return (
      <div className="container p-8 text-center">
        <p>{error || 'Fundo não encontrado.'}</p>
        <Link to="/fundos" className="btn btn--primary mt-4">Voltar para o diretório</Link>
      </div>
    );
  }

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
          <div className="fd-hero__location"><MapPin size={16}/> {[fund.city,fund.state].filter(Boolean).join(' — ') || 'Nível nacional'}</div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="fd-layout">
            <div className="fd-main">
              <div className="fd-section">
                <h2>Sobre</h2>
                <p>
                  Fundo dos Direitos {TYPE_LABEL[fund.type]}, de abrangência {LEVEL_LABEL[fund.level]}
                  {fund.city ? ` em ${fund.city} (${fund.state})` : fund.state ? ` no estado de ${fund.state}` : ' em nível nacional'}.
                  {fund.data_year && ` Habilitado pela Receita Federal para receber destinações do Imposto de Renda na base de ${fund.data_year}.`}
                </p>
              </div>
            </div>
            <aside className="fd-sidebar">
              <div className="fd-sidebar__card card">
                <h3><FileCheck size={16} style={{display:'inline', verticalAlign:'middle', marginRight:6}}/>Informações oficiais</h3>
                <div className="fd-info-row"><span className="fd-info-label">CNPJ</span><span>{fund.cnpj || '—'}</span></div>
                <div className="fd-info-row"><span className="fd-info-label">Nível</span><span>{fund.level}</span></div>
                <div className="fd-info-row"><span className="fd-info-label">UF</span><span>{fund.state || '—'}</span></div>
                {fund.city && <div className="fd-info-row"><span className="fd-info-label">Município</span><span>{fund.city}</span></div>}
                {fund.ibge_code && <div className="fd-info-row"><span className="fd-info-label">Código IBGE</span><span>{fund.ibge_code}</span></div>}
                {fund.data_year && <div className="fd-info-row"><span className="fd-info-label">Base de dados</span><span>Habilitados {fund.data_year}</span></div>}
              </div>
              <Link to="/simulador" className="btn btn--primary btn--lg btn--full">Simular destinação</Link>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
