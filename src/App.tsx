// src/App.tsx
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { FormularioRifa } from './components/FormularioRifa';
import { GerenciarCampanha } from './components/GerenciarCampanha'; 
import { Checkout } from './components/Checkout/Checkout';
import { MeusBilhetes } from './components/MeusBilhetes/MeusBilhetes';
import { Validacao } from './components/Validacao/Validacao';
import { Login } from './components/Login';
import { RedefinirSenha } from './components/RedefinirSenha';
import { LandingPage } from './components/LandingPage';
import { ConfiguracaoPagamento } from './components/ConfiguracaoPagamento'; 
import { MinhasCampanhas } from './components/MinhasCampanhas'; // 🚀 1. Importação da nova tela Minhas Campanhas!

function AppRoutes() {
  const navigate = useNavigate();
  const location = useLocation();

  // 🚀 Rotas PÚBLICAS (Sem a barra lateral - Sidebar)
  const isPublicRoute = ['/', '/login', '/redefinir-senha'].includes(location.pathname);
  
  if (isPublicRoute) {
    return (
      <Routes>
        {/* A Landing Page agora é a primeira tela que o cliente vê */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/redefinir-senha" element={<RedefinirSenha />} />
      </Routes>
    );
  }

  // 🚀 Rotas do SISTEMA INTERNO (Com a barra lateral)
  return (
    <div className="flex min-h-screen bg-[#09090b] text-white">
      
      {/* Sidebar Lateral fixa */}
      <Sidebar />

      {/* Conteúdo principal à direita */}
      <main className="flex-1 p-8">
        <Routes>
          {/* O formulário de criar rifa mudou para uma rota própria */}
          <Route path="/criar-campanha" element={<FormularioRifa onSucesso={(dados) => navigate('/gerenciar-campanha', { state: dados })} />} />
          
          {/* 🚀 2. Rota atualizada: agora aponta para a nova tela que criamos hoje */}
          <Route path="/minhas-campanhas" element={<MinhasCampanhas />} /> 
          
          <Route path="/gerenciar-campanha" element={<GerenciarCampanha />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/meus-bilhetes" element={<MeusBilhetes />} />
          <Route path="/validacao" element={<Validacao />} />
          
          {/* 🚀 Nova rota de configurações de pagamento adicionada aqui */}
          <Route path="/configuracao-pagamento" element={<ConfiguracaoPagamento />} />
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