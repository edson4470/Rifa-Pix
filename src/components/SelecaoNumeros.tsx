import { useState } from 'react';

export function SelecaoNumeros() {
  // Controle de qual tela está aparecendo: Surpresinha ou Busca
  const [modo, setModo] = useState<'surpresinha' | 'busca'>('surpresinha');
  
  // Estados para guardar as escolhas do cliente
  const [quantidade, setQuantidade] = useState<number>(10);
  const [numeroSorte, setNumeroSorte] = useState<string>('');

  // Simulando o valor da rifa (R$ 0,50)
  const valorBilhete = 0.50; 
  const total = quantidade * valorBilhete;

  // Função para deixar o dinheiro no formato bonito (R$ 0,00)
  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  };

  return (
    <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-6 w-full max-w-md mx-auto shadow-2xl shadow-black/50">
      
      {/* Cabeçalho da Rifa (Resumo para o cliente não esquecer o que está comprando) */}
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-white">iPhone 15 Pro Max 256GB</h2>
        <p className="text-[#22c55e] font-medium text-sm mt-1">Por apenas {formatarMoeda(valorBilhete)} o número</p>
      </div>

      {/* Abas de Navegação (O Interruptor) */}
      <div className="flex p-1 bg-[#09090b] rounded-xl mb-6 border border-[#27272a]">
        <button
          onClick={() => setModo('surpresinha')}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
            modo === 'surpresinha' ? 'bg-[#27272a] text-white shadow' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          🎁 Surpresinha
        </button>
        <button
          onClick={() => setModo('busca')}
          className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${
            modo === 'busca' ? 'bg-[#27272a] text-white shadow' : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          🔍 Buscar Número
        </button>
      </div>

      {/* TELA 1: MODO SURPRESINHA */}
      {modo === 'surpresinha' && (
        <div className="space-y-4">
          <p className="text-center text-sm text-zinc-400">
            Selecione a quantidade. O sistema escolhe os melhores números para você!
          </p>
          
          <div className="grid grid-cols-2 gap-3">
            {[10, 50, 100, 500].map((qtd) => (
              <button
                key={qtd}
                onClick={() => setQuantidade(qtd)}
                className={`py-3 rounded-xl font-black border-2 transition-all ${
                  quantidade === qtd 
                    ? 'bg-[#22c55e]/10 border-[#22c55e] text-[#22c55e]' 
                    : 'bg-[#09090b] border-[#27272a] text-white hover:border-zinc-500'
                }`}
              >
                +{qtd}
              </button>
            ))}
          </div>

          <div className="mt-4">
            <label className="block text-xs font-semibold text-zinc-500 mb-2 uppercase tracking-wider text-center">
              Ou digite a quantidade desejada:
            </label>
            <input
              type="number"
              value={quantidade}
              onChange={(e) => setQuantidade(Number(e.target.value))}
              className="w-full bg-[#09090b] border-2 border-[#27272a] text-white rounded-xl p-3 outline-none focus:border-[#22c55e] transition-all text-center text-xl font-bold"
            />
          </div>
        </div>
      )}

      {/* TELA 2: MODO BUSCA */}
      {modo === 'busca' && (
        <div className="space-y-4">
          <p className="text-center text-sm text-zinc-400">
            Tem um número da sorte? Busque e garanta ele agora.
          </p>
          
          <div>
            <label className="block text-xs font-semibold text-zinc-500 mb-2 uppercase tracking-wider text-center">
              Digite seu número (ex: 0450):
            </label>
            <input
              type="text"
              value={numeroSorte}
              onChange={(e) => setNumeroSorte(e.target.value)}
              placeholder="0000"
              className="w-full bg-[#09090b] border-2 border-[#27272a] text-white rounded-xl p-4 outline-none focus:border-[#22c55e] transition-all text-center text-3xl font-black tracking-widest placeholder:text-zinc-700"
            />
          </div>

          {/* Efeito interativo: só mostra que tá disponível se a pessoa digitar algo */}
          {numeroSorte.length > 0 && (
            <div className="p-3 bg-[#22c55e]/10 border border-[#22c55e]/30 rounded-xl text-center animate-pulse">
              <span className="text-[#22c55e] text-sm font-bold flex items-center justify-center gap-2">
                ✅ Número disponível para compra!
              </span>
            </div>
          )}
        </div>
      )}

      {/* RODAPÉ: CÁLCULO E BOTÃO PIX */}
      <div className="mt-8 border-t border-[#27272a] pt-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-zinc-400 font-medium">Total a pagar:</span>
          <span className="text-3xl font-black text-white">
            {modo === 'surpresinha' ? formatarMoeda(total) : formatarMoeda(numeroSorte.length > 0 ? valorBilhete : 0)}
          </span>
        </div>

        <button className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-black font-black text-lg py-4 rounded-xl transition-all active:scale-95 flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(34,197,94,0.15)] hover:shadow-[0_0_30px_rgba(34,197,94,0.3)]">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm14 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
          PAGAR VIA PIX
        </button>
      </div>

    </div>
  );
}