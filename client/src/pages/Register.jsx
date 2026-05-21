import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock, User, AlertCircle } from 'lucide-react';
import useScrollReveal from '../hooks/useScrollReveal';
import './Auth.css';

export default function Register() {
  const rootRef = useScrollReveal();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) { setError('A senha deve ter pelo menos 6 caracteres'); return; }
    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Erro ao cadastrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" ref={rootRef}>
      <div className="auth-card card" data-reveal>
        <div className="auth-card__header">
          <UserPlus size={28} className="auth-card__icon"/>
          <h1>Cadastrar</h1>
          <p>Crie sua conta gratuita no DestinaIR</p>
        </div>
        {error && <div className="auth-error"><AlertCircle size={16}/>{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Nome completo</label>
            <div className="auth-input-wrap">
              <User size={18} className="auth-input-icon"/>
              <input type="text" className="form-input auth-input" placeholder="Seu nome" value={name} onChange={e=>setName(e.target.value)} required id="register-name"/>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">E-mail</label>
            <div className="auth-input-wrap">
              <Mail size={18} className="auth-input-icon"/>
              <input type="email" className="form-input auth-input" placeholder="seu@email.com" value={email} onChange={e=>setEmail(e.target.value)} required id="register-email"/>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Senha</label>
            <div className="auth-input-wrap">
              <Lock size={18} className="auth-input-icon"/>
              <input type="password" className="form-input auth-input" placeholder="Mínimo 6 caracteres" value={password} onChange={e=>setPassword(e.target.value)} required minLength={6} id="register-password"/>
            </div>
          </div>
          <button type="submit" className="btn btn--primary btn--lg btn--full" disabled={loading}>
            {loading ? 'Cadastrando...' : 'Criar conta'}
          </button>
        </form>
        <div className="auth-footer">
          Já tem conta? <Link to="/login">Entrar</Link>
        </div>
      </div>
    </div>
  );
}
