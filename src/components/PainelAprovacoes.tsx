import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

export function PainelAprovacoes() {
  const [pendencias, setPendencias] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  // Busca apenas campanhas "Em Análise"
  useEffect(() => {
    async function buscarPendencias() {
      const { data, error } = await supabase
        .from('campanhas')
        .select('*')
        .eq('status', 'Em Análise');

      if (error) console.error("Erro ao buscar:", error);
      else setPendencias(data || []);
      setCarregando(false);
    }
    buscarPendencias();
  }, []);

  const aprovarCampanha = async (id: string) => {
    setCarregando(true);
    const { error } = await supabase
      .from('campanhas')
      .update({ status: 'Ativa' })
      .eq('id', id);

    if (error) {
      alert("Erro ao aprovar: " + error.message);
    } else {
      alert("Campanha aprovada com sucesso!");
      setPendencias(pendencias.filter(p => p.id !== id));
    }
    setCarregando(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">Aprovações Pendentes</h1>
      
      {carregando ? (
        <p>Carregando...</p>
      ) : pendencias.length === 0 ? (
        <div className="bg-[#18181b] p-8 rounded-xl text-center border border-[#27272a]">
          <p className="text-zinc-400">Nenhuma campanha aguardando aprovação no momento.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendencias.map((camp) => (
            <div key={camp.id} className="bg-[#18181b] border border-[#27272a] p-6 rounded-xl flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">{camp.nome}</h3>
                <p className="text-sm text-zinc-400">ID: {camp.id}</p>
                <p className="text-sm text-zinc-400">Valor Estimado: R$ {(camp.total_cotas * camp.valor_por_cota).toLocaleString('pt-BR')}</p>
              </div>
              <button 
                onClick={() => aprovarCampanha(camp.id)}
                className="bg-[#22c55e] hover:bg-green-600 text-black font-bold px-6 py-2 rounded transition-colors"
              >
                Aprovar Publicação
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}