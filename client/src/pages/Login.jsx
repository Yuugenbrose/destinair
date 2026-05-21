import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';
import useScrollReveal from '../hooks/useScrollReveal';
import './Auth.css';

export default function Login() {
  const rootRef = useScrollReveal();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" ref={rootRef}>
      <div className="auth-card card" data-reveal>
        <div className="auth-card__header">
          <LogIn size={28} className="auth-card__icon"/>
          <h1>Entrar</h1>
          <p>Acesse sua conta no DestinaIR</p>
        </div>
        {error && <div className="auth-error"><AlertCircle size={16}/>{error}</div>}
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">E-mail</label>
            <div className="auth-input-wrap">
              <Mail size={18} className="auth-input-icon"/>
              <input type="email" className="form-input auth-input" placeholder="seu@email.com" value={email} onChange={e=>setEmail(e.target.value)} required id="login-email"/>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Senha</label>
            <div className="auth-input-wrap">
              <Lock size={18} className="auth-input-icon"/>
              <input type="password" className="form-input auth-input" placeholder="••••••••" value={password} onChange={e=>setPassword(e.target.value)} required id="login-password"/>
            </div>
          </div>
          <button type="submit" className="btn btn--primary btn--lg btn--full" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <div className="auth-footer">
          Não tem conta? <Link to="/cadastro">Cadastre-se</Link>
        </div>
      </div>
    </div>
  );
}
