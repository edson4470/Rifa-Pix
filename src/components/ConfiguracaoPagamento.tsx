import { useState } from 'react';
import { supabase } from '../supabase'; // Garantindo a conexão

export function ConfiguracaoPagamento() {
  const [metodoSelecionado, setMetodoSelecionado] = useState<string | null>(null);
  
  // Estados para capturar os dados do Pix
  const [chavePix, setChavePix] = useState('');
  const [nomeTitular, setNomeTitular] = useState('');
  const [loading, setLoading] = useState(false);

  // Função para salvar no Supabase (Corrigida para usar upsert)
  const handleSalvarPix = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não logado");

      // Usando upsert para garantir que crie ou atualize o registro
      const { error } = await supabase
        .from('profiles')
        .upsert({ 
          id: user.id, // O ID é essencial para o upsert saber qual linha tratar
          pix_key: chavePix, 
          pix_titular: nomeTitular 
        });

      if (error) throw error;
      alert("Chave Pix salva com sucesso!");
    } catch (error: any) {
      console.error(error);
      alert("Erro ao salvar chave Pix: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Meios de Pagamento</h2>
        <p className="text-zinc-400">Escolha como você deseja receber o dinheiro das suas campanhas.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        
        {/* CARD: Mercado Pago (Baixa Automática) */}
        <div 
          onClick={() => setMetodoSelecionado('mercadopago')}
          className={`cursor-pointer p-6 rounded-2xl border-2 transition-all duration-300 relative overflow-hidden ${
            metodoSelecionado === 'mercadopago' 
              ? 'border-[#22c55e] bg-[#22c55e]/5' 
              : 'border-[#27272a] bg-[#18181b] hover:border-zinc-500'
          }`}
        >
          {/* Badge de Recomendado */}
          <div className="absolute top-4 right-4 bg-[#22c55e] text-black text-xs font-bold px-2 py-1 rounded">
            RECOMENDADO
          </div>

          {/* 🚀 LOGO MERCADO PAGO AQUI */}
          <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mb-4 p-2 shadow-md">
            <img 
              src="/mercadopago.png" 
              alt="Logo Mercado Pago" 
              className="w-full h-full object-contain"
            />
          </div>
          
          <h3 className="text-xl font-bold text-white mb-2">Mercado Pago</h3>
          <p className="text-zinc-400 text-sm mb-4">
            Meio de pagamento com <strong className="text-[#22c55e]">baixa automática</strong>. O sistema libera os números na hora e o dinheiro cai na sua conta do Mercado Pago.
          </p>
          
          {metodoSelecionado === 'mercadopago' && (
            <div className="mt-6 pt-6 border-t border-[#27272a] space-y-4 animate-fade-in">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Access Token de Produção</label>
                <input 
                  type="password" 
                  placeholder="APP_USR-123456789..." 
                  className="w-full bg-[#09090b] border border-[#27272a] rounded-lg p-3 text-white outline-none focus:border-[#22c55e]"
                />
              </div>
              <button className="w-full bg-[#22c55e] text-black font-bold py-3 rounded-lg hover:bg-green-600 transition-colors">
                Conectar Mercado Pago
              </button>
            </div>
          )}
        </div>

        {/* CARD: Pix Manual */}
        <div 
          onClick={() => setMetodoSelecionado('manual')}
          className={`cursor-pointer p-6 rounded-2xl border-2 transition-all duration-300 ${
            metodoSelecionado === 'manual' 
              ? 'border-[#22c55e] bg-[#22c55e]/5' 
              : 'border-[#27272a] bg-[#18181b] hover:border-zinc-500'
          }`}
        >
          {/* 🚀 LOGO PIX AQUI */}
          <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mb-4 p-2 shadow-md">
            <img 
              src="/pix.png" 
              alt="Logo Pix" 
              className="w-full h-full object-contain"
            />
          </div>
          
          <h3 className="text-xl font-bold text-white mb-2">Pix Manual</h3>
          <p className="text-zinc-400 text-sm mb-4">
            Você terá que <strong className="text-amber-500">aprovar as compras de forma manual</strong>. O dinheiro cai direto na sua conta bancária sem taxas.
          </p>

          {metodoSelecionado === 'manual' && (
            <div className="mt-6 pt-6 border-t border-[#27272a] space-y-4 animate-fade-in">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">Sua Chave Pix (CPF, Celular, E-mail)</label>
                <input 
                  type="text" 
                  value={chavePix}
                  onChange={(e) => setChavePix(e.target.value)}
                  placeholder="Digite sua chave Pix" 
                  className="w-full bg-[#09090b] border border-[#27272a] rounded-lg p-3 text-white outline-none focus:border-[#22c55e] mb-3"
                />
                <label className="block text-sm font-medium text-zinc-400 mb-1">Nome do Titular da Conta</label>
                <input 
                  type="text" 
                  value={nomeTitular}
                  onChange={(e) => setNomeTitular(e.target.value)}
                  placeholder="Ex: João da Silva" 
                  className="w-full bg-[#09090b] border border-[#27272a] rounded-lg p-3 text-white outline-none focus:border-[#22c55e]"
                />
              </div>
              <button 
                onClick={handleSalvarPix}
                disabled={loading}
                className="w-full border border-[#22c55e] text-[#22c55e] font-bold py-3 rounded-lg hover:bg-[#22c55e] hover:text-black transition-colors"
              >
                {loading ? "Salvando..." : "Salvar Chave Pix"}
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}