import { useNavigate } from 'react-router-dom';

export function MinhasCampanhas() {
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
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

      {/* 2. BANNER DE PAGAMENTO (Clicável - Manda pra tela que criamos antes!) */}
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
      <div className="pt-6 border-t border-[#27272a] flex items-center gap-3">
        <svg className="w-8 h-8 text-[#22c55e]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"></path></svg>
        <h2 className="text-2xl font-bold text-white">Minhas Campanhas</h2>
      </div>

      {/* 4. ESTADO VAZIO (Quando não tem rifa criada) */}
      <div className="mt-8 flex flex-col items-center justify-center p-16 bg-[#18181b] border-2 border-[#27272a] border-dashed rounded-2xl text-center">
        
        {/* Ícone de prancheta vazia */}
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

    </div>
  );
}