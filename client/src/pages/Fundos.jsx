import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Filter, Users, Heart, ChevronRight, Building2 } from 'lucide-react';
import useScrollReveal from '../hooks/useScrollReveal';
import './Fundos.css';

/* Mock data — replace with api.getFunds() */
const MOCK_FUNDS = [
  { id: '1', name: 'Fundo Municipal dos Direitos da Criança e do Adolescente', type: 'FDCA', level: 'MUNICIPAL', state: 'PR', city: 'Cornélio Procópio', cnpj: '00.000.000/0001-01', description: 'Fundo destinado a financiar projetos de proteção à infância e adolescência no município.', isActive: true, projectCount: 8, totalRaised: 245000 },
  { id: '2', name: 'Fundo Municipal da Pessoa Idosa', type: 'FDI', level: 'MUNICIPAL', state: 'PR', city: 'Cornélio Procópio', cnpj: '00.000.000/0001-02', description: 'Fundo para programas de amparo e qualidade de vida da pessoa idosa.', isActive: true, projectCount: 5, totalRaised: 180000 },
  { id: '3', name: 'Fundo Estadual dos Direitos da Criança e do Adolescente do Paraná', type: 'FDCA', level: 'ESTADUAL', state: 'PR', city: null, cnpj: '00.000.000/0001-03', description: 'Fundo estadual para projetos de grande escala no Paraná.', isActive: true, projectCount: 24, totalRaised: 1250000 },
  { id: '4', name: 'Fundo Nacional dos Direitos da Criança e do Adolescente', type: 'FDCA', level: 'NACIONAL', state: null, city: null, cnpj: '00.000.000/0001-04', description: 'Fundo gerido pelo CONANDA para projetos nacionais.', isActive: true, projectCount: 45, totalRaised: 8500000 },
  { id: '5', name: 'Fundo Municipal dos Direitos da Criança - Londrina', type: 'FDCA', level: 'MUNICIPAL', state: 'PR', city: 'Londrina', cnpj: '00.000.000/0001-05', description: 'Investimentos em projetos sociais para crianças e adolescentes em Londrina.', isActive: true, projectCount: 15, totalRaised: 890000 },
  { id: '6', name: 'Fundo Municipal da Pessoa Idosa - Curitiba', type: 'FDI', level: 'MUNICIPAL', state: 'PR', city: 'Curitiba', cnpj: '00.000.000/0001-06', description: 'Fundo curitibano para proteção e amparo à pessoa idosa.', isActive: true, projectCount: 20, totalRaised: 1500000 },
  { id: '7', name: 'Fundo Nacional da Pessoa Idosa', type: 'FDI', level: 'NACIONAL', state: null, city: null, cnpj: '00.000.000/0001-07', description: 'Fundo nacional para políticas públicas de proteção ao idoso.', isActive: true, projectCount: 30, totalRaised: 6200000 },
  { id: '8', name: 'Fundo Municipal dos Direitos da Criança - Maringá', type: 'FDCA', level: 'MUNICIPAL', state: 'PR', city: 'Maringá', cnpj: '00.000.000/0001-08', description: 'Projetos de educação e proteção à infância em Maringá.', isActive: true, projectCount: 12, totalRaised: 720000 },
];

function formatCurrency(val) {
  return (val || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
}

export default function Fundos() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [levelFilter, setLevelFilter] = useState('ALL');
  const [funds, setFunds] = useState(MOCK_FUNDS);
  const rootRef = useScrollReveal();

  const filtered = useMemo(() => {
    return funds.filter(f => {
      const matchesSearch = !search ||
        f.name.toLowerCase().includes(search.toLowerCase()) ||
        (f.city && f.city.toLowerCase().includes(search.toLowerCase())) ||
        (f.state && f.state.toLowerCase().includes(search.toLowerCase()));
      const matchesType = typeFilter === 'ALL' || f.type === typeFilter;
      const matchesLevel = levelFilter === 'ALL' || f.level === levelFilter;
      return matchesSearch && matchesType && matchesLevel;
    });
  }, [funds, search, typeFilter, levelFilter]);

  return (
    <div className="fundos-page" ref={rootRef}>
      <section className="cf-hero section--dark" data-reveal>
        <div className="container">
          <div className="section-header">
            <span className="section-header__tag" style={{ color: 'var(--color-secondary-light)' }}>Diretório</span>
            <h1 className="section-header__title">Encontre um fundo social</h1>
            <p className="section-header__subtitle">
              Busque fundos por município, estado ou tipo. Conheça os projetos e escolha para onde destinar seu imposto.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Filters */}
          <div className="fundos-filters card" data-reveal>
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
              <select
                className="form-input form-select"
                value={typeFilter}
                onChange={e => setTypeFilter(e.target.value)}
                id="fund-type-filter"
              >
                <option value="ALL">Todos os tipos</option>
                <option value="FDCA">FDCA — Criança e Adolescente</option>
                <option value="FDI">FDI — Pessoa Idosa</option>
              </select>
              <select
                className="form-input form-select"
                value={levelFilter}
                onChange={e => setLevelFilter(e.target.value)}
                id="fund-level-filter"
              >
                <option value="ALL">Todos os níveis</option>
                <option value="MUNICIPAL">Municipal</option>
                <option value="ESTADUAL">Estadual</option>
                <option value="NACIONAL">Nacional</option>
              </select>
            </div>
          </div>

          {/* Results count */}
          <div className="fundos-count" data-reveal style={{ '--reveal-delay': '80ms' }}>
            <span>{filtered.length} fundo{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}</span>
          </div>

          {/* Fund Cards */}
          <div className="grid grid--2">
            {filtered.map((fund, i) => (
              <Link to={`/fundos/${fund.id}`} key={fund.id} className="fund-card card" data-reveal style={{ '--reveal-delay': `${i * 80}ms` }}>
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
                <p className="fund-card__desc">{fund.description}</p>
                <div className="fund-card__stats">
                  <div className="fund-card__stat">
                    <strong>{fund.projectCount}</strong>
                    <span>projetos</span>
                  </div>
                  <div className="fund-card__stat">
                    <strong>{formatCurrency(fund.totalRaised)}</strong>
                    <span>arrecadado</span>
                  </div>
                </div>
                <div className="fund-card__cta">
                  Ver detalhes <ChevronRight size={16} />
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="fundos-empty card text-center" data-reveal>
              <Building2 size={48} className="fundos-empty__icon" />
              <h3>Nenhum fundo encontrado</h3>
              <p>Tente ajustar os filtros ou buscar por outro termo.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
