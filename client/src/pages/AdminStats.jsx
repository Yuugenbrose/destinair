import { useEffect, useState } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Plus, Edit2, Trash2, X, Save, BarChart3 } from 'lucide-react';
import './Admin.css';

// Todos os campos de valor neste formulário são digitados em R$ MILHÕES
// (ex: "394.5" para R$ 394,5 milhões), não em reais crus. Isso evita o
// problema de digitar/colar um número de 9 dígitos como "413990000" (fácil
// de errar a quantidade de zeros, ou de colar um valor formatado à
// brasileira como "413.990.531,67", que um <input type="number"> não sabe
// interpretar e gera lixo tipo "413.99053167"). Convertemos para reais
// (× 1.000.000) só na hora de salvar no banco.
const emptyForm = {
  referenceYear: new Date().getFullYear(), scope: 'NACIONAL', state: '',
  totalAmountM: '', totalDestinations: '', fdcaTotalM: '', fdiTotalM: '', fdcaPct: '', fdiPct: '', pctContribuintes: '',
  note: '', sourceLabel: '', sourceUrl: '',
};

const toMillions = v => (v == null ? '' : v / 1000000);
const fromMillionsInput = v => (v === '' || v === null || v === undefined ? null : Number(v) * 1000000);
const numOrNull = v => (v === '' || v === null || v === undefined ? null : Number(v));

function statToFormData(s) {
  return {
    referenceYear: s.reference_year || new Date().getFullYear(),
    scope: s.scope || 'NACIONAL',
    state: s.state || '',
    totalAmountM: toMillions(s.total_amount),
    totalDestinations: s.total_destinations ?? '',
    fdcaTotalM: toMillions(s.fdca_total),
    fdiTotalM: toMillions(s.fdi_total),
    fdcaPct: s.fdca_pct ?? '',
    fdiPct: s.fdi_pct ?? '',
    pctContribuintes: s.pct_contribuintes ?? '',
    note: s.note || '',
    sourceLabel: s.source_label || '',
    sourceUrl: s.source_url || '',
  };
}

