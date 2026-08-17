import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

// Trouxe a função de calcular taxa para cá também! 
// Assim você (Admin) sabe o valor exato que deve ter caído no seu banco.
function calcularTaxa(cotas: number) {
  if (!cotas) return 7.00; 
  if (cotas <= 100) return 7.00;
  if (cotas <= 250) return 17.00;
  if (cotas <= 450) return 27.00;
  if (cotas <= 750) return 37.00;
  if (cotas <= 1000) return 47.00;
  if (cotas <= 2000) return 67.00;
  if (cotas <= 4000) return 77.00;
  if (cotas <= 7000) return 97.00;
  if (cotas <= 10000) return 147.00;
  if (cotas <= 15000) return 197.00;
  if (cotas <= 20000) return 247.00;
  if (cotas <= 30000) return 347.00;
  if (cotas <= 50000) return 697.00;
  if (cotas <= 70000) return 797.00;
  if (cotas <= 100000) return 997.00;
  return 1497.00; 
}

export function PainelAprovacoes() {
  const [pendencias, setPendencias] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  // Busca APENAS campanhas com status "Pendente" (que é como está salvando no banco)
  useEffect(() => {
    async function buscarPendencias() {
      const { data, error } = await supabase
        .from('campanhas')
        .select('*')
        .eq('status', 'Pendente') // <-- Correção principal aqui!
        .order('created_at', { ascending: false });

      if (error) console.error("Erro ao buscar:", error);
      else setPendencias(data || []);
      setCarregando(false);
    }
    buscarPendencias();
  }, []);

  const aprovarCampanha = async (id: string) => {
    // Confirmação de segurança para não aprovar no susto
    const confirmacao = window.confirm("Você já abriu o app do banco e confirmou o recebimento deste Pix?");
    if (!confirmacao) return;

    setCarregando(true);
    const { error } = await supabase
      .from('campanhas')
      .update({ status: 'Ativa' }) // Libera a campanha!
      .eq('id', id);

    if (error) {
      alert("Erro ao aprovar: " + error.message);
    } else {
      alert("Sucesso! A campanha foi ativada e já está liberada para o cliente.");
      // Tira a campanha da lista de pendências da tela
      setPendencias(pendencias.filter(p => p.id !== id));
    }
    setCarregando(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 text-white space-y-6">
      
      {/* Cabeçalho */}
      <div className="flex items-center gap-3 border-b border-[#27272a] pb-4">
        <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <h1 className="text-2xl font-bold">Painel de Aprovações</h1>
      </div>

      {/* Aviso Admin */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-5 mb-6">
        <p className="text-sm text-blue-200/70">
          <strong>Área Restrita (Admin):</strong> Antes de clicar em "Aprovar e Liberar", sempre verifique no aplicativo do seu banco se o valor exato da taxa caiu na sua conta Pix em nome de José Edson da Silva.
        </p>
      </div>
      
      {/* Lista de Pendências */}
      {carregando ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-yellow-500"></div>
        </div>
      ) : pendencias.length === 0 ? (
        <div className="bg-[#18181b] p-10 rounded-xl text-center border border-[#27272a] shadow-lg">
          <svg className="w-16 h-16 text-zinc-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7"></path></svg>
          <h3 className="text-xl font-bold text-white mb-2">Tudo limpo por aqui!</h3>
          <p className="text-zinc-400">Nenhuma campanha aguardando aprovação no momento.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {pendencias.map((camp) => {
            const valorTaxa = calcularTaxa(camp.total_cotas); // Calcula o valor que deve ser pago
            
            return (
              <div key={camp.id} className="bg-[#18181b] border border-[#27272a] p-6 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-yellow-500/50 transition-colors shadow-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg text-white">{camp.nome || "Campanha sem título"}</h3>
                    <span className="bg-yellow-500/20 text-yellow-500 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Aguardando</span>
                  </div>
                  
                  <p className="text-xs text-zinc-500 mb-3 font-mono">Dono ID: {camp.user_id}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="bg-[#09090b] px-3 py-1.5 rounded border border-[#27272a]">
                      <span className="text-zinc-400">Cotas criadas: </span>
                      <span className="font-bold text-white">{camp.total_cotas}</span>
                    </div>
                    
                    {/* Exibe o valor exato que você tem que procurar no extrato do banco */}
                    <div className="bg-yellow-500/10 px-3 py-1.5 rounded border border-yellow-500/20">
                      <span className="text-yellow-500">Taxa a Conferir: </span>
                      <span className="font-bold text-yellow-400">R$ {valorTaxa.toFixed(2).replace('.', ',')}</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => aprovarCampanha(camp.id)}
                  className="w-full md:w-auto bg-[#22c55e] hover:bg-green-600 text-black font-bold px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(34,197,94,0.15)] hover:shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  Aprovar e Liberar
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}