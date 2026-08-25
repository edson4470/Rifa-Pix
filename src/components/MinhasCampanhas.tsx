import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { supabase } from '../supabase';

// --- SISTEMA DE PRECIFICAÇÃO E GERAÇÃO DE PIX AUTOMÁTICO ---
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

function crc16(payload: string) {
  let crc = 0xFFFF;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) > 0) {
        crc = (crc << 1) ^ 0x1021;
      } else {
        crc = crc << 1;
      }
    }
  }
  return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
}

function gerarPixCopiaECola(valor: number) {
  const chave = "33443c3b-30bc-4756-85f5-5cb926ecf24c".trim(); 
  const nome = "José Edson da Silva"; 
  const cidade = "Rio Largo";
  
  const payloadFormat = "000201";
  const merchantAccount = `0014br.gov.bcb.pix0136${chave}`;
  const merchantAccountLen = merchantAccount.length.toString().padStart(2, '0');
  const merchantAccountFull = `26${merchantAccountLen}${merchantAccount}`;
  
  const merchantCategory = "52040000";
  const currency = "5303986";
  
  const amountStr = valor.toFixed(2);
  const amountLen = amountStr.length.toString().padStart(2, '0');
  const amountFull = `54${amountLen}${amountStr}`;
  
  const country = "5802BR";
  
  const nameStr = nome.substring(0, 25).normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const nameLen = nameStr.length.toString().padStart(2, '0');
  const nameFull = `59${nameLen}${nameStr}`;
  
  const cityStr = cidade.substring(0, 15).normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const cityLen = cityStr.length.toString().padStart(2, '0');
  const cityFull = `60${cityLen}${cityStr}`;
  
  const txid = "TAXARIFA";
  const txidLen = txid.length.toString().padStart(2, '0');
  const txidFull = `05${txidLen}${txid}`;
  const addDataLen = txidFull.length.toString().padStart(2, '0');
  const addDataFull = `62${addDataLen}${txidFull}`;
  
  const payloadToCrc = `${payloadFormat}${merchantAccountFull}${merchantCategory}${currency}${amountFull}${country}${nameFull}${cityFull}${addDataFull}6304`;
  
  const crc = crc16(payloadToCrc);
  return `${payloadToCrc}${crc}`;
}
// -------------------------------------------------------------

