import { useState } from 'react';

export function FormularioRifa() {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [quantidade, setQuantidade] = useState('100'); 

  // Função inteligente que formata o dinheiro automaticamente enquanto o usuário digita
  const handlePrecoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let valor = e.target.value;
    
    // Remove tudo que não for número (letras, pontos, vírgulas)
    valor = valor.replace(/\D/g, '');

    if (valor === '') {
      setPreco('');
      return;
    }

    // Divide por 100 para criar as casas decimais (ex: 150 vira 1.50)
    const valorNumerico = parseInt(valor, 10) / 100;

    // Aplica a formatação oficial do Real Brasileiro (R$)
    const valorFormatado = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valorNumerico);

    setPreco(valorFormatado);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Dica de Arquitetura: Antes de enviar para o banco de dados no futuro, 
    // nós "limparemos" o R$ para salvar apenas os números.
    console.log('Dados da Rifa:', { titulo, descricao, preco, quantidade });
    alert('Rifa criada com sucesso! (Simulação)');
  };

  return (
    <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-8 w-full max-w-2xl">
      <div className="mb-8 border-b border-[#27272a] pb-4">
        <h2 className="text-2xl font-bold text-white">Criar Nova Rifa</h2>
        <p className="text-zinc-400 text-sm mt-1">
          Configure os detalhes do sorteio. O QR Code Pix será gerado automaticamente nas vendas.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div>
          <label className="block text-sm font-semibold text-zinc-400 mb-2">
            Título da Rifa *
          </label>
          <input
            type="text"
            required
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ex: Porsche 911 ou R$ 1 Milhão no PIX"
            className="w-full bg-[#09090b] border border-[#27272a] text-white rounded-xl p-3 outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] transition-all placeholder:text-zinc-600"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-zinc-400 mb-2">
            Descrição e Regras
          </label>
          <textarea
            rows={3}
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Descreva o prêmio, a data do sorteio e como funcionará a entrega..."
            className="w-full bg-[#09090b] border border-[#27272a] text-white rounded-xl p-3 outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] transition-all placeholder:text-zinc-600 resize-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-zinc-400 mb-2">
              Valor do Bilhete *
            </label>
            <input
              type="text"
              required
              value={preco}
              onChange={handlePrecoChange}
              placeholder="R$ 0,00"
              className="w-full bg-[#09090b] border border-[#27272a] text-white rounded-xl p-3 outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] transition-all placeholder:text-zinc-600"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-zinc-400 mb-2">
              Quantidade de Números *
            </label>
            <select
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
              className="w-full bg-[#09090b] border border-[#27272a] text-white rounded-xl p-3 outline-none focus:border-[#22c55e] focus:ring-1 focus:ring-[#22c55e] transition-all appearance-none"
            >
              <option value="100">100 números (00 a 99)</option>
              <option value="1000">1.000 números (000 a 999)</option>
              <option value="10000">10.000 números</option>
              <option value="100000">100.000 números</option>
              <option value="1000000">1 Milhão de números</option>
              <option value="1000000000">1 Bilhão de números</option>
            </select>
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-black font-bold py-3 px-4 rounded-xl transition-all active:scale-95 flex justify-center items-center gap-2 shadow-[0_0_15px_rgba(34,197,94,0.1)] hover:shadow-[0_0_25px_rgba(34,197,94,0.25)]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Publicar Rifa
          </button>
        </div>

      </form>
    </div>
  );
}