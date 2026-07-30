// src/components/Sidebar.tsx
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../supabase';

export function Sidebar() {
  const [isAdmin, setIsAdmin] = useState(false);

  // 👑 AQUI FICA A CHAVE MESTRA: Coloque o SEU e-mail de administrador aqui!
  const EMAIL_ADMIN = "edson.importirlanda@gmail.com"; 

  useEffect(() => {
    // Função que verifica quem é o usuário logado neste momento
    async function verificarAdmin() {
      const { data: { session } } = await supabase.auth.getSession();
      
      // Se tiver alguém logado e o e-mail for igual ao seu, ele libera o botão
      if (session?.user?.email === EMAIL_ADMIN) {
        setIsAdmin(true);
      }
    }
    verificarAdmin();
  }, []);

  return (
    <div className="w-64 min-h-screen bg-[#09090b] border-r border-[#27272a] p-6 flex flex-col text-white">
      {/* Marca */}
      <div className="mb-10 text-center">
        <h1 className="text-2xl font-bold text-[#22c55e]">RIFA PIX</h1>
      </div>

      {/* Botão Principal */}
      <Link 
        to="/criar-campanha" 
        className="w-full block bg-[#22c55e] hover:bg-green-600 text-black font-bold py-3 px-4 rounded-lg mb-8 transition-colors text-center"
      >
        Criar Campanha
      </Link>

      {/* Menu */}
      <nav className="flex-1 space-y-4">
        <Link to="/" className="block text-zinc-400 hover:text-[#22c55e] transition-colors">Inicio</Link>
        <Link to="/minhas-campanhas" className="block text-zinc-400 hover:text-[#22c55e] transition-colors">Minhas Campanhas</Link>
        
        {/* 🚀 O Botão de Aprovações agora é VIP! Só aparece se for você (Admin) */}
        {isAdmin && (
          <Link to="/aprovacoes" className="block text-orange-400 font-bold hover:text-orange-300 transition-colors">
            👑 Aprovações
          </Link>
        )}
        
        <Link to="/apoiadores" className="block text-zinc-400 hover:text-[#22c55e] transition-colors">Apoiadores</Link>
        <Link to="/configuracao-pagamento" className="block text-zinc-400 hover:text-[#22c55e] transition-colors">Pagamentos</Link>
        <Link to="/configuracoes" className="block text-zinc-400 hover:text-[#22c55e] transition-colors">Configurações</Link>
        <Link to="/suporte" className="block text-zinc-400 hover:text-[#22c55e] transition-colors">Suporte</Link>
      </nav>

      {/* Footer */}
      <div className="mt-auto border-t border-[#27272a] pt-6">
        <button 
          onClick={async () => await supabase.auth.signOut()} 
          className="text-zinc-400 hover:text-red-500 transition-colors"
        >
          Sair
        </button>
      </div>
    </div>
  );
}