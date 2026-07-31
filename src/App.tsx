// src/App.tsx
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';

// 🚀 CORREÇÃO 1: Caminho ajustado para onde o seu arquivo supabase.ts realmente está
import { supabase } from './supabase'; 

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
import { CheckoutPublicacao } from './components/CheckoutPublicacao';
import { PainelAprovacoes } from './components/PainelAprovacoes';

function AppRoutes() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🚀 CORREÇÃO 2: Ajuste no modo de pegar a sessão para o TypeScript não reclamar
    supabase.auth.getSession().then((response) => {
      setSession(response.data.session);
      setLoading(false);
    });

    // 🚀 CORREÇÃO 3: Coloquei o ': any' para satisfazer o modo estrito do TypeScript
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const isPublicRoute = ['/', '/login', '/redefinir-senha'].includes(location.pathname) || location.pathname.startsWith('/comprar/');
  
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#09090b] text-white">
        Carregando...
      </div>
    );
  }

  if (isPublicRoute) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/redefinir-senha" element={<RedefinirSenha />} />
        <Route path="/comprar/:slug" element={<PaginaCompra />} />
      </Routes>
    );
  }

  // Se não tiver logado, chuta para a tela de login!
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  // Rotas do SISTEMA INTERNO
  return (
    <div className="flex min-h-screen bg-[#09090b] text-white">
      <Sidebar />
      <main className="flex-1 p-8">
        <Routes>
          <Route path="/criar-campanha" element={<FormularioRifa onSucesso={(dados) => navigate('/gerenciar-campanha', { state: dados })} />} />
          <Route path="/minhas-campanhas" element={<MinhasCampanhas />} /> 
          <Route path="/gerenciar-campanha" element={<GerenciarCampanha />} />
          <Route path="/checkout-publicacao" element={<CheckoutPublicacao />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/meus-bilhetes" element={<MeusBilhetes />} />
          <Route path="/validacao" element={<Validacao />} />
          <Route path="/configuracao-pagamento" element={<ConfiguracaoPagamento />} />
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