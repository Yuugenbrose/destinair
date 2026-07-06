import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Users, Heart, ChevronRight, Building2, ChevronLeft } from 'lucide-react';
import { api } from '../services/api';
import './Fundos.css';

const UFS = [
  ['AC', 'Acre'], ['AL', 'Alagoas'], ['AP', 'Amapá'], ['AM', 'Amazonas'], ['BA', 'Bahia'],
  ['CE', 'Ceará'], ['DF', 'Distrito Federal'], ['ES', 'Espírito Santo'], ['GO', 'Goiás'],
  ['MA', 'Maranhão'], ['MT', 'Mato Grosso'], ['MS', 'Mato Grosso do Sul'], ['MG', 'Minas Gerais'],
  ['PA', 'Pará'], ['PB', 'Paraíba'], ['PR', 'Paraná'], ['PE', 'Pernambuco'], ['PI', 'Piauí'],
  ['RJ', 'Rio de Janeiro'], ['RN', 'Rio Grande do Norte'], ['RS', 'Rio Grande do Sul'],
  ['RO', 'Rondônia'], ['RR', 'Roraima'], ['SC', 'Santa Catarina'], ['SP', 'São Paulo'],
  ['SE', 'Sergipe'], ['TO', 'Tocantins'],
];

const PAGE_SIZE = 20;

export default function Fundos() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [levelFilter, setLevelFilter] = useState('ALL');
  const [stateFilter, setStateFilter] = useState('ALL');
  const [page, setPage] = useState(1);

  const [funds, setFunds] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Espera 350ms depois que a pessoa para de digitar antes de buscar —
  // evita uma requisição a cada tecla, o que faria sentido pouco quando
  // tínhamos 6 fundos, mas é importante agora com ~7 mil registros no banco.
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  // Qualquer mudança de filtro volta pra página 1 (senão a pessoa podia ficar
  // "presa" numa página 12 que não existe mais depois de filtrar)
  useEffect(() => { setPage(1); }, [debouncedSearch, typeFilter, levelFilter, stateFilter]);

  useEffect(() => {
    const fetchFunds = async () => {
      setLoading(true);
      try {
        const params = { page, pageSize: PAGE_SIZE };
        if (debouncedSearch) params.search = debouncedSearch;
        if (typeFilter !== 'ALL') params.type = typeFilter;
        if (levelFilter !== 'ALL') params.level = levelFilter;
        if (stateFilter !== 'ALL') params.state = stateFilter;
        const data = await api.getFunds(params);
        setFunds(data.funds || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
        setError(null);
      } catch (err) {
        console.error('Erro ao buscar fundos:', err);
        setError('Não foi possível carregar os fundos agora. Tente novamente em instantes.');
      } finally {
        setLoading(false);
      }
    };
    fetchFunds();
  }, [debouncedSearch, typeFilter, levelFilter, stateFilter, page]);

  return (
    <div className="fundos-page">
      <section className="cf-hero section--dark">
        <div className="container">
          <div className="section-header">
            <span className="section-header__tag" style={{ color: 'var(--color-secondary-light)' }}>Diretório</span>
            <h1 className="section-header__title">Encontre um fundo social</h1>
            <p className="section-header__subtitle">
              Mais de 7 mil fundos reais, habilitados pela Receita Federal para receber destinação do IRPF em 2026 —
              busque por nome, cidade, estado ou tipo, com CNPJ e dados de contato quando disponíveis.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Filters */}
          <div className="fundos-filters card">
            <div className="fundos-filters__search">
              <Search size={20} className="fundos-filters__search-icon" />
              <input
                type="text"
                className="form-input"
                placeholder="Buscar por nome, cidade ou estado..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                id="fund-search"
              />
            </div>
            <div className="fundos-filters__selects">
              <select className="form-input form-select" value={typeFilter} onChange={e => setTypeFilter(e.target.value)} id="fund-type-filter">
                <option value="ALL">Todos os tipos</option>
                <option value="FDCA">FDCA — Criança e Adolescente</option>
                <option value="FDI">FDI — Pessoa Idosa</option>
              </select>
              <select className="form-input form-select" value={levelFilter} onChange={e => setLevelFilter(e.target.value)} id="fund-level-filter">
                <option value="ALL">Todos os níveis</option>
                <option value="MUNICIPAL">Municipal</option>
                <option value="ESTADUAL">Estadual</option>
                <option value="NACIONAL">Nacional</option>
              </select>
              <select className="form-input form-select" value={stateFilter} onChange={e => setStateFilter(e.target.value)} id="fund-state-filter">
                <option value="ALL">Todos os estados</option>
                {UFS.map(([uf, nome]) => <option key={uf} value={uf}>{nome} ({uf})</option>)}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center">Carregando fundos do banco de dados...</div>
          ) : error ? (
            <div className="fundos-empty card text-center">
              <p>{error}</p>
            </div>
          ) : (
            <>
              <div className="fundos-count">
                <span>{total.toLocaleString('pt-BR')} fundo{total !== 1 ? 's' : ''} encontrado{total !== 1 ? 's' : ''}</span>
              </div>

              <div className="grid grid--2">
                {funds.map((fund) => (
                  <Link to={`/fundos/${fund.id}`} key={fund.id} className="fund-card card">
                    <div className="fund-card__header">
                      <div className={`fund-card__type-badge badge badge--${fund.type === 'FDCA' ? 'primary' : 'secondary'}`}>
                        {fund.type === 'FDCA' ? <Users size={12} /> : <Heart size={12} />}
                        {fund.type}
                      </div>
                      <span className={`badge badge--${fund.level === 'NACIONAL' ? 'accent' : fund.level === 'ESTADUAL' ? 'warning' : 'success'}`}>
                        {fund.level}
                      </span>
                    </div>
                    <h3 className="fund-card__name">{fund.name}</h3>
                    {(fund.city || fund.state) && (
                      <div className="fund-card__location">
                        <MapPin size={14} />
                        <span>{[fund.city, fund.state].filter(Boolean).join(' — ')}</span>
                      </div>
                    )}
                    <div className="fund-card__stats">
                      <div className="fund-card__stat">
                        <strong>{fund.cnpj || '—'}</strong>
                        <span>CNPJ</span>
                      </div>
                    </div>
                    <div className="fund-card__cta">
                      Ver detalhes <ChevronRight size={16} />
                    </div>
                  </Link>
                ))}
              </div>

              {funds.length === 0 && (
                <div className="fundos-empty card text-center">
                  <Building2 size={48} className="fundos-empty__icon" />
                  <h3>Nenhum fundo encontrado</h3>
                  <p>Tente ajustar os filtros ou buscar por outro termo.</p>
                </div>
              )}

              {totalPages > 1 && (
                <div className="fundos-pagination">
                  <button className="btn btn--ghost btn--sm" disabled={page <= 1} onClick={() => setPage(p => p - 1)}>
                    <ChevronLeft size={16} /> Anterior
                  </button>
                  <span>Página {page} de {totalPages}</span>
                  <button className="btn btn--ghost btn--sm" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>
                    Próxima <ChevronRight size={16} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
