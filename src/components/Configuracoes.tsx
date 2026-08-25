import { useNavigate } from 'react-router-dom';

export function Configuracoes() {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto p-6 text-white animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <svg className="w-7 h-7 text-[#22c55e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          Configurações do Sistema
        </h1>
        <button onClick={() => navigate(-1)} className="border border-[#27272a] bg-[#09090b] px-4 py-2 rounded flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
          Voltar
        </button>
      </div>

      <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-10 text-center shadow-xl">
        <div className="w-20 h-20 bg-[#09090b] rounded-full flex items-center justify-center mx-auto mb-6 border border-[#27272a]">
          <svg className="w-10 h-10 text-[#22c55e]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Painel de Configurações</h2>
        <p className="text-zinc-400 max-w-md mx-auto">
          Esta área está sendo preparada. Em breve você poderá ajustar as taxas globais, cores, domínios e outras opções avançadas do sistema por aqui.
        </p>
      </div>
    </div>
  );
}