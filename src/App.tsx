// src/App.tsx
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';

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
  
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then((response) => {
      setSession(response.data.session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#09090b] text-white">
        Carregando...
      </div>
    );
  }

  // 🚀 O SEGREDO: Componente para proteger as rotas internas e colocar a Sidebar
  const RotaPrivada = ({ children }: { children: React.ReactNode }) => {
    if (!session) {
      // Se não tiver sessão (chave de acesso), joga pro login
      return <Navigate to="/login" replace />;
    }
    
    // Se tiver logado, mostra o layout do sistema com a Sidebar
    return (
      <div className="flex min-h-screen bg-[#09090b] text-white">
        <Sidebar />
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    );
  };

  return (
    <Routes>
      {/* Rotas 100% Públicas */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/redefinir-senha" element={<RedefinirSenha />} />
      <Route path="/comprar/:slug" element={<PaginaCompra />} />

      {/* 🚀 O PULO DO GATO: Se o usuário já tá logado e o navegador volta pro /login, ele é rebatido de volta pro painel automaticamente! */}
      <Route path="/login" element={session ? <Navigate to="/minhas-campanhas" replace /> : <Login />} />

      {/* Rotas Privadas (Protegidas) */}
      <Route path="/criar-campanha" element={<RotaPrivada><FormularioRifa onSucesso={(dados) => navigate('/gerenciar-campanha', { state: dados })} /></RotaPrivada>} />
      <Route path="/minhas-campanhas" element={<RotaPrivada><MinhasCampanhas /></RotaPrivada>} />
      <Route path="/gerenciar-campanha" element={<RotaPrivada><GerenciarCampanha /></RotaPrivada>} />
      <Route path="/checkout-publicacao" element={<RotaPrivada><CheckoutPublicacao /></RotaPrivada>} />
      <Route path="/checkout" element={<RotaPrivada><Checkout /></RotaPrivada>} />
      <Route path="/meus-bilhetes" element={<RotaPrivada><MeusBilhetes /></RotaPrivada>} />
      <Route path="/validacao" element={<RotaPrivada><Validacao /></RotaPrivada>} />
      <Route path="/configuracao-pagamento" element={<RotaPrivada><ConfiguracaoPagamento /></RotaPrivada>} />
      <Route path="/aprovacoes" element={<RotaPrivada><PainelAprovacoes /></RotaPrivada>} />
    </Routes>
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