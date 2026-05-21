import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Heart, LogOut, User, LayoutDashboard } from 'lucide-react';
import './Header.css';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    // Bloqueia a rolagem do body quando o menu mobile está aberto
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  const navLinks = [
    { to: '/como-funciona', label: 'Como Funciona' },
    { to: '/simulador', label: 'Simulador' },
    { to: '/fundos', label: 'Fundos' },
    { to: '/transparencia', label: 'Transparência' },
    { to: '/faq', label: 'FAQ' },
    { to: '/sobre', label: 'Sobre' },
  ];

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
      <div className="header__inner container">
        <Link to="/" className="header__logo" onClick={() => setMobileOpen(false)}>
          <Heart className="header__logo-icon" size={28} />
          <span className="header__logo-text">
            Destina<span className="header__logo-accent">IR</span>
          </span>
        </Link>

        <nav className={`header__nav ${mobileOpen ? 'header__nav--open' : ''}`}>
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `header__link ${isActive ? 'header__link--active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}

          <div className="header__nav-actions">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="btn btn--ghost"
                  onClick={() => setMobileOpen(false)}
                >
                  <LayoutDashboard size={16} />
                  Dashboard
                </Link>
                <button className="btn btn--ghost" onClick={handleLogout}>
                  <LogOut size={16} />
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="btn btn--ghost"
                  onClick={() => setMobileOpen(false)}
                >
                  Entrar
                </Link>
                <Link
                  to="/cadastro"
                  className="btn btn--primary btn--sm"
                  onClick={() => setMobileOpen(false)}
                >
                  Cadastrar
                </Link>
              </>
            )}
          </div>
        </nav>

        <button
          className="header__hamburger"
          onClick={() => {
            if (!mobileOpen) {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            setMobileOpen(!mobileOpen);
          }}
          aria-label="Menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </header>
  );
}
