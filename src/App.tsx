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
import { MinhasCampanhas } from './components/MinhasCampanhas';
import { PaginaCompra } from './components/PaginaCompra';

// 🚀 1. Importação da nova tela de Checkout de Publicação adicionada aqui:
import { CheckoutPublicacao } from './components/CheckoutPublicacao';

// 🚀 2. Importação do novo Painel de Aprovações:
import { PainelAprovacoes } from './components/PainelAprovacoes';

function AppRoutes() {
  const navigate = useNavigate();
  const location = useLocation();

  // 🚀 Rotas PÚBLICAS (Sem a barra lateral - Sidebar)
  // Adicionado o .startsWith('/comprar/') para que a tela do cliente fique sem a Sidebar do painel
  const isPublicRoute = ['/', '/login', '/redefinir-senha'].includes(location.pathname) || location.pathname.startsWith('/comprar/');
  
  if (isPublicRoute) {
    return (
      <Routes>
        {/* A Landing Page agora é a primeira tela que o cliente vê */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/redefinir-senha" element={<RedefinirSenha />} />
        
        {/* 🚀 Rota pública para a página de demonstração/venda da rifa */}
        <Route path="/comprar/:slug" element={<PaginaCompra />} />
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
          
          {/* 🚀 Rota atualizada: agora aponta para a tela Minhas Campanhas */}
          <Route path="/minhas-campanhas" element={<MinhasCampanhas />} /> 
          
          <Route path="/gerenciar-campanha" element={<GerenciarCampanha />} />
          
          {/* 🚀 Rota para o pagamento da taxa de publicação adicionada aqui: */}
          <Route path="/checkout-publicacao" element={<CheckoutPublicacao />} />

          <Route path="/checkout" element={<Checkout />} />
          <Route path="/meus-bilhetes" element={<MeusBilhetes />} />
          <Route path="/validacao" element={<Validacao />} />
          
          {/* 🚀 Rota de configurações de pagamento */}
          <Route path="/configuracao-pagamento" element={<ConfiguracaoPagamento />} />

          {/* 🚀 Nova rota do Painel de Aprovações para você gerenciar os recebimentos */}
          <Route path="/aprovacoes" element={<PainelAprovacoes />} />
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