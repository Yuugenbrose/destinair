import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Plus, Edit2, Trash2, X, Save, Building2, Search, ChevronLeft, ChevronRight, Upload, AlertTriangle } from 'lucide-react';
import './Admin.css';

const emptyForm = { name: '', type: 'FDCA', level: 'MUNICIPAL', state: '', city: '', cnpj: '' };

function fundToFormData(f) {
  return {
    name: f.name || '',
    type: f.type || 'FDCA',
    level: f.level || 'MUNICIPAL',
    state: f.state || '',
    city: f.city || '',
    cnpj: f.cnpj || '',
  };
}

const PAGE_SIZE = 20;

export default function AdminFundos() {
  const { user } = useAuth();
  const [funds, setFunds] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState(emptyForm);

  // ---- Importação da base oficial (CSV) ----
  const [importStatus, setImportStatus] = useState(null);
  const [importYear, setImportYear] = useState(new Date().getFullYear());
  const [fdcaFile, setFdcaFile] = useState(null);
  const [fdiFile, setFdiFile] = useState(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => { setPage(1); }, [debouncedSearch]);

  const fetchFunds = async () => {
    setLoading(true);
    try {
      const params = { page, pageSize: PAGE_SIZE };
      if (debouncedSearch) params.search = debouncedSearch;
      const data = await api.getFunds(params);
      setFunds(data.funds || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error('Erro ao buscar fundos:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchImportStatus = async () => {
    try {
      const data = await api.getFundsImportStatus();
      setImportStatus(data);
    } catch (err) {
      console.error('Erro ao buscar status de importação:', err);
    }
  };

  useEffect(() => {
    if (user?.role === 'ADMIN') { fetchFunds(); fetchImportStatus(); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, page, debouncedSearch]);

  if (user?.role !== 'ADMIN') return <div className="container p-8">Acesso restrito a administradores.</div>;

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingId) await api.updateFund(editingId, formData);
      else await api.createFund(formData);
      setShowModal(false);
      setEditingId(null);
      setFormData(emptyForm);
      fetchFunds();
    } catch (err) {
      alert('Erro ao salvar fundo no banco.');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Deletar este fundo permanentemente do banco de dados?')) {
      try {
        await api.deleteFund(id);
        fetchFunds();
        fetchImportStatus();
      } catch (err) {
        alert('Erro ao deletar do banco.');
      }
    }
  };

  const openEdit = (f) => {
    setEditingId(f.id);
    setFormData(fundToFormData(f));
    setShowModal(true);
  };

  const currentYears = importStatus?.years?.map(y => y.data_year).join(', ') || 'nenhum';
  const currentTotal = importStatus?.years?.reduce((s, y) => s + y.total, 0) || 0;

  const handleImport = async () => {
    if (!fdcaFile || !fdiFile) return alert('Selecione os dois arquivos (FDCA e FDI).');
    const confirmMsg = currentTotal > 0
      ? `Isso vai APAGAR os ${currentTotal.toLocaleString('pt-BR')} fundos da base atual (ano ${currentYears}) e importar os novos arquivos como base ${importYear}. Fundos cadastrados manualmente não são afetados. Confirma?`
      : `Importar os arquivos como base ${importYear}?`;
    if (!confirm(confirmMsg)) return;

    setImporting(true);
    setImportResult(null);
    try {
      const [fdcaCsv, fdiCsv] = await Promise.all([fdcaFile.text(), fdiFile.text()]);
      const res = await api.importFunds({ year: Number(importYear), fdcaCsv, fdiCsv });
      setImportResult({ ok: true, total: res.total, year: res.year });
      setFdcaFile(null);
      setFdiFile(null);
      fetchFunds();
      fetchImportStatus();
    } catch (err) {
      setImportResult({ ok: false, error: err.message || 'Erro ao importar.' });
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="admin-page">
      <section className="section">
        <div className="container">
          <div className="admin-header">
            <div>
              <h1><Building2 size={28}/> Gestão de Fundos (Base Real)</h1>
              <p>{total.toLocaleString('pt-BR')} fundos persistidos no Cloudflare D1 — base oficial ({currentYears}) + cadastros manuais.</p>
            </div>
            <button className="btn btn--primary" onClick={() => { setEditingId(null); setFormData(emptyForm); setShowModal(true); }}>
              <Plus size={18}/> Novo Fundo Manual
            </button>
          </div>

          {/* ---- Importação da base oficial ---- */}
          <div className="card mb-8" style={{padding: 'var(--space-6)'}}>
            <h2 style={{display:'flex', alignItems:'center', gap:'var(--space-2)', marginBottom:'var(--space-2)'}}><Upload size={20}/> Importar base oficial (Receita Federal)</h2>
            <p style={{fontSize:'var(--font-size-sm)', color:'var(--color-text-secondary)', marginBottom:'var(--space-4)'}}>
              Envie os Anexos I (FDCA) e II (FDI) de "Habilitados" do ano desejado — o mesmo formato CSV que a Receita Federal publica todo ano.
              Isso <strong>substitui</strong> a base oficial atual ({currentTotal.toLocaleString('pt-BR')} fundos, ano {currentYears}); fundos cadastrados manualmente não são afetados.
            </p>
            <div className="grid grid--2" style={{marginBottom: 'var(--space-4)'}}>
              <div className="form-group">
                <label className="form-label">Anexo I — FDCA (.csv)</label>
                <input className="form-input" type="file" accept=".csv" onChange={e => setFdcaFile(e.target.files?.[0] || null)} />
              </div>
              <div className="form-group">
                <label className="form-label">Anexo II — FDI (.csv)</label>
                <input className="form-input" type="file" accept=".csv" onChange={e => setFdiFile(e.target.files?.[0] || null)} />
              </div>
            </div>
            <div className="form-group" style={{maxWidth: 160, marginBottom: 'var(--space-4)'}}>
              <label className="form-label">Ano de referência</label>
              <input className="form-input" type="number" value={importYear} onChange={e => setImportYear(e.target.value)} />
            </div>
            <button className="btn btn--secondary" onClick={handleImport} disabled={importing || !fdcaFile || !fdiFile}>
              <Upload size={16}/> {importing ? 'Importando (pode levar alguns minutos)...' : 'Importar e substituir base atual'}
            </button>
            {importResult?.ok && (
              <p style={{color:'var(--color-success)', marginTop:'var(--space-3)'}}>
                {importResult.total.toLocaleString('pt-BR')} fundos importados como base {importResult.year}.
              </p>
            )}
            {importResult && !importResult.ok && (
              <p style={{color:'var(--color-error)', marginTop:'var(--space-3)', display:'flex', gap:'var(--space-2)', alignItems:'center'}}>
                <AlertTriangle size={16}/> {importResult.error}
              </p>
            )}
          </div>

          <div className="fundos-filters card mb-4" style={{padding: 'var(--space-4)'}}>
            <div className="fundos-filters__search">
              <Search size={18} className="fundos-filters__search-icon" />
              <input className="form-input" placeholder="Buscar por nome, cidade ou estado..." value={search} onChange={e=>setSearch(e.target.value)} />
            </div>
          </div>

          {loading ? (
            <div className="p-8 text-center">Carregando...</div>
          ) : (
            <>
              <div className="dash-table card">
                <table>
                  <thead><tr><th>Nome</th><th>Tipo</th><th>Nível</th><th>UF</th><th>Cidade</th><th>CNPJ</th><th>Ações</th></tr></thead>
                  <tbody>
                    {funds.map(f=>(
                      <tr key={f.id}>
                        <td className="dash-table__fund">{f.name}</td>
                        <td><span className={`badge badge--${f.type==='FDCA'?'primary':'secondary'}`}>{f.type}</span></td>
                        <td>{f.level}</td>
                        <td>{f.state||'—'}</td>
                        <td>{f.city||'—'}</td>
                        <td>{f.cnpj||'—'}</td>
                        <td className="admin-actions">
                          <button className="btn btn--ghost btn--sm" onClick={()=>openEdit(f)}><Edit2 size={14}/></button>
                          <button className="btn btn--ghost btn--sm" onClick={()=>handleDelete(f.id)} style={{color:'var(--color-error)'}}><Trash2 size={14}/></button>
                        </td>
                      </tr>
                    ))}
                    {funds.length === 0 && (
                      <tr><td colSpan={7} className="text-center p-8">Nenhum fundo encontrado para essa busca.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>

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

          {showModal && (
            <div className="modal-overlay" onClick={()=>setShowModal(false)}>
              <div className="modal card" onClick={e=>e.stopPropagation()}>
                <div className="modal__header">
                  <h2>{editingId?'Editar':'Novo'} Fundo Manual</h2>
                  <button className="btn btn--ghost btn--sm" onClick={()=>setShowModal(false)}><X size={18}/></button>
                </div>
                <form onSubmit={handleSave} className="modal__form">
                  <div className="form-group"><label className="form-label">Nome</label><input className="form-input" value={formData.name} onChange={e=>setFormData({...formData,name:e.target.value})} required/></div>
                  <div className="grid grid--2">
                    <div className="form-group"><label className="form-label">Tipo</label><select className="form-input form-select" value={formData.type} onChange={e=>setFormData({...formData,type:e.target.value})}><option value="FDCA">FDCA</option><option value="FDI">FDI</option></select></div>
                    <div className="form-group"><label className="form-label">Nível</label><select className="form-input form-select" value={formData.level} onChange={e=>setFormData({...formData,level:e.target.value})}><option value="MUNICIPAL">Municipal</option><option value="ESTADUAL">Estadual</option><option value="NACIONAL">Nacional</option></select></div>
                  </div>
                  <div className="grid grid--2">
                    <div className="form-group"><label className="form-label">UF</label><input className="form-input" value={formData.state} onChange={e=>setFormData({...formData,state:e.target.value})}/></div>
                    <div className="form-group"><label className="form-label">Cidade</label><input className="form-input" value={formData.city} onChange={e=>setFormData({...formData,city:e.target.value})}/></div>
                  </div>
                  <div className="form-group"><label className="form-label">CNPJ (deixe em branco se não confirmado)</label><input className="form-input" value={formData.cnpj} onChange={e=>setFormData({...formData,cnpj:e.target.value})}/></div>
                  <button type="submit" className="btn btn--primary btn--full"><Save size={18}/> {editingId?'Salvar Alterações':'Criar no Banco'}</button>
                </form>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
