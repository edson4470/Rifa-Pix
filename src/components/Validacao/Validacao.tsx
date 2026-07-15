import { useState } from 'react';

export function Validacao() {
  const [numeroSorteado, setNumeroSorteado] = useState('');
  const [resultado, setResultado] = useState<null | { nome: string, telefone: string }>(null);

  const handleValidar = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui, no futuro, faremos a busca real no banco de dados
    console.log('Validando número:', numeroSorteado);
    
    // Exemplo visual de resultado (quando encontrarmos o ganhador)
    setResultado({ nome: "Exemplo Silva", telefone: "(82) 99999-9999" });
  };

  return (
    <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-8 w-full max-w-lg mx-auto shadow-2xl">
      <h2 className="text-2xl font-bold text-white mb-2">Painel de Sorteio</h2>
      <p className="text-zinc-400 text-sm mb-6">Insira o número sorteado para encontrar o ganhador.</p>

      {!resultado ? (
        <form onSubmit={handleValidar} className="space-y-4">
          <input
            type="number"
            placeholder="Ex: 2925"
            value={numeroSorteado}
            onChange={(e) => setNumeroSorteado(e.target.value)}
            className="w-full bg-[#09090b] border border-[#27272a] text-white rounded-xl p-4 outline-none focus:border-[#22c55e] text-center text-xl font-bold"
          />
          <button type="submit" className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-black font-bold py-4 rounded-xl transition-all">
            Validar Ganhador
          </button>
        </form>
      ) : (
        <div className="bg-[#09090b] p-6 rounded-xl border border-[#22c55e] text-center">
          <p className="text-[#22c55e] font-bold uppercase text-sm mb-2">Ganhador Encontrado!</p>
          <h3 className="text-2xl text-white font-bold mb-1">{resultado.nome}</h3>
          <p className="text-zinc-400 mb-6">{resultado.telefone}</p>
          
          <button 
            onClick={() => setResultado(null)}
            className="w-full border border-[#27272a] text-zinc-400 py-3 rounded-xl hover:bg-[#27272a]"
          >
            Realizar nova busca
          </button>
        </div>
      )}
    </div>
  );
}