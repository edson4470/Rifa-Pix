import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

export function PaginaCompra() {
  const { slug } = useParams();
  const navigate = useNavigate();

  // Estados
  const [campanha, setCampanha] = useState<any>(null);
  const [carregando, setCarregando] = useState(true);
  
  // Etapas: 1 (Cotas), 2 (Telefone), 3 (Dados), 4 (Sucesso)
  const [etapa, setEtapa] = useState(1); 
  const [quantidadeDesejada, setQuantidadeDesejada] = useState(1); // Começa com 1 cota selecionada
  const [telefone, setTelefone] = useState('');
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');

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

  // =========================================================================
  // 🚀 BUSCA INTELIGENTE DE DADOS (Resolve o problema do R$ 0,00 e Foto)
  // Tenta pegar o valor em vários formatos possíveis que o Supabase pode ter salvo
  // =========================================================================
  const valorDaCota = Number(
    campanha.valorPorCotaEmReais || 
    campanha.valor_por_cota_em_reais || 
    campanha.valor_por_cota || 
    campanha.valor || 
    0
  );
  
  const imagemDaCota = 
    campanha.fotoUrl || 
    campanha.foto_url || 
    campanha.imagem || 
    campanha.imagem_url || 
    null;

  // Cálculo do total: Multiplica a quantidade selecionada pelo valor real da cota
  const valorTotal = quantidadeDesejada * valorDaCota;

  // Funções de Navegação
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
    <div className="min-h-screen bg-[#09090b] text-white pb-20 font-sans">
      
      {/* 1. IMAGEM DA CAMPANHA (Igual ao Rifa 123) */}
      <div className="w-full bg-[#18181b] border-b border-[#27272a]">
        <div className="max-w-md mx-auto relative bg-white">
          {imagemDaCota ? (
            <img src={imagemDaCota} alt={campanha.nome} className="w-full h-auto object-contain md:rounded-b-2xl shadow-xl max-h-80" />
          ) : (
            <div className="w-full h-64 bg-[#18181b] flex flex-col items-center justify-center md:rounded-b-2xl border-b border-[#27272a]">
              <span className="text-zinc-500 font-medium">Sem imagem da campanha</span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 mt-2">
        
        {/* 2. DADOS DA CAMPANHA (Layout adaptado da Rifa 123) */}
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

        {/* ETAPA 1: ESCOLHER NÚMEROS/QUANTIDADE */}
        {etapa === 1 && (
          <div className="animate-in fade-in">
            <h2 className="text-md font-bold text-white mb-4 flex items-center gap-2">
              <span className="bg-[#22c55e] text-black w-5 h-5 rounded-full flex items-center justify-center text-xs">1</span>
              Escolha a quantidade
            </h2>
            
            {/* Botões de quantidade inspirados na Rifa 123 (Em formato de Grid) */}
            <div className="grid grid-cols-3 gap-2 mb-6">
              {[1, 5, 10, 20, 100, 250].map((qtd) => (
                <button 
                  key={qtd}
                  onClick={() => setQuantidadeDesejada(qtd)}
                  className={`py-3 rounded text-sm font-bold transition-all ${
                    quantidadeDesejada === qtd 
                    ? 'bg-[#22c55e] text-black shadow-[0_0_10px_rgba(34,197,94,0.3)]' 
                    : 'bg-[#18181b] border border-[#27272a] text-white hover:border-zinc-500'
                  }`}
                >
                  +{qtd.toString().padStart(2, '0')}
                </button>
              ))}
            </div>

            {/* BARRA INFERIOR: Controle [- 1 +] e Botão de Participar */}
            <div className="flex gap-2 items-stretch h-14">
              
              {/* Controle Menos e Mais */}
              <div className="flex items-center justify-between bg-[#18181b] border border-[#27272a] rounded px-1 w-1/3 shrink-0">
                <button 
                  onClick={() => setQuantidadeDesejada(prev => Math.max(1, prev - 1))} 
                  className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-[#22c55e] text-xl font-bold transition-colors"
                >
                  -
                </button>
                <span className="text-white font-bold text-lg">{quantidadeDesejada}</span>
                <button 
                  onClick={() => setQuantidadeDesejada(prev => prev + 1)} 
                  className="w-8 h-8 flex items-center justify-center text-zinc-400 hover:text-[#22c55e] text-xl font-bold transition-colors"
                >
                  +
                </button>
              </div>

              {/* Botão Participar dinâmico */}
              <button 
                onClick={handleParticipar}
                className="flex-1 bg-[#22c55e] hover:bg-green-500 text-black font-bold rounded px-4 flex items-center justify-center gap-1 transition-colors shadow-[0_0_15px_rgba(34,197,94,0.3)]"
              >
                <span>Participar</span>
                <span className="bg-black/10 px-2 py-1 rounded text-sm ml-auto">
                  R$ {valorTotal.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* ETAPA 2: IDENTIFICAÇÃO (TELEFONE) */}
        {etapa === 2 && (
          <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-6 animate-in fade-in slide-in-from-right-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <span className="bg-[#22c55e] text-black w-6 h-6 rounded-full flex items-center justify-center text-sm">2</span>
                Seu telefone
              </h2>
              <button onClick={() => setEtapa(1)} className="text-sm text-zinc-400 hover:text-white underline">Voltar</button>
            </div>
            
            <div className="bg-[#09090b] border border-[#27272a] p-4 rounded-lg mb-6 flex justify-between items-center">
              <div>
                <p className="text-xs text-zinc-400 uppercase font-bold tracking-wider mb-1">Títulos selecionados</p>
                <p className="text-lg font-bold">{quantidadeDesejada} títulos</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-zinc-400 uppercase font-bold tracking-wider mb-1">Total a pagar</p>
                <p className="text-lg font-bold text-[#22c55e]">R$ {valorTotal.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</p>
              </div>
            </div>
            
            <label className="block text-sm text-zinc-400 mb-2 font-medium">Número do WhatsApp</label>
            <input 
              type="tel" 
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              placeholder="(00) 90000-0000" 
              className="w-full bg-[#09090b] border border-[#27272a] rounded-lg p-4 mb-6 focus:border-[#22c55e] outline-none text-white text-lg font-medium"
            />
            
            <button 
              onClick={handleContinuarTelefone}
              className="w-full bg-[#22c55e] hover:bg-green-600 text-black font-black py-4 rounded-xl text-lg transition-colors"
            >
              Continuar
            </button>
          </div>
        )}

        {/* ETAPA 3: FINALIZAR CADASTRO */}
        {etapa === 3 && (
          <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-6 animate-in fade-in slide-in-from-right-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <span className="bg-[#22c55e] text-black w-6 h-6 rounded-full flex items-center justify-center text-sm">3</span>
                Seus dados
              </h2>
              <button onClick={() => setEtapa(2)} className="text-sm text-zinc-400 hover:text-white underline">Voltar</button>
            </div>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm text-zinc-400 mb-1 font-medium">Nome completo</label>
                <input 
                  type="text" 
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: João da Silva" 
                  className="w-full bg-[#09090b] border border-[#27272a] rounded-lg p-4 focus:border-[#22c55e] outline-none text-white font-medium"
                />
              </div>
              <div>
                <label className="block text-sm text-zinc-400 mb-1 font-medium">E-mail (Opcional)</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="joao@email.com" 
                  className="w-full bg-[#09090b] border border-[#27272a] rounded-lg p-4 focus:border-[#22c55e] outline-none text-white font-medium"
                />
              </div>
            </div>
            
            <button 
              onClick={handleFinalizar}
              className="w-full bg-[#22c55e] hover:bg-green-600 text-black font-black py-4 rounded-xl text-lg transition-colors shadow-[0_0_15px_rgba(34,197,94,0.3)]"
            >
              Concluir e Pagar
            </button>
          </div>
        )}

        {/* ETAPA 4: SUCESSO / PAGAMENTO PIX */}
        {etapa === 4 && (
          <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-8 text-center animate-in zoom-in-95">
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

            <button 
              onClick={() => alert("Código Pix copiado!")}
              className="w-full bg-[#09090b] border border-[#27272a] hover:border-[#22c55e] text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path></svg>
              Copiar Código PIX
            </button>
          </div>
        )}

      </div>
    </div>
  );
}