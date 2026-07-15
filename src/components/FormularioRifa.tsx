import { useState } from 'react';

export function FormularioRifa() {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [preco, setPreco] = useState('');
  const [quantidade, setQuantidade] = useState('1000'); 
  const [compraMinima, setCompraMinima] = useState('1'); 

  const handlePrecoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let valor = e.target.value.replace(/\D/g, '');
    if (valor === '') {
      setPreco('');
      return;
    }
    const valorNumerico = parseInt(valor, 10) / 100;
    const valorFormatado = new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valorNumerico);
    setPreco(valorFormatado);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Dados da Rifa:', { titulo, descricao, preco, quantidade, compraMinima });
    alert('Rifa criada com sucesso!');
  };

  return (
    <div className="bg-[#18181b] border border-[#27272a] rounded-2xl p-8 w-full max-w-3xl mx-auto shadow-2xl">
      <div className="mb-8 border-b border-[#27272a] pb-4">
        <h2 className="text-2xl font-bold text-white">Criar Nova Rifa</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-zinc-400 mb-2">Título da Rifa *</label>
            <input type="text" required value={titulo} onChange={(e) => setTitulo(e.target.value)} className="w-full bg-[#09090b] border border-[#27272a] text-white rounded-xl p-3 outline-none focus:border-[#22c55e]" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-zinc-400 mb-2">Valor do Bilhete *</label>
            <input type="text" required value={preco} onChange={handlePrecoChange} placeholder="R$ 0,00" className="w-full bg-[#09090b] border border-[#27272a] text-white rounded-xl p-3 outline-none focus:border-[#22c55e]" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-zinc-400 mb-2">Mínimo por Compra *</label>
            <input type="number" min="1" required value={compraMinima} onChange={(e) => setCompraMinima(e.target.value)} className="w-full bg-[#09090b] border border-[#27272a] text-white rounded-xl p-3 outline-none focus:border-[#22c55e]" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-zinc-400 mb-2">Total de Números *</label>
            <select
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
              className="w-full bg-[#09090b] border border-[#27272a] text-white rounded-xl p-3 outline-none focus:border-[#22c55e] appearance-none"
            >
              <optgroup label="Centenas">
                <option value="100">100 números (000 a 100)</option>
                <option value="200">200 números (000 a 200)</option>
                <option value="300">300 números (000 a 300)</option>
                <option value="400">400 números (000 a 400)</option>
                <option value="500">500 números (000 a 500)</option>
                <option value="600">600 números (000 a 600)</option>
                <option value="700">700 números (000 a 700)</option>
                <option value="800">800 números (000 a 800)</option>
                <option value="900">900 números (000 a 900)</option>
              </optgroup>
              
              <optgroup label="Milhares">
                <option value="1000">1.000 números (0000 a 1000)</option>
                <option value="2000">2.000 números (0000 a 2000)</option>
                <option value="3000">3.000 números (0000 a 3000)</option>
                <option value="4000">4.000 números (0000 a 4000)</option>
                <option value="5000">5.000 números (0000 a 5000)</option>
                <option value="6000">6.000 números (0000 a 6000)</option>
                <option value="7000">7.000 números (0000 a 7000)</option>
                <option value="8000">8.000 números (0000 a 8000)</option>
                <option value="9000">9.000 números (0000 a 9000)</option>
              </optgroup>

              <optgroup label="Gigantes (Até 999.999)">
                <option value="10000">10.000 números (0000 a 10000)</option>
                <option value="20000">20.000 números (0000 a 20000)</option>
                <option value="30000">30.000 números (0000 a 30000)</option>
                <option value="40000">40.000 números (0000 a 40000)</option>
                <option value="50000">50.000 números (0000 a 50000)</option>
                <option value="100000">100.000 números (00000 a 100000)</option>
                <option value="200000">200.000 números (00000 a 200000)</option>
                <option value="300000">300.000 números (00000 a 300000)</option>
                <option value="400000">400.000 números (00000 a 400000)</option>
                <option value="500000">500.000 números (00000 a 500000)</option>
                <option value="600000">600.000 números (00000 a 600000)</option>
                <option value="700000">700.000 números (00000 a 700000)</option>
                <option value="800000">800.000 números (00000 a 800000)</option>
                <option value="900000">900.000 números (00000 a 900000)</option>
                <option value="999999">999.999 números (000000 a 999999)</option>
              </optgroup>
            </select>
          </div>
        </div>

        <button type="submit" className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-black font-bold py-3 rounded-xl transition-all">
          Publicar Rifa
        </button>
      </form>
    </div>
  );
}