import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

export function CheckoutPublicacao() {
  const location = useLocation();
  const navigate = useNavigate();
  const campanha = location.state;

  const [processando, setProcessando] = useState(false);

  if (!campanha) {
    navigate('/');
    return null;
  }

  // =======================================================
  // 💰 DADOS PARA O PIX DINÂMICO (Preencha com seus dados)
  // =======================================================
  const MINHA_CHAVE_PIX = "seuemail@gmail.com"; // Sua chave real (Email, CPF, CNPJ ou Telefone)
  const MEU_NOME_RECEBEDOR = "Edson Silva"; // Seu nome como aparece no banco
  const MINHA_CIDADE = "Sao Paulo"; // Sua cidade (Sem acentos)

  // =======================================================
  // 🧮 CÁLCULO EXATO DA TAXA (Baseado na sua tabela)
  // =======================================================
  const valorDaCota = Number(campanha.valor_por_cota || campanha.valorPorCotaEmReais || 0);
  const totalCotas = Number(campanha.totalCotas || campanha.total_cotas || 0);
  const valorEstimado = totalCotas * valorDaCota;
  
  const getTaxa = (q: number) => {
    if (q === 0) return 0;
    if (q <= 100) return 7;
    if (q <= 250) return 17;
    if (q <= 450) return 27;
    if (q <= 750) return 37;
    if (q <= 1000) return 47;
    if (q <= 2000) return 67;
    if (q <= 4000) return 77;
    if (q <= 7000) return 97;
    if (q <= 10000) return 147;
    if (q <= 15000) return 197;
    if (q <= 20000) return 247;
    if (q <= 30000) return 347;
    if (q <= 50000) return 697;
    if (q <= 70000) return 797;
    if (q <= 100000) return 997;
    return 1497;
  };

  const taxaPublicacao = getTaxa(totalCotas);

  // =======================================================
  // ⚙️ GERADOR DE PAYLOAD PIX (BR CODE) AUTOMÁTICO
  // =======================================================
  const gerarPayloadPix = (chave: string, valor: number, recebedor: string, cidade: string) => {
    const valorFormatado = valor.toFixed(2);
    let payload = `00020101021126${(chave.length + 22).toString().padStart(2, '0')}0014br.gov.bcb.pix01${chave.length.toString().padStart(2, '0')}${chave}520400005303986540${valorFormatado.length.toString().padStart(2, '0')}${valorFormatado}5802BR59${recebedor.length.toString().padStart(2, '0')}${recebedor}60${cidade.length.toString().padStart(2, '0')}${cidade}62070503***6304FCA0`;
    
    let crc = 0xFFFF;
    for (let i = 0; i < payload.length; i++) {
        crc ^= payload.charCodeAt(i) << 8;
        for (let j = 0; j < 8; j++) {
            if ((crc & 0x8000) !== 0) crc = (crc << 1) ^ 0x1021;
            else crc <<= 1;
        }
    }
    const crcHex = (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
    return payload + crcHex;
  };

  const payloadPixGerado = gerarPayloadPix(MINHA_CHAVE_PIX, taxaPublicacao, MEU_NOME_RECEBEDOR, MINHA_CIDADE);

  // =======================================================
  // 🚀 AVISAR PAGAMENTO (Muda para EM ANÁLISE)
  // =======================================================
  const notificarPagamento = async () => {
    setProcessando(true);
    try {
      const { error } = await supabase
        .from('campanhas')
        .update({ status: 'Em Análise' })
        .eq('id', campanha.id);

      if (error) throw error;

      alert("⏳ Recebemos seu aviso! Vamos conferir o pagamento e sua rifa será publicada em até 72 horas.");
      navigate('/gerenciar-campanha', { state: { ...campanha, status: 'Em Análise' } });
      
    } catch (error: any) {
      console.error(error);
      alert("Erro ao notificar pagamento: " + error.message);
      setProcessando(false);
    }
  };

  const handleCopiarPix = () => {
    navigator.clipboard.writeText(payloadPixGerado);
    alert("Código Pix Copiado com sucesso!");
  };

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-300">
      
      <div className="flex justify-between items-center mb-8 border-b border-[#27272a] pb-6">
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <svg className="w-6 h-6 text-[#22c55e]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          Publicar campanha
        </h1>
        <button onClick={() => navigate(-1)} className="border border-[#27272a] bg-[#18181b] px-4 py-2 rounded flex items-center gap-2 text-sm text-zinc-300 hover:text-white transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
          Voltar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="space-y-6">
          <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-6 shadow-lg">
            <h2 className="text-white font-bold flex items-center gap-2 mb-6">
              <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Informações da campanha
            </h2>
            
            <div className="text-center mb-6">
              <p className="text-zinc-400 text-sm mb-1">Valor estimado que você vai arrecadar</p>
              <p className="text-3xl font-black text-[#22c55e]">
                R$ {valorEstimado.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
            
            <div className="border-t border-[#27272a] pt-6 text-center">
              <p className="text-zinc-400 text-sm mb-1">Taxa de publicação</p>
              <p className="text-xl font-bold text-white">
                R$ {taxaPublicacao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-6 text-center shadow-lg">
            <h3 className="text-orange-400 font-bold mb-2">Conferência Manual</h3>
            <p className="text-sm text-zinc-300 mb-4">
              Após o pagamento, nossa equipe fará a validação do recebimento. Sua rifa será liberada em até <strong className="text-white">72 horas</strong>.
            </p>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-6 shadow-lg">
            <h2 className="text-white font-bold flex items-center gap-2 mb-6">
              <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              Pague com Pix
            </h2>

            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center p-3 bg-zinc-800 rounded-full mb-4">
                <svg className="w-6 h-6 text-[#22c55e]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
              </div>
              <p className="text-zinc-300 text-sm max-w-sm mx-auto mb-2">
                Escaneie o QR Code ou copie a chave abaixo. O valor exato de <strong>R$ {taxaPublicacao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong> já está configurado.
              </p>
            </div>

            <div className="bg-[#09090b] border border-[#27272a] rounded-lg p-2 flex items-center justify-between gap-4 mb-8">
              <span className="text-zinc-500 text-sm truncate pl-2">{payloadPixGerado}</span>
              <button onClick={handleCopiarPix} className="bg-[#27272a] hover:bg-[#3f3f46] text-white px-4 py-2 rounded text-sm font-bold transition-colors">
                Copiar
              </button>
            </div>

            <div className="flex justify-center mb-8">
              <div className="bg-white p-4 rounded-xl border-4 border-[#27272a]">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(payloadPixGerado)}`} 
                  alt="QR Code Pix" 
                  className="w-48 h-48"
                />
              </div>
            </div>

            <p className="text-zinc-500 text-xs text-center border-b border-[#27272a] pb-8 mb-6">
              • Assim que efetuar a transferência, clique no botão abaixo para nos avisar.
            </p>

            <div className="mt-8 flex justify-center">
              <button 
                onClick={notificarPagamento}
                disabled={processando}
                className="w-full md:w-auto bg-[#22c55e] hover:bg-green-600 text-black font-bold py-4 px-12 rounded-lg transition-colors shadow-[0_0_15px_rgba(34,197,94,0.3)] disabled:opacity-50"
              >
                {processando ? "Enviando aviso..." : "Já realizei o pagamento"}
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}