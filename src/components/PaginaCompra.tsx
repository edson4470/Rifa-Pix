import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

// --- GERADOR DE PIX DINÂMICO ---
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

function gerarPixCopiaECola(valor: number, chave: string, nome: string) {
  if (!chave) return '';
  const chaveLimpa = chave.trim();
  const nomeLimpo = (nome || "Recebedor").substring(0, 25).normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const payloadFormat = "000201";
  const gui = "0014br.gov.bcb.pix";
  const keyString = `01${chaveLimpa.length.toString().padStart(2, '0')}${chaveLimpa}`;
  const merchantAccount = `${gui}${keyString}`;
  const merchantAccountLen = merchantAccount.length.toString().padStart(2, '0');
  const merchantAccountFull = `26${merchantAccountLen}${merchantAccount}`;

  const merchantCategory = "52040000";
  const currency = "5303986";

  const amountStr = valor.toFixed(2);
  const amountLen = amountStr.length.toString().padStart(2, '0');
  const amountFull = `54${amountLen}${amountStr}`;

  const country = "5802BR";

  const nameLen = nomeLimpo.length.toString().padStart(2, '0');
  const nameFull = `59${nameLen}${nomeLimpo}`;

  const cityFull = `6006BRASIL`; 

  const txid = "RIFA";
  const txidLen = txid.length.toString().padStart(2, '0');
  const txidFull = `05${txidLen}${txid}`;
  const addDataLen = txidFull.length.toString().padStart(2, '0');
  const addDataFull = `62${addDataLen}${txidFull}`;

  const payloadToCrc = `${payloadFormat}${merchantAccountFull}${merchantCategory}${currency}${amountFull}${country}${nameFull}${cityFull}${addDataFull}6304`;

  const crc = crc16(payloadToCrc);
  return `${payloadToCrc}${crc}`;
}
// ------------------------------------

