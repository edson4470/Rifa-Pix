import { FormularioRifa } from './components/FormularioRifa';

function App() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white flex">
      
      {/* Menu Lateral do Painel Administrativo (Simulação) */}
      <aside className="w-64 border-r border-[#27272a] bg-[#18181b] hidden md:flex flex-col">
        <div className="p-6 border-b border-[#27272a]">
          <h1 className="text-xl font-black tracking-tighter">
            RIFA<span className="text-[#22c55e]">PIX</span> <span className="text-xs font-normal text-zinc-500">ADMIN</span>
          </h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#22c55e]/10 text-[#22c55e] font-medium border border-[#22c55e]/20">
            Nova Rifa
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-zinc-400 hover:bg-[#27272a] hover:text-white transition-colors">
            Minhas Rifas
          </a>
          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg text-zinc-400 hover:bg-[#27272a] hover:text-white transition-colors">
            Configurar PIX
          </a>
        </nav>
      </aside>

      {/* Área Principal onde o conteúdo carrega */}
      <main className="flex-1 p-8 overflow-y-auto flex justify-center items-start pt-12">
        <FormularioRifa />
      </main>

    </div>
  );
}

export default App;