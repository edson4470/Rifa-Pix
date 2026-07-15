import type { Rifa } from '../types';

// Propriedades que o cartão vai receber
interface CardRifaProps {
  rifa: Rifa;
}

export function CardRifa({ rifa }: CardRifaProps) {
  // Converte o valor do banco para o formato de moeda Real (R$)
  const valorFormatado = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(rifa.preco_bilhete);

  return (
    <div className="bg-[#18181b] border border-[#27272a] rounded-2xl overflow-hidden hover:border-[#22c55e]/50 transition-all duration-300 group">
      
      {/* Imagem de Destaque / Topo */}
      <div className="h-48 bg-zinc-800 relative w-full flex items-center justify-center border-b border-[#27272a]">
        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-[#22c55e]/30 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse"></span>
          <span className="text-xs font-bold text-[#22c55e] uppercase tracking-wider">
            {rifa.status === 'ativa' ? 'Ativa' : 'Encerrada'}
          </span>
        </div>
        <span className="text-zinc-600 font-medium">Imagem da Rifa</span>
      </div>

      {/* Detalhes da Rifa */}
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 group-hover:text-[#22c55e] transition-colors line-clamp-1">
          {rifa.titulo}
        </h3>
        
        {rifa.descricao && (
          <p className="text-zinc-400 text-sm mb-6 line-clamp-2">
            {rifa.descricao}
          </p>
        )}
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col">
            <span className="text-xs text-zinc-500 font-medium uppercase tracking-wider">
              Valor do Bilhete
            </span>
            <span className="text-2xl font-black text-[#22c55e]">
              {valorFormatado}
            </span>
          </div>
        </div>

        {/* Botão de Ação */}
        <button className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-black font-bold py-3 px-4 rounded-xl transition-all active:scale-95 shadow-[0_0_20px_rgba(34,197,94,0.15)] hover:shadow-[0_0_25px_rgba(34,197,94,0.3)]">
          Participar Agora
        </button>
      </div>
    </div>
  );
}