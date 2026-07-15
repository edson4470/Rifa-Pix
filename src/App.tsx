import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { FormularioRifa } from './components/FormularioRifa';
import { Checkout } from './components/Checkout/Checkout';
import { MeusBilhetes } from './components/MeusBilhetes/MeusBilhetes';
import { Validacao } from './components/Validacao/Validacao';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#09090b] text-white">
        
        {/* Navegação */}
        <nav className="p-4 border-b border-[#27272a] space-y-4">
          <div className="text-center">
            <p className="text-[#22c55e] text-xs font-bold uppercase tracking-widest mb-2">Painel do Administrador</p>
            <div className="flex gap-4 justify-center">
              <Link to="/" className="text-sm bg-[#18181b] px-3 py-1 rounded border border-[#27272a] hover:border-[#22c55e]">Criar Rifa</Link>
              <Link to="/validacao" className="text-sm bg-[#18181b] px-3 py-1 rounded border border-[#27272a] hover:border-[#22c55e]">Validar Vencedor</Link>
            </div>
          </div>

          <hr className="border-[#27272a]" />

          <div className="text-center">
            <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest mb-2">Visualização do Cliente</p>
            <div className="flex gap-4 justify-center">
              <Link to="/checkout" className="text-sm hover:text-[#22c55e]">Tela de Venda</Link>
              <Link to="/meus-bilhetes" className="text-sm hover:text-[#22c55e]">Consulta Bilhetes</Link>
            </div>
          </div>
        </nav>

        {/* Conteúdo das Rotas */}
        <main className="p-4">
          <Routes>
            <Route path="/" element={<FormularioRifa />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/meus-bilhetes" element={<MeusBilhetes />} />
            <Route path="/validacao" element={<Validacao />} />
          </Routes>
        </main>

      </div>
    </Router>
  );
}

export default App;