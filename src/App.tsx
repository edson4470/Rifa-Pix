// src/App.tsx
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { FormularioRifa } from './components/FormularioRifa';
import { GerenciarCampanha } from './components/GerenciarCampanha'; 
import { Checkout } from './components/Checkout/Checkout';
import { MeusBilhetes } from './components/MeusBilhetes/MeusBilhetes';
import { Validacao } from './components/Validacao/Validacao';

// Separamos o conteúdo em um componente interno para podermos usar o useNavigate() sem erros
function AppRoutes() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-[#09090b] text-white">
      
      {/* Sidebar Lateral fixa */}
      <Sidebar />

      {/* Conteúdo principal à direita */}
      <main className="flex-1 p-8">
        <Routes>
          {/* AQUI ESTÁ A LIGAÇÃO: Se deu sucesso, viaja pra /gerenciar-campanha enviando a foto e os dados */}
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