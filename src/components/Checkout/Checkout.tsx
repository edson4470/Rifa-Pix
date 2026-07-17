import { useEffect, useState } from 'react';

export function Checkout() {
  const [rifas, setRifas] = useState<any[]>([]);

  useEffect(() => {
    fetch('http://localhost:3001/rifas')
      .then(res => res.json())
      .then(data => setRifas(data))
      .catch(err => console.error("Erro ao conectar:", err));
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-2">Escolha o seu título</h1>
      <p className="text-zinc-400 mb-8">Confira os detalhes e selecione a campanha.</p>
      
      <div className="grid grid-cols-1 gap-8">
        {rifas.map((rifa) => (
          <div key={rifa.id} className="bg-zinc-900 border border-zinc-700 p-6 rounded-xl flex flex-col md:flex-row gap-6">
            
            {/* ÁREA DAS FOTOS */}
            <div className="w-full md:w-1/2">
              {/* Foto Principal (ou a primeira da lista) */}
              <div className="bg-zinc-800 rounded-lg overflow-hidden h-64 flex items-center justify-center mb-3">
                {rifa.imagens && rifa.imagens.length > 0 ? (
                  <img src={rifa.imagens[0]} alt={rifa.titulo} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-zinc-500">Sem fotos</span>
                )}
              </div>
              
              {/* Miniaturas (Grid de fotos) */}
              <div className="grid grid-cols-5 gap-2">
                {rifa.imagens?.slice(1, 6).map((img: string, idx: number) => (
                  <div key={idx} className="bg-zinc-800 h-16 rounded overflow-hidden cursor-pointer hover:border-emerald-500 border border-transparent">
                    <img src={img} alt="Miniatura" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

            {/* ÁREA DOS DETALHES */}
            <div className="w-full md:w-1/2 flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">{rifa.titulo}</h2>
                <p className="text-zinc-400 text-sm mb-6">{rifa.descricao}</p>
                <div className="bg-zinc-800 p-3 rounded inline-block">
                  <span className="text-zinc-300">Valor: </span>
                  <span className="text-emerald-400 font-bold text-lg">
                    R$ {Number(rifa.preco_bilhete).toFixed(2)}
                  </span>
                </div>
              </div>

              <button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg transition-colors mt-6">
                Selecionar Rifa
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}