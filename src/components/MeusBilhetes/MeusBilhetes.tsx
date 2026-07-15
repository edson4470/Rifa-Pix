import { useState } from 'react';

export function MeusBilhetes() {
  const [telefone, setTelefone] = useState('');
  const [buscou, setBuscou] = useState(false);

  const handleBuscar = (e: React.FormEvent) => {
    e.preventDefault();
    setBuscou(true); // Aqui depois faremos a conexão real com o banco
  };

  return (
    <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-8 w-full max-w-lg mx-auto shadow-2xl">
      <h2 className="text-2xl font-bold text-white mb-2">Meus Bilhetes</h2>
      <p className="text-zinc-400 text-sm mb-6">Digite seu telefone para consultar seus números da sorte.</p>

      {!buscou ? (
        <form onSubmit={handleBuscar} className="space-y-4">
          <input
            type="tel"
            placeholder="(00) 00000-0000"
            value={telefone}
            onChange={(e) => setTelefone(e.target.value)}
            className="w-full bg-[#09090b] border border-[#27272a] text-white rounded-xl p-4 outline-none focus:border-[#22c55e]"
          />
          <button type="submit" className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-black font-bold py-4 rounded-xl transition-all">
            Consultar Bilhetes
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="bg-[#09090b] p-4 rounded-xl border border-[#27272a]">
            <p className="text-zinc-400 text-xs uppercase mb-1">Telefone consultado:</p>
            <p className="text-white font-bold">{telefone}</p>
          </div>
          
          <div className="text-center py-8">
            <p className="text-zinc-500">Nenhum bilhete encontrado para este número.</p>
          </div>

          <button 
            onClick={() => setBuscou(false)}
            className="w-full border border-[#27272a] text-zinc-400 py-3 rounded-xl hover:bg-[#27272a] transition-all"
          >
            Nova Consulta
          </button>
        </div>
      )}
    </div>
  );
}