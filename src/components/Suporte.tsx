import { useNavigate } from 'react-router-dom';

export function Suporte() {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto p-6 text-white animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <svg className="w-7 h-7 text-[#22c55e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"></path>
          </svg>
          Central de Suporte
        </h1>
        <button onClick={() => navigate(-1)} className="border border-[#27272a] bg-[#09090b] px-4 py-2 rounded flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
          Voltar
        </button>
      </div>

      <div className="bg-[#18181b] border border-[#27272a] rounded-xl p-10 text-center shadow-xl">
        <div className="w-20 h-20 bg-[#09090b] rounded-full flex items-center justify-center mx-auto mb-6 border border-[#27272a]">
          <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.368 15.024L17 13.657V12a5 5 0 10-10 0v1.657l-1.368 1.367a1 1 0 00-.293.707V18a1 1 0 001 1h14a1 1 0 001-1v-2.268a1 1 0 00-.293-.707zM12 21a2 2 0 100-4 2 2 0 000 4z"></path></svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Precisa de Ajuda?</h2>
        <p className="text-zinc-400 max-w-md mx-auto mb-8">
          Em breve você terá acesso a tutoriais, perguntas frequentes e um canal direto com os administradores.
        </p>

        <button className="bg-[#22c55e] hover:bg-green-600 text-black font-bold py-3 px-8 rounded-lg transition-colors shadow-[0_0_15px_rgba(34,197,94,0.3)]">
          Falar no WhatsApp
        </button>
      </div>
    </div>
  );
}