export default function AdminStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await api.getNationalStats();
        setStats(data.stats || []);
      } catch (err) {
        console.error('Erro ao buscar estatísticas:', err);
      } finally {
        setLoading(false);
      }
    };
    if (user?.role === 'ADMIN') fetchStats();
  }, [user]);

  if (user?.role !== 'ADMIN') return <div className="container p-8">Acesso restrito a administradores.</div>;

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = {
      referenceYear: Number(formData.referenceYear),
      scope: formData.scope,
      state: formData.scope === 'ESTADUAL' ? (formData.state || null) : null,
      totalAmount: fromMillionsInput(formData.totalAmountM),
      totalDestinations: numOrNull(formData.totalDestinations),
      fdcaTotal: fromMillionsInput(formData.fdcaTotalM),
      fdiTotal: fromMillionsInput(formData.fdiTotalM),
      fdcaPct: numOrNull(formData.fdcaPct),
      fdiPct: numOrNull(formData.fdiPct),
      pctContribuintes: numOrNull(formData.pctContribuintes),
      note: formData.note,
      sourceLabel: formData.sourceLabel,
      sourceUrl: formData.sourceUrl,
    };
    try {
      if (editingId) {
        await api.updateNationalStat(editingId, payload);
      } else {
        await api.createNationalStat(payload);
      }
      const data = await api.getNationalStats();
      setStats(data.stats || []);
      setShowModal(false);
      setEditingId(null);
      setFormData(emptyForm);
    } catch (err) {
      alert('Erro ao salvar estatística no banco.');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Remover esta estatística permanentemente?')) {
      try {
        await api.deleteNationalStat(id);
        setStats(stats.filter(s => s.id !== id));
      } catch (err) {
        alert('Erro ao remover do banco.');
      }
    }
  };

  const openEdit = (s) => {
    setEditingId(s.id);
    setFormData(statToFormData(s));
    setShowModal(true);
  };

  const fmtMoney = v => v == null ? '—' : (v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
  const fmtPct = v => v == null ? '—' : `${v}%`;

  if (loading) return <div className="container p-8">Carregando estatísticas...</div>;

  return (
    <div className="admin-page">
      <section className="section">
        <div className="container">
          <div className="admin-header">
            <div>
              <h1><BarChart3 size={28}/> Estatísticas Nacionais/Estaduais</h1>
              <p>Contexto real sobre destinação do IR no Brasil/Paraná — atualize aqui uma vez por ano, sempre citando a fonte.</p>
            </div>
            <button className="btn btn--primary" onClick={() => { setEditingId(null); setFormData(emptyForm); setShowModal(true); }}>
              <Plus size={18}/> Nova Estatística
            </button>
          </div>

          <div className="dash-table card">
            <table>
              <thead><tr><th>Ano</th><th>Escopo</th><th>Total</th><th>FDCA</th><th>FDI</th><th>Fonte</th><th>Ações</th></tr></thead>
              <tbody>
                {stats.map(s=>(
                  <tr key={s.id}>
                    <td>{s.reference_year}</td>
                    <td>{s.scope === 'ESTADUAL' ? `Estadual (${s.state || '—'})` : 'Nacional'}</td>
                    <td>{fmtMoney(s.total_amount)}</td>
                    <td>{s.fdca_total != null ? fmtMoney(s.fdca_total) : fmtPct(s.fdca_pct)}</td>
                    <td>{s.fdi_total != null ? fmtMoney(s.fdi_total) : fmtPct(s.fdi_pct)}</td>
                    <td>{s.source_label || '—'}</td>
                    <td className="admin-actions">
                      <button className="btn btn--ghost btn--sm" onClick={()=>openEdit(s)}><Edit2 size={14}/></button>
                      <button className="btn btn--ghost btn--sm" onClick={()=>handleDelete(s.id)} style={{color:'var(--color-error)'}}><Trash2 size={14}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {showModal && (
            <div className="modal-overlay" onClick={()=>setShowModal(false)}>
              <div className="modal card" onClick={e=>e.stopPropagation()}>
                <div className="modal__header">
                  <h2>{editingId?'Editar':'Nova'} Estatística</h2>
                  <button className="btn btn--ghost btn--sm" onClick={()=>setShowModal(false)}><X size={18}/></button>
                </div>
                <form onSubmit={handleSave} className="modal__form">
                  <div className="grid grid--2">
                    <div className="form-group"><label className="form-label">Ano de referência</label><input className="form-input" type="number" value={formData.referenceYear} onChange={e=>setFormData({...formData,referenceYear:e.target.value})} required/></div>
                    <div className="form-group"><label className="form-label">Escopo</label><select className="form-input form-select" value={formData.scope} onChange={e=>setFormData({...formData,scope:e.target.value})}><option value="NACIONAL">Nacional</option><option value="ESTADUAL">Estadual</option></select></div>
                  </div>
                  {formData.scope === 'ESTADUAL' && (
                    <div className="form-group"><label className="form-label">UF</label><input className="form-input" value={formData.state} onChange={e=>setFormData({...formData,state:e.target.value})} placeholder="Ex: PR"/></div>
                  )}

                  <div className="form-group">
                    <label className="form-label">Total combinado — em R$ milhões (ex: 394.5 para R$ 394,5 milhões)</label>
                    <input className="form-input" type="number" step="0.1" value={formData.totalAmountM} onChange={e=>setFormData({...formData,totalAmountM:e.target.value})} placeholder="Ex: 394.5"/>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Número de destinações realizadas (opcional — sobre quem destinou, não quem foi beneficiado)</label>
                    <input className="form-input" type="number" step="1" value={formData.totalDestinations} onChange={e=>setFormData({...formData,totalDestinations:e.target.value})} placeholder="Ex: 321323"/>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Split FDCA / FDI — informe em % (o jeito que a fonte normalmente divulga)</label>
                    <div className="grid grid--2">
                      <input className="form-input" type="number" step="0.1" min="0" max="100" value={formData.fdcaPct} onChange={e=>setFormData({...formData,fdcaPct:e.target.value})} placeholder="% FDCA, ex: 58"/>
                      <input className="form-input" type="number" step="0.1" min="0" max="100" value={formData.fdiPct} onChange={e=>setFormData({...formData,fdiPct:e.target.value})} placeholder="% FDI, ex: 42"/>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Ou, se souber os valores exatos — em R$ milhões (deixe em branco se usar o % acima)</label>
                    <div className="grid grid--2">
                      <input className="form-input" type="number" step="0.1" value={formData.fdcaTotalM} onChange={e=>setFormData({...formData,fdcaTotalM:e.target.value})} placeholder="FDCA em milhões"/>
                      <input className="form-input" type="number" step="0.1" value={formData.fdiTotalM} onChange={e=>setFormData({...formData,fdiTotalM:e.target.value})} placeholder="FDI em milhões"/>
                    </div>
                  </div>

                  <div className="form-group"><label className="form-label">% de contribuintes que usam (opcional)</label><input className="form-input" type="number" step="0.1" value={formData.pctContribuintes} onChange={e=>setFormData({...formData,pctContribuintes:e.target.value})}/></div>
                  <div className="form-group"><label className="form-label">Nota/contexto</label><textarea className="form-input" rows={3} value={formData.note} onChange={e=>setFormData({...formData,note:e.target.value})}/></div>
                  <div className="grid grid--2">
                    <div className="form-group"><label className="form-label">Nome da fonte</label><input className="form-input" value={formData.sourceLabel} onChange={e=>setFormData({...formData,sourceLabel:e.target.value})} placeholder="Ex: Ministério dos Direitos Humanos"/></div>
                    <div className="form-group"><label className="form-label">Link da fonte</label><input className="form-input" type="url" value={formData.sourceUrl} onChange={e=>setFormData({...formData,sourceUrl:e.target.value})} placeholder="https://..."/></div>
                  </div>
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