export function MinhasCampanhas() {
  const navigate = useNavigate();
  const [campanhas, setCampanhas] = useState<any[]>([]);
  const [carregando, setCarregando] = useState(true);

  const [modalPagamentoAberto, setModalPagamentoAberto] = useState(false);
  const [campanhaSelecionada, setCampanhaSelecionada] = useState<any | null>(null);

  const valorTaxa = campanhaSelecionada ? calcularTaxa(campanhaSelecionada.total_cotas) : 0;
  const pixCopiaECola = campanhaSelecionada ? gerarPixCopiaECola(valorTaxa) : '';

  async function buscarCampanhas() {
    try {
      setCarregando(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        console.error("Usuário não autenticado");
        return;
      }

      // SEGURANÇA: Filtra apenas as campanhas do usuário logado
      const { data, error } = await supabase
        .from('campanhas')
        .select('*')
        .eq('user_id', user.id) 
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

  function copiarCodigoPix() {
    navigator.clipboard.writeText(pixCopiaECola);
    alert('Código Pix copiado! Cole no aplicativo do seu banco para pagar.');
  }

  // 🚀 CORREÇÃO 1: Rota ajustada para a página de vendas real
  function copiarLinkDaRifa(campanhaId: string) {
    const linkPublico = `${window.location.origin}/comprar/${campanhaId}`;
    navigator.clipboard.writeText(linkPublico);
    alert('Link copiado com sucesso! 🎉\n\nAgora é só colar no WhatsApp ou na bio do Instagram para começar a vender.');
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 relative">
      
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-5">
        <h3 className="text-blue-400 font-bold mb-2 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          Comunicado Importante:
        </h3>
        <p className="text-sm text-blue-200/70 leading-relaxed">
          Bem-vindo ao Rifa Pix! Para garantir que suas campanhas funcionem perfeitamente e você receba seus pagamentos sem atrasos, lembre-se de configurar sua conta de recebimento antes de divulgar seu link.
        </p>
      </div>

      <div 
        onClick={() => navigate('/configuracao-pagamento')}
        className="bg-[#18181b] border border-[#27272a] hover:border-[#22c55e] transition-colors rounded-xl p-5 flex items-center justify-between cursor-pointer group shadow-lg"
      >
        <p className="text-zinc-300 group-hover:text-white transition-colors text-sm md:text-base font-medium">
          Adicione um meio de pagamento e receba o valor diretamente em sua conta
        </p>
        <svg className="w-6 h-6 text-zinc-500 group-hover:text-[#22c55e] transition-all transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
      </div>

      <div className="pt-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <svg className="w-8 h-8 text-[#22c55e]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path></svg>
          <h2 className="text-2xl font-bold text-white">Minhas Campanhas</h2>
        </div>
        
        <button 
          onClick={() => navigate('/criar-campanha')}
          className="bg-[#22c55e] hover:bg-green-600 text-black font-bold px-4 py-2 rounded-lg transition-all flex items-center gap-2 text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
          Nova Campanha
        </button>
      </div>
      
      {carregando ? (
        <div className="mt-8 flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#22c55e]"></div>
        </div>
      ) : campanhas.length > 0 ? (
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {campanhas.map((campanha) => (
            <div key={campanha.id} className="bg-[#18181b] border border-[#27272a] rounded-xl overflow-hidden shadow-lg flex flex-col">
              
              <div className="h-40 bg-[#27272a] relative overflow-hidden">
                {campanha.foto_url && (
                  <img 
                    src={campanha.foto_url} 
                    alt="Capa da campanha" 
                    className="absolute inset-0 w-full h-full object-cover opacity-80"
                  />
                )}

                {campanha.status === 'Pendente' && (
                  <span className="absolute top-3 left-3 bg-yellow-500/90 text-black text-xs font-bold px-3 py-1 rounded-full shadow">
                    Aguardando Pagamento
                  </span>
                )}
                {campanha.status === 'Ativa' && (
                  <span className="absolute top-3 left-3 bg-green-500/90 text-black text-xs font-bold px-3 py-1 rounded-full shadow flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-900 rounded-full animate-pulse"></span>
                    Ativa / No Ar
                  </span>
                )}
              </div>
              
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{campanha.nome || "Campanha sem Título"}</h3>
                <p className="text-zinc-400 text-sm mb-4">Prêmio: {campanha.premio || "Não definido"}</p>
                
                <div className="mt-auto space-y-3">
                  {campanha.status === 'Pendente' ? (
                     <div className="flex flex-col gap-2">
                       <button 
                         onClick={() => {
                           setCampanhaSelecionada(campanha);
                           setModalPagamentoAberto(true);
                         }} 
                         className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
                       >
                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                         Pagar Taxa de Publicação
                       </button>
                       <button 
                         onClick={() => navigate('/gerenciar-campanha', { state: campanha })}
                         className="w-full bg-transparent border border-[#27272a] hover:bg-[#27272a] text-zinc-300 font-medium py-1.5 rounded-lg transition-colors text-sm"
                       >
                         Editar / Gerenciar
                       </button>
                       <p className="text-center text-[11px] text-yellow-500/70 mt-1">
                         O pagamento expira em 3 dias.
                       </p>
                     </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                       <button 
                         onClick={() => copiarLinkDaRifa(campanha.id)}
                         className="w-full bg-[#22c55e] hover:bg-green-600 text-black font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(34,197,94,0.15)]"
                       >
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                         Copiar Link para Venda
                       </button>

                       <div className="grid grid-cols-2 gap-2 mt-1">
                         {/* 🚀 CORREÇÃO 2: Rota do botão Ver Rifa ajustada para /comprar/ */}
                         <button 
                           onClick={() => navigate(`/comprar/${campanha.id}`)} 
                           className="bg-zinc-200 hover:bg-white text-black font-semibold py-2 rounded-lg transition-colors text-sm flex items-center justify-center gap-1"
                         >
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                           Ver Rifa
                         </button>
                         <button 
                           onClick={() => navigate('/gerenciar-campanha', { state: campanha })}
                           className="bg-[#27272a] hover:bg-[#3f3f46] text-white font-medium py-2 rounded-lg transition-colors text-sm flex items-center justify-center gap-1"
                         >
                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path></svg>
                           Ajustes
                         </button>
                       </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

      ) : (
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

      {/* --- MODAL DE PAGAMENTO COM AS REGRAS DE TEMPO --- */}
      {modalPagamentoAberto && campanhaSelecionada && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#18181b] border border-[#27272a] rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            
            <button 
              onClick={() => {
                setModalPagamentoAberto(false);
                setCampanhaSelecionada(null);
              }}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>

            <h3 className="text-2xl font-bold text-white mb-1">Taxa de Publicação</h3>
            <p className="text-zinc-400 text-sm mb-4">
              Pague a taxa de <strong className="text-[#22c55e]">R$ {valorTaxa.toFixed(2).replace('.', ',')}</strong> para liberar sua rifa "{campanhaSelecionada.nome || 'Sem título'}" ({campanhaSelecionada.total_cotas} cotas)
            </p>

            <div className="bg-white p-4 rounded-xl mb-4 w-48 h-48 mx-auto flex items-center justify-center">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(pixCopiaECola)}`} 
                alt="QR Code do Pix" 
                className="w-full h-full"
              />
            </div>

            <div className="bg-[#09090b] border border-[#27272a] rounded-xl p-4 mb-4">
              <p className="text-zinc-500 text-xs uppercase tracking-wider mb-2 font-semibold">Pix Copia e Cola</p>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  readOnly 
                  value={pixCopiaECola} 
                  className="bg-[#18181b] text-zinc-300 w-full rounded-lg px-3 py-2 text-sm border border-[#27272a] outline-none"
                />
                <button 
                  onClick={copiarCodigoPix}
                  className="bg-[#27272a] hover:bg-[#3f3f46] text-white px-3 rounded-lg transition-colors flex items-center justify-center"
                >
                  Copiar
                </button>
              </div>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 text-center">
              <svg className="w-6 h-6 text-yellow-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <p className="text-yellow-400 text-sm font-bold">Atenção aos Prazos</p>
              <p className="text-yellow-200/70 text-xs mt-2 leading-relaxed">
                Você tem até <strong>3 dias</strong> para realizar o pagamento.<br/>
                Após a confirmação, sua rifa será analisada e liberada em <strong>até 72 horas</strong>.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}