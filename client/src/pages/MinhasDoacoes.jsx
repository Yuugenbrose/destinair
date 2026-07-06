import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Trash2, CheckCircle, Info, Paperclip, ExternalLink } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const fmt = v => (v||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const statusLabels = { SIMULADA:'Simulada', CONFIRMADA:'Confirmada', PAGA:'Paga' };
const statusBadge = { SIMULADA:'accent', CONFIRMADA:'warning', PAGA:'success' };

export default function MinhasDoacoes() {
  const { user } = useAuth();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDonations = async () => {
    try {
      const data = await api.getDonations();
      setDonations(data.donations || []);
    } catch (err) {
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchDonations();
    else setLoading(false);
  }, [user]);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await api.updateDonation(id, { status: newStatus });
      setDonations(donations.map(d => d.id === id ? { ...d, status: newStatus } : d));
    } catch (err) {
      alert('Erro ao atualizar status.');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Deseja excluir este registro permanentemente?')) {
      try {
        await api.deleteDonation(id);
        setDonations(donations.filter(d => d.id !== id));
      } catch (err) {
        alert('Erro ao excluir.');
      }
    }
  };

  const handleSaveReceiptLink = async (id, currentLink) => {
    const link = window.prompt(
      'Cole aqui o link de onde você guardou o comprovante de pagamento do DARF (Google Drive, e-mail, etc.). Isso é só uma referência pessoal sua — não enviamos nem verificamos esse documento.',
      currentLink || ''
    );
    if (link === null) return; // usuário cancelou
    try {
      await api.updateDonation(id, { receiptLink: link });
      setDonations(donations.map(d => d.id === id ? { ...d, receipt_link: link } : d));
    } catch (err) {
      alert('Erro ao salvar o link do comprovante.');
    }
  };

  if (loading) return <div className="container p-8">Carregando histórico...</div>;

  if (!user) {
    return (
      <div className="container p-8 text-center">
        <p>Você precisa estar logado para ver suas doações.</p>
        <Link to="/login" className="btn btn--primary mt-4">Fazer login</Link>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <section className="section">
        <div className="container">
          <div className="dash-welcome">
            <Link to="/dashboard" style={{fontSize:'var(--font-size-sm)',display:'inline-flex',alignItems:'center',gap:'4px',marginBottom:'var(--space-4)'}}><ArrowLeft size={16}/> Dashboard</Link>
            <h1>Minhas Doações (Histórico Real)</h1>
            <p>Gerencie suas simulações e pagamentos salvos no banco de dados.</p>
          </div>

          <div className="dash-table card">
            {donations.length === 0 ? (
              <div className="p-8 text-center">Nenhuma doação encontrada.</div>
            ) : (
              <table>
                <thead><tr><th>Fundo</th><th>Tipo</th><th>Valor</th><th>Ano</th><th>Status</th><th>Comprovante</th><th>Ações</th></tr></thead>
                <tbody>
                  {donations.map(d=>(
                    <tr key={d.id}>
                      <td className="dash-table__fund">{d.fund_name}</td>
                      <td><span className={`badge badge--${d.fund_type==='FDCA'?'primary':'secondary'}`}>{d.fund_type}</span></td>
                      <td><strong>{fmt(d.amount)}</strong></td>
                      <td>{d.tax_year}</td>
                      <td><span className={`badge badge--${statusBadge[d.status]}`}>{statusLabels[d.status]}</span></td>
                      <td>
                        {d.receipt_link ? (
                          <span style={{display:'flex', alignItems:'center', gap:'6px'}}>
                            <a href={d.receipt_link} target="_blank" rel="noopener noreferrer" title="Abrir comprovante" style={{display:'inline-flex', alignItems:'center', gap:'4px'}}>
                              <ExternalLink size={14}/> Ver
                            </a>
                            <button onClick={() => handleSaveReceiptLink(d.id, d.receipt_link)} className="btn btn--ghost btn--sm" title="Editar link">
                              <Paperclip size={13}/>
                            </button>
                          </span>
                        ) : (
                          <button onClick={() => handleSaveReceiptLink(d.id, '')} className="btn btn--ghost btn--sm" title="Guardar link do comprovante">
                            <Paperclip size={14}/> Adicionar
                          </button>
                        )}
                      </td>
                      <td className="flex gap-2">
                        {d.status === 'SIMULADA' && (
                          <button onClick={() => handleUpdateStatus(d.id, 'PAGA')} className="btn btn--ghost btn--sm" title="Marcar como Paga" style={{color:'var(--color-success)'}}><CheckCircle size={16}/></button>
                        )}
                        <button onClick={() => handleDelete(d.id)} className="btn btn--ghost btn--sm" title="Excluir" style={{color:'var(--color-error)'}}><Trash2 size={16}/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {donations.length > 0 && (
            <p style={{display:'flex', gap:'var(--space-2)', alignItems:'flex-start', fontSize:'var(--font-size-xs)', color:'var(--color-text-muted)', marginTop:'var(--space-3)'}}>
              <Info size={14} style={{flexShrink:0, marginTop:2}}/>
              O status "Paga" é um controle pessoal seu — você mesmo marca quando efetua o pagamento do DARF. Isso <strong>não é uma confirmação oficial</strong> de que a Receita Federal recebeu o pagamento, já que essa verificação envolve o sistema bancário e a própria Receita, fora do alcance da plataforma. Se você realmente pagou, guarde o comprovante bancário em um local seguro (o campo "Comprovante" acima só guarda um link de referência para você mesmo, não é um envio oficial).
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
