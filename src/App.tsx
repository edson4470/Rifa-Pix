// src/App.tsx
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { FormularioRifa } from './components/FormularioRifa';
import { GerenciarCampanha } from './components/GerenciarCampanha'; 
import { Checkout } from './components/Checkout/Checkout';
import { MeusBilhetes } from './components/MeusBilhetes/MeusBilhetes';
import { Validacao } from './components/Validacao/Validacao';
import { Login } from './components/Login';
import { RedefinirSenha } from './components/RedefinirSenha'; // 🚀 Importação adicionada

function AppRoutes() {
  const navigate = useNavigate();
  const location = useLocation();

  // 🚀 Se estivermos na página de login ou redefinição, mostra apenas o conteúdo (sem barra lateral)
  if (location.pathname === '/login' || location.pathname === '/redefinir-senha') {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/redefinir-senha" element={<RedefinirSenha />} />
      </Routes>
    );
  }

  // Se for qualquer outra página, mostra o layout normal (com a barra lateral)
  return (
    <div className="flex min-h-screen bg-[#09090b] text-white">
      
      {/* Sidebar Lateral fixa */}
      <Sidebar />

      {/* Conteúdo principal à direita */}
      <main className="flex-1 p-8">
        <Routes>
          <Route path="/" element={<FormularioRifa onSucesso={(dados) => navigate('/gerenciar-campanha', { state: dados })} />} />
          <Route path="/gerenciar-campanha" element={<GerenciarCampanha />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/meus-bilhetes" element={<MeusBilhetes />} />
          <Route path="/validacao" element={<Validacao />} />
        </Routes>
      </main>

    </div>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;