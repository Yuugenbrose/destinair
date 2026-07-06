import { Link } from 'react-router-dom';
import { Heart, Github, Mail, ExternalLink } from 'lucide-react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <Link to="/" className="footer__logo">
              <Heart size={24} className="footer__logo-icon" />
              <span className="footer__logo-text">Destina<span className="footer__logo-accent">IR</span></span>
            </Link>
            <p className="footer__desc">
              Simulador de destinação do IRPF, facilitador para encontrar fundos sociais reais e ferramenta de
              controle pessoal das suas próprias destinações.
            </p>
          </div>

          <div className="footer__col">
            <h4 className="footer__col-title">Navegação</h4>
            <Link to="/como-funciona" className="footer__link">Como Funciona</Link>
            <Link to="/simulador" className="footer__link">Simulador</Link>
            <Link to="/fundos" className="footer__link">Diretório de Fundos</Link>
            <Link to="/transparencia" className="footer__link">Transparência</Link>
          </div>

          <div className="footer__col">
            <h4 className="footer__col-title">Recursos</h4>
            <Link to="/faq" className="footer__link">Perguntas Frequentes</Link>
            <Link to="/sobre" className="footer__link">Sobre o Projeto</Link>
            <a href="https://www.gov.br/receitafederal" target="_blank" rel="noopener noreferrer" className="footer__link">
              Receita Federal <ExternalLink size={12} />
            </a>
          </div>

          <div className="footer__col">
            <h4 className="footer__col-title">Projeto</h4>
            <a href="https://github.com/Yuugenbrose/destinair" target="_blank" rel="noopener noreferrer" className="footer__link">
              <Github size={14} /> Código no GitHub
            </a>
            <a href="mailto:contato@destinair.com.br" className="footer__link">
              <Mail size={14} /> Contato
            </a>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__copy">
            &copy; {new Date().getFullYear()} DestinaIR — Projeto acadêmico UTFPR-CP.
            Feito com <Heart size={14} className="footer__heart" /> para a cidadania.
          </p>
          <p className="footer__legal">
            Esta plataforma tem finalidade educativa e não substitui orientação fiscal profissional.
          </p>
        </div>
      </div>
    </footer>
  );
}
