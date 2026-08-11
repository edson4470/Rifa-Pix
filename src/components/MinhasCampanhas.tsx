import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../supabase';

export function MinhasCampanhas() {
  const navigate = useNavigate();
  const [campanhas, setCampanhas] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  // --- NOVOS ESTADOS PARA O MODAL DE PAGAMENTO ---
  const [modalPagamentoAberto, setModalPagamentoAberto] = useState(false);
  const [campanhaSelecionada, setCampanhaSelecionada] = useState<any | null>(null);
  const [processandoPagamento, setProcessandoPagamento] = useState(false);
  // ---------------------------------------------

  async function buscarCampanhas() {
    try {
      setCarregando(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        console.error("Usuário não autenticado");
        return;
      }

      const { data, error } = await supabase
        .from('campanhas')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Erro ao buscar campanhas:", error);
      } else {
        setCampanhas(data || []);
      }
    } catch (error) {
      console.error("Erro inesperado:", error);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    buscarCampanhas();
  }, []);

  // --- NOVA FUNÇÃO: SIMULAR PAGAMENTO ---
  async function confirmarPagamento() {
    if (!campanhaSelecionada) return;

    try {
      setProcessandoPagamento(true);

      // 1. Atualiza o status no Supabase
      const { error } = await supabase
        .from('campanhas')
        .update({ status: 'ativa' }) // MUDA PARA ATIVA
        .eq('id', campanhaSelecionada.id);

      if (error) throw error;

      // 2. Fecha o Modal e limpa a seleção
      setModalPagamentoAberto(false);
      setCampanhaSelecionada(null);

      // 3. Recarrega a lista para mostrar a campanha como "No Ar"
      await buscarCampanhas();
      
      alert('Pagamento confirmado! Sua campanha agora está ativa.');

    } catch (error) {
      console.error("Erro ao ativar campanha:", error);
      alert('Erro ao confirmar pagamento. Tente novamente.');
    } finally {
      setProcessandoPagamento(false);
    }
  }
  // ---------------------------------------------

  return (
    <div className="max-w-5xl mx-auto space-y-6 relative">
      
      {/* 1. COMUNICADO IMPORTANTE */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-5">
        <h3 className="text-blue-400 font-bold mb-2 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          Comunicado Importante:
        </h3>
        <p className="text-sm text-blue-200/70 leading-relaxed">
          Bem-vindo ao Rifa Pix! Para garantir que suas campanhas funcionem perfeitamente e você receba seus pagamentos sem atrasos, lembre-se de configurar sua conta de recebimento antes de divulgar seu link. Em caso de dúvidas, entre em contato com nosso suporte.
        </p>
      </div>

      {/* 2. BANNER DE PAGAMENTO */}
      <div 
        onClick={() => navigate('/configuracao-pagamento')}
        className="bg-[#18181b] border border-[#27272a] hover:border-[#22c55e] transition-colors rounded-xl p-5 flex items-center justify-between cursor-pointer group shadow-lg"
      >
        <p className="text-zinc-300 group-hover:text-white transition-colors text-sm md:text-base font-medium">
          Adicione um meio de pagamento e receba o valor diretamente em sua conta
        </p>
        <svg className="w-6 h-6 text-zinc-500 group-hover:text-[#22c55e] transition-all transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
      </div>

      {/* 3. TÍTULO: CAMPANHAS */}
      <div className="pt-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <svg className="w-8 h-8 text-[#22c55e]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path></svg>
          <h2 className="text-2xl font-bold text-white">Minhas Campanhas</h2>
        </div>
        
        {campanhas.length > 0 && (
          <button 
            onClick={() => navigate('/criar-campanha')}
            className="bg-[#22c55e] hover:bg-green-600 text-black font-bold px-4 py-2 rounded-lg transition-all flex items-center gap-2 text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            Nova Campanha
          </button>
        )}
      </div>
      
      {/* 4. LISTAGEM DAS CAMPANHAS */}
      {carregando ? (
        <div className="mt-8 flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#22c55e]"></div>
        </div>
      ) : campanhas.length > 0 ? (
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {campanhas.map((campanha) => (
            <div key={campanha.id} className="bg-[#18181b] border border-[#27272a] rounded-xl overflow-hidden shadow-lg flex flex-col">
              
              <div className="h-40 bg-[#27272a] relative">
                {campanha.status === 'aguardando_pagamento' && (
                  <span className="absolute top-3 left-3 bg-yellow-500/90 text-black text-xs font-bold px-3 py-1 rounded-full shadow">
                    Aguardando Pagamento
                  </span>
                )}
                {campanha.status === 'ativa' && (
                  <span className="absolute top-3 left-3 bg-green-500/90 text-black text-xs font-bold px-3 py-1 rounded-full shadow">
                    Ativa / No Ar
                  </span>
                )}
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{campanha.nome || "Campanha sem Título"}</h3>
                <p className="text-zinc-400 text-sm mb-4">Prêmio: {campanha.premio || "Não definido"}</p>
                
                <div className="mt-auto space-y-3">
                  {campanha.status === 'aguardando_pagamento' ? (
                     <button 
                       onClick={() => {
                         // AO CLICAR, ABRE O MODAL E SELECIONA ESTA CAMPANHA
                         setCampanhaSelecionada(campanha);
                         setModalPagamentoAberto(true);
                       }} 
                       className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                     >
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                       Pagar Taxa de Publicação
                     </button>
                  ) : (
                    <button 
                       onClick={() => navigate('/gerenciar-campanha')}
                       className="w-full bg-[#27272a] hover:bg-[#3f3f46] text-white font-medium py-2 rounded-lg transition-colors"
                    >
                      Gerenciar Campanha
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

      ) : (
        /* ESTADO VAZIO */
        <div className="mt-8 flex flex-col items-center justify-center p-16 bg-[#18181b] border-2 border-[#27272a] border-dashed rounded-2xl text-center">
          <div className="w-24 h-24 bg-[#09090b] rounded-full flex items-center justify-center mb-6 border border-[#27272a]">
            <svg className="w-12 h-12 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          </div>
          
          <h3 className="text-xl font-bold text-white mb-2">Nenhuma campanha criada</h3>
          <p className="text-zinc-400 mb-8 max-w-md">
            Você ainda não tem nenhuma rifa ativa. Crie sua primeira campanha agora mesmo e comece a arrecadar!
          </p>
          
          <button 
            onClick={() => navigate('/criar-campanha')}
            className="bg-[#22c55e] hover:bg-green-600 text-black font-bold px-8 py-3 rounded-lg transition-all shadow-[0_0_15px_rgba(34,197,94,0.15)] hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:-translate-y-1 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            Criar minha primeira campanha
          </button>
        </div>
      )}

      {/* --- O MODAL DE PAGAMENTO (Só aparece se a variável for true) --- */}
      {modalPagamentoAberto && campanhaSelecionada && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#18181b] border border-[#27272a] rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            
            {/* Botão de Fechar no topo */}
            <button 
              onClick={() => {
                setModalPagamentoAberto(false);
                setCampanhaSelecionada(null);
              }}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>

            <h3 className="text-2xl font-bold text-white mb-1">Ativar Campanha</h3>
            <p className="text-zinc-400 text-sm mb-6">Pague a taxa de R$ 9,90 para liberar sua rifa "{campanhaSelecionada.nome || 'Sem título'}"</p>

            {/* Simulação de Código Pix */}
            <div className="bg-[#09090b] border border-[#27272a] rounded-xl p-4 mb-6">
              <p className="text-zinc-500 text-xs uppercase tracking-wider mb-2 font-semibold">Pix Copia e Cola (Teste)</p>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  readOnly 
                  value="00020126580014br.gov.bcb.pix0136pix-teste-1234-abcd" 
                  className="bg-[#18181b] text-zinc-300 w-full rounded-lg px-3 py-2 text-sm border border-[#27272a] outline-none"
                />
                <button className="bg-[#27272a] hover:bg-[#3f3f46] text-white px-3 rounded-lg transition-colors">
                  Copiar
                </button>
              </div>
            </div>

            {/* Botão para Simular que o pagamento caiu */}
            <button 
              onClick={confirmarPagamento}
              disabled={processandoPagamento}
              className={`w-full font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 ${
                processandoPagamento 
                  ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed' 
                  : 'bg-[#22c55e] hover:bg-green-600 text-black shadow-[0_0_15px_rgba(34,197,94,0.15)]'
              }`}
            >
              {processandoPagamento ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-zinc-400"></div>
                  Processando...
                </>
              ) : (
                'Simular Pagamento Confirmado'
              )}
            </button>
            <p className="text-center text-zinc-500 text-xs mt-4">
              Este é um ambiente de teste. Clique no botão acima para simular que o sistema detectou o pagamento.
            </p>
          </div>
        </div>
      )}
      {/* ------------------------------------------------------------- */}

    </div>
  );
}