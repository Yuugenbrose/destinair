import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import ComoFunciona from './pages/ComoFunciona';
import Simulador from './pages/Simulador';
import Fundos from './pages/Fundos';
import FundoDetalhe from './pages/FundoDetalhe';
import Transparencia from './pages/Transparencia';
import FAQ from './pages/FAQ';
import Sobre from './pages/Sobre';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MinhasDoacoes from './pages/MinhasDoacoes';
import AdminFundos from './pages/AdminFundos';

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <main className="page">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/como-funciona" element={<ComoFunciona />} />
          <Route path="/simulador" element={<Simulador />} />
          <Route path="/fundos" element={<Fundos />} />
          <Route path="/fundos/:id" element={<FundoDetalhe />} />
          <Route path="/transparencia" element={<Transparencia />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/minhas-doacoes" element={<MinhasDoacoes />} />
          <Route path="/admin/fundos" element={<AdminFundos />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
