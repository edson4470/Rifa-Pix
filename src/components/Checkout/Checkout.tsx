import { useState } from 'react';

// Esta interface simula os dados que viriam da sua Rifa criada
interface CheckoutProps {
  titulo?: string;
  precoUnitario?: number;
}

export function Checkout({ titulo = "Título da Rifa", precoUnitario = 1.89 }: CheckoutProps) {
  const [quantidade, setQuantidade] = useState(1);
  const total = quantidade * precoUnitario;

  // Função para garantir que o input seja sempre um número válido
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = parseInt(e.target.value);
    setQuantidade(isNaN(valor) || valor < 1 ? 1 : valor);
  };

  return (
    <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-6 w-full max-w-lg mx-auto shadow-2xl">
      {/* Título da Rifa */}
      <div className="text-center mb-6">
        <h1 className="text-xl font-bold text-white mb-1">{titulo}</h1>
        <p className="text-zinc-400 text-sm">Selecione quantos números deseja comprar:</p>
      </div>

      {/* Seletor Quantidade (Input + Botões) */}
      <div className="flex items-center justify-between bg-[#09090b] border border-[#27272a] rounded-lg p-2 mb-4">
        <button 
          onClick={() => setQuantidade(Math.max(1, quantidade - 1))} 
          className="w-12 h-12 flex items-center justify-center text-white font-bold text-2xl hover:bg-[#27272a] rounded-lg transition-all"
        >-</button>
        
        <input 
          type="number" 
          value={quantidade} 
          onChange={handleInputChange}
          className="w-full bg-transparent text-center text-3xl text-white font-bold outline-none"
        />

        <button 
          onClick={() => setQuantidade(quantidade + 1)} 
          className="w-12 h-12 flex items-center justify-center text-[#22c55e] font-bold text-2xl hover:bg-[#27272a] rounded-lg transition-all"
        >+</button>
      </div>

      {/* Botões de Seleção Rápida */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        {[10, 50, 100, 200].map((num) => (
          <button
            key={num}
            onClick={() => setQuantidade(num)}
            className={`py-3 rounded-lg font-bold text-sm border transition-all ${
              num === 100 
                ? 'bg-[#22c55e] text-black border-[#22c55e]' 
                : 'bg-[#27272a] text-white border-[#27272a] hover:bg-[#3f3f46]'
            }`}
          >
            +{num}
          </button>
        ))}
      </div>

      {/* Botão Garantir Números */}
      <button className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-black font-bold py-4 rounded-lg flex items-center justify-between px-6 mb-4 transition-all active:scale-[0.98]">
        <span className="font-black">GARANTIR NÚMEROS</span>
        <span className="font-bold text-lg">R$ {total.toFixed(2).replace('.', ',')}</span>
      </button>

      {/* Rodapé */}
      <button className="w-full bg-[#09090b] border border-[#27272a] py-3 rounded-lg font-bold text-zinc-400 hover:border-[#22c55e] transition-all">
        ↓ Descrição/Regulamento
      </button>
    </div>
  );
}