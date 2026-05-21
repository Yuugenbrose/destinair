import { useState } from 'react';
import { Plus, Edit, Trash2, X, Building2 } from 'lucide-react';
import useScrollReveal from '../hooks/useScrollReveal';
import './Admin.css';

const initialFunds = [
  { id:'1', name:'FDCA — Cornélio Procópio', type:'FDCA', level:'MUNICIPAL', state:'PR', city:'Cornélio Procópio', isActive:true },
  { id:'2', name:'FDI — Cornélio Procópio', type:'FDI', level:'MUNICIPAL', state:'PR', city:'Cornélio Procópio', isActive:true },
  { id:'3', name:'FDCA — Londrina', type:'FDCA', level:'MUNICIPAL', state:'PR', city:'Londrina', isActive:true },
];

export default function AdminFundos() {
  const rootRef = useScrollReveal();
  const [funds, setFunds] = useState(initialFunds);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name:'', type:'FDCA', level:'MUNICIPAL', state:'', city:'', cnpj:'', description:'' });

  const openNew = () => { setEditing(null); setForm({ name:'',type:'FDCA',level:'MUNICIPAL',state:'',city:'',cnpj:'',description:'' }); setShowModal(true); };
  const openEdit = (f) => { setEditing(f.id); setForm({...f}); setShowModal(true); };

  const handleSave = (e) => {
    e.preventDefault();
    if (editing) {
      setFunds(funds.map(f=>f.id===editing?{...f,...form}:f));
    } else {
      setFunds([...funds, { ...form, id: Date.now().toString(), isActive: true }]);
    }
    setShowModal(false);
  };

  const handleDelete = (id) => { if(confirm('Desativar este fundo?')) setFunds(funds.filter(f=>f.id!==id)); };

  return (
    <div className="admin-page" ref={rootRef}>
      <section className="section" data-reveal>
        <div className="container">
          <div className="admin-header" data-reveal>
            <div>
              <h1><Building2 size={28}/> Gestão de Fundos</h1>
              <p>Gerencie os fundos sociais cadastrados na plataforma.</p>
            </div>
            <button className="btn btn--primary" onClick={openNew}><Plus size={18}/> Novo Fundo</button>
          </div>

          <div className="dash-table card" data-reveal style={{ '--reveal-delay': '120ms' }}>
            <table>
              <thead><tr><th>Nome</th><th>Tipo</th><th>Nível</th><th>UF</th><th>Cidade</th><th>Ações</th></tr></thead>
              <tbody>
                {funds.map(f=>(
                  <tr key={f.id}>
                    <td className="dash-table__fund">{f.name}</td>
                    <td><span className={`badge badge--${f.type==='FDCA'?'primary':'secondary'}`}>{f.type}</span></td>
                    <td>{f.level}</td>
                    <td>{f.state||'—'}</td>
                    <td>{f.city||'—'}</td>
                    <td className="admin-actions">
                      <button className="btn btn--ghost btn--sm" onClick={()=>openEdit(f)}><Edit size={14}/></button>
                      <button className="btn btn--ghost btn--sm" onClick={()=>handleDelete(f.id)} style={{color:'var(--color-error)'}}><Trash2 size={14}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Modal */}
          {showModal && (
            <div className="modal-overlay" onClick={()=>setShowModal(false)}>
              <div className="modal card" onClick={e=>e.stopPropagation()}>
                <div className="modal__header">
                  <h2>{editing?'Editar':'Novo'} Fundo</h2>
                  <button className="btn btn--ghost btn--sm" onClick={()=>setShowModal(false)}><X size={18}/></button>
                </div>
                <form onSubmit={handleSave} className="modal__form">
                  <div className="form-group"><label className="form-label">Nome</label><input className="form-input" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/></div>
                  <div className="grid grid--2">
                    <div className="form-group"><label className="form-label">Tipo</label><select className="form-input form-select" value={form.type} onChange={e=>setForm({...form,type:e.target.value})}><option value="FDCA">FDCA</option><option value="FDI">FDI</option></select></div>
                    <div className="form-group"><label className="form-label">Nível</label><select className="form-input form-select" value={form.level} onChange={e=>setForm({...form,level:e.target.value})}><option value="MUNICIPAL">Municipal</option><option value="ESTADUAL">Estadual</option><option value="NACIONAL">Nacional</option></select></div>
                  </div>
                  <div className="grid grid--2">
                    <div className="form-group"><label className="form-label">UF</label><input className="form-input" value={form.state} onChange={e=>setForm({...form,state:e.target.value})}/></div>
                    <div className="form-group"><label className="form-label">Cidade</label><input className="form-input" value={form.city} onChange={e=>setForm({...form,city:e.target.value})}/></div>
                  </div>
                  <div className="form-group"><label className="form-label">CNPJ</label><input className="form-input" value={form.cnpj} onChange={e=>setForm({...form,cnpj:e.target.value})}/></div>
                  <div className="form-group"><label className="form-label">Descrição</label><textarea className="form-input" rows={3} value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></div>
                  <button type="submit" className="btn btn--primary btn--full">{editing?'Salvar':'Criar'}</button>
                </form>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
