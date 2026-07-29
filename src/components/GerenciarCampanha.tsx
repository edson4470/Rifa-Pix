import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../supabase'; 

export function GerenciarCampanha() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [mostrarValor, setMostrarValor] = useState(true);
  const [modalAtivo, setModalAtivo] = useState<string | null>(null);
  
  const [vendasView, setVendasView] = useState<'lista' | 'relatorio'>('lista');
  const [mostrarFiltros, setMostrarFiltros] = useState(false);

  const [tipoBusca, setTipoBusca] = useState('Nome'); 
  const [termoBusca, setTermoBusca] = useState('');   
  const [filtroOrdem, setFiltroOrdem] = useState('recentes'); 
  const [filtroStatus, setFiltroStatus] = useState<string[]>([]); 

  const [numeroSorteado, setNumeroSorteado] = useState('');
  const [ganhador, setGanhador] = useState<any>(null);
  const [buscouGanhador, setBuscouGanhador] = useState(false);

  const [vendas, setVendas] = useState<any[]>([]); 

  // ================= ESTADOS DA GAMIFICAÇÃO =================
  const [salvandoGamificacao, setSalvandoGamificacao] = useState(false);
  
  const [roletaConfig, setRoletaConfig] = useState({ 
    ativa: false, 
    cotas: '', 
    premios: '' 
  });
  
  const [caixaConfig, setCaixaConfig] = useState({ 
    ativa: false, 
    cotas: '', 
    premio: '' 
  });

  // ================= ESTADOS DA CAMPANHA (NOVO) =================
  // Transformado em state para podermos atualizar o status visualmente na hora
  const [dadosCampanha, setDadosCampanha] = useState(location.state || {
    id: null, 
    nome: "Nenhuma campanha encontrada",
    status: "Pendente",
    fotoUrl: null, 
    totalCotas: 0,
    cotasVendidas: 0,
    valorPorCotaEmReais: 0
  });

  const [publicando, setPublicando] = useState(false);

  useEffect(() => {
    async function buscarVendasNoBanco() {
      try {
        const { data, error } = await supabase
          .from('vendas')
          .select('*')
          .order('created_at', { ascending: false }); 

        if (error) throw error;

        if (data) {
          const vendasFormatadas = data.map(venda => ({
            ...venda,
            data: venda.created_at 
          }));
          setVendas(vendasFormatadas);
        }
      } catch (erro: any) {
        console.error("Erro ao buscar vendas no Supabase:", erro.message);
      }
    }

    async function buscarConfiguracoes() {
      if (dadosCampanha.id) {
        const { data } = await supabase.from('campanhas').select('*').eq('id', dadosCampanha.id).single();
        if (data) {
          setRoletaConfig({ ativa: data.roleta_ativa || false, cotas: data.roleta_cotas_necessarias?.toString() || '', premios: data.roleta_premios || '' });
          setCaixaConfig({ ativa: data.caixa_ativa || false, cotas: data.caixa_cotas_necessarias?.toString() || '', premio: data.caixa_premio || '' });
        }
      }
    }

    buscarVendasNoBanco();
    buscarConfiguracoes();
  }, [dadosCampanha.id]); 

  // ================= LÓGICA PARA SALVAR GAMIFICAÇÃO =================
  const handleSalvarGamificacao = async (tipo: 'roleta' | 'caixa') => {
    if (!dadosCampanha.id) {
      alert("Aviso: ID da campanha não encontrado. Salve a campanha primeiro.");
      return;
    }

    setSalvandoGamificacao(true);
    try {
      const updates = tipo === 'roleta'
        ? { 
            roleta_ativa: roletaConfig.ativa, 
            roleta_cotas_necessarias: Number(roletaConfig.cotas) || 0, 
            roleta_premios: roletaConfig.premios 
          }
        : { 
            caixa_ativa: caixaConfig.ativa, 
            caixa_cotas_necessarias: Number(caixaConfig.cotas) || 0, 
            caixa_premio: caixaConfig.premio 
          };

      const { error } = await supabase
        .from('campanhas')
        .update(updates)
        .eq('id', dadosCampanha.id);

      if (error) throw error;
      alert(`Configurações da ${tipo === 'roleta' ? 'Roleta' : 'Caixa Misteriosa'} salvas com sucesso!`);
      fecharModal();
    } catch (error: any) {
      console.error(error);
      alert("Erro ao salvar: " + error.message);
    } finally {
      setSalvandoGamificacao(false);
    }
  };

  const vendasFiltradas = vendas.filter(venda => {
    if (filtroStatus.length > 0 && !filtroStatus.includes(venda.status)) {
      return false;
    }

    if (termoBusca.trim() !== '') {
      const termo = termoBusca.toLowerCase();
      if (tipoBusca === 'Nome' && venda.nome && !venda.nome.toLowerCase().includes(termo)) return false;
      if (tipoBusca === 'Telefone' && venda.telefone && !venda.telefone.includes(termo)) return false;
      if (tipoBusca === 'Cota' && venda.cota && !venda.cota.includes(termo)) return false;
    }
    return true;
  }).sort((a, b) => {
    const dataA = new Date(a.data).getTime();
    const dataB = new Date(b.data).getTime();
    return filtroOrdem === 'recentes' ? dataB - dataA : dataA - dataB;
  });

  const toggleStatus = (status: string) => {
    setFiltroStatus(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status) 
        : [...prev, status] 
    );
  };

  const fecharModal = () => {
    setModalAtivo(null);
    setVendasView('lista');
    setMostrarFiltros(false);
    setNumeroSorteado('');
    setGanhador(null);
    setBuscouGanhador(false);
  };

  const handleBuscarGanhador = () => {
    setBuscouGanhador(true);
    const pessoa = vendas.find(v => v.cota === numeroSorteado && v.status === 'aprovada');
    setGanhador(pessoa || null);
  };

  const porcentagemVendida = dadosCampanha.totalCotas > 0 
    ? (dadosCampanha.cotasVendidas / dadosCampanha.totalCotas) * 100 
    : 0;
  const valorArrecadado = dadosCampanha.cotasVendidas * dadosCampanha.valorPorCotaEmReais;

  // ================= NOVAS FUNÇÕES: VISUALIZAR E PUBLICAR =================
  const handleVisualizar = () => {
    if (!dadosCampanha.id) {
      alert("Erro: Não há campanha selecionada para visualização.");
      return;
    }
    const nomeFormatado = dadosCampanha.nome.replace(/\s+/g, '-').toLowerCase();
    const urlPublica = `/comprar/${nomeFormatado}`; 
    window.open(urlPublica, '_blank');
  };

  // 🚀 AQUI FOI FEITA A ALTERAÇÃO: Agora envia para a tela de Checkout da Publicação e bloqueia o clique duplo
  const handlePublicar = () => {
    if (!dadosCampanha.id) {
      alert("Aviso: ID da campanha não encontrado.");
      return;
    }

    if (dadosCampanha.status === 'Ativa' || dadosCampanha.status === 'Publicado' || dadosCampanha.status === 'Em Análise') {
      return; // Já está ativa ou em análise, não faz nada
    }

    // Redireciona para a tela de pagamento passando os dados da campanha atual
    navigate('/checkout-publicacao', { state: dadosCampanha });
  };

  const handleCompartilhar = () => {
    const nomeFormatado = dadosCampanha.nome.replace(/\s+/g, '-').toLowerCase();
    const linkDeVenda = `https://rifapix.com.br/comprar/${nomeFormatado}`;
    navigator.clipboard.writeText(linkDeVenda);
    alert(`✅ Link copiado com sucesso!\n\nAgora é só colar no seu WhatsApp ou Instagram:\n${linkDeVenda}`);
  };

  const handleEditar = () => {
    navigate('/');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 text-white animate-in fade-in duration-500">
      
      {/* CABEÇALHO */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <svg className="w-7 h-7 text-[#22c55e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          Gerenciar campanha
        </h1>
        <button onClick={() => navigate('/')} className="border border-[#27272a] bg-[#09090b] px-4 py-2 rounded flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
          Voltar
        </button>
      </div>

      {/* ÍCONES DE AÇÃO RÁPIDA */}
      <div className="flex gap-2 mb-6">
        <button onClick={handleVisualizar} className="p-2 border border-[#27272a] bg-[#18181b] rounded hover:border-[#22c55e] hover:text-[#22c55e] transition-colors text-zinc-400" title="Visualizar como Cliente">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
        </button>
        <button onClick={handleCompartilhar} className="p-2 border border-[#27272a] bg-[#18181b] rounded hover:border-[#22c55e] hover:text-[#22c55e] transition-colors text-zinc-400" title="Copiar Link de Compartilhamento">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
        </button>
        <button onClick={handleEditar} className="p-2 border border-[#27272a] bg-[#18181b] rounded hover:border-[#22c55e] hover:text-[#22c55e] transition-colors text-zinc-400" title="Editar Campanha">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
        </button>
      </div>

      {/* PAINEL PRINCIPAL DO CARD */}
      <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-6 md:p-8 shadow-xl">

        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <div className="w-full md:w-40 h-32 bg-[#09090b] border border-[#27272a] rounded-lg flex items-center justify-center shrink-0 overflow-hidden relative group">
            {dadosCampanha.fotoUrl ? (
              <img src={dadosCampanha.fotoUrl} alt="Capa da Campanha" className="w-full h-full object-contain" />
            ) : (
              <svg className="w-10 h-10 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            )}
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">{dadosCampanha.nome}</h2>
              <span className={`text-xs font-bold px-3 py-1 rounded border ${
                dadosCampanha.status === 'Ativa' 
                ? 'text-green-400 bg-green-400/10 border-green-400/20' 
                : dadosCampanha.status === 'Em Análise' 
                ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
                : 'text-orange-400 bg-orange-400/10 border-orange-400/20'
              }`}>
                {dadosCampanha.status}
              </span>
            </div>

            <div className="mb-2">
              <div className="w-full h-2 bg-[#27272a] rounded-full overflow-hidden">
                <div className="h-full bg-[#22c55e] transition-all duration-1000 ease-out" style={{ width: `${porcentagemVendida}%` }}></div>
              </div>
            </div>
            
            <div className="flex justify-between text-xs text-zinc-400 mb-6">
              <span>{porcentagemVendida.toFixed(2)} % vendido</span>
              <span>{dadosCampanha.cotasVendidas} de {dadosCampanha.totalCotas}</span>
            </div>

            <div className="flex justify-between items-center border-t border-[#27272a] pt-4">
              <span className="text-sm text-zinc-400">Valor arrecadado</span>
              <div className="flex items-center gap-3">
                <span className="text-[#22c55e] font-bold text-lg">
                  {mostrarValor ? `R$ ${valorArrecadado.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'R$ •••••'}
                </span>
                <button onClick={() => setMostrarValor(!mostrarValor)} className="text-zinc-500 hover:text-white transition-colors">
                  {mostrarValor ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18M15.122 15.122a3 3 0 01-4.243-4.243M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path></svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <button onClick={() => setModalAtivo('vendas')} className="border border-[#27272a] bg-[#09090b] py-3 px-2 rounded text-sm font-medium text-zinc-300 hover:border-[#22c55e] hover:bg-[#22c55e]/5 transition-all flex items-center justify-center gap-2">
            <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            Minhas vendas
          </button>
          <button onClick={() => setModalAtivo('premiado')} className="border border-[#27272a] bg-[#09090b] py-3 px-2 rounded text-sm font-medium text-zinc-300 hover:border-[#22c55e] hover:bg-[#22c55e]/5 transition-all flex items-center justify-center gap-2">
            <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path></svg>
            Título premiado
          </button>
          <button onClick={() => setModalAtivo('ranking')} className="border border-[#27272a] bg-[#09090b] py-3 px-2 rounded text-sm font-medium text-zinc-300 hover:border-[#22c55e] hover:bg-[#22c55e]/5 transition-all flex items-center justify-center gap-2">
            <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
            Ranking
          </button>
          <button onClick={() => setModalAtivo('maiormenor')} className="border border-[#27272a] bg-[#09090b] py-3 px-2 rounded text-sm font-medium text-zinc-300 hover:border-[#22c55e] hover:bg-[#22c55e]/5 transition-all flex items-center justify-center gap-2">
            <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path></svg>
            Maior e Menor título
          </button>
          
          <button onClick={() => setModalAtivo('caixa')} className="border border-[#27272a] bg-[#09090b] py-3 px-2 rounded text-sm font-medium text-zinc-300 hover:border-[#22c55e] hover:bg-[#22c55e]/5 transition-all flex items-center justify-center gap-2 col-span-2 md:col-span-1">
            <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"></path></svg>
            Caixa Premiada
          </button>
          <button onClick={() => setModalAtivo('roleta')} className="border border-[#27272a] bg-[#09090b] py-3 px-2 rounded text-sm font-medium text-zinc-300 hover:border-[#22c55e] hover:bg-[#22c55e]/5 transition-all flex items-center justify-center gap-2 col-span-2 md:col-span-1">
            <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path></svg>
            Roleta Premiada
          </button>
          <button className="border border-[#27272a] bg-[#09090b]/50 py-3 px-2 rounded text-sm font-medium text-zinc-600 cursor-not-allowed flex items-center justify-center gap-2 col-span-2">
            <svg className="w-5 h-5 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
            Realizar sorteio
          </button>
        </div>

        {dadosCampanha.status !== 'Ativa' && (
          <div className="flex items-center gap-2 mb-8 text-sm">
            <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <p className="text-zinc-400">Publique essa ação em até <strong className="text-white">72h</strong> ou ela vai expirar</p>
          </div>
        )}

        {/* ===================== BOTÕES ATUALIZADOS AQUI ===================== */}
        <div className="flex flex-col md:flex-row gap-4">
          <button onClick={handleVisualizar} className="flex-1 border border-[#27272a] bg-[#09090b] hover:bg-[#27272a] text-white font-bold py-4 rounded transition-colors flex items-center justify-center gap-2 group">
            <svg className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
            Visualizar demonstração
          </button>
          
          <button 
            onClick={handlePublicar}
            disabled={publicando || dadosCampanha.status === 'Ativa' || dadosCampanha.status === 'Em Análise'}
            className={`flex-1 font-bold py-4 rounded transition-colors flex items-center justify-center gap-2
              ${(dadosCampanha.status === 'Ativa' || dadosCampanha.status === 'Em Análise') 
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-[#27272a]' 
                : 'bg-[#22c55e] hover:bg-green-600 text-black shadow-[0_0_15px_rgba(34,197,94,0.3)] hover:shadow-[0_0_25px_rgba(34,197,94,0.5)]'
              }`}
          >
            {publicando ? (
               <span>Publicando...</span> 
            ) : dadosCampanha.status === 'Ativa' ? (
               <>
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                 Campanha Publicada
               </>
            ) : dadosCampanha.status === 'Em Análise' ? (
               <>
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                 Em Análise (Aguardando Pix)
               </>
            ) : (
               <>
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                 Publicar campanha
               </>
            )}
          </button>
        </div>
      </div>

      {/* ===================== ÁREA DE MODAIS (INTACTA) ===================== */}

      {/* MODAL: MINHAS VENDAS */}
      {modalAtivo === 'vendas' && (
        <div className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center p-4 md:p-10 z-[60] animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-[#18181b] w-full max-w-5xl h-[90vh] rounded-xl border border-[#27272a] shadow-2xl flex flex-col relative overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-[#27272a] shrink-0">
              <button onClick={() => vendasView === 'relatorio' ? setVendasView('lista') : fecharModal()} className="p-2 hover:bg-[#27272a] rounded transition-colors">
                <svg className="w-6 h-6 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
              </button>
              <h2 className="text-xl font-bold text-white">{vendasView === 'lista' ? 'Minhas vendas' : 'Relatório da campanha'}</h2>
              <div className="w-10"></div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-[#09090b]">
              {vendasView === 'lista' && (
                <div className="max-w-3xl mx-auto space-y-6">
                  <div className="flex flex-col md:flex-row gap-3">
                    <div className="flex-1 flex bg-[#18181b] border border-[#27272a] rounded overflow-hidden">
                      <select value={tipoBusca} onChange={(e) => setTipoBusca(e.target.value)} className="bg-transparent text-zinc-400 px-4 py-3 border-r border-[#27272a] outline-none text-sm cursor-pointer hover:bg-[#27272a] transition-colors">
                        <option value="Nome">Nome</option>
                        <option value="Telefone">Telefone</option>
                        <option value="Cota">Cota</option>
                      </select>
                      <input type="text" value={termoBusca} onChange={(e) => setTermoBusca(e.target.value)} placeholder="Buscar" className="flex-1 bg-transparent px-4 outline-none text-white text-sm" />
                      <button className="px-4 text-zinc-400 hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                      </button>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => setMostrarFiltros(true)} className="flex items-center gap-2 px-6 py-3 bg-[#18181b] border border-[#27272a] text-zinc-300 rounded hover:border-[#22c55e] hover:text-[#22c55e] transition-colors font-medium">
                        Filtro
                        <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                      </button>
                      <button onClick={() => setVendasView('relatorio')} className="flex items-center gap-2 px-6 py-3 bg-[#18181b] border border-[#27272a] text-zinc-300 rounded hover:border-[#22c55e] hover:text-[#22c55e] transition-colors font-medium">
                        Relatório
                        <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path></svg>
                      </button>
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-white mt-8">Resultados ({vendasFiltradas.length})</h3>

                  {vendasFiltradas.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <svg className="w-24 h-24 text-zinc-600 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1"><path strokeLinecap="round" strokeLinejoin="round" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z"></path></svg>
                      <h4 className="text-xl font-bold text-white mb-2">Não há histórico de vendas</h4>
                      <p className="text-zinc-400">Faça uma venda ou reserva para começar a contabilizar as transações :D</p>
                    </div>
                  ) : (
                    <div className="space-y-3 mt-6">
                      {vendasFiltradas.map((venda) => (
                        <div key={venda.id} className="bg-[#18181b] border border-[#27272a] p-4 rounded-lg flex justify-between items-center hover:border-zinc-500 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded bg-zinc-800 flex items-center justify-center text-zinc-400 font-bold border border-[#27272a]">{venda.nome?.charAt(0) || '?'}</div>
                            <div>
                              <p className="font-bold text-white">{venda.nome}</p>
                              <p className="text-xs text-zinc-400 mt-1">{venda.telefone} • <strong className="text-orange-400">Cota: {venda.cota}</strong></p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-[#22c55e] font-bold mb-1">R$ {Number(venda.valor).toFixed(2)}</p>
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded bg-zinc-800 text-zinc-300">{venda.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {vendasView === 'relatorio' && (
                <div className="max-w-2xl mx-auto space-y-4">
                  <div className="bg-[#18181b] border border-blue-500/50 rounded-lg p-5 flex items-center gap-6 shadow-sm">
                    <div className="w-16 h-16 rounded bg-blue-500/10 flex items-center justify-center shrink-0"><svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg></div>
                    <div><p className="text-zinc-400 text-sm mb-1">Visitas no site</p><p className="text-2xl font-bold text-white">0</p></div>
                  </div>
                  <div className="bg-[#18181b] border border-orange-400/50 rounded-lg p-5 flex items-center gap-6 shadow-sm">
                    <div className="w-16 h-16 rounded bg-orange-400/10 flex items-center justify-center shrink-0"><svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg></div>
                    <div className="flex-1"><p className="text-zinc-400 text-sm mb-2">Participantes únicos</p><div className="flex gap-4"><p className="text-sm font-medium flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#22c55e]"></span> 0 Efetuou o pagamento</p><p className="text-sm font-medium flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> 0 Reservou e não pagou</p></div></div>
                  </div>
                  <div className="bg-[#18181b] border border-[#22c55e]/50 rounded-lg p-5 flex items-center gap-6 shadow-sm">
                    <div className="w-16 h-16 rounded bg-[#22c55e]/10 flex items-center justify-center shrink-0"><svg className="w-8 h-8 text-[#22c55e]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div>
                    <div><p className="text-zinc-400 text-sm mb-1">Vendas realizadas</p><p className="text-xs text-zinc-500 mb-1">Pedidos</p><p className="text-2xl font-bold text-white">R$ 0,00</p></div>
                  </div>
                  <button className="w-full mt-6 bg-[#18181b] border border-[#27272a] text-white font-bold py-4 rounded hover:border-[#22c55e] transition-colors">Baixar relatório</button>
                </div>
              )}
            </div>
          </div>

          {/* OVERLAY DE FILTROS */}
          {mostrarFiltros && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-[70] backdrop-blur-sm p-4">
              <div className="bg-[#18181b] w-full max-w-md rounded-xl border border-[#27272a] shadow-2xl p-6 relative animate-in zoom-in-95 duration-150">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-white">Filtros</h3>
                  <button onClick={() => setMostrarFiltros(false)} className="text-orange-400 hover:text-white transition-colors"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg></button>
                </div>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-bold text-white mb-3">Ordenar por:</h4>
                    <label className="flex items-center gap-3 mb-2 cursor-pointer group" onClick={() => setFiltroOrdem('recentes')}>
                      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${filtroOrdem === 'recentes' ? 'border-[#22c55e] bg-[#22c55e]' : 'border-[#27272a] bg-[#09090b] group-hover:border-[#22c55e]'}`}>{filtroOrdem === 'recentes' && <svg className="w-3.5 h-3.5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}</div>
                      <span className={`transition-colors ${filtroOrdem === 'recentes' ? 'text-white' : 'text-zinc-400 group-hover:text-white'}`}>Mais recentes</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group" onClick={() => setFiltroOrdem('antigos')}>
                      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${filtroOrdem === 'antigos' ? 'border-[#22c55e] bg-[#22c55e]' : 'border-[#27272a] bg-[#09090b] group-hover:border-[#22c55e]'}`}>{filtroOrdem === 'antigos' && <svg className="w-3.5 h-3.5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}</div>
                      <span className={`transition-colors ${filtroOrdem === 'antigos' ? 'text-white' : 'text-zinc-400 group-hover:text-white'}`}>Mais antigo</span>
                    </label>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white mb-3">Tipo de transação:</h4>
                    {[
                      { id: 'aprovada', label: 'Compra aprovada' },
                      { id: 'reservado', label: 'Reservado' },
                      { id: 'reservou_nao_pagou', label: 'Reservou mais não pagou' },
                      { id: 'cancelada', label: 'Compra cancelada' },
                      { id: 'pendente', label: 'Pendente aprovação' },
                    ].map(status => {
                      const isChecked = filtroStatus.includes(status.id);
                      return (
                        <label key={status.id} className="flex items-center gap-3 mb-2 cursor-pointer group" onClick={() => toggleStatus(status.id)}>
                          <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isChecked ? 'border-[#22c55e] bg-[#22c55e]' : 'border-[#27272a] bg-[#09090b] group-hover:border-[#22c55e]'}`}>{isChecked && <svg className="w-3.5 h-3.5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}</div>
                          <span className={`transition-colors ${isChecked ? 'text-white' : 'text-zinc-400 group-hover:text-white'}`}>{status.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
                <div className="flex gap-4 mt-8">
                  <button onClick={() => setMostrarFiltros(false)} className="flex-1 py-3 bg-transparent border border-[#27272a] text-white rounded font-bold hover:bg-[#27272a] transition-colors">Voltar</button>
                  <button onClick={() => setMostrarFiltros(false)} className="flex-1 py-3 bg-[#22c55e] hover:bg-green-600 text-black rounded font-bold transition-colors">Confirmar</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODAL: TÍTULO PREMIADO */}
      {modalAtivo === 'premiado' && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[60]">
          <div className="bg-[#18181b] p-6 rounded-xl w-full max-w-md border border-[#27272a] shadow-2xl relative">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Buscar Título Premiado</h3>
              <button onClick={fecharModal} className="text-zinc-400 hover:text-white bg-[#09090b] px-3 py-1 rounded border border-[#27272a]">X</button>
            </div>
            <p className="text-sm text-zinc-400 mb-4">Digite o número sorteado na Loteria para ver quem foi o ganhador desta campanha.</p>
            <input type="text" value={numeroSorteado} onChange={(e) => setNumeroSorteado(e.target.value)} placeholder="Ex: 045" className="w-full bg-[#09090b] border border-[#27272a] rounded p-3 mb-4 focus:border-[#22c55e] outline-none text-white text-center text-xl tracking-widest" />
            <button onClick={handleBuscarGanhador} className="w-full bg-[#22c55e] text-black font-bold py-3 rounded hover:bg-green-600 transition-colors">Verificar Ganhador</button>
            {buscouGanhador && (
              <div className="mt-4 p-4 border rounded-lg bg-[#09090b] border-[#27272a]">
                {ganhador ? (
                  <div className="text-center animate-in zoom-in-95">
                    <p className="text-xs text-[#22c55e] font-bold uppercase tracking-wider mb-2">Ganhador Encontrado!</p>
                    <p className="text-xl font-bold text-white">{ganhador.nome}</p>
                    <p className="text-zinc-400 mt-1">{ganhador.telefone}</p>
                  </div>
                ) : (
                  <div className="text-center animate-in zoom-in-95">
                    <p className="text-orange-400 font-bold mb-1">Cota não encontrada</p>
                    <p className="text-sm text-zinc-400">Ninguém comprou este número ou o pagamento não foi aprovado.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: RANKING */}
      {modalAtivo === 'ranking' && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[60]">
          <div className="bg-[#18181b] p-6 rounded-xl w-full max-w-sm border border-[#27272a] shadow-2xl relative">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Top Compradores</h3>
              <button onClick={fecharModal} className="text-zinc-400 hover:text-white bg-[#09090b] px-3 py-1 rounded border border-[#27272a]">X</button>
            </div>
            <div className="space-y-3">
              {vendas.length === 0 ? (
                <p className="text-zinc-400 text-sm text-center py-6">Nenhum comprador registrado ainda.</p>
              ) : (
                <p className="text-zinc-400 text-sm text-center py-6">Lista será gerada automaticamente.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: MAIOR E MENOR TÍTULO */}
      {modalAtivo === 'maiormenor' && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[60]">
          <div className="bg-[#18181b] p-6 rounded-xl w-full max-w-sm border border-[#27272a] shadow-2xl relative">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Extremos da Rifa</h3>
              <button onClick={fecharModal} className="text-zinc-400 hover:text-white bg-[#09090b] px-3 py-1 rounded border border-[#27272a]">X</button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#09090b] border border-[#27272a] p-4 rounded text-center">
                <p className="text-xs text-zinc-400 mb-1">Maior Título</p>
                <p className="text-2xl font-black text-[#22c55e]">-</p>
                <p className="text-xs font-bold mt-2 text-zinc-600">-</p>
              </div>
              <div className="bg-[#09090b] border border-[#27272a] p-4 rounded text-center">
                <p className="text-xs text-zinc-400 mb-1">Menor Título</p>
                <p className="text-2xl font-black text-red-500">-</p>
                <p className="text-xs font-bold mt-2 text-zinc-600">-</p>
              </div>
            </div>
            {vendas.length === 0 && (
              <p className="text-xs text-zinc-500 text-center mt-4">Aguardando a primeira compra.</p>
            )}
          </div>
        </div>
      )}

      {/* ===================== NOVOS MODAIS: CONFIGURADORES DE GAMIFICAÇÃO ===================== */}

      {/* MODAL: CAIXA PREMIADA (CONFIGURADOR) */}
      {modalAtivo === 'caixa' && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[60] animate-in fade-in">
          <div className="bg-[#18181b] p-6 rounded-xl w-full max-w-md border border-[#27272a] shadow-2xl relative">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <svg className="w-6 h-6 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"></path></svg>
                Configurar Caixa
              </h3>
              <button onClick={fecharModal} className="text-zinc-400 hover:text-white bg-[#09090b] px-3 py-1 rounded border border-[#27272a]">X</button>
            </div>
            
            <p className="text-sm text-zinc-400 mb-6">Defina uma regra para o cliente ganhar uma caixa surpresa ao comprar números.</p>
            
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={caixaConfig.ativa}
                  onChange={(e) => setCaixaConfig({...caixaConfig, ativa: e.target.checked})}
                  className="w-5 h-5 accent-[#22c55e] cursor-pointer"
                />
                <span className="text-white font-medium">Ativar Caixa Misteriosa</span>
              </label>

              {caixaConfig.ativa && (
                <div className="space-y-4 animate-in slide-in-from-top-2">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">Comprando acima de quantas cotas?</label>
                    <input 
                      type="number" 
                      value={caixaConfig.cotas}
                      onChange={(e) => setCaixaConfig({...caixaConfig, cotas: e.target.value})}
                      placeholder="Ex: 50" 
                      className="w-full bg-[#09090b] border border-[#27272a] rounded p-3 focus:border-[#22c55e] outline-none text-white" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">Qual o prêmio dentro da caixa?</label>
                    <input 
                      type="text" 
                      value={caixaConfig.premio}
                      onChange={(e) => setCaixaConfig({...caixaConfig, premio: e.target.value})}
                      placeholder="Ex: R$ 100 no Pix" 
                      className="w-full bg-[#09090b] border border-[#27272a] rounded p-3 focus:border-[#22c55e] outline-none text-white" 
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 flex gap-3">
              <button onClick={fecharModal} className="flex-1 border border-[#27272a] text-zinc-300 py-3 rounded hover:bg-[#09090b] transition-colors">Cancelar</button>
              <button 
                onClick={() => handleSalvarGamificacao('caixa')} 
                disabled={salvandoGamificacao}
                className="flex-1 bg-[#22c55e] text-black font-bold py-3 rounded hover:bg-green-600 transition-colors disabled:opacity-50"
              >
                {salvandoGamificacao ? 'Salvando...' : 'Salvar Regra'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ROLETA PREMIADA (CONFIGURADOR) */}
      {modalAtivo === 'roleta' && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[60] animate-in fade-in">
          <div className="bg-[#18181b] p-6 rounded-xl w-full max-w-md border border-[#27272a] shadow-2xl relative">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <svg className="w-6 h-6 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path></svg>
                Configurar Roleta
              </h3>
              <button onClick={fecharModal} className="text-zinc-400 hover:text-white bg-[#09090b] px-3 py-1 rounded border border-[#27272a]">X</button>
            </div>
            
            <p className="text-sm text-zinc-400 mb-6">Ofereça giros na roleta para incentivar a compra de mais números.</p>
            
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={roletaConfig.ativa}
                  onChange={(e) => setRoletaConfig({...roletaConfig, ativa: e.target.checked})}
                  className="w-5 h-5 accent-[#22c55e] cursor-pointer"
                />
                <span className="text-white font-medium">Ativar Roleta Premiada</span>
              </label>

              {roletaConfig.ativa && (
                <div className="space-y-4 animate-in slide-in-from-top-2">
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">A cada X cotas, ganha 1 giro:</label>
                    <input 
                      type="number" 
                      value={roletaConfig.cotas}
                      onChange={(e) => setRoletaConfig({...roletaConfig, cotas: e.target.value})}
                      placeholder="Ex: 10" 
                      className="w-full bg-[#09090b] border border-[#27272a] rounded p-3 focus:border-[#22c55e] outline-none text-white" 
                    />
                    <p className="text-[10px] text-zinc-500 mt-1">Se colocar 10, quem comprar 20 cotas ganha 2 giros.</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-zinc-400 mb-1">Lista de Prêmios (Separados por vírgula):</label>
                    <input 
                      type="text" 
                      value={roletaConfig.premios}
                      onChange={(e) => setRoletaConfig({...roletaConfig, premios: e.target.value})}
                      placeholder="Ex: R$ 50, 2 Cotas, Tente Novamente" 
                      className="w-full bg-[#09090b] border border-[#27272a] rounded p-3 focus:border-[#22c55e] outline-none text-white" 
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 flex gap-3">
              <button onClick={fecharModal} className="flex-1 border border-[#27272a] text-zinc-300 py-3 rounded hover:bg-[#09090b] transition-colors">Cancelar</button>
              <button 
                onClick={() => handleSalvarGamificacao('roleta')} 
                disabled={salvandoGamificacao}
                className="flex-1 bg-[#22c55e] text-black font-bold py-3 rounded hover:bg-green-600 transition-colors disabled:opacity-50"
              >
                {salvandoGamificacao ? 'Salvando...' : 'Salvar Regra'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}