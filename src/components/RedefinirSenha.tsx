import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';

export function RedefinirSenha() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Garante que o Supabase reconheça o token assim que a página carregar
  useEffect(() => {
    supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        // Usuário está no modo de recuperação
      }
    });
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: password
    });

    if (error) {
      alert("Erro ao trocar senha: " + error.message);
    } else {
      alert("Senha alterada com sucesso!");
      navigate('/login'); 
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-4">
      <div className="bg-[#18181b] p-8 rounded-3xl w-full max-w-sm border border-[#27272a] shadow-2xl">
        <h2 className="text-xl font-bold text-white mb-6 text-center">Definir nova senha</h2>
        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <input
            type="password"
            placeholder="Digite sua nova senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#09090b] border border-[#27272a] rounded-lg p-3 text-white outline-none focus:border-[#22c55e]"
            required
          />
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#22c55e] text-black font-bold py-3 rounded-lg hover:bg-green-600 transition-colors"
          >
            {loading ? 'Salvando...' : 'Salvar nova senha'}
          </button>
        </form>
      </div>
    </div>
  );
}