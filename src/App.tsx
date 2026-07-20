// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar'; // Importamos o novo componente
import { FormularioRifa } from './components/FormularioRifa';
import { Checkout } from './components/Checkout/Checkout';
import { MeusBilhetes } from './components/MeusBilhetes/MeusBilhetes';
import { Validacao } from './components/Validacao/Validacao';

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-[#09090b] text-white">
        
        {/* Sidebar Lateral fixa */}
        <Sidebar />

        {/* Conteúdo principal à direita */}
        <main className="flex-1 p-8">
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