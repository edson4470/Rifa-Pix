import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

export function PaginaCompra() {
  const { slug } = useParams();
  const navigate = useNavigate();

  // Estados
  const [campanha, setCampanha] = useState<any>(null);
  const [carregando, setCarregando] = useState(true);
  
  // Etapas
  const [etapa, setEtapa] = useState(1); 
  const [quantidadeDesejada, setQuantidadeDesejada] = useState(1);
  const [telefone, setTelefone] = useState('');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');

  // Estado para mostrar o visual da Roleta/Caixa na tela final
  const [mostrarRoleta, setMostrarRoleta] = useState(false);

  useEffect(() => {
    async function buscarCampanha() {
      try {
        const nomeFormatado = slug?.replace(/-/g, ' ');
        
        const { data, error } = await supabase
          .from('campanhas')
          .select('*')
          .ilike('nome', `%${nomeFormatado}%`)
          .order('created_at', { ascending: false })
          .limit(1);

        if (error) throw error;
        
        if (data && data.length > 0) {
          setCampanha(data[0]);
        } else {
          setCampanha(null);
        }
      } catch (error) {
        console.error("Erro ao buscar campanha:", error);
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

  const valorDaCota = Number(campanha.valorPorCotaEmReais || campanha.valor_por_cota_em_reais || campanha.valor_por_cota || campanha.valor || 0);
  const imagemDaCota = campanha.fotoUrl || campanha.foto_url || campanha.imagem || campanha.imagem_url || null;
  const valorTotal = quantidadeDesejada * valorDaCota;

  // Variáveis da Gamificação
  const roletaAtiva = campanha.roleta_ativa;
  const roletaCotas = campanha.roleta_cotas_necessarias || 0;
  const caixaAtiva = campanha.caixa_ativa;
  const caixaCotas = campanha.caixa_cotas_necessarias || 0;

  // Calcula se o cliente ganhou o benefício
  const ganhouRoleta = roletaAtiva && quantidadeDesejada >= roletaCotas;
  const ganhouCaixa = caixaAtiva && quantidadeDesejada >= caixaCotas;

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
      const { error } = await supabase.from('vendas').insert([
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
      if (error) throw error;
      setEtapa(4); 
    } catch (error: any) {
      alert("Erro ao registrar reserva: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-white pb-20 font-sans relative">
      
      {/* BANNER DEMONSTRAÇÃO */}
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

      {/* IMAGEM DA CAMPANHA */}
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
        
        {/* DADOS DA CAMPANHA */}
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
            
            {/* 🚀 AVISO DE GAMIFICAÇÃO (ROLETA/CAIXA) */}
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
                  
                  {/* Etiqueta visual se o botão atingir a meta da roleta */}
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
            <p className="text-zinc-400 mb-8">Efetue o pagamento via PIX para garantir sua participação e gerar seus números da sorte.</p>
            
            <div className="bg-white p-4 rounded-xl inline-block mb-6">
              <div className="w-48 h-48 bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-500 text-sm text-center rounded-lg">
                [ QR Code do PIX aqui ]<br/>Integração Mercado Pago
              </div>
            </div>

            <button onClick={() => alert("Código Pix copiado!")} className="w-full bg-[#09090b] border border-[#27272a] hover:border-[#22c55e] text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2 mb-8">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
              Copiar Código PIX
            </button>

            {/* 🚀 BOTÃO DA ROLETA/CAIXA (Só aparece se ele comprou a quantia certa) */}
            {(ganhouRoleta || ganhouCaixa) && (
              <div className="border-t border-[#27272a] pt-8 animate-in slide-in-from-bottom-4">
                <div className="bg-purple-900/30 border border-purple-500/50 rounded-xl p-6">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {ganhouRoleta ? '🎡 Você ganhou giros!' : '🎁 Você ganhou a Caixa!'}
                  </h3>
                  <p className="text-sm text-zinc-300 mb-6">
                    Assim que seu pagamento for confirmado, você poderá abrir sua recompensa.
                  </p>
                  <button 
                    onClick={() => setMostrarRoleta(true)}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black py-4 rounded-xl shadow-[0_0_20px_rgba(147,51,234,0.4)] transition-all transform hover:scale-105"
                  >
                    Ver Recompensa
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* =========================================================================
          🚀 MODAL VISUAL DA ROLETA / CAIXA MISTERIOSA
          ========================================================================= */}
      {mostrarRoleta && (
        <div className="fixed inset-0 bg-black/95 flex flex-col items-center justify-center p-4 z-[100] animate-in zoom-in-95">
          <div className="text-center max-w-md w-full">
            <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-2">
              {ganhouRoleta ? 'ROLETA PREMIADA' : 'CAIXA MISTERIOSA'}
            </h2>
            <p className="text-zinc-400 mb-10">Aguardando confirmação do pagamento...</p>
            
            {/* Visual Simulado da Roleta/Caixa */}
            <div className="w-64 h-64 mx-auto bg-gradient-to-br from-purple-900 to-indigo-900 rounded-full border-4 border-purple-500 shadow-[0_0_50px_rgba(168,85,247,0.4)] flex items-center justify-center relative overflow-hidden mb-10 animate-pulse">
              <div className="text-6xl">{ganhouRoleta ? '🎡' : '🎁'}</div>
              {/* Detalhes da roleta */}
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
                ⚠️ <strong className="text-white">Atenção:</strong> A roleta será liberada automaticamente nesta mesma tela assim que o Mercado Pago confirmar o seu Pix.
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