export function PaginaCompra() {
  const params = useParams();
  const slug = params.slug || params.id; // 🚀 Correção cirúrgica para encontrar a rota!
  const navigate = useNavigate();

  // =======================================================
  // 📱 SEU NÚMERO DE WHATSAPP PARA RECEBER OS COMPROVANTES
  // =======================================================
  // Coloque o código do país (55) + DDD (ex: 82) + seu número
  const MEU_WHATSAPP = "5582988987121"; 

  // Estados
  const [campanha, setCampanha] = useState<any>(null);
  const [donoPix, setDonoPix] = useState<{chave: string, nome: string} | null>(null);
  const [carregando, setCarregando] = useState(true);
  
  // Etapas
  const [etapa, setEtapa] = useState(1); 
  const [quantidadeDesejada, setQuantidadeDesejada] = useState(1);
  const [telefone, setTelefone] = useState('');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [numerosSorte, setNumerosSorte] = useState<string[]>([]);

  const [mostrarRoleta, setMostrarRoleta] = useState(false);

  useEffect(() => {
    async function buscarCampanha() {
      try {
        const { data, error } = await supabase
          .from('campanhas')
          .select('*')
          .eq('id', slug) 
          .limit(1);

        if (error) throw error;
        
        if (data && data.length > 0) {
          setCampanha(data[0]);

          if (data[0].user_id) {
            const { data: perfilData } = await supabase
              .from('profiles')
              .select('pix_key, pix_titular')
              .eq('id', data[0].user_id)
              .limit(1);

            if (perfilData && perfilData.length > 0) {
              setDonoPix({
                chave: perfilData[0].pix_key || '',
                nome: perfilData[0].pix_titular || ''
              });
            }
          }
        } else {
          setCampanha(null);
        }
      } catch (error) {
        console.error("Erro ao buscar campanha:", error);
        setCampanha(null);
      } finally {
        setCarregando(false);
      }
    }
    
    if (slug) buscarCampanha();
  }, [slug]);

  if (carregando) {
    return <div className="min-h-screen bg-[#09090b] flex items-center justify-center text-[#22c55e] font-bold">Carregando rifa...</div>;
  }

  if (!campanha) {
    return (
      <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center p-4">
        <h1 className="text-white text-2xl font-bold mb-4">Campanha não encontrada</h1>
        <p className="text-zinc-400 mb-6">A rifa que você está procurando não existe ou foi encerrada.</p>
        <button onClick={() => navigate('/')} className="bg-[#22c55e] text-black px-6 py-2 rounded font-bold">Voltar ao Início</button>
      </div>
    );
  }

  // 🚀 CORREÇÃO DO ERRO 'NAN': Função para forçar qualquer valor virar um número válido
  const extrairValorNumerico = (valor: any) => {
    if (!valor) return 0;
    if (typeof valor === 'number') return valor;
    // Remove "R$", espaços, transforma vírgula em ponto e converte para número
    const textoLimpo = String(valor).replace(/[^\d.,]/g, '').replace(',', '.');
    return Number(textoLimpo) || 0;
  };

  const valorDaCota = extrairValorNumerico(campanha.valorPorCotaEmReais || campanha.valor_por_cota_em_reais || campanha.valor_por_cota || campanha.valor);
  const imagemDaCota = campanha.fotoUrl || campanha.foto_url || campanha.imagem || campanha.imagem_url || null;
  const valorTotal = quantidadeDesejada * valorDaCota;

  const roletaAtiva = campanha.roleta_ativa;
  const roletaCotas = campanha.roleta_cotas_necessarias || 0;
  const caixaAtiva = campanha.caixa_ativa;
  const caixaCotas = campanha.caixa_cotas_necessarias || 0;

  const ganhouRoleta = roletaAtiva && quantidadeDesejada >= roletaCotas;
  const ganhouCaixa = caixaAtiva && quantidadeDesejada >= caixaCotas;

  const pixPayload = donoPix?.chave ? gerarPixCopiaECola(valorTotal, donoPix.chave, donoPix.nome) : '';

  const handleParticipar = () => {
    if (quantidadeDesejada > 0) setEtapa(2);
  };

  const handleContinuarTelefone = () => {
    if (telefone.length >= 10) setEtapa(3);
    else alert("Por favor, insira um telefone válido com DDD.");
  };

  const handleFinalizar = async () => {
    if (nome.trim() === '') {
      alert("Por favor, preencha seu nome completo.");
      return;
    }

    try {
      const { data: bilhetesDisponiveis, error: erroBusca } = await supabase
        .from('bilhetes')
        .select('*')
        .eq('campanha_id', campanha.id)
        .eq('status_pagamento', 'disponivel') 
        .limit(quantidadeDesejada);

      if (erroBusca) throw erroBusca;

      if (!bilhetesDisponiveis || bilhetesDisponiveis.length < quantidadeDesejada) {
        alert("Não há cotas suficientes disponíveis no momento para esta quantidade.");
        return;
      }

      const numerosReservados = bilhetesDisponiveis.map((b: any) => b.numero || b.id);
      const idsBilhetes = bilhetesDisponiveis.map((b: any) => b.id);

      const { error: erroVenda } = await supabase.from('vendas').insert([
        { 
          campanha_id: campanha.id,
          nome: nome,
          telefone: telefone,
          email: email,
          quantidade: quantidadeDesejada,
          valor: valorTotal,
          status: 'pendente'
        }
      ]);
      if (erroVenda) throw erroVenda;

      const { error: erroAtualizacao } = await supabase
        .from('bilhetes')
        .update({ status_pagamento: 'reservado' }) 
        .in('id', idsBilhetes);

      if (erroAtualizacao) throw erroAtualizacao;

      setNumerosSorte(numerosReservados);
      setEtapa(4); 
    } catch (error: any) {
      alert("Erro ao registrar reserva: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white pb-20 font-sans relative">
      
      {campanha.status !== 'Ativa' && (
        <div className="bg-[#09090b] p-5 text-center border-b border-[#27272a] w-full animate-in slide-in-from-top-4 relative z-10">
          <h3 className="text-white font-bold text-sm md:text-base mb-1 flex items-center justify-center gap-2">
            <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            Essa é a demonstração da sua rifa!
          </h3>
          <p className="text-zinc-400 text-xs md:text-sm mb-4 max-w-lg mx-auto">
            Publique em até 72h para manter sua campanha ativa! Caso contrário sua campanha será expirada.
          </p>
          <button 
            onClick={() => navigate('/checkout-publicacao', { state: campanha })}
            className="bg-[#22c55e] hover:bg-green-500 text-black font-bold py-2 px-8 rounded-lg text-sm transition-colors inline-flex items-center gap-2 shadow-[0_0_15px_rgba(34,197,94,0.3)]"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
            Publicar agora!
          </button>
        </div>
      )}

      <div className="w-full bg-[#09090b] border-b border-[#27272a]">
        <div className="max-w-md mx-auto relative bg-[#09090b]">
          {imagemDaCota ? (
            <img src={imagemDaCota} alt={campanha.nome} className="w-full h-auto object-contain md:rounded-b-2xl max-h-80" />
          ) : (
            <div className="w-full h-64 bg-[#18181b] flex flex-col items-center justify-center md:rounded-b-2xl border-b border-[#27272a]">
              <span className="text-zinc-500 font-medium">Sem imagem da campanha</span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 mt-2">
        <div className="mb-6">
          <h1 className="text-xl font-bold mb-1">{campanha.nome}</h1>
          <p className="text-zinc-400 text-sm mb-4">
            Extração: <span className="text-white">{campanha.metodo_sorteio || 'Sorteador'}</span>
          </p>
          <div className="border-b border-[#27272a] pb-4 mb-4">
            <p className="text-zinc-400 text-sm">Título</p>
            <p className="font-bold text-[#22c55e] text-lg">R$ {valorDaCota.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
          </div>
        </div>

        {/* ETAPA 1 */}
        {etapa === 1 && (
          <div className="animate-in fade-in">
            {(roletaAtiva || caixaAtiva) && (
              <div className="bg-purple-900/20 border border-purple-500/30 rounded-xl p-4 mb-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full blur-xl -mr-10 -mt-10"></div>
                
                {roletaAtiva && (
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-2xl">🎡</div>
                    <div>
                      <p className="text-purple-400 font-bold text-sm">Roleta Premiada Ativa!</p>
                      <p className="text-xs text-zinc-300">Compre <strong className="text-white">{roletaCotas} cotas</strong> e ganhe 1 giro.</p>
                    </div>
                  </div>
                )}
                
                {caixaAtiva && (
                  <div className="flex items-center gap-3 mt-3 pt-3 border-t border-purple-500/20">
                    <div className="text-2xl">🎁</div>
                    <div>
                      <p className="text-yellow-400 font-bold text-sm">Caixa Misteriosa!</p>
                      <p className="text-xs text-zinc-300">Compre <strong className="text-white">{caixaCotas} cotas</strong> e abra a caixa.</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            <h2 className="text-md font-bold text-white mb-4 flex items-center gap-2">
              <span className="bg-[#22c55e] text-black w-5 h-5 rounded-full flex items-center justify-center text-xs">1</span>
              Escolha a quantidade
            </h2>
            
            <div className="grid grid-cols-3 gap-2 mb-6">
              {[1, 5, 10, 20, 100, 250].map((qtd) => (
                <button 
                  key={qtd}
                  onClick={() => setQuantidadeDesejada(qtd)}
                  className={`py-3 rounded text-sm font-bold transition-all relative overflow-hidden ${
                    quantidadeDesejada === qtd 
                    ? 'bg-[#22c55e] text-black shadow-[0_0_10px_rgba(34,197,94,0.3)]' 
                    : 'bg-[#18181b] border border-[#27272a] text-white hover:border-zinc-500'
                  }`}
                >
                  +{qtd.toString().padStart(2, '0')}
                  
                  {roletaAtiva && qtd >= roletaCotas && quantidadeDesejada !== qtd && (
                    <div className="absolute -top-1 -right-4 bg-purple-600 text-white text-[8px] font-black px-4 py-1 rotate-45">
                      GIRO
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="flex gap-2 items-stretch h-14">
              <div className="flex items-center justify-between bg-[#18181b] border border-[#27272a] rounded px-1 w-1/3 shrink-0">
                <button onClick={() => setQuantidadeDesejada(prev => Math.max(1, prev - 1))} className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-[#22c55e] text-xl font-bold transition-colors">-</button>
                <span className="text-white font-bold text-lg">{quantidadeDesejada}</span>
                <button onClick={() => setQuantidadeDesejada(prev => prev + 1)} className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-[#22c55e] text-xl font-bold transition-colors">+</button>
              </div>

              <button onClick={handleParticipar} className="flex-1 bg-[#22c55e] hover:bg-green-500 text-black font-bold rounded px-4 flex items-center justify-center gap-1 transition-colors shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                <span>Participar</span>
                <span className="bg-black/10 px-2 py-1 rounded text-sm ml-auto">R$ {valorTotal.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
              </button>
            </div>
          </div>
        )}

        {/* ETAPA 2 (Telefone) */}
        {etapa === 2 && (
          <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-6 animate-in fade-in slide-in-from-right-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <span className="bg-[#22c55e] text-black w-6 h-6 rounded-full flex items-center justify-center text-sm">2</span> Seu telefone
              </h2>
              <button onClick={() => setEtapa(1)} className="text-sm text-zinc-400 hover:text-white underline">Voltar</button>
            </div>
            <div className="bg-[#09090b] border border-[#27272a] p-4 rounded-lg mb-6 flex justify-between items-center">
              <div><p className="text-xs text-zinc-400 uppercase font-bold tracking-wider mb-1">Títulos selecionados</p><p className="text-lg font-bold">{quantidadeDesejada} títulos</p></div>
              <div className="text-right"><p className="text-xs text-zinc-400 uppercase font-bold tracking-wider mb-1">Total a pagar</p><p className="text-lg font-bold text-[#22c55e]">R$ {valorTotal.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p></div>
            </div>
            <label className="block text-sm text-zinc-400 mb-2 font-medium">Número do WhatsApp</label>
            <input type="tel" value={telefone} onChange={(e) => setTelefone(e.target.value)} placeholder="(00) 90000-0000" className="w-full bg-[#09090b] border border-[#27272a] rounded-lg p-4 mb-6 focus:border-[#22c55e] outline-none text-white text-lg font-medium" />
            <button onClick={handleContinuarTelefone} className="w-full bg-[#22c55e] hover:bg-green-600 text-black font-black py-4 rounded-xl text-lg transition-colors">Continuar</button>
          </div>
        )}

        {/* ETAPA 3 (Dados) */}
        {etapa === 3 && (
          <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-6 animate-in fade-in slide-in-from-right-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <span className="bg-[#22c55e] text-black w-6 h-6 rounded-full flex items-center justify-center text-sm">3</span> Seus dados
              </h2>
              <button onClick={() => setEtapa(2)} className="text-sm text-zinc-400 hover:text-white underline">Voltar</button>
            </div>
            <div className="space-y-4 mb-6">
              <div><label className="block text-sm text-zinc-400 mb-1 font-medium">Nome completo</label><input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: João da Silva" className="w-full bg-[#09090b] border border-[#27272a] rounded-lg p-4 focus:border-[#22c55e] outline-none text-white font-medium" /></div>
              <div><label className="block text-sm text-zinc-400 mb-1 font-medium">E-mail (Opcional)</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="joao@email.com" className="w-full bg-[#09090b] border border-[#27272a] rounded-lg p-4 focus:border-[#22c55e] outline-none text-white font-medium" /></div>
            </div>
            <button onClick={handleFinalizar} className="w-full bg-[#22c55e] hover:bg-green-600 text-black font-black py-4 rounded-xl text-lg transition-colors shadow-[0_0_15px_rgba(34,197,94,0.3)]">Concluir e Pagar</button>
          </div>
        )}

        {/* ETAPA 4: SUCESSO / PAGAMENTO PIX */}
        {etapa === 4 && (
          <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-8 text-center animate-in zoom-in-95 relative overflow-hidden">
            
            <div className="w-20 h-20 bg-[#22c55e]/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-[#22c55e]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <h2 className="text-2xl font-black text-white mb-2">Reserva Concluída!</h2>
            <p className="text-zinc-400 mb-6">Efetue o pagamento via PIX para garantir sua participação e gerar seus números da sorte.</p>
            
            {pixPayload ? (
              <>
                <div className="bg-white p-4 rounded-xl inline-block mb-4">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(pixPayload)}`} 
                    alt="QR Code do Pix" 
                    className="w-48 h-48"
                  />
                </div>

                <div className="bg-[#09090b] border border-[#27272a] rounded-xl p-4 mb-4 text-left">
                  <p className="text-zinc-500 text-xs uppercase font-bold mb-2">Pix Copia e Cola</p>
                  <input 
                    type="text" 
                    readOnly 
                    value={pixPayload} 
                    className="w-full bg-[#18181b] text-zinc-300 rounded p-2 text-sm border border-[#27272a] outline-none" 
                  />
                </div>

                <button 
                  onClick={() => { navigator.clipboard.writeText(pixPayload); alert("Código Pix copiado!"); }} 
                  className="w-full bg-[#09090b] border border-[#27272a] hover:border-[#22c55e] text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 mb-4"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
                  Copiar Código PIX
                </button>

                <button 
                  onClick={() => setEtapa(5)} 
                  className="w-full bg-[#22c55e] hover:bg-green-600 text-black font-black py-4 rounded-xl text-lg transition-colors shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                >
                  Já fiz o pagamento
                </button>
              </>
            ) : (
              <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-xl mb-6">
                <p className="text-amber-400 text-sm font-medium">
                  Atenção: O criador desta rifa ainda não configurou uma chave Pix.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ETAPA 5: AGRADECIMENTO, NÚMEROS REAIS E ANÁLISE */}
        {etapa === 5 && (
          <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-6 text-center animate-in slide-in-from-right-8">
            <div className="w-16 h-16 bg-[#22c55e]/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[#22c55e]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
            </div>
            
            <h2 className="text-2xl font-black text-white mb-2">Muito obrigado, {nome}! 🎉</h2>
            <p className="text-zinc-400 text-sm mb-6">
              Sua reserva foi registrada. Estes são os seus números oficiais reservados no sistema:
            </p>
            
            {/* EXIBIÇÃO DOS NÚMEROS REAIS DO BANCO */}
            <div className="bg-[#09090b] border border-[#27272a] rounded-xl p-4 mb-6">
              <p className="text-xs uppercase tracking-wider text-zinc-500 font-bold mb-3">Seus Bilhetes Oficiais</p>
              <div className="flex flex-wrap gap-2 justify-center max-h-40 overflow-y-auto p-1">
                {numerosSorte.map((num, idx) => (
                  <span key={idx} className="bg-[#22c55e]/10 border border-[#22c55e]/40 text-[#22c55e] font-mono font-bold px-3 py-1.5 rounded-lg text-sm shadow-sm">
                    {num}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/30 p-3 rounded-xl mb-6 text-left">
              <p className="text-yellow-400 text-xs font-medium text-center">
                ⚠️ Transação manual: O administrador confirmará o pagamento e validará seus títulos.
              </p>
            </div>

            {/* 🚀 CORREÇÃO DO WHATSAPP AQUI */}
            <button 
              onClick={() => window.open(`https://wa.me/${MEU_WHATSAPP}?text=Olá! Acabei de pagar a reserva da rifa ${campanha.nome}. Meu nome é ${nome} e meus números são: ${numerosSorte.join(', ')}. Segue meu comprovante!`, '_blank')} 
              className="w-full bg-[#25D366] hover:bg-green-600 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 mb-3 shadow-[0_0_15px_rgba(37,211,102,0.2)]"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
              Enviar Comprovante no WhatsApp
            </button>
            
            <button 
              onClick={() => navigate('/')} 
              className="w-full bg-[#09090b] border border-[#27272a] hover:border-zinc-500 text-white font-bold py-3 rounded-xl transition-colors"
            >
              Voltar ao Início
            </button>
          </div>
        )}

      </div>
      
      {mostrarRoleta && (
         <div className="fixed inset-0 bg-black/95 flex flex-col items-center justify-center p-4 z-[100] animate-in zoom-in-95">
           <div className="text-center max-w-md w-full">
             <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-2">
               {ganhouRoleta ? 'ROLETA PREMIADA' : 'CAIXA MISTERIOSA'}
             </h2>
             <p className="text-zinc-400 mb-10">Aguardando confirmação do pagamento...</p>
             
             <div className="w-64 h-64 mx-auto bg-gradient-to-br from-purple-900 to-indigo-900 rounded-full border-4 border-purple-500 shadow-[0_0_50px_rgba(168,85,247,0.4)] flex items-center justify-center relative overflow-hidden mb-10 animate-pulse">
               <div className="text-6xl">{ganhouRoleta ? '🎡' : '🎁'}</div>
               {ganhouRoleta && (
                 <>
                   <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-purple-500/30"></div>
                   <div className="absolute left-0 right-0 top-1/2 h-1 bg-purple-500/30"></div>
                   <div className="absolute w-4 h-4 bg-white rounded-full top-2 left-1/2 -ml-2 shadow-lg"></div>
                 </>
               )}
             </div>

             <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-4 mb-6">
               <p className="text-sm text-zinc-300">
                 ⚠️ <strong className="text-white">Atenção:</strong> A recompensa será liberada automaticamente assim que o pagamento for aprovado.
               </p>
             </div>

             <button 
               onClick={() => setMostrarRoleta(false)}
               className="text-zinc-500 hover:text-white font-bold underline"
             >
               Voltar e aguardar
             </button>
           </div>
         </div>
       )}
    </div>
  );
}